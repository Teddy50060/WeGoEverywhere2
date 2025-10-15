import { ApiProperty } from '@nestjs/swagger';

export class NotificationsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ default: false })
  read: boolean;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  fromService?: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
