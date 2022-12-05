import React, { useEffect } from "react";
import {
    Platform,
    SafeAreaView,
    UIManager,
    useColorScheme,
    View,
} from "react-native";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ToastProvider } from "react-native-toast-notifications";
import { COLORS } from "./constants/colors.constants";
import { HomeRootScreen } from "./screens/home/HomeRoot.screen";
import { SCREEN_NAMES } from "./constants/screenNames.constants";
import { FONTS } from "./constants/fonts.constants";
import { AppDataProvider } from "./hooks/appData.hook";
import { ComponentsRootScreen } from "./screens/components/ComponentsRoot.screen";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Stack = createNativeStackNavigator();

export const App = (): JSX.Element => {
    const isDarkMode = useColorScheme() === "dark";

    useEffect(() => {
        void SystemNavigationBar.stickyImmersive();
    }, []);

    return (
        <SafeAreaView
            style={{
                backgroundColor: isDarkMode ? COLORS.BLACK : COLORS.WHITE,
            }}
        >
            <AppDataProvider>
                <ToastProvider
                    offsetTop={40}
                    duration={3000}
                    animationDuration={150}
                    style={{ paddingHorizontal: 20 }}
                    textStyle={{
                        fontFamily: FONTS.BOLD,
                        fontSize: 16,
                        textTransform: "uppercase",
                        color: COLORS.BLACK,
                        textAlign: "center",
                    }}
                    warningColor={
                        isDarkMode ? COLORS.ORANGE_DARK : COLORS.ORANGE
                    }
                >
                    <View style={{ height: "100%" }}>
                        <NavigationContainer>
                            <Stack.Navigator>
                                <Stack.Screen
                                    name={SCREEN_NAMES.home.root}
                                    component={HomeRootScreen}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name={SCREEN_NAMES.componentLibrary.root}
                                    component={ComponentsRootScreen}
                                    options={{ headerShown: false }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </View>
                </ToastProvider>
            </AppDataProvider>
        </SafeAreaView>
    );
};
