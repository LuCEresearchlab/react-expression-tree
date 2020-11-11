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
} from "@material-ui/core";
import { computeNodeWidth } from "../../utils.js";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    position: "absolute",
    maxHeight: "100%",
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
  clearAdding,
  clearEdgeSelection,
  clearNodeSelection,
  isAddEmpty,
  isEditEmpty,
  editValue,
  typeValue,
  selectedEdge,
  edgeTypeEdit,
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
  edgeTypes,
  selectedEdgeRef,
  setSelectedEdgeRef,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [nodeAnchorEl, setNodeAnchorEl] = useState(null);
  const isNodeInfoOpen = !!nodeAnchorEl;
  const [edgeAnchorEl, setEdgeAnchorEl] = useState(null);
  const isEdgeInfoOpen = !!edgeAnchorEl;
  const [validationAnchorEl, setValidationAnchorEl] = useState(null);
  const isValidationInfoOpen = !!validationAnchorEl;
  const [orderAnchorEl, setOrderAnchorEl] = useState(null);
  const isOrderInfoOpen = !!orderAnchorEl;
  const [isResetWarnOpen, setIsResetWarnOpen] = useState(false);

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
    editValueChange({ editValue: [] });
  };

  const handleTypeChange = value => {
    typeValueChange({ typeValue: value });
    edgeTypeEdit({
      type: value,
      selectedEdgeId: selectedEdge.id,
    });
  };

  const handleStateDownload = () => {
    if (selectedNode !== null) {
      clearNodeSelection();
    } else if (selectedEdgeRef !== null) {
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

  const handleReset = () => {
    setIsResetWarnOpen(false);
    stageReset({
      initialNodes: initialState.initialNodes,
      initialEdges: initialState.initialEdges,
    });
    if (selectedEdgeRef !== null) {
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
    reorderNodes({ connectorPlaceholder: connectorPlaceholder });
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
      <Dialog open={isResetWarnOpen} onClose={() => setIsResetWarnOpen(false)}>
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
        <div className={classes.drawerHeader}>
          <Tooltip title={"Undo action"} placement="bottom">
            <span>
              <IconButton
                onClick={() => dispatch(ActionCreators.undo())}
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
                onClick={() => dispatch(ActionCreators.redo())}
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
              onClick={e => setNodeAnchorEl(e.target)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              className={classes.infoPopover}
              open={isNodeInfoOpen}
              anchorEl={nodeAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={() => setNodeAnchorEl(null)}
            >
              <Typography className={classes.infoPopoverText} variant="body2">
                Describe the node's pieces in the textfield below. Holes are
                represented by the special {connectorPlaceholder} character
                combination.
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
        <Divider />
        <div className={classes.toolbarInfo}>
          <Typography variant="h6">Edit an existing node:</Typography>
          <div>
            <IconButton
              size="small"
              onClick={e => setNodeAnchorEl(e.target)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              className={classes.infoPopover}
              open={isNodeInfoOpen}
              anchorEl={nodeAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={() => setNodeAnchorEl(null)}
            >
              <Typography className={classes.infoPopoverText} variant="body2">
                Describe the node's pieces in the textfield below. Holes are
                represented by the special {connectorPlaceholder} character
                combination.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedNode ? (
          <div className={classes.toolbarField}>
            <TextField
              key={selectedNode.id}
              id="editField"
              variant="outlined"
              type="search"
              fullWidth
              size="medium"
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
                if (e.key === "Enter" && editValue.length !== 0) {
                  console.log(editValue);
                  console.log("enter");
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
                    disabled={isEditEmpty}
                    color="primary"
                  >
                    <UpdateRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          </div>
        ) : (
          <Typography className={classes.editText}>
            Start by selecting a node.
          </Typography>
        )}
        <Divider />
        <div className={classes.toolbarInfo}>
          <Typography variant="h6">Add or edit an edge type:</Typography>
          <div>
            <IconButton
              size="small"
              onClick={e => setEdgeAnchorEl(e.target)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              className={classes.infoPopover}
              open={isEdgeInfoOpen}
              anchorEl={edgeAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={() => setEdgeAnchorEl(null)}
            >
              <Typography className={classes.infoPopoverText} variant="body2">
                Select the edge type from the list below.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedEdge ? (
          <div className={classes.typeField}>
            <FormLabel component="legend">
              Select a type from the list:
            </FormLabel>
            <RadioGroup
              value={typeValue}
              onChange={e => handleTypeChange(e.target.value)}
              row
              className={classes.typeButtonContainer}
            >
              {edgeTypes.map(type => (
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
        ) : (
          <Typography className={classes.editText}>
            Start by selecting an edge.
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
                nodes connected to it will be ordered as a tree.
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
              onClick={() => {}}
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
