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
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  createInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  addField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  editField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function StageDrawer({ addNode, selectedNode, editNode }) {
  const classes = useStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isAddValid, setIsAddValid] = useState(false);
  const [isAddEmpty, setIsAddEmpty] = useState(true);
  const [addValue, setAddValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditValid, setIsEditValid] = useState(false);
  const [isEditEmpty, setIsEditEmpty] = useState(true);
  const [editValue, setEditValue] = useState(null);

  const isInfoOpen = !!anchorEl;

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleAddChange = value => {
    value !== "" ? setIsAddEmpty(false) : setIsAddEmpty(true);
    try {
      JSON.parse(value);
      setIsAddValid(true);
      setAddValue(value);
    } catch (e) {
      setIsAddValid(false);
    }
  };

  const handleNodeCreation = () => {
    const pieces = JSON.parse(addValue);
    addNode({
      pieces,
      x: 500,
      y: 500,
    });
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
    console.log(pieces);
    editNode({
      pieces: pieces,
      selectedNodeId: selectedNode.id,
    });
  };

  const handleInfoOpen = e => {
    setAnchorEl(e.target);
  };

  const handleInfoClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleDrawerOpen} color="primary">
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
        <div className={classes.createInfo}>
          <Typography variant="h6">Create a new AST node:</Typography>
          <div>
            <IconButton
              size="small"
              onClick={e => handleInfoOpen(e)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              open={isInfoOpen}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={handleInfoClose}
            >
              <Typography variant="body2">
                Describe the node's pieces as a JSON array. Holes are null,
                other pieces are strings.
              </Typography>
            </Popover>
          </div>
        </div>
        <div className={classes.addField}>
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
              onClick={() => handleNodeCreation()}
              disabled={!isAddValid}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
        <Divider />
        <div className={classes.editInfo}>
          <Typography variant="h6">Edit an existing AST node:</Typography>
          <div>
            <IconButton
              size="small"
              onClick={e => handleInfoOpen(e)}
              color="primary"
            >
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              open={isInfoOpen}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={handleInfoClose}
            >
              <Typography variant="body2">
                Describe the node's pieces as a JSON array. Holes are null,
                other pieces are strings.
              </Typography>
            </Popover>
          </div>
        </div>
        {selectedNode ? (
          <div className={classes.editField}>
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
              defaultValue={selectedNode ? "[" + selectedNode.pieces + "]" : ""}
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
          <Typography>Start by selecting an AST node.</Typography>
        )}
        <Divider />
      </Drawer>
    </div>
  );
}

export default StageDrawer;
