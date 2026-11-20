import type { Request, Response, NextFunction, RequestHandler } from 'express';

export interface MiddlewareOptions {
  headerName?: string;
  enabled?: boolean;
}

export function arbiterMiddleware(options: MiddlewareOptions = {}): RequestHandler {
  const { headerName = 'X-Arbiter-Header', enabled = true } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!enabled) {
      return next();
    }

    // logic goes here
    res.setHeader(headerName, 'active');

    next();
  };
}

export default arbiterMiddleware;
