export function getPokemonId(url: string): number{
    return parseInt(url.split('/').at(-2)!, 10)
}

export function getPokemonArtWorkUrl(id: number | string): string{
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}