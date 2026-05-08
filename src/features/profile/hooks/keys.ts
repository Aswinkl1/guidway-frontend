export const QUERYKEY = {
  all: ["profile"] as const,
};

export const skillsQueryKeys = {
  all: ["skills"] as const,
  list: () => [...skillsQueryKeys.all, "list"] as const,
};

export const languageQueryKeys = {
  all: ["languages"] as const,

  list: () => [...languageQueryKeys.all, "list"] as const,
};
