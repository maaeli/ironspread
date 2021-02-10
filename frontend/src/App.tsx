import React, {
  FunctionComponent,
  ReactElement,
  Dispatch,
  SetStateAction,
} from 'react';
import axios from 'axios';
import Item, { article } from './Item';
import SearchForm from './SearchForm';
import Table from './Table';
import './App.css';

const DEMO_API_ENDPOINT = 'http://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (
  key: string,
  initialState: string,
): [string, Dispatch<SetStateAction<string>>] => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState,
  );

  React.useEffect(() => {
    localStorage.setItem(key, value as string);
  }, [value, key]);
  return [value as string, setValue as Dispatch<SetStateAction<string>>];
};

type Action =
  | { type: 'STORIES_FETCH_INIT' }
  | { type: 'STORIES_FETCH_SUCCESS'; payload: Array<article> }
  | { type: 'STORIES_FETCH_FAILURE' }
  | { type: 'REMOVE_STORIES'; payload: article };

type StoriesState = {
  stories: Array<article>;
  isLoading: boolean;
  isError: boolean;
};

const storiesReducer = (state: StoriesState, action: Action): StoriesState => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        stories: action.payload,
        isLoading: false,
        isError: false,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORIES':
      return {
        ...state,
        stories: state.stories.filter(
          (story) => action.payload.objectID !== story.objectID,
        ),
      };
    default:
      throw new Error();
  }
};

type ListProps = {
  list: Array<article>;
  onRemoveItem: (item: article) => void;
};

const List: FunctionComponent<ListProps> = ({
  list,
  onRemoveItem,
}: ListProps): ReactElement | null => (
  <>
    {list.map((item: article) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </>
);

const contentheader = ['Alabel', 'Blabel', 'Clabel'];
const content = [
  ['A1', 'B1', 'C1'],
  ['A2', 'B2', 'C2'],
];

/* eslint-disable max-lines-per-function */

const App = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'react');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    stories: [] as article[],
    isLoading: false,
    isError: false,
  });

  const [url, setUrl] = React.useState(`${DEMO_API_ENDPOINT}${searchTerm}`);

  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent): void => {
    setUrl(`${DEMO_API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleRemoveStory = (item: article): void => {
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
  };

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    axios
      .get(url)
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        });
      })
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }));
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [url]);

  return (
    <div className="container">
      <h1 className="headline-primary">My story</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      {stories.isError && <p>Something went wrong ... </p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <>
          <List list={stories.stories} onRemoveItem={handleRemoveStory} />
        </>
      )}
      <Table content={content} header={contentheader} />
    </div>
  );
};

/* eslint-enable max-lines-per-function */

export default App;
export { storiesReducer, StoriesState, Action, List };
