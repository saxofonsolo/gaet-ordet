import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameProvider } from "../../hooks/game.hook";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import { useAppData } from "../../hooks/appData.hook";
import { ScoreProvider } from "../../hooks/score.hook";
import { HomeModalLoserScreen } from "./HomeModalLoser.screen";
import { HomeMainScreen } from "./HomeMain.screen";
import { HomeModalWinnerScreen } from "./HomeModalWinner.screen";
import { HomeModalMenuScreen } from "./HomeModalMenu.screen";
import { HomeModalGiveUpScreen } from "./HomeModalGiveUp.screen";

const Stack = createNativeStackNavigator();

export const HomeRootScreen = (): JSX.Element => {
    const { appIsReady } = useAppData();
    return appIsReady ? (
        <ScoreProvider>
            <GameProvider>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name={SCREEN_NAMES.HOME.MAIN}
                        component={HomeMainScreen}
                    />
                    <Stack.Group
                        screenOptions={{
                            presentation: "transparentModal",
                            animation: "fade",
                            contentStyle: {
                                backgroundColor: "#000B",
                            },
                        }}
                    >
                        <Stack.Screen
                            name={SCREEN_NAMES.HOME.MODAL_LOSER}
                            component={HomeModalLoserScreen}
                        />
                        <Stack.Screen
                            name={SCREEN_NAMES.HOME.MODAL_WINNER}
                            component={HomeModalWinnerScreen}
                        />
                        <Stack.Screen
                            name={SCREEN_NAMES.HOME.MODAL_MENU}
                            component={HomeModalMenuScreen}
                        />
                        <Stack.Screen
                            name={SCREEN_NAMES.HOME.MODAL_GIVE_UP}
                            component={HomeModalGiveUpScreen}
                        />
                    </Stack.Group>
                </Stack.Navigator>
            </GameProvider>
        </ScoreProvider>
    ) : (
        <></>
    );
};
