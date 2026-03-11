import { jwtDecode } from "jwt-decode";
import { api } from "./axios";

function isTokenExpired(token: string): boolean {
  try {
    if (!token) return true;
    // decode the token
    const decodeToken = jwtDecode(token);

    // current time in second
    const currentTime = Date.now() / 1000;
    if (!decodeToken.exp) {
      return true;
    }

    // check if the current time is less that token exp
    return decodeToken.exp < currentTime;
  } catch (error) {
    console.log(error);
    return true;
  }
}

export default async function verifyToken({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);

    const token = url.searchParams.get("token");
    if (!token) {
      return false;
    }

    if (!isTokenExpired(token)) {
      await api.get(`/verify?token=${token}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
