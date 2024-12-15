import { IDocument } from "../dataProcessor/data.types";

export interface SearchSortQuery {
  tableHeader?: keyof IDocument,
  isAscending?: boolean,
  offset?: number,
  searchText?: string | number
}
