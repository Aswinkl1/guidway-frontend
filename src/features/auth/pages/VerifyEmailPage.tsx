import { useLoaderData, useSearchParams } from "react-router";
import { LinkExpiredPage } from "../components/LinkExpiredPage";
import { VerifySuccessPage } from "../components/VerifySuccessfull";

export const VerifyEmailPage = () => {
  const isTokenValid = useLoaderData();
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
