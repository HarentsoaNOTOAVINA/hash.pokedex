import { Row } from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import React, { useEffect } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type Props = ViewProps & {
    stat: {
        base_stat: number;
        stat: {
            name: string;
        };
    };
    typeColor: string;
    displayName: string;
}

export function PokemonStat({stat, typeColor, displayName}: Props) {

    const targetValue  = (stat.base_stat / 255) * 100;
    const animatedWidth = useSharedValue(0);
    
    useEffect(() => {
        animatedWidth.value = withTiming(targetValue, {
            duration: 1000,
        });
    }, [targetValue]);

    const barAnimatedStyle = useAnimatedStyle(() => {
        return {
            width: `${animatedWidth.value}%`,
        };
    });

    return (
        <Row gap={8} key={stat.stat.name} style={styles.statRow}>
            <View style={[styles.name, {borderRightColor: typeColor}]}>
                <ThemedText variant="body3" style={[styles.statName, {color: typeColor, fontWeight: '600'}]}>
                    {displayName}
                </ThemedText>
            </View>
            <View style={styles.number}>
                <ThemedText variant="body3" style={styles.statValue}>
                    {stat.base_stat.toString().padStart(3, '0')}
                </ThemedText>
            </View>
            <View style={styles.statBarContainer}>
                <Animated.View
                    style={[
                        styles.statBar,
                        barAnimatedStyle,
                        {
                            backgroundColor: typeColor
                        }
                    ]}
                />
            </View>
        </Row>
    );
}


const styles = StyleSheet.create({
    name: {
        width: 35,
        paddingRight: 10,
        borderRightWidth: 1,
        borderStyle: 'solid',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statName: {
        width: 50,
        fontSize: 12,
    },
    number: {
        width: 35,
    },
    statValue: {
        textAlign: 'left',
        fontWeight: '600',
        fontSize: 12,
    },
    statBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: '#e8e8e8',
        borderRadius: 3,
        overflow: 'hidden',
    },
    statBar: {
        height: '100%',
        borderRadius: 3,
    },
});