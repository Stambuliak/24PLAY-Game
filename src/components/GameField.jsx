import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import model from './loader';
import explosion from './explosion';
import lavaLoader from './lava';
import roadLoader from './road';
import enemyLoader from './enemy';
import cloudsLoaader from './clouds';
import GameOverScreen from './GameOverScreen';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import flexing from './flexing';

export const GameField = () => {
const canvasRef = useRef(null);
const [width, setWidth] = useState(window.innerWidth);
const [height, setHeight] = useState(window.innerHeight);
const [gameStarted, setGameStarted] = useState(true);
// const [score, setScore] = useState(0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, width / height, 1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

const textureLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();

useEffect(() => {
let mixer;
let lavaOffset = 0
let roadOffset = 0

const backgroundTexture = textureLoader.load('./sky3.jpg');

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

    window.addEventListener('keydown', (e) => {
      if (e.key === 'a' || e.key === 'ArrowLeft') {

          moveLeft();
      } else if (e.key === 'd' || e.key === 'ArrowRight') {
        moveRight();
      }
    });

    const moveLeft = () => {
      if (object[0].position.x > -1) {
        object[0].position.x -= 1;
      }
    };

    const moveRight = () => {
      if (object[0].position.x < 1) {
        object[0].position.x += 1;
      }
    };
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

//adding explosion on background
explosion.then(object => {
  scene.add(object)
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

  //Adding devil as Hero enemy
  enemyLoader.then(object => {
    scene.add(object)
  })

  // adding clouds on the sky
  cloudsLoaader.then(object => {
    object.forEach(cloud => {
      scene.add(cloud)
    })
  })

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
      coinModel.position.set(randomX(), -1, 0);
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
    }, 500)
  }, 3500);

  setTimeout(() => {
    setInterval(() => {
      createCoins();;
    }, 1000)
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
    let coinsSpeed = 0.05;

    
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
    let obstacleSpeed = 0.05;

      obstacles.forEach((obstacle, index) => {
        checkCollision(avatar, obstacle)
        .then((collisionResult) => {
          if (!collisionResult) {
            lavaLoader.then(object => {
              lavaOffset += 0.001;
              object[1].map.offset.y = lavaOffset
            });
            roadLoader.then(object => {
              roadOffset += 0.005;
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
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

  animate();
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
