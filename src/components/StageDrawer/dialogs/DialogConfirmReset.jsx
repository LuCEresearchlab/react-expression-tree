import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

// import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

import {
  CheckRounded,
  CloseRounded,
} from '@material-ui/icons';

// const useStyles = makeStyles((theme) => ({}));

function DialogConfirmReset({
  containerRef,
  isDialogOpen,
  setIsDialogOpen,
  handleConfirmAction,
}) {
  // const classes = useStyles();

  const doActionAndCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    handleConfirmAction();
  });

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
          doActionAndCloseDialog();
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
          onClick={() => setIsDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<CheckRounded />}
          onClick={doActionAndCloseDialog}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogConfirmReset.propTypes = {
  containerRef: PropTypes.element.isRequired,
  isDialogOpen: PropTypes.bool,
  setIsDialogOpen: PropTypes.func,
  handleConfirmAction: PropTypes.func,
};

DialogConfirmReset.defaultProps = {
  isDialogOpen: false,
  setIsDialogOpen: () => {},
  handleConfirmAction: () => {},
};

export default DialogConfirmReset;
