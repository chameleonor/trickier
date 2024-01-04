import React, { useState, useEffect } from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import axios from 'axios';

const CustomTreeView = () => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/items'); // Substitua pela rota correta da sua API
        const items = response.data;
        
        // Organize os itens em uma estrutura de árvore aninhada
        const createTree = (parentId) => {
          return items
            .filter((item) => item.parentId === parentId)
            .map((item) => {
              return {
                ...item,
                children: createTree(item._id)
              };
            });
        };

        const tree = createTree(null);

        setTreeData(tree);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes._id}
      nodeId={nodes._id}
      label={nodes.name}
      endIcon={<div>{nodes.type === 'folder' ? 'Folder' : 'File'}</div>} // Exiba 'Folder' ou 'File' com base no tipo
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {treeData.map((node) => renderTree(node))}
    </TreeView>
  );
};

export default CustomTreeView;
