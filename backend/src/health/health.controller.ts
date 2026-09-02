import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class HealthController {
  // §7.2: liveness. No auth, no database read.
  @Get()
  check() {
    return { status: 'ok' }
  }
}
