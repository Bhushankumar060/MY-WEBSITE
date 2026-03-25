/**
 * SOVEREIGN v9.2 - THREE.JS ES-MODULE ENGINE
 * Initializes and manages the immersive Torus Knot background using modern ES-Modules.
 */

import * as THREE from 'three';

const ThreeEngine = {
    scene: null,
    camera: null,
    renderer: null,
    torusKnot: null,

    init() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) {
            console.error("SOVEREIGN_THREE_ERROR: bg-canvas not found.");
            return;
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true, 
            alpha: true 
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.TorusKnotGeometry(12, 4, 150, 20);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x10b981, 
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            emissive: 0x064e3b,
            emissiveIntensity: 0.2
        });
        this.torusKnot = new THREE.Mesh(geometry, material);
        this.scene.add(this.torusKnot);

        const light = new THREE.PointLight(0xffffff, 100, 100);
        light.position.set(10, 10, 50);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040, 3));

        this.camera.position.z = 45;
        this.animate();

        window.addEventListener('resize', () => this.handleResize());
    },

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.torusKnot) {
            this.torusKnot.rotation.x += 0.005;
            this.torusKnot.rotation.y += 0.003;
        }
        this.renderer.render(this.scene, this.camera);
    },

    handleResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
};

// Initialize on load
ThreeEngine.init();
