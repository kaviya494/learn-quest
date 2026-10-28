/**
 * AI Peer Teaching Kit - Hero 3D Scene (Three.js)
 * Procedural low-poly Robot and Doll characters in Deep Burgundy (#6D1128)
 * with Gold (#C9A24B) trim, floating and reacting to mouse movement.
 * Zero external textures/files to ensure 100% offline file:/// compatibility.
 */

class HeroScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.robotGroup = null;
    this.dollGroup = null;
    this.particles = null;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();
    this.isHovered = false;

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const rect = this.canvas.getBoundingClientRect();
    const aspect = (rect.width || 600) / (rect.height || 520);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0.6, 9.5);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(rect.width || 600, rect.height || 520);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lighting - Palace warm luxury ambiance
    const ambientLight = new THREE.AmbientLight(0xF4E8D1, 0.85);
    this.scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xFFE4A0, 1.2);
    goldKeyLight.position.set(4, 6, 6);
    goldKeyLight.castShadow = true;
    this.scene.add(goldKeyLight);

    const rimLight = new THREE.DirectionalLight(0xC9A24B, 0.7);
    rimLight.position.set(-5, 4, -4);
    this.scene.add(rimLight);

    const warmFill = new THREE.PointLight(0x6D1128, 0.9, 12);
    warmFill.position.set(0, -2, 3);
    this.scene.add(warmFill);

    // 5. Materials
    this.burgundyMat = new THREE.MeshStandardMaterial({
      color: 0x6D1128,
      roughness: 0.38,
      metalness: 0.22
    });

    this.burgundyDarkMat = new THREE.MeshStandardMaterial({
      color: 0x480918,
      roughness: 0.5,
      metalness: 0.15
    });

    this.goldMat = new THREE.MeshStandardMaterial({
      color: 0xC9A24B,
      roughness: 0.25,
      metalness: 0.85
    });

    this.porcelainMat = new THREE.MeshStandardMaterial({
      color: 0xF7EDE2,
      roughness: 0.45,
      metalness: 0.05
    });

    this.glowGoldMat = new THREE.MeshBasicMaterial({
      color: 0xFFE07A
    });

    this.glowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x8BE9FD
    });

    // 6. Build Characters
    this.buildRobot();
    this.buildDoll();
    this.buildLibraryParticles();

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // 8. Start Animation Loop
    this.animate();
  }

  buildRobot() {
    this.robotGroup = new THREE.Group();

    // -- Robot Head --
    const headGeom = new THREE.BoxGeometry(1.2, 1.0, 1.0);
    const head = new THREE.Mesh(headGeom, this.burgundyMat);
    head.position.y = 1.35;
    this.robotGroup.add(head);

    // Gold Trim on Head (Top plate)
    const headPlateGeom = new THREE.BoxGeometry(1.26, 0.08, 1.06);
    const headPlate = new THREE.Mesh(headPlateGeom, this.goldMat);
    headPlate.position.set(0, 0.52, 0);
    head.add(headPlate);

    // Visor / Eyes
    const visorGeom = new THREE.BoxGeometry(0.85, 0.24, 0.12);
    const visorFrame = new THREE.Mesh(visorGeom, this.goldMat);
    visorFrame.position.set(0, 0.05, 0.52);
    head.add(visorFrame);

    const eyeGeom = new THREE.BoxGeometry(0.72, 0.14, 0.05);
    const eyes = new THREE.Mesh(eyeGeom, this.glowGoldMat);
    eyes.position.set(0, 0, 0.06);
    visorFrame.add(eyes);

    // Antenna
    const antPoleGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8);
    const antPole = new THREE.Mesh(antPoleGeom, this.goldMat);
    antPole.position.set(0, 0.75, 0);
    head.add(antPole);

    const antOrbGeom = new THREE.SphereGeometry(0.12, 12, 12);
    const antOrb = new THREE.Mesh(antOrbGeom, this.glowGoldMat);
    antOrb.position.set(0, 0.25, 0);
    antPole.add(antOrb);

    // Ear bolts / dials
    const earGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.15, 12);
    earGeom.rotateZ(Math.PI / 2);
    const earL = new THREE.Mesh(earGeom, this.goldMat);
    earL.position.set(-0.65, 0.05, 0);
    head.add(earL);

    const earR = new THREE.Mesh(earGeom, this.goldMat);
    earR.position.set(0.65, 0.05, 0);
    head.add(earR);

    // Neck ring
    const neckGeom = new THREE.CylinderGeometry(0.3, 0.35, 0.25, 12);
    const neck = new THREE.Mesh(neckGeom, this.goldMat);
    neck.position.y = 0.75;
    this.robotGroup.add(neck);

    // -- Robot Torso --
    const bodyGeom = new THREE.CylinderGeometry(0.85, 0.65, 1.4, 8);
    const body = new THREE.Mesh(bodyGeom, this.burgundyMat);
    body.position.y = 0.0;
    this.robotGroup.add(body);

    // Gold Chestplate Medallion (Royal Gear / Crest)
    const crestGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 6);
    crestGeom.rotateX(Math.PI / 2);
    const crest = new THREE.Mesh(crestGeom, this.goldMat);
    crest.position.set(0, 0.2, 0.68);
    body.add(crest);

    const coreLightGeom = new THREE.SphereGeometry(0.12, 12, 12);
    const coreLight = new THREE.Mesh(coreLightGeom, this.glowCyanMat);
    coreLight.position.set(0, 0, 0.05);
    crest.add(coreLight);

    // Gold Waist Band
    const beltGeom = new THREE.TorusGeometry(0.68, 0.08, 8, 24);
    beltGeom.rotateX(Math.PI / 2);
    const belt = new THREE.Mesh(beltGeom, this.goldMat);
    belt.position.y = -0.55;
    body.add(belt);

    // -- Robot Arms --
    // Left Arm (holding scholar wand / pointer)
    const shoulderGeom = new THREE.SphereGeometry(0.24, 12, 12);
    const shoulderL = new THREE.Mesh(shoulderGeom, this.goldMat);
    shoulderL.position.set(-0.95, 0.45, 0);
    this.robotGroup.add(shoulderL);

    const armLGeom = new THREE.CylinderGeometry(0.12, 0.1, 0.7, 8);
    const armL = new THREE.Mesh(armLGeom, this.burgundyMat);
    armL.position.set(-0.25, -0.4, 0.1);
    armL.rotation.z = 0.35;
    shoulderL.add(armL);

    // Right Arm (raised warmly in greeting)
    const shoulderR = new THREE.Mesh(shoulderGeom, this.goldMat);
    shoulderR.position.set(0.95, 0.45, 0);
    this.robotGroup.add(shoulderR);

    const armRGeom = new THREE.CylinderGeometry(0.12, 0.1, 0.65, 8);
    const armR = new THREE.Mesh(armRGeom, this.burgundyMat);
    armR.position.set(0.25, -0.2, 0.25);
    armR.rotation.z = -0.8;
    armR.rotation.x = -0.4;
    shoulderR.add(armR);

    const handRGeom = new THREE.SphereGeometry(0.14, 8, 8);
    const handR = new THREE.Mesh(handRGeom, this.goldMat);
    handR.position.set(0, -0.38, 0);
    armR.add(handR);

    // -- Base Thruster / Floating Repulsor Disk --
    const repulsorGeom = new THREE.CylinderGeometry(0.6, 0.25, 0.3, 16);
    const repulsor = new THREE.Mesh(repulsorGeom, this.goldMat);
    repulsor.position.y = -0.9;
    this.robotGroup.add(repulsor);

    const ringGeom = new THREE.TorusGeometry(0.72, 0.05, 8, 24);
    ringGeom.rotateX(Math.PI / 2);
    const glowRing = new THREE.Mesh(ringGeom, this.glowGoldMat);
    glowRing.position.y = -1.05;
    this.robotGroup.add(glowRing);

    // Position in hero scene (Left side)
    this.robotGroup.position.set(-2.0, 0.2, 0);
    this.robotGroup.rotation.y = 0.3;
    this.scene.add(this.robotGroup);
  }

  buildDoll() {
    this.dollGroup = new THREE.Group();

    // -- Doll Head --
    const headGeom = new THREE.SphereGeometry(0.75, 24, 24);
    const head = new THREE.Mesh(headGeom, this.porcelainMat);
    head.position.y = 1.25;
    this.dollGroup.add(head);

    // Stylized Burgundy Royal Hair & Buns
    const hairCapGeom = new THREE.SphereGeometry(0.78, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairCap = new THREE.Mesh(hairCapGeom, this.burgundyDarkMat);
    hairCap.rotation.x = -0.2;
    head.add(hairCap);

    // Hair Buns with Gold Pins
    const bunGeom = new THREE.SphereGeometry(0.28, 14, 14);
    const bunL = new THREE.Mesh(bunGeom, this.burgundyDarkMat);
    bunL.position.set(-0.62, 0.55, -0.15);
    head.add(bunL);

    const bunR = new THREE.Mesh(bunGeom, this.burgundyDarkMat);
    bunR.position.set(0.62, 0.55, -0.15);
    head.add(bunR);

    // Royal Gold Tiara / Crown
    const tiaraGeom = new THREE.CylinderGeometry(0.45, 0.48, 0.2, 5);
    const tiara = new THREE.Mesh(tiaraGeom, this.goldMat);
    tiara.position.set(0, 0.82, 0.05);
    head.add(tiara);

    const tiaraGemGeom = new THREE.OctahedronGeometry(0.1, 0);
    const tiaraGem = new THREE.Mesh(tiaraGemGeom, this.glowGoldMat);
    tiaraGem.position.set(0, 0.15, 0.42);
    tiara.add(tiaraGem);

    // Delicate Eyes & Rosy cheeks
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x3E0A17 });
    const eyeGeom = new THREE.SphereGeometry(0.08, 10, 10);
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
    eyeL.position.set(-0.25, 0.05, 0.7);
    head.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
    eyeR.position.set(0.25, 0.05, 0.7);
    head.add(eyeR);

    const cheekMat = new THREE.MeshBasicMaterial({ color: 0xE8A598 });
    const cheekGeom = new THREE.SphereGeometry(0.1, 10, 10);
    const cheekL = new THREE.Mesh(cheekGeom, cheekMat);
    cheekL.position.set(-0.45, -0.15, 0.58);
    head.add(cheekL);

    const cheekR = new THREE.Mesh(cheekGeom, cheekMat);
    cheekR.position.set(0.45, -0.15, 0.58);
    head.add(cheekR);

    // Neck
    const neckGeom = new THREE.CylinderGeometry(0.2, 0.22, 0.25, 12);
    const neck = new THREE.Mesh(neckGeom, this.porcelainMat);
    neck.position.y = 0.65;
    this.dollGroup.add(neck);

    const necklaceGeom = new THREE.TorusGeometry(0.23, 0.03, 8, 20);
    necklaceGeom.rotateX(Math.PI / 2);
    const necklace = new THREE.Mesh(necklaceGeom, this.goldMat);
    necklace.position.y = 0.56;
    this.dollGroup.add(necklace);

    // -- Doll Torso / Royal Dress --
    const bodiceGeom = new THREE.CylinderGeometry(0.42, 0.5, 0.8, 12);
    const bodice = new THREE.Mesh(bodiceGeom, this.burgundyMat);
    bodice.position.y = 0.2;
    this.dollGroup.add(bodice);

    // Gold Corset Embroidery Ribbons
    const ribbonGeom = new THREE.BoxGeometry(0.12, 0.7, 0.86);
    const ribbon = new THREE.Mesh(ribbonGeom, this.goldMat);
    bodice.add(ribbon);

    // Royal Gown Skirt
    const skirtGeom = new THREE.CylinderGeometry(0.48, 1.35, 1.7, 16);
    const skirt = new THREE.Mesh(skirtGeom, this.burgundyMat);
    skirt.position.y = -0.95;
    this.dollGroup.add(skirt);

    // Gold Hem Ring
    const hemGeom = new THREE.TorusGeometry(1.36, 0.06, 8, 24);
    hemGeom.rotateX(Math.PI / 2);
    const hem = new THREE.Mesh(hemGeom, this.goldMat);
    hem.position.y = -1.78;
    this.dollGroup.add(hem);

    // Floating Magical Open Book
    this.dollBook = new THREE.Group();
    const bookCoverGeom = new THREE.BoxGeometry(0.9, 0.04, 0.65);
    const bookCoverL = new THREE.Mesh(bookCoverGeom, this.burgundyDarkMat);
    bookCoverL.position.set(-0.4, 0, 0);
    bookCoverL.rotation.z = 0.2;
    this.dollBook.add(bookCoverL);

    const bookCoverR = new THREE.Mesh(bookCoverGeom, this.burgundyDarkMat);
    bookCoverR.position.set(0.4, 0, 0);
    bookCoverR.rotation.z = -0.2;
    this.dollBook.add(bookCoverR);

    const pageGeom = new THREE.BoxGeometry(0.82, 0.03, 0.58);
    const pageMat = new THREE.MeshBasicMaterial({ color: 0xFDFBF7 });
    const pageL = new THREE.Mesh(pageGeom, pageMat);
    pageL.position.set(-0.38, 0.03, 0);
    pageL.rotation.z = 0.2;
    this.dollBook.add(pageL);

    const pageR = new THREE.Mesh(pageGeom, pageMat);
    pageR.position.set(0.38, 0.03, 0);
    pageR.rotation.z = -0.2;
    this.dollBook.add(pageR);

    // Glowing Rune Core in book
    const runeGeom = new THREE.OctahedronGeometry(0.12, 0);
    const runeMesh = new THREE.Mesh(runeGeom, this.glowGoldMat);
    runeMesh.position.set(0, 0.15, 0);
    this.dollBook.add(runeMesh);

    this.dollBook.position.set(-0.6, -0.15, 0.95);
    this.dollBook.rotation.set(0.3, 0.4, -0.1);
    this.dollGroup.add(this.dollBook);

    // Position in hero scene (Right side)
    this.dollGroup.position.set(2.0, 0.2, 0);
    this.dollGroup.rotation.y = -0.3;
    this.scene.add(this.dollGroup);
  }

  buildLibraryParticles() {
    // 160 glowing golden ambient library motes
    const count = 160;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random() * 0.08 + 0.03;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xC9A24B,
      size: 0.1,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geom, pMat);
    this.scene.add(this.particles);
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      this.mouse.targetX = (x / rect.width) * 2 - 1;
      this.mouse.targetY = -(y / rect.height) * 2 + 1;
    } else {
      // Gentle subtle return to center
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    }
  }

  onResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 520;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Harmonic floating bobbing
    if (this.robotGroup) {
      this.robotGroup.position.y = 0.2 + Math.sin(elapsed * 1.6) * 0.14;
      this.robotGroup.rotation.y = 0.25 + this.mouse.x * 0.35;
      this.robotGroup.rotation.x = -this.mouse.y * 0.2;
    }

    if (this.dollGroup) {
      this.dollGroup.position.y = 0.2 + Math.cos(elapsed * 1.5) * 0.13;
      this.dollGroup.rotation.y = -0.25 + this.mouse.x * 0.32;
      this.dollGroup.rotation.x = -this.mouse.y * 0.18;

      if (this.dollBook) {
        this.dollBook.position.y = -0.15 + Math.sin(elapsed * 2.2) * 0.06;
        this.dollBook.rotation.y = 0.4 + Math.cos(elapsed * 1.8) * 0.08;
      }
    }

    // Drift ambient particles upwards
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += 0.005;
        if (pos[i] > 4.5) pos[i] = -4.5;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
      this.particles.rotation.y = elapsed * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.HeroScene = HeroScene;
