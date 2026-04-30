import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto, QueryNotificationDto } from './dto/notification.dto';
import { NotificationChannel } from '../common/enums';
import { createPaginatedResponse, parsePaginationParams, getSkipValue } from '../common/utils';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notification = this.notificationRepo.create({
      ...dto,
      channels: dto.channels || [NotificationChannel.IN_APP],
      is_delivered: true, // For in-app, mark as delivered immediately
      delivered_at: new Date(),
    });

    const saved = await this.notificationRepo.save(notification);

    // TODO: Send via other channels (email, SMS, push) based on channels array
    // This would integrate with external services

    return saved;
  }

  async createBulk(notifications: CreateNotificationDto[]) {
    const entities = notifications.map((dto) =>
      this.notificationRepo.create({
        ...dto,
        channels: dto.channels || [NotificationChannel.IN_APP],
        is_delivered: true,
        delivered_at: new Date(),
      }),
    );

    return this.notificationRepo.save(entities);
  }

  async findById(id: string) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async findByUserId(userId: string, query: QueryNotificationDto) {
    const { page, limit } = parsePaginationParams(query.page, query.limit);
    const skip = getSkipValue(page, limit);

    const queryBuilder = this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.user_id = :userId', { userId });

    if (query.unread_only) {
      queryBuilder.andWhere('notification.is_read = :isRead', { isRead: false });
    }

    if (query.type) {
      queryBuilder.andWhere('notification.type = :type', { type: query.type });
    }

    // Exclude expired notifications
    queryBuilder.andWhere(
      '(notification.expires_at IS NULL OR notification.expires_at > :now)',
      { now: new Date() },
    );

    queryBuilder
      .orderBy('notification.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return createPaginatedResponse(data, page, limit, total);
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.findById(id);

    if (notification.user_id !== userId) {
      throw new NotFoundException('Notification not found');
    }

    if (!notification.is_read) {
      await this.notificationRepo.update(id, {
        is_read: true,
        read_at: new Date(),
      });
    }

    return this.findById(id);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.update(
      {
        user_id: userId,
        is_read: false,
      },
      {
        is_read: true,
        read_at: new Date(),
      },
    );

    return { success: true, message: 'All notifications marked as read' };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationRepo.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });

    return { count };
  }

  async delete(id: string, userId: string) {
    const notification = await this.findById(id);

    if (notification.user_id !== userId) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationRepo.delete(id);
    return { success: true, message: 'Notification deleted' };
  }

  async deleteOld(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.notificationRepo.delete({
      created_at: LessThan(cutoffDate),
      is_read: true,
    });

    return {
      success: true,
      deleted: result.affected || 0,
      message: `Deleted ${result.affected} old notifications`,
    };
  }

  // Helper methods for creating specific notification types
  async notifyEmergencyRequest(userId: string, requestId: string, message: string) {
    return this.create({
      user_id: userId,
      type: 'emergency_request' as any,
      title: 'Emergency Request',
      message,
      data: { request_id: requestId },
      channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
      priority: 'urgent' as any,
      action_url: `/emergency-requests/${requestId}`,
    });
  }

  async notifyAmbulanceDispatched(userId: string, ambulanceId: string, eta: number) {
    return this.create({
      user_id: userId,
      type: 'ambulance_dispatched' as any,
      title: 'Ambulance Dispatched',
      message: `An ambulance has been dispatched. ETA: ${eta} minutes`,
      data: { ambulance_id: ambulanceId, eta },
      channels: [NotificationChannel.IN_APP, NotificationChannel.SMS],
      priority: 'high' as any,
    });
  }

  async notifyBookingConfirmed(userId: string, bookingId: string, scheduledTime: Date) {
    return this.create({
      user_id: userId,
      type: 'booking_confirmed' as any,
      title: 'Surgery Booking Confirmed',
      message: `Your surgery has been scheduled for ${scheduledTime.toLocaleString()}`,
      data: { booking_id: bookingId, scheduled_time: scheduledTime },
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      priority: 'medium' as any,
      action_url: `/bookings/${bookingId}`,
    });
  }

  async notifyBookingReminder(userId: string, bookingId: string, hoursUntil: number) {
    return this.create({
      user_id: userId,
      type: 'booking_reminder' as any,
      title: 'Surgery Reminder',
      message: `Your surgery is scheduled in ${hoursUntil} hours`,
      data: { booking_id: bookingId, hours_until: hoursUntil },
      channels: [NotificationChannel.IN_APP, NotificationChannel.SMS],
      priority: 'high' as any,
    });
  }
}
