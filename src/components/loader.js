import { FBXLoader } from "three-stdlib";


const model = new Promise((res, rej) => {
  const loader = new FBXLoader();
  loader.load('./model1.fbx', function(obj) {
    obj.rotateY(3.1)
    obj.scale.set(0.005, 0.005, 0.005)
    obj.position.set(0, -1, 8.1)
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
  loader.load('./creature/run.fbx', function(obj) {
    obj.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    res(obj)
  });
});

const combo = Promise.all([model, animation]);



export default combo;
