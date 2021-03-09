import React from 'react';
import PropTypes from 'prop-types';

import {
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@material-ui/core';

import {
  ArrowBackRounded,
  ArrowForwardRounded,
  ClearRounded,
} from '@material-ui/icons';

import {
  Alert,
  AlertTitle,
} from '@material-ui/lab';

function ValidationSnackbar({
  isValidationDialogOpen,
  closeValidationDialog,
  validationErrors,
  currentError,
  setPreviousError,
  setNextError,
}) {
  return (
    <>
      { validationErrors ? (
        <Snackbar
          style={{ position: 'absolute' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          open={isValidationDialogOpen}
          onClose={(e, reason) => {
            if (reason === 'clickaway') {
              closeValidationDialog();
            }
          }}
        >
          <Alert
            variant="standard"
            severity="error"
            action={(
              <>
                {validationErrors.length > 1 && (
                  <>
                    <Tooltip title="Previous Error" placement="top">
                      <span>
                        <IconButton
                          size="medium"
                          color="inherit"
                          disabled={currentError === 0}
                          onClick={setPreviousError}
                        >
                          <ArrowBackRounded />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Next Error" placement="top">
                      <span>
                        <IconButton
                          size="medium"
                          color="inherit"
                          disabled={currentError === validationErrors.length - 1}
                          onClick={setNextError}
                        >
                          <ArrowForwardRounded />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </>
                )}
                <Tooltip title="Close alert" placement="top">
                  <IconButton
                    size="medium"
                    color="inherit"
                    onClick={closeValidationDialog}
                  >
                    <ClearRounded />
                  </IconButton>
                </Tooltip>
              </>
            )}
          >
            <AlertTitle>
              Invalid Tree (
              {validationErrors.length}
              {' '}
              error
              {validationErrors.length > 1 && 's'}
              )
            </AlertTitle>
            <Typography variant="body2" paragraph>
              <b>
                Error #
                {currentError + 1}
              </b>
            </Typography>

            <Typography variant="body2">
              <b>Error type: </b>
            </Typography>
            <Typography variant="body2" paragraph>
              {validationErrors[currentError]
                && validationErrors[currentError].type}
            </Typography>

            <Typography variant="body2">
              <b>Error description: </b>
            </Typography>
            <Typography variant="body2" paragraph>
              {validationErrors[currentError]
                && validationErrors[currentError].problem}
            </Typography>

            <Typography variant="body2">
              <b>Error location: </b>
            </Typography>
            <Typography variant="body2">
              {validationErrors[currentError]
                && validationErrors[currentError].location}
            </Typography>
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          style={{ position: 'absolute' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          open={isValidationDialogOpen}
          onClose={(e, reason) => {
            if (reason === 'clickaway') {
              closeValidationDialog(false);
            }
          }}
        >
          <Alert
            variant="standard"
            severity="success"
            action={(
              <Tooltip title="Close alert" placement="top">
                <IconButton
                  size="medium"
                  color="inherit"
                  onClick={() => closeValidationDialog(false)}
                >
                  <ClearRounded />
                </IconButton>
              </Tooltip>
            )}
          >
            <AlertTitle>Valid Tree (0 errors)</AlertTitle>
            The selected tree is valid.
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

ValidationSnackbar.propTypes = {
  isValidationDialogOpen: PropTypes.bool,
  closeValidationDialog: PropTypes.func,
  validationErrors: PropTypes.arrayOf({
    currentErrorLocation: PropTypes.shape({}),
    type: PropTypes.string,
    location: PropTypes.string,
    problem: PropTypes.string,
  }),
  currentError: PropTypes.number,
  setPreviousError: PropTypes.func,
  setNextError: PropTypes.func,
};

ValidationSnackbar.defaultProps = {
  isValidationDialogOpen: false,
  closeValidationDialog: () => {},
  validationErrors: undefined,
  currentError: undefined,
  setPreviousError: () => {},
  setNextError: () => {},
};

export default ValidationSnackbar;
