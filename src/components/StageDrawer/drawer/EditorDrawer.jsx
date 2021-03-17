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
  UpdateRounded,
} from '@material-ui/icons';

// Width of the side drawer
const drawerWidth = 300;

// Top bar and side drawer styles
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    position: 'absolute',
    top: '50px',
    maxHeight: '92%',
    overflowY: 'auto',
    marginLeft: '1px',
    // border: '1px solid black',
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
  editText: {
    margin: '10px 0 10px 10px',
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
  typeField: {
    margin: '10px 10px 10px 10px',
  },
  typeButtonContainer: {
    maxHeight: '150px',
    overflowY: 'scroll',
    borderRadius: '3px',
    marginTop: '10px',
    paddingTop: '10px',
    padding: '5px 20px 5px 20px',
    boxShadow: '0 0 1px 1px #ddd',
  },
  typeButton: {
    marginRight: '30px',
    textTransform: 'none',
    fontFamily: 'monospace',
  },
}));

function EditorDrawer({
  containerRef,
  connectorPlaceholder,
  showDrawerSections,
  toggleIsCreatingNode,
  templateNodes,
  handleEditLabelPiecesChange,
  handleEditNodeTypeChange,
  handleEditNodeValueChange,
  allowFreeTypeEdit,
  allowFreeValueEdit,
  templateNodeTypesAndValues,
  isDrawerOpen,
  isCreatingNode,
  isSelectedNodeEditable,
  createNodeInputValue,
  editLabelInputValue,
  editTypeInputValue,
  editValueInputValue,
  setCreateNodeInputValue,
  setEditLabelInputValue,
}) {
  const classes = useStyles();

  const [addAnchorEl, setAddAnchorEl] = useState(null);
  const isAddInfoOpen = !!addAnchorEl;
  const [editAnchorEl, setEditAnchorEl] = useState(null);
  const isEditInfoOpen = !!editAnchorEl;

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
      <div>
        {showDrawerSections.addNodeField && (
          <>
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Create a new node:</Typography>
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
                    Describe the node pieces in the textfield below. Holes are
                    represented by the special
                    {' '}
                    {connectorPlaceholder}
                    {' '}
                    character
                    combination. Alternatively you can choose a template node
                    from the list below.
                  </Typography>
                </Popover>
              </div>
            </div>
            <div className={classes.drawerField}>
              <TextField
                id="addField"
                type="search"
                variant="outlined"
                fullWidth
                size="medium"
                label="Insert the node's pieces"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={
                  `ex: ${
                    connectorPlaceholder
                  }.append(${
                    connectorPlaceholder
                  })`
                }
                margin="dense"
                value={createNodeInputValue}
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
                      Or select a template node:
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
        {showDrawerSections.editLabelField && isSelectedNodeEditable.label && (
          <>
            <div className={classes.drawerInfo}>
              <Typography variant="h6">Edit an existing node:</Typography>
              <div>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => setEditAnchorEl(e.target)}
                >
                  <InfoOutlined />
                </IconButton>
                <Popover
                  className={classes.infoPopover}
                  anchorEl={editAnchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={isEditInfoOpen}
                  onClose={() => setEditAnchorEl(null)}
                >
                  <Typography
                    className={classes.infoPopoverText}
                    variant="body2"
                  >
                    Describe the node pieces in the textfield below. Holes are
                    represented by the special
                    {' '}
                    {connectorPlaceholder}
                    {' '}
                    character
                    combination. Final nodes cannot be modified or removed.
                  </Typography>
                </Popover>
              </div>
            </div>
            <div className={classes.drawerField}>
              <TextField
                id="editField"
                variant="outlined"
                type="search"
                fullWidth
                size="medium"
                label="Insert the node's label"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={
                  `ex: ${
                    connectorPlaceholder
                  }.append(${
                    connectorPlaceholder
                  })`
                }
                value={editLabelInputValue}
                margin="dense"
                onChange={(e) => setEditLabelInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEditLabelPiecesChange(e.target.value);
                  }
                }}
              />
              <div>
                <Tooltip title="Update node pieces" placement="top">
                  <span>
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={handleEditLabelPiecesChange}
                    >
                      <UpdateRounded />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>
          </>
        )}
        {showDrawerSections.editTypeField && isSelectedNodeEditable.type && (
          <>
            <div className={classes.drawerField}>
              {/* <Typography variant="h6">Edit the type:</Typography> */}
              {allowFreeTypeEdit && (
                <>
                  <TextField
                    id="typeField"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    placeholder="ex: 1234567890"
                    margin="dense"
                    label="Insert the node's type"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="off"
                    value={editTypeInputValue}
                    onChange={(e) => handleEditNodeTypeChange(e.target.value)}
                  />
                </>
              )}
            </div>

            {templateNodeTypesAndValues && (
              <div className={classes.typeField}>
                <FormLabel>Suggested types:</FormLabel>
                <div>
                  {Object.keys(templateNodeTypesAndValues).map((nodeType) => (
                    <Button
                      key={nodeType}
                      className={classes.typeButton}
                      onClick={() => handleEditNodeTypeChange(nodeType)}
                    >
                      {nodeType}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {showDrawerSections.editValueField && isSelectedNodeEditable.value && (
          <>
            <div className={classes.drawerField}>
              {/* <Typography variant="h6">Edit the type:</Typography> */}
              {allowFreeValueEdit && (
                <>
                  <TextField
                    id="valueField"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    placeholder="ex: 1234567890"
                    margin="dense"
                    label="Insert the node's value"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="off"
                    value={editValueInputValue}
                    onChange={(e) => handleEditNodeValueChange(e.target.value)}
                  />
                </>
              )}
            </div>

            {templateNodeTypesAndValues
              && templateNodeTypesAndValues[editTypeInputValue]
              && templateNodeTypesAndValues[editTypeInputValue].length > 0 && (
                <div className={classes.typeField}>
                  <FormLabel>Suggested values:</FormLabel>
                  <div>
                    {templateNodeTypesAndValues[editTypeInputValue].map((nodeValue) => (
                      <Button
                        key={nodeValue}
                        className={classes.typeButton}
                        onClick={() => handleEditNodeValueChange(nodeValue)}
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
  allowFreeTypeEdit: PropTypes.bool,
  allowFreeValueEdit: PropTypes.bool,
  templateNodeTypesAndValues: PropTypes.shape({}),
  showDrawerSections: PropTypes.shape({
    addNodeField: PropTypes.bool,
    templateDropdown: PropTypes.bool,
    editLabelField: PropTypes.bool,
    editValueField: PropTypes.bool,
    editTypeField: PropTypes.bool,
  }),
  toggleIsCreatingNode: PropTypes.func,
  handleEditLabelPiecesChange: PropTypes.func,
  handleEditNodeTypeChange: PropTypes.func,
  handleEditNodeValueChange: PropTypes.func,

  isDrawerOpen: PropTypes.bool,
  isCreatingNode: PropTypes.bool,
  isSelectedNodeEditable: PropTypes.bool,

  createNodeInputValue: PropTypes.string,
  editLabelInputValue: PropTypes.string,
  editTypeInputValue: PropTypes.string,
  editValueInputValue: PropTypes.string,
  setCreateNodeInputValue: PropTypes.func,
  setEditLabelInputValue: PropTypes.func,
};

EditorDrawer.defaultProps = {
  connectorPlaceholder: '{{}}',
  templateNodes: undefined,
  allowFreeTypeEdit: true,
  allowFreeValueEdit: true,
  templateNodeTypesAndValues: undefined,
  showDrawerSections: {
    addNodeField: true,
    templateDropdown: true,
    editLabelField: true,
    editValueField: true,
    editTypeField: true,
  },
  handleEditLabelPiecesChange: () => {},
  handleEditNodeTypeChange: () => {},
  handleEditNodeValueChange: () => {},
  toggleIsCreatingNode: () => {},

  isDrawerOpen: true,
  isCreatingNode: false,
  isSelectedNodeEditable: {
    label: false,
    type: false,
    value: false,
  },
  createNodeInputValue: '',
  editLabelInputValue: '',
  editTypeInputValue: '',
  editValueInputValue: '',
  setEditLabelInputValue: () => {},
  setCreateNodeInputValue: () => {},
};

export default EditorDrawer;
