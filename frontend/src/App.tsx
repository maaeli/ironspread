import React, { FunctionComponent, ReactChild, ReactChildren } from 'react';
import ReactDom from 'react-dom';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const DEMO_API_ENDPOINT = 'http://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = <S extends unknown>(
  key: string,
  initialState: S,
) => {
  const [value, setValue] = React.useState(
  localStorage.getItem(key) || initialState
);

  React.useEffect(() => {localStorage.setItem(key, value as string);}, [value, key]);

  return [value, setValue];
};

type Action =
 | {type: 'STORIES_FETCH_INIT'}
 | {type: 'STORIES_FETCH_SUCCESS', payload: Array<article>}
 | {type: 'STORIES_FETCH_FAILURE'}
 | {type: 'REMOVE_STORIES', payload: article}

type StoriesState = {
  stories: Array<article>,
  isLoading: boolean,
  isError: boolean,
};

const storiesReducer = (state: StoriesState, action: Action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {...state,
              isLoading: true,
              isError: false,}
    case 'STORIES_FETCH_SUCCESS':
      return {...state,
              stories: action.payload,
              isLoading: false,
              isError: false,};
    case 'STORIES_FETCH_FAILURE':
      return {...state,
              isLoading: false,
              isError: true,}
    case 'REMOVE_STORIES':
      return {...state,
              stories: state.stories.filter(story => action.payload.objectID !== story.objectID),};
    default: throw new Error();
  }
}


interface article {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}



type ItemProps = {
  item: article,
  onRemoveItem: (item: article) => void,
};

const Item: FunctionComponent<ItemProps> = ({item,onRemoveItem}: ItemProps) => {
    const {title, url, author, num_comments, points, objectID} = item;
    return (<div>
              <span><a href={url}>{title}</a></span>
              <span>{author}</span>
              <span>{num_comments}</span>
              <span>{points}</span>
              <span><button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button></span>
            </div>
        );
};

type ListProps = {
  list: Array<article>,
  onRemoveItem: (item: article) => void,
}

const List: FunctionComponent<ListProps>  = ({list, onRemoveItem}: ListProps) => (<>
    {list.map((item: article) => (<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>))}  </>);


type Table1props = {
  header: Array<string>,
  content: Array<Array<string>>,
}

const Table1: FunctionComponent<Table1props> = ({header, content}: Table1props) => {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  return (<table key="table">
      <thead key="head">
      <tr key="labels"><td key="corner1"></td>
      {header.map((cell, columnNumber) => (<td key={"label " + columnNumber}>{alphabet[columnNumber]}</td>))}
      </tr>
      <tr key="headers"><td key="corner2"></td>
      {header.map((cell, columnNumber) => (<td key={"header " + columnNumber}>{cell}</td>))}
      </tr>
      </thead>
      <tbody key="body">
      {content.map((row, rowNumber) => (
      <tr key={"row" + rowNumber}><td>{rowNumber}</td>
        {row.map((cell, columnNumber) =>
              <td key={"cell " + rowNumber + "," + columnNumber}><input type="text" value={cell} key={rowNumber + "," + columnNumber}
                     name="name"
                     onChange={event => console.log(rowNumber, columnNumber, event.target.value)}/></td>)}
     </tr>))} </tbody></table> )
}

type InputWithLabelProps = {
  id: string,
  label?: string,
  type?: string,
  value: string,
  isFocused: boolean,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  children?: ReactChild | ReactChildren;
}

const InputWithLabel: FunctionComponent<InputWithLabelProps> =
  ({id, label, type="text", value, isFocused, onInputChange, children}: InputWithLabelProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {if (isFocused && inputRef.current) {inputRef.current.focus();}}, [isFocused]);
    return (<>
        <label htmlFor={id}>{children}</label>&nbsp;
        <input ref={inputRef} id={id} type={type} value={value} autoFocus={isFocused} onChange={onInputChange} />
      </>);
  };

  const initialStories: article[] = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
];

type StoryList = {
  stories: Array<article>,
};


type StoryPromise = {
  data: StoryList,
};

const getAsyncStories = () => new Promise<StoryPromise>((resolve) =>
  setTimeout(() => resolve({data: {stories: initialStories}}), 20000));
  //setTimeout(reject, 20000));

const App = () => {

  const contentheader = ["Alabel", "Blabel", "Clabel" ]
  const content = [
    ["A1","B1","C1"],
    ["A2","B2","C2"]
  ]


  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    stories: [] as article[],
    isLoading: false,
    isError: false});

  React.useEffect(() => {
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    fetch(`${DEMO_API_ENDPOINT}react`)
      .then((response) =>  response.json())
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits});
        })
      .catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE' }));
    }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item: article) => {
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
  };

  const searchedStories = stories.stories.filter((story: article) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        Search:
      </InputWithLabel>
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
      <hr />
      {stories.isError && <p>Something went wrong ... </p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <>
          <List list={searchedStories} onRemoveItem={handleRemoveStory} />
          <Table1 content={content} header={contentheader} />
        </>
      )}
    </div>
  );
};

export default App;

ReactDom.render(<App />, mainElement);
