import { connect } from 'react-redux';
import ExpressionTreeEditor from './ExpressionTreeEditor';
import * as actions from '../store/actions';

const mapStateToProps = (state) => ({
  nodes: state.editor.present.nodes,
  edges: state.editor.present.edges,
  dragEdge: state.editor.present.dragEdge,
  selectedNode: state.editor.present.selectedNode,
  addingNode: state.drawer.addingNode,
  addValue: state.drawer.addValue,
  selectedEdge: state.editor.present.selectedEdge,
  selectedRootNode: state.editor.present.selectedRootNode,
});

export default connect(mapStateToProps, actions)(ExpressionTreeEditor);
