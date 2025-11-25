import { useThemeColors } from "@/hooks/useThemeColors";
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { Card } from "../Card";
import ThemedText from "../ThemedText";

type Props = {
    style?: ViewStyle,
    id: number,
    name: string
}


export default function PokemonCard({ style, id, name }: Props) {
    const params = useLocalSearchParams();
    const colors = useThemeColors()
    return (
        <Link href={{ pathname: "/pokemon/[id]", params: { id: id } }} asChild>
            <Pressable android_ripple={{color: colors.tint, foreground: true}} style={style}>
                <Card style={[styles.card]}>
                    <View style={[styles.shadow, { backgroundColor: colors.grayBackground }]} />
                    <ThemedText style={styles.id} variant="caption" color="grayMedium">
                        #{id.toString().padStart(3, '0')}
                    </ThemedText>
                    <Image
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` }}
                        width={72}
                        height={72}
                    />
                    <ThemedText>
                        {name}
                    </ThemedText>
                </Card>
            </Pressable>
        </Link>

    );
}


const styles = StyleSheet.create({
    card: {
        position: 'relative',
        alignItems: 'center',
        padding: 4
    },
    id: {
        alignSelf: 'flex-end'
    },
    shadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 44,
        borderRadius: 7
    }
})