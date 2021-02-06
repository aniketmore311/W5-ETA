import { IUserDTO } from '../index';
export interface IUserService {
  isUserValid: (email: string, password: string) => Promise<IUserDTO>;
  createUser: (
    username: string,
    firstName: string,
    lastName: string,
    password: string
  ) => Promise<IUserDTO>;
  deleteUser?: (email: string, password: string) => Promise<IUserDTO>;
  resetPassword?: (
    email: string,
    oldPassword: string,
    newPassword: string
  ) => Promise<IUserDTO>;
}
