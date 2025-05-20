import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

const MsalRedirect = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    instance.handleRedirectPromise().then(async (response) => {
      if (response && response.account) {
        // Exchange MSAL code for backend session
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const res = await fetch("/api/msal/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
            credentials: "include"
          });
          if (res.ok) {
            navigate("/");
            window.location.reload();
          }
        }
      }
    });
  }, [instance, navigate]);

  return <div>Logging in with Microsoft...</div>;
};

export default MsalRedirect;