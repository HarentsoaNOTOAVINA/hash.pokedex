import {Card} from "@/components/Card";
import PokemonCard from "@/components/pokemon/PokemonCard";
import {Row} from "@/components/Row";
import {SearchBar} from "@/components/SearchBar";
import ThemedText from "@/components/ThemedText";
import {getPokemonId} from "@/functions/pokemon";
import {useInfiniteFetchQuery} from "@/hooks/useFetchQuery";
import {useThemeColors} from "@/hooks/useThemeColors";
import React, {useState} from "react";
import {ActivityIndicator, FlatList, Image, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {SortButton} from "@/components/SortButton";

export default function Index() {
    const colors = useThemeColors();
    const {data, isFetching, fetchNextPage} = useInfiniteFetchQuery('/pokemon?limit=21');
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<"id" | "name">('id')

    const pokemons = data?.pages.flatMap(page => page.results.map(r => ({name: r.name, url: r.url, id: getPokemonId(r.url)}))) ?? [];

    const filteredPokemons = [
        ...(search ? pokemons.filter(
            pokemon =>
                pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
                pokemon.id.toString() === search
        )
            : pokemons)
    ].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1));

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
            <Row style={styles.header} gap={16}>
                <Image source={require("@/assets/images/pokeball.png")} width={24} height={24}/>
                <ThemedText variant="headline" color="grayLight">Pokedex</ThemedText>
            </Row>

            {/* SearchBar */}
            <Row gap={16} style={styles.form}>
                <SearchBar onChange={setSearch} value={search}/>
                <SortButton value={sortKey} onChange={setSortKey} />
            </Row>

            <Card style={styles.body}>
                <FlatList
                    data={filteredPokemons}
                    numColumns={3}
                    contentContainerStyle={[styles.gridGap, styles.list]}
                    columnWrapperStyle={styles.gridGap}
                    ListFooterComponent={
                        isFetching ? <ActivityIndicator color={colors.tint}/> : null
                    }
                    onEndReached={search ? undefined : () => fetchNextPage()}
                    renderItem={({item}) => <PokemonCard id={item.id} name={item.name}
                                                         style={{flex: 1 / 3}}/>
                    } keyExtractor={(item) => item.id.toString()}
                />

            </Card>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
        gap: 16,
    },
    header: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    body: {
        flex: 1,
        marginTop: 16,
    },
    gridGap: {
        gap: 8
    },
    list: {
        padding: 12
    },
    form: {
        paddingHorizontal: 12
    }
})