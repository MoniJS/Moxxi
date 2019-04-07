var scene = new THREE.Scene();
var world = new CANNON.World();
//var cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
world.gravity.set(0, -9.82, 0); // m/s²
world.broadphase = new CANNON.NaiveBroadphase();
var timeStep = 1.0 / 60.0;
var meshes = [];
var bodies = [];
var material = new THREE.MeshLambertMaterial( { color: 0x777777 } );
function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize( window.innerWidth, window.innerHeight );
          controls.screen.width = window.innerWidth;
          controls.screen.height = window.innerHeight;
       }

var camera = new THREE.PerspectiveCamera(
    60,                                   // Field of view
    window.innerWidth/window.innerHeight, // Aspect ratio
    0.1,                                  // Near clipping pane
    1000                                  // Far clipping pane
);

camera.position.set(0,30,50);

camera.lookAt(new THREE.Vector3(0,15,0))

var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize( window.innerWidth, window.innerHeight );

renderer.setClearColor( 0xfff6e6 );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Append to the document
document.body.appendChild( renderer.domElement );

// Add an ambient lights
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
scene.add( ambientLight );

// Add a point light that will cast shadows
var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 25, 50, 25 );
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
scene.add( pointLight );

// A basic material that shows the geometry wireframe.
var shape = new CANNON.Plane();
         var body = new CANNON.Body({ mass: 0 });
         body.addShape(shape);
         body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
         world.addBody(body);
         bodies.push(body);

var shadowMaterial = new THREE.ShadowMaterial( { color: 0xeeeeee } );
shadowMaterial.opacity = 0.5;
var groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry( 200, .1, 200 ),
    new THREE.MeshStandardMaterial( {
       color: 0xff0051,
   } )
);
groundMeshmesh.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI / 2);
groundMesh.receiveShadow = true;
 meshes.push(groundMesh);
scene.add( groundMesh );
///TEST
var shape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
          var body = new CANNON.Body({ mass: mass });
          body.addShape(shape);
          body.position.set(1,5,0);
          world.addBody(body);
          bodies.push(body);
          // Graphics
          var cubeGeo = new THREE.BoxGeometry( 5, 5, 5, 50, 10 );
          cubeMesh = new THREE.Mesh(cubeGeo, material);
          cubeMesh.position.set(12,10,8);
          meshes.push(cubeMesh);
          scene.add(cubeMesh);
          ////TEST_END
// A simple geometric shape with a flat material
var shapeOne = new THREE.Mesh(
    new THREE.OctahedronGeometry(10,1),
    new THREE.MeshStandardMaterial( {
        color: 0xff0051,
        flatShading: true,
        metalness: 0,
        roughness: 0.8
    } )
);
shapeOne.position.y += 10;
shapeOne.rotateZ(Math.PI/3);
shapeOne.castShadow = true;
scene.add(shapeOne);

var mass = 5, radius = 1;
var sphereShape = new CANNON.Sphere(radius); // Step 1
var sphereBody = new CANNON.Body({mass: mass, shape: sphereShape}); // Step 2
sphereBody.position.set(12,6,8);
world.add(sphereBody); // Step 3

// Add a second shape
var shapeTwo = new THREE.Mesh(
    new THREE.OctahedronGeometry(5,1),
    new THREE.MeshStandardMaterial({
        color: 0x47689b,
        flatShading: true,
        metalness: 0,
        roughness: 0.8
    })
);
shapeTwo.position.y += 5;
shapeTwo.position.x += 15;
shapeTwo.rotateZ(Math.PI/5);
shapeTwo.castShadow = true;
scene.add(shapeTwo);

var cube_one = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial({
        color: 'rgb(216, 104, 23)',
        flatShading: true,
        metalness: 0,
        roughness: 0.8
    })
);
cube_one.position.y += 5;
cube_one.position.x += 22;
cube_one.castShadow = true;
scene.add(cube_one);

for(var i=0; i !== meshes.length; i++){
                meshes[i].position.copy(bodies[i].position);
                meshes[i].quaternion.copy(bodies[i].quaternion);
            }
// Render the scene/camera combnation
function animate(time) {
            requestAnimationFrame( animate );
            if(time && lastTime){
                var dt = time - lastTime;
                world.step(fixedTimeStep, dt / 1000, maxSubSteps);
            }
            updateMeshPositions();
            cannonDebugRenderer.update();
            controls.update();
            renderer.render(scene, camera);
            lastTime = time;
        }

// Add an orbit control which allows us to move around the scene. See the three.js example for more details
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.target = new THREE.Vector3(0,15,0);
controls.maxPolarAngle = Math.PI / 2;
controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)
