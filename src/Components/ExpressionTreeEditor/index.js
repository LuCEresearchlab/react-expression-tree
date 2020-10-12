import { connect } from "react-redux";
import ExpressionTreeEditor from "./ExpressionTreeEditor";
import * as actions from "../../store/actions";

const mapStateToProps = state => ({
  nodes: state.editor.nodes,
  edges: state.editor.edges,
  nodePositions: state.editor.nodePositions,
  dragEdge: state.editor.dragEdge,
  selectedNode: state.editor.selectedNode,
  addingNode: state.drawer.addingNode,
  addValue: state.drawer.addValue,
  selectedEdge: state.editor.selectedEdge,
});

export default connect(mapStateToProps, actions)(ExpressionTreeEditor);
