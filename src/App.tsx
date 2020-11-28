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

const list = [
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

const List = () => {
   return list.map((item: article) =>  (
        <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>END</span>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </div>)
   );
}


const App = () => {
  return (
    <div>
    <h1>Hi</h1>
    <hr />
    <List />
    </div>
  );
}


ReactDom.render(<App />, mainElement);
