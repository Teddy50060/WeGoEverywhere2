import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { plainToInstance } from 'class-transformer';
import { NotificationsDto } from './dto/notifications.dto';
import { Notifications } from '@backend/src/database/schema/notifications.schema';

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

  async handleConnection(client: Socket) {
    // console.log('Client connected:', client.id);
    // console.log('Handshake query:', client.handshake.query);

    const userIdRaw = client.handshake.query.userId;
    const userId = Number(userIdRaw);

    if (isNaN(userId)) {
      console.warn('Socket connected without valid userId:', userIdRaw);
      client.emit('error', 'Invalid userId');
      return;
    }

    // console.log('Parsed userId:', userId);

    this.notificationService.getNotifs(userId)
      .then((notifs) => {
        const result = plainToInstance(NotificationsDto, notifs);
        client.emit('initial_notifications', result);
      })
      .catch((err) => {
        console.error('Failed to fetch unread notifications:', err);
        client.emit('error', 'Failed to fetch notifications');
      });
  }

  @SubscribeMessage('mark_read')
  async markRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { notificationId: number }
  ) {
    // console.log("received mark_read", payload);
    await this.notificationService.markAsRead(payload.notificationId);
    client.emit('notification_updated', { notificationId: payload.notificationId, read: true });
  }

  async broadcastNotification(
    userIds: number[],
    templateData: { title: string; fromService: string; message: string },
  ): Promise<void> {
    const userNotifications: Notifications[] =
      await this.notificationService.broadcastNotification(userIds, templateData);

    for (const notif of userNotifications) {
      const sockets: Socket[] = Array.from(this.server.sockets.sockets.values()).filter(
        (s) => s.handshake.query.userId === String(notif.userId),
      );

      sockets.forEach((s) => s.emit('new_notification', notif));
    }
  }
}
