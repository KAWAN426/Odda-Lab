import styled from 'styled-components'
import SVG_plus from "../../svg/plus.svg"
import SVG_arrow_right from "../../svg/arrow-right.svg"
import SVG_cross from "../../svg/cross.svg"
import SVG_pencil from "../../svg/pencil.svg"
import { useState, useEffect, ChangeEvent } from 'react'
import { cropImage } from '../../lib/image'
import Image from 'next/image'
import { getCompUID } from '../../lib/randomString'
import CreateObjModal from "../../components/create/createObjModal"

interface IPostData {
  id: string,
  title: string,
  makerId: string,
  objects: { id: string, name: string, img: string | { id: string, url: string } }[],
  imageFile: FormData[],
  start: string[],
  combine: string[],
  combinate: string[][],
  background: string,
  sound: string
}

const temp: IPostData = {
  id: "0",
  title: "이상한 실험실",
  makerId: "0",
  objects: [
    {
      id: "a0",
      name: "물",
      img: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F244B0939537624F506"
    },
    {
      id: "a1",
      name: "불",
      img: "https://media.istockphoto.com/id/1323529010/ko/%EB%B2%A1%ED%84%B0/%EC%A0%88%EC%97%B0%EB%90%9C-%ED%99%94%EC%9E%AC-%EB%B2%A1%ED%84%B0.jpg?s=612x612&w=0&k=20&c=W5Vw8QImatJTlzwtBYj48aglJrOZuv0YP-tZ6TStqnc="
    },
    {
      id: "a2",
      name: "수증기",
      img: "https://previews.123rf.com/images/rigamondis/rigamondis1111/rigamondis111100015/11317989-%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C%EC%9D%98-%ED%95%98%EB%8A%98%EB%A1%9C-%EC%8A%A4%ED%8C%80%EA%B3%BC-%EC%88%98%EC%A6%9D%EA%B8%B0%EA%B0%80%EC%9E%88%EB%8A%94-%ED%81%B0-%EC%86%94%ED%8C%8C-%ED%83%80%EB%9D%BC.jpg"
    },
    {
      id: "a3",
      name: "숨겨진 요소",
      img: "https://previews.123rf.com/images/rigamondis/rigamondis1111/rigamondis111100015/11317989-%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C%EC%9D%98-%ED%95%98%EB%8A%98%EB%A1%9C-%EC%8A%A4%ED%8C%80%EA%B3%BC-%EC%88%98%EC%A6%9D%EA%B8%B0%EA%B0%80%EC%9E%88%EB%8A%94-%ED%81%B0-%EC%86%94%ED%8C%8C-%ED%83%80%EB%9D%BC.jpg"
    }
  ],
  imageFile: [],
  start: ["a0", "a1"],
  combine: ["a2", "a3"],
  combinate: [
    ["a0", "a1", "a2"]
  ],
  background: "/image.jpg",
  sound: "url"
}

export default function Create() {
  const [datas, setDatas] = useState(temp);
  const [selectObj, setSelectObj] = useState<string>()
  const [newObjModal, setNewObjModal] = useState<"start" | "combine" | undefined>()
  const [displayImg, setDisplayImg] = useState<string>()

  const objImgProps = (data: string) => ({
    id: data,
    onClick: handleOnClick,
    size: selectObj === data ? "65" : "55",
    // style: { boxShadow: selectObj === data ? "0px 0px 12px 6px rgba(255, 255, 255, 0.7)" : "" },
    border: selectObj === data ? "2px solid white" : "",
    img: findObjValueById(data, "img") ?? "",
  })

  const handleOnClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    setSelectObj(target.id)
  }

  const findObjValueById = (id: string | undefined, value: "img" | "id" | "name"): string | undefined => {
    const data = datas.objects.find(value => id === value.id)
    if (!data) return { id: undefined, name: "?", img: undefined }[value]
    const dataInVal = data[value]
    if (typeof dataInVal === "string") return dataInVal
    return dataInVal.url
  }

  const handleCombine = (key: number, kind: 0 | 1 | 2) => {
    if (!selectObj) return;
    const newData: IPostData = JSON.parse(JSON.stringify(datas))
    const combinate = newData.combinate[key]
    let isSame = false
    newData.combinate[key][kind] = selectObj
    if ((combinate[0] === combinate[2] || combinate[1] === combinate[2]) && (combinate[2] !== "")) {
      return alert("재료 오브젝트를 결과 오브젝트로 설정 할 수 없습니다.");
    }
    newData.combinate.forEach((combine, combKey) => {
      if (key === combKey) return;
      const same1 = combine[0] === combinate[0] && combine[1] === combinate[1]
      const same2 = combine[0] === combinate[1] && combine[1] === combinate[0]
      const same3 = combine[1] === combinate[0] && combine[0] === combinate[1]
      if (same1 || same2 || same3) isSame = true;
    })
    if (isSame) return alert("다른 조합과 식이 동일거나 위치만 다릅니다.");
    setDatas(newData)
    setSelectObj(undefined)
  }

  return (
    <Container onClick={(e: MouseEvent) => {
      const { id } = (e.target as HTMLElement);
      if (selectObj && !id) setSelectObj(undefined);
    }}>
      {
        newObjModal ?
          <CreateObjModal
            datas={datas}
            setDatas={setDatas}
            modalType={newObjModal}
            setModal={setNewObjModal}
          />
          : null
      }
      <Header>
      </Header>
      <Main>
        <Contents>
          <Title>화면</Title>
          {displayImg && <Image src={displayImg} alt='display image' width={200} height={200} />}
          <Preview></Preview>
          <MainInput>
            <h2>제목</h2>
            <input type="text" />
          </MainInput>
          <MainInput>
            <h2>제목</h2>
            <input type="text" />
          </MainInput>
        </Contents>
        <ObjectContent>
          <TitleWrap>
            <h1>시작 오브젝트</h1>
            <button onClick={() => setNewObjModal("start")}>
              <SVG_plus width="24" height="24" fill="#F1F6F9" />
            </button>
          </TitleWrap>
          <ObjectList>
            {
              datas.start.map((data, key) => (
                <Object key={key}>
                  <ObjectImg {...objImgProps(data)} />
                  <h1>{findObjValueById(data, "name")}</h1>
                </Object>
              ))
            }
          </ObjectList>
          <TitleWrap>
            <h1>조합 오브젝트</h1>
            <button onClick={() => setNewObjModal("combine")}>
              <SVG_plus width="24" height="24" fill="#F1F6F9" />
            </button>
          </TitleWrap>
          <ObjectList>
            {
              datas.combine.map((data, key) => (
                <Object key={key}>
                  <ObjectImg {...objImgProps(data)} />
                  <h1>{findObjValueById(data, "name")}</h1>
                </Object>
              ))
            }
          </ObjectList>
          <TitleWrap>
            <h1>조합</h1>
            <button onClick={() => {
              const newData = { ...datas }
              newData.combinate.unshift(["", "", ""])
              setDatas(newData)
            }}>
              <SVG_plus width="24" height="24" fill="#F1F6F9" />
            </button>
          </TitleWrap>
          {
            datas.combinate.map((data, key) => (
              <CombineObj key={key}>
                <Object>
                  <ObjectImg
                    onClick={() => { handleCombine(key, 0) }}
                    size="60"
                    style={{ backgroundImage: `url(${findObjValueById(data[0], "img")})` }}
                  />
                  <h1>{findObjValueById(data[0], "name")}</h1>
                </Object>
                <SVG_plus width="32" height="32" />
                <Object>
                  <ObjectImg
                    onClick={() => { handleCombine(key, 1) }}
                    size="60"
                    style={{ backgroundImage: `url(${findObjValueById(data[1], "img")})` }}
                  />
                  <h1>{findObjValueById(data[1], "name")}</h1>
                </Object>
                <SVG_arrow_right width="32" height="32" />
                <Object>
                  <ObjectImg
                    onClick={() => { handleCombine(key, 2) }}
                    size="60"
                    style={{ backgroundImage: `url(${findObjValueById(data[2], "img")})` }}
                  />
                  <h1>{findObjValueById(data[2], "name")}</h1>
                </Object>
              </CombineObj>
            ))
          }
        </ObjectContent>
        <Ad></Ad>
      </Main>
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  display:flex;
  flex-direction: column;
  h1,h2,h3,h4,h5,h6{
    color:#F1F6F9;
  }
  svg{
    fill:#F1F6F9;
  }
`
const Header = styled.div`
  width:100%;
  height:48px;
  background-color: #D9D9D9;
`
const Main = styled.div`
  display:flex;
  width:100%;
  flex:1;
`
const Contents = styled.div`
  flex:1;
  display:flex;
  flex-direction: column;
  padding: 24px;
  padding-top:0px;
  height:calc(100vh - 48px - 24px);
  overflow-y: scroll;
  background-color: #343943;
`
const ObjectContent = styled.div`
  width:460px;
  height:calc(100vh - 48px - 24px);
  background-color: #2C2F35;
  overflow-y: scroll;
  padding: 24px;
  padding-top:0px;
`
const Ad = styled.div`
  width:150px;
  background-color: #D9D9D9;
`
const Title = styled.h1`
  font-size: 20px;
  margin-top: 36px;
  margin-bottom: 24px;
`
const Preview = styled.div`
  aspect-ratio:16 / 9;
  margin: 4px;
  background-color: #D9D9D9;
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(65, 65, 65, 0.75) 0%, rgba(65, 65, 65, 0) 37.62%), url(/defaultBg.jpg);
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
`
const ObjectList = styled.div`
  display:flex;
  flex-wrap: wrap;
`
const Object = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 16px;
  margin-right: 16px;
  h1{
    margin-top: 12px;
    font-size: 15px;
  }
  @media screen and (max-width: 800px) {
    h1{
      margin-top: 8px;
      font-size: 12px;
    }
    margin-bottom: 16px;
  }
`
const ObjectImg = styled.div<{ size: string, img: string, shadow: string, border: string }>`
  width:${({ size }: { size: string }) => size + "px"};
  height:${({ size }: { size: string }) => size + "px"};
  background-image: ${({ img }: { img: string }) => `url(${img})`};
  box-shadow:${({ shadow }: { shadow: string }) => shadow};
  border:${({ border }: { border: string }) => border};
  cursor: grab;
  border-radius: 100px;
  background-color: white;
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
  @media screen and (max-width: 800px) {
    width:50px;
    height:50px;
  }
`
const CombineObj = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-between;
  background-color: #4b4e56;
  padding: 16px 48px;
  margin: 20px -24px;
  margin-bottom: -12px;
`
const TitleWrap = styled.div`
  display:flex;
  align-items: center;
  margin-top: 36px;
  margin-bottom: 8px;
  h1{
    font-size: 18px;
    margin-right: 8px;
  }
  button{
    border: none;
    display:flex;
    cursor: pointer;
    border-radius: 24px;
    padding: 4px;
    opacity: 0.8;
    &:hover{
      opacity: 1;
      background-color: #444444;
    }
  }
`
const MainInput = styled.div`
  display:flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 16px;
  h2{
    font-size: 15px;
  }
  input{
    border:none;
    background-color: #dedede;
    border-radius: 4px;
    width:30%;
    flex:1;
    margin-top: 10px;
    padding: 12px 16px;
    font-size: 18px;
  }
  label{
    border:none;
    background-color: #dedede;
    border-radius: 4px;
    flex:1;
    margin-top: 6px;
    padding: 12px 16px;
    font-size: 18px;
    h1{
      font-size: 18px;
      color:#252B30;
    }
  }
`