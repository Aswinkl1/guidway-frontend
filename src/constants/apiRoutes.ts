export const ROUTES = {
  AUTH: {
    ROOT: "/api/v1/",
    SIGNUP: "/api/v1/signup",
    VERIFY: "/api/v1/verify",
    REFRESH: "/api/v1/refresh",
    LOGIN: "/api/v1/login",
    FORGET_PASSWORD: "/api/v1/forget-password",
    RESET_PASSWORD: "/api/v1/reset-password",
    ADMIN_LOGIN: "/api/v1/admin/login",
    LOGOUT: "/api/v1/logout",
    UPLOAD_URL: "/api/v1/upload-url",
    GOOGLE_AUTH: "/api/v1/auth/google",
    GOOGLE_CALLBACK: "/api/v1/auth/google/callback",
    LINKEDIN_AUTH: "/api/v1/auth/linkedin",
    LINKEDIN_CALLBACK: "/api/v1/auth/linkedin/callback",
  },
  ADMIN: {
    USERS: "/api/v1/admin/users",
    BLOCK_STATUS: "/api/v1/admin/block-status",
    VERIFY_MENTOR: "/api/v1/admin/verify-mentor",
  },
  MENTOR:{
    EXPERIENCE:{
      ROOT:"/api/v1/experience",
      
    }
    
  }
} as const;
