import { Role } from '../common/enum/role.enum';

export type TokenPayload = {
  sub: number;
  roles: Role[];
};
