import { registry } from 'tsyringe';
import { getRepository } from 'typeorm';
import { User } from '../models/entity';
@registry([
  {
    token: 'userRepo',
    useFactory: (_) => {
      return getRepository(User);
    },
  },
])
class RegistryClass {}
