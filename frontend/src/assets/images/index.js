// src/assets/images/index.js
// 배경 이미지들
import forestBg from './backgrounds/forest-bg.gif';
import mainForestBg from './backgrounds/main-forest.gif';
import twistedForestBg from './backgrounds/twisted-forest.png';
import dryForestBg from './backgrounds/dry-forest.png';
import breathingForestBg from './backgrounds/breathing-forest.png';
import foggyForestBg from './backgrounds/foggy-forest.png';
import fairyForestBg from './backgrounds/fairy-forest.png';
import timeForestBg from './backgrounds/time-forest.png';

// 캐릭터 이미지들
import goodSquirrel from './characters/good-squirrel.png';
import badSquirrel from './characters/evil-squirrel.png';

// 애니메이션 이미지들
import killAnimation from './animations/kill-animation.gif';

export const backgroundImages = {
  forest: forestBg,
  mainForest: mainForestBg,
  twistedForest: twistedForestBg,
  dryForest: dryForestBg,
  breathingForest: breathingForestBg,
  foggyForest: foggyForestBg,
  fairyForest: fairyForestBg,
  timeForest: timeForestBg
};

export const characterImages = {
  goodSquirrel,
  badSquirrel
};

export const animationImages = {
  kill: killAnimation
};