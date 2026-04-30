import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID, IsObject, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType, NotificationChannel, NotificationPriority } from '../../common/enums';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User UUID to send notification to' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Ambulance Dispatched' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'An ambulance has been dispatched to your location' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Additional data/metadata' })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @ApiPropertyOptional({ enum: NotificationChannel, isArray: true, default: ['in_app'] })
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  @IsOptional()
  channels?: NotificationChannel[];

  @ApiPropertyOptional({ enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  action_url?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  action_type?: string;
}

export class QueryNotificationDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  unread_only?: boolean;

  @ApiPropertyOptional({ enum: NotificationType })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
