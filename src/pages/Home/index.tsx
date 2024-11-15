import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { fileDataState } from '../../recoil/atoms/fileDataState';
import { FileList } from '../../types/fileType';
import * as S from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaRegTrashCan } from 'react-icons/fa6';
import { faCheck, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import updateDate from '../../utils/updateDate';
import {
  Wrapper,
  MainTitle,
  TitlePadding,
  CheckBox,
  DeleteButton,
  BaseBox,
} from '../../styles/common';
import NoData from '../../components/NoData';
import { useState } from 'react';

const Home = () => {
  const [fileData, setFileData] = useRecoilState(fileDataState);
  const [hoverFile, setHoverFile] = useState(-1);
  const [selectFiles, setSelectFiles] = useState<string[]>([]);

  const navigate = useNavigate();

  const updatedDate = updateDate();

  const hadleAddNewFile = () => {
    addNewFile();
    navigate(`/editor/${updatedDate}`);
  };

  const handleOpenFile = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleMouseOver = (index: number) => {
    setHoverFile(index);
  };

  const handleMouseOut = () => {
    setHoverFile(-1);
  };

  const handleSelectFile = (id: string) => {
    setSelectFiles((prevFiles) => {
      if (!prevFiles.includes(id)) {
        return [...prevFiles, id];
      } else {
        return prevFiles.filter((item) => item !== id);
      }
    });
  };

  const handleToggleAllFile = () => {
    //파일이 전체 선택되어있을 경우 파일 전체 해제
    if (selectFiles.length === fileData.length && selectFiles.length) {
      return setSelectFiles([]);
    }

    const addFiles = fileData
      .filter((file) => !selectFiles.includes(file.id))
      .map((file) => file.id);

    if (addFiles.length === 0) {
      // 추가할 파일이 없을 경우 리턴
      return;
    }

    setSelectFiles((prevFiles) => [...prevFiles, ...addFiles]);
  };

  function addNewFile() {
    const newFileData = {
      id: updatedDate,
      fileName: '이름이 없는 파일',
      updatedDate,
      tree: {
        value: '',
        node: 0,
        level: 0,
        position: { x: 0, y: 0, r: 0, t: 0 },
        parentNode: {
          node: -1,
          position: { x: 0, y: 0, r: 0, t: 0 },
        },
        leftChildNode: [],
        rightChildNode: [],
      },
    };

    setFileData((prevFileData: FileList[]) => [...prevFileData, newFileData]);
  }

  return (
    <Wrapper>
      <TitlePadding>
        <MainTitle>홈페이지</MainTitle>
      </TitlePadding>

      <S.NewFileFrame onClick={hadleAddNewFile}>
        <FontAwesomeIcon icon={faFolderPlus} />
        <p>Create new file</p>
      </S.NewFileFrame>

      <S.FileSection>
        <S.TitleContent>
          <MainTitle>최근 열기</MainTitle>
          <BaseBox>파일 ({fileData.length})</BaseBox>
        </S.TitleContent>
        <S.DeleteContent>
          <CheckBox
            $hover={true}
            $active={
              fileData.length === selectFiles.length && selectFiles.length > 0
            }
            onClick={handleToggleAllFile}
          >
            <FontAwesomeIcon icon={faCheck} />
          </CheckBox>
          <DeleteButton>
            <FaRegTrashCan />
            최근 열기에서 제거
          </DeleteButton>
        </S.DeleteContent>

        {fileData.length === 0 ? (
          <NoData />
        ) : (
          <S.FileContent>
            {fileData.map((item, index) => (
              <S.FileFrame
                key={index}
                $active={selectFiles.includes(item.id)}
                onClick={() => handleOpenFile(item.id)}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={handleMouseOut}
              >
                <CheckBox
                  $hover={hoverFile === index}
                  $active={selectFiles.includes(item.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectFile(item.id);
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </CheckBox>
                <S.FileImg></S.FileImg>
                <S.FileDes>
                  <p>{item.fileName}</p>
                  <span>{item.updatedDate} 마지막으로 수정</span>
                </S.FileDes>
              </S.FileFrame>
            ))}
          </S.FileContent>
        )}
      </S.FileSection>
    </Wrapper>
  );
};

export default Home;
