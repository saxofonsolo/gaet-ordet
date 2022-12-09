import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameProvider } from "../../hooks/game.hook";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import { useAppData } from "../../hooks/appData.hook";
import { ScoreProvider } from "../../hooks/score.hook";
import { HomeModalLoserScreen } from "./HomeModalLoser.screen";
import { HomeMainScreen } from "./HomeMain.screen";
import { HomeMenuScreen } from "./HomeMenu.component";
import { HomeModalWinnerScreen } from "./HomeModalWinner.screen";
import { HomeModalNewGameScreen } from "./HomeModalNewGame.screen";
import { HomeModalGiveUpScreen } from "./HomeModalGiveUp.screen";

const Stack = createNativeStackNavigator();

export const HomeRootScreen = (): JSX.Element => {
    const { appIsReady } = useAppData();
    return appIsReady ? (
        <ScoreProvider>
            <GameProvider>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name={SCREEN_NAMES.home.main}
                        component={HomeMainScreen}
                    />
                    <Stack.Screen
                        name={SCREEN_NAMES.home.menu}
                        component={HomeMenuScreen}
                        options={{
                            presentation: "transparentModal",
                            animation: "fade",
                            contentStyle: {
                                backgroundColor: "#000B",
                            },
                        }}
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
                            name={SCREEN_NAMES.home.modalLoser}
                            component={HomeModalLoserScreen}
                        />
                        <Stack.Screen
                            name={SCREEN_NAMES.home.modalWinner}
                            component={HomeModalWinnerScreen}
                        />
                        <Stack.Screen
                            name={SCREEN_NAMES.home.modalNewGame}
                            component={HomeModalNewGameScreen}
                        />
                        <Stack.Screen
                            name={SCREEN_NAMES.home.modalGiveUp}
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
