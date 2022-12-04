import analytics from "@react-native-firebase/analytics";
import { isDevMode } from "./isDevMode.helper";

export const logEvent = (
    name: string,
    params?: { [key: string]: any },
): Promise<void> => {
    if (isDevMode) {
        console.log("LOG EVENT: " + name, params);
        return Promise.resolve();
    } else {
        return analytics().logEvent(name, params);
    }
};
