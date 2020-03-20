import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

import useHttp from '../../hooks/http';

const Search = React.memo(props => {
  const {isLoading, data, error, sendRequest, resetError} = useHttp();

  const {onLoadIngredients} = props;
  const [enteredSearch, setEnteredSearch] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    if(!isLoading && !error && data) {
      const loadedIngredients = [];
      for(const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, onLoadIngredients, isLoading, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredSearch === inputRef.current.value) {
        const query = enteredSearch.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredSearch}"`;
        sendRequest(
          'https://react-hooks-update-c82b6.firebaseio.com/ingredients.json' + query
        );
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    }
  }, [enteredSearch, sendRequest, inputRef]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={resetError}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input 
            type="text"
            ref={inputRef} 
            value={enteredSearch} 
            onChange={event => {
              setEnteredSearch(event.target.value);
            }} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
