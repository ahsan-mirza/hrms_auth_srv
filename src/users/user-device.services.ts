import { Injectable } from '@nestjs/common';
import { UserDevices } from './entities/user.devices.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PaginatedResponse } from './dto/pagination.dto';

@Injectable()
export class UserDevicesService {
  constructor(private readonly httpService: HttpService) {}

  async saveUserDevice(userId: number, requestInfo: any) {
    console.log('🚀 ~ UserDevicesService ~ saveUserDevice ~ userId:', userId);

    const userAgent = requestInfo.headers['user-agent'];
    const ip =
      requestInfo.ip ||
      requestInfo.headers['x-forwarded-for'] ||
      requestInfo.connection.remoteAddress;

    // Get location information
    const geoData = await firstValueFrom(
      this.httpService.get(`http://ip-api.com/json/${ip}`),
    );

    return await UserDevices.create({
      userId,
      ipAddress: ip,
      deviceType: userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop',
      browser: this.getBrowserInfo(userAgent),
      operatingSystem: this.getOSInfo(userAgent),
      country: geoData.data.country,
      city: geoData.data.city,
    });
  }

  async getUserDevices(userId: number) {
    return await UserDevices.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  private getBrowserInfo(userAgent: string): string {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOSInfo(userAgent: string): string {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  async getRecentDevices(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<UserDevices>> {
    const offset = (page - 1) * limit;

    const [devices, total] = await Promise.all([
      UserDevices.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        attributes: [
          'id',
          'deviceType',
          'browser',
          'operatingSystem',
          'country',
          'city',
          'ipAddress',
          'createdAt',
        ],
      }),
      UserDevices.count({ where: { userId } }),
    ]);

    return {
      data: devices,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
    };
  }
}
