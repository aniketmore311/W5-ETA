import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Request, Response } from 'express';
import { catchAsync } from '../utils/error.util';
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
    this.renderRegister = this.renderRegister.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get('/register', ensureUnauth, this.renderRegister);
    this.router.get('/login', ensureUnauth, this.renderLogin);
    this.router.post(
      '/register',
      ensureUnauth,
      catchAsync(this.handleRegister)
    );
    this.router.post('/login', ensureUnauth, catchAsync(this.handleLogin));
    this.router.post('/logout', ensureAuth, this.handleLogout);
  }

  public renderRegister(req: Request, res: Response): void {
    const context = {
      errorMessages: req.flash('errorMessages'),
      successMessages: req.flash('successMessages'),
    };
    res.render('pages/register', context);
  }

  public async handleRegister(req: Request, res: Response): Promise<void> {
    const {
      username,
      firstname,
      lastname,
      password,
      confirmpassword,
    } = req.body;

    if (password !== confirmpassword) {
      req.flash('errorMessages', ['passwords do not match']);
      return res.redirect('/user/register');
    }

    try {
      const newUser = await this.userService.createUser(
        username,
        firstname,
        lastname,
        password
      );
      console.log('new user: %o', newUser);
      req.flash('successMessages', ['registration successful']);
      res.redirect('/user/login');
    } catch (err) {
      if (err.statusCode) {
        console.error(err);
        req.flash('errorMessages', [err.message]);
        res.redirect('/user/register');
      } else {
        throw err;
      }
    }
  }

  public renderLogin(req: Request, res: Response): void {
    const context = {
      errorMessages: req.flash('errorMessages'),
      successMessages: req.flash('successMessages'),
    };
    res.render('pages/login', context);
  }

  public async handleLogin(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      const user = await this.userService.isUserValid(username, password);
      req.session.user = user;
      req.flash('successMessages', ['login successful']);
      res.redirect('/home');
    } catch (err) {
      if (err.statusCode) {
        console.error(err);
        req.flash('errorMessages', [err.message]);
        res.redirect('/user/login');
      } else {
        throw err;
      }
    }
  }

  public handleLogout(req: Request, res: Response): void {
    req.session.user = undefined;
    req.flash('successMessages', ['logout successful']);
    res.redirect('/user/login');
  }
}
