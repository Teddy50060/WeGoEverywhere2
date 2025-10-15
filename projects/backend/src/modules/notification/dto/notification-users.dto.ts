import { ApiProperty } from '@nestjs/swagger';

export class NotificationUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  notificationId: number;

  @ApiProperty({ default: false })
  read: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
