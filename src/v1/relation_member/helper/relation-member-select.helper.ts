export const relationMemberSelect = {
  relation: {
    select: {
      id: true,
      type: true,
      lastMessage: {
        select: {
          id: true,
          content: true,
          updatedAt: true,
          createdAt: true,
        },
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
