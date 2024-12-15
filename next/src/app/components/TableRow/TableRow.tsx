import { IDocument } from '../../../shared/utilities/dataProcessor/data.types'
import { useTranslations } from 'next-intl';
import React from 'react';
import { forwardRef } from 'react';
import {TableCell} from '../TableCell/TableCell';


interface TableRowProps {
  document: IDocument;
  index: number;
  headers: (keyof IDocument)[];
  coordinatePoint: number;
  ref?: React.Ref<HTMLTableRowElement>;
}

const TableRow = ({ document, index, headers, coordinatePoint }: TableRowProps, ref: React.Ref<HTMLTableRowElement>) => {
  const t = useTranslations("Home");

  if (headers.length === 0 || !document) {
    return (
      <tr>
        <td colSpan={headers.length} className='table-cell'>No Items found</td>
      </tr>
    );
  }

  return (
    <tr key={`${document.id}-${index}`} id={`${document.id}`} ref={ref}>
      {headers.map((key) => (
       <TableCell cellKey={key} index={index} coordinatePoint={coordinatePoint} document={document} key={`${document.id}-${key}`}/>
      ))}
    </tr>
  );
};

export default forwardRef(TableRow);
