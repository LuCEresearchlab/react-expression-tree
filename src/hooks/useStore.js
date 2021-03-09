import { useReducer, useMemo, useEffect } from 'react';

import actions from '../store/actions';
import reducer from '../store/reducers';
import createInitialState from '../store/initialState';

import createPositionUtils from '../utils/position';

function useStore({
  propNodes,
  propSelectedNode,
  propEdges,
  propSelectedEdge,
  propSelectedRootNode,
  propStagePos,
  propStageScale,
  propConnectorPlaceholder,
  propPlaceholderWidth,
  propFontSize,
  propFontFamily,
}) {
  const utils = useMemo(() => createPositionUtils(
    propFontSize,
    propFontFamily,
    propConnectorPlaceholder,
    propPlaceholderWidth,
  ), [propFontSize, propFontFamily, propConnectorPlaceholder, propPlaceholderWidth]);

  const [store, dispatch] = useReducer(reducer, createInitialState(
    utils.sanitizeNodes(propNodes),
    propSelectedNode,
    utils.sanitizeEdges(propEdges),
    propSelectedEdge,
    propSelectedRootNode,
    propStagePos,
    propStageScale,
    propConnectorPlaceholder,
    propPlaceholderWidth,
    propFontSize,
    propFontFamily,
  ));

  const storeActions = useMemo(() => {
    const temp = {};
    actions.forEach((item) => {
      temp[item.name] = (payload) => {
        dispatch(item.action(payload));
      };
    });
    return temp;
  }, [dispatch]);

  useEffect(() => {
    if (propNodes !== undefined && propNodes !== null) {
      storeActions.setNodes({ nodes: utils.sanitizeNodes(propNodes) });
    }
  }, [dispatch, propNodes, utils.sanitizeNodes]);

  useEffect(() => {
    if (propSelectedNode !== undefined && propSelectedNode !== null) {
      storeActions.setSelectedNode(propSelectedNode);
    } else {
      storeActions.clearSelectedNode();
    }
  }, [dispatch, propSelectedNode]);

  useEffect(() => {
    if (propEdges !== undefined && propEdges !== null) {
      storeActions.setEdges({ edges: utils.sanitizeEdges(propEdges) });
    }
  }, [dispatch, propEdges, utils.sanitizeEdges]);

  useEffect(() => {
    if (propSelectedEdge !== undefined && propSelectedEdge !== null) {
      storeActions.setSelectedEdge(propSelectedEdge);
    } else {
      storeActions.clearSelectedEdge();
    }
  }, [dispatch, propSelectedEdge]);

  useEffect(() => {
    if (propSelectedRootNode !== undefined && propSelectedRootNode !== null) {
      storeActions.setSelectedRootNode(propSelectedRootNode);
    } else {
      storeActions.clearSelectedRootNode();
    }
  }, [dispatch, propSelectedRootNode]);

  useEffect(() => {
    if (propStagePos !== undefined && propStagePos !== null) {
      storeActions.setStagePos(propStagePos);
    }
  }, [dispatch, propStagePos]);

  useEffect(() => {
    if (propStageScale !== undefined && propStageScale !== null) {
      storeActions.setStageScale(propStageScale);
    }
  }, [dispatch, propStageScale]);

  useEffect(() => {
    if (propConnectorPlaceholder !== undefined && propConnectorPlaceholder !== null) {
      storeActions.setConnectorPlaceholder({ connectorPlaceholder: propConnectorPlaceholder });
    }
  }, [dispatch, propConnectorPlaceholder]);

  useEffect(() => {
    if (propPlaceholderWidth !== undefined && propPlaceholderWidth !== null) {
      storeActions.setPlaceholderWidth({ placeholderWidth: propPlaceholderWidth });
    }
  }, [dispatch, propPlaceholderWidth]);

  useEffect(() => {
    if (propFontSize !== undefined && propFontSize !== null) {
      storeActions.setFontSize({ fontSize: propFontSize });
    }
  }, [dispatch, propFontSize]);

  useEffect(() => {
    if (propFontFamily !== undefined && propFontFamily !== null) {
      storeActions.setFontFamily({ fontFamily: propFontFamily });
    }
  }, [dispatch, propFontFamily]);

  return [store, storeActions, utils];
}

export default useStore;
