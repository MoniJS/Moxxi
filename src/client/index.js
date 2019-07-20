var THREE = require('three');

//socket connections
const socket = io();
socket.emit('newPlayer');

//player


var loader = new THREE.ObjectLoader(); 
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Ask the browser to lock the pointer
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



  


/*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );


var gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
scene.add( plane );*/


//LOAD SCENE
loader.load('/assets/scene.json', function(object){
    scene.add(object);
});
/*loader.load('/assets/Handgun_fbx_7.4_binary.fbx', function (object3d) {
    console.log(object3d);
    scene.add(object3d);
    console.log(scene);
},(progress)=>{
    console.log(progress);
},(error)=>{
    console.log(error);
});*/

//window resize function
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//create camera controls
var left = false;
var right = false;
var foward = false;
var backwards = false;
var velocity = new THREE.Vector3(0, 0, 0);

function setVelocity(){
    velocity.set(0, 0, 0);
    var foward_vec = camera.getWorldDirection();
    var right_vec = new THREE.Vector3(0, 0, 0);
    right_vec.crossVectors(foward_vec, camera.up);
    if(foward){
        velocity.x += foward_vec.x*0.2;
        //velocity.y += foward_vec.y*0.2;
        velocity.z += foward_vec.z*0.2;
    }
    if(backwards){
        velocity.x -= foward_vec.x*0.2;
        //velocity.y -= foward_vec.y*0.2;
        velocity.z -= foward_vec.z*0.2;
    }
    if(right){
        velocity.x += right_vec.x*0.2;
        //velocity.y += right_vec.y*0.2;
        velocity.z += right_vec.z*0.2;
    }
    if(left){
        velocity.x -= right_vec.x*0.2;
        //velocity.y -= right_vec.y*0.2;
        velocity.z -= right_vec.z*0.2;
    }
}

document.addEventListener('keydown', function(event){
    if(event.key == 'w'){
        foward = true;
    }
    if(event.key == 's'){
        backwards = true;
    }
    if(event.key == 'a'){
        left = true;
    }
    if(event.key == 'd'){
        right = true;
    }
    setVelocity();
    
});

document.addEventListener('keyup', function(event){
    if(event.key == 'w'){
        foward = false;
    }
    if(event.key == 's'){
        backwards = false;
    }
    if(event.key == 'a'){
        left = false;
    }
    if(event.key == 'd'){
        right = false;
    }
    setVelocity();
    
});
var pitch = 0;
var yaw = 0;
var front = camera.getWorldDirection();
    front.sub(camera.getWorldPosition());
    front.x = Math.cos(pitch) * Math.cos(yaw);
    front.y = Math.sin(pitch);
    front.z = Math.cos(pitch) * Math.sin(yaw);
    front.add(camera.getWorldPosition());
    camera.lookAt(front);

document.addEventListener('mousemove', function(event){
    pitch -= event.movementY*.001;
    yaw -= -event.movementX*.001;

    front = camera.getWorldDirection();
    front.sub(camera.getWorldPosition());
    front.x = Math.cos(pitch) * Math.cos(yaw);
    front.y = Math.sin(pitch);
    front.z = Math.cos(pitch) * Math.sin(yaw);
    front.add(camera.getWorldPosition());
    camera.lookAt(front);
});

function update(){
    camera.position.x += velocity.x;
    camera.position.y += velocity.y;
    camera.position.z += velocity.z;
}

var clock = new THREE.Clock();
var delta = 0;
camera.position.y = 3;
var animate = function () {
    requestAnimationFrame( animate );
    update();
    renderer.render( scene, camera );
};

animate();

