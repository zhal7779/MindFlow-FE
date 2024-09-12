import React, { useState } from "react";

import {
  DirectionNodeContainer,
  Node,
  MainTopicInput,
  ContentInput,
  ButtonWrapper,
  Button,
  NodeLine,
} from "../../styles/NodeCommon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const RightNodeRender = (props) => {
  const { node, addNode, updateNodeInputValue, deleteNode } = props;
  // console.log(node);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleAddChild = () => {
    addNode(node.node, "right");
  };

  const handleDeleteNode = () => {
    deleteNode(node.node, "right");
  };

  const { x: x1, y: y1 } = node.parentNode.position;

  const {
    x: x2,
    y: y2,
    r: r2,
    t: t2,
  } = node.position || { x: 0, y: 0, r: 0, t: 0 };

  const lineProps = {
    $top: t2,
    $right: r2,
    $width: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
    $angle: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
  };

  const rightChildNodeRender = node.childNode.map((child) => (
    <RightNodeRender
      key={child.node}
      node={child}
      addNode={addNode}
      updateNodeInputValue={updateNodeInputValue}
      deleteNode={deleteNode}
    />
  ));

  return (
    <DirectionNodeContainer $side={"right"}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          marginLeft: "50px",
        }}
      >
        <Node
          id={node.node}
          $level={node.level}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isHovered && (
            <ButtonWrapper>
              <Button
                onClick={() => handleDeleteNode("right")}
                style={{ right: "-1rem" }}
                $size={2}
                $color={"var(--color-red)"}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <Button
                onClick={handleAddChild}
                style={{ right: "-4rem" }}
                $size={2.6}
                $color={"var(--color-blue)"}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </ButtonWrapper>
          )}
          {node.level === 1 ? (
            <MainTopicInput
              rows={1}
              onChange={(e) => updateNodeInputValue(e, node, "right")}
              value={node.value}
              placeholder="브랜치 주제를 입력해주세요"
            />
          ) : (
            <ContentInput
              rows={1}
              onChange={(e) => updateNodeInputValue(e, node, "right")}
              value={node.value}
              placeholder="내용을 입력해주세요"
            />
          )}
          {node.node > 0 && <NodeLine {...lineProps} />}
        </Node>
      </div>

      {node.childNode.length > 0 && <div>{rightChildNodeRender}</div>}
    </DirectionNodeContainer>
  );
};

export default RightNodeRender;
