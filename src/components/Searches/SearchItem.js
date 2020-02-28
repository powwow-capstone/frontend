import React, { Component } from 'react';

class SearchItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: true,
      startMonth: this.props.search.start_month,
      startYear: this.props.search.start_year,
      endMonth: this.props.search.end_month,
      endYear: this.props.search.end_year,
    };
  }

  render() {
    const { search, onRemoveSearch } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        <span>
          {search.start_month}
        </span>
 
        {!editMode && (
          <button
            type="button"
            onClick={() => onRemoveSearch(search.uid)}
          >
            Delete
          </button>
        )}
      </li>
    );
  }
}

export default SearchItem;
