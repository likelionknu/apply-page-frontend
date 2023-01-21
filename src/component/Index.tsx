/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, useState } from 'react'
import axios from 'axios';
import checkBox from '../images/checkBox.svg';
import checkedBox from '../images/checkedBox.svg';
import { useMemo } from 'react';
import { css, keyframes } from "@emotion/react";
import { fadeLeft, fadeUp } from '../styles/Keyframes';
import { Section, Banner, Article, InputTitle, InputBox, PositionBox, Position, Require, Precautions, ArgreeBox, Argree, ButtonBox, Button, Modal } from './emotion/component';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, TestState } from '../app/store';
import { view, saveIndex, saveBackEnd, saveCommon, saveFrontEnd, saveDesign } from '../features/fetcherSlice';
import { useEffect } from 'react';
import human from '../images/human.png';

export default function Index() {
    const [name, setName] = useState<string>('');
    const [id, setID] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<number | string>('');
    const [department, setDepartment] = useState<string>('');
    const [temp, setTemp] = useState<boolean>(false);

    const [position, setPosition] = useState<string>('');
    const [precautions, setPrecautions] = useState<boolean>(false);
    const [privacy, setPrivacy] = useState<boolean>(false);
    const [buttonState, setButtonState] = useState<boolean>(false);
    const [tempButtonState, setTempButtonState] = useState<boolean>(false);
    const [submitCount, setSubmitCount] = useState<number>(0);
    const [tempCount, setTempCount] = useState<number>(0);

    const userName = useSelector((state: TestState) => state.fetcher.userName);
    const userID = useSelector((state: TestState) => state.fetcher.userID);
    const userPhone = useSelector((state: TestState) => state.fetcher.userPhone);
    const userEmail = useSelector((state: TestState) => state.fetcher.userEmail);
    const userPosition = useSelector((state: TestState) => state.fetcher.userPosition);
    const userDepartment = useSelector((state: TestState) => state.fetcher.userDepartment);

    useEffect(() => {
        // 이전 값들을 저장하기 위해서 Redux 사용
        if (userName && userID && userPhone && userEmail && userPosition && userDepartment) {
            setName(userName);
            setID(userID);
            setEmail(userEmail);
            setPhone(userPhone);
            setPosition(userPosition);
            setDepartment(userDepartment);
        }
    }, [])

    useMemo(() => {
        if (name && email && phone && position && precautions && privacy && department) {
            if (id.length >= 9) {
                setButtonState(false)
            } else {
                setButtonState(true)
            }
        } else {
            setButtonState(true)
        }

        if (submitCount >= 1) {
            setButtonState(true);
        }

        if (tempCount >= 1) {
            setTempButtonState(true);
        }

    }, [name, id, email, phone, position, precautions, privacy, department, submitCount, tempCount])

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleClick = async () => {
        if (position) {
            setSubmitCount((prev) => (prev + 1))
            if (position === "백엔드") {
                await axios.get(`/backendApplication?sid=${id}`)
                    .then(async (res) => {
                        if (res.data.motiv || res.data.hardwork || res.data.keyword || res.data.mostDeeplyWork) {
                            setTemp(!temp);
                        } else {
                            dispatch(saveIndex({ userName: name, userID: id, userPhone: phone, userEmail: email, userPosition: position, userDepartment: department }));
                            navigate('/common');
                        }
                    })
            }

            if (position === "프론트엔드") {
                await axios.get(`/frontendApplication?sid=${id}`)
                    .then(async (res) => {
                        if (res.data.motiv || res.data.hardwork || res.data.keyword || res.data.mostDeeplyWork) {
                            setTemp(!temp);
                        } else {
                            dispatch(saveIndex({ userName: name, userID: id, userPhone: phone, userEmail: email, userPosition: position, userDepartment: department }));
                            navigate('/common');
                        }
                    })
            }

            if (position === "디자인") {
                await axios.get(`/designApplication?sid=${id}`)
                    .then(async (res) => {
                        if (res.data.motiv || res.data.hardwork || res.data.keyword || res.data.mostDeeplyWork) {
                            setTemp(!temp);
                        } else {
                            dispatch(saveIndex({ userName: name, userID: id, userPhone: phone, userEmail: email, userPosition: position, userDepartment: department }));
                            navigate('/common');
                        }
                    })
            }
        }
    }

    const continueApply = async () => {
        setTempCount((prev) => (prev + 1))
        if (position === "백엔드") {
            await axios.get(`/backendApplication?sid=${id}`)
                .then(async (res) => {
                    await dispatch(saveIndex({ userName: res.data.name, userID: res.data.sid, userPhone: res.data.phoneNumber, userEmail: res.data.email, userPosition: position, userDepartment: res.data.department }));
                    await dispatch(saveBackEnd({ userDifficultAndOvercoming: res.data.difficultAndOvercoming, userImportantGroup: res.data.importantGroup, userPortfolioLinkBack: res.data.portfolioLink, userStudyFramework: res.data.studyFramework }));
                    await dispatch(saveCommon({ userMotiv: res.data.motive, userHardWork: res.data.hardWork, userKeyword: res.data.keyWord, userMostDeeplyWork: res.data.mostDeeplyWork }));
                    await navigate('/common');
                })
        }

        if (position === "프론트엔드") {
            await axios.get(`/frontendApplication?sid=${id}`)
                .then(async (res) => {
                    await dispatch(saveIndex({ userName: res.data.name, userID: res.data.sid, userPhone: res.data.phoneNumber, userEmail: res.data.email, userPosition: position, userDepartment: res.data.department }));
                    await dispatch(saveFrontEnd({ userWhyFrontend: res.data.whyFrontend, userUsingStack: res.data.usingStack, userTeamProject: res.data.teamProject, userAchieve: res.data.achieve, userPortfolioLinkFront: res.data.portfolioLink }));;
                    await dispatch(saveCommon({ userMotiv: res.data.motive, userHardWork: res.data.hardWork, userKeyword: res.data.keyWord, userMostDeeplyWork: res.data.mostDeeplyWork }));
                    await navigate('/common');
                })
        }

        if (position === "디자인") {
            await axios.get(`/designApplication?sid=${id}`)
                .then(async (res) => {
                    console.log("design :", res.data);
                    await dispatch(saveIndex({ userName: res.data.name, userID: res.data.sid, userPhone: res.data.phoneNumber, userEmail: res.data.email, userPosition: position, userDepartment: res.data.department }));
                    await dispatch(saveDesign({ userWhyDesign: res.data.whyDesign, userToolExperience: res.data.toolExperience, userTeamworkExperience: res.data.teamworkExperience, userPortfolioLinkDesign: res.data.portfolioLink, userDesignGrowth: res.data.designGrowth, }));
                    await dispatch(saveCommon({ userMotiv: res.data.motive, userHardWork: res.data.hardWork, userKeyword: res.data.keyWord, userMostDeeplyWork: res.data.mostDeeplyWork }));
                    await navigate('/common');
                })
        }
    }

    /* 저장된 글이 발견되고, 새로 작성하기를 누를 경우 기본 정보를 Redux에 저장시키고, 기존 Redux 정보를 새롭게 리셋 시킨다. */
    const newApply = async () => {
        await setTempCount((prev) => (prev + 1))
        await dispatch(saveIndex({ userName: name, userID: id, userPhone: phone, userEmail: email, userPosition: position, userDepartment: department }));
        if (position === "프론트엔드") {
            await dispatch(saveFrontEnd({
                userWhyFrontend: '',
                userUsingStack: '',
                userAchieve: '',
                userPortfolioLinkFront: '',
                userTeamProject: '',
            }));
        }
        if (position === "디자인") {
            await dispatch(saveDesign({
                userWhyDesign: '',
                userToolExperience: '',
                userTeamworkExperience: '',
                userPortfolioLinkDesign: '',
                userDesignGrowth: '',
            }));
        }

        if (position === "백엔드") {
            await dispatch(saveBackEnd({
                userDifficultAndOvercoming: '',
                userImportantGroup: '',
                userPortfolioLink: '',
                userStudyFramework: '',
            }));
        }

        await dispatch(saveCommon({
            userMotiv: '',
            userHardWork: '',
            userKeyWord: '',
            userMostDeeplyWork: '',
        }))
        navigate('/common');
    }

    function CheckPosition(event: React.MouseEvent<HTMLButtonElement>): void {
        const name = (event.target as HTMLButtonElement).name;
        setPosition(name);
    }

    const checking = (event: React.MouseEvent<HTMLImageElement>): void => {
        const name = (event.target as HTMLImageElement).alt;
        if (name === "주의사항") {
            setPrecautions(!precautions);
        }
        if (name === "개인정보") {
            setPrivacy(!privacy);
        }
    }

    const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === "이름") {
            const eventName = event.target.value.replace(/[_/]|[0-9]|[ \[\]{}()<>?|`~!@#$%^&*-+=,.;:\"'\\]/g, '');
            setName(eventName);
        }
        if (event.target.name === "학번") {
            const eventID = event.target.value.replace(/[^0-9]/g, '');
            setID(eventID);
        }
        if (event.target.name === "이메일") {
            setEmail(event.target.value);
        }
        if (event.target.name === "연락처") {
            const eventPhone = event.target.value.replace(/[^0-9]/g, '');
            setPhone(eventPhone);
        }
        if (event.target.name === "학과") {
            const eventDepartment = event.target.value.replace(/[_/]|[0-9]|[\[\]{}()<>?|`~!@#$%^&*-+=,.;:\"'\\]/g, '');
            setDepartment(eventDepartment);
        }
    }

    return (
        <Section>
            {temp ?
                <Modal text="앗, 저장된 지원서가 발견되었어요 계속 작성할까요?" imgSrc={human} alt="불러오기">
                    <Button name="임시저장" onClick={newApply} disabled={tempButtonState}>{tempCount >= 1 ? `잠시만 기다려주세요...` : `새로 작성하기`}</Button>
                    <Button name="제출하기" onClick={continueApply} disabled={tempButtonState}>{tempCount >= 1 ? `잠시만 기다려주세요...` : `이어서 작성하기`}</Button>
                </Modal>
                : null
            }
            <Banner />
            <Article>
                <InputTitle>이름 <Require /> </InputTitle>
                <InputBox type="text" placeholder="이름을 입력해주세요" name="이름" maxLength={15} onChange={changeValue} value={name} />
            </Article>
            <Article>
                <InputTitle>학번 <Require /> </InputTitle>
                <InputBox type="text" placeholder="학번 전체를 입력해주세요" name="학번" maxLength={9} onChange={changeValue} value={id} />
            </Article>
            <Article>
                <InputTitle>학과 <Require /> </InputTitle>
                <InputBox type="text" placeholder="학과를 입력해주세요" name="학과" onChange={changeValue} maxLength={10} value={department} />
            </Article>
            <Article>
                <InputTitle>이메일 <Require /> </InputTitle>
                <InputBox type="text" placeholder="이메일을 입력해주세요" name="이메일" maxLength={30} onChange={changeValue} value={email} />
            </Article>
            <Article>
                <InputTitle>연락처 (하이픈을 제외한 숫자만 입력)<Require /> </InputTitle>
                <InputBox type="text" placeholder="연락 가능한 번호를 입력해주세요" name="연락처" maxLength={11} onChange={changeValue} value={phone} />
            </Article>
            <Article>
                <InputTitle>지원 포지션 <Require /> </InputTitle>
                <PositionBox>
                    <Position name="백엔드" onClick={CheckPosition} state={position}>백엔드</Position>
                    <Position name="프론트엔드" onClick={CheckPosition} state={position}>프론트엔드</Position>
                    <Position name="디자인" onClick={CheckPosition} state={position}>디자인</Position>
                </PositionBox>
            </Article>
            <Article>
                <Precautions />
            </Article>
            <Article>
                <ArgreeBox>
                    <Argree name="주의사항" src={precautions ? checkedBox : checkBox} text="위의 주의사항을 확인하였습니다" onClick={checking} />
                    <Argree name="개인정보" src={privacy ? checkedBox : checkBox} text="개인 정보 수집 및 이용에 동의합니다 (모집 종료 후 개인정보는 자동으로 파기됩니다)" onClick={checking} />
                </ArgreeBox>
            </Article>
            <ButtonBox>
                <Button name="제출하기" disabled={buttonState} onClick={handleClick}>{submitCount >= 1 ? `잠시만 기다려주세요...` : `공통문항 작성하기`}</Button>
            </ButtonBox>
        </Section>
    )
}
