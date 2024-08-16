import { useEffect } from "react";
import req from "@/api/requests";
import { VERIFY_SESSION_URL } from "@/constants/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToast } from "@/store/slice/toasts";

export function useAuthorizeSession() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        dispatch(
          addToast({
            title: "Session expired",
            description: "Session expired, login to continue",
            type: "error",
          }),
        );
        navigate("/auth/login");
      });
  }, [navigate, dispatch]);
}
