import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Response, Request } from 'express';
import { ensureAuth, ensureUnauth } from '../middleware/auth.middleware';
import { Question, User } from '../models/entity';
import { Query } from 'typeorm/driver/Query';
import { catchAsync } from '../utils';

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
    this.test = this.test.bind(this);
  }

  public initializeRoutes(): void {
    this.router.get('/home', ensureAuth, this.renderHome);
    this.router.get('/test', catchAsync(this.test));
  }

  public renderHome(req: Request, res: Response): void {
    const context = {
      errorMessages: req.flash('errorMessages'),
      successMessages: req.flash('successMessages'),
      user: req.user,
    };
    res.render('static/home', context);
  }

  public async test(req: Request, res: Response): Promise<void> {
    const user = await User.findOne({
      where: { email: 'aniketavinashmore33@gmail.com' },
    });
    if (user) {
      const q1 = Question.create();
      q1.text = 'test question text';
      q1.user = user;
      // await q1.save();
      user.questions = [q1];
      await user.save();
      await user.remove();
    }
    res.send('test response');
  }
}
