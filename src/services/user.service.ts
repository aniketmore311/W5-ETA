import { inject, injectable, singleton } from 'tsyringe';
import { User } from '../models/entity';
import { IUser } from '../types';
import { Repository } from 'typeorm';
import { Profile } from 'passport-google-oauth20';
import { SiteErrorHandler } from '../middleware';
import { SiteError } from '../utils';

@injectable()
@singleton()
export class UserService {
  public async findOneorCreate(profile: Profile): Promise<IUser> {
    const existing = await User.findOne({ where: { googleID: profile.id } });
    if (existing) {
      return Promise.resolve(existing);
    }
    const user = User.create();
    user.firstName = profile.name?.givenName || '';
    user.lastName = profile.name?.familyName || '';
    user.googleID = profile.id;
    if (profile.emails) {
      user.email = profile.emails[0].value || '';
    }
    if (profile.photos) {
      user.photo = profile.photos[0].value;
    }
    await user.save();
    return Promise.resolve(user);
  }

  public async findOne(id: number): Promise<IUser> {
    const user = await User.findOne(id);
    if (!user) {
      return Promise.reject(new SiteError('user not found'));
    }
    return Promise.resolve(user);
  }

  public async findOneGoogleId(googleId: string): Promise<IUser> {
    const user = await User.findOne({ where: { googleID: googleId } });
    if (!user) {
      return Promise.reject(new SiteError('user not found'));
    }
    return Promise.resolve(user);
  }
}
