import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

export default function PathTree({ value, data = [], onChange }) {
  const handleChange = (data, val) => {
    if (val !== value) {
      onChange &&
        onChange({
          value: val,
        });
    }
  };
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.path}
      nodeId={nodes.path}
      label={nodes.name}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <TreeView
      className="sq-path-tree"
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleChange}
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {renderTree(data)}
    </TreeView>
  );
}
