import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { animationImages } from '../../../assets/images';
import { Z_INDEX } from '../../../constants/zIndex';

const KillAnimation = ({ onAnimationEnd }) => {
 useEffect(() => {
   // 애니메이션 재생 시간(3초) 후 콜백 실행
   const timer = setTimeout(() => {
     onAnimationEnd?.();
   }, 3000);

   return () => clearTimeout(timer);
 }, [onAnimationEnd]);

 return (
   <AnimationOverlay>
     <AnimationContainer>
       <KillEffect />
     </AnimationContainer>
   </AnimationOverlay>
 );
};

// 애니메이션 키프레임
const fadeInOut = keyframes`
 0% { 
   opacity: 0; 
   transform: scale(0.8); 
 }
 10% { 
   opacity: 1; 
   transform: scale(1); 
 }
 90% { 
   opacity: 1; 
   transform: scale(1); 
 }
 100% { 
   opacity: 0; 
   transform: scale(0.8); 
 }
`;

const AnimationOverlay = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
 background: rgba(0, 0, 0, 0.8);
 z-index: ${Z_INDEX.KILL_ANIMATION};  // z-index 추가, 가장 높은 우선순위
 display: flex;
 justify-content: center;
 align-items: center;
`;

const AnimationContainer = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: center;
 align-items: center;
`;

const KillEffect = styled.div`
 width: 100%;
 height: 100%;
 background-image: url(${animationImages.kill});
 background-size: contain;
 background-position: center;
 background-repeat: no-repeat;
 animation: ${fadeInOut} 3s forwards;
`;

export default KillAnimation;