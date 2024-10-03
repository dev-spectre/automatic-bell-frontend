import * as Yup from "yup";

const settingsSchema = Yup.object({
  network: Yup.object({
    wlanCredentials: Yup.array(
      Yup.object({
        ssid: Yup.string().ensure().required("SSID is required"),
        password: Yup.string().ensure().required("Password is required"),
      }),
    )
      .min(1, "At least one WLAN credential must be specified")
      .required("WLAN credentials is required"),
    connectionAttempts: Yup.number().required(
      "Max connection attempts is required",
    ),
  }),
  time: Yup.object({
    offset: Yup.number().required("Time offset is required"),
  }),
  schedule: Yup.object({
    minGapBetweenRings: Yup.number().required(
      "Min gap between schedules is required",
    ),
    maxWaitForMissedschedule: Yup.number().required(
      "Skip missed ring after is required",
    ),
  }),
});

export type settings = Yup.InferType<typeof settingsSchema>;
export default settingsSchema;
