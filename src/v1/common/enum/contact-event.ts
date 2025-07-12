export enum ContactWsEvent {
  // Client → Server
  CREATE_CONTACT = 'contact:create',
  UPDATE_CONTACT = 'contact:update',
  DELETE_CONTACT = 'contact:delete',

  // Server → Client
  CONTACT_CREATED = 'contact:created',
  CONTACT_UPDATED = 'contact:updated',
  CONTACT_DELETED = 'contact:deleted',
}
