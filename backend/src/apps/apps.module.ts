import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { AppsController } from './apps.controller'
import { AppsService } from './apps.service'
import { AppsRepository } from './apps.repository'

@Module({
  imports: [CommonModule],
  controllers: [AppsController],
  providers: [AppsService, AppsRepository],
})
export class AppsModule {}
