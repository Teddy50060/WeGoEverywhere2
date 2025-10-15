// dto/notification-user-with-template.dto.ts
import { IntersectionType } from '@nestjs/mapped-types';
import { NotificationUserDto } from './notification-users.dto';
import { NotificationTemplateDto } from './notification-templates.dto';

export class NotificationUserWithTemplateDto extends IntersectionType(
  NotificationUserDto,
  NotificationTemplateDto,
) {}
