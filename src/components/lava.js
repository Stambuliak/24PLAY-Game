import * as THREE from 'three';

const lavaLoader = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader();
  loader.load('./lava2.jpg', function(object) {
    object.wrapS = THREE.RepeatWrapping
    object.wrapT = THREE.RepeatWrapping
    object.repeat.set(5, 5);

    const lavaMaterial = new THREE.MeshStandardMaterial({ map: object });

    const lava = new THREE.Mesh(
      new THREE.BoxGeometry(500, 1, 100),
      lavaMaterial
    );
    lava.position.y = -10;
    lava.scale.set(0.5, 0.5, 0.5)

    res([lava, lavaMaterial]);
  });
});

export default lavaLoader;