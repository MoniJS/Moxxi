//use libraries
const THREE = global.THREE = require('three');
const CANNON = global.CANNON =  require('cannon');
const socket = io();
const threeToCannon = require('three-to-CANNON').threeToCannon;
const OrbitControls = require('three-orbitcontrols');
require('./CannonDebugRenderer');

//init state and player objects
var state = {};
var player = {
    position : {
        x : 0.0,
        y : 5.0,
        z : 0.0,
    }
};

//init three js variables
var loader = new THREE.ObjectLoader(); 
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = -10;
var renderer = new THREE.WebGLRenderer({shadowMapEnabled:true, clearColor:0xffffff});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;

//load 3d character models
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var characters = [];
for (let index = 0; index < 5; index++) {
    characters.push(new THREE.Mesh( geometry, material ));
}

//init physics variables
var world = new CANNON.World();
world.gravity.set(0, -9.8, 0);
world.broadphase = new CANNON.NaiveBroadphase();
// Materials
var groundMaterial = new CANNON.Material("groundMaterial");
// Adjust constraint equation parameters for ground/ground contact
var ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
    friction: 2,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3,
});
// Add contact material to the world
world.addContactMaterial(ground_ground_cm);

// Create a slippery material (friction coefficient = 0.0)
var slipperyMaterial = new CANNON.Material("slipperyMaterial");
// The ContactMaterial defines what happens when two materials meet.
// In this case we want friction coefficient = 0.0 when the slippery material touches ground.
var slippery_ground_cm = new CANNON.ContactMaterial(groundMaterial, slipperyMaterial, {
    friction: 0,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
});
// We must add the contact materials to the world
world.addContactMaterial(slippery_ground_cm);

/*// Create a plane
var groundShape = new CANNON.Plane();
var groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
world.addBody(groundBody);*/

/*var gridHelper = new THREE.GridHelper( 100, 100 );
scene.add( gridHelper );*/

//create player object 3d
var cube = new THREE.Mesh( geometry, material );
var playerBody = new CANNON.Body({
    mass: 1, // kg
    position: new CANNON.Vec3(player.position.x, player.position.y, player.position.z), // m
    shape: threeToCannon(cube, {type: threeToCannon.Type.BOX}),
    material: slipperyMaterial
});
playerBody.fixedRotation = true;
playerBody.updateMassProperties();
world.addBody(playerBody);
scene.add(cube);

//init client
socket.on('init_client', function(data){
    //init state
    state = data;
    player = state.players[socket.id];

    //load three js scene
    loader.load(state.stage, function(object){
        scene.add(object);
        //add physics objects
        object.traverse(function(obj){
            if(obj instanceof THREE.Mesh){
                //Create physics object
                var shape = threeToCannon(obj, {type: threeToCannon.Type.BOX});
                var body = new CANNON.Body({ mass: 0 , material: groundMaterial});
                body.position.set(obj.position.x,obj.position.y,obj.position.z);
                body.quaternion.set(obj.quaternion.x,obj.quaternion.y,obj.quaternion.z,obj.quaternion.w);
                body.addShape(shape);
                
                world.addBody(body);
                console.log(body);
            }
        });
    });

    //animate scene
    render();
});

//update state
socket.on('update', function(data){
    state = data;
});

//update player 60 frames per second
setInterval(() => {
    socket.emit('update_player', player);
}, 1000/60);
/*
//Pointer lock function
function pointerLock(){
    document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
    if ( /Firefox/i.test( navigator.userAgent ) ) {
        var fullscreenchange = function ( event ) {
            if ( document.fullscreendocument.body === document.body || document.mozFullscreendocument.body === document.body || document.mozFullScreendocument.body === document.body ) {
                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
                document.body.requestPointerLock();
            }
        };
        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
        document.body.requestFullscreen = document.body.requestFullscreen || document.body.mozRequestFullscreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullscreen;
        document.body.requestFullscreen();
    } else {
        document.body.requestPointerLock();
    }
}
pointerLock();
var isPointerLock = false;
renderer.domElement.addEventListener('click', function(){
    pointerLock();
    isPointerLock = isPointerLock ? false : true;
});
*/
//window resize function
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//physics
var timeStep = 1.0 / 60.0; // seconds
function physics(){
    world.step(timeStep);
    //set player position
    player.position.x = playerBody.position.x;
    player.position.y = playerBody.position.y;
    player.position.z = playerBody.position.z;
    //set camera position
    //camera.position.y = player.position.y;
    cube.position.x = player.position.x;
    cube.position.y = player.position.y;
    cube.position.z = player.position.z;
}
//controls
document.addEventListener('keydown', function(event){
    if(event.key == 'w'){
        playerBody.velocity.x = 1;
    }
    if(event.key == 's'){
        playerBody.velocity.x = -1;
    }
    if(event.key == 'a'){
        playerBody.velocity.z = -1;
    }
    if(event.key == 'd'){
        playerBody.velocity.z = 1;
    }
    
});
var cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );

//render function
function render() {
    requestAnimationFrame( render );
    physics();
    //cannonDebugRenderer.update();
    renderer.render( scene, camera );
}