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
import { computeNodeWidth, edgeByParentPiece, nodeById } from "../../utils.js";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    position: "absolute",
    maxHeight: "99.5%",
    overflowY: "scroll",
    margin: "1px 0 0 1px",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: "10px 0 0 10px",
  },
  toolbarField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "10px",
    marginBottom: "10px",
  },
  editText: {
    margin: "10px 10px 10px 10px",
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
  toolbarTitle: {
    margin: "10px 0 0 10px",
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
  openDrawerButton: {
    position: "absolute",
    top: "5px",
    left: "5px",
    zIndex: "1",
    backgroundColor: "#f9f9f9",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
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
  initialState,
  reorderNodes,
  nodeTypes,
  selectedEdgeRef,
  setSelectedEdgeRef,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [addAnchorEl, setAddAnchorEl] = useState(null);
  const isAddInfoOpen = !!addAnchorEl;
  const [editAnchorEl, setEditAnchorEl] = useState(null);
  const isEditInfoOpen = !!editAnchorEl;
  const [validationAnchorEl, setValidationAnchorEl] = useState(null);
  const isValidationInfoOpen = !!validationAnchorEl;
  const [orderAnchorEl, setOrderAnchorEl] = useState(null);
  const isOrderInfoOpen = !!orderAnchorEl;
  const [isResetWarnOpen, setIsResetWarnOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState(null);
  const [currentError, setCurrentError] = useState(0);
  const [isValidOpen, setIsValidOpen] = useState(false);
  const [isInvalidOpen, setIsInvalidOpen] = useState(false);

  const handleAddChange = value => {
    clearAdding();
    setSelectedTemplate(null);
    const values = value.split(connectorPlaceholder);
    var addValue = [];
    values.length < 2
      ? (addValue = values)
      : values.forEach((e, i) => {
          if (i === values.length - 1) {
            addValue.push(values[i]);
          } else {
            addValue.push(values[i]);
            addValue.push(connectorPlaceholder);
          }
        });
    addValue = addValue.filter(e => e !== "");
    addValueChange({ addValue: addValue });
  };

  const handleEditChange = value => {
    const values = value.split(connectorPlaceholder);
    var editValue = [];
    values.length < 2
      ? (editValue = values)
      : values.forEach((e, i) => {
          if (i === values.length - 1) {
            editValue.push(values[i]);
          } else {
            editValue.push(values[i]);
            editValue.push(connectorPlaceholder);
          }
        });
    editValue = editValue.filter(e => e !== "");
    editValueChange({ editValue: editValue });
  };

  const handleNodeEdit = () => {
    const nodeWidth = computeNodeWidth(editValue, connectorPlaceholder);
    editNode({
      pieces: editValue,
      width: nodeWidth,
      selectedNodeId: selectedNode.id,
    });
  };

  const handleTypeChange = value => {
    typeValueChange({ typeValue: value });
    nodeTypeEdit({
      type: value,
      selectedNodeId: selectedNode.id,
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
    downloadElement.setAttribute("href", stateData);
    downloadElement.setAttribute("download", "expression_editor_state.json");
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
        stageRef.current.position({ x: state.stagePos.x, y: state.stagePos.y });
        stageRef.current.scale({
          x: state.stageScale.x,
          y: state.stageScale.y,
        });
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
  };

  const handleRedo = () => {
    dispatch(ActionCreators.redo());
    if (selectedEdgeRef) {
      selectedEdgeRef.moveToBottom();
      setSelectedEdgeRef(null);
    }
    clearNodeSelection();
    clearEdgeSelection();
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
    clearAdding();
    document.getElementById("addField").value = "";
    addValueChange({ addValue: [] });
    editValueChange({ editValue: [] });
    typeValueChange({ typeValue: "" });
    nodeValueChange({ nodeValue: "" });
    setSelectedTemplate(null);
    dispatch(ActionCreators.clearHistory());
  };

  const handleTemplateClick = (value, id) => {
    clearAdding();
    setSelectedTemplate(id);
    document.getElementById("addField").value = value;
    const values = value.split(connectorPlaceholder);
    var addValue = [];
    values.length < 2
      ? (addValue = values)
      : values.forEach((e, i) => {
          if (i === values.length - 1) {
            addValue.push(values[i]);
          } else {
            addValue.push(values[i]);
            addValue.push(connectorPlaceholder);
          }
        });
    addValue = addValue.filter(e => e !== "");
    addValueChange({ addValue: addValue });
  };

  const handleReorderClick = () => {
    stageRef.current.position({ x: 0, y: 0 });
    stageRef.current.scale({ x: 1, y: 1 });
    reorderNodes({
      connectorPlaceholder: connectorPlaceholder,
      reorderStartingX:
        drawerWidth + (stageRef.current.attrs.width - drawerWidth) / 2,
    });
  };

  function orderWalk(node, visitedNodes, visitedBranch, errors) {
    visitedNodes.push(node.id);
    visitedBranch.push(node.id);
    if (node.type === "") {
      const location = "Node ID: " + node.id;
      errors.push({
        type: "Completeness error",
        problem: "Missing node type",
        location: location,
      });
    }
    if (node.value === "") {
      const location = "Node ID: " + node.id;
      errors.push({
        type: "Completeness error",
        problem: "Missing node value",
        location: location,
      });
    }
    var connectorNum = 0;
    node.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        connectorNum++;
        const childEdges = edgeByParentPiece(node.id, i, edges);
        if (childEdges.length === 1) {
          const childNode = nodeById(childEdges[0].childNodeId, nodes);
          if (visitedBranch.find(e => e === childNode.id) !== undefined) {
            const location =
              " From node: " +
              childNode.id +
              ", to node: " +
              node.id +
              ", connector: " +
              connectorNum;
            errors.push({
              type: "Structure error",
              problem: "Loop detected",
              location: location,
            });
            visitedBranch.pop();
            return [errors, visitedBranch];
          } else if (visitedNodes.find(e => e === childNode.id) !== undefined) {
            const location =
              " From node " +
              childNode.id +
              ", to node " +
              node.id +
              ", connector: " +
              connectorNum;
            errors.push({
              type: "Structure error",
              problem: "Multiple edge on single node connector",
              location: location,
            });
            visitedBranch.pop();
            return [errors, visitedBranch];
          } else {
            [errors, visitedBranch] = orderWalk(
              childNode,
              visitedNodes,
              visitedBranch,
              errors
            );
          }
        } else if (childEdges.length > 1) {
          const location = "Node: " + node.id + ", connector: " + connectorNum;
          errors.push({
            type: "Structure error",
            problem: "Multiple edge on single piece connector",
            location: location,
          });
        } else if (childEdges.length === 0) {
          const location = "Node: " + node.id + ", connector: " + connectorNum;
          errors.push({
            type: "Completeness error",
            problem: "Empty connector",
            location: location,
          });
        }
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
    if (errors.length > 0) {
      setValidationErrors(errors);
      setCurrentError(0);
      setIsInvalidOpen(true);
    } else {
      setIsValidOpen(true);
    }
  };

  return (
    <>
      <Tooltip title={"Open toolbar"} placement="right">
        <IconButton
          onClick={() => setIsDrawerOpen(true)}
          color="primary"
          style={{
            visibility: isDrawerOpen ? "hidden" : "visible",
          }}
          classes={{ root: classes.openDrawerButton }}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        style={{ position: "absolute" }}
        open={isResetWarnOpen}
        onClose={() => setIsResetWarnOpen(false)}
        onKeyPress={e => {
          if (e.key === "Enter") {
            handleReset();
          }
        }}
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
            color="primary"
            endIcon={<CloseRoundedIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReset}
            color="primary"
            endIcon={<CheckRoundedIcon />}
          >
            Confirm
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
          }
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert
          severity="error"
          variant="standard"
          action={
            <>
              {validationErrors && validationErrors.length > 1 ? (
                <>
                  <Tooltip title={"Previous Error"} placement="top">
                    <span>
                      <IconButton
                        size="medium"
                        color="inherit"
                        onClick={() => setCurrentError(currentError - 1)}
                        disabled={validationErrors && currentError === 0}
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
                        onClick={() => setCurrentError(currentError + 1)}
                        disabled={
                          validationErrors &&
                          currentError === validationErrors.length - 1
                        }
                      >
                        <ArrowForwardRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              ) : (
                <></>
              )}
              <Tooltip title={"Close alert"} placement="top">
                <IconButton
                  onClick={() => setIsInvalidOpen(false)}
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
            Invalid Tree ({validationErrors ? validationErrors.length : ""}{" "}
            error
            {validationErrors ? (validationErrors.length > 1 ? "s" : "") : ""})
          </AlertTitle>
          <Typography variant="body2" paragraph>
            <b>Error #{currentError + 1}</b>
          </Typography>

          <Typography variant="body2">
            <b>Error type: </b>
          </Typography>
          <Typography variant="body2" paragraph>
            {validationErrors && validationErrors[currentError].type}
          </Typography>

          <Typography variant="body2">
            <b>Error description: </b>
          </Typography>
          <Typography variant="body2" paragraph>
            {validationErrors && validationErrors[currentError].problem}
          </Typography>

          <Typography variant="body2">
            <b>Error location: </b>
          </Typography>
          <Typography variant="body2">
            {validationErrors && validationErrors[currentError].location}
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
        <Divider />
        <div className={classes.drawerHeader}>
          <Tooltip title={"Undo action"} placement="bottom">
            <span>
              <IconButton
                onClick={handleUndo}
                color="primary"
                disabled={!canUndo}
              >
                <UndoRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={"Redo action"} placement="bottom">
            <span>
              <IconButton
                onClick={handleRedo}
                color="primary"
                disabled={!canRedo}
              >
                <RedoRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={"Reset state"} placement="bottom">
            <IconButton
              onClick={() => setIsResetWarnOpen(true)}
              color="primary"
            >
              <NoteAddRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"Download state"} placement="bottom">
            <IconButton onClick={handleStateDownload} color="primary">
              <GetAppRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"Upload state"} placement="bottom">
            <IconButton onClick={handleStateUpload} color="primary">
              <PublishRoundedIcon />
            </IconButton>
          </Tooltip>
          <input
            id={"stateUploadButton"}
            style={{ display: "none" }}
            type="file"
            accept=".json"
            onChange={e => handleFileChange(e)}
          />
          <Tooltip title={"Close toolbar"} placement="right">
            <IconButton onClick={() => setIsDrawerOpen(false)} color="primary">
              <ChevronLeftRoundedIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Divider />
        <div className={classes.toolbarInfo}>
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
              <Typography className={classes.infoPopoverText} variant="body2">
                Describe the node's pieces in the textfield below. Holes are
                represented by the special {connectorPlaceholder} character
                combination. Alternatively you can choose a template node from
                the list below.
              </Typography>
            </Popover>
          </div>
        </div>
        <div className={classes.toolbarField}>
          <TextField
            id="addField"
            type="search"
            variant="outlined"
            fullWidth
            size="medium"
            label="Insert the node's pieces"
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
        {templateNodes.length > 0 ? (
          <div>
            <AccordionActions disableSpacing style={{ marginTop: "-10px" }}>
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
        ) : (
          <></>
        )}
        <Divider />
        <div className={classes.toolbarInfo}>
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
              <Typography className={classes.infoPopoverText} variant="body2">
                Describe the node's pieces in the textfield below. Holes are
                represented by the special {connectorPlaceholder} character
                combination. Final nodes can't be modified or removed. Select
                the node's out-coming type from the list below and insert the
                node's out-coming value in the last textfield.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedNode ? (
          <>
            {!selectedNode.isFinal ? (
              <div className={classes.toolbarField}>
                <TextField
                  key={selectedNode.id}
                  id="editField"
                  variant="outlined"
                  type="search"
                  fullWidth
                  size="medium"
                  autoFocus
                  label="Insert the node's pieces"
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
                  <Tooltip title={"Update node"} placement="top">
                    <span>
                      <IconButton
                        size="medium"
                        onClick={() => handleNodeEdit()}
                        disabled={
                          isEditEmpty ||
                          editValue.join("") === selectedNode.pieces.join("")
                        }
                        color="primary"
                      >
                        <UpdateRoundedIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <></>
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
            <div className={classes.toolbarField}>
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
                onChange={e => nodeValueChange({ nodeValue: e.target.value })}
                onKeyPress={e => {
                  if (e.key === "Enter" && nodeValue !== selectedNode.value) {
                    nodeValueEdit({
                      value: nodeValue,
                      selectedNodeId: selectedNode.id,
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
        <div className={classes.toolbarInfo}>
          <Typography variant="h6">Reorder nodes:</Typography>
          <div>
            <IconButton
              size="small"
              onClick={e => setOrderAnchorEl(e.target)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              className={classes.infoPopover}
              open={isOrderInfoOpen}
              anchorEl={orderAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={() => setOrderAnchorEl(null)}
            >
              <Typography className={classes.infoPopoverText} variant="body2">
                Reorder the nodes on stage. If a root node is selected, the
                nodes connected to it will be ordered as a tree, otherwise they
                will be ordered in rows.
              </Typography>
            </Popover>
          </div>
        </div>
        <div className={classes.toolbarField}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            endIcon={<ViewModuleRoundedIcon />}
            onClick={handleReorderClick}
          >
            Reorder nodes
          </Button>
        </div>
        <Divider />
        <div className={classes.toolbarInfo}>
          <Typography variant="h6">Validate a tree:</Typography>
          <div>
            <IconButton
              size="small"
              onClick={e => setValidationAnchorEl(e.target)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              className={classes.infoPopover}
              open={isValidationInfoOpen}
              anchorEl={validationAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={() => setValidationAnchorEl(null)}
            >
              <Typography className={classes.infoPopoverText} variant="body2">
                Validate a tree starting from a root node. Double click a node
                to select it as root node.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedRootNode ? (
          <div className={classes.toolbarField}>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              endIcon={<CheckRoundedIcon />}
              onClick={handleTreeValidation}
            >
              Validate tree
            </Button>
          </div>
        ) : (
          <Typography className={classes.editText}>
            Start by selecting a node as root.
          </Typography>
        )}
        <Divider />
      </Drawer>
    </>
  );
}

export default StageDrawer;
