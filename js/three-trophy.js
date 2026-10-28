/**
 * AI Peer Teaching Kit - 3D Collectible Trophy Room (Three.js)
 * Interactive 3D Gems and Royal Crowns earned through streaks and topic mastery.
 */

class TrophyViewer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.trophyGroup = null;
    this.currentMesh = null;
    this.currentTrophyId = 'ruby';

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const rect = this.canvas.getBoundingClientRect();
    const aspect = (rect.width || 340) / (rect.height || 280);
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(rect.width || 340, rect.height || 280);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambient = new THREE.AmbientLight(0xF4E8D1, 1.0);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xFFE4A0, 1.4);
    keyLight.position.set(3, 4, 3);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xC9A24B, 0.8);
    rimLight.position.set(-3, -2, -3);
    this.scene.add(rimLight);

    this.trophyGroup = new THREE.Group();
    this.scene.add(this.trophyGroup);

    this.materials = {
      ruby: new THREE.MeshPhysicalMaterial({
        color: 0x9B1130,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.6,
        thickness: 1.2,
        reflectivity: 0.9
      }),
      emerald: new THREE.MeshPhysicalMaterial({
        color: 0x2E8B57,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.6,
        thickness: 1.2
      }),
      sapphire: new THREE.MeshPhysicalMaterial({
        color: 0x1E4D8C,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.65,
        thickness: 1.2
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xC9A24B,
        roughness: 0.2,
        metalness: 0.9
      }),
      glow: new THREE.MeshBasicMaterial({
        color: 0xFFE07A
      })
    };

    this.loadTrophy('ruby');

    // Drag rotation controls
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.trophyGroup) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.trophyGroup.rotation.y += deltaX * 0.015;
      this.trophyGroup.rotation.x += deltaY * 0.015;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });
    window.addEventListener('touchend', () => { this.isDragging = false; });
    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1 || !this.trophyGroup) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.trophyGroup.rotation.y += deltaX * 0.015;
      this.trophyGroup.rotation.x += deltaY * 0.015;

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  loadTrophy(type) {
    this.currentTrophyId = type;

    // Clear old trophy
    while (this.trophyGroup.children.length > 0) {
      this.trophyGroup.remove(this.trophyGroup.children[0]);
    }

    if (type === 'ruby') {
      // Faceted Ruby Gem
      const geom = new THREE.OctahedronGeometry(1.2, 0);
      const mesh = new THREE.Mesh(geom, this.materials.ruby);
      this.trophyGroup.add(mesh);

      // Gold setting wireframe ring
      const ringGeom = new THREE.TorusGeometry(1.25, 0.04, 6, 24);
      const ring = new THREE.Mesh(ringGeom, this.materials.gold);
      this.trophyGroup.add(ring);
    } else if (type === 'emerald') {
      // Emerald Prism
      const geom = new THREE.CylinderGeometry(0.8, 0.8, 1.8, 6);
      const mesh = new THREE.Mesh(geom, this.materials.emerald);
      this.trophyGroup.add(mesh);
    } else if (type === 'sapphire') {
      // Brilliant Sapphire Icosahedron
      const geom = new THREE.IcosahedronGeometry(1.2, 0);
      const mesh = new THREE.Mesh(geom, this.materials.sapphire);
      this.trophyGroup.add(mesh);
    } else if (type === 'crown') {
      // Royal Grand Crown
      const crownMesh = new THREE.Group();

      const baseGeom = new THREE.CylinderGeometry(1.1, 1.1, 0.35, 16);
      const base = new THREE.Mesh(baseGeom, this.materials.gold);
      crownMesh.add(base);

      // 5 Crown Spikes
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const spikeGeom = new THREE.ConeGeometry(0.25, 0.75, 5);
        const spike = new THREE.Mesh(spikeGeom, this.materials.gold);
        spike.position.set(Math.cos(angle) * 1.0, 0.45, Math.sin(angle) * 1.0);
        crownMesh.add(spike);

        // Small jewel on each tip
        const jewelGeom = new THREE.SphereGeometry(0.08, 8, 8);
        const jewel = new THREE.Mesh(jewelGeom, this.materials.ruby);
        jewel.position.set(Math.cos(angle) * 1.0, 0.85, Math.sin(angle) * 1.0);
        crownMesh.add(jewel);
      }

      this.trophyGroup.add(crownMesh);
    }

    this.trophyGroup.rotation.set(0.3, 0.2, 0);
  }

  onResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || 340;
    const height = rect.height || 280;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();

    // Subtle continuous idle rotation when user is not manually dragging
    if (!this.isDragging && this.trophyGroup) {
      this.trophyGroup.rotation.y += 0.008;
      this.trophyGroup.position.y = Math.sin(elapsed * 1.8) * 0.08;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.TrophyViewer = TrophyViewer;
