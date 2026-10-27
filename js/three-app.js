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
     2. 3D INTERACTIVE PHOTOREALISTIC SATELLITE GLOBE & TAMIL NADU GEO-TRACKING
     ========================================================================== */
  function initCyberGlobe() {
    const container = document.getElementById('cyber-globe-container');
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 32);

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

    // Target rotation to orient center of India (lat 21.8° N, lon 78.65° E) facing camera with North up
    const targetRotX = 0.16;
    const targetRotY = -2.9516;
    globeGroup.rotation.x = targetRotX;
    globeGroup.rotation.y = targetRotY;

    // Helper: Convert Lat/Lon to 3D Cartesian coordinates on sphere of radius R
    function latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(theta) * Math.sin(phi);
      return new THREE.Vector3(x, y, z);
    }

    // Helper: Create curved high-resolution patch geometry for South Asia / India
    function createCurvedPatchGeometry(minLat, maxLat, minLon, maxLon, radius, segX = 48, segY = 48) {
      const geo = new THREE.BufferGeometry();
      const positions = [];
      const uvs = [];
      const indices = [];

      for (let y = 0; y <= segY; y++) {
        const v = y / segY;
        const lat = maxLat - v * (maxLat - minLat);
        for (let x = 0; x <= segX; x++) {
          const u = x / segX;
          const lon = minLon + u * (maxLon - minLon);
          const p = latLonToVector3(lat, lon, radius);
          positions.push(p.x, p.y, p.z);
          uvs.push(u, 1 - v);
        }
      }

      for (let y = 0; y < segY; y++) {
        for (let x = 0; x < segX; x++) {
          const a = y * (segX + 1) + x;
          const b = (y + 1) * (segX + 1) + x;
          const c = a + 1;
          const d = b + 1;
          indices.push(a, b, c);
          indices.push(c, b, d);
        }
      }

      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    }

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 1. BASE PHOTOREALISTIC BLUE MARBLE EARTH SPHERE
    const sphereGeom = new THREE.SphereGeometry(globeRadius, 64, 64);
    const earthBaseMap = textureLoader.load('assets/globe/earth_blue_marble.jpg', () => {
      renderer.render(scene, camera);
    });
    if (THREE.SRGBColorSpace) earthBaseMap.colorSpace = THREE.SRGBColorSpace;

    const globeMat = new THREE.MeshStandardMaterial({
      map: earthBaseMap,
      roughness: 0.65,
      metalness: 0.12,
      color: 0xffffff
    });
    const globeMesh = new THREE.Mesh(sphereGeom, globeMat);
    globeGroup.add(globeMesh);

    // 2. ULTRA HIGH-DEFINITION SOUTH ASIA & INDIA SATELLITE OVERLAY
    // Extent: lon 35 to 108, lat 0 to 42
    const hdPatchGeo = createCurvedPatchGeometry(0, 42, 35, 108, globeRadius * 1.005, 56, 56);
    const hdPatchTexture = textureLoader.load('assets/globe/south_asia_hd.jpg', () => {
      renderer.render(scene, camera);
    });
    if (THREE.SRGBColorSpace) hdPatchTexture.colorSpace = THREE.SRGBColorSpace;

    const hdPatchMat = new THREE.MeshStandardMaterial({
      map: hdPatchTexture,
      roughness: 0.55,
      metalness: 0.08,
      transparent: true,
      opacity: 0.98
    });
    const hdPatchMesh = new THREE.Mesh(hdPatchGeo, hdPatchMat);
    globeGroup.add(hdPatchMesh);

    // 3. CLOUDS / ATMOSPHERE LAYER
    const cloudsTexture = textureLoader.load('assets/globe/earth_atmos_2048.jpg');
    const cloudsGeom = new THREE.SphereGeometry(globeRadius * 1.012, 48, 48);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeom, cloudsMat);
    globeGroup.add(cloudsMesh);

    // 4. ATMOSPHERIC HALO GLOW
    const atmosGeom = new THREE.SphereGeometry(globeRadius * 1.12, 32, 32);
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
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.02, 0.71, 0.83, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
    scene.add(atmosMesh);

    // 5. LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    sunLight.position.set(35, 25, 45);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-25, 10, 20);
    scene.add(fillLight);

    // 6. INDIAN STATE CENTROIDS (AS IN USER SCREENSHOT)
    const INDIAN_STATE_NODES = [
      { name: 'Delhi', shortName: '★ Delhi (Capital)', lat: 28.7041, lon: 77.1025, isCapital: true },
      { name: 'Punjab', shortName: 'Punjab', lat: 31.1471, lon: 75.3412 },
      { name: 'Himachal', shortName: 'Himachal', lat: 31.1048, lon: 77.1734 },
      { name: 'Uttarakhand', shortName: 'Uttarakhand', lat: 30.0668, lon: 79.0193 },
      { name: 'Rajasthan', shortName: 'Rajasthan', lat: 27.0238, lon: 74.2179 },
      { name: 'Gujarat', shortName: 'Gujarat', lat: 22.2587, lon: 71.1924 },
      { name: 'Maharashtra', shortName: 'Maharashtra', lat: 19.7515, lon: 75.7139 },
      { name: 'Karnataka', shortName: 'Karnataka', lat: 15.3173, lon: 75.7139 },
      { name: 'Telangana', shortName: 'Telangana', lat: 18.1124, lon: 79.0193 },
      { name: 'Andhra Pradesh', shortName: 'Andhra Pradesh', lat: 15.9129, lon: 79.7400 },
      { name: 'Kerala', shortName: 'Kerala', lat: 10.8505, lon: 76.2711 },
      { name: 'Tamil Nadu', shortName: '● Tamil Nadu (Hub)', lat: 11.1271, lon: 78.6569, isHub: true },
      { name: 'West Bengal', shortName: 'West Bengal', lat: 22.9868, lon: 87.8550 },
      { name: 'Odisha', shortName: 'Odisha', lat: 20.9517, lon: 85.0985 },
      { name: 'Uttar Pradesh', shortName: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
      { name: 'Bihar', shortName: 'Bihar', lat: 25.0961, lon: 85.3131 },
      { name: 'Assam', shortName: 'Assam', lat: 26.2006, lon: 92.9376 },
      { name: 'J&K', shortName: 'J&K', lat: 33.7782, lon: 76.5762 },
      { name: 'Ladakh', shortName: 'Ladakh', lat: 34.1526, lon: 77.5771 }
    ];

    // HTML Badges Container
    let badgesContainer = document.getElementById('globe-badges-overlay');
    if (!badgesContainer) {
      badgesContainer = document.createElement('div');
      badgesContainer.id = 'globe-badges-overlay';
      badgesContainer.className = 'globe-badges-overlay';
      container.style.position = 'relative';
      container.appendChild(badgesContainer);
    }
    badgesContainer.innerHTML = '';

    const stateElements = [];

    INDIAN_STATE_NODES.forEach((node) => {
      const pos = latLonToVector3(node.lat, node.lon, globeRadius * 1.012);
      const isDelhi = node.isCapital;

      // 3D Pin Head Mesh
      const pinHeadGeo = new THREE.SphereGeometry(isDelhi ? 0.16 : 0.10, 16, 16);
      const pinHeadMat = new THREE.MeshStandardMaterial({
        color: isDelhi ? 0xf59e0b : node.isHub ? 0x10b981 : 0x06b6d4,
        emissive: isDelhi ? 0xd97706 : node.isHub ? 0x059669 : 0x0284c7,
        emissiveIntensity: 1.8,
        roughness: 0.1,
        metalness: 0.9
      });
      const pinHeadMesh = new THREE.Mesh(pinHeadGeo, pinHeadMat);
      pinHeadMesh.position.copy(pos);
      globeGroup.add(pinHeadMesh);

      // 3D Stem
      const surfacePos = latLonToVector3(node.lat, node.lon, globeRadius * 1.002);
      const stemGeo = new THREE.BufferGeometry().setFromPoints([pos, surfacePos]);
      const stemMat = new THREE.LineBasicMaterial({
        color: isDelhi ? 0xf59e0b : 0x38bdf8,
        transparent: true,
        opacity: 0.7
      });
      const stemLine = new THREE.Line(stemGeo, stemMat);
      globeGroup.add(stemLine);

      // Radar ping ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.22, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isDelhi ? 0xf59e0b : 0x06b6d4,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);

      // Screen-projected HTML Badge
      const badgeBtn = document.createElement('button');
      badgeBtn.className = `globe-state-badge ${isDelhi ? 'capital' : node.isHub ? 'hub' : ''}`;
      badgeBtn.innerHTML = `
        <span class="badge-dot" style="background: ${isDelhi ? '#fde047' : node.isHub ? '#34d399' : '#38bdf8'}; width: 6px; height: 6px; border-radius: 50%; display: inline-block;"></span>
        <span>${node.shortName || node.name}</span>
      `;
      badgesContainer.appendChild(badgeBtn);

      stateElements.push({
        node,
        pos,
        badgeBtn,
        ringMesh
      });
    });

    // 7. TAMIL NADU EDUCATIONAL LANDMARKS
    // 1. School (10th & 12th): Andrews Mat. Hr. Sec. School, Vickramasingapuram (8.7183° N, 77.3693° E)
    // 2. Diploma College: M.S.P.V.N.L.T Polytechnic, Pavoorchatram, Alangulam (8.9056° N, 77.4125° E)
    // 3. BE College: SKCET (Cyber Security), Kuniyamuthur, Coimbatore (10.9388° N, 76.9558° E)
    const landmarks = [
      {
        id: 'school',
        name: 'Andrews Mat. Hr. Sec. School',
        short: '🏫 Andrews Mat. School (10th & 12th)',
        addr: '1F2 East Pudumanai Street, East Kottaram, Vickramasingapuram, TN 627422',
        link: 'https://maps.app.goo.gl/dNSiCFLMcVNGajAC8',
        lat: 8.7183,
        lon: 77.3693,
        color: 0x3b82f6
      },
      {
        id: 'diploma',
        name: 'M.S.P.V.N.L.T Polytechnic',
        short: '🎓 MSPVNLT Polytechnic (89%)',
        addr: '50/2, Pavoorchatram, Sivagamipuram, Alangulam, Tirunelveli, TN 627808',
        link: 'https://maps.app.goo.gl/ETNoeBc4VDjbEdLRA',
        lat: 8.9056,
        lon: 77.4125,
        color: 0x10b981
      },
      {
        id: 'be',
        name: 'SKCET (Cyber Security)',
        short: '🛡️ SKCET (BE Cyber Security)',
        addr: 'BK Pudur, Kuniyamuthur, Coimbatore, TN 641008',
        link: 'https://maps.app.goo.gl/yQcYfnzkx22DAReC9',
        lat: 10.9388,
        lon: 76.9558,
        color: 0x06b6d4
      }
    ];

    const pinPoints = [];
    const landmarkElements = [];

    landmarks.forEach((loc) => {
      const pos = latLonToVector3(loc.lat, loc.lon, globeRadius * 1.018);
      pinPoints.push(pos);

      // Elevated Glowing Beacon
      const beaconGeom = new THREE.CylinderGeometry(0.08, 0.18, 1.2, 8);
      beaconGeom.rotateX(Math.PI / 2);
      const beaconMat = new THREE.MeshBasicMaterial({ color: loc.color });
      const beaconMesh = new THREE.Mesh(beaconGeom, beaconMat);
      beaconMesh.position.copy(pos);
      beaconMesh.lookAt(0, 0, 0);
      globeGroup.add(beaconMesh);

      // Glowing Sphere on top
      const tipGeom = new THREE.SphereGeometry(0.24, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({ color: loc.color });
      const tipMesh = new THREE.Mesh(tipGeom, tipMat);
      tipMesh.position.copy(pos.clone().multiplyScalar(1.025));
      globeGroup.add(tipMesh);

      // Pulsing Radar Wave Ring
      const ringGeom = new THREE.RingGeometry(0.2, 0.55, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: loc.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const radarRing = new THREE.Mesh(ringGeom, ringMat);
      radarRing.position.copy(pos);
      radarRing.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(radarRing);

      // Screen-projected Landmark Badge
      const badgeBtn = document.createElement('button');
      badgeBtn.className = 'globe-state-badge landmark';
      badgeBtn.innerHTML = `
        <span class="badge-dot" style="background: #a7f3d0; width: 7px; height: 7px; border-radius: 50%; display: inline-block;"></span>
        <span>${loc.short}</span>
      `;
      badgeBtn.addEventListener('click', () => {
        window.open(loc.link, '_blank');
      });
      badgesContainer.appendChild(badgeBtn);

      landmarkElements.push({
        loc,
        pos,
        badgeBtn,
        radarRing
      });
    });

    // 8. ANIMATED 3D GEODESIC FLIGHT TRACKING ARC LINE
    // Connects School ➔ Diploma ➔ BE College
    const curvePoints = [];
    for (let i = 0; i < pinPoints.length - 1; i++) {
      const p1 = pinPoints[i];
      const p2 = pinPoints[i + 1];

      // Elevated midpoint for bezier arc
      const mid = p1.clone().lerp(p2, 0.5);
      mid.normalize().multiplyScalar(globeRadius * 1.15);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const pts = curve.getPoints(32);
      curvePoints.push(...pts);
    }

    const arcGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
      transparent: true,
      opacity: 0.95
    });
    const arcLine = new THREE.Line(arcGeom, arcMat);
    globeGroup.add(arcLine);

    // Pulse Tracker Particle along the arc
    const pulseGeom = new THREE.SphereGeometry(0.3, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
    globeGroup.add(pulseMesh);

    // 9. COSMIC STARDUST PARTICLES (Surrounding Earth)
    const particleCount = 800;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const rad = globeRadius * 1.3 + Math.random() * globeRadius * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = rad * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 10. DRAG & SCROLL INTERACTION
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let manualRotY = 0;
    let manualRotX = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      manualRotY += deltaX * 0.005;
      manualRotX += deltaY * 0.005;
      manualRotX = Math.max(-0.6, Math.min(0.8, manualRotX));
    });

    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = window.pageYOffset / (totalScroll || 1);
    });

    // Focus India Button
    const focusBtn = document.getElementById('btn-focus-india');
    if (focusBtn) {
      focusBtn.addEventListener('click', () => {
        manualRotX = 0;
        manualRotY = 0;
        globeGroup.rotation.x = targetRotX;
        globeGroup.rotation.y = targetRotY;
        camera.position.set(0, 8, 38);
        if (window.showToast) window.showToast('🎯 Focused on Tamil Nadu (Vickramasingapuram ➔ Alangulam ➔ Coimbatore)');
      });
    }

    const rotateBtn = document.getElementById('btn-rotate-globe');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        manualRotY += Math.PI * 0.5;
        if (window.showToast) window.showToast('🔄 Globe Rotated 90°');
      });
    }

    const askRobotBtn = document.getElementById('btn-ask-robot-globe');
    if (askRobotBtn) {
      askRobotBtn.addEventListener('click', () => {
        if (window.TGBotAI) {
          window.TGBotAI.open();
          window.TGBotAI.ask('Tell me about your Tamil Nadu education pathway and locations');
        }
      });
    }

    // Helper: Update 2D Screen Projection of State and Landmark Badges
    const tempVec = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const normal = new THREE.Vector3();

    function updateBadgePositions() {
      const curW = container.clientWidth || 700;
      const curH = container.clientHeight || 520;

      // Update state badges
      stateElements.forEach((item) => {
        tempVec.copy(item.pos);
        tempVec.applyMatrix4(globeGroup.matrixWorld);

        camDir.copy(camera.position).sub(tempVec).normalize();
        normal.copy(tempVec).sub(globeGroup.position).normalize();
        const dot = normal.dot(camDir);
        tempVec.project(camera);

        const isFacing = dot > 0.35 && tempVec.z < 1.0;
        const screenX = (tempVec.x * 0.5 + 0.5) * curW;
        const screenY = (-tempVec.y * 0.5 + 0.5) * curH;

        if (!isFacing || screenX < -20 || screenX > curW + 20 || screenY < -20 || screenY > curH + 20) {
          item.badgeBtn.style.display = 'none';
        } else {
          item.badgeBtn.style.display = 'inline-flex';
          item.badgeBtn.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -130%)`;
        }
      });

      // Update landmark badges
      landmarkElements.forEach((item) => {
        tempVec.copy(item.pos);
        tempVec.applyMatrix4(globeGroup.matrixWorld);

        camDir.copy(camera.position).sub(tempVec).normalize();
        normal.copy(tempVec).sub(globeGroup.position).normalize();
        const dot = normal.dot(camDir);
        tempVec.project(camera);

        const isFacing = dot > 0.30 && tempVec.z < 1.0;
        const screenX = (tempVec.x * 0.5 + 0.5) * curW;
        const screenY = (-tempVec.y * 0.5 + 0.5) * curH;

        if (!isFacing || screenX < -20 || screenX > curW + 20 || screenY < -20 || screenY > curH + 20) {
          item.badgeBtn.style.display = 'none';
        } else {
          item.badgeBtn.style.display = 'inline-flex';
          item.badgeBtn.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -150%)`;
        }
      });
    }

    // --- RENDER LOOP ---
    let animClock = new THREE.Clock();
    function animateGlobe() {
      requestAnimationFrame(animateGlobe);
      const t = animClock.getElapsedTime();

      // Atmospheric clouds gentle drift
      cloudsMesh.rotation.y = t * 0.02;

      // Rotation synced with scroll (centered on India when viewing globe section)
      const scrollOffset = (scrollProgress - 0.65) * 0.6;
      globeGroup.rotation.y = targetRotY + manualRotY + Math.sin(t * 0.3) * 0.03 + scrollOffset;
      globeGroup.rotation.x = targetRotX + manualRotX;

      // Radar ping wave pulsation
      stateElements.forEach((item, idx) => {
        if (item.ringMesh) {
          const s = 1.0 + Math.sin(t * 3.0 + idx * 0.4) * 0.35;
          item.ringMesh.scale.set(s, s, 1.0);
        }
      });

      landmarkElements.forEach((item, idx) => {
        if (item.radarRing) {
          const s = 1.0 + Math.sin(t * 3.5 + idx * 1.2) * 0.45;
          item.radarRing.scale.set(s, s, 1.0);
          item.radarRing.material.opacity = Math.max(0.1, 0.9 - (s - 1.0));
        }
      });

      // Move flight trajectory pulse particle along curve points
      if (curvePoints.length > 0) {
        const loopT = (t * 0.35) % 1;
        const index = Math.floor(loopT * (curvePoints.length - 1));
        pulseMesh.position.copy(curvePoints[index]);
      }

      // Space particles rotation
      particleSystem.rotation.y = t * 0.015;

      // Update Screen Badges
      updateBadgePositions();

      renderer.render(scene, camera);
    }

    animateGlobe();

    globeApp = {
      focusTamilNadu: () => {
        manualRotX = 0;
        manualRotY = 0;
        globeGroup.rotation.y = targetRotY;
        globeGroup.rotation.x = targetRotX;
        camera.position.set(0, 1.8, 32);
        if (window.playSynthSound) window.playSynthSound('blip', 700, 0.08);
        if (window.showToast) window.showToast('3D Radar Centered: Tamil Nadu Academic Hub');
      },
      focusState: (stateName) => {
        const found = INDIAN_STATE_NODES.find(n => n.name.toLowerCase().includes(stateName.toLowerCase()));
        if (found) {
          manualRotX = 0;
          manualRotY = 0;
          globeGroup.rotation.x = (found.lat * Math.PI / 180) * 0.45;
          globeGroup.rotation.y = -(found.lon * Math.PI / 180) - Math.PI / 2 + 0.45;
          camera.position.set(0, 1.8, 32);
          if (window.playSynthSound) window.playSynthSound('blip', 650, 0.08);
          if (window.showToast) window.showToast(`3D Radar Centered: ${found.name}`);
        }
      }
    };

    window.TGGlobe = globeApp;
  }
})();
