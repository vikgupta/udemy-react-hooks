import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props;
  const [enteredSearch, setEnteredSearch] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredSearch === inputRef.current.value) {
        const query = enteredSearch.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredSearch}"`;
        fetch('https://react-hooks-update-c82b6.firebaseio.com/ingredients.json' + query)
        .then(response => response.json())
        .then(data => {
          const loadedIngredients = [];
          for(const key in data) {
            loadedIngredients.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount
            });
          }
          onLoadIngredients(loadedIngredients);
        })
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    }
  }, [enteredSearch, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
