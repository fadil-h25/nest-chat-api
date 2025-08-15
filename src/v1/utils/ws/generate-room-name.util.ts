import { RelationWsEvent } from 'src/v1/common/enum/relation-event';

import { UserWsEvent } from 'src/v1/common/enum/user-event.enum';

export function generateRoomName(
  scope: UserWsEvent.USER_ROOM_PREFIX | RelationWsEvent.RELATION_ROOM_PREFIX,
  relationId: number,
): string {
  return `${scope}:${relationId}`;
}
