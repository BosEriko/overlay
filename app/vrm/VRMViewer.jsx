'use client';

import { useEffect, useRef } from 'react';

export default function VRMViewer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, vrm, clock;
    let animationId;
    let analyser, dataArray;

    async function init() {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { VRM, VRMLoaderPlugin, VRMUtils } = await import('@pixiv/three-vrm');

      // Mic input
      const audioCtx = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      clock = new THREE.Clock();

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x00ff00);

      camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        0.1,
        20
      );
      camera.position.set(0, 1, 1.5);

      const directional = new THREE.DirectionalLight(0xffffff, 3);
      directional.position.set(1, 1, 1);
      scene.add(directional);

      const ambient = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambient);

      const loader = new GLTFLoader();
      loader.register((parser) => new VRMLoaderPlugin(parser));

      const gltf = await new Promise((resolve, reject) => {
        loader.load('/model.vrm', resolve, undefined, reject);
      });

      vrm = gltf.userData.vrm;
      VRMUtils.removeUnnecessaryJoints(vrm.scene);
      VRMUtils.removeUnnecessaryVertices(vrm.scene);

      vrm.scene.rotation.y = Math.PI;

      vrm.humanoid.setNormalizedPose({
        leftUpperArm: { rotation: [0, 0, 0.5, 0.87] },
        leftLowerArm: { rotation: [0, 0.3, 0, 0.95] },
        rightUpperArm: { rotation: [0, 0, -0.5, 0.87] },
        rightLowerArm: { rotation: [0, -0.3, 0, 0.95] },
      });

      scene.add(vrm.scene);

      let blinkTimer = 0;
      let nextBlinkIn = 2 + Math.random() * 4;
      let mouthAa = 0, mouthIh = 0, mouthOu = 0;

      // Head look-around state machine
      const headTarget = { x: 0, y: 0, z: 0 };
      const headCurrent = { x: 0, y: 0, z: 0 };
      let headHoldTimer = 0;
      let headHoldDuration = 1 + Math.random() * 3;
      let headMoving = false;
      let headSpeed = 1 + Math.random() * 2;
      let headProgress = 0;
      const headStart = { x: 0, y: 0, z: 0 };

      function pickHeadTarget() {
        headTarget.x = (Math.random() - 0.5) * 0.2;
        headTarget.y = (Math.random() - 0.5) * 0.4;
        headTarget.z = (Math.random() - 0.5) * 0.1;
        headSpeed = 0.3 + Math.random() * 0.7;
        headHoldDuration = 2 + Math.random() * 5;
        headHoldTimer = 0;
        headMoving = true;
        headProgress = 0;
      }

      pickHeadTarget();

      function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (vrm) {
          // Head: move to target with subtle drift always active
          if (headMoving) {
            headProgress += delta * headSpeed;
            if (headProgress >= 1) {
              headProgress = 1;
              headMoving = false;
            }
            // Smooth ease-in-out
            const ease = headProgress < 0.5
              ? 2 * headProgress * headProgress
              : 1 - (-2 * headProgress + 2) * (-2 * headProgress + 2) / 2;

            headCurrent.x = headStart.x + (headTarget.x - headStart.x) * ease;
            headCurrent.y = headStart.y + (headTarget.y - headStart.y) * ease;
            headCurrent.z = headStart.z + (headTarget.z - headStart.z) * ease;
          } else {
            headHoldTimer += delta;
            if (headHoldTimer >= headHoldDuration) {
              headStart.x = headCurrent.x;
              headStart.y = headCurrent.y;
              headStart.z = headCurrent.z;
              pickHeadTarget();
            }
          }

          // Subtle idle drift always layered on top
          const drift = clock.elapsedTime;
          const driftX = Math.sin(drift * 0.8) * 0.03 + Math.sin(drift * 1.7) * 0.01;
          const driftY = Math.sin(drift * 0.5) * 0.04 + Math.sin(drift * 1.2) * 0.015;
          const driftZ = Math.sin(drift * 0.6) * 0.02;

          vrm.humanoid.getNormalizedBoneNode('head').rotation.x = headCurrent.x + driftX;
          vrm.humanoid.getNormalizedBoneNode('head').rotation.y = headCurrent.y + driftY;
          vrm.humanoid.getNormalizedBoneNode('head').rotation.z = headCurrent.z + driftZ;

          vrm.humanoid.getNormalizedBoneNode('neck').rotation.x = headCurrent.x * 0.25;
          vrm.humanoid.getNormalizedBoneNode('neck').rotation.y = headCurrent.y * 0.25;

          // Blink
          blinkTimer += delta;
          if (blinkTimer >= nextBlinkIn) {
            blinkTimer = 0;
            nextBlinkIn = 2 + Math.random() * 4;
          }
          const blinkPhase = blinkTimer / 0.15;
          const blinkValue = blinkPhase < 1
            ? Math.sin(blinkPhase * Math.PI)
            : 0;
          vrm.expressionManager.setValue('blink', blinkValue);

          // Mic-driven mouth (visemes from frequency bands)
          analyser.getByteFrequencyData(dataArray);
          const binCount = analyser.frequencyBinCount;
          const third = Math.floor(binCount / 3);

          let lowSum = 0, midSum = 0, highSum = 0;
          for (let i = 0; i < third; i++) lowSum += dataArray[i];
          for (let i = third; i < third * 2; i++) midSum += dataArray[i];
          for (let i = third * 2; i < binCount; i++) highSum += dataArray[i];

          const low = lowSum / third / 255;
          const mid = midSum / third / 255;
          const high = highSum / third / 255;

          const s = 0.4;
          mouthAa += (mid - mouthAa) * s;
          mouthIh += (high - mouthIh) * s;
          mouthOu += (low - mouthOu) * s;

          vrm.expressionManager.setValue('aa', mouthAa * 0.8);
          vrm.expressionManager.setValue('ih', mouthIh * 0.5);
          vrm.expressionManager.setValue('ou', mouthOu * 0.6);

          vrm.update(delta);
        }

        renderer.render(scene, camera);
      }
      animate();

      function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      window.addEventListener('resize', onResize);
    }

    init().catch(console.error);

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#00ff00]">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
