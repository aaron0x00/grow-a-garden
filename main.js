// Basic three.js 3D Grow a Garden prototype

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fd694); // light green

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(6, 10, 18);
camera.lookAt(6, 0, 6);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Garden grid
const gridSize = 12;
const plotSize = 1;
const plots = [];

const plotGeom = new THREE.BoxGeometry(plotSize, 0.2, plotSize);
const plotMat = new THREE.MeshLambertMaterial({color: 0x4d784e});

for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const plot = new THREE.Mesh(plotGeom, plotMat.clone());
    plot.position.set(x, 0, z);
    plot.userData = { planted: false, x, z };
    scene.add(plot);
    plots.push(plot);
  }
}

// "Plant" geometry
const plantGeom = new THREE.SphereGeometry(0.3, 16, 16);
const plantMat = new THREE.MeshLambertMaterial({color: 0xffcb05});

// Raycaster for clicking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(plots);
  if (intersects.length > 0) {
    const plot = intersects[0].object;
    if (!plot.userData.planted) {
      plot.userData.planted = true;
      // Place a "seed" above the plot
      const plant = new THREE.Mesh(plantGeom, plantMat.clone());
      plant.position.set(plot.position.x, 0.4, plot.position.z);
      scene.add(plant);
    }
  }
}

window.addEventListener('click', onClick);

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
