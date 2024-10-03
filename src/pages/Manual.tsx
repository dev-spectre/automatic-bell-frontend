import req from "@/api/requests";
import { SolidButton } from "@/components/Buttons";
import { FormNumberInput, FormSelectInput } from "@/components/Input";
import {
  CollapsibleSection,
  Form,
  FormSection,
  HorizontalLine,
  PageHeader,
} from "@/components/Utilities";
import { COULDNT_CONNNECT_TO_DEVICE } from "@/constants/alert";
import { useAlert } from "@/hooks/alert";
import manualFormSchema, { ScheduleMode } from "@/schema/manual";
import { getDeviceIp } from "@/utilities/device";
import { Field, Formik, FormikProps } from "formik";

export function Manual() {
  const alert = useAlert();
  const initialValues: ScheduleMode = {
    mode: "single",
    duration: NaN,
    ringCount: NaN,
    gap: NaN,
  };

  return (
    <>
      <PageHeader label="Manual" />
      <Formik
        initialValues={initialValues}
        validationSchema={manualFormSchema}
        onSubmit={async (values, actions) => {
          console.log(values);
          const modeString =
            values.mode === "single"
              ? `timer/${values.duration}`
              : `repeat/${values.ringCount}/${values.duration}/${values.gap}`;
          const deviceIp = await getDeviceIp();
          const res = await req.post(`http://${deviceIp}/bell/ring`, {
            mode: modeString,
          });
          if (!res.success) {
            alert(COULDNT_CONNNECT_TO_DEVICE);
          }
          actions.setSubmitting(false);
        }}
        component={({
          values,
          ...props
        }: FormikProps<typeof initialValues>) => (
          <Form>
            <FormSection>
              <div className="max-w-90 mb-5">
                <Field
                  as={FormSelectInput}
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
                  value={values.mode}
                  name="mode"
                  id="mode"
                  placeholder="Select a mode"
                  onValueChange={(value: string) => {
                    if (value === "single" || value === "repeat") {
                      props.setFieldValue("mode", value);
                      props.setFieldTouched("mode", true);
                    }
                  }}
                />
              </div>
            </FormSection>
            <HorizontalLine />
            {(values.mode === "single" || values.mode === "repeat") && (
              <FormSection>
                <CollapsibleSection label="Mode settings">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-4">
                      <Field
                        as={FormNumberInput}
                        label="Duration"
                        unit="secs"
                        placeholder="Ring duration"
                        name={"duration"}
                        id={"duration"}
                      />
                      {values.mode === "repeat" && (
                        <Field
                          as={FormNumberInput}
                          label="Gap"
                          unit="secs"
                          placeholder="Gap between rings"
                          name={"gap"}
                          id={"gap"}
                        />
                      )}
                    </div>
                  </div>
                  {values.mode === "repeat" && (
                    <Field
                      as={FormNumberInput}
                      label="No. of rings"
                      placeholder="Total no. of rings"
                      name={"ringCount"}
                      id={"ringCount"}
                    />
                  )}
                </CollapsibleSection>
              </FormSection>
            )}
            <HorizontalLine />
            <FormSection>
              <SolidButton
                type="submit"
                onClick={(e) => {
                  const event =
                    e as unknown as React.FormEvent<HTMLFormElement>;
                  props.handleSubmit(event);
                }}
                label="Ring"
              />
            </FormSection>
          </Form>
        )}
      />
    </>
  );
}
