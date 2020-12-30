import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import fscreen from 'fscreen';
// import { makeStyles } from '@material-ui/core/styles';

import {
  AddRounded,
  ArrowBackRounded,
  ArrowForwardRounded,
  AspectRatioRounded,
  CheckRounded,
  ChevronLeftRounded,
  ClearRounded,
  CloseRounded,
  FullscreenExitRounded,
  FullscreenRounded,
  GetAppRounded,
  ExpandMore,
  InfoOutlined,
  MenuRounded,
  NoteAddRounded,
  PhotoCameraRounded,
  PublishRounded,
  RedoRounded,
  UndoRounded,
  UpdateRounded,
  ViewModuleRounded,
  ZoomInRounded,
  ZoomOutRounded,
} from '@material-ui/icons';

import {
  Drawer,
  IconButton,
  Popover,
  Typography,
  TextField,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  computeNodeWidth,
  edgeByParentPiece,
  nodeById,
  parsePieces,
} from '../utils';

// Width of the side drawer
const drawerWidth = 300;

// Top bar and side drawer styles
// const useStyles = makeStyles((theme) => ({
//   drawer: {
//     width: drawerWidth,
//     position: 'absolute',
//     top: '50px',
//     maxHeight: '92%',
//     overflowY: 'scroll',
//     marginLeft: '1px',
//   },
//   toolbar: {
//     zIndex: '1',
//     position: 'absolute',
//     margin: '1px 0 0 1px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   toolbarButton: {
//     backgroundColor: '#fff',
//     '&:hover': {
//       backgroundColor: '#f5f5f5',
//     },
//     '&:disabled': {
//       backgroundColor: '#fff',
//     },
//   },
//   drawerInfo: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     margin: '10px 0 0 10px',
//   },
//   drawerField: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: '0 0 10px 10px',
//   },
//   editText: {
//     margin: '10px 0 10px 10px',
//   },
//   infoPopover: {
//     marginLeft: '5px',
//   },
//   infoPopoverText: {
//     border: '2px solid',
//     borderRadius: '4px',
//     borderColor: theme.palette.primary.main,
//     padding: '3px 6px 3px 6px',
//     maxWidth: '500px',
//   },
//   accordionContainer: {
//     display: 'block',
//     padding: 0,
//     margin: '0 10px 10px 10px',
//   },
//   templateElement: {
//     color: 'white',
//     backgroundColor: '#208020',
//     border: 'solid 1px black',
//     borderRadius: '5px',
//     padding: '3px 10px 7px 10px',
//     fontFamily: 'Ubuntu Mono, Courier',
//     fontSize: '22px',
//     '&:hover': {
//       cursor: 'pointer',
//     },
//     marginBottom: '-10px',
//   },
//   selectedTemplateElement: {
//     color: 'white',
//     backgroundColor: '#3f50b5',
//     border: 'solid 2px black',
//     borderRadius: '5px',
//     padding: '3px 10px 7px 10px',
//     fontFamily: 'Ubuntu Mono, Courier',
//     fontSize: '22px',
//     '&:hover': {
//       cursor: 'pointer',
//     },
//     marginBottom: '-10px',
//     boxShadow: '3px 3px 3px black',
//   },
//   templateContainer: {
//     maxHeight: '200px',
//     overflowY: 'scroll',
//   },
//   typeField: {
//     margin: '10px 10px 10px 10px',
//   },
//   typeButtonContainer: {
//     maxHeight: '150px',
//     overflowY: 'scroll',
//     borderRadius: '3px',
//     marginTop: '10px',
//     paddingTop: '10px',
//     padding: '5px 20px 5px 20px',
//     boxShadow: '0 0 1px 1px #ddd',
//   },
//   typeButton: {
//     marginRight: '30px',
//   },
//   infoContent: {
//     maxHeight: '300px',
//     overflowY: 'scroll',
//   },
// }));

function StageDrawer({
  stageRef,
  layerRef,
  transformerRef,
  selectedEdgeRef,
  setSelectedEdgeRef,
  setIsSelectedRectVisible,
  setCurrentErrorLocation,
  initialState,
  toolbarButtons,
  drawerFields,
  fullDisabled,
  connectorPlaceholder,
  templateNodes,
  nodeTypes,
  reportedErrors,
  onNodePiecesChange,
  onNodeTypeChange,
  onNodeValueChange,
  onValidate,
  fontSize,
  fontFamily,
  yPad,
  textHeight,
  nodes,
  edges,
  canUndo,
  canRedo,
  stageReset,
  reorderNodes,
  uploadState,
  addingNode,
  isAddEmpty,
  addingNodeClick,
  clearAdding,
  addValueChange,
  editValue,
  isEditEmpty,
  editValueChange,
  editNode,
  typeValue,
  typeValueChange,
  nodeTypeEdit,
  nodeValue,
  nodeValueChange,
  nodeValueEdit,
  selectedNode,
  clearNodeSelection,
  selectedRootNode,
  clearEdgeSelection,
}) {
  const classes = {};
  const dispatch = useDispatch();

  // State hooks
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [addAnchorEl, setAddAnchorEl] = useState(null);
  const isAddInfoOpen = !!addAnchorEl;
  const [editAnchorEl, setEditAnchorEl] = useState(null);
  const isEditInfoOpen = !!editAnchorEl;
  const [isResetWarnOpen, setIsResetWarnOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [currentError, setCurrentError] = useState(0);
  const [isValidOpen, setIsValidOpen] = useState(false);
  const [isInvalidOpen, setIsInvalidOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Handle adding node value change event
  const handleAddChange = (value) => {
    if (addingNode) {
      clearAdding();
    }
    setSelectedTemplate(null);
    const addValue = parsePieces(value, connectorPlaceholder);
    addValueChange({ addValue });
  };

  // Handle editing node value change event
  const handleEditChange = (value) => {
    const editValue = parsePieces(value, connectorPlaceholder);
    editValueChange({ editValue });
  };

  // Handle editing node value update
  const handleNodeEdit = () => {
    const nodeWidth = computeNodeWidth(
      editValue,
      connectorPlaceholder,
      fontSize,
      fontFamily,
    );
    editNode({
      pieces: editValue,
      width: nodeWidth,
      selectedNodeId: selectedNode.id,
      onNodePiecesChange,
    });
  };

  // Handle editing node type change
  const handleTypeChange = (value) => {
    nodeValueChange({ nodeValue: '' });
    nodeValueEdit({
      value: '',
      selectedNodeId: selectedNode.id,
      onNodeValueChange,
    });
    if (document.getElementById('valueField')) {
      document.getElementById('valueField').value = '';
    }
    typeValueChange({ typeValue: value });
    nodeTypeEdit({
      type: value,
      selectedNodeId: selectedNode.id,
      onNodeTypeChange,
      onNodeValueChange,
    });
  };

  // Handle editing node value change
  const handleValueChange = (value) => {
    if (document.getElementById('valueField')) {
      document.getElementById('valueField').value = value;
    }
    nodeValueChange({ nodeValue: value });
    nodeValueEdit({
      value,
      selectedNodeId: selectedNode.id,
      onNodeValueChange,
    });
  };

  // Handle state download, serializing the current editor state,
  // only nodes, edges, selected root node, stage position and stage scale are serialized
  const handleStateDownload = () => {
    if (selectedNode) {
      clearNodeSelection();
    } else if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
      clearEdgeSelection();
    }
    const stagePos = stageRef.current.absolutePosition();
    const stageScale = stageRef.current.scale();
    const currentState = {
      nodes,
      edges,
      selectedRootNode,
      stagePos,
      stageScale,
    };
    const stateData = `data:text/json;charset=utf-8,${
      encodeURIComponent(JSON.stringify(currentState, null, 4))}`;
    const downloadElement = document.createElement('a');
    downloadElement.href = stateData;
    downloadElement.download = 'expression_editor_state.json';
    document.body.appendChild(downloadElement);
    downloadElement.click();
    downloadElement.remove();
  };

  // Handle state upload of a previously downloaded state,
  const handleStateUpload = () => {
    const uploadElement = document.getElementById('stateUploadButton');
    uploadElement.click();
  };
  // Handle file change on upload element
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    const fr = new FileReader();
    fr.onload = (e) => {
      try {
        const state = JSON.parse(e.target.result);
        uploadState({
          nodes: state.nodes,
          edges: state.edges,
          selectedRootNode: state.selectedRootNode,
        });
        if (selectedEdgeRef) {
          selectedEdgeRef.moveToBottom();
          setSelectedEdgeRef(null);
        }
        clearAdding();
        if (drawerFields.addField) {
          document.getElementById('addField').value = '';
        }
        addValueChange({ addValue: [] });
        editValueChange({ editValue: [] });
        typeValueChange({ typeValue: '' });
        nodeValueChange({ nodeValue: '' });
        setSelectedTemplate(null);
        stageRef.current.position({ x: state.stagePos.x, y: state.stagePos.y });
        stageRef.current.scale({
          x: state.stageScale.x,
          y: state.stageScale.y,
        });
        transformerRef.current.nodes([]);
        setIsSelectedRectVisible(false);
        stageRef.current
          .find('.Edge')
          .toArray()
          .map((edge) => edge.moveToBottom());
        dispatch(ActionCreators.clearHistory());
      } catch (e) {
        alert('Invalid JSON file.');
      }
    };
    fr.readAsText(file);
  };

  // Handle action undo button click, only unfiltered actions can be undone,
  // the list of filtered and grouped actions is located in the
  // ../store/reducers/treeEditorReducer.js file
  const handleUndo = () => {
    dispatch(ActionCreators.undo());
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
    }
    clearNodeSelection();
    clearEdgeSelection();
    transformerRef.current.nodes([]);
  };

  // Handle action redo button click, only unfiltered actions can be redone,
  // the list of filtered and grouped actions is located in the
  // ../store/reducers/treeEditorReducer.js file
  const handleRedo = () => {
    dispatch(ActionCreators.redo());
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
    }
    clearNodeSelection();
    clearEdgeSelection();
    transformerRef.current.nodes([]);
  };

  // Handle stage reset button click, setting the editor state back to the initial state
  const handleReset = () => {
    setIsResetWarnOpen(false);
    stageReset({
      initialNodes: initialState.initialNodes,
      initialEdges: initialState.initialEdges,
      connectorPlaceholder,
      fontSize,
      fontFamily,
    });
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
    }
    const stage = stageRef.current;
    stage.position({ x: 0, y: 0 });
    stage.scale({ x: 1, y: 1 });
    transformerRef.current.nodes([]);
    clearAdding();
    if (drawerFields.addField) {
      document.getElementById('addField').value = '';
    }
    addValueChange({ addValue: [] });
    editValueChange({ editValue: [] });
    typeValueChange({ typeValue: '' });
    nodeValueChange({ nodeValue: '' });
    setSelectedTemplate(null);
    transformerRef.current.nodes([]);
    setIsSelectedRectVisible(false);
    dispatch(ActionCreators.clearHistory());
  };

  // Handle node template click, setting the adding node textfield value
  // to the selected template value
  const handleTemplateClick = (value, id) => {
    if (addingNode) {
      clearAdding();
    }
    setSelectedTemplate(id);
    document.getElementById('addField').value = value;
    const addValue = parsePieces(value, connectorPlaceholder);
    addValueChange({ addValue });
  };

  // Handle nodes reordering button click.
  // If a root node is selected, all its child nodes will be reordered as a tree,
  // otherwise the nodes will be reordered in a compact rectangle
  const handleReorderClick = () => {
    stageRef.current.position({ x: 0, y: 0 });
    stageRef.current.scale({ x: 1, y: 1 });
    reorderNodes({
      connectorPlaceholder,
      reorderStartingX: isDrawerOpen
        ? drawerWidth + (stageRef.current.attrs.width - drawerWidth) / 2
        : stageRef.current.attrs.width / 2,
      isDrawerOpen,
      drawerWidth,
      textHeight,
    });
  };

  // Handle zoom to fit and centering button click.
  // The stage scale will be adapted to the ratio between
  // the nodes bounding rectangle and the stage size,
  // then the stage will be repositioned,
  // in order to have all the nodes inside the viewport
  const handleCenteringClick = () => {
    const padding = 100;

    const box = layerRef.current.getClientRect({
      relativeTo: stageRef.current,
    });
    const scale = Math.min(
      stageRef.current.width() / (box.width + padding * 2),
      stageRef.current.height() / (box.height + padding * 2),
    );

    stageRef.current.setAttrs({
      x: -box.x * scale + padding * scale,
      y: -box.y * scale + padding * scale,
      scaleX: scale,
      scaleY: scale,
    });
    stageRef.current.draw();
  };

  // In order tree walk starting from a root node, checking at each step
  // if there is an error to be detected (set with the reportedErrors prop).
  // Returns an array of detected errors used to display the errors alerts,
  // containing the error type, the actual error, and the error location.
  function orderWalk(node, visitedNodes, visitedBranch, errors) {
    visitedNodes.push(node.id);
    visitedBranch.push(node.id);
    // Missing node type error
    if (node.type === '') {
      const location = `Node ID: ${node.id}`;
      reportedErrors.completenessErrors
        && reportedErrors.completenessErrors.missingNodeType
        && errors.push({
          type: 'Completeness error',
          problem: 'Missing node type',
          location,
          currentErrorLocation: { node: true, nodeId: node.id },
        });
    }
    // Missing node value error
    if (node.value === '') {
      const location = `Node ID: ${node.id}`;
      reportedErrors.completenessErrors
        && reportedErrors.completenessErrors.missingNodeValue
        && errors.push({
          type: 'Completeness error',
          problem: 'Missing node value',
          location,
          currentErrorLocation: { node: true, nodeId: node.id },
        });
    }
    let connectorNum = 0;
    node.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        connectorNum++;
        const childEdges = edgeByParentPiece(node.id, i, edges);
        // Multiple edge on single hole connector error
        if (childEdges.length > 1) {
          const location = `Node ID: ${node.id}, connector number: ${connectorNum}`;
          reportedErrors.structureErrors
            && reportedErrors.structureErrors.multiEdgeOnHoleConnector
            && errors.push({
              type: 'Structure error',
              problem: 'Multiple edge on single hole connector',
              location,
              currentErrorLocation: {
                pieceConnector: true,
                nodeId: node.id,
                pieceId: i,
              },
            });
          // Empty connector error
        } else if (childEdges.length === 0) {
          const location = `Node ID: ${node.id}, connector number: ${connectorNum}`;
          reportedErrors.completenessErrors
            && reportedErrors.completenessErrors.emptyPieceConnector
            && errors.push({
              type: 'Completeness error',
              problem: 'Empty connector',
              location,
              currentErrorLocation: {
                pieceConnector: true,
                nodeId: node.id,
                pieceId: i,
              },
            });
        }
        childEdges.forEach((edge) => {
          const childNode = nodeById(edge.childNodeId, nodes);
          let foundError = false;
          // Multiple edge on single node connector error
          if (visitedNodes.find((e) => e === childNode.id) !== undefined) {
            const location = `Node ID: ${childNode.id}`;
            reportedErrors.structureErrors
              && reportedErrors.structureErrors.multiEdgeOnNodeConnector
              && errors.find(
                (error) => error.problem === 'Multiple edge on single node connector'
                  && error.location === location,
              ) === undefined
              && errors.push({
                type: 'Structure error',
                problem: 'Multiple edge on single node connector',
                location,
                currentErrorLocation: {
                  nodeConnector: true,
                  nodeId: childNode.id,
                },
              });
            foundError = true;
          }
          // Loop error
          if (visitedBranch.find((e) => e === childNode.id) !== undefined) {
            const location = ` From node ID: ${
              childNode.id
            }, to nodeID: ${
              node.id
            }, connector number: ${
              connectorNum}`;
            reportedErrors.structureErrors
              && reportedErrors.structureErrors.loop
              && errors.push({
                type: 'Structure error',
                problem: 'Loop detected',
                location,
                currentErrorLocation: { edge: true, edgeId: edge.id },
              });
            foundError = true;
          }
          if (foundError) {
            return [errors, visitedBranch];
          }
          [errors, visitedBranch] = orderWalk(
            childNode,
            visitedNodes,
            visitedBranch,
            errors,
          );
        });
      }
    });
    visitedBranch.pop();
    return [errors, visitedBranch];
  }

  // Handle tree validation button click, displaying the resulting validation alerts
  const handleTreeValidation = () => {
    const visitedNodes = [];
    let visitedBranch = [];
    let errors = [];
    [errors, visitedBranch] = orderWalk(
      selectedRootNode,
      visitedNodes,
      visitedBranch,
      errors,
    );
    onValidate(nodes, edges, errors);
    // There are errors
    if (errors.length > 0) {
      setValidationErrors(errors);
      setCurrentError(0);
      setCurrentErrorLocation(errors[0].currentErrorLocation);
      if (selectedNode) {
        clearNodeSelection();
      }
      if (selectedEdgeRef) {
        selectedEdgeRef.moveToBottom();
        setSelectedEdgeRef(null);
        clearEdgeSelection();
      }
      if (
        errors[0].currentErrorLocation.node
        || errors[0].currentErrorLocation.pieceConnector
        || errors[0].currentErrorLocation.nodeConnector
      ) {
        const currentNode = stageRef.current
          .find('.Node')
          .toArray()
          .find(
            (node) => node.attrs.id === errors[0].currentErrorLocation.nodeId,
          );
        currentNode.parent.moveToTop();
      } else if (errors[0].currentErrorLocation.edge) {
        const currentEdge = stageRef.current
          .find('.Edge')
          .toArray()
          .find(
            (edge) => edge.attrs.id === errors[0].currentErrorLocation.edgeId,
          );
        currentEdge.moveToTop();
        setSelectedEdgeRef(currentEdge);
      }
      setIsInvalidOpen(true);
      // There are no errors
    } else {
      setIsValidOpen(true);
    }
  };

  // Handle editor screenshot button click,
  // downloading the image of the current visible stage portion
  const handleImageClick = () => {
    const downloadElement = document.createElement('a');
    downloadElement.href = stageRef.current.toDataURL({ pixelRatio: 2 });
    downloadElement.download = 'expression_editor_image.png';
    document.body.appendChild(downloadElement);
    downloadElement.click();
    downloadElement.remove();
  };

  // Handle zoom in button click, zooming in the stage relative to its center
  const handleZoomInClick = () => {
    const currentScale = stageRef.current.scale();
    stageRef.current.scale({
      x: currentScale.x * 1.2,
      y: currentScale.x * 1.2,
    });
    stageRef.current.draw();
  };

  // Handle zoom out button click, zooming out the stage relative to its center
  const handleZoomOutClick = () => {
    const currentScale = stageRef.current.scale();
    stageRef.current.scale({
      x: currentScale.x * 0.8,
      y: currentScale.x * 0.8,
    });
    stageRef.current.draw();
  };

  // Handle previous validation error button click, changing to the previous error, if there is one
  const handlePreviousErrorClick = () => {
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
    }
    setCurrentError(currentError - 1);
    const { currentErrorLocation } = validationErrors[currentError - 1];
    setCurrentErrorLocation(currentErrorLocation);
    if (
      currentErrorLocation.node
      || currentErrorLocation.pieceConnector
      || currentErrorLocation.nodeConnector
    ) {
      const currentNode = stageRef.current
        .find('.Node')
        .toArray()
        .find((node) => node.attrs.id === currentErrorLocation.nodeId);
      currentNode.parent.moveToTop();
    } else if (currentErrorLocation.edge) {
      const currentEdge = stageRef.current
        .find('.Edge')
        .toArray()
        .find((edge) => edge.attrs.id === currentErrorLocation.edgeId);
      currentEdge.moveToTop();
      setSelectedEdgeRef(currentEdge);
    }
  };

  // Handle next validation error button click, changing to the next error, if there is one
  const handleNextErrorClick = () => {
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
    }
    setCurrentError(currentError + 1);
    const { currentErrorLocation } = validationErrors[currentError + 1];
    setCurrentErrorLocation(currentErrorLocation);
    if (
      currentErrorLocation.node
      || currentErrorLocation.pieceConnector
      || currentErrorLocation.nodeConnector
    ) {
      const currentNode = stageRef.current
        .find('.Node')
        .toArray()
        .find((node) => node.attrs.id === currentErrorLocation.nodeId);
      currentNode.parent.moveToTop();
    } else if (currentErrorLocation.edge) {
      const currentEdge = stageRef.current
        .find('.Edge')
        .toArray()
        .find((edge) => edge.attrs.id === currentErrorLocation.edgeId);
      currentEdge.moveToTop();
      setSelectedEdgeRef(currentEdge);
    }
  };

  // Handle enter/exit fullscreen button click,
  // using fscreen library to support different browsers fullscreen elements
  const handleFullScreenClick = () => {
    !fscreen.fullscreenElement
      ? fscreen.requestFullscreen(document.getElementById('editorContainer'))
      : fscreen.exitFullscreen();
  };

  return (
    <>
      <div className={classes.toolbar}>
        {/* Top bar buttons */}
        {toolbarButtons.drawerButton && !fullDisabled && (
          <Tooltip
            title={isDrawerOpen ? 'Close drawer' : 'Open drawer'}
            placement="bottom"
          >
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              {isDrawerOpen ? <ChevronLeftRounded /> : <MenuRounded />}
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.info && !fullDisabled && (
          <Tooltip title="Editor info" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={() => setIsInfoOpen(true)}
            >
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.reset && !fullDisabled && (
          <Tooltip title="Reset state" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={() => setIsResetWarnOpen(true)}
            >
              <NoteAddRounded />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.undo && !fullDisabled && (
          <Tooltip title="Undo action" placement="bottom">
            <span>
              <IconButton
                className={classes.toolbarButton}
                color="primary"
                disabled={!canUndo}
                onClick={handleUndo}
              >
                <UndoRounded />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {toolbarButtons.redo && !fullDisabled && (
          <Tooltip title="Redo action" placement="bottom">
            <span>
              <IconButton
                className={classes.toolbarButton}
                color="primary"
                disabled={!canRedo}
                onClick={handleRedo}
              >
                <RedoRounded />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {toolbarButtons.zoomOut && !fullDisabled && (
          <Tooltip title="Zoom-out" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={handleZoomOutClick}
            >
              <ZoomOutRounded />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.zoomIn && !fullDisabled && (
          <Tooltip title="Zoom-in" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={handleZoomInClick}
            >
              <ZoomInRounded />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.zoomToFit && !fullDisabled && (
          <Tooltip title="Zoom to fit nodes" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={handleCenteringClick}
            >
              <AspectRatioRounded />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.reorder && !fullDisabled && (
          <Tooltip title="Reorder nodes" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={handleReorderClick}
            >
              <ViewModuleRounded />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.validate && !fullDisabled && (
          <Tooltip title="Validate tree" placement="bottom">
            <span>
              <IconButton
                className={classes.toolbarButton}
                color="primary"
                disabled={!selectedRootNode}
                onClick={handleTreeValidation}
              >
                <CheckRounded />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {toolbarButtons.download && !fullDisabled && (
          <Tooltip title="Download state" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={handleStateDownload}
            >
              <GetAppRounded />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.upload && !fullDisabled && (
          <Tooltip title="Upload state" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={handleStateUpload}
            >
              <PublishRounded />
            </IconButton>
          </Tooltip>
        )}
        <input
          id="stateUploadButton"
          style={{ display: 'none' }}
          type="file"
          accept=".json"
          onChange={(e) => handleFileChange(e)}
        />
        {toolbarButtons.screenshot && !fullDisabled && (
          <Tooltip title="Save state image" placement="bottom">
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={handleImageClick}
            >
              <PhotoCameraRounded />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.fullScreen
          && fscreen.fullscreenEnabled
          && !fullDisabled && (
            <Tooltip
              title={
                !fscreen.fullscreenElement
                  ? 'Enter full screen'
                  : 'Exit full screen'
              }
              placement="bottom"
            >
              <IconButton
                className={classes.toolbarButton}
                color="primary"
                onClick={handleFullScreenClick}
              >
                {!fscreen.fullscreenElement ? (
                  <FullscreenRounded />
                ) : (
                  <FullscreenExitRounded />
                )}
              </IconButton>
            </Tooltip>
        )}
      </div>
      {/* Editor reset warning dialog */}
      <Dialog
        // props required to display the dialog relative to editor container and not relative to viewport
        style={{ position: 'absolute' }}
        BackdropProps={{ style: { position: 'absolute' } }}
        container={document.getElementById('editorContainer')}
        PaperProps={{
          style: { border: '2px solid #3f50b5', borderRadius: '5px' },
        }}
        open={isResetWarnOpen}
        onClose={() => setIsResetWarnOpen(false)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleReset();
          }
        }}
      >
        <DialogTitle>
          Are you sure you want to reset the editor state?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible. If you want to save the current editor
            state for future editing, be sure to download it using the apposite
            button in the toolbar before proceeding.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            endIcon={<CloseRounded />}
            onClick={() => setIsResetWarnOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<CheckRounded />}
            onClick={handleReset}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Editor info dialog */}
      <Dialog
        // props required to display the dialog relative to editor container and not relative to viewport
        style={{ position: 'absolute' }}
        BackdropProps={{ style: { position: 'absolute' } }}
        container={document.getElementById('editorContainer')}
        PaperProps={{
          style: { border: '2px solid #3f50b5', borderRadius: '5px' },
        }}
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            setIsInfoOpen(false);
          }
        }}
      >
        <DialogTitle>Expression Tree Editor Usage Infos</DialogTitle>
        <DialogContent className={classes.infoContent} dividers>
          <ul>
            <li>
              <b>Stage scroll: </b>
              Zoom in/out the editor stage.
            </li>
            <br />
            <li>
              <b>Stage drag: </b>
              Move the editor stage.
            </li>
            <br />
            <li>
              <b>Shift/Command + stage drag: </b>
              Drag a selection rectangle to
              create a multiple nodes draggable selection.
            </li>
            <br />
            <li>
              <b>Node click: </b>
              Select a node.
            </li>
            <br />
            <li>
              <b>Node drag: </b>
              Move a node.
            </li>
            <br />
            <li>
              <b>Node double click: </b>
              Select/Deselect a root node to
              activate/deactivate the tree validation button.
            </li>
            <br />
            <li>
              <b>Nodes reordering: </b>
              If a root node is selected, all its
              children nodes will be reordered as a tree, the remaining nodes
              will be reordered as compact rows.
            </li>
            <br />
            <li>
              <b>Tree validation: </b>
              Select a root node to activate the
              validation button for the tree starting at the selected root node.
            </li>
            <br />
            <li>
              <b>Node deletion: </b>
              Select a node and press the
              <i>delete</i>
              {' '}
              button or click on the node's
              {' '}
              <i>x</i>
              {' '}
              button.
            </li>
            <br />
            <li>
              <b>Node connector/hole drag: </b>
              Start dragging an edge from the
              node connector/hole, if an edge is already connected to the
              connector/hole, it will be updated, otherwise a new edge will be
              created.
            </li>
            <br />
            <li>
              <b>Edge click: </b>
              Select an edge.
            </li>
            <br />
            <li>
              <b>Edge deletion: </b>
              Select an edge and press the
              <i>delete</i>
              {' '}
              button or drag and drop the edge connector to an invalid location.
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            endIcon={<CloseRounded />}
            onClick={() => setIsInfoOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Adding node info alert */}
      <Snackbar
        // prop required to display the alert relative to editor container and not relative to viewport
        style={{ position: 'absolute' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={addingNode}
        onClose={(e, reason) => {
          if (reason !== 'clickaway') {
            addingNodeClick();
          }
        }}
      >
        <Alert severity="info" variant="standard">
          Freely position the node on the stage
        </Alert>
      </Snackbar>
      {/* Tree validation errors alert */}
      <Snackbar
        // prop required to display the alert relative to editor container and not relative to viewport
        style={{ position: 'absolute' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={isInvalidOpen}
        onClose={(e, reason) => {
          if (reason === 'clickaway') {
            setIsInvalidOpen(false);
            setCurrentErrorLocation({});
            if (selectedEdgeRef) {
              selectedEdgeRef.moveToBottom();
              setSelectedEdgeRef(null);
            }
          }
        }}
      >
        <Alert
          variant="standard"
          severity="error"
          action={(
            <>
              {validationErrors.length > 1 && (
                <>
                  <Tooltip title="Previous Error" placement="top">
                    <span>
                      <IconButton
                        size="medium"
                        color="inherit"
                        disabled={currentError === 0}
                        onClick={handlePreviousErrorClick}
                      >
                        <ArrowBackRounded />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Next Error" placement="top">
                    <span>
                      <IconButton
                        size="medium"
                        color="inherit"
                        disabled={currentError === validationErrors.length - 1}
                        onClick={handleNextErrorClick}
                      >
                        <ArrowForwardRounded />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              )}
              <Tooltip title="Close alert" placement="top">
                <IconButton
                  size="medium"
                  color="inherit"
                  onClick={() => {
                    setIsInvalidOpen(false);
                    setCurrentErrorLocation({});
                    if (selectedEdgeRef) {
                      selectedEdgeRef.moveToBottom();
                      setSelectedEdgeRef(null);
                    }
                  }}
                >
                  <ClearRounded />
                </IconButton>
              </Tooltip>
            </>
          )}
        >
          <AlertTitle>
            Invalid Tree (
            {validationErrors.length}
            {' '}
            error
            {validationErrors.length > 1 && 's'}
            )
          </AlertTitle>
          <Typography variant="body2" paragraph>
            <b>
              Error #
              {currentError + 1}
            </b>
          </Typography>

          <Typography variant="body2">
            <b>Error type: </b>
          </Typography>
          <Typography variant="body2" paragraph>
            {validationErrors[currentError]
              && validationErrors[currentError].type}
          </Typography>

          <Typography variant="body2">
            <b>Error description: </b>
          </Typography>
          <Typography variant="body2" paragraph>
            {validationErrors[currentError]
              && validationErrors[currentError].problem}
          </Typography>

          <Typography variant="body2">
            <b>Error location: </b>
          </Typography>
          <Typography variant="body2">
            {validationErrors[currentError]
              && validationErrors[currentError].location}
          </Typography>
        </Alert>
      </Snackbar>
      {/* Tree validation valid alert */}
      <Snackbar
        style={{ position: 'absolute' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={isValidOpen}
        onClose={(e, reason) => {
          if (reason === 'clickaway') {
            setIsValidOpen(false);
          }
        }}
      >
        <Alert
          variant="standard"
          severity="success"
          action={(
            <Tooltip title="Close alert" placement="top">
              <IconButton
                size="medium"
                color="inherit"
                onClick={() => setIsValidOpen(false)}
              >
                <ClearRounded />
              </IconButton>
            </Tooltip>
          )}
        >
          <AlertTitle>Valid Tree (0 errors)</AlertTitle>
          The selected tree is valid.
        </Alert>
      </Snackbar>
      {/* Side Drawer */}
      <Drawer
        className={classes.drawer}
        // props required to display the side drawer relative to editor container and not relative to viewport
        PaperProps={{ style: { position: 'relative' } }}
        BackdropProps={{ style: { position: 'relative' } }}
        ModalProps={{
          container: document.getElementById('editorContainer'),
          style: {
            position: 'absolute',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
      >
        {/* Adding node side drawer field */}
        {drawerFields.addField && !fullDisabled && (
          <div>
            <Divider />
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Create a new node:</Typography>
              <div>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => setAddAnchorEl(e.target)}
                >
                  <InfoOutlined />
                </IconButton>
                <Popover
                  className={classes.infoPopover}
                  anchorEl={addAnchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={isAddInfoOpen}
                  onClose={() => setAddAnchorEl(null)}
                >
                  <Typography
                    className={classes.infoPopoverText}
                    variant="body2"
                  >
                    Describe the node's pieces in the textfield below. Holes are
                    represented by the special
                    {' '}
                    {connectorPlaceholder}
                    {' '}
                    character
                    combination. Alternatively you can choose a template node
                    from the list below.
                  </Typography>
                </Popover>
              </div>
            </div>
            <div className={classes.drawerField}>
              <TextField
                id="addField"
                type="search"
                variant="outlined"
                fullWidth
                size="medium"
                label="Insert the node's pieces"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={
                  `ex: ${
                    connectorPlaceholder
                  }.append(${
                    connectorPlaceholder
                  })`
                }
                margin="dense"
                onChange={(e) => handleAddChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value !== '') {
                    addingNodeClick();
                  }
                }}
              />
              <div>
                <Tooltip
                  title={addingNode ? 'Clear adding' : 'Add node'}
                  placement="top"
                >
                  <span>
                    <IconButton
                      size="medium"
                      color={addingNode ? 'secondary' : 'primary'}
                      disabled={isAddEmpty}
                      onClick={() => addingNodeClick()}
                    >
                      <AddRounded />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>
            {/* Template nodes accordion */}
            {templateNodes.length > 0 && (
              <div>
                <AccordionActions
                  disableSpacing
                  classes={{ root: classes.accordionContainer }}
                >
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="body1">
                        Or select a template node:
                      </Typography>
                    </AccordionSummary>
                    <Divider />
                    <div className={classes.templateContainer}>
                      {templateNodes.map((e, i) => (
                        <AccordionDetails key={`template-${i}`}>
                          <Typography
                            id={i}
                            className={
                              selectedTemplate === i
                                ? classes.selectedTemplateElement
                                : classes.templateElement
                            }
                            variant="h6"
                            onClick={() => handleTemplateClick(e, i)}
                          >
                            {e}
                          </Typography>
                        </AccordionDetails>
                      ))}
                    </div>
                  </Accordion>
                </AccordionActions>
              </div>
            )}
          </div>
        )}
        {(drawerFields.addField || drawerFields.editField) && !fullDisabled && (
          <Divider />
        )}
        {/* Editing node side drawer field */}
        {drawerFields.editField && !fullDisabled && (
          <div>
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Edit an existing node:</Typography>
              <div>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => setEditAnchorEl(e.target)}
                >
                  <InfoOutlined />
                </IconButton>
                <Popover
                  className={classes.infoPopover}
                  anchorEl={editAnchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={isEditInfoOpen}
                  onClose={() => setEditAnchorEl(null)}
                >
                  <Typography
                    className={classes.infoPopoverText}
                    variant="body2"
                  >
                    Describe the node's pieces in the textfield below. Holes are
                    represented by the special
                    {' '}
                    {connectorPlaceholder}
                    {' '}
                    character
                    combination. Final nodes can't be modified or removed.
                  </Typography>
                </Popover>
              </div>
            </div>
            {selectedNode ? (
              <>
                {!selectedNode.isFinal && (
                  <div className={classes.drawerField}>
                    <TextField
                      key={selectedNode.id}
                      id="editField"
                      variant="outlined"
                      type="search"
                      fullWidth
                      size="medium"
                      label="Insert the node's pieces"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder={
                        `ex: ${
                          connectorPlaceholder
                        }.append(${
                          connectorPlaceholder
                        })`
                      }
                      margin="dense"
                      onChange={(e) => handleEditChange(e.target.value)}
                      onKeyPress={(e) => {
                        if (
                          e.key === 'Enter'
                          && editValue.length !== 0
                          && editValue.join('') !== selectedNode.pieces.join('')
                        ) {
                          handleNodeEdit();
                        }
                      }}
                    />
                    <div>
                      <Tooltip title="Update node pieces" placement="top">
                        <span>
                          <IconButton
                            size="medium"
                            color="primary"
                            disabled={
                              isEditEmpty
                              || editValue.join('')
                                === selectedNode.pieces.join('')
                            }
                            onClick={() => handleNodeEdit()}
                          >
                            <UpdateRounded />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                )}
                {/* Node type editing field */}
                <div className={classes.typeField}>
                  <FormLabel>Select the node type from the list:</FormLabel>
                  <RadioGroup
                    value={typeValue}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    row
                    className={classes.typeButtonContainer}
                  >
                    <Button
                      variant="text"
                      size="small"
                      color="primary"
                      disabled={typeValue === ''}
                      startIcon={<ClearRounded />}
                      onClick={() => handleTypeChange('')}
                    >
                      Clear node type
                    </Button>
                    {nodeTypes.map((nodeType) => (
                      <FormControlLabel
                        key={nodeType.type}
                        className={classes.typeButton}
                        value={nodeType.type}
                        control={<Radio color="primary" />}
                        label={nodeType.type}
                      />
                    ))}
                  </RadioGroup>
                </div>
                {typeValue
                  && nodeTypes.find((nodeType) => nodeType.type === typeValue)
                    .any && (
                    <div className={classes.drawerField}>
                      <TextField
                        key={selectedNode.id}
                        id="valueField"
                        variant="outlined"
                        type="search"
                        fullWidth
                        size="medium"
                        placeholder="ex: 1234567890"
                        margin="dense"
                        label="Insert the node's value"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => nodeValueChange({ nodeValue: e.target.value })}
                        onKeyPress={(e) => {
                          if (
                            e.key === 'Enter'
                            && nodeValue !== selectedNode.value
                          ) {
                            nodeValueEdit({
                              value: nodeValue,
                              selectedNodeId: selectedNode.id,
                              onNodeValueChange,
                            });
                          }
                        }}
                      />
                      <div>
                        <Tooltip title="Update node value" placement="top">
                          <span>
                            <IconButton
                              size="medium"
                              color="primary"
                              disabled={nodeValue === selectedNode.value}
                              onClick={() => nodeValueEdit({
                                value: nodeValue,
                                selectedNodeId: selectedNode.id,
                                onNodeValueChange,
                              })}
                            >
                              <UpdateRounded />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                )}
                {/* Node value editing field */}
                {typeValue
                  && nodeTypes.find((nodeType) => nodeType.type === typeValue)
                    .fixedValues
                  && nodeTypes.find((nodeType) => nodeType.type === typeValue)
                    .fixedValues.length > 0 && (
                    <div className={classes.typeField}>
                      <FormLabel>
                        Select the node value from the list:
                      </FormLabel>
                      <RadioGroup
                        className={classes.typeButtonContainer}
                        row
                        value={nodeValue}
                        onChange={(e) => handleValueChange(e.target.value)}
                      >
                        <Button
                          variant="text"
                          size="small"
                          color="primary"
                          disabled={
                            nodeValue === ''
                            || (nodeTypes.find(
                              (nodeType) => nodeType.type === typeValue,
                            ).fixedValues
                              && nodeTypes
                                .find((nodeType) => nodeType.type === typeValue)
                                .fixedValues.find(
                                  (fixedValue) => fixedValue === nodeValue,
                                ) === undefined)
                          }
                          startIcon={<ClearRounded />}
                          onClick={() => handleValueChange('')}
                        >
                          Clear node value
                        </Button>
                        {nodeTypes
                          .find((nodeType) => nodeType.type === typeValue)
                          .fixedValues.map((fixedValue) => (
                            <FormControlLabel
                              key={fixedValue}
                              className={classes.typeButton}
                              value={fixedValue}
                              label={fixedValue}
                              control={<Radio color="primary" />}
                            />
                          ))}
                      </RadioGroup>
                    </div>
                )}
              </>
            ) : (
              <Typography className={classes.editText}>
                Start by selecting a node.
              </Typography>
            )}
            <Divider />
          </div>
        )}
      </Drawer>
    </>
  );
}

StageDrawer.propTypes = {
  stageRef: PropTypes.object,
  layerRef: PropTypes.object,
  transformerRef: PropTypes.object,
  selectedEdgeRef: PropTypes.object,
  setSelectedEdgeRef: PropTypes.func,
  setIsSelectedRectVisible: PropTypes.func,
  setCurrentErrorLocation: PropTypes.func,
  initialState: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)),
  toolbarButtons: PropTypes.objectOf(PropTypes.bool),
  drawerFields: PropTypes.objectOf(PropTypes.bool),
  fullDisabled: PropTypes.bool,
  connectorPlaceholder: PropTypes.string,
  templateNodes: PropTypes.arrayOf(PropTypes.string),
  nodeTypes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      any: PropTypes.bool,
      fixedValues: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  reportedErrors: PropTypes.objectOf(PropTypes.objectOf(PropTypes.bool)),
  onNodePiecesChange: PropTypes.func,
  onNodeTypeChange: PropTypes.func,
  onNodeValueChange: PropTypes.func,
  onValidate: PropTypes.func,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
  yPad: PropTypes.number,
  textHeight: PropTypes.number,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      pieces: PropTypes.arrayOf(PropTypes.string),
      x: PropTypes.number,
      y: PropTypes.number,
      type: PropTypes.string,
      value: PropTypes.string,
      isFinal: PropTypes.bool,
    }),
  ),
  edges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  canUndo: PropTypes.bool,
  canRedo: PropTypes.bool,
  stageReset: PropTypes.func,
  reorderNodes: PropTypes.func,
  uploadState: PropTypes.func,
  addingNode: PropTypes.bool,
  isAddEmpty: PropTypes.bool,
  addingNodeClick: PropTypes.func,
  clearAdding: PropTypes.func,
  addValueChange: PropTypes.func,
  editValue: PropTypes.arrayOf(PropTypes.string),
  isEditEmpty: PropTypes.bool,
  editValueChange: PropTypes.func,
  editNode: PropTypes.func,
  typeValue: PropTypes.string,
  typeValueChange: PropTypes.func,
  nodeTypeEdit: PropTypes.func,
  nodeValue: PropTypes.string,
  nodeValueChange: PropTypes.func,
  nodeValueEdit: PropTypes.func,
  selectedNode: PropTypes.shape({
    pieces: PropTypes.arrayOf(PropTypes.string),
    x: PropTypes.number,
    y: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.string,
    isFinal: PropTypes.bool,
  }),
  clearNodeSelection: PropTypes.func,
  selectedRootNode: PropTypes.shape({
    pieces: PropTypes.arrayOf(PropTypes.string),
    x: PropTypes.number,
    y: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.string,
    isFinal: PropTypes.bool,
  }),
  clearEdgeSelection: PropTypes.func,
};

export default StageDrawer;
