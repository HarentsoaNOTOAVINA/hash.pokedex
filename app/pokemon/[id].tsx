import { Card } from "@/components/Card";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/Color";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";

export default function PokemonDetail() {
    const params = useLocalSearchParams() as { id: string };
    const colors = useThemeColors();
    const {data: pokemon, isLoading} = useFetchQuery('/pokemon/{id}', { id: params.id });
    useEffect(() => {

    }, []);
    const mainType = pokemon?.types[0].type.name;
    const typeColor = mainType ? Colors.type[mainType] : colors.tint

    if (isLoading || !pokemon) {
        return (
            <RootView style={{backgroundColor: "transparent"}}>
                <ActivityIndicator size="large" color={typeColor}/>
            </RootView>
        );
    }

    return (
        <RootView style={{flex: 1, backgroundColor: typeColor}}>
            {/* Header with back button */}
            <View>
                <Image style={styles.pokeball} source={require('@/assets/images/pokeball-opaque.png')} width={208}
                       height={208}/>
                <Row style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <Row gap={8}>
                            <Image source={require('@/assets/images/back.png')} width={32} height={32}/>
                            <ThemedText variant="headline" style={[styles.name, {color: colors.grayWhite}]}>
                                {pokemon.name.charAt(0).toUpperCase() + pokemon?.name.slice(1)}
                            </ThemedText>
                        </Row>
                    </Pressable>
                    <ThemedText variant="subtitle2" color="grayWhite">
                        #{params.id.toString().padStart(3, '0')}
                    </ThemedText>
                </Row>
            </View>

            {/* Pokemon Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: pokemon.sprites.other['official-artwork'].front_default}}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            {/* Card with details - overlapping the image */}
            <View style={styles.scrollView}>
                <Card style={styles.card}>
                    {/* Types */}
                    <PokemonType types={pokemon.types} typeColor={typeColor} />

                    {/* About Section Title */}
                    <ThemedText variant="subtitle1" style={[styles.sectionTitle, {color: typeColor, textAlign: 'center'}]}>
                        About
                    </ThemedText>

                    {/* Physical Stats with icons */}
                    <Row gap={24} style={styles.physicalStats}>
                        <View style={styles.statItem}>
                            <Row gap={4} style={{alignItems: 'center'}}>
                                <ThemedText variant="body3" style={{fontSize: 16}}>⚖️</ThemedText>
                                <ThemedText variant="body3" style={{fontWeight: '600'}}>
                                    {(pokemon.weight / 10).toFixed(1)} kg
                                </ThemedText>
                            </Row>
                            <ThemedText variant="caption" color="grayMedium">Weight</ThemedText>
                        </View>
                        <View style={styles.statItem}>
                            <Row gap={4} style={{alignItems: 'center'}}>
                                <ThemedText variant="body3" style={{fontSize: 16}}>📏</ThemedText>
                                <ThemedText variant="body3" style={{fontWeight: '600'}}>
                                    {(pokemon.height / 10).toFixed(1)} m
                                </ThemedText>
                            </Row>
                            <ThemedText variant="caption" color="grayMedium">Height</ThemedText>
                        </View>
                        <View style={styles.statItem}>
                            <ThemedText variant="body3" style={{fontWeight: '600'}}>
                                {pokemon.abilities[0]?.ability.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}
                            </ThemedText>
                            <ThemedText variant="caption" color="grayMedium">Moves</ThemedText>
                        </View>
                    </Row>

                    {/* Pokemon Description */}
                    <ThemedText variant="body3" color="grayMedium" style={styles.description}>
                        When it retracts its long neck into its shell, it squirts out water with vigorous force.
                    </ThemedText>

                    {/* Base Stats */}
                    <View style={styles.section}>
                        <ThemedText variant="subtitle1" style={[styles.sectionTitle, {color: typeColor, textAlign: 'center'}]}>
                            Base Stats
                        </ThemedText>
                        {pokemon.stats.map((stat) => {
                            const statNames: {[key: string]: string} = {
                                'hp': 'HP',
                                'attack': 'ATK',
                                'defense': 'DEF',
                                'special-attack': 'SATK',
                                'special-defense': 'SDEF',
                                'speed': 'SPD'
                            };
                            const displayName = statNames[stat.stat.name] || stat.stat.name.toUpperCase();
                            
                            return (
                                <View key={stat.stat.name} style={styles.statRow}>
                                    <ThemedText variant="body3" style={[styles.statName, {color: typeColor, fontWeight: '600'}]}>
                                        {displayName}
                                    </ThemedText>
                                    <ThemedText variant="body3" style={styles.statValue}>
                                        {stat.base_stat.toString().padStart(3, '0')}
                                    </ThemedText>
                                    <View style={styles.statBarContainer}>
                                        <View
                                            style={[
                                                styles.statBar,
                                                {
                                                    width: `${(stat.base_stat / 255) * 100}%`,
                                                    backgroundColor: typeColor
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </Card>
            </View>
        </RootView>
    );
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: 'space-between',
    },
    pokeball: {
        opacity: .3,
        position: 'absolute',
        top: 8,
        right: 8
    },
    scrollView: {
        flex: 1,
    },
    card: {
        padding: 20,
        marginTop: 144,
        marginHorizontal: 4,
        borderRadius: 24,
        minHeight: 580,
    },
    titleRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        textTransform: 'capitalize',
    },
    imageContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: 140,
        zIndex: 10,
        marginTop: 8,
        marginBottom: 0,
        height: 200,
    },
    image: {
        width: 200,
        height: 200,
    },

    physicalStats: {
        justifyContent: 'space-around',
        marginBottom: 16,
        marginTop: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    description: {
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 16,
        fontWeight: 'bold',
        fontSize: 16,
    },
    abilitiesContainer: {
        flexWrap: 'wrap',
    },
    abilityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
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
    statValue: {
        width: 35,
        textAlign: 'left',
        fontWeight: '600',
        fontSize: 12,
    },
    statBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: '#e8e8e8',
        borderRadius: 3,
        marginLeft: 8,
        overflow: 'hidden',
    },
    statBar: {
        height: '100%',
        borderRadius: 3,
    },

});
