import { Role } from '../enum/role.enum';

export type UserPayload = {
  sub: number;
  roles: Role[];
};
