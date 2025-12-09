export const getPokemonId = (url: string): number => parseInt(url.split('/').at(-2)!, 10);

export const getPokemonArtWorkUrl = (id: number | string): string => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export function formatNumber(num: number) : string {
    return (num / 10).toFixed(1);
}
