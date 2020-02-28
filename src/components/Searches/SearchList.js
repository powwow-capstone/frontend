import React from 'react';

import SearchItem from './SearchItem';

const SearchList = ({
  searches,
  onRemoveSearch,
}) => (
  <ul>
    {searches.map(search => (
      <SearchItem
        key={search.uid}
        search={search}
        onRemoveSearch={onRemoveSearch}
      />
    ))}
  </ul>
);

export default SearchList;
