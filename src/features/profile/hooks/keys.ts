export const QUERYKEY = {
  all: ["profile"] as const,
};

export const skillsQueryKeys = {
  all: ["skills"] as const,
  list: () => [...skillsQueryKeys.all, "list"] as const,
};

export const domainQueryKeys = {
  all: ["domain"] as const,
  list: () => [...domainQueryKeys.all, "list"] as const,
};

export const languageQueryKeys = {
  all: ["languages"] as const,

  list: () => [...languageQueryKeys.all, "list"] as const,
};

export const settingsQueryKeys = {
  all: ["mentor", "settings"] as const,
};
