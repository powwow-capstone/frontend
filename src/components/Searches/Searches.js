import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import SearchList from './SearchList';

class Searches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      searches: [],
      limit: 5,
    };
  }

  componentDidMount() {
    this.onListenForSearches();
  }

  onListenForSearches = () => {
    this.setState({ loading: true });

    this.props.firebase
      .searches()
      .orderByChild('createdAt')
      .limitToLast(this.state.limit)
      .on('value', snapshot => {
        const searchObject = snapshot.val();

        if (searchObject) {
          const searchList = Object.keys(searchObject).map(key => ({
            ...searchObject[key],
            uid: key,
          }));

          this.setState({
            searches: searchList,
            loading: false,
          });
        } else {
          this.setState({ searches: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.props.firebase.searches().off();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateSearch = (event, authUser) => {
    this.props.firebase.searches().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  onEditSearch = (search, text) => {
    this.props.firebase.search(search.uid).set({
      ...search,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

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
    const { text, searches, loading } = this.state;

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
                onEditSearch={this.onEditSearch}
                onRemoveSearch={this.onRemoveSearch}
              />
            )}

            {!searches && <div>There are no searches ...</div>}

            <form
              onSubmit={event =>
                this.onCreateSearch(event, authUser)
              }
            >
              <input
                type="text"
                value={text}
                onChange={this.onChangeText}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Searches);
