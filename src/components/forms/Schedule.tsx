import { OutlineButton, SolidButton } from "../Buttons";
import {
  FormTimeInput,
  FormSelectInput,
  FormCheckBox,
  FormNumberInput,
  FormTextInput,
} from "../Input";
import { submitSchedule } from "@/utilities/forms";
import { createContext, useContext, useRef } from "react";
import {
  Form,
  HorizontalLine,
  FormSection,
  CollapsibleSection,
} from "../Utilities";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "@/hooks/alert";
import { ScheduleDetailProps, ScheduleCreateContext, ModeType } from "@/types";
import { X } from "lucide-react";
import { Field, FieldArray, FieldArrayRenderProps, Formik } from "formik";
import { remove, setMode } from "@/store/slice/createScheduleForm";
import { AppStore } from "@/store";
import { CheckedState } from "@radix-ui/react-checkbox";
import createScheduleSchema, { CreateSchedule } from "@/schema/createSchedule";
import {
  COULDNT_CONNNECT_TO_DEVICE,
  SCHEDULE_CREATED,
  UNKNOWN_ERR,
} from "@/constants/alert";

const ScheduleCreateFormContext = createContext<ScheduleCreateContext>({
  index: 0,
  arrayHelpers: null,
  props: null,
});

export function ScheduleCreateForm() {
  const alert = useAlert();
  const arrayHelpersRef = useRef<FieldArrayRenderProps>();
  const initialValues: CreateSchedule = {
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
        const data = await submitSchedule(values);
        if (data.ok) {
          alert(SCHEDULE_CREATED);
        } else {
          if (data.error === "DEVICE_ERR") {
            alert({
              ...COULDNT_CONNNECT_TO_DEVICE,
              title: "Couldn't create schedule.",
            });
          } else if (data.error === "UNKNOWN_ERR") {
            alert({
              ...UNKNOWN_ERR,
              title: "Couldn't create schedule.",
            });
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
          <FormSection>
            {props.errors.schedules &&
            props.touched.schedules &&
            typeof props.errors.schedules === "string" ? (
              <div className="-mt-6 mb-1 text-red-500">
                {props.errors.schedules}
              </div>
            ) : null}
            <div className="flex flex-wrap content-center justify-between gap-4">
              <div className="flex flex-wrap content-center gap-4">
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
          </FormSection>
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
