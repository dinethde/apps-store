import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/all-exceptions.filter'
import { validationExceptionFactory } from './common/validation-exception'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // §7.1: the API is served under /api/v1. /health is liveness and sits
  // outside the version, so a probe never has to track it.
  app.setGlobalPrefix('api/v1', { exclude: ['health'] })

  // TODO(auth): remove once the webapp BFF proxies the API same-origin
  // (architecture §2.3). Until then the browser calls this service directly.
  app.enableCors({
    origin: process.env.WEBAPP_ORIGIN ?? 'http://localhost:3000',
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: validationExceptionFactory,
    }),
  )
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(process.env.PORT ?? 4000)
}

void bootstrap()
