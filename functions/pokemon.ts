export const getPokemonId = (url: string): number => parseInt(url.split('/').at(-2)!, 10);

export const getPokemonArtWorkUrl = (id: number | string): string => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export function formatNumber(num: number) : string {
    return (num / 10).toFixed(1);
}

export const getAvailableSprites = (pokemon: any) => {
    if (!pokemon) return [];

    const sprites = [];
    const s = pokemon.sprites as any; // Type assertion to access all sprite properties

    // Add sprites only if they exist
    if (s.other?.['official-artwork']?.front_default) sprites.push({ uri: s.other['official-artwork'].front_default, label: 'Official Art' });
    if (s.front_default) sprites.push({ uri: s.front_default, label: 'Front' });
    if (s.front_shiny) sprites.push({ uri: s.front_shiny, label: 'Front Shiny' });
    if (s.back_default) sprites.push({ uri: s.back_default, label: 'Back' });
    if (s.back_shiny) sprites.push({ uri: s.back_shiny, label: 'Back Shiny' });
    if (s.front_female) sprites.push({ uri: s.front_female, label: 'Front Female' });
    if (s.front_shiny_female) sprites.push({ uri: s.front_shiny_female, label: 'Front Shiny Female' });
    if (s.back_female) sprites.push({ uri: s.back_female, label: 'Back Female' });
    if (s.back_shiny_female) sprites.push({ uri: s.back_shiny_female, label: 'Back Shiny Female' });

    return sprites;
};
