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

const Item: FunctionComponent<article> = ({title, url, author, num_comments, points, objectID}) => (
  <div>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </div>
);

type ListProps = {
  list: Array<article>
}

const List: FunctionComponent<ListProps>  = ({list}: ListProps) => (<>
    {list.map((item: article) => (<Item key={item.objectID} {...item} />))}</>);


type Table1props = {
  header: Array<string>,
  content: Array<Array<string>>,
}

const Table1: FunctionComponent<Table1props> = ({header, content}: Table1props) => {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  return (<div>
      <div><span key="corner1"></span>
      {header.map((cell, columnNumber) => (<span key={"label " + columnNumber}>{alphabet[columnNumber]}</span>))}
      </div>
      <div><span key="corner2"></span>
      {header.map((cell, columnNumber) => (<span key={"header " + columnNumber}>{cell}</span>))}
      </div>
      {content.map((row, rowNumber) => (
      <div>
        {row.map((cell, columnNumber) =>
              <input type="text" value={cell} key={rowNumber + "," + columnNumber}
                     name="name"
                     onChange={event => console.log(rowNumber, columnNumber, event.target.value)}/>
         )}
     </div>))} </div> )
}

type InputWithLabelProps = {
  id: string,
  label?: string,
  type?: string,
  value: string,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  children?: ReactChild | ReactChildren;
}

const InputWithLabel = ({id, label, type="text", value, onInputChange, children}: InputWithLabelProps) =>
  (<>
    <label htmlFor={id}>{children}</label>
    <input id={id} type={type} value={value} onChange={onInputChange} />
  </>);


const App = () => {

  const contentheader = ["Alabel", "Blabel", "Clabel" ]
  const content = [
    ["A1","B1","C1"],
    ["A2","B2","C2"]
  ]
  const stories = [
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

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story: article) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <InputWithLabel id="search"  value={searchTerm} onInputChange={handleSearch}>Search: </InputWithLabel>
      <p>Searching for <strong>{searchTerm}</strong></p>
      <hr />
      <List list={searchedStories} />
      <Table1 content={content} header={contentheader}/>
    </div>
  );
}


ReactDom.render(<App />, mainElement);
