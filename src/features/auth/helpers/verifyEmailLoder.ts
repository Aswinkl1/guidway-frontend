import { jwtDecode } from "jwt-decode";
import { api } from "../../../lib/axios";

export function isTokenValid(token: string): String | null {
  try {
    if (!token) return null;
    // decode the token
    const decodeToken = jwtDecode(token);
    console.log(decodeToken);
    // current time in second
    const currentTime = Date.now() / 1000;
    if (!decodeToken.exp) {
      return null;
    }

    // check if the current time is less that token exp
    // decoded time 10:40 > current time 10:50 return null
    return decodeToken.exp > currentTime ? token : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default async function verifyToken({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);

    const token = url.searchParams.get("token");
    if (!token) {
      return false;
    }

    if (!isTokenValid(token)) {
      await api.get(`/verify?token=${token}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
