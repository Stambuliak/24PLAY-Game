import * as THREE from 'three';

const cloudsLoaader = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader();
  loader.load('./cloud.png', function(object) {
    const cloudMaterial = new THREE.SpriteMaterial({ map: object });

    const clouds = [];
    const cloudPositions = [
      { x: 7, y: 7, z: -5 },
      { x: -10, y: 7, z: -8 },
      { x: 15, y: 20, z: -10 },
      { x: -20, y:20, z: -12 },
    ];

    cloudPositions.forEach((position) => {
      const cloudSprite = new THREE.Sprite(cloudMaterial);
      cloudSprite.position.set(position.x, position.y, position.z);
      cloudSprite.scale.set(5, 5, 5);
      clouds.push(cloudSprite);
    });

    res(clouds)
  });
})

export default cloudsLoaader;
