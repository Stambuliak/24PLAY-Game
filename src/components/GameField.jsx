import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import model from './loader';
import lavaLoader from './lava';
import roadLoader from './road';
import GameOverScreen from './GameOverScreen';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import flexing from './flexing';
import combo from './enemyModel';

export const GameField = () => {
const canvasRef = useRef(null);
const [width, setWidth] = useState(window.innerWidth);
const [height, setHeight] = useState(window.innerHeight);
const [gameStarted, setGameStarted] = useState(true);
const [cameraPositionX, setCameraPositionX] = useState(0)
// const [score, setScore] = useState(0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, width / height, 0.2, 150);
camera.position.set(cameraPositionX, 3, 8);
camera.lookAt(cameraPositionX, 1, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true });

const textureLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();



useEffect(() => {
let mixer;
let enemyMixer;
let lavaOffset = 0
let roadOffset = 0

const backgroundTexture = textureLoader.load('./cosmos.jpg');

scene.background = backgroundTexture;

const handleResize = () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  setWidth(newWidth);
  setHeight(newHeight);

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
};

window.addEventListener('resize', handleResize);

combo.then((object) => {
  scene.add(object[0]);
  object[0].name = 'enemy';
  enemyMixer = new THREE.AnimationMixer( object[0] );
  object[0].animations = object[1].animations;
  global.player = object[0];

  const action = enemyMixer.clipAction(object[0].animations[ 0 ]);

  action.loop = THREE.LoopRepeat;
  action.repetitions = Infinity; 

  action.play();

  return object[0];
});


const avatar = model.then(object => {
  setTimeout(() => {
    let stand = scene.getObjectByName('flexing');
    scene.remove(stand);
    scene.add(object[0]);
    object[0].name = 'hero';
    mixer = new THREE.AnimationMixer( object[0] );
    object[0].animations = object[1].animations;
    global.player = object[0];
    const action = mixer.clipAction( object[0].animations[ 0 ] );

    action.play();

    let targetX = object[0].position.x;
    const speed = 0.08;

    window.addEventListener('keydown', (e) => {
      if (e.key === 'a' || e.key === 'ArrowLeft') {

          moveLeft();
      } else if (e.key === 'd' || e.key === 'ArrowRight') {
        moveRight();
      } else if (e.key === 'w' || e.key === 'ArrowUp') {
        jump();
      }
    });

    const moveLeft = () => {
      if (targetX > -1) {
        setCameraPositionX((e) => e - 1);
        targetX -= 1;
      }
    };

    const jump = () => {
      if (object[0].position.y === -1) 
      {
        object[0].position.y += 1;
      }
    };

    const moveRight = () => {
      if (targetX < 1) {
        targetX += 1;
      }
    };

    const updatePosition = () => {
      object[0].position.x += (targetX - object[0].position.x) * speed;
    
      requestAnimationFrame(updatePosition);
    };
    
    updatePosition();
  }, 2500);

  return object[0];
})

flexing.then(object => {
    scene.add(object[0]);
    object[0].name = 'flexing';
    mixer = new THREE.AnimationMixer( object[0] );
    object[0].animations = object[1].animations;
    global.player = object[0];
    const action = mixer.clipAction( object[0].animations[ 0 ] );

    action.play();

  return object[0];
})

//adding main road
roadLoader.then(object => {
  scene.add(object[0])
})

//adding lava
lavaLoader.then(object => {
  scene.add(object[0])
})

  const light = new THREE.DirectionalLight('brown', 1);
  light.position.set(0, -2, 9);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.position.set(10, 20, 10)
  scene.add(ambientLight);

  renderer.setSize(width, height);
  canvasRef.current.appendChild(renderer.domElement);

  camera.position.z = 10;

  let obstacles = [];
  let coins = [];

  const obstacleDirection = new THREE.Vector3(0, 0, 1);
  const randomX = () => {
    let x = Math.floor(Math.random() * 3) - 1;

    return x;
  }

  const createCoins = () => {
    const loader = new GLTFLoader();
    loader.load("./coin.glb", (object) => {
      const coinModel = object.scene;
      const yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      coinModel.traverse((child) => {
        if (child.isMesh) {
          child.material = yellowMaterial;
        }
      });

      let coinModelPosition = coinModel.position.set(randomX(), -1, 0);

      coinModel.position.copy(coinModelPosition)
      coinModel.scale.set(20, 20, 20)
      // setScore((prev) => prev + 1)

      scene.add(coinModel);
      coins.push(coinModel);
    })
  }

  const createObstacle = () => {
    const loader = new GLTFLoader();
    loader.load("./Flames.glb", (object) => {
      const obstacleModel = object.scene;
      obstacleModel.position.set(randomX(), -1, 0);
      obstacleModel.name = 'obstacle';
      obstacleModel.scale.set(20, 20, 20)

      scene.add(obstacleModel);
      obstacles.push(obstacleModel);
    })
  };

  setTimeout(() => {
    setInterval(() => {
      createObstacle();
    }, 800)
    setInterval(() => {
      createCoins();;
    }, 1200)
  }, 3500);



  const checkCollision = async (character, obstacle) => {
    try {
      const object = await character;
      const characterBox = new THREE.Box3().setFromObject(object);
      const obstacleBox = new THREE.Box3().setFromObject(obstacle);
      return characterBox.intersectsBox(obstacleBox);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const moveCoins = () => {
    let coinsSpeed = 0.03;
    
    coins.forEach((coin, index) => {
      checkCollision(avatar, coin)
      .then((collisionResult) => {
        if (!collisionResult) {
          coin.position.add(obstacleDirection.clone().multiplyScalar(coinsSpeed));
        } else if (collisionResult) {
          
          scene.remove(coin);
        }
      })
    
      if (coin.position.z > 9) {
        scene.remove(coin);
        coins.splice(index, 1);
      }
    });

    requestAnimationFrame(moveCoins)
  }

  moveCoins();

  const moveObstackles = () => {
    if(!gameStarted) {
      return
    }
    let obstacleSpeed = 0.03;

      obstacles.forEach((obstacle, index) => {
        checkCollision(avatar, obstacle)
        .then((collisionResult) => {
          if (!collisionResult) {
            lavaLoader.then(object => {
              lavaOffset += 0.001;
              object[1].map.offset.y = lavaOffset
            });
            roadLoader.then(object => {
              roadOffset += 0.004;
              object[1].map.offset.y = roadOffset
            });
            // setScore(prev => prev + 1)
            obstacle.position.add(obstacleDirection.clone().multiplyScalar(obstacleSpeed));
          } else if (collisionResult) {
            lavaOffset = 0;
            roadOffset = 0;
            obstacleSpeed = 0;
            scene.clear()
            setGameStarted(false)
            return
          }
        })
      
        if (obstacle.position.z > 9) {
          scene.remove(obstacle);
          obstacles.splice(index, 1);
        }
      });

    requestAnimationFrame(moveObstackles)
  }

  moveObstackles()

const animate = () => {
  const delta = clock.getDelta();
  if ( mixer ) mixer.update( delta );
  if ( enemyMixer ) enemyMixer.update( delta );
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

  animate();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [height, width]);

  return (
    <div className="game-container">
      <div ref={canvasRef} />
      {!gameStarted && (
        <div>
          <GameOverScreen/>
        </div>
      )}
    </div>
  );
};

export default GameField;
