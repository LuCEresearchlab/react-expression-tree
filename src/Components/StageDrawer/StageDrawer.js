import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import UpdateIcon from "@material-ui/icons/Update";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import {
  Drawer,
  IconButton,
  Popover,
  Typography,
  TextField,
  Divider,
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
    justifyContent: "flex-end",
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
  },
}));

function StageDrawer({
  addNode,
  selectedNode,
  editNode,
  addingNode,
  addingNodeClick,
  addValueChange,
  addValue,
  clearAdding,
  selectedEdge,
  edgeTypeEdit,
}) {
  const classes = useStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isAddValid, setIsAddValid] = useState(false);
  const [isAddEmpty, setIsAddEmpty] = useState(true);
  const [nodeAnchorEl, setNodeAnchorEl] = useState(null);
  const [edgeAnchorEl, setEdgeAnchorEl] = useState(null);
  const [isEditValid, setIsEditValid] = useState(false);
  const [isEditEmpty, setIsEditEmpty] = useState(true);
  const [editValue, setEditValue] = useState(null);
  const [isTypeEmpty, setIsTypeEmpty] = useState(true);
  const [typeValue, setTypeValue] = useState(null);

  const isNodeInfoOpen = !!nodeAnchorEl;
  const isEdgeInfoOpen = !!edgeAnchorEl;

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleNodeInfoOpen = e => {
    setNodeAnchorEl(e.target);
  };

  const handleNodeInfoClose = () => {
    setNodeAnchorEl(null);
  };

  const handleEdgeInfoOpen = e => {
    setEdgeAnchorEl(e.target);
  };

  const handleEdgeInfoClose = () => {
    setEdgeAnchorEl(null);
  };

  const handleAddChange = value => {
    clearAdding();
    value !== "" ? setIsAddEmpty(false) : setIsAddEmpty(true);
    try {
      JSON.parse(value);
      setIsAddValid(true);
      addValueChange({ addValue: value });
    } catch (e) {
      setIsAddValid(false);
    }
  };

  const handleNodeCreationClick = () => {
    addingNodeClick();
  };

  const handleEditChange = value => {
    value !== "" ? setIsEditEmpty(false) : setIsEditEmpty(true);
    try {
      JSON.parse(value);
      setIsEditValid(true);
      setEditValue(value);
    } catch (e) {
      setIsEditValid(false);
    }
  };

  const handleNodeEdit = () => {
    const pieces = JSON.parse(editValue);
    editNode({
      pieces: pieces,
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

  return (
    <div>
      <IconButton
        onClick={handleDrawerOpen}
        color="primary"
        style={{ position: "absolute", zIndex: "1" }}
      >
        <MenuIcon />
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
          <IconButton onClick={handleDrawerClose} color="primary">
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.toolbarInfo}>
          <Typography variant="h6">Create a new node:</Typography>
          <div>
            <IconButton
              size="small"
              onClick={e => handleNodeInfoOpen(e)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              className={classes.infoPopover}
              open={isNodeInfoOpen}
              anchorEl={nodeAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={handleNodeInfoClose}
            >
              <Typography className={classes.infoPopoverText} variant="body2">
                Describe the node's pieces as a JSON array. Holes are null,
                other pieces are strings.
              </Typography>
            </Popover>
          </div>
        </div>
        <div className={classes.toolbarField}>
          <TextField
            variant="outlined"
            fullWidth
            size="medium"
            placeholder='ex: [null, ".append(", null, ")"]'
            margin="dense"
            multiline
            onChange={e => handleAddChange(e.target.value)}
            error={!isAddValid && !isAddEmpty}
            helperText={
              isAddValid
                ? ""
                : !isAddValid && !isAddEmpty
                ? "Invalid JSON array."
                : "Insert JSON array."
            }
          ></TextField>
          <div>
            <IconButton
              size="medium"
              onClick={() => handleNodeCreationClick()}
              disabled={!isAddValid}
              color={addingNode ? "secondary" : "primary"}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
        <Divider />
        <div className={classes.toolbarInfo}>
          <Typography variant="h6">Edit an existing node:</Typography>
          <div>
            <IconButton
              size="small"
              onClick={e => handleNodeInfoOpen(e)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              className={classes.infoPopover}
              open={isNodeInfoOpen}
              anchorEl={nodeAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={handleNodeInfoClose}
            >
              <Typography className={classes.infoPopoverText} variant="body2">
                Describe the node's pieces as a JSON array. Holes are null,
                other pieces are strings.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedNode ? (
          <div className={classes.toolbarField}>
            <TextField
              variant="outlined"
              fullWidth
              size="medium"
              placeholder='ex: [null, ".append(", null, ")"]'
              margin="dense"
              multiline
              onChange={e => handleEditChange(e.target.value)}
              error={!isEditValid && !isEditEmpty}
              helperText={
                isEditValid
                  ? ""
                  : !isEditValid && !isEditEmpty
                  ? "Invalid JSON array."
                  : "Insert JSON array."
              }
              defaultValue={
                selectedNode ? "[" + selectedNode.pieces + "]" : ""
                // selectedNode.pieces.reduce(
                //   (acc, current, index, arrayRef) => {
                //     let temp = current;
                //     if (current === null) temp = "null";

                //     if (
                //       index === arrayRef.length - 1 &&
                //       arrayRef.length > 1
                //     )
                //       return `${acc},${temp}]`;
                //     if (index === 0) return `${acc}${temp}`;
                //     return `${acc}${temp}`;
                //   },
                //   "["
                // )
              }
            ></TextField>
            <div>
              <IconButton
                size="medium"
                onClick={() => handleNodeEdit()}
                disabled={!isEditValid}
                color="primary"
              >
                <UpdateIcon />
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
              onClick={e => handleEdgeInfoOpen(e)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              className={classes.infoPopover}
              open={isEdgeInfoOpen}
              anchorEl={edgeAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={handleEdgeInfoClose}
            >
              <Typography className={classes.infoPopoverText} variant="body2">
                Describe the edge type as a string.
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
              helperText={!isTypeEmpty ? "" : "Insert a string."}
              defaultValue={selectedEdge ? selectedEdge.type : ""}
            ></TextField>
            <div>
              <IconButton
                size="medium"
                onClick={() => handleEdgeTypeEdit()}
                disabled={isTypeEmpty}
                color="primary"
              >
                {selectedEdge.type === "" ? <AddIcon /> : <UpdateIcon />}
              </IconButton>
            </div>
          </div>
        ) : (
          <Typography className={classes.editText}>
            Start by selecting an edge.
          </Typography>
        )}
        <Divider />
      </Drawer>
    </div>
  );
}

export default StageDrawer;
