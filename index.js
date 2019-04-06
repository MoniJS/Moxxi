	
// Create a scene which will hold all our meshes to be rendered
var scene = new THREE.Scene();

// Create and position a camera
var camera = new THREE.PerspectiveCamera(
    60,                                   // Field of view
    window.innerWidth/window.innerHeight, // Aspect ratio
    0.1,                                  // Near clipping pane
    1000                                  // Far clipping pane
);

// Reposition the camera
camera.position.set(0,30,50);

// Point the camera at a given coordinate
camera.lookAt(new THREE.Vector3(0,15,0))

// Create a renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Size should be the same as the window
renderer.setSize( window.innerWidth, window.innerHeight );

// Set a near white clear color (default is black)
renderer.setClearColor( 'rgb(35, 206, 129)' );

// Enable shadow mapping
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
var shadowMaterial = new THREE.ShadowMaterial( { color: 'rgb(223, 244, 26)' } );
shadowMaterial.opacity = 1;
var groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry( 200, 0.1, 200 ),
    shadowMaterial
);
groundMesh.receiveShadow = true;
scene.add( groundMesh );

// A simple geometric shape with a flat material
var shapeOne = new THREE.Mesh(
    new THREE.OctahedronGeometry(10,1),
    new THREE.MeshStandardMaterial( {
        color: 0xff0051,
        shading: THREE.FlatShading ,
        metalness: 0,
        roughness: 0.8
    } )
);
shapeOne.position.y += 10;
shapeOne.rotateZ(Math.PI/3);
shapeOne.castShadow = true;
scene.add(shapeOne);

// Add a second shape
var shapeTwo = new THREE.Mesh(
    new THREE.OctahedronGeometry(5,1),
    new THREE.MeshStandardMaterial({
        color: 0x47689b,
        shading: THREE.FlatShading ,
        metalness: 0,
        roughness: 0.8
    })
);
shapeTwo.position.y += 5;
shapeTwo.position.x += 15;
shapeTwo.rotateZ(Math.PI/5);
shapeTwo.castShadow = true;
scene.add(shapeTwo);

// Render the scene/camera combnation
renderer.render(scene, camera);

// Add an orbit control which allows us to move around the scene. See the three.js example for more details
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.target = new THREE.Vector3(0,15,0);
controls.maxPolarAngle = Math.PI / 2;
controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)
