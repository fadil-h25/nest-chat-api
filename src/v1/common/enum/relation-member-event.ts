export enum RelationMemberWsEvent {
  // Client → Server
  CREATE_RELATION_MEMBER = 'relation-member:create',
  UPDATE_RELATION_MEMBER = 'relation-member:update',
  DELETE_RELATION_MEMBER = 'relation-member:delete',

  // Server → Client
  RELATION_MEMBER_CREATED = 'relation-member:created',
  RELATION_MEMBER_UPDATED = 'relation-member:updated',
  RELATION_MEMBER_DELETED = 'relation-member:deleted',

  // Room management (misalnya untuk notifikasi spesifik user atau group)
  JOIN_RELATION_MEMBER_ROOM = 'relation-member-room:join',
  LEFT_RELATION_MEMBER_ROOM = 'relation-member-room:left',
  RELATION_MEMBER_ROOM_PREFIX = 'relation-member-room:',
}
