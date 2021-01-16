import React, {
  FunctionComponent,
  ReactChild,
  ReactChildren,
  ReactElement,
} from 'react';

type InputWithLabelProps = {
  id: string;
  label?: string;
  type?: string;
  value: string;
  isFocused: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactChild | ReactChildren;
};

const InputWithLabel: FunctionComponent<InputWithLabelProps> = ({
  id,
  label,
  type = 'text',
  value,
  isFocused,
  onInputChange,
  children,
}: InputWithLabelProps): ReactElement => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id} className="label">
        {children}
      </label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
};

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent) => void;
};

const SearchForm: FunctionComponent<SearchFormProps> = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps): ReactElement => (
  <>
    <form onSubmit={onSearchSubmit} className="search-form">
      <InputWithLabel
        id="search"
        value={searchTerm as string}
        isFocused
        onInputChange={onSearchInput}
      >
        Search:
      </InputWithLabel>
      <button
        type="submit"
        disabled={!searchTerm}
        className="button button_large"
      >
        Submit
      </button>
    </form>
    <p>
      Searching for <strong>{searchTerm}</strong>
    </p>
  </>
);

export default SearchForm;
export { InputWithLabel, InputWithLabelProps, SearchFormProps };
