import { IDocument } from '../dataStorage/data.types';
import { extractObjects } from '../indexing/indexing';
import { CommonIndexesParams, DocumentIndexOrder, SortedIndexesParams, sortIndexedArrayParams } from './sort.types';

const compareValues = (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
        return a - b;
    }
    const nameA = (a as string).toUpperCase();
    const nameB = (b as string).toUpperCase();

    return nameA.localeCompare(nameB);
};

export const getSortedIndexesByKey = (array: IDocument[], key: keyof IDocument): number[] => {
    return array
        .map((item, index) => ({ item, index }))
        .sort((a, b) => compareValues(a.item[key], b.item[key]))
        .map(({ index }) => index);
};

export const buildSortedIndexMap = (array: IDocument[], keys: (keyof IDocument)[]) => {
    const result: DocumentIndexOrder = {};
    keys.forEach((key: keyof IDocument) =>
        result[key] = { isAscending: getSortedIndexesByKey([...array], key) });
    return result;
}

export function generateDocumentsIndexMap(array: IDocument[]) {
    const exceptions = ["eligiblePercentage", "eligibleAmount", "version"];
    if (array.length === 0) return {};
    const keys: (keyof IDocument)[] = Object.keys(array[0]).filter((key) => !exceptions.includes(key)) as (keyof IDocument)[];
    return buildSortedIndexMap(array, keys)
}

function getCommonIndexes({ fullIndexesArray, filteredIndexes }: CommonIndexesParams): number[] {
    const filteredIndexesSet = new Set(filteredIndexes);
    return fullIndexesArray.filter(index => filteredIndexesSet.has(index));
}

function getSortedIndexes({ indexesArray, isAscending, start, end }: SortedIndexesParams): number[] {
    const sortedArray = isAscending ? indexesArray : [...indexesArray].reverse();
    return sortedArray.slice(start, end);
}


export function sortIndexedDocumentsByHeader({
    sortData,
    documentsIndexMap,
    fullDataArray,
    filteredIndexes
}: sortIndexedArrayParams): IDocument[] {
    if (!filteredIndexes) return [];

    const { tableHeader, isAscending } = sortData;
    const { start, end } = sortData.currentCoordinates;

    const fullIndexesArray = documentsIndexMap[tableHeader]?.isAscending;
    if (!fullIndexesArray) return [];

    const indexesArray = filteredIndexes.length
        ? getCommonIndexes({fullIndexesArray, filteredIndexes})
        : fullIndexesArray;

    const sortedIndexesArray = getSortedIndexes({indexesArray, isAscending, start, end});

    return extractObjects({ sortedIndexesArray, dataArray: fullDataArray });
}

