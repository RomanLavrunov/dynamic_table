import { DocumentStateType, KeyIndexesObjectType } from "../dataStorage/data.types";
import { ExtractDocumentsObjectsParams, IndexedArrayParams } from "./indexing.types";


export const extractObjects = ({ sortedIndexesArray, dataArray}: ExtractDocumentsObjectsParams) => {
    return sortedIndexesArray.map((index) => dataArray[index]);
}

export function indexDocumentsByDate({documentsArray, documentObjectKey}: IndexedArrayParams) {
    const index: Record<string, number[]> = {};

    documentsArray.forEach((document, idx) => {
        const keyValue = String(document[documentObjectKey!]);
        const dateKey = keyValue; 
        if (!index[dateKey]) {
            index[dateKey] = [];
        }
        index[dateKey].push(idx);
    });

    return index;
}


export const indexDocumentsByState = ({
    documentsArray,
}: IndexedArrayParams) => {

    let keyIndexesObject:KeyIndexesObjectType = {};

    const documentObjectKey = "state"; 
    documentsArray?.forEach((document, index) => {

        const stateKey = document[documentObjectKey] as DocumentStateType;

        if (!keyIndexesObject[stateKey]) {
            keyIndexesObject[stateKey] = [];
        }

        keyIndexesObject[stateKey].push(index);
    });

    return keyIndexesObject;
};
