import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/status')
  getStatus(): any {
    return {
      status: 'pass',
      notes: [
        'Currently this endpoints is useful only to know if the API is running.',
      ],
      description: 'API to provide smart-frontend with its data needs.',
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
