import React from 'react';
import styled from 'styled-components';

const DescriptionOverlay = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
      // Overlay에 onClick 추가하여 외부를 터치 시 창이 닫히도록 함
      <Overlay onClick={onClose}>
        {/* Content 내부 클릭 시 이벤트 전파를 막아 창이 닫히지 않도록 함 */}
        <Content onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>×</CloseButton>

          <h2>게임 설명</h2>

          {/* 착한 다람쥐 */}
          <Section>
            <Image src="/cursors/good-squirrel.gif" alt="착한 다람쥐" />
            <div>
              <SectionTitle>착한 다람쥐</SectionTitle>
              <Description>
                다람쥐들과 함께 숲속 모험을 떠나, 도토리를 모으세요!
                <br />에너지를 모아 미니게임을 완료하여 도토리를 획득할 수 있습니다.
                <br />다람쥐들과 협력하여 창고에 도토리를 가득 채우면 승리합니다.
                <br />의심되는 상대를 투표로 지목해 나쁜 다람쥐를 찾아내세요.
              </Description>
            </div>
          </Section>

          {/* 나쁜 다람쥐 */}
          <Section>
            <Image src="/cursors/evil-squirrel.gif" alt="나쁜 다람쥐" />
            <div>
              <SectionTitle>나쁜 다람쥐</SectionTitle>
              <Description>
                숲의 평화를 깨뜨리려는 나쁜 다람쥐!
                <br />모든 에너지를 모아 캠 화면을 내려 착한 다람쥐를 쫓아내 승리하세요.
                <br />미니게임을 방해하고, 투표에서 의심받지 않도록 주의하세요.
                <br />두 번의 투표에서 생존하거나 착한 다람쥐를 모두 제거하면 승리합니다.
              </Description>
            </div>
          </Section>

          {/* 투표 */}
          <Section>
            <Image src="/information/vote.png" alt="투표 아이콘" />
            <div>
              <SectionTitle>투표</SectionTitle>
              <Description>
                긴급 투표 또는 최종 투표를 통해 숲속의 배신자를 색출하세요.
                <br />최종 투표에서 나쁜 다람쥐를 찾지 못한다면 착한 다람쥐는 패배합니다.
              </Description>
            </div>
          </Section>

          {/* 미니게임 */}
          <Section>
            <Image src="/information/mini-game.png" alt="미니게임 아이콘" />
            <div>
              <SectionTitle>미니게임</SectionTitle>
              <Description>
                맵 곳곳에 숨겨진 미니게임은 도토리를 획득할 기회를 제공합니다.
                <br />획득한 도토리를 창고에 채워 승리를 이끌어 주세요.
                <br />미니게임은 에너지를 1 소모합니다.
              </Description>
            </div>
          </Section>
        </Content>
      </Overlay>
  );
};

export default DescriptionOverlay;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Content = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: left;
  position: relative;
  width: 90%;
  max-width: 600px;
  /* 화면이 작을 경우 스크롤이 생기도록 최대 높이와 오버플로우 지정 */
  max-height: 80vh;
  overflow-y: auto;
`;

const Section = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Image = styled.img`
  width: 60px;
  height: auto;

  @media (max-width: 600px) {
    width: 50px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 5px;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const Description = styled.p`
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: #000;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: #ff4444;
  }
`;