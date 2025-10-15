import { NotificationTemplateDto } from "@backend/src/modules/notification/dto/notification-templates.dto";
import { NotificationUserWithTemplateDto } from "@backend/src/modules/notification/dto/notification-users-templates.dto";
import { NotificationUserDto } from "@backend/src/modules/notification/dto/notification-users.dto";

export const extraSwaggerModels = [
  NotificationUserDto,
  NotificationTemplateDto,
  NotificationUserWithTemplateDto,
];