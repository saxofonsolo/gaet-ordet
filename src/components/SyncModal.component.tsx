import React from "react";
import { Text, View } from "react-native";
import { Spinner } from "./Spinner.component";

interface SyncModalProps {
    downloadProgress: number;
}

export const SyncModal: React.FC<SyncModalProps> = ({ downloadProgress }) => {
    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "black",
                    opacity: 0.8,
                }}
            />
            <View
                style={{
                    paddingTop: 20,
                    paddingBottom: 25,
                    paddingHorizontal: 10,
                    minWidth: 250,
                    backgroundColor: "white",
                    borderRadius: 10,
                }}
            >
                <Text style={{ textAlign: "center" }}>
                    {downloadProgress === 0
                        ? "Søger efter ny version"
                        : `Downloader: ${downloadProgress}%`}
                </Text>
                <View style={{ marginTop: 20, alignItems: "center" }}>
                    <Spinner />
                </View>
            </View>
        </View>
    );
};
