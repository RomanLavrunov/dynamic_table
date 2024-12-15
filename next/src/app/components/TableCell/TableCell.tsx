import { useTranslations } from "next-intl";
import { IDocument } from "../../../shared/utilities/dataProcessor/data.types";
import eventEmitter from "../../../shared/utilities/emitters/EventEmitter";
import settings from '../../../../public/assets/images/icons/settings-sharp.svg'
import Image from 'next/image';
import './TableCell.css'
import { useModal } from "../Modal/ModalContext";
import { EditDocumentForm } from "../EditDocumentForm/EditDocumentForm";

interface TableCellProps {
    cellKey: string | keyof IDocument;
    index: number;
    coordinatePoint: number;
    document: IDocument;
  }

export const TableCell = ({ cellKey, index, coordinatePoint, document }:TableCellProps) => {
    const t = useTranslations("Home"); 
    const { openModal } = useModal();
   
    const handleSettings = (document:IDocument) => {
        openModal(<EditDocumentForm document={document}/>);
    }
  
    const renderCellContent = () => {
      switch (cellKey) {
        case 'index':
          return index + 1 + coordinatePoint;
        case 'state':
          return t(`document.state.${document[cellKey as keyof IDocument]}`);
        case 'settings':
          return <button className="rounded-button" onClick={()=>handleSettings(document)}><Image alt={"settings"} src={settings}/></button>;
        default:
          return document[cellKey as keyof IDocument] as React.ReactNode;
      }
    };
  
    return (
      <td className="table-cell">
        {renderCellContent()}
      </td>
    );
  };
  