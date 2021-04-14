import { useEffect, useReducer } from 'react';

const initState = {
  isBackpasceOrDeleteKeyPressed: false,
  isEscapedKeyPressed: false,
};

function reducer(state, action) {
  const reducers = {
    resetAll: () => ({
      ...initState,
    }),
    setIsBackpasceOrDeleteKeyPressed: (previousState, payload) => ({
      ...previousState,
      isBackpasceOrDeleteKeyPressed: payload,
    }),
    setIsEscapedKeyPressed: (previousState, payload) => ({
      ...previousState,
      isEscapedKeyPressed: payload,
    }),
  };

  const { type, payload } = action;
  if (!(type in reducers)) throw new Error(`Unknown action: ${type}, ${payload}`);
  return reducers[type](state, payload);
}

function useKeypress(targetRef, isFullDisabled) {
  const [store, dispatch] = useReducer(reducer, initState);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!isFullDisabled) {
      const handleKeydown = (e) => {
        const { key } = e;
        switch (key) {
          case 'Backspace':
          case 'Delete':
            if (!store.isBackpasceOrDeleteKeyPressed) {
              dispatch({ type: 'setIsBackpasceOrDeleteKeyPressed', payload: true });
            }
            break;
          case 'Escape':
            if (!store.isEscapedKeyPressed) {
              dispatch({ type: 'setIsEscapedKeyPressed', payload: true });
            }
            break;
          case 'Meta':
          case 'Shift':
            break;
          default:
            break;
        }
      };

      const handleKeyup = (e) => {
        const { key } = e;
        switch (key) {
          case 'Backspace':
          case 'Delete':
            dispatch({ type: 'setIsBackpasceOrDeleteKeyPressed', payload: false });
            break;
          case 'Escape':
            dispatch({ type: 'setIsEscapedKeyPressed', payload: false });
            break;
          case 'Meta':
          case 'Shift':
            break;
          default:
            break;
        }
      };

      const handleOnBlur = () => {
        dispatch({ type: 'resetAll' });
      };

      if (targetRef && targetRef.current) {
        targetRef.current.addEventListener('keydown', handleKeydown);
        targetRef.current.addEventListener('keyup', handleKeyup);
        targetRef.current.addEventListener('blur', handleOnBlur);
      }

      return () => {
        if (targetRef && targetRef.current) {
          targetRef.current.removeEventListener('keydown', handleKeydown);
          targetRef.current.removeEventListener('keyup', handleKeyup);
          targetRef.current.removeEventListener('blur', handleOnBlur);
        }
      };
    }
  }, [dispatch, isFullDisabled, store, targetRef.current]);

  return store;
}

export default useKeypress;
