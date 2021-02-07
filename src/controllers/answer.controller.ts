import { singleton, injectable } from 'tsyringe';
import { IBaseController } from '../types';
import express, { Response, Request } from 'express';
import { ensureAuth, ensureUnauth } from '../middleware/auth.middleware';
import { Answer, Question, User } from '../models/entity';
import { Query } from 'typeorm/driver/Query';
import { catchAsync } from '../utils';

@injectable()
@singleton()
export class AnswerController implements IBaseController {
  public path = '/answer';
  public middlewareBefore = [];
  public middlewareAfter = [];
  public router = express.Router();

  constructor() {
    this.bindHandlers();
    this.initializeRoutes();
  }
  public bindHandlers() {}
  public initializeRoutes() {
    this.router.post('/create', catchAsync(this.createAnswer));
    this.router.post('/update', catchAsync(this.updateAnswer));
    this.router.post('/delete', catchAsync(this.deleteAnswer));
  }

  public async createAnswer(req: Request, res: Response): Promise<void> {
    const { userid, text, questionid } = req.body;
    const answer = Answer.create();
    const user = await User.findOne(Number(userid));
    const question = await Question.findOne(Number(questionid));
    if (user) {
      answer.user = user;
    }
    if (question) {
      answer.question = question;
    }
    answer.text = text;
    await answer.save();
    res.send('question created');
  }

  public async updateAnswer(req: Request, res: Response): Promise<void> {
    const { answerid, text } = req.body;
    const answer = await Answer.findOne(Number(answerid));
    if (answer) {
      answer.text = text;
      await answer.save();
      res.send('answer updated');
    }
  }

  public async deleteAnswer(req: Request, res: Response): Promise<void> {
    const { userid, answerid } = req.body;
    const answer = await Answer.findOne(Number(answerid), {
      relations: ['user'],
    });
    if (answer) {
      if (answer.user.id != Number(userid as string)) {
        return res.redirect('/home');
      }
      await answer.remove();
      res.send('answer deleted');
    }
  }
}
