'use client'
import './page.css';
import { useMemo, useRef, useState } from 'react';
import TableHeader from '../../components/TableHeader/TableHeader';
import TableRow from '../../components/TableRow/TableRow';
import Image from 'next/image';
import { Link, routing } from '../../../i18n/routing';
import returnArrow from '../../../../public/assets/images/icons/return_arrow.svg';
import { IDocument } from '../../../shared/utilities/dataProcessor/data.types';
import { formatDocumentData } from '../../../shared/utilities/dataProcessor/formatDocumentData';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useData } from './useData';
import { useVisibility } from '../../hooks/useVisibility';
import { SearchSortQuery } from '../../../shared/utilities/sort/sort.types';
import eventEmitter from '../../../shared/utilities/emitters/EventEmitter';
import { CreateDocumentForm } from '../../components/CreateDocumentForm/CreatDocumentForm';
import { useModal } from '../../components/Modal/ModalContext';
import { useTranslations } from 'next-intl';
import Spinner from '../../components/Spinner/Spinner';


const headers = ["index", "state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount", "settings"] as (keyof IDocument)[];
const shiftStep: number = 40;

const Server = () => {
    const { document, data, documentsAmount } = useData()
    const mainContainerRef = useRef<HTMLDivElement | null>(null);
    const formattedData = useMemo(() => {return formatDocumentData(data)}, [data])
    const t = useTranslations('Service');
    const [searchQuery, setSearchQuery] = useState<SearchSortQuery>({ offset: 0 });
    const locales = routing.locales;
 
    const firstIndex = 10;
    const lastIndex = data?.length - 40;

    const firstElementRef = useVisibility((isVisible: boolean) => {
        if (isVisible) {
            if (searchQuery.offset === 0) return;
            if (mainContainerRef.current) {
                const newShiftStep = -shiftStep;

                setSearchQuery((prevQuery) => {
                    const updatedQuery = {
                      offset: Math.max(0, prevQuery.offset + newShiftStep)
                    }
                    eventEmitter.emit('updateSearchQuery', updatedQuery);
                    return updatedQuery;
                  });
                mainContainerRef.current.scrollTo({
                    top: 2500,
                    left: 0,
                });
            }
        }
    }, [searchQuery.offset])


    const lastElementRef = useVisibility((isVisible: boolean) => {
        if (isVisible) {
            if (searchQuery.offset === documentsAmount - shiftStep) return;
            if (mainContainerRef.current) {
                setSearchQuery((prevQuery) => {
                    const updatedQuery = {
                      offset: Math.max(0, prevQuery.offset + shiftStep)
                    }
                    eventEmitter.emit('updateSearchQuery', updatedQuery);
                    return updatedQuery;
                  });
                  mainContainerRef.current.scrollTop = Math.max(
                    mainContainerRef.current.scrollTop * 0.7,
                    0
                  );
            }
        }
    }, [searchQuery.offset, documentsAmount])

    const refCheck = {
        [firstIndex]: firstElementRef,
        [lastIndex]: lastElementRef,
    };

    const { openModal } = useModal();
   
    const openCreateDocumentform = () => {
        openModal(<CreateDocumentForm />);
    }


  const missingTableRender = () => {
    if (documentsAmount <= 0) return <Spinner />
    //if (!data.length && ready) return <MissingTable />
  }

  
    return (
        <div className='table-container' ref={mainContainerRef}>
            <div className='sticky-header'>
                <nav className='nav-bar'>
                    <Link className='nav-link' href={'/'}>
                        <Image src={returnArrow} alt="return arrow" />
                    </Link>
                    {locales.map((locale) => (<Link className='nav-link' key={locale} href={'/documents'} locale={locale}>{locale.toUpperCase()}</Link>))}
                </nav>
                <button className="add-new-document-button" onClick={()=>openCreateDocumentform()}>{t('new_document')}</button>
                <SearchBar />
            </div>
            <table>
                <thead>
                    <TableHeader />
                </thead>
                <tbody style={{ width: '100vw' }}>
                    {missingTableRender()}
                    {formattedData?.map((document, i) => (
                        document && document.id ? (
                            <TableRow
                                key={document.id}
                                document={document}
                                index={i}
                                headers={headers}
                                coordinatePoint={searchQuery.offset}
                                ref={refCheck[i] || null}
                            />
                        ) : null))}
                </tbody>
            </table>
        </div >
    );

}
export default Server;
