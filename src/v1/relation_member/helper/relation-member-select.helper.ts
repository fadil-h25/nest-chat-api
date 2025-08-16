export const relationMemberSelect = {
  id: true,
  user: {
    select: {
      id: true,
      name: true,
      phone: true,
    },
  },
  relation: {
    select: {
      id: true,
      type: true,
      lastMessage: {
        select: {
          id: true,
          content: true,
          ownerId: true,
          createdAt: true,
          updatedAt: true,
          relationId: true,
          isRead: true,
        },
      },
    },
  },
};
