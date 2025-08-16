import { messageSelect } from 'src/v1/message/helpers/message-select.helper';

export const relationSelect = {
  select: {
    id: true,
    type: true,
    lastMessage: messageSelect,
  },
};
