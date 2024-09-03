import { PencilLine, Trash } from "lucide-react";
import { HorizontalLine, Overlay } from "./Utilities";
import { useSelector } from "react-redux";
import { AppStore } from "@/store";
import { Schedule } from "@/schema/createSchedule";
import { expandSchedule } from "@/utilities/forms";
import req from "@/api/requests";
import { getDeviceId, getDeviceIp } from "@/utilities/device";
import { useAlert } from "@/hooks/alert";
import {
  COULDNT_CONNNECT_TO_DEVICE,
  DEVICE_ID_NOT_FOUND,
  SCHEDULE_DELETED,
} from "@/constants/alert";
import { useDispatch } from "react-redux";
import { removeSchedules } from "@/store/slice/schedules";
import {
  AlertDialogProps,
  DeleteConfirmationProps,
  EditScheduleFormProps,
} from "@/types";
import { useState } from "react";
import { ScheduleForm } from "./forms/Schedule";

export function AlertDialog({
  title,
  label,
  onConfirm,
  onCancel,
  className,
}: AlertDialogProps) {
  return (
    <div
      className={`rounded bg-eclipse-elixir-500 px-4 py-4 text-xs sm:text-sm md:text-base ${className}`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-4 mt-1">{label}</p>
      <div className="flex justify-end gap-2 text-black">
        <button
          className="min-w-24 rounded bg-orange-450 px-4 py-1"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="min-w-24 rounded bg-hoki-600 px-4 py-1"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export function SchedulePreviewTable({ schedule }: { schedule: Schedule }) {
  const expandedSchedule = expandSchedule(schedule);

  return (
    <table className="w-full min-w-72 overflow-x-scroll text-center">
      <thead className="border-b-hoki-600 text-xs md:text-base">
        <tr className="border-b-4 border-b-transparent">
          <th>Time</th>
          <th>Duration</th>
          <th>Ring count</th>
          <th>Gap</th>
        </tr>
      </thead>
      <tbody className="font-mono text-xs md:text-base">
        {Object.entries(expandedSchedule)
          .sort()
          .map((schedule, index) => (
            <tr key={index}>
              <td>
                <span aria-hidden={true} className="not-sr-only">
                  {schedule[0].slice(0, 5).replace(/0/g, "O")}
                </span>
                <span className="sr-only">{schedule[0].slice(0, 5)}</span>
              </td>
              <td>
                <span aria-hidden={true} className="not-sr-only">
                  {schedule[1].duration.replace(/0/g, "O")}
                </span>
                <span className="sr-only">{schedule[1].duration}</span>
              </td>
              <td>
                <span aria-hidden={true} className="not-sr-only">
                  {schedule[1].ringCount.toString().replace(/0/g, "O")}
                </span>
                <span className="sr-only">{schedule[1].ringCount}</span>
              </td>
              <td>
                <span aria-hidden={true} className="not-sr-only">
                  {schedule[1].gap.replace(/0/g, "O")}
                </span>
                <span className="sr-only">{schedule[1].gap}</span>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export function DeleteConfirmation({
  scheduleName,
  isVisible,
  setIsVisible,
}: DeleteConfirmationProps) {
  const alert = useAlert();
  const dispatch = useDispatch();

  return (
    isVisible.includes(scheduleName) && (
      <Overlay
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.id === "overlay")
            setIsVisible((isVisible) => {
              return isVisible.filter((value) => value != scheduleName);
            });
        }}
      >
        <AlertDialog
          className="max-w-lg"
          onCancel={() => {
            setIsVisible((isVisible) => {
              return isVisible.filter((value) => value != scheduleName);
            });
          }}
          onConfirm={async () => {
            setIsVisible((isVisible) => {
              return isVisible.filter((value) => value != scheduleName);
            });
            const deviceId = getDeviceId();
            if (!deviceId) {
              alert(DEVICE_ID_NOT_FOUND);
              return;
            }
            const deviceIp = await getDeviceIp(deviceId);
            const res = await req.delete(`http://${deviceIp}/schedule`, {
              keys: [scheduleName],
            });
            if (res.success) {
              alert(SCHEDULE_DELETED);
              dispatch(
                removeSchedules({
                  schedules: [scheduleName],
                }),
              );
            } else {
              alert(COULDNT_CONNNECT_TO_DEVICE);
            }
          }}
          title="Are you sure?"
          label={`You will be permenantly deleting schedule "${scheduleName}", this action is non reversable.`}
        />
      </Overlay>
    )
  );
}

export function EditScheduleForm({
  scheduleName,
  isVisible,
  setIsVisible,
}: EditScheduleFormProps) {
  return (
    isVisible.includes(scheduleName) && (
      <Overlay
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.id === "overlay")
            setIsVisible((isVisible) => {
              return isVisible.filter((value) => value != scheduleName);
            });
        }}
      >
        <ScheduleForm
          onClose={() => {
            setIsVisible((isVisible) => {
              return isVisible.filter((value) => value != scheduleName);
            });
          }}
          scheduleName={scheduleName}
          edit={true}
        />
      </Overlay>
    )
  );
}

export function EditScheduleList() {
  const [visibleEditForm, setVisibleEditForm] = useState<string[]>([]);
  const schedules = useSelector((store: AppStore) => store.schedules.schedules);
  const [visibleDeleteConfirmation, setVisibleDeleteConfirmation] = useState<
    string[]
  >([]);

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(schedules)
        .sort()
        .map((value) => (
          <div key={value[0]} className="rounded bg-eclipse-elixir-500 py-2">
            <EditScheduleForm
              scheduleName={value[0]}
              isVisible={visibleEditForm}
              setIsVisible={setVisibleEditForm}
            />
            <DeleteConfirmation
              scheduleName={value[0]}
              isVisible={visibleDeleteConfirmation}
              setIsVisible={setVisibleDeleteConfirmation}
            />
            <div className="flex justify-between px-4 py-1">
              <p className="overflow-hidden text-ellipsis font-medium md:text-lg">
                {value[0]}
              </p>
              <div className="flex gap-4 text-hoki-500">
                <button
                  onClick={() => {
                    setVisibleEditForm([value[0], ...visibleEditForm]);
                  }}
                >
                  <PencilLine className="h-4 w-4 md:h-6 md:w-6" />
                </button>
                <button
                  onClick={() => {
                    setVisibleDeleteConfirmation([
                      value[0],
                      ...visibleDeleteConfirmation,
                    ]);
                  }}
                >
                  <Trash className="h-4 w-4 md:h-6 md:w-6" />
                </button>
              </div>
            </div>
            <HorizontalLine />
            <div className="-mt-3 overflow-x-scroll px-4">
              <SchedulePreviewTable
                schedule={{
                  scheduleName: value[0],
                  schedules: value[1],
                }}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
