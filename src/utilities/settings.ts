import { Config } from "@/store/slice/settings";

//* Compares both objecst assuming structure and types are same
export function getChangedConfigFields(newConfig: Config, oldConfig: Config) {
  const changed: { [key: string]: any } = {};
  Object.keys(oldConfig).forEach((categoryString) => {
    const category = categoryString as keyof Config;
    Object.keys(oldConfig[category]).forEach((keyString) => {
      const key = keyString as keyof Config[keyof Config];
      const oldValue: any = oldConfig[category][key];
      const newValue: any = newConfig[category][key];
      let isChanged = newValue === oldValue;
      if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        if (oldValue.length === newValue.length) {
          isChanged = newValue.every((newValueElement) =>
            oldValue.some((oldValueElement) => {
              for (const property in newValueElement) {
                if (newValueElement[property] !== oldValueElement[property]) {
                  return false;
                }
              }
              return true;
            }),
          );
        }
      }
      if (isChanged) {
        const path = `${category}.${key}`;
        changed[path] = newConfig[key];
      }
    });
  });
}
