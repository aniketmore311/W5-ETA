import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Response, Request } from 'express';

@injectable()
@singleton()
export class ViewController implements IBaseController {
  public path = '/view';
  public middlewareBefore = [];
  public middlewareAfter = [];
  public router = express.Router();

  constructor() {
    this.bindHandlers();
    this.initializeRoutes();
  }

  public bindHandlers(): void {
    this.render = this.render.bind(this);
  }

  public initializeRoutes(): void {
    this.router.use('/:tmpl', this.render);
  }

  public render(req: Request, res: Response): void {
    res.render(`static/${req.params.tmpl}`, {});
  }
}
