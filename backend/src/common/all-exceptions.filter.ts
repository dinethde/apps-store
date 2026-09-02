import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { Response } from 'express'
import type { RequestWithId } from './request-id.middleware'

/**
 * §7.3: one envelope for every failure, including validation. No handler
 * formats its own error — they throw, this shapes the response.
 */
const CODE_BY_STATUS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'VALIDATION_FAILED',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
  [HttpStatus.FORBIDDEN]: 'ROLE_REQUIRED',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception')

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse<Response>()
    const requestId = http.getRequest<RequestWithId>().requestId ?? null

    const error = asHttpException(exception)
    const statusCode: HttpStatus =
      error?.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR
    const body = error?.getResponse() ?? null
    const detail = typeof body === 'object' && body !== null ? body : {}

    const payload = {
      statusCode,
      code: pick(detail, 'code') ?? CODE_BY_STATUS[statusCode] ?? 'INTERNAL',
      message:
        pick(detail, 'message') ??
        (typeof body === 'string' ? body : 'Something went wrong.'),
      details: 'details' in detail ? (detail.details ?? null) : null,
      requestId,
    }

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`${requestId} ${String(exception)}`)
    }

    response.status(statusCode).json(payload)
  }
}

/**
 * Prisma's constraint violations are the failures the database notices first.
 * Translating them here keeps §7.3 true: no handler formats its own error.
 */
function asHttpException(exception: unknown): HttpException | null {
  if (exception instanceof HttpException) return exception
  if (!(exception instanceof Prisma.PrismaClientKnownRequestError)) return null

  switch (exception.code) {
    case 'P2002':
      return new HttpException(
        { code: 'CONFLICT', message: 'That value is already taken.' },
        HttpStatus.CONFLICT,
      )
    case 'P2003':
      return new HttpException(
        {
          code: 'VALIDATION_FAILED',
          message: 'A referenced tag or user group does not exist.',
        },
        HttpStatus.BAD_REQUEST,
      )
    case 'P2025':
      return new HttpException(
        { code: 'NOT_FOUND', message: 'No record with that id.' },
        HttpStatus.NOT_FOUND,
      )
    default:
      return null
  }
}

function pick(source: object, key: 'code' | 'message'): string | null {
  const value = (source as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : null
}
