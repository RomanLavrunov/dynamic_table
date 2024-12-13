'use client'
import { useTranslations } from 'next-intl';
import './page.css';
import React, { useRef } from 'react';
import { useStream } from '../../components/useStreamData';
import eventEmitter from '../../../shared/utilities/emitters/EventEmitter';
import { shiftArrayCoordinates } from '../../../shared/utilities/shiftArrayCoordinates'
import { MissingTable } from '../../components/MissingTable/MissingTable';
import { useVisibility } from '../../hooks/useVisibility';
import TableHeader from '../../components/TableHeader/TableHeader';
import TableRow from '../../components/TableRow/TableRow';
import SearchBar from '../../components/SearchBar/SearchBar';
import Spinner from '../../components/Spinner/Spinner';
import Image from 'next/image';
import { Link } from '../../../i18n/routing';
import returnArrow from '../../../../public/assets/images/icons/return_arrow.svg';
import { IDocument } from '../../../shared/utilities/dataStorage/data.types';


const headers = ["index", "state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount","settings"] as (keyof IDocument)[];
const shiftStep: number = 40;

export default function Table() {
  const { data, ready, currentCoordinates, documentAmount } = useStream();
  const t = useTranslations("Service");
  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  const firstIndex = 10;
  const lastIndex = data.length - 11;

  const firstElementRef = useVisibility((isVisible: boolean) => {
    if (isVisible) {
      if (currentCoordinates.start === 0) return;
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTo({
          top: 1500,
          left: 0,
        });
        const newShiftStep = -shiftStep;

        const newCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength: documentAmount, shiftStep: newShiftStep })
        eventEmitter.emit('sendCurrentCoordinates', newCoordinates);
      }
    }
  }, [currentCoordinates])

  const lastElementRef = useVisibility((isVisible: boolean) => {
    if (isVisible) {
      if (currentCoordinates.end === documentAmount - 1) return;
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTop = Math.max(
          mainContainerRef.current.scrollTop * 0.7,
          0
        );

        const newCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength: documentAmount, shiftStep })
        eventEmitter.emit('sendCurrentCoordinates', newCoordinates);
      }
    }
  }, [currentCoordinates])

  const refCheck = {
    [firstIndex]: firstElementRef,
    [lastIndex]: lastElementRef,
  };

  const missingTableRender = () => {
    if (!data.length && !ready) return <Spinner />
    if (!data.length && ready) return <MissingTable />
  }

  return (
    <div className='table-container' ref={mainContainerRef} >
      <div className='sticky-header'>
        <nav className='nav-bar'>
          <Link className='nav-link' href={'/'}>
            <Image src={returnArrow} alt="return arrow" />
          </Link>
          <Link className='nav-link' href={'/documents'} locale="en">EN</Link>
          <Link className='nav-link' href={'/documents'} locale="ru">RU</Link>
          <Link className='nav-link' href={'/documents'} locale="et">ET</Link>
        </nav>
        <p className='progress-track' style={{ margin: 20 }}>{ready ? t(`ready`) : (<span className="dots">{t(`loading`)}</span>)}</p>
        <SearchBar />
      </div>
      <table>
        <thead>
          <TableHeader />
        </thead>
        <tbody style={{ width: '100vw' }}>
          {missingTableRender()}
          {data.map((document, i) => (
            document && document.id ? (
              <TableRow
                key={document.id}
                document={document}
                index={i}
                headers={headers}
                coordinatePoint={currentCoordinates.start}
                ref={refCheck[i] || null}
              />
            ) : null))}
        </tbody>
      </table>
    </div >
  );
}

