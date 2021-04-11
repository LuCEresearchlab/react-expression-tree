import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  Drawer,
  IconButton,
  Popover,
  Typography,
  TextField,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  FormLabel,
  Tooltip,
} from '@material-ui/core';

import {
  AddRounded,
  ExpandMore,
  InfoOutlined,
  Check,
} from '@material-ui/icons';

import { Layer, Stage } from 'react-konva';
import Node from '../../Node/Node';

// Width of the side drawer
const drawerWidth = 300;

// Top bar and side drawer styles
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    position: 'absolute',
    overflowY: 'auto',
    '@media print': {
      display: 'none',
    },
    '& .MuiDrawer-paperAnchorLeft': {
      border: '0px',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  drawerContainer: {
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: '#fafafa',
    borderRadius: '0px 0px 15px 0px',
    borderRight: '1px solid #dedede',
    borderBottom: '1px solid #dedede',
  },
  drawerInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '10px 0 0 10px',
  },
  drawerField: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 0 10px 10px',
  },
  infoPopover: {
    marginLeft: '5px',
  },
  infoPopoverText: {
    border: '2px solid',
    borderRadius: '4px',
    borderColor: theme.palette.primary.main,
    padding: '3px 6px 3px 6px',
    maxWidth: '500px',
  },
  accordionContainer: {
    display: 'block',
    padding: 0,
    margin: '0 10px 10px 10px',
  },
  templateElement: {
    color: 'white',
    backgroundColor: '#208020',
    border: 'solid 1px black',
    borderRadius: '5px',
    padding: '3px 10px 7px 10px',
    fontFamily: 'Roboto Mono, Courier',
    fontSize: '22px',
    '&:hover': {
      cursor: 'pointer',
    },
    marginBottom: '-10px',
  },
  selectedTemplateElement: {
    color: 'white',
    backgroundColor: '#3f50b5',
    border: 'solid 2px black',
    borderRadius: '5px',
    padding: '3px 10px 7px 10px',
    fontFamily: 'Roboto Mono, Courier',
    fontSize: '22px',
    '&:hover': {
      cursor: 'pointer',
    },
    marginBottom: '-10px',
    boxShadow: '3px 3px 3px black',
  },
  templateContainer: {
    maxHeight: '200px',
    overflowY: 'scroll',
  },
  textField: {
    paddingRight: '10px',
  },
  input: {
    backgroundColor: 'white',
  },
  typeField: {
    margin: '10px 10px 10px 10px',
  },
  typeButton: {
    textTransform: 'none',
  },
  valueButton: {
    textTransform: 'none',
  },
}));

function EditorDrawer({
  containerRef,
  connectorPlaceholder,
  showDrawerSections,
  toggleIsCreatingNode,
  templateNodes,
  handleUpdateLabelPiecesChange,
  handleUpdateNodeTypeChange,
  handleUpdateNodeValueChange,
  allowFreeTypeUpdate,
  allowFreeValueUpdate,
  templateNodeTypesAndValues,
  isDrawerOpen,
  isCreatingNode,
  isSelectedNodeEditable,
  createNodeDescription,
  createNodeInputValue,
  updateLabelInputValue,
  updateTypeInputValue,
  updateValueInputValue,
  setCreateNodeInputValue,
  setUpdateLabelInputValue,
  nodeFontSize,
  nodeFontFamily,
  nodePaddingX,
  nodePaddingY,
  nodeStyle,
}) {
  const classes = useStyles();

  const [addAnchorEl, setAddAnchorEl] = useState(null);
  const isAddInfoOpen = !!addAnchorEl;

  const handleTemplateClick = (value) => {
    setCreateNodeInputValue(value);
  };
  return (
    <Drawer
      className={classes.drawer}
      PaperProps={{ style: { position: 'relative' } }}
      BackdropProps={{ style: { position: 'relative' } }}
      ModalProps={{
        container: (containerRef.current),
        style: {
          position: 'absolute',
        },
      }}
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
    >
      <div className={classes.drawerContainer}>
        {showDrawerSections.addNodeField && (
          <>
            <div className={classes.drawerInfo}>
              <div>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => setAddAnchorEl(e.target)}
                >
                  <InfoOutlined />
                </IconButton>
                <Popover
                  className={classes.infoPopover}
                  anchorEl={addAnchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={isAddInfoOpen}
                  onClose={() => setAddAnchorEl(null)}
                >
                  <Typography
                    className={classes.infoPopoverText}
                    variant="body2"
                  >
                    {`Describe the node content in the textfield below. Holes are represented by the special ${connectorPlaceholder} character.`}
                  </Typography>
                </Popover>
              </div>
              <Typography variant="h6">Create a new node:</Typography>
            </div>
            <div className={classes.drawerField}>
              <TextField
                className={classes.textField}
                id="addField"
                type="search"
                variant="outlined"
                fullWidth
                size="medium"
                // label="Insert the node's pieces"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  className: classes.input,
                }}
                placeholder={`example: ${connectorPlaceholder} + ${connectorPlaceholder}`}
                margin="dense"
                value={createNodeInputValue}
                autoComplete="off"
                onChange={(e) => setCreateNodeInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    toggleIsCreatingNode();
                  }
                }}
              />
              <div>
                <Tooltip
                  title={isCreatingNode ? 'Clear adding' : 'Add node'}
                  placement="top"
                >
                  <span>
                    <IconButton
                      size="medium"
                      color={isCreatingNode ? 'secondary' : 'primary'}
                      //  disabled={isAddEmpty}
                      onClick={toggleIsCreatingNode}
                    >
                      <AddRounded />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>
            {createNodeDescription !== undefined && (
              <div className={classes.drawerField}>
                <Stage
                  width={300}
                  height={20 + createNodeDescription.height}
                >
                  <Layer>
                    <Node
                      id="create-node"
                      positionX={5}
                      positionY={10}
                      labelPieces={createNodeDescription.pieces}
                      labelPiecesPosition={createNodeDescription.piecesPosition}
                      typeText={createNodeDescription.type}
                      valueText={createNodeDescription.value}
                      nodeWidth={createNodeDescription.width}
                      nodeHeight={createNodeDescription.height}
                      childEdges={createNodeDescription.childEdges}
                      parentEdges={createNodeDescription.parentEdges}
                      isFinal={createNodeDescription.isFinal}
                      isSelected={createNodeDescription.isSelected}
                      connectorPlaceholder={connectorPlaceholder}
                      fontSize={nodeFontSize}
                      fontFamily={nodeFontFamily}
                      nodePaddingX={nodePaddingX}
                      nodePaddingY={nodePaddingY}
                      nodeStrokeColor={nodeStyle.nodeStrokeColor}
                      nodeStrokeWidth={nodeStyle.nodeStrokeWidth}
                      nodeSelectedStrokeWidth={nodeStyle.nodeSelectedStrokeWidth}
                      nodeCornerRadius={nodeStyle.nodeCornerRadius}
                      nodeFillColor={nodeStyle.nodeFillColor}
                      nodeErrorColor={nodeStyle.nodeErrorColor}
                      nodeSelectedColor={nodeStyle.nodeSelectedColor}
                      nodeFinalColor={nodeStyle.nodeFinalColor}
                      labelStyle={nodeStyle.labelStyle}
                      topConnectorStyle={nodeStyle.topConnectorStyle}
                      deleteButtonStyle={nodeStyle.deleteButtonStyle}
                      typeValueStyle={nodeStyle.typeValueStyle}
                      isFullDisabled
                    />
                  </Layer>
                </Stage>
              </div>
            )}
          </>
        )}
        {showDrawerSections.templateDropdown && templateNodes && (
          <div>
            <div>
              <AccordionActions
                disableSpacing
                classes={{ root: classes.accordionContainer }}
              >
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body1">
                      Suggested nodes:
                    </Typography>
                  </AccordionSummary>
                  <Divider />
                  <div className={classes.templateContainer}>
                    {templateNodes.map((templateValue, i) => (
                      <AccordionDetails key={templateValue}>
                        <Typography
                          id={i}
                          className={classes.templateElement}
                          variant="h6"
                          onClick={() => handleTemplateClick(templateValue)}
                        >
                          {templateValue}
                        </Typography>
                      </AccordionDetails>
                    ))}
                  </div>
                </Accordion>
              </AccordionActions>
            </div>
          </div>
        )}
        {(isSelectedNodeEditable.label
          || isSelectedNodeEditable.type
          || isSelectedNodeEditable.value)
          && (showDrawerSections.updateLabelField
            || showDrawerSections.updateTypeField
            || showDrawerSections.updateValueField) && (
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Edit an existing node:</Typography>
            </div>
        )}
        {showDrawerSections.updateLabelField && isSelectedNodeEditable.label && (
          <>
            <div className={classes.drawerField}>
              <TextField
                className={classes.textField}
                id="updateField"
                variant="outlined"
                type="search"
                fullWidth
                size="medium"
                label="Edit the node's content"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  className: classes.input,
                }}
                placeholder={`example: ${connectorPlaceholder} + ${connectorPlaceholder}`}
                value={updateLabelInputValue}
                margin="dense"
                autoComplete="off"
                onChange={(e) => setUpdateLabelInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateLabelPiecesChange(e.target.value);
                  }
                }}
              />
              <div>
                <Tooltip title="Confirm edit" placement="top">
                  <span>
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={handleUpdateLabelPiecesChange}
                    >
                      <Check />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>
          </>
        )}
        {showDrawerSections.updateTypeField && isSelectedNodeEditable.type && (
          <>
            <div className={classes.drawerField}>
              {/* <Typography variant="h6">Edit the type:</Typography> */}
              {allowFreeTypeUpdate && (
                <>
                  <TextField
                    className={classes.textField}
                    id="typeField"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    placeholder="String"
                    margin="dense"
                    label="Edit the node's type"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      className: classes.input,
                    }}
                    autoComplete="off"
                    value={updateTypeInputValue}
                    onChange={(e) => handleUpdateNodeTypeChange(e.target.value)}
                  />
                </>
              )}
            </div>

            {templateNodeTypesAndValues && (
              <div className={classes.typeField}>
                <FormLabel>Suggested node types:</FormLabel>
                <div>
                  {Object.keys(templateNodeTypesAndValues).map((nodeType) => (
                    <Button
                      size="large"
                      key={nodeType}
                      className={classes.typeButton}
                      onClick={() => handleUpdateNodeTypeChange(nodeType)}
                    >
                      {nodeType}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {showDrawerSections.updateValueField && isSelectedNodeEditable.value && (
          <>
            <div className={classes.drawerField}>
              {/* <Typography variant="h6">Edit the type:</Typography> */}
              {allowFreeValueUpdate && (
                <>
                  <TextField
                    className={classes.textField}
                    id="valueField"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    placeholder={'example: "Hello World"'}
                    margin="dense"
                    label="Edit the node's value"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      className: classes.input,
                    }}
                    autoComplete="off"
                    value={updateValueInputValue}
                    onChange={(e) => handleUpdateNodeValueChange(e.target.value)}
                  />
                </>
              )}
            </div>

            {templateNodeTypesAndValues
              && templateNodeTypesAndValues[updateTypeInputValue]
              && templateNodeTypesAndValues[updateTypeInputValue].length > 0 && (
                <div className={classes.typeField}>
                  <FormLabel>Suggested node values:</FormLabel>
                  <div>
                    {templateNodeTypesAndValues[updateTypeInputValue].map((nodeValue) => (
                      <Button
                        size="large"
                        key={nodeValue}
                        className={classes.valueButton}
                        onClick={() => handleUpdateNodeValueChange(nodeValue)}
                      >
                        {nodeValue}
                      </Button>
                    ))}
                  </div>
                </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
}

EditorDrawer.propTypes = {
  containerRef: PropTypes.element.isRequired,
  connectorPlaceholder: PropTypes.string,
  templateNodes: PropTypes.arrayOf(PropTypes.string),
  allowFreeTypeUpdate: PropTypes.bool,
  allowFreeValueUpdate: PropTypes.bool,
  templateNodeTypesAndValues: PropTypes.shape({}),
  showDrawerSections: PropTypes.shape({
    addNodeField: PropTypes.bool,
    templateDropdown: PropTypes.bool,
    updateLabelField: PropTypes.bool,
    updateValueField: PropTypes.bool,
    updateTypeField: PropTypes.bool,
  }),
  toggleIsCreatingNode: PropTypes.func,
  handleUpdateLabelPiecesChange: PropTypes.func,
  handleUpdateNodeTypeChange: PropTypes.func,
  handleUpdateNodeValueChange: PropTypes.func,

  isDrawerOpen: PropTypes.bool,
  isCreatingNode: PropTypes.bool,
  isSelectedNodeEditable: PropTypes.bool,

  createNodeDescription: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    pieces: PropTypes.arrayOf(PropTypes.string),
    piecesPosition: PropTypes.arrayOf(PropTypes.number),
    type: PropTypes.string,
    value: PropTypes.string,
    isFinal: PropTypes.bool,
    isSelected: PropTypes.bool,
    childEdges: PropTypes.arrayOf(PropTypes.string),
    parentEdges: PropTypes.arrayOf(PropTypes.string),
  }),
  createNodeInputValue: PropTypes.string,
  updateLabelInputValue: PropTypes.string,
  updateTypeInputValue: PropTypes.string,
  updateValueInputValue: PropTypes.string,
  setCreateNodeInputValue: PropTypes.func,
  setUpdateLabelInputValue: PropTypes.func,
  nodeFontSize: PropTypes.number,
  nodeFontFamily: PropTypes.string,
  nodePaddingX: PropTypes.number,
  nodePaddingY: PropTypes.number,
  nodeStyle: PropTypes.exact({
    nodeStrokeColor: PropTypes.string,
    nodeStrokeWidth: PropTypes.number,
    nodeSelectedStrokeWidth: PropTypes.number,
    nodeCornerRadius: PropTypes.number,
    nodeFillColor: PropTypes.string,
    nodeErrorColor: PropTypes.string,
    nodeSelectedColor: PropTypes.string,
    nodeFinalColor: PropTypes.string,
    labelStyle: PropTypes.exact({
      nodeTextColor: PropTypes.string,
      placeholderStrokeWidth: PropTypes.number,
      placeholderStrokeColor: PropTypes.string,
      placeholderFillColor: PropTypes.string,
      placeholderErrorColor: PropTypes.string,
      placeholderRadius: PropTypes.number,
      connectorRadiusSize: PropTypes.number,
      connectorStrokeWidth: PropTypes.number,
      connectorFillColor: PropTypes.string,
      connectorStrokeColor: PropTypes.string,
    }),
    topConnectorStyle: PropTypes.exact({
      starNumPoints: PropTypes.number,
      starInnerRadius: PropTypes.number,
      starOuterRadius: PropTypes.number,
      starStrokeColor: PropTypes.string,
      starStrokeWidth: PropTypes.number,
      connectorRadius: PropTypes.number,
      connectorStrokeColor: PropTypes.string,
      connectorStrokeWidth: PropTypes.number,
      connectorFillColor: PropTypes.string,
      connectorErrorColor: PropTypes.string,
      connectorSelectedColor: PropTypes.string,
      connectorEmptyFillColor: PropTypes.string,
    }),
    deleteButtonStyle: PropTypes.exact({
      strokeWidth: PropTypes.number,
      radius: PropTypes.number,
      strokeColor: PropTypes.string,
      fillColor: PropTypes.string,
      textColor: PropTypes.string,
      overStrokeColor: PropTypes.string,
      overFillColor: PropTypes.string,
      overTextColor: PropTypes.string,
    }),
    typeValueStyle: PropTypes.exact({
      strokeWidth: PropTypes.number,
      radius: PropTypes.number,
      padding: PropTypes.number,
      textColor: PropTypes.string,
      fillColor: PropTypes.string,
      strokeColor: PropTypes.string,
      pointerDirection: PropTypes.string,
      pointerWidth: PropTypes.number,
      pointerHeight: PropTypes.number,
    }),
  }),
};

EditorDrawer.defaultProps = {
  connectorPlaceholder: '{{}}',
  templateNodes: undefined,
  allowFreeTypeUpdate: true,
  allowFreeValueUpdate: true,
  templateNodeTypesAndValues: undefined,
  showDrawerSections: {
    addNodeField: true,
    templateDropdown: true,
    updateLabelField: true,
    updateValueField: true,
    updateTypeField: true,
  },
  handleUpdateLabelPiecesChange: () => {},
  handleUpdateNodeTypeChange: () => {},
  handleUpdateNodeValueChange: () => {},
  toggleIsCreatingNode: () => {},

  isDrawerOpen: true,
  isCreatingNode: false,
  isSelectedNodeEditable: {
    label: false,
    type: false,
    value: false,
  },
  createNodeDescription: undefined,
  createNodeInputValue: '',
  updateLabelInputValue: '',
  updateTypeInputValue: '',
  updateValueInputValue: '',
  setUpdateLabelInputValue: () => {},
  setCreateNodeInputValue: () => {},

  nodeFontSize: 24,
  nodeFontFamily: 'Roboto Mono, Courier',
  nodePaddingX: 12,
  nodePaddingY: 12,
  nodeStyle: {},
};

export default EditorDrawer;
