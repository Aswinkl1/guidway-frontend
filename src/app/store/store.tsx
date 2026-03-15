import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "@/features/auth/redux/UserAuthSlice";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
export const store = configureStore({
  reducer: {
    auth: userAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>(); // this hook returns a dispatch function with type of appdispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
