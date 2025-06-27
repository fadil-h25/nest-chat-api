import { Role } from 'src/v1/common/enum/role.enum';

export type AccessTokenPayload = {
  sub: number;
  roles: Role[];
};
