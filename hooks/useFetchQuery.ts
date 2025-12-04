import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import {Colors} from "@/constants/Color";

const endpoint = "https://pokeapi.co/api/v2"

type API = {
    '/pokemon?limit=21': {
        count: number,
        next: string | null,
        results: {name: string, url: string}[]
    },
    '/pokemon/{id}': {
        id: number,
        name: string,
        height: number,
        weight: number,
        types: {
            slot: number,
            type: {
                name: keyof (typeof Colors)["type"],
                url: string
            }
        }[],
        abilities: {
            ability: {
                name: string,
                url: string
            },
            is_hidden: boolean,
            slot: number
        }[],
        stats: {
            base_stat: number,
            effort: number,
            stat: {
                name: string,
                url: string
            }
        }[],
        sprites: {
            front_default: string,
            other: {
                'official-artwork': {
                    front_default: string
                }
            }
        }
    }
}


export function useFetchQuery<T extends keyof API>(path: T, params?: Record<string, string>) {
    const actualPath = Object.entries(params ?? {}).reduce(
        (acc, [key, value]) => acc.replaceAll(`{${key}}`, value), 
        path as string
    );
    return useQuery({
        queryKey: [actualPath],
        queryFn: async () => {
            await wait(1)
            return fetch(endpoint + actualPath, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(r => r.json() as Promise<API[T]>)
        }
    })
}

export function useInfiniteFetchQuery<T extends keyof API>(path: T) {
    return useInfiniteQuery({
        queryKey: [path],
        initialPageParam: endpoint + path,
        queryFn: async ({ pageParam }) => {
            await wait(1)
            return fetch(pageParam, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(r => r.json() as Promise<API[T]>)
        },
        getNextPageParam: (lastPage: any) => {
            if ("next" in lastPage) {
                return lastPage.next
            }
            return null
        }
    })
}

function wait(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
}

