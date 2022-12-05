import React from "react";
import { BibloReader } from "@biblo/react-native";
import { Route, useRoute } from "@react-navigation/native";

type Lol = Route<"reader", { file?: string }>;

export const ComponentsReaderScreen: React.FC = () => {
    const { params } = useRoute<Lol>();
    return params?.file ? <BibloReader file={params.file} /> : null;
};
