import React, {useReducer, useCallback, useMemo, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET': return action.ingredients;
    case 'ADD': return [...currentIngredients, action.ingredient];
    case 'DELETE': return currentIngredients.filter(ing => ing.id !== action.id);
    default: throw new Error('Invalid action type')
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, data, error, sendRequest, extra, id} = useHttp();

  console.log('Rendering Ingredients');

  useEffect(() => {
    if(!isLoading && !error) {
      if(id === 'DELETE_INGREDIENT') {
        dispatch({type: 'DELETE', id: extra})
      } else if (id === 'ADD_INGREDIENT') {
        console.log(data);
        dispatch({
          type: 'ADD',
          ingredient: {
            id: data.name,
            ...extra
          }
        });
      } else {
        // Unhandled
      }
    }
  }, [data, extra, id, isLoading, error]);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-update-c82b6.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest])

  const removeIngredientHandler = useCallback((id) => {
    sendRequest(
      `https://react-hooks-update-c82b6.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id,
      'DELETE_INGREDIENT'
    );
  }, [sendRequest])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({
      type: 'SET',
      ingredients: filteredIngredients
    });
  }, [])

  const closeErrorHandler = useCallback(() => {
    //dispatchHttp({type: 'RESET_ERROR'});
  }, [])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeErrorHandler}>{error}</ErrorModal>}
      <IngredientForm addIngredientHandler={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
