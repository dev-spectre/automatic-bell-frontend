import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useAlert } from "./alert";
import { useEffect, useRef } from "react";
import { RawToast } from "@/types";

export function useUpdate() {
  const alert = useAlert();

  const hasCheckedForUpdate = useRef(false);

  useEffect(() => {
    if (!hasCheckedForUpdate.current) {
      hasCheckedForUpdate.current = true;
      handleUpdate(alert);
    }
  }, []);
}

async function handleUpdate(alert: (toast: RawToast) => void) {
  if (!window.hasOwnProperty("__TAURI_INTERNALS__")) {
    return;
  }

  const update = await check();
  if (!update) return;

  await update.downloadAndInstall((e) => {
    if (e.event === "Started") {
      alert({
        title: `Updating to ${update.version}`,
        description: "Download started please do not close the app.",
        type: "info",
      });
    } else if (e.event === "Finished") {
      alert({
        title: "Download finished",
        description: "Restart app to apply changes.",
        type: "info",
      });
    }
  });

  await relaunch();
}
