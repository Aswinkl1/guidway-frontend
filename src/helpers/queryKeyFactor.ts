export const createKeys = (entity: string) => {
  const KEYS = {
    all: [entity] as const,
    lists: () => [...KEYS.all, "list"] as const,
    list: (filter: any) => [...KEYS.lists(), filter] as const,
    details: (id: string) => [...KEYS.all, "details", id] as const,
  };
  return KEYS;
};
