import { Role } from "@/types/role";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IUserAuthSlice {
  token: string | null;
  role: Role | null;
  name: string | null;
  profileImageKey: string | null;
}

const initialState: IUserAuthSlice = {
  token: null,
  role: null,
  name: null,
  profileImageKey: null,
};

const userAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IUserAuthSlice>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.profileImageKey = action.payload.profileImageKey;
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
      state.name = null;
      state.profileImageKey = null;
    },
    updateToken: (
      state,
      action: PayloadAction<Omit<IUserAuthSlice, "role">>,
    ) => {
      state.token = action.payload.token;
    },
  },
});

export const { setCredentials, logout, updateToken } = userAuthSlice.actions;
export default userAuthSlice.reducer;
