import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import ToolbarActions from './toolbar/ToolbarActions';

import EditorDrawer from './drawer/EditorDrawer';

import DialogEditorInfo from './dialogs/DialogEditorInfo';
import DialogConfirmReset from './dialogs/DialogConfirmReset';

import ValidationSnackbar from './snackbars/ValidationSnackbar';
import CreatingNodeSnackbar from './snackbars/CreatingNodeSnackbar';
import AddEdgeErrorSnackbar from './snackbars/AddEdgeErrorSnackbar';

function StageDrawer({
  containerRef,
  selectedRootNode,
  connectorPlaceholder,
  downloadKey,
  isCreatingNode,
  isAddEdgeErrorSnackbarOpen,
  isFullDisabled,
  isDrawerOpen,
  isFullScreen,
  isValidationDialogOpen,
  isSelectedNodeEditable,
  createNodeInputValue,
  editLabelInputValue,
  editTypeInputValue,
  editValueInputValue,
  showToolbar,
  showToolbarButtons,
  showDrawer,
  showDrawerSections,
  templateNodes,
  allowFreeTypeEdit,
  allowFreeValueEdit,
  templateNodeTypesAndValues,
  hasStateToUndo,
  hasStateToRedo,
  validationErrors,
  currentError,
  closeValidationDialog,
  toggleDrawer,
  addEdgeErrorMessage,
  toggleIsCreatingNode,
  toggleIsAddEdgeErrorSnackbarOpen,
  setCreateNodeInputValue,
  setEditLabelInputValue,
  setEditTypeInputValue,
  setEditValueInputValue,
  handleResetState,
  handleEditLabelPiecesChange,
  handleEditNodeTypeChange,
  handleEditNodeValueChange,
  handleUndoButtonAction,
  handleRedoButtonAction,
  handleZoomOutButtonAction,
  handleZoomInButtonAction,
  handleZoomToFitButtonAction,
  handleReorderNodesButtonAction,
  handleValidateTreeButtonAction,
  handleUploadStateButtonAction,
  handleTakeScreenshotButtonAction,
  handleFullScreenButtonAction,
  setPreviousError,
  setNextError,
}) {
  // State hooks
  const [isDialogConfigResetOpen, setIsDialogConfigResetOpen] = useState(false);
  const [isDialogEditorInfoOpen, setIsDialogEditorInfoOpen] = useState(false);

  const {
    showDrawerButton,
    showEditorInfoButton,
    showStateResetButton,
    showUndoButton,
    showRedoButton,
    showZoomOutButton,
    showZoomInButton,
    showZoomToFitButton,
    showReorderNodesButton,
    showValidateTreeButton,
    showUploadStateButton,
    showTakeScreenshotButton,
    showFullScreenButton,
  } = showToolbarButtons;

  const handleEditorInfoButtonAction = useCallback(() => {
    setIsDialogEditorInfoOpen(!isDialogEditorInfoOpen);
  });

  const handleStateResetButtonAction = useCallback(() => {
    setIsDialogConfigResetOpen(!isDialogConfigResetOpen);
  });

  return (
    <>
      {!isFullDisabled && (
        <>
          {showToolbar && (
            <ToolbarActions
              downloadKey={downloadKey}
              selectedRootNode={selectedRootNode}
              isFullScreen={isFullScreen}
              isDrawerOpen={isDrawerOpen}
              showDrawerButton={showDrawerButton}
              showEditorInfoButton={showEditorInfoButton}
              showStateResetButton={showStateResetButton}
              showUndoButton={showUndoButton}
              showRedoButton={showRedoButton}
              showZoomOutButton={showZoomOutButton}
              showZoomInButton={showZoomInButton}
              showZoomToFitButton={showZoomToFitButton}
              showReorderNodesButton={showReorderNodesButton}
              showValidateTreeButton={showValidateTreeButton}
              showUploadStateButton={showUploadStateButton}
              showTakeScreenshotButton={showTakeScreenshotButton}
              showFullScreenButton={showFullScreenButton}
              handleDrawerButtonAction={toggleDrawer}
              handleEditorInfoButtonAction={handleEditorInfoButtonAction}
              handleStateResetButtonAction={handleStateResetButtonAction}
              handleUndoButtonAction={handleUndoButtonAction}
              handleRedoButtonAction={handleRedoButtonAction}
              handleZoomOutButtonAction={handleZoomOutButtonAction}
              handleZoomInButtonAction={handleZoomInButtonAction}
              handleZoomToFitButtonAction={handleZoomToFitButtonAction}
              handleReorderNodesButtonAction={handleReorderNodesButtonAction}
              handleValidateTreeButtonAction={handleValidateTreeButtonAction}
              handleUploadStateButtonAction={handleUploadStateButtonAction}
              handleTakeScreenshotButtonAction={handleTakeScreenshotButtonAction}
              handleFullScreenButtonAction={handleFullScreenButtonAction}
              hasStateToUndo={hasStateToUndo}
              hasStateToRedo={hasStateToRedo}
            />
          )}
          {showDrawer && (
            <EditorDrawer
              containerRef={containerRef}
              connectorPlaceholder={connectorPlaceholder}
              isDrawerOpen={isDrawerOpen}
              isCreatingNode={isCreatingNode}
              isSelectedNodeEditable={isSelectedNodeEditable}
              templateNodes={templateNodes}
              showDrawerSections={showDrawerSections}
              handleEditLabelPiecesChange={handleEditLabelPiecesChange}
              handleEditNodeTypeChange={handleEditNodeTypeChange}
              handleEditNodeValueChange={handleEditNodeValueChange}
              templateNodeTypesAndValues={templateNodeTypesAndValues}
              createNodeInputValue={createNodeInputValue}
              editLabelInputValue={editLabelInputValue}
              editTypeInputValue={editTypeInputValue}
              editValueInputValue={editValueInputValue}
              toggleIsCreatingNode={toggleIsCreatingNode}
              setCreateNodeInputValue={setCreateNodeInputValue}
              setEditLabelInputValue={setEditLabelInputValue}
              setEditTypeInputValue={setEditTypeInputValue}
              setEditValueInputValue={setEditValueInputValue}
              allowFreeTypeEdit={allowFreeTypeEdit}
              allowFreeValueEdit={allowFreeValueEdit}
            />
          )}
          <DialogConfirmReset
            containerRef={containerRef}
            isDialogOpen={isDialogConfigResetOpen}
            setIsDialogOpen={setIsDialogConfigResetOpen}
            handleConfirmAction={handleResetState}
          />
          <DialogEditorInfo
            containerRef={containerRef}
            isDialogOpen={isDialogEditorInfoOpen}
            setIsDialogOpen={setIsDialogEditorInfoOpen}
          />
          <AddEdgeErrorSnackbar
            addEdgeErrorMessage={addEdgeErrorMessage}
            toggleIsAddEdgeErrorSnackbarOpen={toggleIsAddEdgeErrorSnackbarOpen}
            isAddEdgeErrorSnackbarOpen={isAddEdgeErrorSnackbarOpen}
          />
          <CreatingNodeSnackbar
            isCreatingNode={isCreatingNode}
            toggleIsCreatingNode={toggleIsCreatingNode}
          />
          <ValidationSnackbar
            isValidationDialogOpen={isValidationDialogOpen}
            closeValidationDialog={closeValidationDialog}
            validationErrors={validationErrors}
            currentError={currentError}
            setPreviousError={setPreviousError}
            setNextError={setNextError}
          />
        </>
      )}
    </>
  );
}

StageDrawer.propTypes = {
  containerRef: PropTypes.element.isRequired,
  selectedRootNode: PropTypes.number,
  connectorPlaceholder: PropTypes.string,
  downloadKey: PropTypes.string,
  isCreatingNode: PropTypes.bool,
  isAddEdgeErrorSnackbarOpen: PropTypes.bool,
  isFullDisabled: PropTypes.bool,
  isDrawerOpen: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  isValidationDialogOpen: PropTypes.bool,
  isSelectedNodeEditable: PropTypes.shape({
    label: PropTypes.bool,
    type: PropTypes.bool,
    value: PropTypes.bool,
  }),
  createNodeInputValue: PropTypes.string,
  editLabelInputValue: PropTypes.string,
  editTypeInputValue: PropTypes.string,
  editValueInputValue: PropTypes.string,
  showToolbar: PropTypes.bool,
  showToolbarButtons: PropTypes.shape({
    showDrawerButton: PropTypes.bool,
    showEditorInfoButton: PropTypes.bool,
    showStateResetButton: PropTypes.bool,
    showUndoButton: PropTypes.bool,
    showRedoButton: PropTypes.bool,
    showZoomOutButton: PropTypes.bool,
    showZoomInButton: PropTypes.bool,
    showZoomToFitButton: PropTypes.bool,
    showReorderNodesButton: PropTypes.bool,
    showValidateTreeButton: PropTypes.bool,
    showUploadStateButton: PropTypes.bool,
    showTakeScreenshotButton: PropTypes.bool,
    showFullScreenButton: PropTypes.bool,
  }),
  showDrawer: PropTypes.bool,
  showDrawerSections: PropTypes.shape({
    addNodeField: PropTypes.bool,
    templateDropdown: PropTypes.bool,
    editLabelField: PropTypes.bool,
    editValueField: PropTypes.bool,
    editTypeField: PropTypes.bool,
  }),
  templateNodes: PropTypes.arrayOf(PropTypes.string),
  allowFreeTypeEdit: PropTypes.bool,
  allowFreeValueEdit: PropTypes.bool,
  templateNodeTypesAndValues: PropTypes.shape({}),
  hasStateToUndo: PropTypes.bool,
  hasStateToRedo: PropTypes.bool,
  validationErrors: PropTypes.arrayOf({
    currentErrorLocation: PropTypes.shape({}),
    type: PropTypes.string,
    location: PropTypes.string,
    problem: PropTypes.string,
  }),
  currentError: PropTypes.number,
  addEdgeErrorMessage: PropTypes.string,
  closeValidationDialog: PropTypes.func,
  toggleIsAddEdgeErrorSnackbarOpen: PropTypes.func,
  toggleDrawer: PropTypes.func,
  toggleIsCreatingNode: PropTypes.func,
  setCreateNodeInputValue: PropTypes.func,
  setEditLabelInputValue: PropTypes.func,
  setEditTypeInputValue: PropTypes.func,
  setEditValueInputValue: PropTypes.func,
  handleResetState: PropTypes.func,
  handleEditLabelPiecesChange: PropTypes.func,
  handleEditNodeTypeChange: PropTypes.func,
  handleEditNodeValueChange: PropTypes.func,
  handleUndoButtonAction: PropTypes.func,
  handleRedoButtonAction: PropTypes.func,
  handleZoomOutButtonAction: PropTypes.func,
  handleZoomInButtonAction: PropTypes.func,
  handleZoomToFitButtonAction: PropTypes.func,
  handleReorderNodesButtonAction: PropTypes.func,
  handleValidateTreeButtonAction: PropTypes.func,
  handleUploadStateButtonAction: PropTypes.func,
  handleTakeScreenshotButtonAction: PropTypes.func,
  handleFullScreenButtonAction: PropTypes.func,
  setPreviousError: PropTypes.func,
  setNextError: PropTypes.func,
};

StageDrawer.defaultProps = {
  connectorPlaceholder: '{{}}',
  selectedRootNode: undefined,
  downloadKey: 'expressiontutor',
  isCreatingNode: false,
  isAddEdgeErrorSnackbarOpen: false,
  isFullDisabled: false,
  isDrawerOpen: true,
  isFullScreen: false,
  isValidationDialogOpen: false,
  isSelectedNodeEditable: {
    label: false,
    type: false,
    value: false,
  },
  createNodeInputValue: '',
  editLabelInputValue: '',
  editTypeInputValue: '',
  editValueInputValue: '',
  showToolbar: true,
  showToolbarButtons: {
    showDrawerButton: true,
    showEditorInfoButton: true,
    showStateResetButton: true,
    showUndoButton: true,
    showRedoButton: true,
    showZoomOutButton: true,
    showZoomInButton: true,
    showZoomToFitButton: true,
    showReorderNodesButton: true,
    showValidateTreeButton: true,
    showUploadStateButton: true,
    showTakeScreenshotButton: true,
    showFullScreenButton: true,
  },
  showDrawer: true,
  showDrawerSections: {
    addNodeField: true,
    templateDropdown: true,
    editLabelField: true,
    editValueField: true,
    editTypeField: true,
  },
  templateNodes: undefined,
  allowFreeTypeEdit: true,
  allowFreeValueEdit: true,
  templateNodeTypesAndValues: undefined,
  hasStateToUndo: false,
  hasStateToRedo: false,
  validationErrors: undefined,
  currentError: undefined,
  addEdgeErrorMessage: '',
  closeValidationDialog: () => {},
  toggleIsAddEdgeErrorSnackbarOpen: () => {},
  toggleDrawer: () => {},
  toggleIsCreatingNode: () => {},
  setCreateNodeInputValue: () => {},
  setEditLabelInputValue: () => {},
  setEditTypeInputValue: () => {},
  setEditValueInputValue: () => {},
  handleResetState: () => {},
  handleEditLabelPiecesChange: () => {},
  handleEditNodeTypeChange: () => {},
  handleEditNodeValueChange: () => {},
  handleUndoButtonAction: () => {},
  handleRedoButtonAction: () => {},
  handleZoomOutButtonAction: () => {},
  handleZoomInButtonAction: () => {},
  handleZoomToFitButtonAction: () => {},
  handleReorderNodesButtonAction: () => {},
  handleValidateTreeButtonAction: () => {},
  handleUploadStateButtonAction: () => {},
  handleTakeScreenshotButtonAction: () => {},
  handleFullScreenButtonAction: () => {},
  setPreviousError: () => {},
  setNextError: () => {},
};

export default StageDrawer;
