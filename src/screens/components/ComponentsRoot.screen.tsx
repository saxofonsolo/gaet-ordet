import React from "react";
import {
    createNativeStackNavigator,
    NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { bibloImporter, BibloIndex, BibloProvider } from "@biblo/react-native";
import BibloAddonSimpleMarkup from "@biblo/addon-simple-markup";
import { useNavigation } from "@react-navigation/native";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import { useAppData } from "../../hooks/appData.hook";
import { useTheme } from "../../hooks/theme.hook";
import { ComponentsReaderScreen } from "./ComponentsReader.screen";

const components = bibloImporter(
    // @ts-ignore
    require.context("../../", true, /\.biblo\.tsx?$/),
);

const Stack = createNativeStackNavigator();

export const ComponentsRootScreen: React.FC = () => {
    const { appIsReady } = useAppData();
    const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
    const { colors } = useTheme();

    return appIsReady ? (
        <BibloProvider
            components={components}
            addons={[BibloAddonSimpleMarkup]}
            onSelectFile={(file) => {
                navigate({
                    name: SCREEN_NAMES.componentLibrary.reader,
                    params: { file },
                });
            }}
            defaultStyles={{ textColor: colors.text }}
            indexOptions={{
                headerTitle: "",
                headerStyle: {
                    backgroundColor: colors.background,
                },
                sectionHeaderStyle: {
                    backgroundColor: colors.surface,
                },
            }}
            readerOptions={{
                headerTagsHidden: true,
                headerPathHidden: true,
                wrapperStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Navigator
                screenOptions={{
                    contentStyle: { backgroundColor: colors.background },
                    headerStyle: { backgroundColor: colors.background },
                    headerTitleStyle: { color: colors.text },
                    headerTintColor: colors.text,
                }}
            >
                <Stack.Screen
                    name={SCREEN_NAMES.componentLibrary.main}
                    component={BibloIndex}
                    options={{ title: "Komponenter" }}
                />
                <Stack.Screen
                    name={SCREEN_NAMES.componentLibrary.reader}
                    component={ComponentsReaderScreen}
                    options={{ title: "Komponent" }}
                />
            </Stack.Navigator>
        </BibloProvider>
    ) : (
        <></>
    );
};
