import { useState } from 'react';

import {
  DirectionNodeContainer,
  Node,
  MainTopicInput,
  ContentInput,
  ButtonWrapper,
  Button,
  NodeLine,
} from '../../../styles/NodeCommon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import nodeLineProps from '../../../utils/nodeLineProps';
import { GeneralNode, RootNode } from '../../../types/fileType';

type NodeRenderProps = {
  node: GeneralNode;
  updateNodeInputValue: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    targetNode: RootNode | GeneralNode,
    side: string
  ) => void;
  addNode: (targetNode: number, side: string) => void;
  deleteNode: (targetNode: number, side: string) => void;
};

const LeftNodeRender = ({
  node,
  updateNodeInputValue,
  addNode,
  deleteNode,
}: NodeRenderProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleAddChild = () => {
    addNode(node.node, 'left');
  };

  const handleDeleteChild = () => {
    deleteNode(node.node, 'left');
  };

  const lineProps = nodeLineProps(node);

  const leftChildNodeRender = node.childNode.map((child) => {
    return (
      <LeftNodeRender
        key={child.node}
        node={child as GeneralNode}
        addNode={addNode}
        updateNodeInputValue={updateNodeInputValue}
        deleteNode={deleteNode}
      />
    );
  });

  return (
    <DirectionNodeContainer $side={'left'}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: '50px',
        }}
      >
        <Node
          id={node.node.toString()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isHovered && (
            <ButtonWrapper>
              <Button
                onClick={handleAddChild}
                style={{ right: '-4rem' }}
                $size={2.6}
                $color={'var(--color-blue)'}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <Button
                onClick={handleDeleteChild}
                style={{ right: '-1rem' }}
                $size={2}
                $color={'var(--color-red)'}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
            </ButtonWrapper>
          )}
          {node.level === 1 ? (
            <MainTopicInput
              rows={1}
              onChange={(e) => updateNodeInputValue(e, node, 'left')}
              value={node.value}
              placeholder="브랜치 주제를 입력해주세요"
            />
          ) : (
            <ContentInput
              rows={1}
              onChange={(e) => updateNodeInputValue(e, node, 'left')}
              value={node.value}
              placeholder="내용을 입력해주세요"
            />
          )}
          {node.node > 0 && <NodeLine {...lineProps} $direction={'left'} />}
        </Node>
      </div>

      {node.childNode.length > 0 && <div>{leftChildNodeRender}</div>}
    </DirectionNodeContainer>
  );
};

export default LeftNodeRender;