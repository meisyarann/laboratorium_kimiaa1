/* ==========================================================================
   CHEMVIRTUAL LAB - MODUL 4: 3D THREE.JS APPARATUS, REAL CAMERA AR & QR SCANNER
   Pengembangan Pembelajaran Berbasis Multimedia (S2 MTP FATMA)
   ========================================================================== */

class ThreeEquipmentModule {
  constructor() {
    this.currentEquipId = 'pipette_dropper'; // Default ke pipet tetes untuk inspeksi awal
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.currentMeshGroup = null;
    this.isAutoRotate = true;
    this.isWireframe = false;
    this.isVRMode = false;
    this.isARMode = false;
    this.animationFrameId = null;

    // Bunsen burner flame animation
    this.bunsenFlame = null;
    this.flameClock = null;

    // Mouse / Touch drag & zoom state
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.modelPosition = { x: 0, y: 0, z: 0 };
    this.modelScale = 1.0;

    // Live Camera AR Stream
    this.arMediaStream = null;
    this.arVideoElement = null;

    // QR Code Scanner State
    this.scannerMediaStream = null;
    this.scannerVideoElement = null;
    this.scannerCanvas = null;
    this.scannerCanvasCtx = null;
    this.scannerIntervalId = null;
    this.isScanning = false;
  }

  init() {
    this.flameClock = new THREE.Clock();
    this.renderEquipmentSelector();
    this.renderGHSSymbols();
    this.initThreeViewer();
    this.loadApparatusModel(this.currentEquipId);
    this.setupEventListeners();
    this.initScannerModal();
    this.initARCardModal();
  }

  initThreeViewer() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 460;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 2.5, 9.5);
    this.camera.lookAt(0, 0, 0);

    // Renderer dengan alpha transparan untuk Mode AR
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 0.9);
    dirLight1.position.set(6, 12, 8);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight2.position.set(-6, -4, -6);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 20);
    pointLight.position.set(0, 4, 4);
    this.scene.add(pointLight);

    // Grid Floor
    this.gridHelper = new THREE.GridHelper(12, 12, 0x0284c7, 0x334155);
    this.gridHelper.position.y = -2.5;
    this.scene.add(this.gridHelper);

    // Resize handler
    window.addEventListener('resize', () => {
      if (!container || !this.camera || !this.renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // Mouse and Touch Interaction
    const dom = this.renderer.domElement;
    
    // Mouse
    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { this.isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.currentMeshGroup) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      if (e.shiftKey || this.isARMode) {
        // Shift + Drag = Translate (Pindah Posisi di AR)
        this.currentMeshGroup.position.x += deltaX * 0.01;
        this.currentMeshGroup.position.y -= deltaY * 0.01;
      } else {
        // Normal Drag = Rotate
        this.currentMeshGroup.rotation.y += deltaX * 0.01;
        this.currentMeshGroup.rotation.x += deltaY * 0.01;
      }

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch support untuk Mobile / Tablet AR
    let initialTouchDist = null;
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        initialTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    dom.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging && this.currentMeshGroup) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        if (this.isARMode) {
          this.currentMeshGroup.position.x += deltaX * 0.012;
          this.currentMeshGroup.position.y -= deltaY * 0.012;
        } else {
          this.currentMeshGroup.rotation.y += deltaX * 0.012;
          this.currentMeshGroup.rotation.x += deltaY * 0.012;
        }
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && initialTouchDist && this.currentMeshGroup) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scaleFactor = dist / initialTouchDist;
        this.modelScale = Math.max(0.4, Math.min(2.5, this.modelScale * scaleFactor));
        this.currentMeshGroup.scale.set(this.modelScale, this.modelScale, this.modelScale);
        initialTouchDist = dist;
      }
    }, { passive: true });

    dom.addEventListener('touchend', () => {
      this.isDragging = false;
      initialTouchDist = null;
    });

    // Zoom on wheel
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.isARMode && this.currentMeshGroup) {
        // Zoom di AR = Resize Skala Objek
        const factor = e.deltaY > 0 ? 0.95 : 1.05;
        this.modelScale = Math.max(0.3, Math.min(3.0, this.modelScale * factor));
        this.currentMeshGroup.scale.set(this.modelScale, this.modelScale, this.modelScale);
      } else {
        this.camera.position.z += e.deltaY * 0.005;
        this.camera.position.z = Math.max(3.5, Math.min(18, this.camera.position.z));
      }
    }, { passive: false });

    // Loop
    this.animate();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Auto rotate bila tidak sedang di-drag dan tidak di mode AR
    if (this.currentMeshGroup && this.isAutoRotate && !this.isDragging) {
      this.currentMeshGroup.rotation.y += 0.008;
    }

    // Bunsen Flame Dynamic Animation
    if (this.bunsenFlame) {
      const elapsed = this.flameClock.getElapsedTime();
      const flicker = 1 + Math.sin(elapsed * 15) * 0.06 + Math.cos(elapsed * 23) * 0.04;
      this.bunsenFlame.scale.set(flicker, 1 + Math.sin(elapsed * 10) * 0.08, flicker);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /* ==========================================================================
     PEMODELAN 3D AKURAT & REALISTIS UNTUK SELURUH ALAT PRAKTIKUM
     ========================================================================== */
  loadApparatusModel(equipId) {
    const data = LAB_EQUIPMENT_DATA.find(e => e.id === equipId);
    if (!data || !this.scene) return;
    this.currentEquipId = equipId;
    this.bunsenFlame = null;

    // Remove previous model
    if (this.currentMeshGroup) {
      this.scene.remove(this.currentMeshGroup);
    }

    this.currentMeshGroup = new THREE.Group();
    this.currentMeshGroup.scale.set(this.modelScale, this.modelScale, this.modelScale);

    // Material Kaca Realistis
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: data.color || 0xbae6fd,
      transparent: true,
      opacity: data.opacity || 0.45,
      roughness: 0.08,
      metalness: 0.05,
      transmission: 0.92,
      ior: 1.5,
      clearcoat: 0.6,
      wireframe: this.isWireframe
    });

    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.75,
      roughness: 0.15,
      wireframe: this.isWireframe
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: this.isWireframe
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.75,
      roughness: 0.35,
      wireframe: this.isWireframe
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.65,
      metalness: 0.05,
      wireframe: this.isWireframe
    });

    const porcelainMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.2,
      metalness: 0.05,
      clearcoat: 0.5,
      wireframe: this.isWireframe
    });

    // Switch berdasarkan modelType
    switch (data.modelType) {

      /* -------------------------------------------------------------
         1. PIPET TETES (PASTEUR DROPPER)
         Badan kaca meruncing, bola hisap karet merah elastis, tetesan
         ------------------------------------------------------------- */
      case 'pipette_dropper': {
        const dropperGroup = new THREE.Group();

        // Bola Hisap Karet Merah (Rubber Bulb)
        const bulbGeom = new THREE.CylinderGeometry(0.48, 0.42, 1.2, 32);
        const bulbMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.65, wireframe: this.isWireframe });
        const bulbMesh = new THREE.Mesh(bulbGeom, bulbMat);
        bulbMesh.position.y = 2.1;

        const bulbTopGeom = new THREE.SphereGeometry(0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const bulbTopMesh = new THREE.Mesh(bulbTopGeom, bulbMat);
        bulbTopMesh.position.y = 2.7;

        // Cincin Leher Karet (Collar Lip)
        const collarGeom = new THREE.TorusGeometry(0.44, 0.08, 16, 32);
        const collarMesh = new THREE.Mesh(collarGeom, bulbMat);
        collarMesh.rotation.x = Math.PI / 2;
        collarMesh.position.y = 1.5;

        // Batang Kaca Silindris Utama (Upper Stem)
        const stemGeom = new THREE.CylinderGeometry(0.18, 0.18, 2.6, 32, 1, true);
        const stemMesh = new THREE.Mesh(stemGeom, glassMaterial);
        stemMesh.position.y = 0.2;

        // Ujung Kaca Meruncing Kapiler (Tapered Capillary Tip)
        const tipGeom = new THREE.CylinderGeometry(0.18, 0.05, 1.6, 32, 1, true);
        const tipMesh = new THREE.Mesh(tipGeom, glassMaterial);
        tipMesh.position.y = -1.9;

        // Kolom Cairan Biru di Dalam Pipet
        const liquidGeom = new THREE.CylinderGeometry(0.14, 0.14, 1.2, 24);
        const liquidMesh = new THREE.Mesh(liquidGeom, liquidMaterial);
        liquidMesh.position.y = -0.4;

        const tipLiqGeom = new THREE.CylinderGeometry(0.14, 0.04, 1.0, 24);
        const tipLiqMesh = new THREE.Mesh(tipLiqGeom, liquidMaterial);
        tipLiqMesh.position.y = -1.5;

        // Tetesan Menggantung di Ujung Runcing (Droplet)
        const dropGeom = new THREE.SphereGeometry(0.1, 16, 16);
        const dropMesh = new THREE.Mesh(dropGeom, liquidMaterial);
        dropMesh.position.y = -2.8;

        dropperGroup.add(bulbMesh, bulbTopMesh, collarMesh, stemMesh, tipMesh, liquidMesh, tipLiqMesh, dropMesh);
        this.currentMeshGroup.add(dropperGroup);
        break;
      }

      /* -------------------------------------------------------------
         2. LABU UKUR / LABU TAKAR (VOLUMETRIC FLASK)
         Dasar membulat buah pir, leher panjang sempit, garis batas kalibrasi, sumbat
         ------------------------------------------------------------- */
      case 'volumetric_flask': {
        const flaskGroup = new THREE.Group();

        // Badan Labu Berbentuk Pir (Pear-shaped body via Lathe)
        const points = [];
        points.push(new THREE.Vector2(0, -2.0));
        points.push(new THREE.Vector2(1.2, -2.0));
        points.push(new THREE.Vector2(1.7, -1.6));
        points.push(new THREE.Vector2(1.9, -1.0));
        points.push(new THREE.Vector2(1.8, -0.3));
        points.push(new THREE.Vector2(1.2, 0.5));
        points.push(new THREE.Vector2(0.38, 1.3));
        points.push(new THREE.Vector2(0.38, 3.2));
        points.push(new THREE.Vector2(0.48, 3.35)); // Flared rim atas

        const latheGeom = new THREE.LatheGeometry(points, 48);
        const flaskMesh = new THREE.Mesh(latheGeom, glassMaterial);

        // Garis Batas Kalibrasi Tunggal (Ring Kalibrasi)
        const ringGeom = new THREE.TorusGeometry(0.39, 0.02, 16, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xe11d48, wireframe: this.isWireframe });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 2.3;

        // Tutup / Sumbat Labu Polietilen / Asah (Stopper)
        const stopperGeom = new THREE.CylinderGeometry(0.42, 0.32, 0.6, 32);
        const stopperMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
        const stopperMesh = new THREE.Mesh(stopperGeom, stopperMat);
        stopperMesh.position.y = 3.6;

        const stopperTopGeom = new THREE.BoxGeometry(0.85, 0.15, 0.4);
        const stopperTopMesh = new THREE.Mesh(stopperTopGeom, stopperMat);
        stopperTopMesh.position.y = 3.95;

        // Cairan Meniskus Tepat di Batas Kalibrasi
        const liqPoints = [];
        liqPoints.push(new THREE.Vector2(0, -1.95));
        liqPoints.push(new THREE.Vector2(1.15, -1.95));
        liqPoints.push(new THREE.Vector2(1.65, -1.6));
        liqPoints.push(new THREE.Vector2(1.85, -1.0));
        liqPoints.push(new THREE.Vector2(1.75, -0.3));
        liqPoints.push(new THREE.Vector2(1.15, 0.5));
        liqPoints.push(new THREE.Vector2(0.36, 1.3));
        liqPoints.push(new THREE.Vector2(0.36, 2.3)); // Tepat di batas kalibrasi!

        const liqGeom = new THREE.LatheGeometry(liqPoints, 36);
        const flaskLiqMesh = new THREE.Mesh(liqGeom, liquidMaterial);

        flaskGroup.add(flaskMesh, ringMesh, stopperMesh, stopperTopMesh, flaskLiqMesh);
        this.currentMeshGroup.add(flaskGroup);
        break;
      }

      /* -------------------------------------------------------------
         3. TABUNG REAKSI & RAK (TEST TUBES & WOODEN RACK)
         Rak kayu lengkap dengan 4 tabung kaca berdasar bundar & aneka larutan warna
         ------------------------------------------------------------- */
      case 'test_tube_rack': {
        const rackGroup = new THREE.Group();

        // 1. Papan Dasar Rak Kayu (Bottom Base)
        const baseGeom = new THREE.BoxGeometry(6.4, 0.35, 2.2);
        const baseMesh = new THREE.Mesh(baseGeom, woodMaterial);
        baseMesh.position.y = -1.8;

        // 2. Papan Rak Atas Berlubang (Top Shelf)
        const shelfGeom = new THREE.BoxGeometry(6.4, 0.3, 2.2);
        const shelfMesh = new THREE.Mesh(shelfGeom, woodMaterial);
        shelfMesh.position.y = 0.2;

        // 3. Tiang Penyangga Kiri & Kanan (Pillars)
        const pillarGeom = new THREE.CylinderGeometry(0.18, 0.18, 2.0, 16);
        const p1 = new THREE.Mesh(pillarGeom, woodMaterial);
        p1.position.set(-2.9, -0.8, -0.8);
        const p2 = new THREE.Mesh(pillarGeom, woodMaterial);
        p2.position.set(-2.9, -0.8, 0.8);
        const p3 = new THREE.Mesh(pillarGeom, woodMaterial);
        p3.position.set(2.9, -0.8, -0.8);
        const p4 = new THREE.Mesh(pillarGeom, woodMaterial);
        p4.position.set(2.9, -0.8, 0.8);

        rackGroup.add(baseMesh, shelfMesh, p1, p2, p3, p4);

        // 4. Empat Tabung Reaksi Kaca Berbeda Warna Larutan
        const tubeColors = [0x0284c7, 0xea580c, 0x10b981, 0xa855f7]; // Biru, Jingga, Hijau, Ungu
        const xPositions = [-2.1, -0.7, 0.7, 2.1];

        for (let i = 0; i < 4; i++) {
          const tGroup = new THREE.Group();
          tGroup.position.set(xPositions[i], 0, 0);

          // Silinder Badan Tabung
          const tGeom = new THREE.CylinderGeometry(0.35, 0.35, 3.2, 24, 1, true);
          const tMesh = new THREE.Mesh(tGeom, glassMaterial);
          tMesh.position.y = 0.1;

          // Dasar Bulat Setengah Bola (Hemispherical Bottom)
          const bottomGeom = new THREE.SphereGeometry(0.35, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
          const bottomMesh = new THREE.Mesh(bottomGeom, glassMaterial);
          bottomMesh.position.y = -1.5;

          // Bibir Tabung Atas (Flared Rim Lip)
          const rimGeom = new THREE.TorusGeometry(0.36, 0.04, 16, 24);
          const rimMesh = new THREE.Mesh(rimGeom, glassMaterial);
          rimMesh.rotation.x = Math.PI / 2;
          rimMesh.position.y = 1.7;

          // Larutan Kimia di Dalam Tabung
          const liqMat = new THREE.MeshStandardMaterial({ color: tubeColors[i], transparent: true, opacity: 0.8 });
          const tLiqGeom = new THREE.CylinderGeometry(0.32, 0.32, 1.4, 24);
          const tLiqMesh = new THREE.Mesh(tLiqGeom, liqMat);
          tLiqMesh.position.y = -0.8;

          const tLiqBottomGeom = new THREE.SphereGeometry(0.32, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
          const tLiqBottomMesh = new THREE.Mesh(tLiqBottomGeom, liqMat);
          tLiqBottomMesh.position.y = -1.5;

          tGroup.add(tMesh, bottomMesh, rimMesh, tLiqMesh, tLiqBottomMesh);
          rackGroup.add(tGroup);
        }

        this.currentMeshGroup.add(rackGroup);
        break;
      }

      /* -------------------------------------------------------------
         4. PEMBAKAR BUNSEN (BUNSEN BURNER)
         Alas besi berat, saluran gas & selang, kerah udara berlubang, cerobong, nyala api biru
         ------------------------------------------------------------- */
      case 'bunsen_burner': {
        const bunsenGroup = new THREE.Group();

        // Alas Besi Tuang Berat (Heavy Cast Iron Base)
        const baseGeom = new THREE.CylinderGeometry(1.6, 1.8, 0.5, 32);
        const baseMesh = new THREE.Mesh(baseGeom, new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.4 }));
        baseMesh.position.y = -1.9;

        // Pipa Saluran Masuk Gas Samping (Gas Inlet Nozzle)
        const inletGeom = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16);
        const inletMesh = new THREE.Mesh(inletGeom, brassMaterial);
        inletMesh.rotation.z = Math.PI / 2;
        inletMesh.position.set(-1.0, -1.5, 0);

        // Selang Gas Karet (Rubber Hose)
        const hoseCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.6, -1.5, 0),
          new THREE.Vector3(-2.4, -1.7, 0.2),
          new THREE.Vector3(-2.8, -2.1, 0.4),
          new THREE.Vector3(-3.2, -2.3, 0.6)
        ]);
        const hoseGeom = new THREE.TubeGeometry(hoseCurve, 20, 0.1, 8, false);
        const hoseMesh = new THREE.Mesh(hoseGeom, new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }));

        // Kerah Pengatur Udara Berlubang (Rotating Air Collar)
        const collarGeom = new THREE.CylinderGeometry(0.52, 0.52, 0.6, 24);
        const collarMesh = new THREE.Mesh(collarGeom, brassMaterial);
        collarMesh.position.y = -1.1;

        // Lubang Udara pada Kerah (Air Holes)
        const holeGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
        const holeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
        const holeMesh1 = new THREE.Mesh(holeGeom, holeMat);
        holeMesh1.rotation.z = Math.PI / 2;
        holeMesh1.position.set(0, -1.1, 0);

        // Cerobong Silinder Vertikal Kuningan/Krom (Barrel/Chimney)
        const chimneyGeom = new THREE.CylinderGeometry(0.38, 0.38, 2.6, 32);
        const chimneyMesh = new THREE.Mesh(chimneyGeom, metalMaterial);
        chimneyMesh.position.y = 0.4;

        // Cincin Nozel Atas Cerobong
        const topRingGeom = new THREE.TorusGeometry(0.4, 0.06, 16, 32);
        const topRingMesh = new THREE.Mesh(topRingGeom, metalMaterial);
        topRingMesh.rotation.x = Math.PI / 2;
        topRingMesh.position.y = 1.7;

        // Nyala Api Biru 3D Dinamis Berlapis (Dual-layer Dynamic Flame)
        const flameGroup = new THREE.Group();
        flameGroup.position.y = 1.75;

        // Kerucut Api Luar (Zona Oksidasi Biru-Ungu Transparan)
        const flameOuterGeom = new THREE.ConeGeometry(0.55, 2.2, 24);
        const flameOuterMat = new THREE.MeshBasicMaterial({
          color: 0x0284c7,
          transparent: true,
          opacity: 0.55,
          wireframe: this.isWireframe
        });
        const flameOuterMesh = new THREE.Mesh(flameOuterGeom, flameOuterMat);
        flameOuterMesh.position.y = 1.1;

        // Kerucut Api Dalam (Zona Reduksi Sian/Biru Terang Panas)
        const flameInnerGeom = new THREE.ConeGeometry(0.3, 1.2, 24);
        const flameInnerMat = new THREE.MeshBasicMaterial({
          color: 0x67e8f9,
          transparent: true,
          opacity: 0.85,
          wireframe: this.isWireframe
        });
        const flameInnerMesh = new THREE.Mesh(flameInnerGeom, flameInnerMat);
        flameInnerMesh.position.y = 0.6;

        flameGroup.add(flameOuterMesh, flameInnerMesh);
        this.bunsenFlame = flameGroup; // Disimpan untuk animasi goyangan api

        bunsenGroup.add(baseMesh, inletMesh, hoseMesh, collarMesh, holeMesh1, chimneyMesh, topRingMesh, flameGroup);
        this.currentMeshGroup.add(bunsenGroup);
        break;
      }

      /* -------------------------------------------------------------
         5. CORONG KACA & KERTAS SARING (GLASS FUNNEL & FILTER PAPER)
         Kerucut 60° kaca, tangkai miring 45°, kertas saring lipat putih, tetesan
         ------------------------------------------------------------- */
      case 'funnel': {
        const funnelGroup = new THREE.Group();

        // Mangkuk Kerucut Corong Kaca 60° (Open Glass Cone)
        const coneGeom = new THREE.CylinderGeometry(2.1, 0.35, 2.2, 36, 1, true);
        const coneMesh = new THREE.Mesh(coneGeom, glassMaterial);
        coneMesh.position.y = 0.8;

        // Bibir Corong Atas
        const rimGeom = new THREE.TorusGeometry(2.1, 0.06, 16, 36);
        const rimMesh = new THREE.Mesh(rimGeom, glassMaterial);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.y = 1.9;

        // Tangkai Silinder Pipa Kaca Panjang (Stem)
        const stemGeom = new THREE.CylinderGeometry(0.28, 0.28, 2.6, 24, 1, true);
        const stemMesh = new THREE.Mesh(stemGeom, glassMaterial);
        stemMesh.position.y = -1.4;

        // Ujung Tangkai Miring 45° (Beveled Drip Tip)
        const tipGeom = new THREE.CylinderGeometry(0.28, 0.08, 0.4, 24, 1, true);
        const tipMesh = new THREE.Mesh(tipGeom, glassMaterial);
        tipMesh.position.y = -2.8;

        // Kertas Saring Lipat Putih di Dalam Corong (Folded Filter Paper)
        const paperGeom = new THREE.CylinderGeometry(1.85, 0.32, 1.8, 36, 1, true);
        const paperMat = new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.8,
          side: THREE.DoubleSide,
          wireframe: this.isWireframe
        });
        const paperMesh = new THREE.Mesh(paperGeom, paperMat);
        paperMesh.position.y = 0.7;

        // Tetesan Filtrat Bening Keluar dari Tangkai
        const dropGeom = new THREE.SphereGeometry(0.12, 16, 16);
        const dropMesh = new THREE.Mesh(dropGeom, liquidMaterial);
        dropMesh.position.y = -3.2;

        funnelGroup.add(coneMesh, rimMesh, stemMesh, tipMesh, paperMesh, dropMesh);
        this.currentMeshGroup.add(funnelGroup);
        break;
      }

      /* -------------------------------------------------------------
         6. GELAS KIMIA / BEKER (BEAKER)
         ------------------------------------------------------------- */
      case 'cylinder_open': {
        const beakerGroup = new THREE.Group();
        const geometry = new THREE.CylinderGeometry(data.dim.radiusTop, data.dim.radiusBottom, data.dim.height, 36, 1, true);
        const mesh = new THREE.Mesh(geometry, glassMaterial);

        const bottomGeom = new THREE.CircleGeometry(data.dim.radiusBottom, 36);
        const bottomMesh = new THREE.Mesh(bottomGeom, glassMaterial);
        bottomMesh.rotation.x = Math.PI / 2;
        bottomMesh.position.y = -data.dim.height / 2;

        // Rolled Rim & Cerat Penuang
        const rimGeom = new THREE.TorusGeometry(data.dim.radiusTop, 0.06, 16, 36);
        const rimMesh = new THREE.Mesh(rimGeom, glassMaterial);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.y = data.dim.height / 2;

        // Garis Skala Putih (Graduation rings)
        for (let y = -0.6; y <= 0.8; y += 0.4) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(data.dim.radiusTop * 0.99, 0.015, 8, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
          );
          ring.rotation.x = Math.PI / 2;
          ring.position.y = y;
          beakerGroup.add(ring);
        }

        // Cairan
        const liqGeom = new THREE.CylinderGeometry(data.dim.radiusBottom * 0.95, data.dim.radiusBottom * 0.95, data.dim.height * 0.55, 32);
        const liqMesh = new THREE.Mesh(liqGeom, liquidMaterial);
        liqMesh.position.y = -data.dim.height * 0.22;

        beakerGroup.add(mesh, bottomMesh, rimMesh, liqMesh);
        this.currentMeshGroup.add(beakerGroup);
        break;
      }

      /* -------------------------------------------------------------
         7. LABU ERLENMEYER (CONICAL FLASK)
         ------------------------------------------------------------- */
      case 'cone_flask': {
        const erlenGroup = new THREE.Group();
        const coneGeom = new THREE.CylinderGeometry(data.dim.radiusTop, data.dim.radiusBottom, data.dim.height * 0.75, 36, 1, true);
        const coneMesh = new THREE.Mesh(coneGeom, glassMaterial);

        const neckGeom = new THREE.CylinderGeometry(data.dim.radiusTop, data.dim.radiusTop, data.dim.height * 0.35, 36, 1, true);
        const neckMesh = new THREE.Mesh(neckGeom, glassMaterial);
        neckMesh.position.y = data.dim.height * 0.45;

        const rimGeom = new THREE.TorusGeometry(data.dim.radiusTop, 0.05, 16, 36);
        const rimMesh = new THREE.Mesh(rimGeom, glassMaterial);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.y = data.dim.height * 0.62;

        const bottomGeom = new THREE.CircleGeometry(data.dim.radiusBottom, 36);
        const bottomMesh = new THREE.Mesh(bottomGeom, glassMaterial);
        bottomMesh.rotation.x = Math.PI / 2;
        bottomMesh.position.y = -data.dim.height * 0.375;

        const liqMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.75 });
        const liqGeom = new THREE.CylinderGeometry(data.dim.radiusTop * 1.5, data.dim.radiusBottom * 0.94, data.dim.height * 0.42, 32);
        const liqMesh = new THREE.Mesh(liqGeom, liqMat);
        liqMesh.position.y = -data.dim.height * 0.16;

        erlenGroup.add(coneMesh, neckMesh, rimMesh, bottomMesh, liqMesh);
        this.currentMeshGroup.add(erlenGroup);
        break;
      }

      /* -------------------------------------------------------------
         8. GELAS UKUR (GRADUATED CYLINDER)
         ------------------------------------------------------------- */
      case 'tall_cylinder': {
        const cylGroup = new THREE.Group();
        const cylGeom = new THREE.CylinderGeometry(data.dim.radiusTop, data.dim.radiusBottom, data.dim.height, 36, 1, true);
        const cylMesh = new THREE.Mesh(cylGeom, glassMaterial);

        // Kaki heksagonal
        const baseGeom = new THREE.CylinderGeometry(data.dim.radiusBottom * 1.8, data.dim.radiusBottom * 2, 0.35, 6);
        const baseMesh = new THREE.Mesh(baseGeom, new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
        baseMesh.position.y = -data.dim.height / 2;

        // Cincin pelindung benturan (bumper ring)
        const bumperGeom = new THREE.TorusGeometry(data.dim.radiusTop * 1.15, 0.1, 16, 32);
        const bumperMesh = new THREE.Mesh(bumperGeom, new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        bumperMesh.rotation.x = Math.PI / 2;
        bumperMesh.position.y = data.dim.height * 0.38;

        // Cairan
        const liqGeom = new THREE.CylinderGeometry(data.dim.radiusBottom * 0.9, data.dim.radiusBottom * 0.9, data.dim.height * 0.58, 32);
        const liqMesh = new THREE.Mesh(liqGeom, liquidMaterial);
        liqMesh.position.y = -data.dim.height * 0.2;

        cylGroup.add(cylMesh, baseMesh, bumperMesh, liqMesh);
        this.currentMeshGroup.add(cylGroup);
        break;
      }

      /* -------------------------------------------------------------
         9. BURET & STATIF (BURETTE RIG)
         ------------------------------------------------------------- */
      case 'burette_rig': {
        const buretteGroup = new THREE.Group();

        // Pipa kaca buret
        const pipeGeom = new THREE.CylinderGeometry(0.18, 0.18, 6.5, 32, 1, true);
        const pipeMesh = new THREE.Mesh(pipeGeom, glassMaterial);
        pipeMesh.position.x = 0.5;

        // Kran merah buret
        const stopcockGeom = new THREE.BoxGeometry(0.7, 0.25, 0.25);
        const stopcockMesh = new THREE.Mesh(stopcockGeom, new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        stopcockMesh.position.set(0.5, -2.8, 0);

        // Nozel ujung runcing
        const nozGeom = new THREE.CylinderGeometry(0.18, 0.05, 0.6, 16);
        const nozMesh = new THREE.Mesh(nozGeom, glassMaterial);
        nozMesh.position.set(0.5, -3.3, 0);

        // Tiang statif besi
        const standPipe = new THREE.CylinderGeometry(0.12, 0.12, 7.5, 16);
        const standMesh = new THREE.Mesh(standPipe, new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
        standMesh.position.set(-1.0, 0, 0);

        // Klem pemegang ganda
        const clampGeom = new THREE.BoxGeometry(1.6, 0.2, 0.25);
        const clampMesh = new THREE.Mesh(clampGeom, new THREE.MeshStandardMaterial({ color: 0x64748b }));
        clampMesh.position.set(-0.2, 0.8, 0);

        // Alas statif
        const baseGeom = new THREE.BoxGeometry(3.6, 0.35, 2.5);
        const baseMesh = new THREE.Mesh(baseGeom, new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 }));
        baseMesh.position.set(-0.6, -3.7, 0);

        buretteGroup.add(pipeMesh, stopcockMesh, nozMesh, standMesh, clampMesh, baseMesh);
        this.currentMeshGroup.add(buretteGroup);
        break;
      }

      /* -------------------------------------------------------------
         10. PIPET VOLUME / GONDOK (VOLUMETRIC PIPETTE)
         ------------------------------------------------------------- */
      case 'pipette_volumetric': {
        const vPipGroup = new THREE.Group();

        // Pipa atas
        const topPipeGeom = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 24, 1, true);
        const topPipeMesh = new THREE.Mesh(topPipeGeom, glassMaterial);
        topPipeMesh.position.y = 1.9;

        // Garis kalibrasi merah
        const calRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.15, 0.015, 16, 24),
          new THREE.MeshBasicMaterial({ color: 0xe11d48 })
        );
        calRing.rotation.x = Math.PI / 2;
        calRing.position.y = 2.2;

        // Bagian Gelembung Tengah / Gondok (Bulb)
        const bulbGeom = new THREE.SphereGeometry(0.8, 32, 24);
        bulbGeom.scale(1, 1.5, 1);
        const bulbMesh = new THREE.Mesh(bulbGeom, glassMaterial);
        bulbMesh.position.y = 0.2;

        // Cairan dalam gondok
        const liqGeom = new THREE.SphereGeometry(0.74, 24, 20);
        liqGeom.scale(1, 1.4, 1);
        const liqMesh = new THREE.Mesh(liqGeom, liquidMaterial);
        liqMesh.position.y = 0.2;

        // Pipa bawah dan ujung
        const btmPipeGeom = new THREE.CylinderGeometry(0.14, 0.05, 2.2, 24, 1, true);
        const btmPipeMesh = new THREE.Mesh(btmPipeGeom, glassMaterial);
        btmPipeMesh.position.y = -1.9;

        vPipGroup.add(topPipeMesh, calRing, bulbMesh, liqMesh, btmPipeMesh);
        this.currentMeshGroup.add(vPipGroup);
        break;
      }

      /* -------------------------------------------------------------
         11. CAWAN PENGUAP PORSELEN (EVAPORATING DISH)
         ------------------------------------------------------------- */
      case 'evaporating_dish': {
        const dishGroup = new THREE.Group();
        const dishGeom = new THREE.SphereGeometry(2.1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const dishMesh = new THREE.Mesh(dishGeom, porcelainMaterial);
        dishMesh.rotation.x = Math.PI;
        dishMesh.position.y = -0.5;

        // Bibir cawan
        const rimGeom = new THREE.TorusGeometry(2.1, 0.08, 16, 32);
        const rimMesh = new THREE.Mesh(rimGeom, porcelainMaterial);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.y = -0.5;

        // Kristal putih garam di dasar cawan
        const saltGeom = new THREE.CylinderGeometry(1.4, 1.2, 0.25, 24);
        const saltMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
        const saltMesh = new THREE.Mesh(saltGeom, saltMat);
        saltMesh.position.y = -1.2;

        dishGroup.add(dishMesh, rimMesh, saltMesh);
        this.currentMeshGroup.add(dishGroup);
        break;
      }

      /* -------------------------------------------------------------
         12. MORTAR DAN ALUE (MORTAR & PESTLE)
         ------------------------------------------------------------- */
      case 'mortar_pestle': {
        const mpGroup = new THREE.Group();

        // Mangkuk Mortar Tebal
        const mortarGeom = new THREE.CylinderGeometry(2.0, 1.4, 1.8, 32, 1, true);
        const mortarMesh = new THREE.Mesh(mortarGeom, porcelainMaterial);

        const mBottomGeom = new THREE.CircleGeometry(1.4, 32);
        const mBottomMesh = new THREE.Mesh(mBottomGeom, porcelainMaterial);
        mBottomMesh.rotation.x = Math.PI / 2;
        mBottomMesh.position.y = -0.9;

        const mRimGeom = new THREE.TorusGeometry(2.0, 0.15, 16, 32);
        const mRimMesh = new THREE.Mesh(mRimGeom, porcelainMaterial);
        mRimMesh.rotation.x = Math.PI / 2;
        mRimMesh.position.y = 0.9;

        // Alue Penumbuk Miring (Pestle)
        const pestleGeom = new THREE.CylinderGeometry(0.3, 0.45, 2.5, 24);
        const pestleMesh = new THREE.Mesh(pestleGeom, porcelainMaterial);
        pestleMesh.rotation.z = Math.PI / 6;
        pestleMesh.position.set(0.6, 0.6, 0);

        mpGroup.add(mortarMesh, mBottomMesh, mRimMesh, pestleMesh);
        this.currentMeshGroup.add(mpGroup);
        break;
      }

      /* -------------------------------------------------------------
         13. KACA ARLOJI & BATANG PENGADUK
         ------------------------------------------------------------- */
      case 'watch_glass_rod': {
        const wgGroup = new THREE.Group();

        // Piring Kaca Arloji Cekung
        const plateGeom = new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, 0, 0.5);
        const plateMesh = new THREE.Mesh(plateGeom, glassMaterial);
        plateMesh.rotation.x = Math.PI;
        plateMesh.position.y = -0.8;

        // Batang Pengaduk Kaca Miring
        const rodGeom = new THREE.CylinderGeometry(0.08, 0.08, 5.2, 16);
        const rodMesh = new THREE.Mesh(rodGeom, glassMaterial);
        rodMesh.rotation.z = Math.PI / 3;
        rodMesh.position.set(0, 0.2, 0);

        wgGroup.add(plateMesh, rodMesh);
        this.currentMeshGroup.add(wgGroup);
        break;
      }

      /* -------------------------------------------------------------
         14. KAKI TIGA & KASA KAWAT (TRIPOD & WIRE GAUZE)
         ------------------------------------------------------------- */
      case 'tripod_gauze': {
        const tripodGroup = new THREE.Group();

        // Cincin Besi Atas
        const ringGeom = new THREE.TorusGeometry(1.8, 0.12, 16, 32);
        const ringMesh = new THREE.Mesh(ringGeom, metalMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 0.8;

        // Kasa Kawat Persegi dengan Lingkaran Keramik
        const gauzeGeom = new THREE.BoxGeometry(3.6, 0.06, 3.6);
        const gauzeMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8 });
        const gauzeMesh = new THREE.Mesh(gauzeGeom, gauzeMat);
        gauzeMesh.position.y = 0.9;

        const ceramicGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.08, 24);
        const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
        const ceramicMesh = new THREE.Mesh(ceramicGeom, ceramicMat);
        ceramicMesh.position.y = 0.95;

        // 3 Kaki Besi
        const legGeom = new THREE.CylinderGeometry(0.09, 0.09, 3.8, 16);
        for (let a = 0; a < 3; a++) {
          const angle = (a * 2 * Math.PI) / 3;
          const legMesh = new THREE.Mesh(legGeom, metalMaterial);
          legMesh.position.set(Math.cos(angle) * 1.6, -1.0, Math.sin(angle) * 1.6);
          legMesh.rotation.z = Math.cos(angle) * 0.15;
          legMesh.rotation.x = Math.sin(angle) * 0.15;
          tripodGroup.add(legMesh);
        }

        tripodGroup.add(ringMesh, gauzeMesh, ceramicMesh);
        this.currentMeshGroup.add(tripodGroup);
        break;
      }

      /* -------------------------------------------------------------
         15. BOTOL SEMPROT AKUADES (WASH BOTTLE)
         ------------------------------------------------------------- */
      case 'wash_bottle': {
        const wbGroup = new THREE.Group();

        // Badan Botol Plastik
        const bodyGeom = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 32);
        const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65, roughness: 0.3 });
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);

        // Tutup Ulir Biru
        const capGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.45, 24);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
        const capMesh = new THREE.Mesh(capGeom, capMat);
        capMesh.position.y = 1.8;

        // Pipa Semprot Melengkung (Curved Dispensing Nozzle)
        const nozzleCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.8, 0),
          new THREE.Vector3(0, 2.5, 0),
          new THREE.Vector3(-0.6, 2.7, 0),
          new THREE.Vector3(-1.4, 2.3, 0),
          new THREE.Vector3(-1.8, 1.8, 0)
        ]);
        const nozzleGeom = new THREE.TubeGeometry(nozzleCurve, 24, 0.08, 8, false);
        const nozzleMesh = new THREE.Mesh(nozzleGeom, capMat);

        wbGroup.add(bodyMesh, capMesh, nozzleMesh);
        this.currentMeshGroup.add(wbGroup);
        break;
      }

      default: {
        const geom = new THREE.CylinderGeometry(1.2, 1.2, 3.5, 32);
        const mesh = new THREE.Mesh(geom, glassMaterial);
        this.currentMeshGroup.add(mesh);
      }
    }

    this.scene.add(this.currentMeshGroup);
    this.updateEquipDetailView(data);
  }

  updateEquipDetailView(data) {
    const infoContainer = document.getElementById('equip-info-mount');
    if (!infoContainer) return;

    infoContainer.innerHTML = `
      <div class="equip-info-card">
        <div class="equip-info-header">
          <div class="equip-info-svg-badge">${data.svgIcon}</div>
          <div class="equip-info-title-group">
            <h3>${data.name}</h3>
            <div class="latin-name">${data.latinName} &bull; <span class="badge-tag">${data.category}</span></div>
          </div>
        </div>

        <p class="equip-info-desc">${data.description}</p>
        
        <div class="apd-spec-box" style="margin-bottom:0.75rem;">
          <strong>Spesifikasi & Kapasitas Alat:</strong>
          <span>${data.specs}</span>
        </div>

        <div class="meniscus-box">
          <span style="font-size:1.4rem;">👁️</span>
          <div>
            <strong>Panduan Meniskus & Teknik Pemakaian:</strong>
            <div>${data.meniscusTip}</div>
          </div>
        </div>

        <div class="apd-warning-box" style="margin-top:0.75rem;">
          <strong>Peringatan Keselamatan & SOP:</strong>
          <p>${data.safetyNote}</p>
        </div>

        <!-- Quick AR Action Buttons -->
        <div class="equip-ar-actions">
          <button class="btn btn-primary btn-sm btn-action-card-ar" data-id="${data.id}" title="Buka Kartu Marker & QR Code Siap Cetak">
            <span>🖨️</span> Buka Kartu AR & QR Code
          </button>
          <button class="btn btn-accent btn-sm btn-action-launch-ar" title="Lihat di Meja dengan Kamera AR">
            <span>📱</span> Proyeksikan ke Meja (AR)
          </button>
        </div>
      </div>
    `;

    // Highlight button in selector
    document.querySelectorAll('.equip-item-btn').forEach(btn => {
      if (btn.dataset.id === data.id) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  renderEquipmentSelector() {
    const listContainer = document.getElementById('equip-selector-mount');
    if (!listContainer) return;

    listContainer.innerHTML = LAB_EQUIPMENT_DATA.map(item => `
      <button class="equip-item-btn ${item.id === this.currentEquipId ? 'active' : ''}" data-id="${item.id}" title="${item.name}">
        <div class="equip-btn-svg">${item.svgIcon}</div>
        <span class="equip-btn-name">${item.name}</span>
      </button>
    `).join('');
  }

  renderGHSSymbols() {
    const ghsGrid = document.getElementById('ghs-symbols-grid');
    if (!ghsGrid || !window.GHS_SYMBOLS_DATA) return;

    ghsGrid.innerHTML = GHS_SYMBOLS_DATA.map(sym => `
      <div class="ghs-card" data-id="${sym.id}">
        <div class="ghs-diamond-frame">
          <div class="ghs-diamond-content">${sym.iconChar}</div>
        </div>
        <div class="ghs-name">${sym.name}</div>
        <div class="ghs-eng-name">${sym.engName}</div>
        <div class="ghs-desc">${sym.description}</div>
        <div class="ghs-examples-chip">Contoh: ${sym.examples.split(',')[0]}</div>
      </div>
    `).join('');
  }

  setupEventListeners() {
    // Klik tombol alat praktikum
    document.addEventListener('click', (e) => {
      const equipBtn = e.target.closest('.equip-item-btn');
      if (equipBtn && equipBtn.dataset.id) {
        this.loadApparatusModel(equipBtn.dataset.id);
        return;
      }

      // Klik tombol lihat Kartu AR dari info box
      const cardBtn = e.target.closest('.btn-action-card-ar');
      if (cardBtn && cardBtn.dataset.id) {
        this.showARCardModal(cardBtn.dataset.id);
        return;
      }

      // Klik tombol luncurkan AR langsung
      const launchARBtn = e.target.closest('.btn-action-launch-ar');
      if (launchARBtn) {
        this.startLiveCameraAR();
        return;
      }

      // Klik kartu GHS untuk menampilkan detail modal
      const ghsCard = e.target.closest('.ghs-card');
      if (ghsCard && ghsCard.dataset.id) {
        const symbol = GHS_SYMBOLS_DATA.find(s => s.id === ghsCard.dataset.id);
        if (symbol) this.showGHSModal(symbol);
        return;
      }
    });

    // Toolbar 3D Buttons
    const btnRotate = document.getElementById('btn-three-rotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        this.isAutoRotate = !this.isAutoRotate;
        btnRotate.classList.toggle('active', this.isAutoRotate);
      });
    }

    const btnWireframe = document.getElementById('btn-three-wireframe');
    if (btnWireframe) {
      btnWireframe.addEventListener('click', () => {
        this.isWireframe = !this.isWireframe;
        btnWireframe.classList.toggle('active', this.isWireframe);
        this.loadApparatusModel(this.currentEquipId);
      });
    }

    const btnResetView = document.getElementById('btn-three-reset');
    if (btnResetView) {
      btnResetView.addEventListener('click', () => {
        if (this.currentMeshGroup) {
          this.currentMeshGroup.rotation.set(0, 0, 0);
          this.currentMeshGroup.position.set(0, 0, 0);
          this.modelScale = 1.0;
          this.currentMeshGroup.scale.set(1, 1, 1);
        }
        if (this.camera) {
          this.camera.position.set(0, 2.5, 9.5);
        }
      });
    }

    // Tombol AR Live Camera
    const btnAR = document.getElementById('btn-three-ar');
    if (btnAR) {
      btnAR.addEventListener('click', () => {
        this.toggleLiveCameraAR();
      });
    }

    // Tombol Scan AR / QR Code
    const btnScan = document.getElementById('btn-three-scan');
    if (btnScan) {
      btnScan.addEventListener('click', () => {
        this.openScannerModal();
      });
    }

    // Tombol Cetak / Kartu AR
    const btnCard = document.getElementById('btn-three-card');
    if (btnCard) {
      btnCard.addEventListener('click', () => {
        this.showARCardModal(this.currentEquipId);
      });
    }

    // VR Mode Stereoscopic
    const btnVR = document.getElementById('btn-three-vr');
    if (btnVR) {
      btnVR.addEventListener('click', () => {
        this.toggleVRMode();
      });
    }
  }

  /* ==========================================================================
     FITUR 1: LIVE CAMERA AR MODE (AUGMENTED REALITY NYATA)
     Menampilkan model 3D alat di atas feed kamera perangkat / webcam
     ========================================================================== */
  async toggleLiveCameraAR() {
    if (this.isARMode) {
      this.stopLiveCameraAR();
    } else {
      await this.startLiveCameraAR();
    }
  }

  async startLiveCameraAR() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    try {
      // Minta izin kamera (prioritaskan kamera belakang untuk smartphone)
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.arMediaStream = stream;

      // Buat elemen video background jika belum ada
      if (!this.arVideoElement) {
        this.arVideoElement = document.createElement('video');
        this.arVideoElement.setAttribute('autoplay', '');
        this.arVideoElement.setAttribute('muted', '');
        this.arVideoElement.setAttribute('playsinline', '');
        this.arVideoElement.className = 'ar-camera-video-bg';
      }

      this.arVideoElement.srcObject = stream;
      await this.arVideoElement.play();

      // Tambahkan ke container di bawah canvas
      container.style.position = 'relative';
      if (!this.arVideoElement.parentNode) {
        container.insertBefore(this.arVideoElement, this.renderer.domElement);
      }

      // Update state
      this.isARMode = true;
      container.classList.add('ar-mode-active');
      if (this.gridHelper) this.gridHelper.visible = false; // Sembunyikan grid studio di AR
      this.isAutoRotate = false; // Matikan auto rotate agar stabil

      // Tampilkan HUD Kontrol AR
      this.showARControlsHUD(true);

      const btnAR = document.getElementById('btn-three-ar');
      if (btnAR) btnAR.classList.add('active');

    } catch (err) {
      console.warn("Camera AR Error:", err);
      // Fallback bila akses kamera ditolak atau tidak ada webcam
      this.isARMode = true;
      container.classList.add('ar-mode-active');
      container.style.background = 'linear-gradient(135deg, rgba(2, 132, 199, 0.4), rgba(56, 189, 248, 0.3)), repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 20px, transparent 20px, transparent 40px)';
      if (this.gridHelper) this.gridHelper.visible = false;
      this.showARControlsHUD(true);
      alert("Mode AR Simulasi Aktif!\n(Kamera fisik tidak terdeteksi atau izin belum diberikan. Anda dapat menggeser objek untuk simulasi penempatan di meja).");
    }
  }

  stopLiveCameraAR() {
    this.isARMode = false;
    const container = document.getElementById('three-canvas-container');
    if (container) {
      container.classList.remove('ar-mode-active');
      container.style.background = '';
      if (this.arVideoElement && this.arVideoElement.parentNode) {
        this.arVideoElement.parentNode.removeChild(this.arVideoElement);
      }
    }

    if (this.arMediaStream) {
      this.arMediaStream.getTracks().forEach(track => track.stop());
      this.arMediaStream = null;
    }

    if (this.gridHelper) this.gridHelper.visible = true;
    this.showARControlsHUD(false);

    const btnAR = document.getElementById('btn-three-ar');
    if (btnAR) btnAR.classList.remove('active');
  }

  showARControlsHUD(show) {
    let hud = document.getElementById('ar-controls-hud');
    if (!hud && show) {
      const container = document.getElementById('three-canvas-container');
      if (!container) return;

      hud = document.createElement('div');
      hud.id = 'ar-controls-hud';
      hud.className = 'ar-hud-overlay';
      hud.innerHTML = `
        <div class="ar-hud-pill">
          <span class="ar-hud-dot"></span>
          <span>Mode Kamera AR Aktif &bull; Sentuh & Geser untuk Menaruh di Meja</span>
        </div>
        <div class="ar-hud-btn-group">
          <button class="ar-hud-action-btn" id="btn-ar-snapshot" title="Jepret Foto Praktikum dengan Alat">
            📸 Foto AR
          </button>
          <button class="ar-hud-action-btn" id="btn-ar-scale-up" title="Perbesar Objek">+</button>
          <button class="ar-hud-action-btn" id="btn-ar-scale-down" title="Perkecil Objek">-</button>
          <button class="ar-hud-action-btn ar-hud-close" id="btn-ar-exit" title="Keluar Mode AR">
            ✕ Tutup
          </button>
        </div>
      `;
      container.appendChild(hud);

      // Event listener HUD
      document.getElementById('btn-ar-exit')?.addEventListener('click', () => this.stopLiveCameraAR());
      document.getElementById('btn-ar-scale-up')?.addEventListener('click', () => {
        if (this.currentMeshGroup) {
          this.modelScale = Math.min(3.0, this.modelScale * 1.15);
          this.currentMeshGroup.scale.set(this.modelScale, this.modelScale, this.modelScale);
        }
      });
      document.getElementById('btn-ar-scale-down')?.addEventListener('click', () => {
        if (this.currentMeshGroup) {
          this.modelScale = Math.max(0.3, this.modelScale * 0.85);
          this.currentMeshGroup.scale.set(this.modelScale, this.modelScale, this.modelScale);
        }
      });
      document.getElementById('btn-ar-snapshot')?.addEventListener('click', () => this.takeARSnapshot());
    }

    if (hud) {
      hud.style.display = show ? 'flex' : 'none';
    }
  }

  takeARSnapshot() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    // Gabungkan frame video dan canvas WebGL ke canvas snapshot
    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = this.renderer.domElement.width;
    snapCanvas.height = this.renderer.domElement.height;
    const ctx = snapCanvas.getContext('2d');

    // 1. Gambar latar belakang video jika ada
    if (this.arVideoElement && this.arVideoElement.videoWidth > 0) {
      ctx.drawImage(this.arVideoElement, 0, 0, snapCanvas.width, snapCanvas.height);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, snapCanvas.width, snapCanvas.height);
    }

    // 2. Gambar render 3D Three.js
    ctx.drawImage(this.renderer.domElement, 0, 0, snapCanvas.width, snapCanvas.height);

    // 3. Watermark Laboratorium Kimia & Guru
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(15, snapCanvas.height - 50, 480, 36);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('ChemVirtual Lab 3D AR - Laboratorium Kimia Interaktif', 25, snapCanvas.height - 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px sans-serif';
    ctx.fillText('Guru: Fatma Alawiyah, S.Pd.,Gr | Tanggal: ' + new Date().toLocaleDateString('id-ID'), 25, snapCanvas.height - 18);

    // Unduh foto
    const link = document.createElement('a');
    link.download = `ChemVirtualLab_AR_${this.currentEquipId}_${Date.now()}.png`;
    link.href = snapCanvas.toDataURL('image/png');
    link.click();

    // Animasi flash jepretan kamera
    const flash = document.createElement('div');
    flash.className = 'camera-flash-overlay';
    container.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  }

  /* ==========================================================================
     FITUR 2: MODAL KARTU AR & QR CODE SIAP CETAK
     ========================================================================== */
  initARCardModal() {
    let modal = document.getElementById('modal-ar-card');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-ar-card';
      modal.className = 'custom-modal-backdrop';
      modal.style.display = 'none';
      document.body.appendChild(modal);
    }
  }

  showARCardModal(equipId) {
    const data = LAB_EQUIPMENT_DATA.find(e => e.id === equipId);
    if (!data) return;

    const modal = document.getElementById('modal-ar-card');
    if (!modal) return;

    modal.innerHTML = `
      <div class="custom-modal-dialog printable-ar-card-modal">
        <div class="custom-modal-header">
          <h3>🖨️ Kartu Marker AR & QR Code Alat Praktikum</h3>
          <button class="btn-modal-close" onclick="document.getElementById('modal-ar-card').style.display='none'">✕</button>
        </div>

        <div class="custom-modal-body">
          <p class="modal-subtitle-text">
            Arahkan kamera smartphone atau pemindai pada QR Code / Marker di bawah untuk menginspeksi alat ini secara langsung dalam 3D Augmented Reality!
          </p>

          <!-- Kartu Marker AR Cetak Standar Laboratorium -->
          <div class="printable-ar-card-frame" id="printable-card-target">
            <div class="card-header-badge">
              <div class="card-logo-mini">⚗️ ChemVirtual Lab AR</div>
              <div class="card-category-tag">${data.category}</div>
            </div>

            <div class="card-content-grid">
              <div class="card-qr-box">
                <!-- Kontainer QR Code -->
                <div id="ar-card-qrcode-canvas" class="qrcode-render-target"></div>
                <div class="qr-target-code">${data.qrPayload}</div>
              </div>

              <div class="card-info-box">
                <div class="card-equip-svg">${data.svgIcon}</div>
                <h2 class="card-equip-title">${data.name}</h2>
                <div class="card-latin-title">${data.latinName}</div>
                <p class="card-mini-desc">${data.description}</p>
                <div class="card-specs-mini"><strong>Spesifikasi:</strong> ${data.specs}</div>
              </div>
            </div>

            <div class="card-footer-notice">
              <span>SMA/MA Pembelajaran Kimia &bull; Pengembang: Fatma Alawiyah, S.Pd.,Gr</span>
              <span class="marker-code-badge">MARKER ID: ${data.id.toUpperCase()}</span>
            </div>
          </div>

          <div class="modal-action-bar">
            <button class="btn btn-secondary" onclick="window.print()">
              <span>🖨️</span> Cetak Kartu Ini
            </button>
            <button class="btn btn-primary" onclick="window.App.threeEquipModule.startLiveCameraAR(); document.getElementById('modal-ar-card').style.display='none';">
              <span>📱</span> Buka di Kamera AR Sekarang
            </button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    // Generate QR Code menggunakan qrcode.js atau fallback SVG QR
    setTimeout(() => {
      const qrMount = document.getElementById('ar-card-qrcode-canvas');
      if (qrMount) {
        qrMount.innerHTML = '';
        if (window.QRCode) {
          new window.QRCode(qrMount, {
            text: data.qrPayload,
            width: 140,
            height: 140,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H
          });
        } else {
          // Fallback representasi QR Code presisi tinggi
          qrMount.innerHTML = this.generateFallbackQRCodeSVG(data.qrPayload);
        }
      }
    }, 50);
  }

  generateFallbackQRCodeSVG(payload) {
    return `
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="140" height="140" fill="#ffffff" rx="6"/>
        <!-- Corner Marker TL -->
        <rect x="12" y="12" width="34" height="34" rx="4" fill="#0f172a"/>
        <rect x="18" y="18" width="22" height="22" fill="#ffffff"/>
        <rect x="24" y="24" width="10" height="10" fill="#0f172a"/>
        <!-- Corner Marker TR -->
        <rect x="94" y="12" width="34" height="34" rx="4" fill="#0f172a"/>
        <rect x="100" y="18" width="22" height="22" fill="#ffffff"/>
        <rect x="106" y="24" width="10" height="10" fill="#0f172a"/>
        <!-- Corner Marker BL -->
        <rect x="12" y="94" width="34" height="34" rx="4" fill="#0f172a"/>
        <rect x="18" y="100" width="22" height="22" fill="#ffffff"/>
        <rect x="24" y="106" width="10" height="10" fill="#0f172a"/>
        <!-- Internal Data Matrix Points -->
        <rect x="52" y="16" width="8" height="8" fill="#0284c7"/>
        <rect x="66" y="16" width="8" height="8" fill="#0f172a"/>
        <rect x="80" y="16" width="8" height="8" fill="#0284c7"/>
        <rect x="52" y="30" width="8" height="8" fill="#0f172a"/>
        <rect x="74" y="30" width="8" height="8" fill="#0f172a"/>
        <rect x="52" y="44" width="36" height="8" fill="#0284c7"/>
        <rect x="16" y="52" width="8" height="36" fill="#0284c7"/>
        <rect x="116" y="52" width="8" height="36" fill="#0284c7"/>
        <rect x="56" y="60" width="28" height="20" rx="3" fill="#0284c7"/>
        <text x="70" y="74" font-size="8" fill="#ffffff" font-weight="bold" text-anchor="middle">AR</text>
        <rect x="30" y="66" width="8" height="8" fill="#0f172a"/>
        <rect x="102" y="66" width="8" height="8" fill="#0f172a"/>
        <rect x="52" y="94" width="8" height="8" fill="#0f172a"/>
        <rect x="66" y="94" width="14" height="8" fill="#0284c7"/>
        <rect x="94" y="94" width="8" height="8" fill="#0f172a"/>
        <rect x="116" y="94" width="12" height="8" fill="#0f172a"/>
        <rect x="52" y="116" width="8" height="12" fill="#0f172a"/>
        <rect x="72" y="116" width="24" height="8" fill="#0284c7"/>
        <rect x="104" y="116" width="12" height="12" fill="#0f172a"/>
      </svg>
    `;
  }

  /* ==========================================================================
     FITUR 3: PEMINDAI KAMERA AR / QR CODE (IN-APP AR SCANNER)
     Memindai kartu / barcode alat praktikum dan otomatis membuka objek 3D
     ========================================================================== */
  initScannerModal() {
    let modal = document.getElementById('modal-ar-scanner');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-ar-scanner';
      modal.className = 'custom-modal-backdrop';
      modal.style.display = 'none';
      document.body.appendChild(modal);
    }
  }

  async openScannerModal() {
    const modal = document.getElementById('modal-ar-scanner');
    if (!modal) return;

    modal.innerHTML = `
      <div class="custom-modal-dialog ar-scanner-dialog">
        <div class="custom-modal-header">
          <h3>📷 Pemindai Kamera AR / QR Code Alat Praktikum</h3>
          <button class="btn-modal-close" id="btn-close-scanner">✕</button>
        </div>

        <div class="custom-modal-body">
          <p class="modal-subtitle-text">
            Arahkan kamera ke Kartu Marker atau QR Code alat laboratorium. Sistem akan mendeteksi dan menampilkan model 3D alat tersebut secara otomatis.
          </p>

          <!-- Jendela Video Kamera Pemindai -->
          <div class="scanner-viewport-box">
            <video id="scanner-video" autoplay playsinline muted></video>
            <canvas id="scanner-canvas" style="display:none;"></canvas>

            <!-- Overlay Reticle & Laser Scan Beam Animasi -->
            <div class="scanner-laser-beam"></div>
            <div class="scanner-reticle-frame">
              <div class="reticle-corner reticle-tl"></div>
              <div class="reticle-corner reticle-tr"></div>
              <div class="reticle-corner reticle-bl"></div>
              <div class="reticle-corner reticle-br"></div>
              <div class="scanner-reticle-crosshair"></div>
            </div>

            <div class="scanner-status-pill" id="scanner-status-text">
              Sedang mencari kartu marker atau QR Code...
            </div>
          </div>

          <!-- Tray Simulasi Scan 1-Klik (Bila pengguna tidak memiliki webcam/akses kamera) -->
          <div class="quick-scan-test-tray">
            <div class="quick-scan-title">
              <span>💡</span> <strong>Uji Coba Cepat Tanpa Kamera Fisik:</strong> Klik kartu di bawah untuk mensimulasikan hasil pemindaian:
            </div>
            <div class="quick-scan-items-row">
              ${LAB_EQUIPMENT_DATA.slice(0, 6).map(e => `
                <button class="btn-quick-scan-test" data-id="${e.id}" data-payload="${e.qrPayload}">
                  <span>${e.svgIcon}</span>
                  <small>${e.name}</small>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    // Event close
    document.getElementById('btn-close-scanner')?.addEventListener('click', () => {
      this.closeScannerModal();
    });

    // Event simulasi klik cepat
    modal.querySelectorAll('.btn-quick-scan-test').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const payload = btn.dataset.payload;
        this.onQRCodeDetected(payload, id);
      });
    });

    // Mulai streaming kamera pemindai
    await this.startScannerCamera();
  }

  async startScannerCamera() {
    const video = document.getElementById('scanner-video');
    const canvas = document.getElementById('scanner-canvas');
    if (!video || !canvas) return;

    this.scannerVideoElement = video;
    this.scannerCanvas = canvas;
    this.scannerCanvasCtx = canvas.getContext('2d');

    try {
      const constraints = {
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.scannerMediaStream = stream;
      video.srcObject = stream;
      await video.play();

      this.isScanning = true;
      this.scannerIntervalId = setInterval(() => this.scanFrame(), 300);

    } catch (err) {
      console.warn("Scanner camera access error:", err);
      const statusText = document.getElementById('scanner-status-text');
      if (statusText) {
        statusText.innerHTML = "⚠️ Kamera tidak dapat diakses. Silakan gunakan tombol <strong>Uji Coba Cepat</strong> di bawah!";
        statusText.style.background = "rgba(225, 29, 72, 0.85)";
      }
    }
  }

  scanFrame() {
    if (!this.isScanning || !this.scannerVideoElement || !this.scannerCanvasCtx) return;
    const video = this.scannerVideoElement;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    this.scannerCanvas.width = video.videoWidth;
    this.scannerCanvas.height = video.videoHeight;
    this.scannerCanvasCtx.drawImage(video, 0, 0, this.scannerCanvas.width, this.scannerCanvas.height);

    // 1. Coba decode via jsQR jika library tersedia
    if (window.jsQR) {
      const imageData = this.scannerCanvasCtx.getImageData(0, 0, this.scannerCanvas.width, this.scannerCanvas.height);
      const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code && code.data) {
        this.onQRCodeDetected(code.data);
        return;
      }
    }

    // 2. Coba decode via BarcodeDetector native jika browser mendukung
    if (window.BarcodeDetector) {
      const detector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128'] });
      detector.detect(this.scannerCanvas).then(barcodes => {
        if (barcodes && barcodes.length > 0) {
          this.onQRCodeDetected(barcodes[0].rawValue);
        }
      }).catch(() => {});
    }
  }

  onQRCodeDetected(detectedText, forcedId) {
    if (!this.isScanning && !forcedId) return;
    this.isScanning = false;

    // Cari alat yang cocok dari payload atau ID
    let matchedEquip = null;
    if (forcedId) {
      matchedEquip = LAB_EQUIPMENT_DATA.find(e => e.id === forcedId);
    } else {
      matchedEquip = LAB_EQUIPMENT_DATA.find(e => 
        detectedText.toUpperCase().includes(e.id.toUpperCase()) || 
        (e.qrPayload && detectedText.toUpperCase().includes(e.qrPayload.toUpperCase()))
      );
    }

    // Play Beep Sound
    this.playScanBeep();

    const statusText = document.getElementById('scanner-status-text');
    if (statusText) {
      if (matchedEquip) {
        statusText.innerHTML = `✅ KODE TERDETEKSI: <strong>${matchedEquip.name}</strong>! Memuat model 3D...`;
        statusText.style.background = "rgba(16, 185, 129, 0.9)";
      } else {
        statusText.innerHTML = `🔍 Terdeteksi: "${detectedText}". Menyesuaikan alat...`;
      }
    }

    // Muat model dan tutup scanner setelah delay animasi feedback
    setTimeout(() => {
      this.closeScannerModal();
      if (matchedEquip) {
        this.loadApparatusModel(matchedEquip.id);
        // Scroll ke view 3D
        document.getElementById('page-module-4')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  }

  playScanBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High pleasant beep A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }

  closeScannerModal() {
    this.isScanning = false;
    if (this.scannerIntervalId) {
      clearInterval(this.scannerIntervalId);
      this.scannerIntervalId = null;
    }
    if (this.scannerMediaStream) {
      this.scannerMediaStream.getTracks().forEach(t => t.stop());
      this.scannerMediaStream = null;
    }
    const modal = document.getElementById('modal-ar-scanner');
    if (modal) modal.style.display = 'none';
  }

  toggleVRMode() {
    this.isVRMode = !this.isVRMode;
    const canvas = this.renderer.domElement;
    if (this.isVRMode) {
      canvas.style.filter = 'drop-shadow(15px 0 0 rgba(56,189,248,0.7)) drop-shadow(-15px 0 0 rgba(239,68,68,0.7))';
      alert("Mode Stereoskopik 3D VR (Anaglyph Merah-Sian) Diaktifkan!\nGunakan kacamata 3D Red-Cyan untuk melihat efek kedalaman ruang.");
    } else {
      canvas.style.filter = '';
    }
  }

  showGHSModal(symbol) {
    alert(`SIMBOL BAHAYA GHS: ${symbol.name.toUpperCase()} (${symbol.engName})\n\n` +
          `• Deskripsi: ${symbol.description}\n\n` +
          `• Contoh Bahan di Lab: ${symbol.examples}\n\n` +
          `• SOP Penanganan Khusus: ${symbol.handling}\n\n` +
          `• Tindakan Darurat Pertolongan Pertama: ${symbol.firstAid}`);
  }
}

window.ThreeEquipmentModule = ThreeEquipmentModule;
