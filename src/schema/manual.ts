import * as Yup from "yup";

const manualFormSchema = Yup.object({
  mode: Yup.string()
    .matches(
      /(single|repeat)/,
      "Mode must be either single chime or repeat chime",
    )
    .required("Mode is required"),

  duration: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive("Duration must be a positive number")
    .required("Duration is required")
    .typeError("Duration must be a number"),

  gap: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .typeError("Gap must be a number")
    .when("mode", {
      is: (type: string) => type === "repeat",
      then: (gap) =>
        gap
          .positive("Gap must be a positive number")
          .required("Gap is required"),
      otherwise: (gap) => gap.notRequired(),
    }),

  ringCount: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .typeError("Number of rings must be a number")
    .when("mode", {
      is: (type: string) => type === "repeat",
      then: (ringCount) =>
        ringCount
          .positive("Number of rings must be a positive number")
          .required("Number of rings is required"),
      otherwise: (ringCount) => ringCount.notRequired(),
    }),
});

export type ScheduleMode = Yup.InferType<typeof manualFormSchema>;
export default manualFormSchema;
