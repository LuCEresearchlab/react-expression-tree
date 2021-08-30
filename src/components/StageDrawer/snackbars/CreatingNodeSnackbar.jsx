import React from 'react';
import PropTypes from 'prop-types';

import {
  Snackbar,
} from '@material-ui/core';

import {
  Alert,
} from '@material-ui/lab';

function CreatingNodeSnackbar({
  isCreatingNode,
  toggleIsCreatingNode,
}) {
  return (
    <Snackbar
      style={{ position: 'absolute' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      open={isCreatingNode}
      onClose={(e, reason) => {
        if (reason !== 'clickaway') {
          toggleIsCreatingNode();
        }
      }}
    >
      <Alert severity="info" variant="standard">
        Freely position the node on the stage
      </Alert>
    </Snackbar>
  );
}

CreatingNodeSnackbar.propTypes = {
  isCreatingNode: PropTypes.bool,
  toggleIsCreatingNode: PropTypes.func,
};

CreatingNodeSnackbar.defaultProps = {
  isCreatingNode: false,
  toggleIsCreatingNode: () => {},
};

export default CreatingNodeSnackbar;
