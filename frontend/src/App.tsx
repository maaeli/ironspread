import React, {
  FunctionComponent,
  ReactElement,
  Dispatch,
  SetStateAction,
} from 'react';
import axios from 'axios';
import Item, { article } from './Item';
import SearchForm from './SearchForm';
import Table, { TableProps } from './Table';
import './App.css';
import { parse_account_json_to_table } from './data';

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

type StoriesAction =
  | { type: 'STORIES_FETCH_INIT' }
  | { type: 'STORIES_FETCH_SUCCESS'; payload: Array<article> }
  | { type: 'STORIES_FETCH_FAILURE' }
  | { type: 'REMOVE_STORIES'; payload: article };

type StoriesState = {
  stories: Array<article>;
  isLoading: boolean;
  isError: boolean;
};

const storiesReducer = (state: StoriesState, action: StoriesAction): StoriesState => {
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

type AccountDataAction =
  | { type: 'ACCOUNT_DATA_FETCH_INIT' }
  | { type: 'ACCOUNT_DATA_FETCH_SUCCESS'; payload: any }


type AccountDataState = {
  tableData?: TableProps,
  isLoading: boolean;
  isError: boolean;
};

const accountDataReducer = (state: AccountDataState, action: AccountDataAction): AccountDataState => {
  switch (action.type) {
    case 'ACCOUNT_DATA_FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'ACCOUNT_DATA_FETCH_SUCCESS':
      const { header, content } = parse_account_json_to_table(action.payload);
      return { ...state, isLoading: false, isError: false };
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

  const [account_data, dispatch_account_data] = React.useReducer(accountDataReducer, {
    isLoading: true,
    isError: false,
  });

  const [url, setUrl] = React.useState(`${DEMO_API_ENDPOINT}${searchTerm}`);

  const demo = "";

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
  }, [url as String]);

  const handleFetchAccountData = React.useCallback(() => {
    dispatch_account_data({ type: 'ACCOUNT_DATA_FETCH_INIT' });
    axios
      .get('http://localhost:8081/account_data')
      .then((result) => {
        dispatch_account_data({
          type: 'ACCOUNT_DATA_FETCH_SUCCESS',
          payload: result.data,
        });
      })
      .catch(() => { });
  }, [demo as string]);

  React.useEffect(() => {
    handleFetchStories();
  }, [url as String]);

  React.useEffect(() => {
    handleFetchAccountData();
  }, [demo as string]);

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
      {account_data.isLoading ? (
        <p>Waiting for data ...</p>
      ) : (
        <>
          <Table content={content} header={contentheader} />
        </>
      )}
    </div>
  );
};

/* eslint-enable max-lines-per-function */

export default App;
export { storiesReducer, StoriesState, StoriesAction, List };
