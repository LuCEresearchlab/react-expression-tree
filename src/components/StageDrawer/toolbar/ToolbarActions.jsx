import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getMetadata } from 'meta-png';

import { makeStyles } from '@material-ui/core/styles';

import {
  AccountTreeRounded,
  AspectRatioRounded,
  CheckRounded,
  ChevronLeftRounded,
  CropLandscapeRounded,
  FullscreenExitRounded,
  FullscreenRounded,
  InfoOutlined,
  MenuRounded,
  PhotoCameraRounded,
  PublishRounded,
  RedoRounded,
  Replay,
  UndoRounded,
  ZoomInRounded,
  ZoomOutRounded,
} from '@material-ui/icons';

import {
  Toolbar,
  IconButton,
  Tooltip,
} from '@material-ui/core';

// Top bar and side drawer styles
const useStyles = makeStyles(() => ({
  toolbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #aaa',
    overflowX: 'auto',
    '@media print': {
      display: 'none',
    },
  },
  toolbarButton: {
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&:disabled': {
      backgroundColor: '#fff',
    },
  },
}));

function ToolbarActions({
  downloadKey,
  selectedRootNode,
  isFullScreen,
  isDrawerOpen,
  showDrawerButton,
  showEditorInfoButton,
  showStateResetButton,
  showUndoButton,
  showRedoButton,
  showZoomOutButton,
  showZoomInButton,
  showZoomToFitButton,
  showZoomToActualSizeButton,
  showReorderNodesButton,
  showUploadStateButton,
  showTakeScreenshotButton,
  showFullScreenButton,
  handleDrawerButtonAction,
  handleEditorInfoButtonAction,
  handleStateResetButtonAction,
  handleUndoButtonAction,
  handleRedoButtonAction,
  handleZoomOutButtonAction,
  handleZoomInButtonAction,
  handleZoomToFitButtonAction,
  handleZoomToActualSizeButtonAction,
  handleReorderNodesButtonAction,
  handleUploadStateButtonAction,
  handleTakeScreenshotButtonAction,
  handleFullScreenButtonAction,
  hasStateToUndo,
  hasStateToRedo,
}) {
  const classes = useStyles();
  const uploadButtonRef = useRef();

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    e.target.value = '';
    const fr = new FileReader();
    fr.onload = (ev) => {
      try {
        const uint8Array = new Uint8Array(ev.target.result);
        let jsonStr = getMetadata(uint8Array, downloadKey);
        if (jsonStr === undefined) {
          const enc = new TextDecoder('utf-8');
          jsonStr = enc.decode(uint8Array);
        }
        const state = JSON.parse(jsonStr);
        handleUploadStateButtonAction(state);
      } catch (evt) {
        // TODO Change alert into SnackBar
        // alert('Invalid JSON/PNG file.');
      }
    };
    fr.readAsArrayBuffer(file);
  });

  const handleStateUpload = () => {
    const uploadElement = uploadButtonRef.current;
    uploadElement.click();
  };

  return (
    <Toolbar className={classes.toolbar} variant="dense">
      {/* Top bar buttons */}
      {showDrawerButton && (
        <Tooltip
          title={isDrawerOpen ? 'Close drawer' : 'Open drawer'}
          placement="bottom"
        >
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleDrawerButtonAction}
          >
            {isDrawerOpen ? <ChevronLeftRounded /> : <MenuRounded />}
          </IconButton>
        </Tooltip>
      )}
      {showEditorInfoButton && (
        <Tooltip title="Editor info" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleEditorInfoButtonAction}
          >
            <InfoOutlined />
          </IconButton>
        </Tooltip>
      )}
      {showStateResetButton && (
        <Tooltip title="Reset state" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleStateResetButtonAction}
          >
            <Replay />
          </IconButton>
        </Tooltip>
      )}
      {showUndoButton && (
        <Tooltip title="Undo action" placement="bottom">
          <span>
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              disabled={!hasStateToUndo}
              onClick={handleUndoButtonAction}
            >
              <UndoRounded />
            </IconButton>
          </span>
        </Tooltip>
      )}
      {showRedoButton && (
        <Tooltip title="Redo action" placement="bottom">
          <span>
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              disabled={!hasStateToRedo}
              onClick={handleRedoButtonAction}
            >
              <RedoRounded />
            </IconButton>
          </span>
        </Tooltip>
      )}
      {showZoomOutButton && (
        <Tooltip title="Zoom out" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleZoomOutButtonAction}
          >
            <ZoomOutRounded />
          </IconButton>
        </Tooltip>
      )}
      {showZoomInButton && (
        <Tooltip title="Zoom in" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleZoomInButtonAction}
          >
            <ZoomInRounded />
          </IconButton>
        </Tooltip>
      )}
      {showZoomToFitButton && (
        <Tooltip title="Zoom to fit nodes" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleZoomToFitButtonAction}
          >
            <AspectRatioRounded />
          </IconButton>
        </Tooltip>
      )}
      {showZoomToActualSizeButton && (
        <Tooltip title="Zoom to actual size" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleZoomToActualSizeButtonAction}
          >
            <CropLandscapeRounded />
          </IconButton>
        </Tooltip>
      )}
      {showReorderNodesButton && (
        <Tooltip title="Layout nodes" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleReorderNodesButtonAction}
          >
            <AccountTreeRounded />
          </IconButton>
        </Tooltip>
      )}
      {showUploadStateButton && (
        <Tooltip title="Restore state" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleStateUpload}
          >
            <PublishRounded />
          </IconButton>
        </Tooltip>
      )}
      <input
        id="stateUploadButton"
        ref={uploadButtonRef}
        style={{ display: 'none' }}
        type="file"
        accept="application/json,image/png"
        onChange={handleFileChange}
      />
      {showTakeScreenshotButton && (
        <Tooltip title="Save state image" placement="bottom">
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleTakeScreenshotButtonAction}
          >
            <PhotoCameraRounded />
          </IconButton>
        </Tooltip>
      )}
      {showFullScreenButton && (
        <Tooltip
          title={
            !isFullScreen
              ? 'Enter full screen'
              : 'Exit full screen'
          }
          placement="bottom"
        >
          <IconButton
            className={classes.toolbarButton}
            color="primary"
            onClick={handleFullScreenButtonAction}
          >
            {!isFullScreen ? (
              <FullscreenRounded />
            ) : (
              <FullscreenExitRounded />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

ToolbarActions.propTypes = {
  downloadKey: PropTypes.string,
  selectedRootNode: PropTypes.number,
  isFullScreen: PropTypes.bool,
  isDrawerOpen: PropTypes.bool,
  showDrawerButton: PropTypes.bool,
  showEditorInfoButton: PropTypes.bool,
  showStateResetButton: PropTypes.bool,
  showUndoButton: PropTypes.bool,
  showRedoButton: PropTypes.bool,
  showZoomOutButton: PropTypes.bool,
  showZoomInButton: PropTypes.bool,
  showZoomToFitButton: PropTypes.bool,
  showZoomToActualSizeButton: PropTypes.bool,
  showReorderNodesButton: PropTypes.bool,
  showUploadStateButton: PropTypes.bool,
  showTakeScreenshotButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  handleDrawerButtonAction: PropTypes.func,
  handleEditorInfoButtonAction: PropTypes.func,
  handleStateResetButtonAction: PropTypes.func,
  handleUndoButtonAction: PropTypes.func,
  handleRedoButtonAction: PropTypes.func,
  handleZoomOutButtonAction: PropTypes.func,
  handleZoomInButtonAction: PropTypes.func,
  handleZoomToFitButtonAction: PropTypes.func,
  handleZoomToActualSizeButtonAction: PropTypes.func,
  handleReorderNodesButtonAction: PropTypes.func,
  handleUploadStateButtonAction: PropTypes.func,
  handleTakeScreenshotButtonAction: PropTypes.func,
  handleFullScreenButtonAction: PropTypes.func,
  hasStateToUndo: PropTypes.bool,
  hasStateToRedo: PropTypes.bool,
};

ToolbarActions.defaultProps = {
  downloadKey: 'expressiontutor',
  selectedRootNode: undefined,
  isFullScreen: false,
  isDrawerOpen: false,
  showDrawerButton: true,
  showEditorInfoButton: true,
  showStateResetButton: true,
  showUndoButton: true,
  showRedoButton: true,
  showZoomOutButton: true,
  showZoomInButton: true,
  showZoomToFitButton: true,
  showZoomToActualSizeButton: true,
  showReorderNodesButton: true,
  showUploadStateButton: true,
  showTakeScreenshotButton: true,
  showFullScreenButton: true,
  handleDrawerButtonAction: () => {},
  handleEditorInfoButtonAction: () => {},
  handleStateResetButtonAction: () => {},
  handleUndoButtonAction: () => {},
  handleRedoButtonAction: () => {},
  handleZoomOutButtonAction: () => {},
  handleZoomInButtonAction: () => {},
  handleZoomToFitButtonAction: () => {},
  handleZoomToActualSizeButtonAction: () => {},
  handleReorderNodesButtonAction: () => {},
  handleUploadStateButtonAction: () => {},
  handleTakeScreenshotButtonAction: () => {},
  handleFullScreenButtonAction: () => {},
  hasStateToUndo: false,
  hasStateToRedo: false,
};

export default ToolbarActions;
