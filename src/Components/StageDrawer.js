import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";

const drawerWidth = 240;

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
  // root: {
  //   position: "fixed",
  // },
}));

function StageDrawer({ addNode }) {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [addValue, setAddValue] = useState("");

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddChange = value => {
    value !== "" ? setIsEmpty(false) : setIsEmpty(true);
    try {
      JSON.parse(value);
      setIsValid(true);
      setAddValue(value);
    } catch (e) {
      setIsValid(false);
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

  return (
    <div className={classes.root}>
      <IconButton onClick={handleOpen}>
        <MenuIcon />
      </IconButton>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={isOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <Typography variant="body2">
          Create a new AST node describing the node's pieces as a JSON array.
          Holes are null, other pieces are strings.
        </Typography>
        <TextField
          id="addNodeField"
          variant="outlined"
          size="small"
          placeholder='ex: [null, ".append(", null, ")"]'
          margin="dense"
          multiline
          onChange={e => handleAddChange(e.target.value)}
          error={!isValid && !isEmpty}
        ></TextField>
        <div>
          <IconButton onClick={() => handleNodeCreation()} disabled={!isValid}>
            <AddIcon />
          </IconButton>
        </div>
      </Drawer>
    </div>
  );
}

export default StageDrawer;
