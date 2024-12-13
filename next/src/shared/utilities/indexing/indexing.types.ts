import { IDocument } from "../dataStorage/data.types";

export type Locale = 'en' | 'et' | 'ru';

export interface Translation {
    en: string;
    et: string;
    ru: string;
}

interface TranslationIndex {
    [translation: string]: number[];
  }
  
export interface KeyIndexesObject {
    [lang: string]: TranslationIndex;
  }

export interface DocumentStateTranslations {
    SUBMITTED: Translation;
    IN_PROCESS: Translation;
    ADDITIONAL_REVIEW: Translation;
    REVIEW_COMPLETED: Translation;
    INVALID: Translation;
}

export interface DocumentState {
    state: DocumentStateTranslations;
}

export interface IndexedArrayParams {
    documentObjectKey?: keyof IDocument;
    documentsArray: IDocument[];
}

export interface ExtractDocumentsObjectsParams {
    sortedIndexesArray: number[];
    dataArray: IDocument[];
}

