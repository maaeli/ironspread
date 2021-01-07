import React, { FunctionComponent, ReactElement } from 'react';
import './App.css';
import { ReactComponent as Check } from './check.svg';

interface article {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

type ItemProps = {
  item: article;
  onRemoveItem: (item: article) => void;
};

const Item: FunctionComponent<ItemProps> = ({
  item,
  onRemoveItem,
}: ItemProps): ReactElement => {
  const { title, url, author, num_comments, points } = item;
  return (
    <div className="item">
      <span style={{ width: '40%' }}>
        <a href={url}>{title}</a>
      </span>
      <span style={{ width: '30%' }}>{author}</span>
      <span style={{ width: '10%' }}>{num_comments}</span>
      <span style={{ width: '10%' }}>{points}</span>
      <span style={{ width: '10%' }}>
        <button
          type="button"
          onClick={(): void => onRemoveItem(item)}
          className="button button_small"
        >
          <Check height="18px" width="18px" />
        </button>
      </span>
    </div>
  );
};

export default Item;
export { article, ItemProps };
