import { Handler, Router } from 'express';

export interface IBaseController {
  path: string;
  router: Router;
  middlewareBefore: Handler[];
  middlewareAfter: Handler[];
  bindHandlers(): void;
  initializeRoutes(): void;
}
