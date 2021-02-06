import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Request, Response } from 'express';
import { SiteError } from '../utils';
import { env } from '../config/env.config';

@singleton()
@injectable()
export class TestController implements IBaseController {
  public path = '/test';
  public middlewareBefore = [];
  public middlewareAfter = [];
  public router = express.Router();

  constructor() {
    this.bindHandlers();
    this.initializeRoutes();
  }

  public bindHandlers(): void {
    this.renderError = this.renderError.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get('/error', this.renderError);
  }

  public renderError(req: Request, res: Response): void {
    console.log(env.NODE_ENV);
    throw new SiteError('site error');
  }
}
