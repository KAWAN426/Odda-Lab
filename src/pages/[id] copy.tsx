import styled from 'styled-components'
import SVG_plus from "../../svg/plus.svg"
import SVG_down from "../../svg/down.svg"
import { Dispatch, EventHandler, MouseEventHandler, SetStateAction, useEffect, useState } from 'react'

const temp = {
  id: "0",
  title: "이상한 실험실",
  makerId: "0",
  objects: [
    {
      id: "0",
      name: "물",
      img: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F244B0939537624F506"
    },
    {
      id: "1",
      name: "불",
      img: "https://media.istockphoto.com/id/1323529010/ko/%EB%B2%A1%ED%84%B0/%EC%A0%88%EC%97%B0%EB%90%9C-%ED%99%94%EC%9E%AC-%EB%B2%A1%ED%84%B0.jpg?s=612x612&w=0&k=20&c=W5Vw8QImatJTlzwtBYj48aglJrOZuv0YP-tZ6TStqnc="
    },
    {
      id: "2",
      name: "수증기",
      img: "https://previews.123rf.com/images/rigamondis/rigamondis1111/rigamondis111100015/11317989-%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C%EC%9D%98-%ED%95%98%EB%8A%98%EB%A1%9C-%EC%8A%A4%ED%8C%80%EA%B3%BC-%EC%88%98%EC%A6%9D%EA%B8%B0%EA%B0%80%EC%9E%88%EB%8A%94-%ED%81%B0-%EC%86%94%ED%8C%8C-%ED%83%80%EB%9D%BC.jpg"
    }
  ],
  found: ["0", "1", "2"],
  combinate: [
    ["0", "1", "2"]
  ],
  backgroundImg: "url",
  sound: "url"
}


export default function Play() {
  const [objId, setObjId] = useState<string>()
  const [x, setX] = useState("0")
  const [y, setY] = useState("0")
  const [leftObj, setLeftObj] = useState<string>()
  const [rightObj, setRightObj] = useState<string>()
  const data = temp;

  const handleClick = ({ clientX, clientY, target }: { clientX: number, clientY: number, target: EventTarget }) => {
    setObjId((target as HTMLElement).id)
    setX(String(clientX - 65 / 2))
    setY(String(clientY - 65 / 2))
  }
  const handleMove = (e: MouseEvent) => {
    if (!objId) return;
    setX(String(e.clientX - 65 / 2))
    setY(String(e.clientY - 65 / 2))
  }
  const leftCombine = ({ target }: { target: EventTarget }) => {
    setLeftObj(objId);
    (target as HTMLElement).style.backgroundImage = "url(" + data.objects.find(value => value.id === objId)?.img + ")"
  }
  const rightCombine = ({ target }: { target: EventTarget }) => {
    setLeftObj(objId);
    (target as HTMLElement).style.backgroundImage = "url(" + data.objects.find(value => value.id === objId)?.img + ")"
  }

  useEffect(() => {

  }, [leftObj, rightObj])

  return (
    <Container id="playCont" onMouseMove={handleMove} onClick={() => objId ? setObjId(undefined) : null}>
      {
        objId && <GrapObj style={{
          left: x + "px",
          top: y + "px",
          backgroundImage: "url(" + data.objects.find(value => value.id === objId)?.img + ")"
        }} />
      }
      <Header></Header>
      <Main>
        <Contents>
          <Title>
            <h1>{data.title}</h1>
          </Title>
          <Combine>
            <div onPointerUp={leftCombine} />
            <Plus />
            <div onPointerUp={leftCombine} />
          </Combine>
          <ObjCont>
            <ObjectBox>
              <ObjectHead>
                <h1>오브젝트</h1>
                <DownBtn />
              </ObjectHead>
              <ObjectList>
                {
                  data.objects.filter(value => data.found.includes(value.id))
                    .map((value, key) => (
                      <Object key={key}>
                        <div
                          id={value.id}
                          // onPointerDown={handleClick}
                          onPointerDown={handleClick}
                          style={{ backgroundImage: "url(" + value.img + ")" }}
                        />
                        <h1>{value.name}</h1>
                      </Object>
                    ))
                }
              </ObjectList>
            </ObjectBox>
          </ObjCont>
        </Contents>
        <Ads>Ads</Ads>
      </Main>
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  display:flex;
  flex-direction: column;
`
const Header = styled.header`
  width:100vw;
  height:48px;
  background-color: beige;
`
const Main = styled.div`
  flex:1;
  display:flex;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`
const Contents = styled.main`
  flex:1;
  background: linear-gradient(180deg, rgba(65, 65, 65, 0.75) 0%, rgba(65, 65, 65, 0) 37.62%), url(/image.jpg);
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
`
const Title = styled.div`
  width:100%;
  display:flex;
  justify-content: center;
  align-items: center;
  h1{
    font-size: 40px;
    font-weight: bold;
    color:white;
    @media screen and (max-width: 800px) {
      font-size: 32px;
    }
  }
`
const Combine = styled.div`
  width:100%;
  display:flex;
  align-items: center;
  justify-content: center;
  div{
    width:140px;
    height:140px;
    margin: 0px 24px;
    border-radius: 1000px;
    background: rgba(255, 255, 255, 0.3);
    border: 3px solid rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(3px);
    background-position: center center;
    background-repeat: repeat-x;
    background-size: cover;
    @media screen and (max-width: 800px) {
      width:100px;
      height:100px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      margin: 0px 12px;
    }
  }
`
const ObjCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const ObjectBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(3.5px);
  border-radius: 12px;
  padding-bottom: 24px;
  @media screen and (max-width: 800px) {
    flex-direction: column;
    padding-bottom: 12px;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
`
const Plus = styled(SVG_plus)`
  width:65px;
  height:65px; 
  fill:white;
  @media screen and (max-width: 800px) {
    width:45px;
    height:45px; 
  }
`
const Ads = styled.div`
  width:200px;
  background-color: #d6d6d6;
  @media screen and (max-width: 800px) {
    flex-direction: column;
    height:100px;
    width:100vw;
  }
`
const ObjectHead = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding:24px;
  padding-top: 18px;
  * {
    color:white;
  }
  @media screen and (max-width: 800px) {
    padding: 16px;
    padding-top: 12px;
    h1{
      font-size: 15px;
    }
  }
`
const ObjectList = styled.div`
  display:flex;
  padding: 0px 16px;
  @media screen and (max-width: 800px) {
    padding: 0px 6px;
  }
`
const Object = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0px 16px;
  div{
    width:65px;
    height:65px;
    cursor: grab;
    border-radius: 100px;
    background-color: white;
    background-position: center center;
    background-repeat: repeat-x;
    background-size: cover
  }
  h1{
    margin-top: 12px;
    font-size: 16px;
    color:white;
  }
  @media screen and (max-width: 800px) {
    div{
      width:45px;
      height:45px;
    }
    h1{
      margin-top: 8px;
      font-size: 14px;
      color:white;
    }
  }
`
const DownBtn = styled(SVG_down)`
  width:28px;
  height:28px; 
  fill:white;
  @media screen and (max-width: 800px) {
    width:20px;
    height:20px; 
  }
`
const GrapObj = styled.div<{ x: string, y: string }>`
  width:65px;
  height:65px;
  cursor:grabbing;
  position: absolute;
  z-index: 100;
  border-radius: 100px;
  background-color: white;
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
  pointer-events:none;
`