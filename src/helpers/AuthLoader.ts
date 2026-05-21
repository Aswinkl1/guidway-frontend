import { store } from "@/app/store/store";
import { setCredentials } from "@/features/auth/redux/UserAuthSlice";
import axios from "axios";

async function AuthLoader() {
  try {
    const state = store?.getState();
    const token = state?.auth?.token;
    if (token) return token;

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_BACKEND_API_VERSION}/refresh`,
      {
        withCredentials: true,
      },
    );
    const { accessToken, role, name, profileImageKey } = data.result;
    store.dispatch(
      setCredentials({
        token: accessToken,
        role: role,
        name: name,
        profileImageKey,
      }),
    );
    console.log("token refreshed", accessToken);
    return accessToken;
  } catch (error) {
    return null;
  }
}

export default AuthLoader;
