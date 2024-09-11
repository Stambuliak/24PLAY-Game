import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const enemyModel = new Promise((res, rej) => {
  const loader = new FBXLoader();
  loader.load('./warrok.fbx', function(obj) {
    obj.scale.set(0.009, 0.009, 0.009)
    obj.position.set(0, -1, -0.6)
    obj.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    res(obj)
  });
});

const animation = new Promise((res, rej) => {
  const loader = new FBXLoader();
  loader.load('./creature/Laughing.fbx', function(obj) {
    obj.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    res(obj)
  });
});

const combo = Promise.all([enemyModel, animation]);

export default combo;