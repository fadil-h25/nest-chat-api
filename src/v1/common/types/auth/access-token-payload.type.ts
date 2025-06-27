import { Role } from '../../enum/role.enum';

export type AccessTokenPayload = {
  sub: number;
  roles: Role[];
};
