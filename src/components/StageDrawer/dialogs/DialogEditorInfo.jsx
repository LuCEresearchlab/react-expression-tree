import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import {
  CloseRounded,
} from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  infoContent: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
}));

function DialogEditorInfo({
  containerRef,
  isDialogOpen,
  setIsDialogOpen,
}) {
  const classes = useStyles();

  return (
    <Dialog
      style={{ position: 'absolute' }}
      BackdropProps={{ style: { position: 'absolute' } }}
      container={containerRef.current}
      PaperProps={{
        style: { border: '2px solid #3f50b5', borderRadius: '5px' },
      }}
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          setIsDialogOpen(false);
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
            button or click on the node
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
          onClick={() => setIsDialogOpen(false)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogEditorInfo.propTypes = {
  containerRef: PropTypes.element.isRequired,
  isDialogOpen: PropTypes.bool,
  setIsDialogOpen: PropTypes.func,
};

DialogEditorInfo.defaultProps = {
  isDialogOpen: false,
  setIsDialogOpen: () => {},
};

export default DialogEditorInfo;
