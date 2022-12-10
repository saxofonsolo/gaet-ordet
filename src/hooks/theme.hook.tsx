import React, { useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { COLORS } from "../constants/colors.constants";

type ColorScheme = "auto" | "dark" | "light";

interface ThemeHook {
    isDarkMode: boolean;
    colorScheme: string;
    setColorScheme: React.Dispatch<React.SetStateAction<ColorScheme>>;
    colors: {
        background: string;
        surface: string;
        text: string;
        modal: string;
        sliderTrack: string;
        letter: {
            background: {
                default: string;
                correct: string;
                close: string;
                redundant: string;
            };
            border: {
                default: string;
                current: string;
                editMode: string;
                correct: string;
                close: string;
                redundant: string;
            };
            text: {
                default: string;
                editMode: string;
            };
        };
        keyboard: {
            background: {
                default: string;
                correct: string;
                close: string;
                redundant: string;
            };
            border: {
                default: string;
                correct: string;
                close: string;
                redundant: string;
            };
            text: {
                default: string;
                redundant: string;
            };
        };
    };
}

const ThemeContext = React.createContext<ThemeHook>({} as ThemeHook);

type Props = {
    children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props): JSX.Element => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>("auto");
    const isDarkModeDevice = useColorScheme() === "dark";
    const isDarkMode =
        colorScheme === "auto" ? isDarkModeDevice : colorScheme === "dark";

    const colors = useMemo(
        () => ({
            background: isDarkMode ? COLORS.BLACK : COLORS.WHITE,
            surface: isDarkMode ? "#171717" : "#EEE",
            text: isDarkMode ? COLORS.WHITE : COLORS.BLACK,
            modal: isDarkMode ? "#222" : COLORS.WHITE,
            sliderTrack: isDarkMode ? COLORS.WHITE : "#777",
            letter: {
                background: {
                    default: isDarkMode ? "#070707" : COLORS.WHITE,
                    correct: isDarkMode ? COLORS.CYAN_DARKER : COLORS.CYAN,
                    close: isDarkMode ? COLORS.ORANGE_DARKER : COLORS.ORANGE,
                    redundant: isDarkMode ? "#222" : "#DDD",
                },
                border: {
                    default: isDarkMode ? "#333" : "#CCC",
                    current: isDarkMode ? "#777" : "#888",
                    editMode: isDarkMode ? COLORS.PINK : COLORS.PINK_DARK,
                    correct: isDarkMode ? COLORS.CYAN : COLORS.CYAN_DARK,
                    close: isDarkMode ? COLORS.ORANGE : COLORS.ORANGE_DARK,
                    redundant: isDarkMode ? "#2220" : "#DDD0",
                },
                text: {
                    default: isDarkMode ? "#EEE" : "#111",
                    editMode: "#7f7f7f",
                },
            },
            keyboard: {
                background: {
                    default: isDarkMode ? "#222" : "#DDD",
                    correct: isDarkMode ? COLORS.CYAN_DARKER : COLORS.CYAN,
                    close: isDarkMode ? COLORS.ORANGE_DARKER : COLORS.ORANGE,
                    redundant: isDarkMode ? COLORS.BLACK : COLORS.WHITE,
                },
                border: {
                    default: isDarkMode ? "#333" : "#CCC",
                    correct: isDarkMode ? COLORS.CYAN : COLORS.CYAN_DARK,
                    close: isDarkMode ? COLORS.ORANGE : COLORS.ORANGE_DARK,
                    redundant: isDarkMode ? "#222" : "#DDD",
                },
                text: {
                    default: isDarkMode ? "#DDD" : "#222",
                    redundant: isDarkMode ? "#555" : "#0008",
                },
            },
        }),
        [isDarkMode],
    );

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                colorScheme,
                setColorScheme,
                colors,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeHook => React.useContext(ThemeContext);
