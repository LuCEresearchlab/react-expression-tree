/* eslint-disable react/forbid-prop-types */
import React, { useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

import ActivityStateContext from './ActivityStateContext';

function createReducer(reducers) {
  return function reducer(state, action) {
    const { type, payload } = action;
    return reducers[type](state, payload);
  };
}

const ActivityStateManager = ({
  children,
  actions,
  reducers,
  defaultState,
  initialActivityState,
}) => {
  const initialState = useMemo(() => {
    if (initialActivityState !== undefined) {
      return {
        ...defaultState,
        activityState: initialActivityState,
        ready: true,
      };
    }
    return {
      ...defaultState,
      ready: true,
    };
  }, []);

  const reducer = useMemo(() => createReducer(reducers), [reducers]);
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchActions = useMemo(() => {
    const temp = {};
    actions.forEach((item) => {
      temp[item.name] = (payload) => {
        dispatch(item.action(payload));
      };
    });
    return temp;
  }, [dispatch]);

  return (
    <ActivityStateContext.Provider
      value={{
        ...state,
        ...dispatchActions,
      }}
    >
      {children}
    </ActivityStateContext.Provider>
  );
};

ActivityStateManager.propTypes = {
  children: PropTypes.element.isRequired,
  actions: PropTypes.array.isRequired,
  reducers: PropTypes.object.isRequired,
  initialActivityState: PropTypes.object.isRequired,
  defaultState: PropTypes.object.isRequired,
};

export default ActivityStateManager;
