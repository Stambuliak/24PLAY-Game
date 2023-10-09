import * as THREE from 'three';

const enemyLoader = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader();
  loader.load("./enemy.png", function(object) {
    const enemyMaterial = new THREE.SpriteMaterial(
      { map: object, 
        color: 0x222222,
        opacity: 1
      });
      const enemy = new THREE.Sprite(enemyMaterial);
      enemy.position.set(-0.08, 0.1, -3);
      enemy.scale.set(3, 3, 3);

      res(enemy);
  });
});

export default enemyLoader;
