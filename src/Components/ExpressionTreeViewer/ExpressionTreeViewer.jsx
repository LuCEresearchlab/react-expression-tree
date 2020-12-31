import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import ExpressionTreeEditor from '../ExpressionTreeEditor';
import reducer from '../store/reducers';

export const store = createStore(reducer);

/**
 * This component is needed only because we are using REDUX,
 * we do not need to wrap ExpressionTreeEditor otherwise.
 *
 * @param  {...any} props
 */
export default function ExpressionTreeViewer(...props) {
  return (
    <Provider store={store}>
      <ExpressionTreeEditor {...props[0]}/>
    </Provider>
  );
}
