import * as Yup from "yup";

const scheduleSchema = Yup.object({
  scheduleName: Yup.string()
    .trim()
    .max(50, "Schedule name must not contain more than 50 characters")
    .required("Schedule name is required"),

  schedules: Yup.array(
    Yup.object({
      type: Yup.string().matches(
        /(session|additional)/,
        "Invalid schedule type",
      ),

      start: Yup.string()
        .matches(/\d{2}:\d{2}/, "Start time must be in the format HH:MM")
        .required("Start time is required"),

      end: Yup.string()
        .matches(/\d{2}:\d{2}/, "End time must be in the format HH:MM")
        .when("type", {
          is: (type: string) => type === "session",
          then: (end) => end.required("End time is required"),
          otherwise: (end) => end.notRequired(),
        }),

      includeEndTime: Yup.bool().when("type", {
        is: (type: string) => type === "session",
        then: (includeEndTime) =>
          includeEndTime.required("Include end time is required"),
      }),

      interval: Yup.number().when("type", {
        is: (type: string) => type === "session",
        then: (interval) =>
          interval
            .transform((value) => (isNaN(value) ? null : value))
            .positive("Invterval must be a positive number")
            .required("Interval is required")
            .typeError("Interval must be a number"),
        otherwise: (interval) => interval.notRequired(),
      }),

      mode: Yup.object({
        type: Yup.string()
          .matches(
            /(single|repeat)/,
            "Mode must be either single chime or repeat chime",
          )
          .required("Mode is required"),

        duration: Yup.number()
          .transform((value) => (isNaN(value) ? null : value))
          .positive("Duration must be a positive number")
          .required("Duration is required")
          .typeError("Duration must be a number"),

        gap: Yup.number()
          .transform((value) => (isNaN(value) ? null : value))
          .typeError("Gap must be a number")
          .when("type", {
            is: (type: string) => type === "repeat",
            then: (gap) =>
              gap
                .positive("Gap must be a positive number")
                .required("Gap is required"),
            otherwise: (gap) => gap.notRequired(),
          }),

        ringCount: Yup.number()
          .transform((value) => (isNaN(value) ? null : value))
          .typeError("Number of rings must be a number")
          .when("type", {
            is: (type: string) => type === "repeat",
            then: (ringCount) =>
              ringCount
                .positive("Number of rings must be a positive number")
                .required("Number of rings is required"),
            otherwise: (ringCount) => ringCount.notRequired(),
          }),
      }),
    }),
  )
    .min(1, "Schedule details are required")
    .required("Schedule details are required"),
});

export type Schedule = Yup.InferType<typeof scheduleSchema>;
export default scheduleSchema;
