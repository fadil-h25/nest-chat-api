export const messageSelect = {
  id: true,
  content: true,
  relationId: true,
  ownerId: true,
  owner: {
    select: {
      name: true,
    },
  },

  createdAt: true,
  updatedAt: true,
};
