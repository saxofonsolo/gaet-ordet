import React, { useEffect } from "react";
import {
    Platform,
    SafeAreaView,
    UIManager,
    useColorScheme,
    View,
} from "react-native";
import codePush from "react-native-code-push";
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
import { SyncModal } from "./components/SyncModal.component";
import { isDevMode } from "./helpers/isDevMode.helper";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Stack = createNativeStackNavigator();

const AppContent = (): JSX.Element => {
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

class AppComponent extends React.Component {
    state = {
        checkSync: !isDevMode,
        syncProgress: 0,
    };

    constructor(props = {}) {
        super(props);
    }

    codePushStatusDidChange(status: codePush.SyncStatus) {
        switch (status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            case codePush.SyncStatus.SYNC_IN_PROGRESS:
            case codePush.SyncStatus.INSTALLING_UPDATE:
                if (!this.state.checkSync) {
                    this.setState({ checkSync: true });
                }
                break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
            case codePush.SyncStatus.UP_TO_DATE:
            case codePush.SyncStatus.UPDATE_INSTALLED:
            case codePush.SyncStatus.UNKNOWN_ERROR:
            case codePush.SyncStatus.UPDATE_IGNORED:
                if (this.state.checkSync) {
                    this.setState({ checkSync: false });
                }
                break;
        }
    }

    codePushDownloadDidProgress(progress: {
        receivedBytes: number;
        totalBytes: number;
    }) {
        this.setState({
            syncProgress: Math.round(
                (progress.receivedBytes / progress.totalBytes) * 100,
            ),
        });
    }

    render() {
        return (
            <>
                <AppContent />
                {this.state.checkSync && this.state.syncProgress > 0 && (
                    <SyncModal downloadProgress={this.state.syncProgress} />
                )}
            </>
        );
    }
}

const codePushOptions = {
    checkFrequency: isDevMode
        ? codePush.CheckFrequency.MANUAL
        : codePush.CheckFrequency.ON_APP_RESUME,
};

export const App = codePush(codePushOptions)(AppComponent);
