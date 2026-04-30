import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Configure appropriately for production
    credentials: true,
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('RealtimeGateway');

  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} attempted connection without token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token);
      client.userId = payload.sub;
      client.userRole = payload.role;

      this.logger.log(`Client connected: ${client.id} (User: ${client.userId})`);

      // Join user to their personal room
      client.join(`user:${client.userId}`);

      // Join role-specific rooms
      if (client.userRole) {
        client.join(`role:${client.userRole}`);
      }

      // Send welcome message
      client.emit('connected', {
        message: 'Successfully connected to real-time updates',
        userId: client.userId,
      });
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
  }

  // ========== AMBULANCE TRACKING ==========

  @SubscribeMessage('ambulance:track')
  handleTrackAmbulance(@MessageBody() data: { ambulance_id: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const room = `ambulance:${data.ambulance_id}`;
    client.join(room);
    this.logger.log(`Client ${client.id} tracking ambulance ${data.ambulance_id}`);
    return { event: 'ambulance:tracking', data: { ambulance_id: data.ambulance_id, status: 'subscribed' } };
  }

  @SubscribeMessage('ambulance:untrack')
  handleUntrackAmbulance(@MessageBody() data: { ambulance_id: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const room = `ambulance:${data.ambulance_id}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} stopped tracking ambulance ${data.ambulance_id}`);
    return { event: 'ambulance:tracking', data: { ambulance_id: data.ambulance_id, status: 'unsubscribed' } };
  }

  // Server-side method to broadcast ambulance location updates
  broadcastAmbulanceLocation(ambulanceId: string, location: { latitude: number; longitude: number; speed?: number; heading?: number }) {
    this.server.to(`ambulance:${ambulanceId}`).emit('ambulance:location:update', {
      ambulance_id: ambulanceId,
      location,
      timestamp: new Date(),
    });
  }

  broadcastAmbulanceStatus(ambulanceId: string, status: string, metadata?: any) {
    this.server.to(`ambulance:${ambulanceId}`).emit('ambulance:status:update', {
      ambulance_id: ambulanceId,
      status,
      metadata,
      timestamp: new Date(),
    });
  }

  // ========== EMERGENCY REQUEST TRACKING ==========

  @SubscribeMessage('emergency:track')
  handleTrackEmergency(@MessageBody() data: { request_id: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const room = `emergency:${data.request_id}`;
    client.join(room);
    this.logger.log(`Client ${client.id} tracking emergency request ${data.request_id}`);
    return { event: 'emergency:tracking', data: { request_id: data.request_id, status: 'subscribed' } };
  }

  @SubscribeMessage('emergency:untrack')
  handleUntrackEmergency(@MessageBody() data: { request_id: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const room = `emergency:${data.request_id}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} stopped tracking emergency request ${data.request_id}`);
    return { event: 'emergency:tracking', data: { request_id: data.request_id, status: 'unsubscribed' } };
  }

  // Server-side method to broadcast emergency request updates
  broadcastEmergencyUpdate(requestId: string, status: string, data?: any) {
    this.server.to(`emergency:${requestId}`).emit('emergency:status:update', {
      request_id: requestId,
      status,
      data,
      timestamp: new Date(),
    });
  }

  broadcastEmergencyAssignment(requestId: string, ambulanceId: string, eta: number) {
    this.server.to(`emergency:${requestId}`).emit('emergency:ambulance:assigned', {
      request_id: requestId,
      ambulance_id: ambulanceId,
      eta_minutes: eta,
      timestamp: new Date(),
    });
  }

  // ========== NOTIFICATIONS ==========

  // Server-side method to send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification:new', {
      ...notification,
      timestamp: new Date(),
    });
  }

  // Server-side method to send notification to role
  sendNotificationToRole(role: string, notification: any) {
    this.server.to(`role:${role}`).emit('notification:new', {
      ...notification,
      timestamp: new Date(),
    });
  }

  // Server-side method to broadcast system-wide notification
  broadcastSystemNotification(notification: any) {
    this.server.emit('notification:system', {
      ...notification,
      timestamp: new Date(),
    });
  }

  // ========== THEATRE/BOOKING UPDATES ==========

  @SubscribeMessage('booking:track')
  handleTrackBooking(@MessageBody() data: { booking_id: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const room = `booking:${data.booking_id}`;
    client.join(room);
    this.logger.log(`Client ${client.id} tracking booking ${data.booking_id}`);
    return { event: 'booking:tracking', data: { booking_id: data.booking_id, status: 'subscribed' } };
  }

  @SubscribeMessage('booking:untrack')
  handleUntrackBooking(@MessageBody() data: { booking_id: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const room = `booking:${data.booking_id}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} stopped tracking booking ${data.booking_id}`);
    return { event: 'booking:tracking', data: { booking_id: data.booking_id, status: 'unsubscribed' } };
  }

  // Server-side method to broadcast booking updates
  broadcastBookingUpdate(bookingId: string, status: string, data?: any) {
    this.server.to(`booking:${bookingId}`).emit('booking:status:update', {
      booking_id: bookingId,
      status,
      data,
      timestamp: new Date(),
    });
  }

  // ========== HOSPITAL/THEATRE AVAILABILITY ==========

  @SubscribeMessage('hospital:track')
  handleTrackHospital(@MessageBody() data: { hospital_id: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const room = `hospital:${data.hospital_id}`;
    client.join(room);
    this.logger.log(`Client ${client.id} tracking hospital ${data.hospital_id}`);
    return { event: 'hospital:tracking', data: { hospital_id: data.hospital_id, status: 'subscribed' } };
  }

  @SubscribeMessage('hospital:untrack')
  handleUntrackHospital(@MessageBody() data: { hospital_id: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const room = `hospital:${data.hospital_id}`;
    client.leave(room);
    return { event: 'hospital:tracking', data: { hospital_id: data.hospital_id, status: 'unsubscribed' } };
  }

  // Server-side method to broadcast hospital updates
  broadcastHospitalUpdate(hospitalId: string, update: any) {
    this.server.to(`hospital:${hospitalId}`).emit('hospital:update', {
      hospital_id: hospitalId,
      update,
      timestamp: new Date(),
    });
  }

  broadcastTheatreAvailability(theatreId: string, status: string, metadata?: any) {
    this.server.emit('theatre:availability:update', {
      theatre_id: theatreId,
      status,
      metadata,
      timestamp: new Date(),
    });
  }

  // ========== HEARTBEAT ==========

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    return { event: 'pong', data: { timestamp: new Date() } };
  }
}
