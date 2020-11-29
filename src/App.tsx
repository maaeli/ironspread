import React from 'react';
import ReactDom from 'react-dom';
import Button from '@material-ui/core/Button';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);




interface article {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

const Item = ({title, url, author, num_comments, points, objectID}: article) => (
  <div>
    <span>
      <a href={url}>{item.title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </div>
);

type ListProps = {
  list: Array<article>
}

const List = ({list}: ListProps) =>
    list.map(({objectID, ...item}: article)
      => <Item key={objectID} {...item} />);


type Table1props = {
  header: Array<string>,
  content: Array<Array<string>>,
}

const Table1 = ({header, content}: Table1props) => {
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

type SearchProps = {
  search: string,
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const Search = ({search, onSearch}: SearchProps) =>
  (<div>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" value={search} onChange={onSearch} />
  </div>);


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

  const [searchTerm, setSearchTerm] = React.useState('React');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story: article) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Search search={searchTerm} onSearch={handleSearch}/>
      <p>Searching for <strong>{searchTerm}</strong></p>
      <hr />
      <List list={searchedStories} />
      <Table1 content={content} header={contentheader}/>
    </div>
  );
}


ReactDom.render(<App />, mainElement);
