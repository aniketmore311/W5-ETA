import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Response, Request } from 'express';
import passport from 'passport';

@injectable()
@singleton()
export class AuthController implements IBaseController {
  public path = '/auth';
  public middlewareBefore = [];
  public middlewareAfter = [];
  public router = express.Router();

  constructor() {
    this.bindHandlers();
    this.initializeRoutes();
  }

  /* eslint-disable */
  public bindHandlers() {}
  public initializeRoutes(): void {
    this.router.get(
      '/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    this.router.get(
      '/callback',
      passport.authenticate('google', { failureRedirect: '/user/login' }),
      (req, res) => {
        // successful authentication
        res.redirect('/home');
      }
    );
  }
}
