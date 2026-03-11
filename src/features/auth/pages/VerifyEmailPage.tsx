import { useSearchParams } from "react-router";

function isTokenExpired(token: string): boolean {
  if (!token) return true;
  // decode the token

  // current time in second

  // check if the current time is less that token exp
  return false;
}
export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  return <h1>jkdjdj</h1>;
};
