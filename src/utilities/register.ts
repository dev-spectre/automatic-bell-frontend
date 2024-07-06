import { DeviceInfo, UserWithDevice } from "../types";
import { DEVICE_INFO_URL } from "../constants/api";
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
