import { IUserDTO, IUser } from '../types';

export function userToDTO(user: IUser): IUserDTO {
  const userDTO: IUserDTO = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  return userDTO;
}
