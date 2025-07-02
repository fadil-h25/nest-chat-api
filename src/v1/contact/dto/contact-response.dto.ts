export type GetContactRes = {
  id: number;
  ownerId: number;
  name: string;
  targetId: number;
  totalUnreadMessage: number;
  relationId: number | null;
  relation: {
    lastMessage: {
      content: string;
    } | null;
  } | null;
};

export type AddNewContactRes = {
  id: number;
  ownerId: number;
  name: string;
  targetId: number;
  totalUnreadMessage: number;
  relationId: number | null;
  relation: {
    lastMessage: {
      content: string;
    } | null;
  } | null;
};

export type UpdateContactRes = {
  id: number;
  ownerId: number;
  name: string;
  targetId: number;
  totalUnreadMessage: number;
  relationId: number | null;
  relation: {
    lastMessage: {
      content: string;
    } | null;
  } | null;
};

export type GetContactPhoneByIdRes = {
  id: number;
  phone: string;
};
