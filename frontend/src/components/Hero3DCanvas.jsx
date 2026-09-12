import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect low-power / mobile devices so we can render a much lighter scene.
    // This is the main fix for the "too heavy / laggy / cluttered" feel on phones.
    const isMobile =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    // 3. Renderer — disable antialiasing and cap pixel ratio on mobile,
    // this alone removes most of the GPU/battery load on phones.
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting — fewer lights on mobile (each light = extra shader cost)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    if (!isMobile) {
      const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.5); // Emerald hint
      dirLight2.position.set(-5, -5, 3);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xffffff, 3, 20);
      pointLight.position.set(0, 0, 4);
      scene.add(pointLight);
    }

    // 5. Main 3D Object: Luxury Streetwear Geometric Monolith
    const group = new THREE.Group();
    scene.add(group);

    // Core Icosahedron Geometry with chrome/metallic luxury shader.
    // MeshPhysicalMaterial's clearcoat pass is expensive — use the cheaper
    // MeshStandardMaterial on mobile, it looks almost identical here.
    const mainGeometry = new THREE.IcosahedronGeometry(1.6, isMobile ? 0 : 1);
    const mainMaterial = isMobile
      ? new THREE.MeshStandardMaterial({
          color: 0x18181b,
          metalness: 0.85,
          roughness: 0.2,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0x18181b,
          metalness: 0.85,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          reflectivity: 0.9,
          wireframe: false,
        });
    const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
    group.add(mainMesh);

    // Wireframe Outer Cage
    const wireGeo = new THREE.IcosahedronGeometry(1.75, isMobile ? 0 : 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x09090b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    group.add(wireMesh);

    // Outer Orbiting Luxury Torus Rings (fewer segments on mobile)
    const ringSegments = isMobile ? 8 : 16;
    const ringTubularSegments = isMobile ? 40 : 100;
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.025, ringSegments, ringTubularSegments);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.6, 0.015, ringSegments, ringTubularSegments);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    group.add(ring2);

    // Floating micro-particles / dust — far fewer on mobile
    const particleCount = isMobile ? 20 : 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x18181b,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Interactive Mouse Tracking & Drag
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        group.rotation.y += deltaX * 0.01;
        group.rotation.x += deltaY * 0.01;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      } else {
        targetX = x * 0.4;
        targetY = y * 0.4;
      }
    };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        targetX = x * 0.5;
        targetY = y * 0.5;
      }
    };

    // On mobile, skip the mouse/drag listeners entirely — touch users get a
    // gentle tilt-follow only (see onTouchMove), not a free-drag rotation,
    // so it doesn't fight with page scrolling or feel fiddly on a small screen.
    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
    }
    container.addEventListener("touchmove", onTouchMove, { passive: true });

    // 7. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      if (!isDragging) {
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        group.rotation.y += 0.006;
        group.rotation.x += 0.003;

        group.rotation.y += (mouseX - group.rotation.y) * 0.05;
        group.rotation.x += (-mouseY - group.rotation.x) * 0.05;
      }

      // Smooth floating animation
      group.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Rotate individual components
      wireMesh.rotation.y -= 0.004;
      wireMesh.rotation.z += 0.002;
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      mainGeometry.dispose();
      mainMaterial.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      title="Click and drag to interact with 3D emblem"
    />
  );
}