import { Controller, Get } from '@nestjs/common';
import { ApiStatus } from './interfaces/apiStatus';
import { SystemTimezone } from './interfaces/systemTimezone';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Health Logs')
@Controller('health')
export class HealthController {
  @Get()
  getStatus(): ApiStatus {
    return {
      status: 'pass',
      notes: [
        'Currently this endpoints is useful only to know if the API is running.',
      ],
      description: 'API to provide products in XML for Linx',
    };
  }

  @Get('/time')
  getSystemTimezone(): SystemTimezone {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      time: new Date().toISOString(),
    };
  }
}
