import req from "@/api/requests";
import { DeviceInfo, ErrorString, Result, UserWithDevice } from "@/types";
import { DEVICE_INFO_URL, SIGNIN_URL } from "@/constants/api";
import { getDeviceIdFromJwt, getDeviceIp } from "./device";

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
): Promise<Result<UserWithDevice, ErrorString>> {
  const res = await req.post(`http://${deviceInfo.ip}/signup`, {
    id: deviceInfo.id,
    key,
    username,
    password,
  });
  if (!res.success) {
    let error: ErrorString = "UNKNOWN_ERR";
    if (res.status === 400) {
      error = "INVALID_FORMAT";
    } else if (res.status === 404) {
      error = "RESOURCE_NOT_FOUND";
    } else if (res.status === 409) {
      error = "RESOURCE_CONFLICT";
    }

    return {
      ok: false,
      error,
    };
  }
  return {
    ok: true,
    data: res.data,
  };
}

export async function signInUser(
  username: string,
  password: string,
): Promise<Result<string, ErrorString>> {
  const serverResponse = await req.post(SIGNIN_URL, {
    username,
    password,
  });

  if (!serverResponse.success) {
    let error: ErrorString = "UNKNOWN_ERR";

    if (serverResponse.status === 401) {
      error = "INVALID_CRED";
    } else if (serverResponse.status === 400) {
      error = "INVALID_FORMAT";
    } else if (serverResponse.status === 404) {
      error = "RESOURCE_NOT_FOUND";
    }

    return {
      ok: false,
      error,
    };
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
      return {
        ok: false,
        error: "DEVICE_ERR",
      };
    }
  } catch (err) {
    return {
      ok: false,
      error: "UNKNOWN_ERR",
    };
  }

  return {
    ok: true,
    data: jwt,
  };
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
