import { Socket } from 'socket.io';
import { Request } from 'express';
export const getUserIdHttp = (request: Request): number => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (request as any).user.sub as number;
};

export const getUserIdWs = (client: Socket): number => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (client as any).user.sub as number;
};
