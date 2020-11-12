import { connect } from "react-redux";
import StageDrawer from "./StageDrawer";
import * as actions from "../../store/actions";

const mapStateToProps = state => ({
  selectedNode: state.editor.present.selectedNode,
  addingNode: state.drawer.addingNode,
  isAddEmpty: state.drawer.addValue.length < 1,
  editValue: state.drawer.editValue,
  isEditEmpty: state.drawer.editValue.length < 1,
  typeValue: state.drawer.typeValue,
  rootTypeValue: state.editor.present.rootTypeValue,
  selectedEdge: state.editor.present.selectedEdge,
  nodes: state.editor.present.nodes,
  edges: state.editor.present.edges,
  canUndo: state.editor.past.length > 0,
  canRedo: state.editor.future.length > 0,
  selectedRootNode: state.editor.present.selectedRootNode,
});

export default connect(mapStateToProps, actions)(StageDrawer);
