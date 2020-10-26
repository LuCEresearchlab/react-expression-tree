import { connect } from "react-redux";
import StageDrawer from "./StageDrawer";
import * as actions from "../../store/actions";

const mapStateToProps = state => ({
  selectedNode: state.editor.present.selectedNode,
  addingNode: state.drawer.addingNode,
  selectedEdge: state.editor.present.selectedEdge,
  nodes: state.editor.present.nodes,
  edges: state.editor.present.edges,
  canUndo: state.editor.past.length > 0,
  canRedo: state.editor.future.length > 0,
  selectedRootNode: state.editor.present.selectedRootNode,
});

export default connect(mapStateToProps, actions)(StageDrawer);
