import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useDebouncedValue} from '../../hooks/useDebouncedValue';
import close from '../../../../public/assets/images/icons/close-one.svg'
import magnifyingGlass from '../../../../public/assets/images/icons/magnifying-glass.svg';
import './SearchBar.css'
import eventEmitter from '../../../shared/utilities/emitters/EventEmitter';
import React from 'react';



const SearchBar = (): JSX.Element => {
  const [searchText, setSearchText] = useState('');
  const [isDisabled, setIsDisabled] = useState(true)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  };

  const clearSearch = () => {
    setSearchText('');
    eventEmitter.emit('sendSearchValue', ""); 
  };

  const debouncedSearchTerm = useDebouncedValue(searchText, 500);

  const iconProps = useMemo(() => ({
      className: `search-bar__icon ${!searchText ? '' : 'close-sign'}`,
      src: !searchText ? magnifyingGlass : close,
      onClick: searchText ? () => clearSearch() : () => void (0)
  }), [searchText]);


  useEffect(() => {
    //@ts-ignore
    eventEmitter.on('activateSearchFilterOptions', (isLoading:boolean)=>setIsDisabled(!isLoading))
    return () => {
      eventEmitter.unsubscribe('activateSearchFilterOptions');
    };
  },[])


  useEffect(()=>{
    eventEmitter.emit('sendSearchValue', debouncedSearchTerm);
  },[debouncedSearchTerm])
  
  const inputClassName = `search-bar__input${isDisabled ? '--disabled' : ''}`;


  return (
    <>
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            disabled={isDisabled}
            type="text"
            className={inputClassName}
            value={searchText}
            onChange={handleChange}
          />
          {<Image alt="" {...iconProps} />}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
