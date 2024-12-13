import { DateTime } from 'luxon';
import { IDocument } from './data.types';


export const formatDocumentData = (data: IDocument[]): IDocument[] => {
    return data?.map((item) => ({
    ...item,
    documentTotalAmount: Number(item.documentTotalAmount),
    documentDate: DateTime.fromISO(item.documentDate).toFormat('dd-MM-yyyy'),
    stateTime: DateTime.fromISO(item.stateTime).toFormat('dd-MM-yyyy'),
  }));
};


export const formatToISODate = (inputDate: string) => {
  const date = DateTime.fromFormat(inputDate, 'dd-MM-yyyy');

  if (date.isValid) return inputDate;

  return DateTime
    .fromFormat(inputDate, 'yyyy-MM-dd HH:mm:ss')
    .toFormat('dd-MM-yyyy');
}


export const toISOString = (inputDate: string) => {
  return DateTime.fromFormat(inputDate, 'yyyy-MM-dd HH:mm:ss')
  .toUTC()
  .toISO({ includeOffset: false, suppressMilliseconds: false })
};
