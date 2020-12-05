import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import { makeStyles } from "@material-ui/core/styles";
import AddRoundedIcon from "@material-ui/icons/Add";
import UpdateRoundedIcon from "@material-ui/icons/UpdateRounded";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MenuRoundedIcon from "@material-ui/icons/Menu";
import GetAppRoundedIcon from "@material-ui/icons/GetApp";
import PublishRoundedIcon from "@material-ui/icons/Publish";
import UndoRoundedIcon from "@material-ui/icons/UndoRounded";
import RedoRoundedIcon from "@material-ui/icons/RedoRounded";
import NoteAddRoundedIcon from "@material-ui/icons/NoteAddRounded";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ViewModuleRoundedIcon from "@material-ui/icons/ViewModuleRounded";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import PhotoCameraRoundedIcon from "@material-ui/icons/PhotoCameraRounded";
import ZoomOutRoundedIcon from "@material-ui/icons/ZoomOutRounded";
import ZoomInRoundedIcon from "@material-ui/icons/ZoomInRounded";
import AspectRatioRoundedIcon from "@material-ui/icons/AspectRatioRounded";

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
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  computeNodeWidth,
  edgeByParentPiece,
  nodeById,
  parsePieces,
  textHeight,
  yPad,
} from "../../utils.js";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    position: "absolute",
    top: "50px",
    maxHeight: "92%",
    overflowY: "scroll",
    marginLeft: "1px",
  },
  toolbar: {
    zIndex: "1",
    position: "absolute",
    margin: "1px 0 0 1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarButton: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&:disabled": {
      backgroundColor: "#fff",
    },
  },
  drawerInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: "10px 0 0 10px",
  },
  drawerField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 0 10px 10px",
  },
  editText: {
    margin: "10px 0 10px 10px",
  },
  infoPopover: {
    marginLeft: "5px",
  },
  infoPopoverText: {
    border: "2px solid",
    borderRadius: "4px",
    borderColor: theme.palette.primary.main,
    padding: "3px 6px 3px 6px",
    maxWidth: "500px",
  },
  accordionContainer: {
    display: "block",
    padding: 0,
    margin: "0 10px 10px 10px",
  },
  templateElement: {
    color: "white",
    backgroundColor: "#208020",
    border: "solid 1px black",
    borderRadius: "5px",
    padding: "3px 10px 7px 10px",
    fontFamily: "Ubuntu Mono, Courier",
    fontSize: "22px",
    "&:hover": {
      cursor: "pointer",
    },
    marginBottom: "-10px",
  },
  selectedTemplateElement: {
    color: "white",
    backgroundColor: "#3f50b5",
    border: "solid 2px black",
    borderRadius: "5px",
    padding: "3px 10px 7px 10px",
    fontFamily: "Ubuntu Mono, Courier",
    fontSize: "22px",
    "&:hover": {
      cursor: "pointer",
    },
    marginBottom: "-10px",
    boxShadow: "3px 3px 3px black",
  },
  templateContainer: {
    maxHeight: "200px",
    overflowY: "scroll",
  },
  typeField: {
    margin: "10px 10px 10px 10px",
  },
  typeButtonContainer: {
    maxHeight: "150px",
    overflowY: "scroll",
    borderRadius: "3px",
    marginTop: "10px",
    paddingTop: "10px",
    padding: "5px 20px 5px 20px",
    boxShadow: "0 0 1px 1px #ddd",
  },
  typeButton: {
    marginRight: "30px",
  },
  infoContent: {
    maxHeight: "300px",
    overflowY: "scroll",
  },
}));

function StageDrawer({
  connectorPlaceholder,
  selectedNode,
  editNode,
  addingNode,
  addingNodeClick,
  addValueChange,
  editValueChange,
  typeValueChange,
  nodeValueChange,
  clearAdding,
  clearEdgeSelection,
  clearNodeSelection,
  isAddEmpty,
  isEditEmpty,
  editValue,
  typeValue,
  nodeTypeEdit,
  nodeValue,
  nodeValueEdit,
  stageReset,
  nodes,
  edges,
  uploadState,
  canUndo,
  canRedo,
  selectedRootNode,
  templateNodes,
  stageRef,
  transformerRef,
  setIsSelectedRectVisible,
  initialState,
  reorderNodes,
  nodeTypes,
  selectedEdgeRef,
  setSelectedEdgeRef,
  reportedErrors,
  toolbarButtons,
  drawerFields,
  fullDisabled,
  setCurrentErrorLocation,
  onNodePiecesChange,
  onNodeTypeChange,
  onNodeValueChange,
  onValidate,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

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

  const handleAddChange = value => {
    if (addingNode) {
      clearAdding();
    }
    setSelectedTemplate(null);
    const addValue = parsePieces(value, connectorPlaceholder);
    addValueChange({ addValue: addValue });
  };

  const handleEditChange = value => {
    const editValue = parsePieces(value, connectorPlaceholder);
    editValueChange({ editValue: editValue });
  };

  const handleNodeEdit = () => {
    const nodeWidth = computeNodeWidth(editValue, connectorPlaceholder);
    editNode({
      pieces: editValue,
      width: nodeWidth,
      selectedNodeId: selectedNode.id,
      onNodePiecesChange: onNodePiecesChange,
    });
  };

  const handleTypeChange = value => {
    typeValueChange({ typeValue: value });
    nodeTypeEdit({
      type: value,
      selectedNodeId: selectedNode.id,
      onNodeTypeChange: onNodeTypeChange,
      onNodeValueChange: onNodeValueChange,
    });
  };

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
    const stateData =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(currentState, null, 4));
    var downloadElement = document.createElement("a");
    downloadElement.href = stateData;
    downloadElement.download = "expression_editor_state.json";
    document.body.appendChild(downloadElement);
    downloadElement.click();
    downloadElement.remove();
  };

  const handleStateUpload = () => {
    var uploadElement = document.getElementById("stateUploadButton");
    uploadElement.click();
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    e.target.value = "";
    const fr = new FileReader();
    fr.onload = e => {
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
          document.getElementById("addField").value = "";
        }
        addValueChange({ addValue: [] });
        editValueChange({ editValue: [] });
        typeValueChange({ typeValue: "" });
        nodeValueChange({ nodeValue: "" });
        setSelectedTemplate(null);
        stageRef.current.position({ x: state.stagePos.x, y: state.stagePos.y });
        stageRef.current.scale({
          x: state.stageScale.x,
          y: state.stageScale.y,
        });
        transformerRef.current.nodes([]);
        setIsSelectedRectVisible(false);
        dispatch(ActionCreators.clearHistory());
      } catch (e) {
        alert("Invalid JSON file.");
      }
    };
    fr.readAsText(file);
  };

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

  const handleReset = () => {
    setIsResetWarnOpen(false);
    stageReset({
      initialNodes: initialState.initialNodes,
      initialEdges: initialState.initialEdges,
      connectorPlaceholder: connectorPlaceholder,
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
      document.getElementById("addField").value = "";
    }
    addValueChange({ addValue: [] });
    editValueChange({ editValue: [] });
    typeValueChange({ typeValue: "" });
    nodeValueChange({ nodeValue: "" });
    setSelectedTemplate(null);
    transformerRef.current.nodes([]);
    setIsSelectedRectVisible(false);
    dispatch(ActionCreators.clearHistory());
  };

  const handleTemplateClick = (value, id) => {
    if (addingNode) {
      clearAdding();
    }
    setSelectedTemplate(id);
    document.getElementById("addField").value = value;
    const addValue = parsePieces(value, connectorPlaceholder);
    addValueChange({ addValue: addValue });
  };

  const handleReorderClick = () => {
    stageRef.current.position({ x: 0, y: 0 });
    stageRef.current.scale({ x: 1, y: 1 });
    reorderNodes({
      connectorPlaceholder: connectorPlaceholder,
      reorderStartingX: isDrawerOpen
        ? drawerWidth + (stageRef.current.attrs.width - drawerWidth) / 2
        : stageRef.current.attrs.width / 2,
      isDrawerOpen: isDrawerOpen,
      drawerWidth: drawerWidth,
    });
  };

  const handleCenteringClick = () => {
    var nodesCenters = [];
    var averageCenterX = 0;
    var averageCenterY = 0;
    nodes.forEach(node => {
      nodesCenters.push({
        x: node.x + node.width / 2,
        y: node.y + yPad + textHeight / 2,
      });
    });
    nodesCenters.forEach(nodeCenter => {
      averageCenterX += nodeCenter.x;
      averageCenterY += nodeCenter.y;
    });
    averageCenterX /= nodesCenters.length;
    averageCenterY /= nodesCenters.length;
    stageRef.current.position({
      x: averageCenterX - stageRef.current.attrs.width / 2,
      y: averageCenterY - (stageRef.current.attrs.height - 60) / 2,
    });
    stageRef.current.draw();
  };

  function orderWalk(node, visitedNodes, visitedBranch, errors) {
    visitedNodes.push(node.id);
    visitedBranch.push(node.id);
    if (node.type === "") {
      const location = "Node ID: " + node.id;
      reportedErrors.missingNodeType &&
        errors.push({
          type: "Completeness error",
          problem: "Missing node type",
          location: location,
          currentErrorLocation: { node: true, nodeId: node.id },
        });
    }
    if (node.value === "") {
      const location = "Node ID: " + node.id;
      reportedErrors.missingNodeValue &&
        errors.push({
          type: "Completeness error",
          problem: "Missing node value",
          location: location,
          currentErrorLocation: { node: true, nodeId: node.id },
        });
    }
    var connectorNum = 0;
    node.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        connectorNum++;
        const childEdges = edgeByParentPiece(node.id, i, edges);
        if (childEdges.length > 1) {
          const location =
            "Node ID: " + node.id + ", connector number: " + connectorNum;
          reportedErrors.multiEdgeOnNodeConnector &&
            errors.push({
              type: "Structure error",
              problem: "Multiple edge on single piece connector",
              location: location,
              currentErrorLocation: {
                pieceConnector: true,
                nodeId: node.id,
                pieceId: i,
              },
            });
        } else if (childEdges.length === 0) {
          const location =
            "Node ID: " + node.id + ", connector number: " + connectorNum;
          reportedErrors.emptyPieceConnector &&
            errors.push({
              type: "Completeness error",
              problem: "Empty connector",
              location: location,
              currentErrorLocation: {
                pieceConnector: true,
                nodeId: node.id,
                pieceId: i,
              },
            });
        }
        childEdges.forEach(edge => {
          const childNode = nodeById(edge.childNodeId, nodes);
          var foundError = false;
          if (visitedNodes.find(e => e === childNode.id) !== undefined) {
            const location = "Node ID: " + childNode.id;
            reportedErrors.multiEdgeOnNodeConnector &&
              errors.find(
                error =>
                  error.problem === "Multiple edge on single node connector" &&
                  error.location === location
              ) === undefined &&
              errors.push({
                type: "Structure error",
                problem: "Multiple edge on single node connector",
                location: location,
                currentErrorLocation: {
                  nodeConnector: true,
                  nodeId: childNode.id,
                },
              });
            foundError = true;
          }
          if (visitedBranch.find(e => e === childNode.id) !== undefined) {
            const location =
              " From node ID: " +
              childNode.id +
              ", to nodeID: " +
              node.id +
              ", connector number: " +
              connectorNum;
            reportedErrors.loop &&
              errors.push({
                type: "Structure error",
                problem: "Loop detected",
                location: location,
                currentErrorLocation: { edge: true, edgeId: edge.id },
              });
            foundError = true;
          }
          if (foundError) {
            return [errors, visitedBranch];
          } else {
            [errors, visitedBranch] = orderWalk(
              childNode,
              visitedNodes,
              visitedBranch,
              errors
            );
          }
        });
      }
    });
    visitedBranch.pop();
    return [errors, visitedBranch];
  }

  const handleTreeValidation = () => {
    var visitedNodes = [];
    var visitedBranch = [];
    var errors = [];
    [errors, visitedBranch] = orderWalk(
      selectedRootNode,
      visitedNodes,
      visitedBranch,
      errors
    );
    onValidate && onValidate(nodes, edges, errors);
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
        errors[0].currentErrorLocation.node ||
        errors[0].currentErrorLocation.pieceConnector ||
        errors[0].currentErrorLocation.nodeConnector
      ) {
        const currentNode = stageRef.current
          .find(".Node")
          .toArray()
          .find(
            node => node.attrs.id === errors[0].currentErrorLocation.nodeId
          );
        currentNode.parent.moveToTop();
      } else if (errors[0].currentErrorLocation.edge) {
        const currentEdge = stageRef.current
          .find(".Edge")
          .toArray()
          .find(
            edge => edge.attrs.id === errors[0].currentErrorLocation.edgeId
          );
        currentEdge.moveToTop();
        setSelectedEdgeRef(currentEdge);
      }
      setIsInvalidOpen(true);
    } else {
      setIsValidOpen(true);
    }
  };

  const handleImageClick = () => {
    var downloadElement = document.createElement("a");
    downloadElement.href = stageRef.current.toDataURL({ pixelRatio: 2 });
    downloadElement.download = "expression_editor_image.png";
    document.body.appendChild(downloadElement);
    downloadElement.click();
    downloadElement.remove();
  };

  const handleZoomInClick = () => {
    const currentScale = stageRef.current.scale();
    stageRef.current.scale({
      x: currentScale.x * 1.2,
      y: currentScale.x * 1.2,
    });
    stageRef.current.draw();
  };

  const handleZoomOutClick = () => {
    const currentScale = stageRef.current.scale();
    stageRef.current.scale({
      x: currentScale.x * 0.8,
      y: currentScale.x * 0.8,
    });
    stageRef.current.draw();
  };

  const handlePreviousErrorClick = () => {
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
    }
    setCurrentError(currentError - 1);
    const currentErrorLocation =
      validationErrors[currentError - 1].currentErrorLocation;
    setCurrentErrorLocation(currentErrorLocation);
    if (
      currentErrorLocation.node ||
      currentErrorLocation.pieceConnector ||
      currentErrorLocation.nodeConnector
    ) {
      const currentNode = stageRef.current
        .find(".Node")
        .toArray()
        .find(node => node.attrs.id === currentErrorLocation.nodeId);
      currentNode.parent.moveToTop();
    } else if (currentErrorLocation.edge) {
      const currentEdge = stageRef.current
        .find(".Edge")
        .toArray()
        .find(edge => edge.attrs.id === currentErrorLocation.edgeId);
      currentEdge.moveToTop();
      setSelectedEdgeRef(currentEdge);
    }
  };

  const handleNextErrorClick = () => {
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
    }
    setCurrentError(currentError + 1);
    const currentErrorLocation =
      validationErrors[currentError + 1].currentErrorLocation;
    setCurrentErrorLocation(currentErrorLocation);
    if (
      currentErrorLocation.node ||
      currentErrorLocation.pieceConnector ||
      currentErrorLocation.nodeConnector
    ) {
      const currentNode = stageRef.current
        .find(".Node")
        .toArray()
        .find(node => node.attrs.id === currentErrorLocation.nodeId);
      currentNode.parent.moveToTop();
    } else if (currentErrorLocation.edge) {
      const currentEdge = stageRef.current
        .find(".Edge")
        .toArray()
        .find(edge => edge.attrs.id === currentErrorLocation.edgeId);
      currentEdge.moveToTop();
      setSelectedEdgeRef(currentEdge);
    }
  };

  return (
    <>
      <div className={classes.toolbar}>
        {toolbarButtons.drawerButton && !fullDisabled && (
          <Tooltip
            title={isDrawerOpen ? "Close drawer" : "Open drawer"}
            placement="bottom"
          >
            <IconButton
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              color="primary"
              className={classes.toolbarButton}
            >
              {isDrawerOpen ? <ChevronLeftRoundedIcon /> : <MenuRoundedIcon />}
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.info && !fullDisabled && (
          <Tooltip title="Editor info" placement="bottom">
            <IconButton
              onClick={() => setIsInfoOpen(true)}
              color="primary"
              className={classes.toolbarButton}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.reset && !fullDisabled && (
          <Tooltip title={"Reset state"} placement="bottom">
            <IconButton
              onClick={() => setIsResetWarnOpen(true)}
              color="primary"
              className={classes.toolbarButton}
            >
              <NoteAddRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.undo && !fullDisabled && (
          <Tooltip title={"Undo action"} placement="bottom">
            <span>
              <IconButton
                onClick={handleUndo}
                color="primary"
                disabled={!canUndo}
                className={classes.toolbarButton}
              >
                <UndoRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {toolbarButtons.redo && !fullDisabled && (
          <Tooltip title={"Redo action"} placement="bottom">
            <span>
              <IconButton
                onClick={handleRedo}
                color="primary"
                disabled={!canRedo}
                className={classes.toolbarButton}
              >
                <RedoRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {toolbarButtons.reorder && !fullDisabled && (
          <Tooltip title="Reorder nodes" placement="bottom">
            <IconButton
              onClick={handleReorderClick}
              color="primary"
              className={classes.toolbarButton}
            >
              <ViewModuleRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.validate && !fullDisabled && (
          <Tooltip title="Validate tree" placement="bottom">
            <span>
              <IconButton
                onClick={handleTreeValidation}
                color="primary"
                className={classes.toolbarButton}
                disabled={!selectedRootNode}
              >
                <CheckRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {toolbarButtons.download && !fullDisabled && (
          <Tooltip title={"Download state"} placement="bottom">
            <IconButton
              onClick={handleStateDownload}
              color="primary"
              className={classes.toolbarButton}
            >
              <GetAppRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.upload && !fullDisabled && (
          <Tooltip title={"Upload state"} placement="bottom">
            <IconButton
              onClick={handleStateUpload}
              color="primary"
              className={classes.toolbarButton}
            >
              <PublishRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
        <input
          id={"stateUploadButton"}
          style={{ display: "none" }}
          type="file"
          accept=".json"
          onChange={e => handleFileChange(e)}
        />
        {toolbarButtons.screenshot && !fullDisabled && (
          <Tooltip title="Save state image" placement="bottom">
            <IconButton
              onClick={handleImageClick}
              color="primary"
              className={classes.toolbarButton}
            >
              <PhotoCameraRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.zoomIn && !fullDisabled && (
          <Tooltip title="Zoom-in" placement="bottom">
            <IconButton
              onClick={handleZoomInClick}
              color="primary"
              className={classes.toolbarButton}
            >
              <ZoomInRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.zoomOut && !fullDisabled && (
          <Tooltip title="Zoom-out" placement="bottom">
            <IconButton
              onClick={handleZoomOutClick}
              color="primary"
              className={classes.toolbarButton}
            >
              <ZoomOutRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
        {toolbarButtons.info && !fullDisabled && (
          <Tooltip title="Center and fit nodes" placement="bottom">
            <IconButton
              onClick={handleCenteringClick}
              color="primary"
              className={classes.toolbarButton}
            >
              <AspectRatioRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Dialog
        open={isResetWarnOpen}
        onClose={() => setIsResetWarnOpen(false)}
        onKeyPress={e => {
          if (e.key === "Enter") {
            handleReset();
          }
        }}
        style={{ position: "absolute" }}
        BackdropProps={{ style: { position: "absolute" } }}
        container={document.getElementById("editorContainer")}
        PaperProps={{
          style: { border: "2px solid #3f50b5", borderRadius: "5px" },
        }}
      >
        <DialogTitle>
          {"Are you sure you want to reset the editor state?"}
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
            onClick={() => setIsResetWarnOpen(false)}
            variant="contained"
            color="primary"
            endIcon={<CloseRoundedIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReset}
            variant="contained"
            color="primary"
            endIcon={<CheckRoundedIcon />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onKeyPress={e => {
          if (e.key === "Enter") {
            setIsInfoOpen(false);
          }
        }}
        style={{ position: "absolute" }}
        BackdropProps={{ style: { position: "absolute" } }}
        container={document.getElementById("editorContainer")}
        PaperProps={{
          style: { border: "2px solid #3f50b5", borderRadius: "5px" },
        }}
      >
        <DialogTitle>{"Expression Tree Editor Usage Infos"}</DialogTitle>
        <DialogContent dividers className={classes.infoContent}>
          <ul>
            <li>
              <b>Stage scroll: </b>Zoom in/out the editor stage.
            </li>
            <br />
            <li>
              <b>Stage drag: </b>Move the editor stage.
            </li>
            <br />
            <li>
              <b>Shift/Command + stage drag: </b>Drag a selection rectangle to
              create a multiple nodes draggable selection.
            </li>
            <br />
            <li>
              <b>Node click: </b>Select a node.
            </li>
            <br />
            <li>
              <b>Node drag: </b>Move a node.
            </li>
            <br />
            <li>
              <b>Node double click: </b>Select/Deselect a root node to
              activate/deactivate the tree validation button.
            </li>
            <br />
            <li>
              <b>Nodes reordering: </b>If a root node is selected, all its
              children nodes will be reordered as a tree, the remaining nodes
              will be reordered as compact rows.
            </li>
            <br />
            <li>
              <b>Node deletion: </b>Select a node and press the <i>delete</i>{" "}
              button or click on the node's <i>x</i> button.
            </li>
            <br />
            <li>
              <b>Node connector/hole drag: </b>Start dragging an edge from the
              node connector/hole, if an edge is already connected to the
              connector/hole, it will be updated, otherwise a new edge will be
              created.
            </li>
            <br />
            <li>
              <b>Edge click: </b>Select an edge.
            </li>
            <br />
            <li>
              <b>Edge deletion: </b>Select an edge and press the <i>delete</i>
              button or drag and drop the node to an invalid location.
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsInfoOpen(false)}
            variant="contained"
            color="primary"
            endIcon={<CloseRoundedIcon />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        style={{ position: "absolute" }}
        open={addingNode}
        onClose={(e, reason) => {
          if (reason !== "clickaway") {
            addingNodeClick();
          }
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert severity="info" variant="standard">
          Freely position the node on the stage
        </Alert>
      </Snackbar>
      <Snackbar
        style={{ position: "absolute" }}
        open={isInvalidOpen}
        onClose={(e, reason) => {
          if (reason === "clickaway") {
            setIsInvalidOpen(false);
            setCurrentErrorLocation({});
            if (selectedEdgeRef) {
              selectedEdgeRef.moveToBottom();
              setSelectedEdgeRef(null);
            }
          }
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert
          severity="error"
          variant="standard"
          action={
            <>
              {validationErrors.length > 1 && (
                <>
                  <Tooltip title={"Previous Error"} placement="top">
                    <span>
                      <IconButton
                        size="medium"
                        color="inherit"
                        onClick={handlePreviousErrorClick}
                        disabled={currentError === 0}
                      >
                        <ArrowBackRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={"Next Error"} placement="top">
                    <span>
                      <IconButton
                        size="medium"
                        color="inherit"
                        onClick={handleNextErrorClick}
                        disabled={currentError === validationErrors.length - 1}
                      >
                        <ArrowForwardRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              )}
              <Tooltip title={"Close alert"} placement="top">
                <IconButton
                  onClick={() => {
                    setIsInvalidOpen(false);
                    setCurrentErrorLocation({});
                    if (selectedEdgeRef) {
                      selectedEdgeRef.moveToBottom();
                      setSelectedEdgeRef(null);
                    }
                  }}
                  size="medium"
                  color="inherit"
                >
                  <ClearRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          }
        >
          <AlertTitle>
            Invalid Tree ({validationErrors.length} error
            {validationErrors.length > 1 && "s"})
          </AlertTitle>
          <Typography variant="body2" paragraph>
            <b>Error #{currentError + 1}</b>
          </Typography>

          <Typography variant="body2">
            <b>Error type: </b>
          </Typography>
          <Typography variant="body2" paragraph>
            {validationErrors[currentError] &&
              validationErrors[currentError].type}
          </Typography>

          <Typography variant="body2">
            <b>Error description: </b>
          </Typography>
          <Typography variant="body2" paragraph>
            {validationErrors[currentError] &&
              validationErrors[currentError].problem}
          </Typography>

          <Typography variant="body2">
            <b>Error location: </b>
          </Typography>
          <Typography variant="body2">
            {validationErrors[currentError] &&
              validationErrors[currentError].location}
          </Typography>
        </Alert>
      </Snackbar>
      <Snackbar
        style={{ position: "absolute" }}
        open={isValidOpen}
        onClose={(e, reason) => {
          if (reason === "clickaway") {
            setIsValidOpen(false);
          }
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert
          severity="success"
          variant="standard"
          action={
            <Tooltip title={"Close alert"} placement="top">
              <IconButton
                onClick={() => setIsValidOpen(false)}
                size="medium"
                color="inherit"
              >
                <ClearRoundedIcon />
              </IconButton>
            </Tooltip>
          }
        >
          <AlertTitle>Valid Tree (0 errors)</AlertTitle>
          The selected tree is valid.
        </Alert>
      </Snackbar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        PaperProps={{ style: { position: "relative" } }}
        BackdropProps={{ style: { position: "relative" } }}
        ModalProps={{
          container: document.getElementById("editorContainer"),
          style: {
            position: "absolute",
          },
        }}
      >
        {drawerFields.addField && !fullDisabled && (
          <div>
            <Divider />
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Create a new node:</Typography>
              <div>
                <IconButton
                  size="small"
                  onClick={e => setAddAnchorEl(e.target)}
                  color="primary"
                >
                  <InfoOutlinedIcon />
                </IconButton>
                <Popover
                  className={classes.infoPopover}
                  open={isAddInfoOpen}
                  anchorEl={addAnchorEl}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  onClose={() => setAddAnchorEl(null)}
                >
                  <Typography
                    className={classes.infoPopoverText}
                    variant="body2"
                  >
                    Describe the node's pieces in the textfield below. Holes are
                    represented by the special {connectorPlaceholder} character
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
                  "ex: " +
                  connectorPlaceholder +
                  ".append(" +
                  connectorPlaceholder +
                  ")"
                }
                margin="dense"
                onChange={e => handleAddChange(e.target.value)}
                onKeyPress={e => {
                  if (e.key === "Enter" && e.target.value !== "") {
                    addingNodeClick();
                  }
                }}
              ></TextField>
              <div>
                <Tooltip
                  title={addingNode ? "Clear adding" : "Add node"}
                  placement="top"
                >
                  <span>
                    <IconButton
                      size="medium"
                      onClick={() => addingNodeClick()}
                      disabled={isAddEmpty}
                      color={addingNode ? "secondary" : "primary"}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>
            {templateNodes && templateNodes.length > 0 && (
              <div>
                <AccordionActions
                  disableSpacing
                  classes={{ root: classes.accordionContainer }}
                >
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body1">
                        Or select a template node:
                      </Typography>
                    </AccordionSummary>
                    <Divider />
                    <div className={classes.templateContainer}>
                      {templateNodes.map((e, i) => (
                        <AccordionDetails key={"template-" + i}>
                          <Typography
                            variant="h6"
                            id={i}
                            className={
                              selectedTemplate === i
                                ? classes.selectedTemplateElement
                                : classes.templateElement
                            }
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
        {drawerFields.editField && !fullDisabled && (
          <div>
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Edit an existing node:</Typography>
              <div>
                <IconButton
                  size="small"
                  onClick={e => setEditAnchorEl(e.target)}
                  color="primary"
                >
                  <InfoOutlinedIcon />
                </IconButton>
                <Popover
                  className={classes.infoPopover}
                  open={isEditInfoOpen}
                  anchorEl={editAnchorEl}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  onClose={() => setEditAnchorEl(null)}
                >
                  <Typography
                    className={classes.infoPopoverText}
                    variant="body2"
                  >
                    Describe the node's pieces in the textfield below. Holes are
                    represented by the special {connectorPlaceholder} character
                    combination. Final nodes can't be modified or removed.
                    Select the node's out-coming type from the list below and
                    insert the node's out-coming value in the last textfield.
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
                        "ex: " +
                        connectorPlaceholder +
                        ".append(" +
                        connectorPlaceholder +
                        ")"
                      }
                      margin="dense"
                      onChange={e => handleEditChange(e.target.value)}
                      onKeyPress={e => {
                        if (
                          e.key === "Enter" &&
                          editValue.length !== 0 &&
                          editValue.join("") !== selectedNode.pieces.join("")
                        ) {
                          handleNodeEdit();
                        }
                      }}
                    ></TextField>
                    <div>
                      <Tooltip title={"Update node pieces"} placement="top">
                        <span>
                          <IconButton
                            size="medium"
                            onClick={() => handleNodeEdit()}
                            disabled={
                              isEditEmpty ||
                              editValue.join("") ===
                                selectedNode.pieces.join("")
                            }
                            color="primary"
                          >
                            <UpdateRoundedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                )}
                <div className={classes.typeField}>
                  <FormLabel>Select the node type from the list:</FormLabel>
                  <RadioGroup
                    value={typeValue}
                    onChange={e => handleTypeChange(e.target.value)}
                    row
                    className={classes.typeButtonContainer}
                  >
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleTypeChange("")}
                      disabled={typeValue === ""}
                      color="primary"
                      startIcon={<ClearRoundedIcon />}
                    >
                      Clear node type
                    </Button>
                    {nodeTypes.map(type => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio color="primary" />}
                        label={type}
                        className={classes.typeButton}
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div className={classes.drawerField}>
                  <TextField
                    key={selectedNode.id}
                    id="valueField"
                    variant="outlined"
                    type="search"
                    fullWidth
                    size="medium"
                    placeholder={"ex: 1234567890"}
                    margin="dense"
                    label="Insert the node's value"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e =>
                      nodeValueChange({ nodeValue: e.target.value })
                    }
                    onKeyPress={e => {
                      if (
                        e.key === "Enter" &&
                        nodeValue !== selectedNode.value
                      ) {
                        nodeValueEdit({
                          value: nodeValue,
                          selectedNodeId: selectedNode.id,
                          onNodeValueChange: onNodeValueChange,
                        });
                      }
                    }}
                  ></TextField>
                  <div>
                    <Tooltip title={"Update node value"} placement="top">
                      <span>
                        <IconButton
                          size="medium"
                          onClick={() =>
                            nodeValueEdit({
                              value: nodeValue,
                              selectedNodeId: selectedNode.id,
                              onNodeValueChange: onNodeValueChange,
                            })
                          }
                          disabled={nodeValue === selectedNode.value}
                          color="primary"
                        >
                          <UpdateRoundedIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </div>
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

export default StageDrawer;
