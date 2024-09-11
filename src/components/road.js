import * as THREE from 'three';

const roadLoader = new Promise((res, rej) => {
  const loader = new THREE.TextureLoader();
  loader.load('./road2.jpg', function(object) {
    object.wrapS = THREE.RepeatWrapping;
    object.wrapT = THREE.RepeatWrapping;
    object.repeat.set(1, 10)

    const roadMaterial = new THREE.MeshStandardMaterial({ map: object });

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(7, 1.1, 25),
      roadMaterial
    );
    ground.position.y = -5.8;
    ground.position.z = 0;

    res([ground, roadMaterial])
  })
})

export default roadLoader;