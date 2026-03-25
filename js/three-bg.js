/* 
  SOVEREIGN v12.0 - THREE.JS ENGINE (ES-MODULE)
  Modular and Performance-Optimized
*/

import * as THREE from 'three';

class ThreeBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.init();
        this.animate();
        this.handleResize();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Geometry: Torus Knot (Sovereign Torque)
        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xd4af37, 2);
        pointLight.position.set(20, 20, 20);
        this.scene.add(pointLight);

        this.camera.position.z = 30;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.mesh) {
            this.mesh.rotation.x += 0.005;
            this.mesh.rotation.y += 0.005;
            this.mesh.rotation.z += 0.002;
        }

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    window.sovereignBg = new ThreeBackground();
});

export default ThreeBackground;
