import React,  { FunctionComponent, ReactChild, ReactChildren } from 'react';
import ReactDom from 'react-dom';
import Button from '@material-ui/core/Button';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const useSemiPersistentState = (key: string, initialState: any) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {localStorage.setItem(key, value);}, [value, key]);

  return [value, setValue];
};


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
    const handleRemoveItem = () => {onRemoveItem(item)};
    const {title, url, author, num_comments, points, objectID} = item;
    return (<div>
              <span><a href={url}>{title}</a></span>
              <span>{author}</span>
              <span>{num_comments}</span>
              <span>{points}</span>
              <span><button type="button" onClick={handleRemoveItem}>Dismiss</button></span>
            </div>
        );
};

type ListProps = {
  list: Array<article>
  onRemoveItem: (item: article) => void,
}

const List: FunctionComponent<ListProps>  = ({list, onRemoveItem}: ListProps) => (<>
    {list.map((item: article) => (<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>))}  </>);


type Table1props = {
  header: Array<string>,
  content: Array<Array<string>>,
}

const Table1: FunctionComponent<Table1props> = ({header, content}: Table1props) => {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  return (<>
      <div key="labels"><span key="corner1"></span>
      {header.map((cell, columnNumber) => (<span key={"label " + columnNumber}>{alphabet[columnNumber]}</span>))}
      </div>
      <div key="headers"><span key="corner2"></span>
      {header.map((cell, columnNumber) => (<span key={"header " + columnNumber}>{cell}</span>))}
      </div>
      {content.map((row, rowNumber) => (
      <div key={"row" + rowNumber}>
        {row.map((cell, columnNumber) =>
              <input type="text" value={cell} key={rowNumber + "," + columnNumber}
                     name="name"
                     onChange={event => console.log(rowNumber, columnNumber, event.target.value)}/>
         )}
     </div>))} </> )
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

  const initialStories = [
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

const App = () => {

  const contentheader = ["Alabel", "Blabel", "Clabel" ]
  const content = [
    ["A1","B1","C1"],
    ["A2","B2","C2"]
  ]


  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [stories, setStories] = React.useState(initialStories);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item: article) => {
    const newStories = stories.filter(story => item.objectID !== story.objectID);
    setStories(newStories);
  }

  const searchedStories = stories.filter((story: article) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <InputWithLabel id="search"  value={searchTerm} isFocused onInputChange={handleSearch}>Search: </InputWithLabel>
      <p>Searching for <strong>{searchTerm}</strong></p>
      <hr />
      <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
      <Table1 content={content} header={contentheader}/>
    </div>
  );
}

export default App;

ReactDom.render(<App />, mainElement);
