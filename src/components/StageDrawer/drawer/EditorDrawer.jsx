import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  Drawer,
  IconButton,
  InputAdornment,
  Popover,
  Typography,
  TextField,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  FormLabel,
  Tooltip,
  Switch,
  FormControlLabel,
  FormGroup,
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
    // '& .MuiDrawer-paperAnchorLeft': {
    //   border: '0px',
    //   backgroundColor: 'rgba(0,0,0,0)',
    // },
  },
  drawerAnchorLeft: {
    border: '0px',
    backgroundColor: 'rgba(0,0,0,0)',
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
    fontFamily: 'monospace',
  },
  typeField: {
    margin: '10px 10px 10px 10px',
    overflowX: 'auto',
  },
  suggestionChip: {
    margin: theme.spacing(0.5),
    fontFamily: 'monospace',
  },
  endAdornment: {
    paddingRight: 0,
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
  handleSelectedNodeEditableLabelChange,
  handleSelectedNodeEditableDeleteChange,
  handleSelectedNodeEditableTypeChange,
  handleSelectedNodeEditableValueChange,
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
  createNodeInputPlaceholder,
  editNodeInputPlaceholder,
  typeInputPlaceholder,
  valueInputPlaceholder,
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
      classes={{ paper: classes.drawerAnchorLeft }}
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
                variant="outlined"
                fullWidth
                size="medium"
                // label="Insert the node's pieces"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  className: classes.input,
                  classes: {
                    adornedEnd: classes.endAdornment,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        title={isCreatingNode ? 'Clear adding' : 'Add node'}
                        placement="right"
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
                    </InputAdornment>
                  ),
                }}
                placeholder={createNodeInputPlaceholder || `example: ${connectorPlaceholder} + ${connectorPlaceholder}`}
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
            </div>
            {createNodeDescription !== undefined && (
              <div className={classes.drawerField}>
                <Stage
                  width={300}
                  height={60}
                >
                  <Layer>
                    <Node
                      id="example-node"
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
                      isSelected={createNodeDescription.isSelected}
                      connectorPlaceholder={connectorPlaceholder}
                      editableLabel
                      editableType
                      editableValue
                      editableDelete
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
                          id={`Template-${i}`}
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
        {(isSelectedNodeEditable && (
          isSelectedNodeEditable.label
            || isSelectedNodeEditable.type
            || isSelectedNodeEditable.value
        ))
          && (showDrawerSections.editLabelField
            || showDrawerSections.editTypeField
            || showDrawerSections.editValueField) && (
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Edit an existing node:</Typography>
            </div>
        )}
        {
          showDrawerSections.editLabelField
            && isSelectedNodeEditable
            && isSelectedNodeEditable.label && (
            <>
              <div className={classes.drawerField}>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  fullWidth
                  size="medium"
                  label="Structure of this node"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    className: classes.input,
                    classes: {
                      adornedEnd: classes.endAdornment
                    },
                    endAdornment:
                      <Tooltip title="Confirm change" placement="right">
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
                  }}
                  placeholder={editNodeInputPlaceholder || `example: ${connectorPlaceholder} + ${connectorPlaceholder}`}
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
              </div>
            </>
        )}
        {showDrawerSections.editTypeField
          && isSelectedNodeEditable
          && isSelectedNodeEditable.type
          && (
          <>
            <div className={classes.drawerField}>
              {/* <Typography variant="h6">Edit the type:</Typography> */}
              {allowFreeTypeUpdate && (
                <>
                  <TextField
                    className={classes.textField}
                    variant="outlined"
                    fullWidth
                    size="medium"
                    placeholder={typeInputPlaceholder}
                    margin="dense"
                    label="Type of this node"
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
                <FormLabel>Suggested types:</FormLabel>
                <div>
                  {Object.keys(templateNodeTypesAndValues).map((nodeType) => (
                    <Chip
                      key={nodeType}
                      label={nodeType}
                      className={classes.suggestionChip}
                      onClick={() => handleUpdateNodeTypeChange(nodeType)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {showDrawerSections.editValueField
          && isSelectedNodeEditable
          && isSelectedNodeEditable.value
          && (
          <>
            <div className={classes.drawerField}>
              {/* <Typography variant="h6">Edit the type:</Typography> */}
              {allowFreeValueUpdate && (
                <>
                  <TextField
                    className={classes.textField}
                    variant="outlined"
                    fullWidth
                    size="medium"
                    placeholder={valueInputPlaceholder}
                    margin="dense"
                    label="Value of this node"
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
                  <FormLabel>Suggested values:</FormLabel>
                  <div>
                    {templateNodeTypesAndValues[updateTypeInputValue].map((nodeValue) => (
                      <Chip
                        key={nodeValue}
                        label={nodeValue}
                        className={classes.suggestionChip}
                        onClick={() => handleUpdateNodeValueChange(nodeValue)}
                      />
                    ))}
                  </div>
                </div>
            )}
          </>
        )}
        {showDrawerSections.editFinalNodeField
          && isSelectedNodeEditable
          && (
          <>
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Edit node editability:</Typography>
            </div>
            <div className={classes.drawerField}>
              <div>
                <FormGroup row>
                  <FormGroup>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isSelectedNodeEditable.delete}
                          onClick={handleSelectedNodeEditableDeleteChange}
                          name="editableDelete"
                          color="primary"
                        />
                      )}
                      label="Delete"
                    />
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isSelectedNodeEditable.type}
                          onClick={handleSelectedNodeEditableTypeChange}
                          name="editableType"
                          color="primary"
                        />
                      )}
                      label="Type Label"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isSelectedNodeEditable.label}
                          onClick={handleSelectedNodeEditableLabelChange}
                          name="editableLabel"
                          color="primary"
                        />
                      )}
                      label="Structure"
                    />
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isSelectedNodeEditable.value}
                          onClick={handleSelectedNodeEditableValueChange}
                          name="editableValue"
                          color="primary"
                        />
                      )}
                      label="Value Label"
                    />
                  </FormGroup>
                </FormGroup>
              </div>
            </div>
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
    editLabelField: PropTypes.bool,
    editValueField: PropTypes.bool,
    editTypeField: PropTypes.bool,
    editFinalNodeField: PropTypes.bool,
  }),
  toggleIsCreatingNode: PropTypes.func,
  handleUpdateLabelPiecesChange: PropTypes.func,
  handleUpdateNodeTypeChange: PropTypes.func,
  handleUpdateNodeValueChange: PropTypes.func,
  handleSelectedNodeEditableLabelChange: PropTypes.func,
  handleSelectedNodeEditableDeleteChange: PropTypes.func,
  handleSelectedNodeEditableTypeChange: PropTypes.func,
  handleSelectedNodeEditableValueChange: PropTypes.func,

  isDrawerOpen: PropTypes.bool,
  isCreatingNode: PropTypes.bool,
  isSelectedNodeEditable: PropTypes.shape({
    label: PropTypes.bool,
    type: PropTypes.bool,
    value: PropTypes.bool,
    delete: PropTypes.bool,
  }),

  createNodeInputPlaceholder: PropTypes.string,
  editNodeInputPlaceholder: PropTypes.string,
  typeInputPlaceholder: PropTypes.string,
  valueInputPlaceholder: PropTypes.string,

  createNodeDescription: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    pieces: PropTypes.arrayOf(PropTypes.string),
    piecesPosition: PropTypes.arrayOf(PropTypes.number),
    type: PropTypes.string,
    value: PropTypes.string,
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
    editLabelField: true,
    editValueField: true,
    editTypeField: true,
    editFinalNodeField: false,
  },
  isSelectedNodeEditable: undefined,
  handleUpdateLabelPiecesChange: () => {},
  handleUpdateNodeTypeChange: () => {},
  handleUpdateNodeValueChange: () => {},
  handleSelectedNodeEditableLabelChange: () => {},
  handleSelectedNodeEditableDeleteChange: () => {},
  handleSelectedNodeEditableTypeChange: () => {},
  handleSelectedNodeEditableValueChange: () => {},
  toggleIsCreatingNode: () => {},

  isDrawerOpen: true,
  isCreatingNode: false,
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

  createNodeInputPlaceholder: null,
  editNodeInputPlaceholder: null,
  typeInputPlaceholder: 'String, str, ...',
  valueInputPlaceholder: '42, "Hello World", ...',
};

export default EditorDrawer;
