import React, { useCallback } from "react";
import { useColorScheme, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../../constants/colors.constants";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import { Header } from "../../components/Header/Header.component";
import { GameHeader } from "../../components/GameHeader/GameHeader.component";
import { useScore } from "../../hooks/score.hook";
import { useGame } from "../../hooks/game.hook";
import { GameMainScreen } from "./game/GameMain.screen";

export const HomeMainScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const isDarkMode = useColorScheme() === "dark";
    const { totalScore, score } = useScore();
    const { currentGuess } = useGame();

    const showGiveUpModal = useCallback(
        () =>
            navigation.navigate({
                name: SCREEN_NAMES.home.modalGiveUp,
                params: {},
            }),
        [navigation],
    );

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: isDarkMode ? COLORS.BLACK : COLORS.WHITE,
            }}
        >
            <Header />
            <GameHeader
                totalScore={totalScore}
                score={score}
                currentGuess={currentGuess}
                onGiveUp={showGiveUpModal}
            />
            <View style={{ flex: 1 }}>
                <GameMainScreen />
            </View>
        </View>
    );
};
