import { Injectable, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

/**
 * §7.3: every request gets an id, which is logged and returned on failures.
 * It is what a user quotes in a bug report.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomUUID()
    ;(req as RequestWithId).requestId = requestId
    res.setHeader('x-request-id', requestId)
    next()
  }
}

export type RequestWithId = Request & { requestId?: string }
