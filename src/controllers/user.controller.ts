import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ensureAuth, ensureUnauth } from '../middleware/auth.middleware';

@injectable()
@singleton()
export class UserController implements IBaseController {
  public path = '/user';
  public middlewareBefore = [];
  public middlewareAfter = [];
  public router = express.Router();

  constructor(public userService: UserService) {
    this.bindHandlers();
    this.initializeRoutes();
  }

  public bindHandlers(): void {
    this.renderLogin = this.renderLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get('/login', ensureUnauth, this.renderLogin);
    this.router.post('/logout', ensureAuth, this.handleLogout);
  }

  public renderLogin(req: Request, res: Response): void {
    const context = {
      errorMessages: req.flash('errorMessages'),
      successMessages: req.flash('successMessages'),
    };
    res.render('pages/login', context);
  }

  public handleLogout(req: Request, res: Response): void {
    req.session.destroy((err) => {
      req.logOut();
      res.redirect('/user/login');
    });
  }
}
