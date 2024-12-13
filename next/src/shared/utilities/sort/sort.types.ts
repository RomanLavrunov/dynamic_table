import { IDocument } from "../dataStorage/data.types";


export type DocumentIndexOrder = {
    [K in keyof IDocument]?: {
      isAscending: number[]
    }
  }

export interface SortArrayParams {
    data: IDocument[],
    sortKey: keyof IDocument,
    isAscending: boolean
}

export interface CurrentCoordinates {
  start: number, 
  end: number
}

export interface SortData {
  tableHeader: keyof IDocument,
  isAscending: boolean,
  currentCoordinates: CurrentCoordinates;
}

export interface SearchSortQuery {
  tableHeader?: keyof IDocument,
  isAscending?: boolean,
  offset?: number,
  searchText?: string | number
  currentCoordinates?: CurrentCoordinates;
}

export interface sortIndexedArrayParams {
  sortData: SortData,
  documentsIndexMap: DocumentIndexOrder,
  fullDataArray: IDocument[],
  filteredIndexes: number[] | null,
}

export interface CommonIndexesParams {
  fullIndexesArray: number[];
  filteredIndexes: number[];
}

export interface SortedIndexesParams {
  indexesArray: number[];
  isAscending: boolean;
  start: number;
  end: number;
}
