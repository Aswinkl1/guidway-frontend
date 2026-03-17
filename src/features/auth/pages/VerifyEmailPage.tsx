import { useLoaderData, useRouteLoaderData } from "react-router";
import { LinkExpiredPage } from "../components/LinkExpiredPage";
import { VerifySuccessPage } from "../components/VerifySuccessfull";

export const VerifyEmailPage = () => {
  const isTokenValid = useRouteLoaderData("verify-email");
  console.log("is token valid", isTokenValid);
  const title = "Email verification successfull";
  const message =
    "Your account has been verifed. You can now log in to your account with your new credentials";
  return (
    <>
      {isTokenValid ? (
        <VerifySuccessPage title={title} message={message} />
      ) : (
        <LinkExpiredPage />
      )}
    </>
  );
};
