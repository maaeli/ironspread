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

type ListProps = {
  list: Array<article>
}

const List = (props: ListProps) => {
   return props.list.map((item: article) =>  (
        <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>END</span>
      </div>)
   );
}

type Table1props = {
  content: Array<Array<string>>,
}

const Table1 = (props: Table1props) => {
  return props.content.map((row, rowNumber) => (
      <div>
      {row.map((cell, columnNumber) =>
            <input type="text" value={cell} key={rowNumber + "," + columnNumber}
                   name="name"
                   onChange={event => console.log(rowNumber, columnNumber, event.target.value)}/>
          )}
      </div>
  ))
}

type SearchProps = {
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const Search = (props: SearchProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  return(<div>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" onChange={props.onSearch} />

  </div>)
}


const App = () => {
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

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story: article) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Search onSearch={handleSearch}/>
      <p>Searching for <strong>{searchTerm}</strong></p>
      <hr />
      <List list={searchedStories} />
      <Table1 content={content}/>
    </div>
  );
}


ReactDom.render(<App />, mainElement);
