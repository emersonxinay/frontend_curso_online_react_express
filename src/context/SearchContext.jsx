import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    level: '',
    priceRange: '',
    sortBy: 'newest'
  });

  const updateSearchParams = (newParams) => {
    setSearchParams(prev => ({ ...prev, ...newParams }));
  };

  return (
    <SearchContext.Provider value={{ searchParams, updateSearchParams }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}