// utils/ws/get-room-name.util.ts
export function getRoomName(
  scope: 'relation' | 'user',
  id: number | string,
): string {
  return `${scope}:${id}`;
}
