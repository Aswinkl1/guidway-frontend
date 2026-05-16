import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export const ErrorNavigator = () => {
  const navigator = useNavigate();
  useEffect(() => {
    const handler = (e: Event) => {
      const status = (e as CustomEvent).detail.status;
      if (status === 404) {
        navigator("/404");
      } else if (status === 500) {
        navigator("/500");
      }
    };

    window.addEventListener("nav-error", handler);

    return () => {
      window.removeEventListener("nav-error", handler);
    };
  }, [navigator]);
  return <Outlet />;
};
