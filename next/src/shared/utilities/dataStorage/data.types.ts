export const IDocumentState = {
    submitted: 'SUBMITTED',
    inProcess: 'IN_PROCESS',
    additionalReview: 'ADDITIONAL_REVIEW',
    reviewCompleted: 'REVIEW_COMPLETED',
    invalid: 'INVALID',
  } as const;
  
  export type DocumentStateType = typeof IDocumentState[keyof typeof IDocumentState];

  export type KeyIndexesObjectType = {[key in DocumentStateType]?: number[];};

  export interface IDocument {
    id: number;
    state: DocumentStateType;
    stateTime: string;
    documentNumber: string;
    documentName: string;
    documentDate: string;
    documentTotalAmount: number;
  }
  
  