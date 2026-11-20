import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function arbiterMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.cookies.passedArbiter === "true") {
      return next();
    }

    res.send(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Before you continue</h1>
          <p>Please accept our terms to view <strong>${req.originalUrl}</strong>.</p>
          <button onclick="acceptAndContinue()">I Accept</button>

          <script>
            function acceptAndContinue() {
              document.cookie = "passedArbiter=true; path=/; max-age=3600";
              window.location.reload();
            }
          </script>
        </body>
      </html>
    `);

    next();
  };
}

export default arbiterMiddleware;
