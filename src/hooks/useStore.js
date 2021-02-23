import { useReducer, useMemo } from 'react';

import actions from '../store/actions';
import reducer from '../store/reducers';
import reducerInitialState from '../store/initialState';

function useStore(ctx, connectorPlaceholder) {
  const [store, dispatch] = useReducer(reducer, {
    ...reducerInitialState,
    connectorPlaceholder,
  });

  const storeActions = useMemo(() => {
    const temp = {};
    actions.forEach((item) => {
      temp[item.name] = (payload) => {
        dispatch(item.action(payload));
      };
    });
    return temp;
  }, [dispatch]);

  return [store.expressionTreeEditor, storeActions];
}

export default useStore;
