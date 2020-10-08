import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
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
  // root: {
  //   position: "fixed",
  // },
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
}));

function StageDrawer({ addNode }) {
  const classes = useStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [addValue, setAddValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const isInfoOpen = !!anchorEl;

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
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

  const handleInfoOpen = e => {
    setAnchorEl(e.target);
  };

  const handleInfoClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
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
            error={!isValid && !isEmpty}
          ></TextField>
          <div>
            <IconButton
              size="medium"
              onClick={() => handleNodeCreation()}
              disabled={!isValid}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default StageDrawer;
