export const CLIENT_ROUTES = {
  HOME: "/",
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    VERIFY: "/auth/verify",
    FORGET_PASSWORD: "/auth/forget-password",
    RESET_PASSWORD: "/auth/reset-password",
    ADMIN_LOGIN: "/auth/admin/login",
  },
  ADMIN: {
    ROOT: "/admin",
    USERS: "/admin/users",
    MENTORS: "/admin/mentors",
  },
  MENTOR: {
    ROOT: "/mentor",
    PROFILE: "/mentor/profile",
    SESSIONS: "/mentor/sessions",
  },
} as const;
