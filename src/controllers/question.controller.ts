import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Response, Request } from 'express';
import { ensureAuth, ensureUnauth } from '../middleware/auth.middleware';
import { Question, User } from '../models/entity';
import { Query } from 'typeorm/driver/Query';
import { catchAsync } from '../utils';

@injectable()
@singleton()
export class QuestionController implements IBaseController {
  public path = '/question';
  public middlewareBefore = [];
  public middlewareAfter = [];
  public router = express.Router();

  constructor() {
    this.bindHandlers();
    this.initializeRoutes();
  }

  public bindHandlers(): void {}

  public initializeRoutes(): void {
    this.router.post('/create', catchAsync(this.createQuestion));
    this.router.post('/update', catchAsync(this.updateQuestion));
    this.router.post('/delete', catchAsync(this.deleteQuestion));
  }

  public async createQuestion(req: Request, res: Response): Promise<void> {
    const { userid, text } = req.body;
    const question = Question.create();
    const user = await User.findOne(Number(userid));
    console.log('user:%o', user);
    if (user) {
      question.user = user;
    }
    question.text = text;
    console.log('question:%o', question);
    await question.save();
    res.send('question created');
  }

  public async updateQuestion(req: Request, res: Response): Promise<void> {
    const { questionid, text } = req.body;
    const question = await Question.findOne(Number(questionid));
    if (question) {
      question.text = text;
      await question.save();
      res.send('question updated');
    }
  }

  public async deleteQuestion(req: Request, res: Response): Promise<void> {
    const { userid, questionid } = req.body;
    const question = await Question.findOne(Number(questionid));
    if (question) {
      console.log('question%o', question);
      //   if (question.user.id == userid) {
      //     res.redirect('/home');
      //   }
      //   question.remove();
      res.send('question deleted');
    }
  }
}
