import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import SearchList from './SearchList';

class Searches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      start_month: "null",
      start_year: "null",
      end_month: "null",
      end_year: "null",
      feature: "ETa",
      acreage_min: 0,
      acreage_max: Number.MAX_VALUE,
      crop_type: "null",
      loading: false,
      searches: [],
      limit: 5,
    };
  }

  componentWillUnmount() {
    this.props.firebase.searches().off();
  }

  onRemoveSearch = uid => {
    this.props.firebase.search(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForSearches,
    );
  };

  render() {
    const { users } = this.props;
    const { start_month, start_year, end_month, end_year, feature, 
      acreage_min, acreage_max, crop_type, searches, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && searches && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}

            {loading && <div>Loading ...</div>}

            {searches && (
              <SearchList
                searches={searches.map(search => ({
                  ...search,
                  user: users
                    ? users[search.userId]
                    : { userId: search.userId },
                }))}
                onRemoveSearch={this.onRemoveSearch}
              />
            )}

            {!searches && <div>There are no searches ...</div>}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Searches);
