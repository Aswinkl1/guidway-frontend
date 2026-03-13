import { useLoaderData } from "react-router";
import { LinkExpiredPage } from "../components/LinkExpiredPage";

import { isTokenExpired } from "../helpers/verifyEmailLoder";
import { ResetPassword } from "../components/ResetPassword";

// helper loder function
export async function verifyTokenForResetPassword({
  request,
}: {
  request: Request;
}) {
  try {
    const url = new URL(request.url);

    const token = url.searchParams.get("token");
    if (!token) {
      return false;
    }

    if (!isTokenExpired(token)) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export function ResetPasswordPage() {
  const data = useLoaderData();
  if (!data) return <LinkExpiredPage />;
  return <ResetPassword />;
}
