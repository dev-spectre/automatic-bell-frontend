import { useEffect } from "react";
import req from "@/api/requests";
import { VERIFY_SESSION_URL } from "@/constants/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./alert";
import { getDeviceIp } from "@/utilities/device";

export function useAuthorizeSession() {
  const navigate = useNavigate();
  const alert = useAlert();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (!jwt) {
      navigate("/auth/login");
      return;
    }

    req
      .get(VERIFY_SESSION_URL)
      .then((data) => {
        if (!data.success) {
          throw Error("Session expired");
        }
      })
      .catch((_) => {
        alert({
          title: "Session expired",
          description: "Session expired, login to continue",
          type: "error",
        });
        navigate("/auth/login");
      });

    getDeviceIp().then((deviceIp) => {
      req
        .get(`http://${deviceIp}/verify`)
        .then((data) => {
          if (!data.success) {
            throw Error("Session expired");
          }
        })
        .catch((_) => {
          alert({
            title: "Session expired",
            description: "Session expired, login to continue",
            type: "error",
          });
          navigate("/auth/login");
        });
    });
  }, []);
}
