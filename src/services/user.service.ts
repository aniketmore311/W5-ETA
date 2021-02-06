import { inject, injectable, singleton } from 'tsyringe';
import bcrypt from 'bcrypt';
import { User } from '../models/entity';
import { IUser } from '../types';
import { Repository } from 'typeorm';
import { SiteError } from '../utils';
import { env } from '../config/env.config';

@injectable()
@singleton()
export class UserService {
  constructor(@inject('userRepo') public userRepo: Repository<User>) {}

  /**
   * @async
   * @description
   * creates new user and returns it
   * @returns
   * a promise either resolved with a user or rejected with an error
   */
  public async createUser(
    username: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<IUser> {
    const existingUser = await this.userRepo.findOne({
      where: { username: username },
    });
    if (existingUser) {
      // console.log('existing user found: %o', existingUser);
      return Promise.reject(new SiteError('username already taken'));
    }
    const user = this.userRepo.create();
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = await bcrypt.hash(password, env.SALT_ROUNDS);
    await this.userRepo.save(user);
    console.log('created user %o', user);
    return Promise.resolve(user);
  }

  public async isUserValid(username: string, password: string): Promise<IUser> {
    const user = await this.userRepo.findOne({ where: { username: username } });
    if (!user) {
      return Promise.reject(new SiteError('invalid username'));
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return Promise.reject(new SiteError('invalid password'));
    }
    return Promise.resolve(user);
  }
}
