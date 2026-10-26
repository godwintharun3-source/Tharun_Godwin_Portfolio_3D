/**
 * THARUN GODWIN .C - THREE.JS 3D SPATIAL ENGINE
 * Features:
 * 1. 3D Procedural Humanoid Cyber Bot with Expressions, Head Tracking, Idle Float & Waving
 * 2. 3D Interactive Cyber Globe with Scroll-based Rotation, Tamil Nadu Landmark Pins & Animated Geo-Tracking Arc Line
 */

(function () {
  let botApp = null;
  let globeApp = null;

  // Safe default fallbacks
  window.TGBot = {
    setExpression: (expr) => console.log('TGBot fallback setExpression:', expr),
    wave: () => console.log('TGBot fallback wave')
  };
  window.TGGlobe = {
    rotateToLocation: (idx) => console.log('TGGlobe fallback rotateToLocation:', idx)
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Skipping 3D engines.');
      return;
    }

    initHumanoidBot();
    initCyberGlobe();
  });

  /* ==========================================================================
     1. 3D HUMANOID CYBER BOT (Three.js)
     ========================================================================== */
  function initHumanoidBot() {
    const container = document.getElementById('humanoid-bot-canvas-container');
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL context creation failed for Humanoid Bot:', err);
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3.5rem;">🤖</div>';
      return;
    }

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.5, 20);
    cyanLight.position.set(4, 4, 6);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 2, 20);
    purpleLight.position.set(-4, -2, 4);
    scene.add(purpleLight);

    // Bot Root Group
    const botGroup = new THREE.Group();
    scene.add(botGroup);

    // --- MATERIALS ---
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2
    });

    const glowCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4
    });

    // --- TORSO ---
    const torsoGeometry = new THREE.CylinderGeometry(0.7, 0.45, 1.6, 6);
    const torso = new THREE.Mesh(torsoGeometry, armorMaterial);
    torso.position.y = -0.3;
    botGroup.add(torso);

    // Arc Reactor Core (Glowing Chest Emblem)
    const coreGeometry = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 16);
    coreGeometry.rotateX(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeometry, glowCoreMaterial);
    coreMesh.position.set(0, 0.1, 0.48);
    torso.add(coreMesh);

    // Outer Core Ring
    const coreRingGeom = new THREE.RingGeometry(0.28, 0.35, 24);
    const coreRing = new THREE.Mesh(coreRingGeom, chromeMaterial);
    coreRing.position.set(0, 0.1, 0.52);
    torso.add(coreRing);

    // --- HEAD GROUP ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.95, 0);
    botGroup.add(headGroup);

    // Helmet Base
    const headGeom = new THREE.BoxGeometry(1.0, 0.95, 0.95);
    const headMesh = new THREE.Mesh(headGeom, armorMaterial);
    headGroup.add(headMesh);

    // Visor Screen (LED Matrix Display)
    const visorGeom = new THREE.PlaneGeometry(0.78, 0.42);
    const visorCanvas = document.createElement('canvas');
    visorCanvas.width = 256;
    visorCanvas.height = 128;
    const visorCtx = visorCanvas.getContext('2d');
    const visorTexture = new THREE.CanvasTexture(visorCanvas);

    const visorMaterial = new THREE.MeshBasicMaterial({
      map: visorTexture,
      transparent: true
    });
    const visorMesh = new THREE.Mesh(visorGeom, visorMaterial);
    visorMesh.position.set(0, 0.05, 0.49);
    headGroup.add(visorMesh);

    // Cyber Antenna / Ears
    const earGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
    const leftEar = new THREE.Mesh(earGeom, chromeMaterial);
    leftEar.position.set(-0.55, 0.2, 0);
    leftEar.rotation.z = Math.PI / 4;
    headGroup.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.x = 0.55;
    rightEar.rotation.z = -Math.PI / 4;
    headGroup.add(rightEar);

    // --- ARMS & SHOULDERS ---
    const shoulderGeom = new THREE.SphereGeometry(0.3, 12, 12);
    const leftShoulder = new THREE.Mesh(shoulderGeom, chromeMaterial);
    leftShoulder.position.set(-0.95, 0.4, 0);
    botGroup.add(leftShoulder);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.95, 0.4, 0);
    const armGeom = new THREE.CylinderGeometry(0.12, 0.1, 0.9, 8);
    const leftArm = new THREE.Mesh(armGeom, armorMaterial);
    leftArm.position.y = -0.5;
    leftArmGroup.add(leftArm);
    botGroup.add(leftArmGroup);

    // Right Arm (Interactive Waving Arm)
    const rightShoulder = new THREE.Mesh(shoulderGeom, chromeMaterial);
    rightShoulder.position.set(0.95, 0.4, 0);
    botGroup.add(rightShoulder);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.95, 0.4, 0);
    const rightArm = new THREE.Mesh(armGeom, armorMaterial);
    rightArm.position.y = -0.5;
    rightArmGroup.add(rightArm);
    botGroup.add(rightArmGroup);

    // --- VISOR LED EXPRESSIONS ---
    let currentExpression = 'happy'; // 'happy', 'thinking', 'speaking', 'alert'
    let waveTime = 0;
    let isWaving = false;

    function drawVisorExpression(expr) {
      visorCtx.clearRect(0, 0, 256, 128);
      visorCtx.fillStyle = '#060a12';
      visorCtx.fillRect(0, 0, 256, 128);

      const color = expr === 'alert' ? '#f43f5e' : (expr === 'speaking' ? '#38bdf8' : '#10b981');
      visorCtx.fillStyle = color;
      visorCtx.strokeStyle = color;
      visorCtx.lineWidth = 6;
      visorCtx.lineCap = 'round';

      if (expr === 'happy') {
        // Curved happy eyes (^ ^)
        visorCtx.beginPath();
        visorCtx.arc(70, 60, 22, Math.PI * 0.9, Math.PI * 2.1, false);
        visorCtx.stroke();

        visorCtx.beginPath();
        visorCtx.arc(186, 60, 22, Math.PI * 0.9, Math.PI * 2.1, false);
        visorCtx.stroke();

        // Subtle smile
        visorCtx.beginPath();
        visorCtx.arc(128, 70, 16, 0.2, Math.PI - 0.2, false);
        visorCtx.stroke();
      } else if (expr === 'thinking') {
        // Scanning eyes (o o) with blink bar
        visorCtx.beginPath();
        visorCtx.arc(70, 64, 18, 0, Math.PI * 2);
        visorCtx.arc(186, 64, 18, 0, Math.PI * 2);
        visorCtx.fill();

        // Scanning line
        const scanX = (Date.now() / 8) % 256;
        visorCtx.fillStyle = 'rgba(6, 182, 212, 0.5)';
        visorCtx.fillRect(scanX, 0, 30, 128);
      } else if (expr === 'speaking') {
        // Animated soundwave
        const t = Date.now() / 150;
        for (let i = 0; i < 7; i++) {
          const h = Math.abs(Math.sin(t + i * 0.8)) * 36 + 10;
          visorCtx.fillRect(68 + i * 18, 64 - h / 2, 8, h);
        }
      } else if (expr === 'alert') {
        // Sharp focused eyes (> <)
        visorCtx.beginPath();
        visorCtx.moveTo(50, 50); visorCtx.lineTo(85, 64); visorCtx.lineTo(50, 78);
        visorCtx.stroke();

        visorCtx.beginPath();
        visorCtx.moveTo(206, 50); visorCtx.lineTo(171, 64); visorCtx.lineTo(206, 78);
        visorCtx.stroke();
      }

      visorTexture.needsUpdate = true;
    }

    drawVisorExpression('happy');

    // --- MOUSE TRACKING ---
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouse.x = (e.clientX - cx) / (window.innerWidth / 2);
      mouse.y = -(e.clientY - cy) / (window.innerHeight / 2);
    });

    // Click bot to wave & speak
    container.addEventListener('click', () => {
      triggerWaveAction();
      const phrases = ['happy', 'speaking', 'thinking'];
      const next = phrases[Math.floor(Math.random() * phrases.length)];
      setBotExpression(next);
      if (window.playSynthSound) window.playSynthSound('blip', 700, 0.1);
    });

    function triggerWaveAction() {
      isWaving = true;
      waveTime = 0;
    }

    function setBotExpression(expr) {
      currentExpression = expr;
      drawVisorExpression(expr);
    }

    // --- ANIMATION LOOP ---
    let clock = new THREE.Clock();
    function animateBot() {
      requestAnimationFrame(animateBot);
      const elapsed = clock.getElapsedTime();

      // Idle Hover & Bobbing
      botGroup.position.y = Math.sin(elapsed * 2.2) * 0.12;
      botGroup.rotation.y = Math.sin(elapsed * 1.2) * 0.08;

      // Arc reactor glow breathing
      coreMesh.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.08);

      // Head tracking cursor
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mouse.x * 0.5, 0.1);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -mouse.y * 0.35, 0.1);

      // Waving Action
      if (isWaving) {
        waveTime += 0.08;
        rightArmGroup.rotation.z = Math.PI * 0.7 + Math.sin(waveTime * 12) * 0.45;
        rightArmGroup.rotation.x = -0.3;
        if (waveTime > 3.0) {
          isWaving = false;
          setBotExpression('happy');
        }
      } else {
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.1, 0.1);
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, 0, 0.1);
      }

      leftArmGroup.rotation.z = -0.1 + Math.sin(elapsed * 2.2) * 0.05;

      // Update visor if dynamic
      if (currentExpression === 'thinking' || currentExpression === 'speaking') {
        drawVisorExpression(currentExpression);
      }

      renderer.render(scene, camera);
    }

    animateBot();

    botApp = {
      setExpression: setBotExpression,
      wave: triggerWaveAction
    };

    window.TGBot = botApp;
  }

  /* ==========================================================================
     2. 3D INTERACTIVE GLOBE & TAMIL NADU GEO-TRACKING (Three.js)
     ========================================================================== */
  function initCyberGlobe() {
    const container = document.getElementById('cyber-globe-container');
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 20, 48);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL context creation failed for Cyber Globe:', err);
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3.5rem;">🌐</div>';
      return;
    }

    const globeRadius = 14;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // --- PROCEDURAL EARTH BASE & ATMOSPHERE ---
    const sphereGeom = new THREE.SphereGeometry(globeRadius, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x050c18,
      metalness: 0.8,
      roughness: 0.4,
      wireframe: false
    });
    const globeMesh = new THREE.Mesh(sphereGeom, globeMat);
    globeGroup.add(globeMesh);

    // Grid wireframe mesh
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const gridMesh = new THREE.Mesh(sphereGeom, gridMat);
    gridMesh.scale.setScalar(1.002);
    globeGroup.add(gridMesh);

    // Outer Atmospheric Glow
    const atmosGeom = new THREE.SphereGeometry(globeRadius * 1.14, 32, 32);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.02, 0.71, 0.83, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
    scene.add(atmosMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    sunLight.position.set(30, 20, 40);
    scene.add(sunLight);

    // --- LANDMARK COORDINATES (TAMIL NADU, INDIA) ---
    // 1. School (10th & 12th): Andrews Mat. Hr. Sec. School, Vickramasingapuram (8.7183° N, 77.3693° E)
    // 2. Diploma College: M.S.P.V.N.L.T Polytechnic, Pavoorchatram, Alangulam (8.9056° N, 77.4125° E)
    // 3. BE College: SKCET (Cyber Security), Kuniyamuthur, Coimbatore (10.9388° N, 76.9558° E)
    const landmarks = [
      {
        id: 'school',
        title: 'Andrews Mat. Hr. Sec. School',
        desc: '10th & 12th Standard // 89% Merit Foundation',
        addr: '1F2 East Pudumanai Street, East Kottaram, Vickramasingapuram, TN 627422',
        link: 'https://maps.app.goo.gl/dNSiCFLMcVNGajAC8',
        lat: 8.7183,
        lon: 77.3693,
        color: 0x3b82f6
      },
      {
        id: 'diploma',
        title: 'M.S.P.V.N.L.T Polytechnic',
        desc: 'Diploma in Computer Science & Engineering (89% Distinction)',
        addr: '50/2, Pavoorchatram, Sivagamipuram, Alangulam, Tirunelveli, TN 627808',
        link: 'https://maps.app.goo.gl/ETNoeBc4VDjbEdLRA',
        lat: 8.9056,
        lon: 77.4125,
        color: 0x10b981
      },
      {
        id: 'be',
        title: 'SKCET (Sri Krishna College of Engg & Tech)',
        desc: 'BE Lateral Entry - CSE (Cyber Security) // CGPA: 7.4',
        addr: 'BK Pudur, Kuniyamuthur, Coimbatore, TN 641008',
        link: 'https://maps.app.goo.gl/yQcYfnzkx22DAReC9',
        lat: 10.9388,
        lon: 76.9558,
        color: 0x06b6d4
      }
    ];

    function latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      return new THREE.Vector3(x, y, z);
    }

    const pinPoints = [];

    // Create 3D Beacon Pins & Radar Rings
    landmarks.forEach((loc, idx) => {
      const pos = latLonToVector3(loc.lat, loc.lon, globeRadius);
      pinPoints.push(pos);

      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pos);
      pinGroup.lookAt(0, 0, 0);

      // Elevated Beacon Marker
      const beaconGeom = new THREE.CylinderGeometry(0.08, 0.18, 1.4, 8);
      beaconGeom.rotateX(Math.PI / 2);
      const beaconMat = new THREE.MeshBasicMaterial({ color: loc.color });
      const beaconMesh = new THREE.Mesh(beaconGeom, beaconMat);
      beaconMesh.position.z = -0.7;
      pinGroup.add(beaconMesh);

      // Glowing Sphere on top
      const tipGeom = new THREE.SphereGeometry(0.3, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({ color: loc.color });
      const tipMesh = new THREE.Mesh(tipGeom, tipMat);
      tipMesh.position.z = -1.4;
      pinGroup.add(tipMesh);

      // Radar Wave Ring
      const ringGeom = new THREE.RingGeometry(0.2, 0.5, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: loc.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const radarRing = new THREE.Mesh(ringGeom, ringMat);
      pinGroup.add(radarRing);

      globeGroup.add(pinGroup);

      loc.radarRing = radarRing;
    });

    // --- ANIMATED 3D GEODESIC FLIGHT TRACKING ARC LINE ---
    // Connects School ➔ Diploma ➔ BE College
    const curvePoints = [];
    for (let i = 0; i < pinPoints.length - 1; i++) {
      const p1 = pinPoints[i];
      const p2 = pinPoints[i + 1];

      // Elevated midpoint for bezier arc
      const mid = p1.clone().lerp(p2, 0.5);
      mid.normalize().multiplyScalar(globeRadius * 1.18);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const pts = curve.getPoints(30);
      curvePoints.push(...pts);
    }

    const arcGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
      transparent: true,
      opacity: 0.85
    });
    const arcLine = new THREE.Line(arcGeom, arcMat);
    globeGroup.add(arcLine);

    // Pulse Tracker Particle along the arc
    const pulseGeom = new THREE.SphereGeometry(0.32, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
    globeGroup.add(pulseMesh);

    // Initial globe orientation (rotates so India/Tamil Nadu is facing camera)
    // India is around Lon ~ 77E, Lat ~ 10N
    const targetYRotation = -Math.PI * 0.42;
    const targetXRotation = 0.22;
    globeGroup.rotation.y = targetYRotation;
    globeGroup.rotation.x = targetXRotation;

    // --- SCROLL INTERACTION ENGINE ---
    // Smoothly rotates globe while user scrolls down the page
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = window.pageYOffset / (totalScroll || 1);
    });

    // Focus India Button
    const focusBtn = document.getElementById('btn-focus-india');
    if (focusBtn) {
      focusBtn.addEventListener('click', () => {
        globeGroup.rotation.y = targetYRotation;
        globeGroup.rotation.x = targetXRotation;
        camera.position.set(0, 14, 34);
        if (window.showToast) window.showToast('🎯 Focused on Tamil Nadu (Vickramasingapuram ➔ Alangulam ➔ Coimbatore)');
      });
    }

    // --- RENDER LOOP ---
    let animClock = new THREE.Clock();
    function animateGlobe() {
      requestAnimationFrame(animateGlobe);
      const t = animClock.getElapsedTime();

      // Subtle dynamic rotation synced with scroll
      globeGroup.rotation.y = targetYRotation + Math.sin(t * 0.5) * 0.12 + scrollProgress * 1.8;

      // Pulse Radar Rings on landmarks
      landmarks.forEach((loc, idx) => {
        if (loc.radarRing) {
          const s = 1 + Math.sin(t * 3 + idx * 1.5) * 0.5;
          loc.radarRing.scale.set(s, s, s);
          loc.radarRing.material.opacity = Math.max(0, 0.9 - (s - 1));
        }
      });

      // Move flight pulse particle along curve points
      if (curvePoints.length > 0) {
        const loopT = (t * 0.4) % 1;
        const index = Math.floor(loopT * (curvePoints.length - 1));
        pulseMesh.position.copy(curvePoints[index]);
      }

      renderer.render(scene, camera);
    }

    animateGlobe();

    globeApp = {
      focusTamilNadu: () => {
        globeGroup.rotation.y = targetYRotation;
        globeGroup.rotation.x = targetXRotation;
      }
    };

    window.TGGlobe = globeApp;
  }
})();
