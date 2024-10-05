import { useUpdate } from "@/hooks/update";
import { memo } from "react";

//* useUpdate should be at the topmost level possible that doesn't rerender often.
export const Update = memo(() => {
  useUpdate();
  //* memo doesn't work with react fragments
  return <div></div>;
});
