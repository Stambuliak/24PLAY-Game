import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useCamera = (width, height) => {
  const [lane, setLane] = useState(1); 
  const lanes = [-0.5, 0, 0.5]; 
  const camera = useRef(new THREE.PerspectiveCamera(65, width / height, 0.3, 200));
  const animationRef = useRef();

  useEffect(() => {
    camera.current.position.set(0, 3, 10);
    camera.current.lookAt(0, 1, 6.5);
  }, []);

  useEffect(() => {
    const updateCameraPosition = () => {
      const targetX = lanes[lane];
      camera.current.position.x = THREE.MathUtils.lerp(camera.current.position.x, 0, 0.05);
      // camera.current.lookAt(0, 1, 7);

      animationRef.current = requestAnimationFrame(updateCameraPosition);
    };

    updateCameraPosition();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [lane]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'a' || e.key === 'ArrowLeft') && lane > 0) {
        setLane((prev) => Math.max(prev - 1, 0));
      } else if ((e.key === 'd' || e.key === 'ArrowRight') && lane < lanes.length - 1) {
        setLane((prev) => Math.min(prev + 1, lanes.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lane]);

  return { camera: camera.current };
};
