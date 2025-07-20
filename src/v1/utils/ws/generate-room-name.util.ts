import { RoomScope } from 'src/v1/common/enum/room-scope.enum';

export function generateRoomName(scope: RoomScope, relationId: number): string {
  return `${scope}:${relationId}`;
}
