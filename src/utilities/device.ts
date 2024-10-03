import req from "@/api/requests";
import { DEVICE_INFO_URL } from "@/constants/api";

export function getDeviceIdFromJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload).deviceId[0].id;
}

export function getDeviceId() {
  const id = localStorage.getItem("deviceId");
  const jwt = localStorage.getItem("jwt");
  if (id) {
    return parseInt(id);
  } else if (!id && jwt) {
    const deviceId = getDeviceIdFromJwt(jwt);
    localStorage.setItem("deviceId", deviceId);
    return parseInt(deviceId);
  }
  return NaN;
}

export async function getDeviceIp(id?: number): Promise<string> {
  if (!id) id = getDeviceId();
  const deviceIpFromSessionStorage = sessionStorage.getItem("deviceIp") ?? "";
  const checkedSession = sessionStorage.getItem("checkedSessionIp");
  const requestCheckForSession: Promise<string> = new Promise(
    (resolve, reject) => {
      if (!deviceIpFromSessionStorage) {
        reject("Value is null");
        return;
      } else if (deviceIpFromSessionStorage && checkedSession) {
        return resolve(deviceIpFromSessionStorage);
      }
      req
        .get(`http://${deviceIpFromSessionStorage}/res`)
        .then((res) => {
          if (res.success) resolve(deviceIpFromSessionStorage);
        })
        .catch((err) => reject(err));
    },
  );

  const deviceIpFromLocalStorage =
    localStorage.getItem("deviceIp") ?? "0.0.0.0";
  const requestCheckForLocal: Promise<string> = new Promise(
    (resolve, reject) => {
      if (!deviceIpFromLocalStorage) {
        reject("Value is null");
        return;
      }
      req
        .get(`http://${deviceIpFromLocalStorage}/res`)
        .then((res) => {
          if (res.success) resolve(deviceIpFromLocalStorage);
        })
        .catch((err) => reject(err));
    },
  );

  const serverResponse: Promise<string> = new Promise((resolve, reject) => {
    req
      .get(`${DEVICE_INFO_URL}?id=${id}`)
      .then((res) => {
        if (res.success) resolve(res.data.deviceInfo.ip);
      })
      .catch((err) => reject(err));
  });

  try {
    const ip = await Promise.any([
      requestCheckForSession,
      requestCheckForLocal,
      serverResponse,
    ]);
    localStorage.setItem("deviceIp", ip);
    sessionStorage.setItem("deviceIp", ip);
    sessionStorage.setItem("checkedSessionIp", ip);
    return ip;
  } catch (err) {
    throw new Error((err as string).toString());
  }
}
