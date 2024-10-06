import { ErrorMessage, FieldArray, Formik, FormikProps } from "formik";
import { OutlineButton, SolidButton } from "../Buttons";
import { FormNumberInput, PasswordInput, TextInput } from "../Input";
import { Form, FormSection, HorizontalLine } from "../Utilities";
import { useEffect, useRef } from "react";
import { useAlert } from "@/hooks/alert";
import { useDispatch, useSelector } from "react-redux";
import { AppStore } from "@/store";
import { submitConfig } from "@/utilities/forms";
import { COULDNT_CONNNECT_TO_DEVICE } from "@/constants/alert";
import settingsSchema from "@/schema/settings";
import { updateSettingsUnsafe } from "@/store/slice/settings";

export function SettingsForm() {
  const dispatch = useDispatch();
  const initialValues = useSelector((state: AppStore) => state.settings);

  const isSaved = useRef(false);
  const isDirty = useRef(false);
  const alert = useAlert();

  useEffect(() => {
    return () => {
      if (!isSaved.current && isDirty.current) {
        alert({
          title: "Settings not saved",
          description:
            "Settings have to be manually saved after being changed.",
          type: "info",
        });
        isDirty.current = false;
      }
    };
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={settingsSchema}
      onSubmit={async (values, actions) => {
        const res = await submitConfig(values);
        if (res.success) {
          alert({
            title: "Settings saved",
            description: "Settings saved on device successfully.",
            type: "info",
          });
          dispatch(updateSettingsUnsafe(values));
          actions.setSubmitting(false);
          isSaved.current = true;
        } else if (res.success == false) {
          alert({
            title: "Settings not saved",
            description: "Couldn't save settings due to invalid values",
            type: "error",
          });
        } else {
          alert(COULDNT_CONNNECT_TO_DEVICE);
        }
      }}
      component={({ values, ...props }: FormikProps<typeof initialValues>) => (
        <Form>
          {(isDirty.current = props.dirty)}
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
            <h2 className="mb-5 text-lg font-semibold">Network</h2>
            <div className="max-w-96">
              <FormNumberInput
                hideError={true}
                placeholder="Enter max connection attempts"
                label="Max connection attempts"
                name="network.connectionAttempts"
                value={values.network.connectionAttempts.toString()}
                onChange={props.handleChange}
              />
              <p className="text-sm italic text-hoki-500">
                Device will restart after maximum no. of connection attempts.
              </p>
              <div className="min-h-6">
                <ErrorMessage
                  component={"div"}
                  className="text-red-500"
                  name="network.connectionAttempts"
                />
              </div>
            </div>
            <p className="mb-3">Wi-Fi Settings</p>
            <FieldArray
              name="network.wlanCredentials"
              render={(arrayHelpers) => (
                <>
                  {values.network.wlanCredentials.map((cred, index) => (
                    <div
                      key={index}
                      className="mb-3 flex min-w-fit flex-wrap gap-2"
                    >
                      <div className="max-w-72">
                        <TextInput
                          label="SSID"
                          placeholder="Enter Wi-Fi name"
                          value={cred.ssid}
                          name={`network.wlanCredentials.${index}.ssid`}
                          id={`network.wlanCredentials.${index}.ssid`}
                          onChange={props.handleChange}
                        />
                      </div>
                      <div className="flex max-w-72 gap-2">
                        <PasswordInput
                          label="Password"
                          placeholder="Enter Wi-Fi password"
                          value={cred.password}
                          className="w-full min-w-0 bg-eclipse-elixir-400 px-2 pb-2 pt-1"
                          name={`network.wlanCredentials.${index}.password`}
                          onChange={props.handleChange}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-5 flex gap-2">
                    <SolidButton
                      type="button"
                      onClick={() => {
                        arrayHelpers.push({ ssid: "", password: "" });
                      }}
                      label="Add"
                      className="min-w-20"
                    />
                    <OutlineButton
                      type="button"
                      onClick={() => {
                        arrayHelpers.remove(-1);
                      }}
                      label="Remove"
                      className="min-w-20"
                    />
                  </div>
                  <div className="min-h-6">
                    <ErrorMessage
                      component={"div"}
                      className="text-red-500"
                      name="network.wlanCredentials"
                    />
                  </div>
                </>
              )}
            />
          </FormSection>
          <HorizontalLine />
          <FormSection>
            <h2 className="mb-5 text-lg font-semibold">Time</h2>
            <FormNumberInput
              allowNegative={true}
              placeholder="Enter offset (eg: 50, -50)"
              label="Time offset"
              name="time.offset"
              id="time.offset"
              value={values.time.offset.toString()}
              unit="secs"
              onChange={props.handleChange}
            />
          </FormSection>
          <HorizontalLine />
          <FormSection>
            <h2 className="mb-5 text-lg font-semibold">Schedule</h2>
            <FormNumberInput
              placeholder="Enter min gap between rings"
              label="Min gap between rings"
              name="schedule.minGapBetweenRings"
              id="schedule.minGapBetweenRings"
              value={values.schedule.minGapBetweenRings.toString()}
              unit="min"
              onChange={props.handleChange}
            />
            <FormNumberInput
              placeholder="Enter wait time (eg: 5, 45, 0.25)"
              label="Skip Missed Ring After"
              name="schedule.maxWaitForMissedschedule"
              id="schedule.maxWaitForMissedschedule"
              value={values.schedule.maxWaitForMissedschedule.toString()}
              unit="min"
              onChange={props.handleChange}
            />
          </FormSection>
          {props.dirty && (
            <>
              <HorizontalLine />
              <FormSection>
                <SolidButton
                  onClick={(e) => {
                    const event =
                      e as unknown as React.FormEvent<HTMLFormElement>;
                    props.handleSubmit(event);
                  }}
                  type="submit"
                  label="Save"
                />
              </FormSection>
            </>
          )}
        </Form>
      )}
    />
  );
}
