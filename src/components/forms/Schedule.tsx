import { OutlineButton, SolidButton } from "../Buttons";
import {
  FormTimeInput,
  FormSelectInput,
  FormCheckBox,
  FormNumberInput,
  FormTextInput,
  FormDatePicker,
  FormWeekdays,
  FormMonthdays,
} from "../Input";
import { assignSchedule, submitSchedule } from "@/utilities/forms";
import { createContext, useContext, useRef } from "react";
import {
  Form,
  HorizontalLine,
  FormSection,
  CollapsibleSection,
} from "../Utilities";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "@/hooks/alert";
import {
  ScheduleDetailProps,
  ScheduleCreateContext,
  ModeType,
  SelectOptionValue,
} from "@/types";
import { X } from "lucide-react";
import {
  ErrorMessage,
  Field,
  FieldArray,
  FieldArrayRenderProps,
  Formik,
  FormikProps,
} from "formik";
import { remove, setMode } from "@/store/slice/createScheduleForm";
import { AppStore } from "@/store";
import { CheckedState } from "@radix-ui/react-checkbox";
import createScheduleSchema, { Schedule } from "@/schema/createSchedule";
import {
  COULDNT_CONNNECT_TO_DEVICE,
  DEVICE_ID_NOT_FOUND,
  SCHEDULE_ASSIGNED,
  SCHEDULE_CREATED,
  UNKNOWN_ERR,
} from "@/constants/alert";
import { addSchedules } from "@/store/slice/schedules";
import assignScheduleSchema, { AssignSchedule } from "@/schema/assignSchedule";

const ScheduleCreateFormContext = createContext<ScheduleCreateContext>({
  index: 0,
  arrayHelpers: null,
  props: null,
});

export function ScheduleCreateForm() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const arrayHelpersRef = useRef<FieldArrayRenderProps>();
  const initialValues: Schedule = {
    scheduleName: "",
    schedules: [
      {
        start: "",
        end: "",
        type: "session",
        includeEndTime: true,
        interval: NaN,
        mode: {
          type: "",
          gap: NaN,
          ringCount: NaN,
          duration: NaN,
        },
      },
    ],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createScheduleSchema}
      onSubmit={async (values, actions) => {
        values = createScheduleSchema.cast(values);
        const res = await submitSchedule(values);
        if (res.ok) {
          alert(SCHEDULE_CREATED);
          dispatch(
            addSchedules({
              schedules: [values],
            }),
          );
        } else {
          if (res.error === "DEVICE_ERR") {
            alert({
              ...COULDNT_CONNNECT_TO_DEVICE,
              title: "Couldn't create schedule.",
            });
          } else if (res.error === "UNKNOWN_ERR") {
            alert({
              ...UNKNOWN_ERR,
              title: "Couldn't create schedule.",
            });
          } else if (res.error === "DEVICE_ID_NOT_FOUND") {
            alert(DEVICE_ID_NOT_FOUND);
          }
        }
        actions.setSubmitting(false);
      }}
      component={(props) => (
        <Form {...props}>
          <FormSection>
            <button
              className="w-full text-right text-hoki-500"
              onClick={props.handleReset}
              type="button"
            >
              Reset
            </button>
          </FormSection>
          <FormSection>
            <Field
              as={FormTextInput}
              className="placeholder-hoki-500 placeholder:italic"
              label="Schedule Name"
              placeholder="Enter schedule name"
              name="scheduleName"
            />
          </FormSection>
          <HorizontalLine />
          <FieldArray
            name="schedules"
            render={(arrayHelpers) => {
              arrayHelpersRef.current = arrayHelpers;
              const schedules = props.values.schedules;

              return (
                <>
                  {schedules.map((schedule, index) => (
                    <ScheduleCreateFormContext.Provider
                      value={{
                        arrayHelpers,
                        index,
                        props,
                      }}
                      key={index}
                    >
                      <ScheduleDetail
                        type={(() => {
                          return schedule.type === "session" ||
                            schedule.type === "additional"
                            ? schedule.type
                            : "session";
                        })()}
                        index={index}
                      />
                    </ScheduleCreateFormContext.Provider>
                  ))}
                </>
              );
            }}
          />
          <div className="@container">
            {props.errors.schedules &&
            props.touched.schedules &&
            typeof props.errors.schedules === "string" ? (
              <div className="-mt-6 mb-1 px-7 text-red-500">
                {props.errors.schedules}
              </div>
            ) : null}
            <div className="flex flex-wrap justify-center gap-4 @[672px]:justify-between">
              <div className="flex flex-wrap justify-center gap-4 px-7">
                <OutlineButton
                  label="Add session"
                  onClick={() => {
                    arrayHelpersRef.current?.push({
                      start: "",
                      end: "",
                      includeEndTime: true,
                      interval: NaN,
                      type: "session",
                      mode: {
                        type: "",
                        gap: NaN,
                        ringCount: NaN,
                        duration: NaN,
                      },
                    });
                  }}
                />
                <OutlineButton
                  label="Add Additional Bell"
                  onClick={() => {
                    arrayHelpersRef.current?.push({
                      type: "additional",
                      start: "",
                      mode: {
                        type: "",
                        gap: NaN,
                        ringCount: NaN,
                        duration: NaN,
                      },
                    });
                  }}
                />
              </div>
              <div className="mb-3 mt-3 w-full border-t border-t-hoki-600 @[672px]:hidden"></div>
              <div className="px-7">
                <SolidButton
                  onClick={(e) => {
                    const event =
                      e as unknown as React.FormEvent<HTMLFormElement>;
                    props.handleSubmit(event);
                  }}
                  type="submit"
                  label="Confirm"
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    />
  );
}

function ScheduleDetail({ type }: ScheduleDetailProps) {
  return (
    <>
      <FormSection>
        {type !== "additional" ? <Session /> : <AdditionalBell />}
        <ModeDetails />
      </FormSection>
      <HorizontalLine />
    </>
  );
}

function ModeDetails() {
  const { index } = useContext(ScheduleCreateFormContext);
  const mode = useSelector((state: AppStore) => state.createScheduleForm.mode);
  const isSingle = mode.single.includes(index);
  const isRepeat = mode.repeat.includes(index);

  return (
    (isRepeat || isSingle) && (
      <div>
        <CollapsibleSection label="Mode settings">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-4">
              <Field
                as={FormNumberInput}
                label="Duration"
                unit="secs"
                placeholder="Ring duration"
                name={`schedules.${index}.mode.duration`}
                id={`schedules.${index}.mode.duration`}
              />
              {isRepeat && (
                <Field
                  as={FormNumberInput}
                  label="Gap"
                  unit="secs"
                  placeholder="Gap between rings"
                  name={`schedules.${index}.mode.gap`}
                  id={`schedules.${index}.mode.gap`}
                />
              )}
            </div>
          </div>
          {isRepeat && (
            <Field
              as={FormNumberInput}
              label="No. of rings"
              placeholder="Total no. of rings"
              name={`schedules.${index}.mode.ringCount`}
              id={`schedules.${index}.mode.ringCount`}
            />
          )}
        </CollapsibleSection>
      </div>
    )
  );
}

function AdditionalBell() {
  const { index, arrayHelpers, props } = useContext(ScheduleCreateFormContext);
  const { setFieldValue } = props;
  const dispatch = useDispatch();
  const modeRef = useRef<ModeType | undefined>();
  const mode = props.values.schedules[index].mode.type;

  return (
    <>
      <div className="flex justify-between">
        <h3 className="mb-5 text-lg font-semibold">Additional Bell</h3>
        {props.values.schedules.length - 1 == index && (
          <button
            className="self-start"
            type="button"
            onClick={() => {
              arrayHelpers?.remove(index);
              if (modeRef.current) {
                dispatch(
                  remove({
                    type: modeRef.current,
                    value: index,
                  }),
                );
              }
            }}
          >
            <X className="text-hoki-500" />
          </button>
        )}
      </div>
      <div className="max-w-90 mb-5 flex flex-wrap items-center gap-4">
        <Field
          name={`schedules.${index}.start`}
          id={`schedules.${index}.start`}
          as={FormTimeInput}
          label="Start time"
        />
        <Field
          as={FormSelectInput}
          name={`schedules.${index}.mode.type`}
          id={`schedules.${index}.mode.type`}
          label="Mode"
          options={[
            {
              value: "single",
              label: "Single chime",
            },
            {
              value: "repeat",
              label: "Repeat chime",
            },
          ]}
          value={mode}
          placeholder="Select a mode"
          onValueChange={(value: string) => {
            setFieldValue(`schedules.${index}.mode.type`, value);
            if (value === "single" || value === "repeat") {
              modeRef.current = value;
              dispatch(setMode({ type: value, value: index }));
            }
          }}
        />
      </div>
    </>
  );
}

function Session() {
  const { index, arrayHelpers, props } = useContext(ScheduleCreateFormContext);
  const { setFieldValue, values } = props;
  const dispatch = useDispatch();
  const modeRef = useRef<ModeType | undefined>();
  const mode = props.values.schedules[index].mode.type;

  return (
    <>
      <div className="flex justify-between">
        <h3 className="mb-5 text-lg font-semibold">Session</h3>
        {props.values.schedules.length - 1 == index && (
          <button
            className="self-start"
            type="button"
            onClick={() => {
              arrayHelpers?.remove(index);
              if (modeRef.current) {
                dispatch(
                  remove({
                    type: modeRef.current,
                    value: index,
                  }),
                );
              }
            }}
          >
            <X className="text-hoki-500" />
          </button>
        )}
      </div>
      <div className="max-w-90 flex flex-wrap items-center gap-4">
        <Field
          name={`schedules.${index}.start`}
          id={`schedules.${index}.start`}
          as={FormTimeInput}
          label="Start time"
        />
        <Field
          name={`schedules.${index}.end`}
          id={`schedules.${index}.end`}
          as={FormTimeInput}
          label="End time"
          className="max-w-sm"
        />
        <div className="mb-3 self-end">
          <Field
            name={`schedules.${index}.includeEndTime`}
            id={`schedules.${index}.includeEndTime`}
            component={FormCheckBox}
            label="Include end time"
            onCheckedChange={(state: CheckedState) => {
              if (typeof state === "boolean") {
                setFieldValue(`schedules.${index}.includeEndTime`, state);
              } else {
                setFieldValue(`schedules.${index}.includeEndTime`, true);
              }
            }}
            defaultChecked={values.schedules[index].includeEndTime}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <Field
            name={`schedules.${index}.mode.type`}
            id={`schedules.${index}.mode.type`}
            component={FormSelectInput}
            label="Mode"
            options={[
              {
                value: "single",
                label: "Single chime",
              },
              {
                value: "repeat",
                label: "Repeat chime",
              },
            ]}
            value={mode}
            placeholder="Select a mode"
            onValueChange={(value: string) => {
              setFieldValue(`schedules.${index}.mode.type`, value);
              if (value === "single" || value === "repeat") {
                modeRef.current = value;
                dispatch(setMode({ type: value, value: index }));
              }
            }}
          />
          <Field
            name={`schedules.${index}.interval`}
            id={`schedules.${index}.interval`}
            as={FormNumberInput}
            label="Intervals"
            unit="min"
            placeholder="Gap between bells"
          />
        </div>
      </div>
    </>
  );
}

export function AssignScheduleForm() {
  const alert = useAlert();
  const scheduels = useSelector((store: AppStore) => store.schedules.schedules);
  const scheduleListOptionValues: SelectOptionValue[] = [];
  Object.keys(scheduels).forEach((scheduel) => {
    scheduleListOptionValues.push({
      value: scheduel,
      label: scheduel,
    });
  });
  const initialValues: AssignSchedule = {
    schedule: "",
    selected: ["weekly"],
    once: [],
    weekly: [],
    monthly: [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={assignScheduleSchema}
      onSubmit={async (values, actions) => {
        console.log(values);
        const data = await assignSchedule(values);
        if (data.ok) {
          alert(SCHEDULE_ASSIGNED);
        } else {
          if (data.error === "DEVICE_ERR") {
            alert({
              ...COULDNT_CONNNECT_TO_DEVICE,
              title: "Couldn't assign schedule.",
            });
          } else if (data.error === "UNKNOWN_ERR") {
            alert({
              ...UNKNOWN_ERR,
              title: "Couldn't assign schedule.",
            });
          } else if (data.error === "DEVICE_ID_NOT_FOUND") {
            alert(DEVICE_ID_NOT_FOUND);
          }
        }
        actions.setSubmitting(false);
      }}
      component={({
        setFieldValue,
        setFieldTouched,
        values,
        ...props
      }: FormikProps<typeof initialValues>) => (
        <Form {...props}>
          <FormSection>
            <button
              className="w-full text-right text-hoki-500"
              onClick={props.handleReset}
              type="button"
            >
              Reset
            </button>
          </FormSection>
          <FormSection>
            <Field
              as={FormSelectInput}
              name={`schedule`}
              id={`schedule`}
              label="Schedule"
              options={scheduleListOptionValues}
              value={values.schedule}
              placeholder="Select a mode"
              onValueChange={(value: string) => {
                setFieldTouched("schedule", true);
                setFieldValue("schedule", value);
              }}
            />
          </FormSection>
          <HorizontalLine />
          <FormSection>
            <h3 className="mb-3">Type</h3>
            <div className="flex flex-wrap gap-2">
              <FormCheckBox
                id="select-weekly"
                label="Weekly"
                defaultChecked={values.selected.includes("weekly")}
                onCheckedChange={(state: CheckedState) => {
                  if (state === "indeterminate") return;
                  setFieldTouched("selected", true);
                  if (state) {
                    setFieldValue("selected", ["weekly", ...values.selected]);
                  } else {
                    const selected = values.selected.filter(
                      (value) => value != "weekly",
                    );
                    setFieldValue("selected", selected);
                  }
                }}
              />
              <FormCheckBox
                id="select-once"
                label="Once"
                defaultChecked={values.selected.includes("once")}
                onCheckedChange={(state: CheckedState) => {
                  if (state === "indeterminate") return;
                  setFieldTouched("selected", true);
                  if (state) {
                    setFieldValue("selected", ["once", ...values.selected]);
                  } else {
                    const selected = values.selected.filter(
                      (value) => value != "once",
                    );
                    setFieldValue("selected", selected);
                  }
                }}
              />
              <FormCheckBox
                id="select-monthly"
                label="Monthly"
                defaultChecked={values.selected.includes("monthly")}
                onCheckedChange={(state: CheckedState) => {
                  if (state === "indeterminate") return;
                  setFieldTouched("selected", true);
                  if (state) {
                    setFieldValue("selected", ["monthly", ...values.selected]);
                  } else {
                    const selected = values.selected.filter(
                      (value) => value != "monthly",
                    );
                    setFieldValue("selected", selected);
                  }
                }}
              />
            </div>
            <div className="min-h-6">
              <ErrorMessage
                component={"div"}
                className="text-red-500"
                name={"selected"}
              />
            </div>
          </FormSection>
          <HorizontalLine />
          {values.selected.includes("weekly") && (
            <>
              <FormSection>
                <h3 className="mb-3">Weekly</h3>
                <FormWeekdays
                  name="weekly"
                  value={values.weekly}
                  touched={props.touched.weekly ?? false}
                  onChange={(values) => {
                    console.log(props);
                    setFieldTouched("weekly", true);
                    setFieldValue("weekly", values);
                  }}
                />
                <div className="min-h-6">
                  <ErrorMessage
                    component={"div"}
                    className="text-red-500"
                    name={"weekly"}
                  />
                </div>
              </FormSection>
              <HorizontalLine />
            </>
          )}
          {values.selected.includes("once") && (
            <>
              <FormSection>
                <h3 className="mb-3">Once</h3>
                <FormDatePicker
                  onChange={(values) => {
                    setFieldTouched("once", true);
                    setFieldValue("once", values);
                  }}
                  value={values.once}
                  id="once"
                  label=""
                />
                <div className="min-h-6">
                  <ErrorMessage
                    component={"div"}
                    className="text-red-500"
                    name={"once"}
                  />
                </div>
              </FormSection>
              <HorizontalLine />
            </>
          )}
          {values.selected.includes("monthly") && (
            <>
              <FormSection>
                <h3 className="mb-3">Monthly</h3>
                <FormMonthdays
                  touched={props.touched.monthly ?? false}
                  value={values.monthly}
                  name="monthly"
                  onChange={(values) => {
                    setFieldTouched("monthly", true);
                    setFieldValue("monthly", values);
                  }}
                />
                <div className="min-h-6">
                  <ErrorMessage
                    component={"div"}
                    className="text-red-500"
                    name={"monthly"}
                  />
                </div>
              </FormSection>
              <HorizontalLine />
            </>
          )}
          <div className="px-7">
            <div className="flex justify-center md:justify-end">
              <SolidButton
                onClick={(e) => {
                  const event =
                    e as unknown as React.FormEvent<HTMLFormElement>;
                  props.handleSubmit(event);
                }}
                type="submit"
                label="Confirm"
              />
            </div>
          </div>
        </Form>
      )}
    />
  );
}
