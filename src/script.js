import * as THREE from 'three';
import testVertexShader from "/shaders/vertex.glsl";
import testFragmentShader from "/shaders/fragment.glsl";


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1A1A1A);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const oneTexture = textureLoader.load("/images/1.jpg");
const twoTexture = textureLoader.load("/images/2.jpg");
const threeTexture = textureLoader.load("/images/3.jpg");
const fourTexture = textureLoader.load("/images/4.jpg");
const fiveTexture = textureLoader.load("/images/5.jpg");
const sixTexture = textureLoader.load("/images/6.jpg");
const sevenTexture = textureLoader.load("/images/7.jpg");


/**
 * Matérials
 */

function createMaterial(texture) {
  return new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
      uTexture: { value: texture },
    },
  });
}

const principMaterial = createMaterial(oneTexture)
const oneMaterial = createMaterial(oneTexture);
const twoMaterial = createMaterial(twoTexture);
const threeMaterial = createMaterial(threeTexture);
const fourMaterial = createMaterial(fourTexture);
const fiveMaterial = createMaterial(fiveTexture);
const sixMaterial = createMaterial(sixTexture);
const sevenMaterial = createMaterial(sevenTexture);


/**
 * Test mesh
 */
// Geometry

// Nouvelle définition de la géométrie du planeGeometry avec des valeurs initiales différentes
const container = document.querySelector(".webgl");

const sizes = {
  width: container.offsetWidth,
  height: container.offsetHeight,
};

const imagesWidth = sizes.width / 8; // Largeur de votre texture
const imagesHeight = sizes.height / 8; // Hauteur de votre texture

const textureWidth = 512; // Largeur de votre texture
const textureHeight = 512; // Hauteur de votre texture
const geometryPrincip = new THREE.PlaneGeometry(textureWidth / 100, textureHeight / 2 / 80); 
const geometryImage = new THREE.PlaneGeometry(imagesWidth / 100, imagesHeight / 100); 

const images = [];
const materialImages = [
  oneMaterial,
  twoMaterial,
  threeMaterial,
  fourMaterial,
  fiveMaterial,
  sixMaterial,
  sevenMaterial,
]

// Définir la position de départ
let currentPosition = new THREE.Vector3(3, -1, 0); // X = 3, Y = 1, Z = 0
let number = 0
materialImages.forEach(material => {
  const mesh = new THREE.Mesh(geometryImage, material);

  mesh.position.copy(currentPosition);
  mesh.name = "mesh" + number; 

  scene.add(mesh);
  images.push(mesh);

  number++

  currentPosition.y -= 2;
});

/**
 *  SCROLL
*/
// Fonction pour mettre à jour la position des images en fonction du défilement
function updateImagesPosition() {
  // Calculer le déplacement du défilement par rapport à la position initiale
  const scrollYOffset = window.scrollY - initialScrollY;

  // Mettre à jour la position y de chaque maillage en fonction du déplacement du défilement
  images.forEach((mesh, index) => {
    mesh.position.y = initialMeshPositions[index].y + scrollYOffset * scrollSpeed;
  });
}
// Gestionnaire d'événements pour écouter l'événement de défilement de la page
window.addEventListener('scroll', updateImagesPosition);

// Initialiser la position initiale de chaque maillage
const initialMeshPositions = [];

images.forEach(mesh => {
  initialMeshPositions.push(mesh.position.clone());
});
// Position initiale du défilement
const initialScrollY = window.scrollY;
// Vitesse de défilement des images (ajustez selon vos besoins)
const scrollSpeed = 0.005;

// function updatePlaneSize() {
//   geometry.width = window.innerWidth / 100;
//   geometry.height = window.innerHeight / 300;
//   geometry.verticesNeedUpdate = true;
// }


// const count = geometry.attributes.position.count;
// const random = new Float32Array(count);

// for (let i = 0; i < count; i++) {
//   random[i] = Math.random();
// }

// geometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));


// Debug
// const gui = new GUI()
// const noiseControls = gui.addFolder('Noise Controls');
// noiseControls.add(material.uniforms.uNoiseFreq, 'value', 0, 1).name('Noise Frequency');
// noiseControls.add(material.uniforms.uNoiseAmp, 'value', 0, 1).name('Noise Amplitude');

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

/**
 * Sizes
 */
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();


const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  camera.position.x = (scrollX / sizes.height);
  
  //Cast a ray
  raycaster.setFromCamera(new THREE.Vector2(1, 0), camera);

  const imagePrincip = new THREE.Mesh(geometryPrincip, principMaterial);
  scene.add(imagePrincip);

  images.forEach((image, index) => {
    const intersects = raycaster.intersectObject(image);
    if (intersects.length > 0) {
      gsap.to(image.scale, { x: 1.2, y: 1.2, duration: 1, ease : "power1.out" });
  } else {
      gsap.to(image.scale, { x: 1, y: 1, duration: 1, ease : "power1.out" });
  }
    if (intersects.length > 0) {
      let newTexture;
  
      switch (index) {
        case 0:
          newTexture = oneTexture;
          break;
        case 1:
          newTexture= twoTexture;
          break;
        case 2:
          newTexture = threeTexture;
          break;
        case 3:
          newTexture = fourTexture;
          break;
        case 4:
          newTexture = fiveTexture;
          break;
        case 5:
          newTexture = sixTexture;
          break;
        case 6:
          newTexture = sevenTexture;
          break;
      }
  
      principMaterial.uniforms.uTexture.value = newTexture;
    }
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
