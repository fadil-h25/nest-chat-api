export enum MessageWsEvent {
  // Client → Server
  CREATE_MESSAGE = 'message:create',
  UPDATE_MESSAGE = 'message:update',
  DELETE_MESSAGE = 'message:delete',

  // Server → Client
  MESSAGE_CREATED = 'message:created',
  MESSAGE_UPDATED = 'message:updated',
  MESSAGE_DELETED = 'message:deleted',

  JOIN_MESSAGE_ROOM = 'message-room:join',
  LEFT_MESSAGE_ROOM = 'message-room:left',
  MESSAGE_ROOM_PREFIX = 'message-room:',
}
