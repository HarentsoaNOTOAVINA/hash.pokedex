import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/Color";
import { formatNumber, getAvailableSprites } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

// Composant pour afficher le contenu d'un Pokémon
type PokemonContentProps = {
    pokemonId: number;
    onTypeColor?: (color: string) => void;
};

function PokemonContent({ pokemonId, onTypeColor }: PokemonContentProps) {
    const colors = useThemeColors();
    const {data: pokemon, isLoading} = useFetchQuery('/pokemon/{id}', {id: pokemonId.toString()});
    const {data: species} = useFetchQuery('/pokemon-species/{id}', {id: pokemonId.toString()});

    const mainType = pokemon?.types?.[0]?.type?.name;
    const typeColor = mainType ? Colors.type[mainType] : colors.tint;

    useEffect(() => {
        if (typeColor) {
            onTypeColor?.(typeColor);
        }
    }, [typeColor, onTypeColor]);

    const bio = species?.flavor_text_entries?.find(({language}) => language.name === 'en')
        ?.flavor_text.replaceAll("\n", ". ");

    const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
    const audioSource = pokemon?.cries?.latest ? {uri: pokemon.cries.latest} : null;
    const player = useAudioPlayer(audioSource);

    const availableSprites = getAvailableSprites(pokemon);

    if (isLoading || !pokemon) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={typeColor}/>
            </View>
        );
    }

    const handlePreviousSprite = () => {
        setCurrentSpriteIndex((prev) => (prev > 0 ? prev - 1 : availableSprites.length - 1));
    };

    const handleNextSprite = () => {
        setCurrentSpriteIndex((prev) => (prev < availableSprites.length - 1 ? prev + 1 : 0));
    };

    const onImagePress = () => {
        if (!player || !audioSource) {
            console.log('No audio available for this Pokemon');
            return;
        }

        try {
            player.seekTo(0);
            player.play();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    return (
        <View style={styles.contentWrapper}>
            {/* Header with back button */}
            <View>
                <Image
                    style={styles.pokeball}
                    source={require('@/assets/images/pokeball-opaque.png')}
                    width={208}
                    height={208}
                />
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
                        #{pokemonId.toString().padStart(3, '0')}
                    </ThemedText>
                </Row>
            </View>

            {/* Pokemon Image with Navigation */}
            <Row style={styles.imageContainer}>
                {availableSprites.length > 1 && (
                    <Pressable onPress={handlePreviousSprite} style={styles.chevronLeft}>
                        <Image source={require('@/assets/images/chevron-left.png')}/>
                    </Pressable>
                )}
                <Pressable onPress={onImagePress}>
                    <Image
                        source={{uri: availableSprites[currentSpriteIndex]?.uri}}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </Pressable>
                {availableSprites.length > 1 && (
                    <Pressable onPress={handleNextSprite} style={styles.chevronRight}>
                        <Image source={require('@/assets/images/chevron-right.png')}/>
                    </Pressable>
                )}
            </Row>

            {/* Card with details - overlapping the image */}
            <View style={styles.scrollView}>
                <Card style={styles.card}>
                    <PokemonType types={pokemon.types}/>

                    <ThemedText
                        variant="subtitle1"
                        style={[styles.sectionTitle, {color: typeColor, textAlign: 'center'}]}
                    >
                        About
                    </ThemedText>

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

                    <ThemedText variant="body3" color="grayMedium" style={styles.description}>
                        {bio}
                    </ThemedText>

                    <View style={styles.section}>
                        <ThemedText
                            variant="subtitle1"
                            style={[styles.sectionTitle, {color: typeColor, textAlign: 'center'}]}
                        >
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

                            return (
                                <PokemonStat
                                    key={stat.stat.name}
                                    stat={stat}
                                    typeColor={typeColor}
                                    displayName={displayName}
                                />
                            );
                        })}
                    </View>
                </Card>
            </View>
        </View>
    );
}

export default function PokemonDetail() {
    const params = useLocalSearchParams() as { id?: string };
    const themeColors = useThemeColors();
    const currentId = Number(params.id);
    const safeId = Number.isFinite(currentId) ? currentId : 1;
    const maxPokemonId = 1025;

    // Calculer les IDs précédent, actuel et suivant
    const prevId = Math.max(1, safeId - 1);
    const nextId = Math.min(maxPokemonId, safeId + 1);

    const screenWidth = Dimensions.get('window').width;
    const translateX = useSharedValue(0);
    const [displayedId, setDisplayedId] = useState(safeId);
    const [backgroundColor, setBackgroundColor] = useState(themeColors.tint);

    // Réinitialiser quand l'ID change depuis l'URL
    useEffect(() => {
        setDisplayedId(safeId);
        translateX.value = 0;
    }, [safeId]);

    const navigatePokemon = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && prevId !== safeId) {
            router.replace(`/pokemon/${prevId}`);
        } else if (direction === 'next' && nextId !== safeId) {
            router.replace(`/pokemon/${nextId}`);
        }
    };

    const swipeGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            const swipeThreshold = screenWidth * 0.25;
            
            if (event.translationX > swipeThreshold) {
                // Swipe à droite -> Pokémon précédent
                translateX.value = withTiming(screenWidth, { duration: 200 }, () => {
                    runOnJS(navigatePokemon)('prev');
                });
            } else if (event.translationX < -swipeThreshold) {
                // Swipe à gauche -> Pokémon suivant
                translateX.value = withTiming(-screenWidth, { duration: 200 }, () => {
                    runOnJS(navigatePokemon)('next');
                });
            } else {
                // Retour à la position initiale
                translateX.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <RootView backgroundColor={backgroundColor}>
            <GestureDetector gesture={swipeGesture}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    <PokemonContent
                        pokemonId={displayedId}
                        onTypeColor={setBackgroundColor}
                    />
                </Animated.View>
            </GestureDetector>
        </RootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        top: 100,
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