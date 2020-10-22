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
import {
  Drawer,
  IconButton,
  Popover,
  Typography,
  TextField,
  Divider,
  Button,
} from "@material-ui/core";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
}));

function StageDrawer({
  connectorPlaceholder,
  selectedNode,
  editNode,
  addingNode,
  addingNodeClick,
  addValueChange,
  addValue,
  clearAdding,
  selectedEdge,
  edgeTypeEdit,
  stageReset,
  nodes,
  edges,
  uploadState,
  canUndo,
  canRedo,
  selectedRootNode,
}) {
  const classes = useStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [nodeAnchorEl, setNodeAnchorEl] = useState(null);
  const [edgeAnchorEl, setEdgeAnchorEl] = useState(null);
  const [validationAnchorEl, setValidationAnchorEl] = useState(null);
  const [isAddEmpty, setIsAddEmpty] = useState(true);
  const [isEditEmpty, setIsEditEmpty] = useState(true);
  const [isTypeEmpty, setIsTypeEmpty] = useState(true);
  const [editValue, setEditValue] = useState(null);
  const [typeValue, setTypeValue] = useState(null);
  const isNodeInfoOpen = !!nodeAnchorEl;
  const isEdgeInfoOpen = !!edgeAnchorEl;
  const isValidationInfoOpen = !!validationAnchorEl;

  const dispatch = useDispatch();

  const handleAddChange = value => {
    clearAdding();
    value !== "" ? setIsAddEmpty(false) : setIsAddEmpty(true);
    const addValue = value.split(" ");
    addValueChange({ addValue: addValue });
  };

  const handleEditChange = value => {
    value !== "" ? setIsEditEmpty(false) : setIsEditEmpty(true);
    const editValue = value.split(" ");
    setEditValue(editValue);
  };

  const handleNodeEdit = () => {
    editNode({
      pieces: editValue,
      selectedNodeId: selectedNode.id,
    });
  };

  const handleTypeChange = value => {
    value !== "" ? setIsTypeEmpty(false) : setIsTypeEmpty(true);
    setTypeValue(value);
  };

  const handleEdgeTypeEdit = () => {
    edgeTypeEdit({
      type: typeValue,
      selectedEdgeId: selectedEdge.id,
    });
  };

  const handleStateDownload = () => {
    const currentState = {
      nodes,
      edges,
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
        });
      } catch (e) {
        alert("Invalid JSON file.");
      }
    };
    fr.readAsText(file);
  };

  const handleReset = () => {
    stageReset();
    dispatch(ActionCreators.clearHistory());
  };

  return (
    <div>
      <IconButton
        onClick={() => setIsDrawerOpen(true)}
        color="primary"
        style={{ position: "absolute", zIndex: "1" }}
      >
        <MenuRoundedIcon />
      </IconButton>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton
            onClick={() => dispatch(ActionCreators.undo())}
            color="primary"
            disabled={!canUndo}
          >
            <UndoRoundedIcon />
          </IconButton>
          <IconButton
            onClick={() => dispatch(ActionCreators.redo())}
            color="primary"
            disabled={!canRedo}
          >
            <RedoRoundedIcon />
          </IconButton>
          <IconButton onClick={handleReset} color="primary">
            <NoteAddRoundedIcon />
          </IconButton>
          <IconButton onClick={handleStateDownload} color="primary">
            <GetAppRoundedIcon />
          </IconButton>
          <IconButton onClick={handleStateUpload} color="primary">
            <PublishRoundedIcon />
          </IconButton>
          <input
            id={"stateUploadButton"}
            style={{ display: "none" }}
            type="file"
            accept=".json"
            onChange={e => handleFileChange(e)}
          />
          <IconButton onClick={() => setIsDrawerOpen(false)} color="primary">
            <ChevronLeftRoundedIcon />
          </IconButton>
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
                combination, separated by a space before and after the
                combination.
              </Typography>
            </Popover>
          </div>
        </div>
        <div className={classes.toolbarField}>
          <TextField
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
            multiline
            onChange={e => handleAddChange(e.target.value)}
          ></TextField>
          <div>
            <IconButton
              size="medium"
              onClick={() => addingNodeClick()}
              disabled={isAddEmpty}
              color={addingNode ? "secondary" : "primary"}
            >
              <AddRoundedIcon />
            </IconButton>
          </div>
        </div>
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
                combination, separated by a space before and after the
                combination.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedNode ? (
          <div className={classes.toolbarField}>
            <TextField
              key={selectedNode.id}
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
              multiline
              onChange={e => handleEditChange(e.target.value)}
              defaultValue={selectedNode ? selectedNode.pieces.join(" ") : ""}
            ></TextField>
            <div>
              <IconButton
                size="medium"
                onClick={() => handleNodeEdit()}
                disabled={isEditEmpty}
                color="primary"
              >
                <UpdateRoundedIcon />
              </IconButton>
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
                Describe the edge type in the textfield below.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedEdge ? (
          <div className={classes.toolbarField}>
            <TextField
              variant="outlined"
              fullWidth
              size="medium"
              placeholder="ex: Object"
              margin="dense"
              multiline
              onChange={e => {
                handleTypeChange(e.target.value);
              }}
              defaultValue={selectedEdge ? selectedEdge.type : ""}
            ></TextField>
            <div>
              <IconButton
                size="medium"
                onClick={() => handleEdgeTypeEdit()}
                disabled={isTypeEmpty}
                color="primary"
              >
                {selectedEdge.type === "" ? (
                  <AddRoundedIcon />
                ) : (
                  <UpdateRoundedIcon />
                )}
              </IconButton>
            </div>
          </div>
        ) : (
          <Typography className={classes.editText}>
            Start by selecting an edge.
          </Typography>
        )}
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
                Validate a tree starting from a root node.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedRootNode ? (
          <div className={classes.toolbarField}>
            <Button
              variant="contained"
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
    </div>
  );
}

export default StageDrawer;
