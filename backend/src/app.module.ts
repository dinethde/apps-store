import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { HealthController } from './health/health.controller'
import { AppsModule } from './apps/apps.module'
import { TagsModule } from './tags/tags.module'
import { UserGroupsModule } from './user-groups/user-groups.module'
import { RequestIdMiddleware } from './common/request-id.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AppsModule,
    TagsModule,
    UserGroupsModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
  }
}
