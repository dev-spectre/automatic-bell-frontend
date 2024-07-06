import { DeviceInfo, UserWithDevice } from "../types";
import { DEVICE_INFO_URL, SIGNIN_URL } from "../constants/api";
import { getDeviceIdFromJwt, getDeviceIp } from "./device";
import req from "../api/requests";

export async function findDeviceInfo(deviceInfo: DeviceInfo[]) {
  const networkRequests: Promise<DeviceInfo>[] = [];
  deviceInfo.forEach((device) => {
    const networkRequest: Promise<DeviceInfo> = new Promise(
      (resolve, reject) => {
        req
          .get(`http://${device.ip}/res`)
          .then((res) => {
            if (res.success) resolve(device);
          })
          .catch((err) => {
            reject(err);
          });
      },
    );
    networkRequests.push(networkRequest);
  });

  try {
    return await Promise.any(networkRequests);
  } catch (_) {
    return;
  }
}

export async function getDeviceInfo(key: string) {
  const res = await req.get(`${DEVICE_INFO_URL}/${key}`);
  if (!res.success) {
    return;
  }
  const deviceInfo = await findDeviceInfo(res.data.deviceInfo);
  return deviceInfo;
}

export async function registerUser(
  username: string,
  password: string,
  key: string,
  deviceInfo: DeviceInfo,
): Promise<UserWithDevice | undefined> {
  const res = await req.post(`http://${deviceInfo.ip}/signup`, {
    id: deviceInfo.id,
    key,
    username,
    password,
  });
  if (!res.success) {
    return;
  }
  return res.data;
}

export async function signInUser(
  username: string,
  password: string,
): Promise<string | undefined> {
  const serverResponse = await req.post(SIGNIN_URL, {
    username,
    password,
  });

  if (!serverResponse.success) {
    return;
  }

  const { jwt, userKeyId } = serverResponse.data;
  localStorage.setItem("jwt", `Bearer ${jwt}`);

  try {
    const deviceId = getDeviceIdFromJwt(jwt);
    const deviceIp = await getDeviceIp(deviceId);
    const deviceResponse = await req.post(`http://${deviceIp}/signin`, {
      userKeyId,
    });

    if (!deviceResponse.success) {
      return;
    }
  } catch (err) {
    // TODO: Notify user
    return;
  }

  return jwt;
}

export async function resetPassword(
  username: string,
  password: string,
  key: string,
) {
  const deviceId = parseInt(localStorage.getItem("deviceId") ?? "-1");
  try {
    const deviceIp = await getDeviceIp(deviceId);
    const res = req.put(`http://${deviceIp}/password/reset`, {
      username,
      password,
      key,
    });
    return res;
  } catch (err) {
    // TODO: Notify user
    return;
  }
}
