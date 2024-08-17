import { useEffect } from "react";
import req from "@/api/requests";
import { VERIFY_SESSION_URL } from "@/constants/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./alert";

export function useAuthorizeSession() {
  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {
    req
      .get(VERIFY_SESSION_URL)
      .then((data) => {
        if (!data.success) {
          throw Error("Session expired");
        }
      })
      .catch((err) => {
        console.log(err);
        alert({
          title: "Session expired",
          description: "Session expired, login to continue",
          type: "error",
        });
        navigate("/auth/login");
      });
  }, [navigate, alert]);
}
