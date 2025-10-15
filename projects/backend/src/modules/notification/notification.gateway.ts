import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { NotificationUser } from '@backend/src/database/schema/notification_users.schema';
import { NotificationUserWithTemplate } from './notification.repository';
import { NotificationUserWithTemplateDto } from './dto/notification-users-templates.dto';
import { plainToInstance } from 'class-transformer';

@WebSocketGateway({
  cors: {
    origin: process.env.APP_FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    credentials: true,
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private notificationService: NotificationService) {}

  // Client connect → ดึง notification ที่ยัง unread
  async handleConnection(client: Socket) {
      // 1️⃣ ดูค่าที่ client ส่งมา
    console.log('Client connected:', client.id);
    // console.log('Handshake query:', client.handshake.query);

    const userIdRaw = client.handshake.query.userId;
    const userId = Number(userIdRaw);

    // 2️⃣ ตรวจสอบ NaN
    if (isNaN(userId)) {
      console.warn('Socket connected without valid userId:', userIdRaw);
      client.emit('error', 'Invalid userId');
      return;
    }

    console.log('Parsed userId:', userId);

    // 3️⃣ เรียก service
    this.notificationService.getUnread(userId)
      .then((notifs) => {
        const result = plainToInstance(NotificationUserWithTemplateDto, notifs);
        client.emit('initial_notifications', result);
      })
      .catch((err) => {
        console.error('Failed to fetch unread notifications:', err);
        client.emit('error', 'Failed to fetch notifications');
      });
  }

  // Client ส่งว่าอ่านแล้ว
  @SubscribeMessage('mark_read')
  async markRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { notificationUserId: number }
  ) {
    // console.log("received mark_read", payload);
    await this.notificationService.markAsRead(payload.notificationUserId);
    client.emit('notification_updated', { notificationId: payload.notificationUserId, read: true });
  }

  // Server สร้าง notification → push ไป user เฉพาะ
  async pushNotificationToUser(
    userId: number,
    templateData: { title: string; fromService: string; message: string }
  ) {
    // 1. สร้าง template + assign ให้ user
    const template = await this.notificationService.createTemplate(
      templateData.title,
      templateData.fromService,
      templateData.message
    );

    const userNotif = await this.notificationService.assignNotificationToUser(userId, template.id);

    // 2. ส่ง notification ผ่าน socket
    const sockets = Array.from(this.server.sockets.sockets.values()).filter(
      (s) => s.handshake.query.userId === String(userId),
    );

    sockets.forEach((s) => s.emit('new_notification', userNotif));
  }

  // Optional: Broadcast notification ให้หลาย user
  async broadcastNotification(
    templateData: { title: string; fromService: string; message: string },
    userIds: number[]
  ) {
    const { template, userNotifications } = await this.notificationService.broadcastNotification(templateData, userIds);

    userNotifications.forEach((notif) => {
      const sockets = Array.from(this.server.sockets.sockets.values()).filter(
        (s) => s.handshake.query.userId === String(notif.userId),
      );

      sockets.forEach((s) => s.emit('new_notification', notif));
    });
  }
}
