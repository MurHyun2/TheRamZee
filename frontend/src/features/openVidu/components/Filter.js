// import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// import earImage from "../../../assets/filter/ear.png";

// // 1) Mediapipe Tasks Vision 패키지 (CDN import)


// // ES6 import를 선호한다면:
// // import vision from "@mediapipe/tasks-vision";
// // 하지만 이 경우 Babel/Webpack 설정이 필요할 수 있습니다.

// const { FaceLandmarker, FilesetResolver } = vision;

// // AR 이미지(다람쥐 귀)


// /**
//  * Mediapipe Tasks Vision "FaceLandmarker"로
//  * - 카메라 영상 + 이마 랜드마크(#10) → 다람쥐 귀 AR
//  * - Canvas.captureStream() 반환
//  */
// export async function createFaceLandmarkerStream() {
//   // 1) 카메라 + 마이크 스트림
//   const rawStream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   const rawVideo = document.createElement("video");
//   rawVideo.srcObject = rawStream;
//   await rawVideo.play();

//   // 2) FaceLandmarker 초기화
//   //    - FilesetResolver: wasm, modelAssetPath 등 로딩
//   //    - FaceLandmarker: "VIDEO" 모드
//   const filesetResolver = await FilesetResolver.forVisionTasks(
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//   );

//   const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//     baseOptions: {
//       modelAssetPath:
//         "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//       delegate: "GPU", // GPU 가속 사용 (가능한 환경에서)
//     },
//     runningMode: "VIDEO", // 실시간 비디오 모드
//     numFaces: 1,         // 한 명만 추적
//     outputFaceBlendshapes: false, // BlendShapes 필요하면 true
//   });

//   // 3) Canvas 준비
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   canvas.width = 640; 
//   canvas.height = 480;

//   // 4) 다람쥐 귀 이미지
//   const squirrelImg = new Image();
//   squirrelImg.src = earImage; // Webpack 번들된 경로

//   let lastVideoTime = -1;
//   let faceLandmarks = null;

//   // 5) 매 프레임 렌더 루프
//   async function renderFrame() {
//     // (A) Canvas에 원본 영상 그리기
//     ctx.drawImage(rawVideo, 0, 0, canvas.width, canvas.height);

//     // (B) FaceLandmarker 실행
//     //     FaceLandmarker는 detectForVideo(video, timestampMs) 사용
//     const nowInMs = performance.now();
//     if (rawVideo.currentTime !== lastVideoTime) {
//       lastVideoTime = rawVideo.currentTime;
//       const results = faceLandmarker.detectForVideo(rawVideo, nowInMs);

//       // 첫 번째 얼굴 기준
//       if (results.faceLandmarks && results.faceLandmarks.length > 0) {
//         faceLandmarks = results.faceLandmarks[0];
//       } else {
//         faceLandmarks = null;
//       }
//     }

//     // (C) 다람쥐 귀 합성
//     if (faceLandmarks && squirrelImg.complete) {
//       // 이마(10번 지점)
//       const forehead = faceLandmarks[10];
//       if (forehead) {
//         const fx = forehead.x * canvas.width;
//         const fy = forehead.y * canvas.height;
//         const earsWidth = 300;
//         const earsHeight = 500;
//         const drawX = fx - earsWidth / 3;
//         const drawY = fy - earsHeight * 0.2;
//         ctx.drawImage(squirrelImg, drawX, drawY, earsWidth, earsHeight);
//       }
//     }

//     requestAnimationFrame(renderFrame);
//   }
//   requestAnimationFrame(renderFrame);

//   // 6) 최종 MediaStream (Canvas + 오디오)
//   const processedVideoTrack = canvas.captureStream(30).getVideoTracks()[0];
//   const audioTrack = rawStream.getAudioTracks()[0];
//   return new MediaStream([processedVideoTrack, audioTrack]);
// }
