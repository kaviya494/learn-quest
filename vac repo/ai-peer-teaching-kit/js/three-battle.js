/**
 * AI Peer Teaching Kit - Quiz Battle 3D Arena (Three.js)
 * Robot and Doll facing off on a royal dueling dais with live visual effects.
 * Correct answers power up the Doll with golden energy; wrong answers trigger Robot points.
 */

class BattleScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.robotFighter = null;
    this.dollFighter = null;
    this.arenaDais = null;
    this.energyBeam = null;
    this.dollAura = null;
    this.sparks = [];

    this.clock = new THREE.Clock();
    this.actionTimer = 0;
    this.activeAction = null; // 'doll-power' or 'robot-strike'

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const rect = this.canvas.getBoundingClientRect();
    const aspect = (rect.width || 700) / (rect.height || 380);
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.set(0, 2.2, 9.8);
    this.camera.lookAt(0, 0.4, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(rect.width || 700, rect.height || 380);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    // Lighting
    const ambient = new THREE.AmbientLight(0xF4E8D1, 0.9);
    this.scene.add(ambient);

    this.arenaSpot = new THREE.SpotLight(0xFFE4A0, 2.0, 25, Math.PI / 4, 0.4);
    this.arenaSpot.position.set(0, 9, 3);
    this.arenaSpot.castShadow = true;
    this.scene.add(this.arenaSpot);

    const sideFill = new THREE.DirectionalLight(0x6D1128, 0.8);
    sideFill.position.set(-6, 3, 2);
    this.scene.add(sideFill);

    // Common Materials
    this.burgundyMat = new THREE.MeshStandardMaterial({ color: 0x6D1128, roughness: 0.35, metalness: 0.3 });
    this.goldMat = new THREE.MeshStandardMaterial({ color: 0xC9A24B, roughness: 0.2, metalness: 0.85 });
    this.porcelainMat = new THREE.MeshStandardMaterial({ color: 0xF8EFE6, roughness: 0.4 });
    this.glowGoldMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.85 });
    this.glowCyanMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.85 });

    this.buildArenaStage();
    this.buildFighters();
    this.buildVFX();

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  buildArenaStage() {
    this.arenaDais = new THREE.Group();

    // Central circular marble stone platform
    const stoneGeom = new THREE.CylinderGeometry(5.2, 5.5, 0.5, 32);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xDCD5C6, roughness: 0.65 });
    const stone = new THREE.Mesh(stoneGeom, stoneMat);
    stone.position.y = -1.0;
    stone.receiveShadow = true;
    this.arenaDais.add(stone);

    // Inlaid Gold Border Ring
    const goldRingGeom = new THREE.TorusGeometry(5.0, 0.08, 8, 48);
    goldRingGeom.rotateX(Math.PI / 2);
    const goldRing = new THREE.Mesh(goldRingGeom, this.goldMat);
    goldRing.position.y = -0.74;
    this.arenaDais.add(goldRing);

    // Inner gold concentric ring
    const innerRingGeom = new THREE.TorusGeometry(3.0, 0.05, 8, 36);
    innerRingGeom.rotateX(Math.PI / 2);
    const innerRing = new THREE.Mesh(innerRingGeom, this.goldMat);
    innerRing.position.y = -0.74;
    this.arenaDais.add(innerRing);

    // Left Fighter Pedestal (Robot)
    const pedLGeom = new THREE.CylinderGeometry(1.2, 1.35, 0.3, 24);
    const pedL = new THREE.Mesh(pedLGeom, this.burgundyMat);
    pedL.position.set(-2.5, -0.6, 0);
    this.arenaDais.add(pedL);

    const pedLTrim = new THREE.TorusGeometry(1.22, 0.04, 6, 24);
    pedLTrim.rotateX(Math.PI / 2);
    const pedLTrimMesh = new THREE.Mesh(pedLTrim, this.goldMat);
    pedLTrimMesh.position.set(-2.5, -0.45, 0);
    this.arenaDais.add(pedLTrimMesh);

    // Right Fighter Pedestal (Doll)
    const pedRGeom = new THREE.CylinderGeometry(1.2, 1.35, 0.3, 24);
    const pedR = new THREE.Mesh(pedRGeom, this.burgundyMat);
    pedR.position.set(2.5, -0.6, 0);
    this.arenaDais.add(pedR);

    const pedRTrim = new THREE.TorusGeometry(1.22, 0.04, 6, 24);
    pedRTrim.rotateX(Math.PI / 2);
    const pedRTrimMesh = new THREE.Mesh(pedRTrim, this.goldMat);
    pedRTrimMesh.position.set(2.5, -0.45, 0);
    this.arenaDais.add(pedRTrimMesh);

    this.scene.add(this.arenaDais);
  }

  buildFighters() {
    // 1. Robot on the left
    this.robotFighter = new THREE.Group();

    // Body
    const rBodyGeom = new THREE.CylinderGeometry(0.7, 0.55, 1.2, 8);
    const rBody = new THREE.Mesh(rBodyGeom, this.burgundyMat);
    rBody.position.y = 0.6;
    this.robotFighter.add(rBody);

    // Chest Core
    const rCoreGeom = new THREE.SphereGeometry(0.18, 12, 12);
    this.robotCore = new THREE.Mesh(rCoreGeom, this.glowCyanMat);
    this.robotCore.position.set(0, 0.7, 0.55);
    this.robotFighter.add(this.robotCore);

    // Head
    const rHeadGeom = new THREE.BoxGeometry(0.9, 0.75, 0.8);
    const rHead = new THREE.Mesh(rHeadGeom, this.burgundyMat);
    rHead.position.y = 1.6;
    this.robotFighter.add(rHead);

    const rVisorGeom = new THREE.BoxGeometry(0.65, 0.18, 0.1);
    this.robotVisor = new THREE.Mesh(rVisorGeom, this.glowGoldMat);
    this.robotVisor.position.set(0, 1.6, 0.42);
    this.robotFighter.add(this.robotVisor);

    // Antenna
    const rAntGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6);
    const rAnt = new THREE.Mesh(rAntGeom, this.goldMat);
    rAnt.position.set(0, 2.15, 0);
    this.robotFighter.add(rAnt);

    // Robot Staff / Pointer
    const staffGeom = new THREE.CylinderGeometry(0.03, 0.03, 2.0, 8);
    const staff = new THREE.Mesh(staffGeom, this.goldMat);
    staff.position.set(0.6, 0.8, 0.3);
    staff.rotation.z = -0.3;
    this.robotFighter.add(staff);

    const staffTipGeom = new THREE.OctahedronGeometry(0.12, 0);
    this.staffTip = new THREE.Mesh(staffTipGeom, this.glowCyanMat);
    this.staffTip.position.set(0.9, 1.7, 0.3);
    this.robotFighter.add(this.staffTip);

    this.robotFighter.position.set(-2.5, 0, 0);
    this.robotFighter.rotation.y = 0.5; // Face rightwards towards Doll
    this.scene.add(this.robotFighter);

    // 2. Doll on the right
    this.dollFighter = new THREE.Group();

    // Porcelain Head
    const dHeadGeom = new THREE.SphereGeometry(0.6, 20, 20);
    const dHead = new THREE.Mesh(dHeadGeom, this.porcelainMat);
    dHead.position.y = 1.5;
    this.dollFighter.add(dHead);

    // Crown Tiara
    const dTiaraGeom = new THREE.CylinderGeometry(0.35, 0.38, 0.15, 6);
    const dTiara = new THREE.Mesh(dTiaraGeom, this.goldMat);
    dTiara.position.set(0, 2.0, 0);
    this.dollFighter.add(dTiara);

    // Dress Skirt
    const dSkirtGeom = new THREE.CylinderGeometry(0.4, 1.1, 1.4, 14);
    const dSkirt = new THREE.Mesh(dSkirtGeom, this.burgundyMat);
    dSkirt.position.y = 0.3;
    this.dollFighter.add(dSkirt);

    const dGoldHem = new THREE.TorusGeometry(1.12, 0.04, 6, 24);
    dGoldHem.rotateX(Math.PI / 2);
    const dGoldHemMesh = new THREE.Mesh(dGoldHem, this.goldMat);
    dGoldHemMesh.position.y = -0.4;
    this.dollFighter.add(dGoldHemMesh);

    // Floating Shield Book
    this.dollShieldBook = new THREE.Group();
    const bGeom = new THREE.BoxGeometry(0.7, 0.9, 0.12);
    const bMesh = new THREE.Mesh(bGeom, this.goldMat);
    this.dollShieldBook.add(bMesh);

    const bCoreGeom = new THREE.OctahedronGeometry(0.14, 0);
    const bCore = new THREE.Mesh(bCoreGeom, this.glowGoldMat);
    bCore.position.z = 0.08;
    this.dollShieldBook.add(bCore);

    this.dollShieldBook.position.set(-0.6, 0.9, 0.4);
    this.dollShieldBook.rotation.y = -0.4;
    this.dollFighter.add(this.dollShieldBook);

    this.dollFighter.position.set(2.5, 0, 0);
    this.dollFighter.rotation.y = -0.5; // Face leftwards towards Robot
    this.scene.add(this.dollFighter);
  }

  buildVFX() {
    // 1. Golden Power Aura for Doll
    const auraGeom = new THREE.SphereGeometry(1.5, 16, 16);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xFFDF70,
      transparent: true,
      opacity: 0,
      wireframe: true
    });
    this.dollAura = new THREE.Mesh(auraGeom, auraMat);
    this.dollAura.position.set(2.5, 0.8, 0);
    this.scene.add(this.dollAura);

    // 2. Energy Beam from Robot to Doll
    const beamGeom = new THREE.CylinderGeometry(0.06, 0.06, 5.0, 8);
    beamGeom.rotateZ(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      transparent: true,
      opacity: 0
    });
    this.energyBeam = new THREE.Mesh(beamGeom, beamMat);
    this.energyBeam.position.set(0, 1.2, 0);
    this.scene.add(this.energyBeam);
  }

  // Triggered when user answers correctly
  triggerDollPowerUp() {
    this.activeAction = 'doll-power';
    this.actionTimer = 1.6;

    if (this.dollAura) {
      this.dollAura.material.opacity = 0.75;
      this.dollAura.scale.set(1.0, 1.0, 1.0);
    }

    if (window.soundFx) {
      window.soundFx.playPowerUp();
    }
  }

  // Triggered when user answers incorrectly
  triggerRobotStrike() {
    this.activeAction = 'robot-strike';
    this.actionTimer = 1.4;

    if (this.energyBeam) {
      this.energyBeam.material.opacity = 0.85;
      this.energyBeam.scale.set(1, 1, 1);
    }
  }

  onResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || 700;
    const height = rect.height || 380;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Gentle base hover animations
    if (this.robotFighter) {
      this.robotFighter.position.y = Math.sin(elapsed * 2.0) * 0.08;
    }
    if (this.dollFighter) {
      this.dollFighter.position.y = Math.cos(elapsed * 2.2) * 0.08;
    }

    // Actions update
    if (this.actionTimer > 0) {
      this.actionTimer -= delta;

      if (this.activeAction === 'doll-power') {
        // Doll bounces triumphantly and aura expands
        const progress = 1.6 - this.actionTimer;
        this.dollFighter.position.y = Math.sin(progress * 4) * 0.35;
        this.dollFighter.rotation.y = -0.5 + Math.sin(progress * 6) * 0.2;

        if (this.dollAura) {
          const s = 1.0 + progress * 0.6;
          this.dollAura.scale.set(s, s, s);
          this.dollAura.rotation.y += 0.05;
          this.dollAura.material.opacity = Math.max(0, this.actionTimer / 1.6 * 0.75);
        }
      } else if (this.activeAction === 'robot-strike') {
        // Robot pulses, beam flashes across arena, Doll flinches
        const progress = 1.4 - this.actionTimer;
        this.robotFighter.rotation.z = Math.sin(progress * 8) * 0.1;
        this.dollFighter.position.x = 2.5 + Math.sin(progress * 12) * 0.12;

        if (this.energyBeam) {
          this.energyBeam.material.opacity = Math.max(0, this.actionTimer / 1.4 * 0.85);
          this.energyBeam.rotation.y = Math.sin(elapsed * 20) * 0.05;
        }
      }
    } else {
      this.activeAction = null;
      if (this.dollAura) this.dollAura.material.opacity = 0;
      if (this.energyBeam) this.energyBeam.material.opacity = 0;
      if (this.dollFighter) this.dollFighter.position.x = 2.5;
    }

    // Gentle rotation of arena stage
    if (this.arenaDais) {
      this.arenaDais.rotation.y = Math.sin(elapsed * 0.4) * 0.06;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.BattleScene = BattleScene;
