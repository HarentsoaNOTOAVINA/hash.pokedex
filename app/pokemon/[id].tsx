import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/Color";
import {formatNumber, getAvailableSprites} from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";

export default function PokemonDetail() {
    const params = useLocalSearchParams() as { id: string };
    const colors = useThemeColors();
    const {data: pokemon, isLoading} = useFetchQuery('/pokemon/{id}', {id: params.id});
    const {data: species} = useFetchQuery('/pokemon-species/{id}', {id: params.id});

    const mainType = pokemon?.types[0].type.name;
    const typeColor = mainType ? Colors.type[mainType] : colors.tint

    const bio = species?.flavor_text_entries?.find(({language}) => language.name === 'en')
        ?.flavor_text.replaceAll("\n", ". ");

    // Sprite navigation state
    const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);



    const availableSprites = getAvailableSprites(pokemon);

    const handlePreviousSprite = () => {
        setCurrentSpriteIndex((prev) => (prev > 0 ? prev - 1 : availableSprites.length - 1));
    };

    const handleNextSprite = () => {
        setCurrentSpriteIndex((prev) => (prev < availableSprites.length - 1 ? prev + 1 : 0));
    };

    if (isLoading || !pokemon) {
        return (
            <RootView style={{backgroundColor: "transparent"}}>
                <ActivityIndicator size="large" color={typeColor}/>
            </RootView>
        );
    }

    return (
        <RootView  backgroundColor={typeColor}>
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

            {/* Pokemon Image with Navigation */}
            <Row style={styles.imageContainer}>
                {/* Left chevron */}
                {availableSprites.length > 1 && (
                    <Pressable onPress={handlePreviousSprite} style={styles.chevronLeft}>
                        <Image source={require('@/assets/images/chevron-left.png')} />
                    </Pressable>
                )}
                
                <Image
                    source={{uri: availableSprites[currentSpriteIndex]?.uri}}
                    style={styles.image}
                    resizeMode="contain"
                />
                
                {/* Right chevron */}
                {availableSprites.length > 1 && (
                    <Pressable onPress={handleNextSprite} style={styles.chevronRight}>
                        <Image source={require('@/assets/images/chevron-right.png')} />
                    </Pressable>
                )}
            </Row>

            {/* Card with details - overlapping the image */}
            <View style={styles.scrollView}>
                <Card style={styles.card}>
                    {/* Types */}
                    <PokemonType types={pokemon.types}/>

                    {/* About Section Title */}
                    <ThemedText variant="subtitle1"
                                style={[styles.sectionTitle, {color: typeColor, textAlign: 'center'}]}>
                        About
                    </ThemedText>

                    {/* Physical Stats with icons */}
                    <Row style={styles.physicalStats}>
                        <PokemonSpec
                            image={require('@/assets/images/weight.png')}
                            title={`${formatNumber(pokemon.weight)} kg`}
                            description="Weight"
                        />
                        <View style={styles.separator}/>
                        <PokemonSpec
                            image={require('@/assets/images/height.png')}
                            title={`${formatNumber(pokemon.height / 10)} m`}
                            description="Height"
                        />
                        <View style={styles.separator}/>
                        <PokemonSpec
                            title={pokemon?.moves
                                .slice(0, 2)
                                .map((move) => move.move.name)
                                .join('\n')
                            }
                            description="Moves"
                        />
                    </Row>

                    {/* Pokemon Description */}
                    <ThemedText variant="body3" color="grayMedium" style={styles.description}>
                        {bio}
                    </ThemedText>

                    {/* Base Stats */}
                    <View style={styles.section}>
                        <ThemedText variant="subtitle1"
                                    style={[styles.sectionTitle, {color: typeColor, textAlign: 'center'}]}>
                            Base Stats
                        </ThemedText>
                        {pokemon.stats.map((stat) => {
                            const statNames: { [key: string]: string } = {
                                'hp': 'HP',
                                'attack': 'ATK',
                                'defense': 'DEF',
                                'special-attack': 'SATK',
                                'special-defense': 'SDEF',
                                'speed': 'SPD'
                            };
                            const displayName = statNames[stat.stat.name] || stat.stat.name.toUpperCase();

                            return <PokemonStat key={stat.stat.name} stat={stat} typeColor={typeColor} displayName={displayName} />;
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
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch',
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
    separator: {
        width: 1,
        height: '100%',
        backgroundColor: '#E0E0E0',
    },
    chevronLeft: {
        position: 'absolute',
        left: -60,
        top: '50%',
        transform: [{translateY: -20}],
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    chevronRight: {
        position: 'absolute',
        right: -60,
        top: '50%',
        transform: [{translateY: -20}],
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
});
