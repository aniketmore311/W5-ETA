import { inject, injectable, singleton } from 'tsyringe';
import bcrypt from 'bcrypt';
import { IUserService, IUserDTO } from '../types';
import { User } from '../models/entity';
import { Repository } from 'typeorm';
import { userToDTO } from '../mappers/user.mapper';
import { SiteError } from '../utils';
import { env } from '../config/env.config';

@injectable()
@singleton()
export class UserService implements IUserService {
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
  ): Promise<IUserDTO> {
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
    return Promise.resolve(userToDTO(user));
  }

  public async isUserValid(
    username: string,
    password: string
  ): Promise<IUserDTO> {
    const user = await this.userRepo.findOne({ where: { username: username } });
    if (!user) {
      return Promise.reject(new SiteError('invalid username'));
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return Promise.reject(new SiteError('invalid password'));
    }
    return Promise.resolve(userToDTO(user));
  }
}
