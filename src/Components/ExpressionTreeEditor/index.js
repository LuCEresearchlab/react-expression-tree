import { connect } from "react-redux";
import ExpressionTreeEditor from "./ExpressionTreeEditor";
import * as actions from "../../store/actions";

const mapStateToProps = state => ({
  nodes: state.nodes,
  edges: state.edges,
  nodePositions: state.nodePositions,
  dragEdge: state.dragEdge,
  selectedNode: state.selectedNode,
});

export default connect(mapStateToProps, actions)(ExpressionTreeEditor);
