import * as Yup from "yup";

const assignSchedule = Yup.object({
  schedule: Yup.string().required("Schedule name is required"),
  selected: Yup.array(
    Yup.string()
      .ensure()
      .matches(
        /once | weekly | monthly/,
        "Selected values should be once, weekly or monthly",
      ),
  )
    .min(1, "Please assign schedule")
    .required("Please assign schedule"),
  once: Yup.array(
    Yup.string()
      .ensure()
      .matches(
        /\d{1,2}\/\d{1,2}\/\d{2,4}/,
        "Date should match the format dd/mm/yyyy",
      )
      .test("once", "Please enter today's date or of the future", (value) => {
        // * date shouldn't be from past
        const dateArray = value.split("/").map((x) => parseInt(x));
        const date = new Date();
        const mday = date.getDate();
        // * month should be between 1-12
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return (
          dateArray[2] >= year && dateArray[1] >= month && dateArray[0] >= mday
        );
      })
      .transform((value: string) => {
        const [mday, month, year] = value.split("/").map((x) => parseInt(x));
        return `${mday}/${month}/${year}`;
      }),
  ).when("selected", {
    is: (selected: string[]) => selected.includes("once"),
    then: (once) => once.required("This field is required"),
  }),
  weekly: Yup.array(
    Yup.string()
      .ensure()
      .lowercase()
      .matches(
        /sun | mon | tue | wed | thu | fri| sat/i,
        "Value should be one of the following: sun, mon, tue, wed, thu, fri, sat",
      ),
  )
    .max(7)
    .when("selected", {
      is: (selected: string[]) => selected.includes("weekly"),
      then: (weekly) => weekly.required("This field is required"),
    }),
  monthly: Yup.array(
    Yup.number()
      .min(1, "Value should be greater than or equal to 1")
      .max(31, "Value should be less than or equal to 31")
      .required("Value should be a number"),
  )
    .max(31)
    .when("selected", {
      is: (selected: string[]) => selected.includes("monthly"),
      then: (monthly) => monthly.required("This field is required"),
    }),
});

export type AssignSchedule = Yup.InferType<typeof assignSchedule>;
export default assignSchedule;
