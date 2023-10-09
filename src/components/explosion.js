import * as THREE from 'three';

const explosionLoader = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader()
  loader.load("./explosion2.png", function (obj) {
    const explosionMaterial = new THREE.SpriteMaterial(
      { map: obj, 
      });
      const explosion = new THREE.Sprite(explosionMaterial);
    explosion.position.set(0, -1, -20);
    explosion.scale.set(20, 20, 20);

    res(explosion)
  });
})

export default explosionLoader;
