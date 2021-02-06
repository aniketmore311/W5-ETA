import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Response, Request } from 'express';
import { ensureAuth, ensureUnauth } from '../middleware/auth.middleware';

@injectable()
@singleton()
export class HomeController implements IBaseController {
  public path = '';
  public middlewareBefore = [];
  public middlewareAfter = [];
  public router = express.Router();

  constructor() {
    this.bindHandlers();
    this.initializeRoutes();
  }

  public bindHandlers(): void {
    this.renderHome = this.renderHome.bind(this);
  }

  public initializeRoutes(): void {
    this.router.use('/home', ensureAuth, this.renderHome);
  }

  public renderHome(req: Request, res: Response): void {
    const context = {
      errorMessages: req.flash('errorMessages'),
      successMessages: req.flash('successMessages'),
      user: req.session.user,
    };
    res.render('pages/home', context);
  }
}
