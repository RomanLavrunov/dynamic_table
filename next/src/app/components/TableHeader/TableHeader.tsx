import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import arrow from '../../../../public/assets/images/icons/arrow.svg';
import { SearchSortQuery, SortData } from '../../../shared/utilities/sort/sort.types';
import React from 'react';
import { IDocument } from '../../../shared/utilities/dataStorage/data.types';
import eventEmitter from '../../../shared/utilities/emitters/EventEmitter';

const headers = ["index", "state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount", "settings"] as (keyof IDocument)[];

const TableHeader = () => {
  const t = useTranslations("Home");

  const [sortData, setSortData] = useState<SortData>({
    tableHeader: 'id',
    isAscending: true,
    currentCoordinates: { start: 0, end: 200 },
  });

  const [isDisabled, setIsDisabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState<SearchSortQuery>({ tableHeader: 'id', isAscending: true});

  const sortHandler = useCallback((header: keyof IDocument | 'index' | 'settings'): void => {
    if (header === 'index' || header === 'settings') return;
    
    setSearchQuery((prevQuery) => {
      const updatedQuery = {
        tableHeader: header as keyof IDocument,
        isAscending: prevQuery.tableHeader === header ? !prevQuery.isAscending : true
      }
      
      return updatedQuery;
    });
  }, [sortData, searchQuery]);

  useEffect(() => {
    eventEmitter.on('activateSearchFilterOptions', (isLoading) => setIsDisabled(!isLoading));
    return () => {
      eventEmitter.unsubscribe('activateSearchFilterOptions');
    };
  }, []);

  useEffect(()=>{
    eventEmitter.emit('updateSearchQuery', searchQuery);
  },[searchQuery])

  return (
    <tr className="table-header-row">
      {headers.map((header) => {
        if (searchQuery) {
          const { tableHeader, isAscending } = searchQuery;
          return (
            <th
              key={header}
              className="table-header"
              onClick={() => sortHandler(header)}
            >
              {t(`headerTitle.${header}`)}
              {header === tableHeader && !isDisabled && (
                <Image
                  className={isAscending ? "arrow-up" : "arrow-down"}
                  src={arrow}
                  alt="sort direction arrow"
                />
              )}
            </th>
          );
        }
        return null;
      })}
    </tr>
  );
};

export default TableHeader;
