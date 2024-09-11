import * as THREE from 'three';

const explosionLoader = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader()
  loader.load("./devil.png", function (obj) {
    const explosionMaterial = new THREE.SpriteMaterial(
      { map: obj, 
      });
      const explosion = new THREE.Sprite(explosionMaterial);
    explosion.position.set(0, -8, -20);
    explosion.scale.set(5, 5, 5);

    res(explosion)
  });
})

export default explosionLoader;
