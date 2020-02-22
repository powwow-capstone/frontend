import React from 'react';

import SearchItem from './SearchItem';

const SearchList = ({
  searches,
  onEditSearch,
  onRemoveSearch,
}) => (
  <ul>
    {searches.map(search => (
      <SearchItem
        key={search.uid}
        search={search}
        onEditSearch={onEditSearch}
        onRemoveSearch={onRemoveSearch}
      />
    ))}
  </ul>
);

export default SearchList;
