import { FilterParams, FilterStateParams, Locale, translationsMap } from "./filtering.types";

export const getStateIndexes = ({ indexedMap, searchValue }: FilterParams) => {

    const stateIndexes: number[] = [];

    Object.keys(indexedMap).forEach((key) => {
        const keyLowerCased = key.toLowerCase();
        if (keyLowerCased.includes(searchValue)) {
            stateIndexes.push(...indexedMap[key])
        }
    })

    return stateIndexes;
};

export function searchByDate({ indexedMap, searchValue }: FilterParams) {
    const searchResult: number[] = [];

    for (const dateKey in indexedMap) {
        if (dateKey.includes(searchValue)) {
            searchResult.push(...indexedMap[dateKey]);
        }
    }

    return searchResult;
}


export const filterStateMap = (searchText: string, locale: Locale) => {
    if (!searchText) return [];

    const lowerCaseSearchText = searchText.toLocaleLowerCase()
    const result: string[] = [];

    Object.keys(translationsMap[locale]).forEach((key) => {
        if (key.includes(lowerCaseSearchText)) {
            result.push(translationsMap[locale][key])
        }
    })
    
    return result.length ? result : null;
}


export const getStateIndexesArray = ({ indexedMap, searchStatesArray }: FilterStateParams): number[] | null => {
    const arrayOfIndexes: number[] = [];
    if (!searchStatesArray) return null;

    for (const searchText of searchStatesArray) {
        Object.keys(indexedMap).forEach((key) => {

            if (key.toLowerCase().includes(searchText.toLowerCase())) {
                arrayOfIndexes.push(...indexedMap[key]);
            }
        });
    }

    return arrayOfIndexes;
};