import { Pressable, View } from "react-native";
import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Paragraph } from "../elements/Paragraph.component";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import DannebrogSvg from "../../graphics/dannebrog.svg";
import BurgerSvg from "../../graphics/burger.svg";
import CloseSvg from "../../graphics/close.svg";
import { useAppData } from "../../hooks/appData.hook";
import { useTheme } from "../../hooks/theme.hook";

export const Header: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { isMenuOpen, setIsMenuOpen } = useAppData();
    const { colors } = useTheme();

    const toggleMenu = useCallback(() => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
            navigation.navigate({
                name: SCREEN_NAMES.home.main,
                params: {},
            });
        } else {
            setIsMenuOpen(true);
            navigation.navigate({
                name: SCREEN_NAMES.home.menu,
                params: {},
            });
        }
    }, [isMenuOpen, setIsMenuOpen, navigation]);

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: colors.background,
            }}
        >
            <View style={{ flexDirection: "row", width: 60 }} />
            <View
                style={{
                    height: 60,
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Paragraph black size={20}>
                    GÆT
                </Paragraph>
                <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                        navigation.navigate({
                            name: SCREEN_NAMES.componentLibrary.root,
                            params: {},
                        })
                    }
                >
                    <DannebrogSvg height="40" width="60" />
                </Pressable>
                <Paragraph black size={20}>
                    ORDET
                </Paragraph>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Pressable
                    accessibilityRole="button"
                    onPress={toggleMenu}
                    style={{ padding: 15 }}
                >
                    {isMenuOpen ? (
                        <CloseSvg width={30} height={30} />
                    ) : (
                        <BurgerSvg width={30} height={30} />
                    )}
                </Pressable>
            </View>
        </View>
    );
};
