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
    this.renderProfile = this.renderProfile.bind(this);
    this.registerTeacher = this.registerTeacher.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get('/login', ensureUnauth, this.renderLogin);
    this.router.get('/profile', ensureAuth, this.renderProfile);
    this.router.post('/logout', ensureAuth, this.handleLogout);
    this.router.post('/registerteacher', ensureAuth, this.registerTeacher);
  }

  public renderLogin(req: Request, res: Response): void {
    const context = {
      errorMessages: req.flash('errorMessages'),
      successMessages: req.flash('successMessages'),
    };
    res.render('pages/login', context);
  }

  public renderProfile(req: Request, res: Response): void {
    const context = {
      errorMessages: req.flash('errorMessages'),
      successMessages: req.flash('successMessages'),
      user: req.user,
    };
    res.render('pages/profile', context);
  }

  public handleLogout(req: Request, res: Response): void {
    req.session.destroy((err) => {
      req.logOut();
      res.redirect('/user/login');
    });
  }

  public async registerTeacher(req: Request, res: Response): Promise<void> {
    const { id, institute, position } = req.body;
    const user = await this.userService.registerTeacher(
      Number(id),
      institute,
      position
    );
    req.user = user;
    req.flash('successMessages', ['registered as a teacher']);
    res.redirect('/user/profile');
  }
}
