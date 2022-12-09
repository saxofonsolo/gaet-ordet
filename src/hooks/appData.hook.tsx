import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { APP_IDENTIFIER } from "../constants/app.constants";
import pkg from "../../package.json";
import { logEvent } from "../helpers/logEvent.helper";
import { isDevMode } from "../helpers/isDevMode.helper";
import { Difficulty, WordLength } from "./game.hook";

const STORAGE_NAMES = {
    SETTINGS: `@${APP_IDENTIFIER}:settings`,
};

interface Settings {
    difficulty?: Difficulty;
    wordLength?: WordLength;
}

interface AppDataHook {
    appIsReady: boolean;
    appVersion: string;
    userId: string;
    settings: {
        get: Settings;
        set: (settings: Settings) => Promise<void>;
        clear: () => void;
    };
    isMenuOpen: boolean;
    setIsMenuOpen: (state: boolean) => void;
}

const AppDataContext = React.createContext<AppDataHook>({
    appIsReady: false,
    appVersion: "",
    userId: "",
    settings: {
        get: {},
        set: () => Promise.reject(),
        clear: () => null,
    },
    isMenuOpen: false,
    setIsMenuOpen: () => null,
});

type Props = {
    children: React.ReactNode;
};

export const AppDataProvider = ({ children }: Props): JSX.Element => {
    const [appIsReady, setAppIsReady] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [settings, setSettings] = useState<Settings>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getSettings = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem(STORAGE_NAMES.SETTINGS);
            if (value !== null) {
                console.log("get", JSON.parse(value));
                return Promise.resolve(JSON.parse(value) as Settings);
            }
            return Promise.reject();
        } catch (error) {
            return Promise.reject(error);
        }
    }, []);

    const storeSettings = useCallback(
        async (newSettings: Settings) => {
            try {
                const mergedSettings = { ...(settings || {}), ...newSettings };
                return await AsyncStorage.setItem(
                    STORAGE_NAMES.SETTINGS,
                    JSON.stringify(mergedSettings),
                ).then(() => {
                    setSettings(mergedSettings);
                });
            } catch (error) {
                return Promise.reject();
            }
        },
        [settings],
    );

    const clearSettings = useCallback(async () => {
        try {
            return await AsyncStorage.removeItem(STORAGE_NAMES.SETTINGS).then(
                () => setSettings({}),
            );
        } catch (error) {
            return Promise.reject();
        }
    }, []);

    useEffect(() => {
        if (!settings) {
            getSettings()
                .then((storedSettings) => setSettings(storedSettings))
                .catch(() => setSettings({}));
        }
    }, [settings, getSettings]);

    useEffect(() => {
        if (!appIsReady && settings && userId) {
            setAppIsReady(true);
        }
    }, [appIsReady, settings, userId]);

    useEffect(() => {
        auth()
            .signInAnonymously()
            .then(({ user }) => {
                firestore()
                    .collection("users")
                    .doc(user.uid)
                    .get()
                    .then((res) => {
                        if (!res.data()) {
                            firestore()
                                .collection("users")
                                .doc(user.uid)
                                .set({
                                    isDev: isDevMode || undefined,
                                    createdAt:
                                        firestore.FieldValue.serverTimestamp(),
                                })
                                .then(() => setUserId(user.uid));
                        } else {
                            setUserId(user.uid);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        setUserId(user.uid);
                    });
            })
            .catch((error) => {
                if (error.code === "auth/operation-not-allowed") {
                    logEvent("error", {
                        message: "Enable anonymous in your firebase console.",
                    });
                } else {
                    logEvent("error", {
                        message:
                            error.name +
                            ": " +
                            error.message +
                            " (" +
                            error.code +
                            ")",
                    });
                }

                console.error(error);
            });
    }, []);

    return (
        <AppDataContext.Provider
            value={{
                appIsReady,
                appVersion: pkg.version,
                userId,
                settings: {
                    get: settings || ({} as Settings),
                    set: storeSettings,
                    clear: clearSettings,
                },
                isMenuOpen,
                setIsMenuOpen,
            }}
        >
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = (): AppDataHook => React.useContext(AppDataContext);
