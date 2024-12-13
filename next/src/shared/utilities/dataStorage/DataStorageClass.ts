import { IDocument, KeyIndexesObjectType } from './data.types'
import { DocumentIndexOrder, SortData } from "../sort/sort.types";
import { generateDocumentsIndexMap, sortIndexedDocumentsByHeader } from "../sort/sort";
import { indexDocumentsByState } from "../indexing/indexing";
import { filterStateMap, getStateIndexesArray } from "../filtering/filtering";
import { Locale } from "../indexing/indexing.types";

export class DataStorage {
    _storage: IDocument[];
    _documentsIndexMap: DocumentIndexOrder;
    _isDownloaded: boolean;
    _documentStateMap: KeyIndexesObjectType;

    constructor() {
        this._storage = [];
        this._documentsIndexMap = {};
        this._isDownloaded = false;
        this._documentStateMap = {};
    }

    get storage () {
        return this._storage;
    }

    addToStorage(documents: IDocument[]) {
        this._storage.push(...documents);
    }

    clearStorage() {
        this._storage = [];
    }

    filterAndSortDocuments(sortData: SortData, searchValue: string, locale: Locale): IDocument[] { 
        const filteredIndexes = this.filterStateIndexesBySearchText(searchValue,locale)
        return this.sortDocumentsByHeader(sortData, this._storage, filteredIndexes)
    }

    set isDownloaded(finished: boolean) {
        this._isDownloaded = finished
        if (finished) this.initializeIndexes();
    }

    get isDownloaded ():boolean {
        return this._isDownloaded
    }

    get stateIndexMap(): KeyIndexesObjectType {
        return this._documentStateMap;
    }

    get indexMap(): DocumentIndexOrder {
        return this._documentsIndexMap;
    }

    get documentAmout() {
        return this._storage.length
    }

    public initializeIndexes() {
        this.generateIndexMap();
        this.indexDocumentsByState();
    }

    private generateIndexMap() {
        this._documentsIndexMap = generateDocumentsIndexMap(this._storage);
    }    

    private sortDocumentsByHeader(sortData: SortData, dataArray: IDocument[], filteredIndexes:number[] | null) {
        return sortIndexedDocumentsByHeader({sortData, documentsIndexMap:this._documentsIndexMap, fullDataArray: dataArray, filteredIndexes});    
    }

    private indexDocumentsByState() {
        this._documentStateMap = indexDocumentsByState({ documentsArray: this._storage })
    }

    private filterStateIndexesBySearchText(searchValue:string, locale: Locale) {
        const states = filterStateMap(searchValue, locale);
        return getStateIndexesArray({
            indexedMap:this._documentStateMap, 
            searchStatesArray: states})  
    }

}
