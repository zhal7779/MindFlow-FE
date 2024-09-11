import React, { useEffect, useRef, useState } from "react";
import NodeRender from "../NodeRender";
import positionCalculate from "../../utils/positionCalculate";
import LeftNodeRender from "../LeftNodeRender";
import RootNodeRender from "../RootNodeRender";
import { NodeContainer } from "../NodeRender/styles";

// 필요한 작업
// 1. 노드 연결 선 곡선으로 변경 필요 (지금처럼 삼각형이 아닌 원형을 계산해서 해야함)
// 2. 곡선 작업 때문에 svg로 변경 필요
// 3. 노드 비율이 100%가 아닐 경우에도 선 길이 유지 필요
// 4. 기타 기능 구현
// 마지막.  노드 추가시 선 깜빡임 디버깅

const MindMapTree = () => {
  const [tree, setTree] = useState({
    value: "",
    node: 0,
    level: 0,
    position: { x: 0, y: 0, r: 0, t: 0 },
    parentNode: {
      node: -1,
      position: { x: 0, y: 0, r: 0, t: 0 },
    },
    leftChildNode: [],
    rightChildNode: [],
  });

  const [nodeNumber, setNodeNumber] = useState(1);
  const treeRef = useRef(null);
  const treeChangedRef = useRef(true);

  // 왼쪽 자식 노드가 생성되거나 변경된 것을 감지
  useEffect(() => {
    if (tree.leftChildNode.length > 0 && treeChangedRef.current) {
      updateTreeWithNodePositions(treeRef, setTree, "left");
      treeChangedRef.current = false;
    }
  }, [tree.leftChildNode]);

  // 오른쪽 자식 노드가 생성되거나 변경된 것을 감지
  useEffect(() => {
    if (tree.rightChildNode.length > 0 && treeChangedRef.current) {
      updateTreeWithNodePositions(treeRef, setTree, "right");
      treeChangedRef.current = false;
    }
  }, [tree.rightChildNode]);

  //노드 추가
  const addNode = (targetNode, side) => {
    const updateTree = (curNode, level) => {
      // 목표 노드에 도달하면 새 노드를 추가
      if (curNode.node === targetNode) {
        treeChangedRef.current = true;
        const newNode = {
          value: "",
          level,
          side,
          node: nodeNumber,
          position: { x: 0, y: 0, r: 0, t: 0 },
          parentNode: {
            node: curNode.node,
            position: curNode.position,
          },
          childNode: [],
        };

        // 새 노드를 추가할 위치에 따라 추가
        if (targetNode === 0 && side === "left") {
          return {
            ...curNode,
            leftChildNode: [...(curNode.leftChildNode || []), newNode],
          };
        } else if (targetNode === 0 && side === "right") {
          return {
            ...curNode,
            rightChildNode: [...(curNode.rightChildNode || []), newNode],
          };
        }

        // 루트 노드를 제외하고 일반 노드에는 childNode에 새로운 노드 추가
        return {
          ...curNode,
          childNode: [...curNode.childNode, newNode],
        };
      }

      // 탐색할 방향을 결정하고 그 쪽으로만 재귀 호출
      if (side === "left" && curNode.leftChildNode && level < 2) {
        return {
          ...curNode,
          leftChildNode: curNode.leftChildNode.map((leftChild) =>
            updateTree(leftChild, level + 1)
          ),
        };
      } else if (side === "right" && curNode.rightChildNode && level < 2) {
        return {
          ...curNode,
          rightChildNode: curNode.rightChildNode.map((rightChild) =>
            updateTree(rightChild, level + 1)
          ),
        };
      }

      // 루트 노드를 제외하고는 childNode를 순회
      return {
        ...curNode,
        childNode: curNode.childNode.map((child) =>
          updateTree(child, level + 1)
        ),
      };
    };

    // 트리 상태를 업데이트하고, 노드 번호 증가
    setTree((prevTree) => updateTree(prevTree, 1));
    setNodeNumber((prevNumber) => prevNumber + 1);
  };

  //노드 삭제
  const deleteNode = (targetNode, side) => {
    // 루트 노드에서 삭제할 경우 방향에 따라 빈 배열로 먼저 리턴
    if (targetNode === 0 && side === "left") {
      return setTree((prevTree) => ({ ...prevTree, leftChildNode: [] }));
    } else if (targetNode === 0 && side === "right") {
      return setTree((prevTree) => ({ ...prevTree, rightChildNode: [] }));
    }

    const updateTree = (tree) => {
      if (tree.node === targetNode) {
        treeChangedRef.current = true;
        if (tree.childNode.length > 0) {
          //자식 노드가 있다면 자식 노드들을 삭제
          return { ...tree, childNode: [] };
        }

        return null; // 자식 노드가 없으면 자기 자신을 삭제
      }

      // 탐색할 방향을 결정하고 그 쪽으로만 재귀 호출

      if (tree.level === 0 && side === "left") {
        return {
          ...tree,
          leftChildNode: tree.leftChildNode
            .map((leftChild) => updateTree(leftChild))
            .filter((leftChild) => leftChild !== null), // 재귀가 끝나면 자기 자신을 삭제한 노드는 제거
        };
      } else if (tree.level === 0 && side === "right") {
        return {
          ...tree,
          rightChildNode: tree.rightChildNode
            .map((rightChild) => updateTree(rightChild))
            .filter((rightChild) => rightChild !== null),
        };
      }

      // 루트 노드를 제외하고는 childNode를 순회
      const updatedChildren = tree.childNode
        .map((child) => updateTree(child))
        .filter((child) => child !== null);

      return { ...tree, childNode: updatedChildren };
    };

    setTree((prevTree) => updateTree(prevTree));
  };

  //노드의 값 업데이트
  const updateNodeInputValue = (event, targetNode, side) => {
    const updateTree = (curNode) => {
      if (curNode.node === targetNode.node) {
        //  목표 노드에 도달하면 value 업데이트 및 해당 요소의 높이 변경
        const target = event.target;
        const { value } = target;

        const prevTargetHeight = target.offsetHeight;
        const updateTargetHeight = target.scrollHeight + 9;

        // textarea입력으로 높이 변경될 경우 트리 전체의 선 길이 및 곡선을 업데이트
        if (prevTargetHeight < updateTargetHeight) {
          target.style.height = "auto";
          target.style.height = target.scrollHeight - 40 + "px";

          treeChangedRef.current = true;
        }

        // value 업데이트
        return { ...curNode, value };
      }

      // 탐색할 방향을 결정하고 그 쪽으로만 재귀 호출
      if (curNode.level === 0 && side === "left") {
        return {
          ...curNode,
          leftChildNode: curNode.leftChildNode.map((child) =>
            updateTree(child)
          ),
        };
      } else if (curNode.level === 0 && side === "right") {
        return {
          ...curNode,
          rightChildNode: curNode.rightChildNode.map((child) =>
            updateTree(child)
          ),
        };
      }
      // 루트 노드를 제외하고는 childNode를 순회
      return {
        ...curNode,
        childNode: curNode.childNode.map((child) => updateTree(child)),
      };
    };

    setTree((prevTree) => updateTree(prevTree));
  };

  // 노드 포지션 업데이트
  const updateNodePosition = (
    node,
    nodeId,
    curPosition,
    parentPosition,
    side
  ) => {
    if (node.node === parseInt(nodeId)) {
      const { position: prevPosition } = node;
      if (
        prevPosition.x !== curPosition.x ||
        prevPosition.y !== curPosition.y
      ) {
        return {
          ...node,
          parentNode: {
            ...node.parentNode,
            position: parentPosition,
          },
          position: curPosition,
        };
      }
    }
    const parentNodePosition = node.position;

    if (node.level === 0 && side === "left") {
      return {
        ...node,
        leftChildNode: node.leftChildNode.map((leftChild) =>
          updateNodePosition(leftChild, nodeId, curPosition, parentNodePosition)
        ),
      };
    } else if (node.level === 0 && side === "right") {
      return {
        ...node,
        rightChildNode: node.rightChildNode.map((rightChild) =>
          updateNodePosition(
            rightChild,
            nodeId,
            curPosition,
            parentNodePosition
          )
        ),
      };
    }
    if (node.childNode) {
      return {
        ...node,
        childNode: node.childNode.map((child) =>
          updateNodePosition(child, nodeId, curPosition, parentNodePosition)
        ),
      };
    }
    return node;
  };

  const updateTreeWithNodePositions = (treeRef, setTree, side) => {
    const treePositionRecursion = (nodeRef) => {
      if (!nodeRef.children) {
        return;
      }

      const currentPosition = positionCalculate(nodeRef);

      if (side === "left") {
        setTree((prevTree) =>
          updateNodePosition(
            prevTree,
            nodeRef.id,
            currentPosition,
            tree.position,
            "left"
          )
        );
      } else {
        setTree((prevTree) =>
          updateNodePosition(
            prevTree,
            nodeRef.id,
            currentPosition,
            tree.position,
            "right"
          )
        );
      }

      Array.from(nodeRef.children).forEach((child) => {
        treePositionRecursion(child);
      });
    };

    if (treeRef.current) {
      treePositionRecursion(treeRef.current);
    }
  };
  console.log(tree);
  {
    /* <NodeRender
        node={tree}
        addNode={addNode}
        updateNodeInputValue={updateNodeInputValue}
        deleteNode={deleteNode}
        ref={treeRef}
      /> */
  }
  return (
    <NodeContainer ref={treeRef} $side={undefined} $isRoot={true}>
      <div id={"leftChildren"}>
        {tree.leftChildNode.length > 0 &&
          tree.leftChildNode.map((leftNode) => (
            <LeftNodeRender
              node={leftNode}
              addNode={addNode}
              updateNodeInputValue={updateNodeInputValue}
              deleteNode={deleteNode}
            />
          ))}
      </div>
      <RootNodeRender
        tree={tree}
        addNode={addNode}
        deleteNode={deleteNode}
        updateNodeInputValue={updateNodeInputValue}
      />
      <div id={"rightChildren"}></div>
    </NodeContainer>
  );
};

export default MindMapTree;
