import React from 'react';
import PropTypes from 'prop-types';

import {
  Snackbar,
} from '@material-ui/core';

import {
  Alert,
  AlertTitle,
} from '@material-ui/lab';

function AddEdgeErrorSnackbar({
  isAddEdgeErrorSnackbarOpen,
  toggleIsAddEdgeErrorSnackbarOpen,
  addEdgeErrorMessage,
}) {
  return (
    <Snackbar
      style={{ position: 'absolute' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      open={isAddEdgeErrorSnackbarOpen}
      onClose={toggleIsAddEdgeErrorSnackbarOpen}
    >
      <Alert severity="error" variant="standard">
        <AlertTitle>
          Edge error
        </AlertTitle>
        {`Reason: ${addEdgeErrorMessage}`}
      </Alert>
    </Snackbar>
  );
}

AddEdgeErrorSnackbar.propTypes = {
  isAddEdgeErrorSnackbarOpen: PropTypes.bool,
  addEdgeErrorMessage: PropTypes.string,
  toggleIsAddEdgeErrorSnackbarOpen: PropTypes.func,
};

AddEdgeErrorSnackbar.defaultProps = {
  isAddEdgeErrorSnackbarOpen: false,
  addEdgeErrorMessage: '',
  toggleIsAddEdgeErrorSnackbarOpen: () => {},
};

export default AddEdgeErrorSnackbar;
