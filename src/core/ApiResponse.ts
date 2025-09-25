/* eslint-disable prettier/prettier */
import { Response } from 'express';

enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

abstract class BaseApiResponse {
  constructor(
    protected statusCode: ResponseStatus,
    protected status: ResponseStatus,
    protected message: string,
  ) {}

  protected prepare<T extends BaseApiResponse>(res: Response, response: T): Response {
    return res.status(this.status).json(BaseApiResponse.sanitize(response));
  }

  public send(res: Response): Response {
    return this.prepare<BaseApiResponse>(res, this);
  }

  private static sanitize<T extends BaseApiResponse>(response: T): T {
    const clone: T = {} as T;
    Object.assign(clone, response);
    // @ts-ignore
    delete clone.status;
    for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
    return clone;
  }
}

export class AuthFailureResponse extends BaseApiResponse {
  constructor(message = 'Authentication Failure') {
    super(ResponseStatus.UNAUTHORIZED, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class NotFoundResponse extends BaseApiResponse {
  private url: string | undefined;

  constructor(message = 'Not Found') {
    super(ResponseStatus.NOT_FOUND, ResponseStatus.NOT_FOUND, message);
  }

  send(res: Response): Response {
    this.url = res.req?.originalUrl;
    return super.prepare<NotFoundResponse>(res, this);
  }
}

export class ForbiddenResponse extends BaseApiResponse {
  constructor(message = 'Forbidden') {
    super(ResponseStatus.FORBIDDEN, ResponseStatus.FORBIDDEN, message);
  }
}

export class BadRequestResponse extends BaseApiResponse {
  constructor(message = 'Bad Parameters') {
    super(ResponseStatus.BAD_REQUEST, ResponseStatus.BAD_REQUEST, message);
  }
}

export class InternalErrorResponse extends BaseApiResponse {
  constructor(message = 'Internal Error') {
    super(ResponseStatus.INTERNAL_ERROR, ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class SuccessMsgResponse extends BaseApiResponse {
  constructor(message: string) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
  }
}

export class FailureMsgResponse extends BaseApiResponse {
  constructor(message: string) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
  }
}

export class SuccessResponse<T> extends BaseApiResponse {
  constructor(message: string, private data: T) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response): Response {
    return super.prepare<SuccessResponse<T>>(res, this);
  }
}

export class AccessTokenErrorResponse extends BaseApiResponse {
  private instruction = 'refresh_token';

  constructor(message = 'Access token invalid') {
    super(ResponseStatus.UNAUTHORIZED, ResponseStatus.UNAUTHORIZED, message);
  }

  send(res: Response): Response {
    res.setHeader('instruction', this.instruction);
    return super.prepare<AccessTokenErrorResponse>(res, this);
  }
}

export class TokenRefreshResponse extends BaseApiResponse {
  constructor(message: string, private accessToken: string, private refreshToken: string) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response): Response {
    return super.prepare<TokenRefreshResponse>(res, this);
  }
}

export class SuccessResponsePaginate<T> extends BaseApiResponse {
  private docs: T[];
  private meta: [];

  constructor(message: string, docs: T[], meta: any) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
    this.meta = meta;
    this.docs = docs;
  }

  public send(res: Response): Response {
    return super.prepare<SuccessResponsePaginate<T>>(res, this);
  }
}

// Simple ApiResponse class for our new controllers
export class ApiResponse {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): Response {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  static error(res: Response, statusCode: number, message: string): Response {
    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
}
