import { messageSelect } from 'src/v1/message/helpers/message-select.helper';

export const relationMemberSelect = {
  relation: {
    select: {
      id: true,
      type: true,
      lastMessage: {
        select: messageSelect,
      },
    },
  },
  user: {
    select: {
      id: true,
      phone: true,
    },
  },
};
