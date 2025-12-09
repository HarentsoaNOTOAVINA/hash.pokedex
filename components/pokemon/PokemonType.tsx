import { Row } from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/Color";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
    types: {
        slot: number,
        type: {
            name: keyof (typeof Colors)["type"],
            url: string
        }
    }[],
}

export function PokemonType({types}: Props) {
    return (
        <Row gap={8} style={styles.typesContainer}>
            {types.map((type) => (
                <View
                    key={type.slot}
                    style={[
                        styles.typeBadge,
                        {backgroundColor: Colors.type[type.type.name]}
                    ]}
                >
                    <ThemedText color="grayWhite" variant="caption" style={styles.typeText}>
                        {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                    </ThemedText>
                </View>
            ))}
        </Row>
    );
}

const styles = StyleSheet.create({
    typesContainer: {
        justifyContent: 'center',
        marginTop: 80,
        marginBottom: 16,
    },
    typeBadge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    typeText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
});