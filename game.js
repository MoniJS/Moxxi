var world;
// Note Cannon.js => Three.js Box Size Conversion is Three.Vec3/2
       var timeStep = 1 / 60;
       var maxSubSteps = 3;
       var mass = 5;
       var lastTime;
       var camera, scene, renderer, controls;
       var geometry, material, mesh, blue_color, red_color, black_color, white_color, pink_color;
       var container, camera, scene, renderer, cannonDebugRenderer, clock;

       // To be synced
       var meshes = [];
       var bodies = [];
       if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
       initCannon();
       initThree();
       addSphere();
       addBox();
       addCylinder();
       addTrimesh();
       addPlane();
       addHeightfield();
       animate();
       function initThree() {
          //container = document.createElement( 'div' );
          //document.body.appendChild( container );
          // scene
          scene = new THREE.Scene();
          clock = new THREE.Clock();
          // camera
          camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
          camera.position.set(0, 3, 20);
          camera.up.set(0,1,0);
          camera.lookAt(new THREE.Vector3(0,0,0));
          scene.add(camera);
          material = new THREE.MeshStandardMaterial( { color: 'rgb(66, 244, 110)' } );
          blue_color = new THREE.MeshStandardMaterial( { color: 'rgb(43, 82, 255)' } );
          red_color = new THREE.MeshStandardMaterial( { color: 'rgb(247, 39, 60)' } );
          pink_color = new THREE.MeshStandardMaterial( { color: 0xff0051 } );
          black_color = new THREE.MeshStandardMaterial( { color: 'rgb(0, 0, 0)' } );
          white_color = new THREE.MeshStandardMaterial( { color: 'rgb(255, 255, 255)' } );
          // lights
          var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
          scene.add( ambientLight );
          var light = new THREE.DirectionalLight( 0xffffff, 0.1 );
          light.castShadow = true;            // default false
       scene.add( light );
       //Set up shadow properties for the light
       light.shadow.mapSize.width = 512;  // default
       light.shadow.mapSize.height = 512; // default
       light.shadow.camera.near = 0.5;    // default
       light.shadow.camera.far = 500;     // default
       this.setShadowSize=(sz)=>{
       light.shadow.camera.left = sz;  // default
       light.shadow.camera.bottom = sz; // default
       light.shadow.camera.right = -sz;    // default
       light.shadow.camera.top = -sz;
 }
        this.setShadowSize(100)
          var d = 20;

          var pointLight = new THREE.PointLight( 0xffffff, 1 );
          pointLight.position.set( 25, 50, 25 );
               pointLight.castShadow = true;
               pointLight.shadow.mapSize.width = 1024;
               pointLight.shadow.mapSize.height = 1024;
               scene.add( pointLight );

//Lights
          renderer = new THREE.WebGLRenderer( { antialias: true } );
          renderer.setSize( window.innerWidth, window.innerHeight );
          renderer.setClearColor( 0xfff6e6 );
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          document.body.appendChild( renderer.domElement );
          window.addEventListener( 'resize', onWindowResize, false );
          controls = new THREE.TrackballControls( camera, renderer.domElement );
          cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);
       }
       function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize( window.innerWidth, window.innerHeight );
          controls.screen.width = window.innerWidth;
          controls.screen.height = window.innerHeight;
       }
       function animate(time) {
          requestAnimationFrame( animate );
          if(time && lastTime){
               var dt = time - lastTime;
               world.step(timeStep, dt / 1000, maxSubSteps);
          }
          updateMeshPositions();
          cannonDebugRenderer.update();
          controls.update();
          renderer.render(scene, camera);
          lastTime = time;
       }
       function updateMeshPositions(){
          for(var i=0; i !== meshes.length; i++){
               meshes[i].position.copy(bodies[i].position);
               meshes[i].quaternion.copy(bodies[i].quaternion);
          }
       }
       function initCannon(){
          world = new CANNON.World();
          world.gravity.set(0, -10, 0);
          world.broadphase = new CANNON.NaiveBroadphase();
       }
       function addPlane(){
          // Physics
          var shape = new CANNON.Plane();
          var body = new CANNON.Body({ mass: 0 });
          body.addShape(shape);
          body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
          world.addBody(body);
          bodies.push(body);
          // Graphics
          geometry = new THREE.PlaneGeometry( 100, 100);
          //var shadow_color = new THREE.ShadowMaterial( { color: 'rgb(0, 0, 0)' } );
          //shadow_color.opacity = 1;
          var shadowMaterial = new THREE.ShadowMaterial( { color: 'rgb(28, 239, 169)' } );
          shadowMaterial.opacity = 1;
          mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( {
        color: 'rgb(28, 239, 169)',
        flatShading: false,
        metalness: 0,
        roughness: 0.8
    } ));
          mesh.receiveShadow = true;
          mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0),-Math.PI/2);
          mesh.position.set(0,3,0);
          scene.add(mesh);
          meshes.push(mesh);
       }
       function addBox(){
          // Physics
          var shape = new CANNON.Box(new CANNON.Vec3(1.5,1.5,2.5));
          var body = new CANNON.Body({ mass: mass });
          body.addShape(shape);
          body.position.set(1,18,0);
          world.addBody(body);
          bodies.push(body);
          // Graphics
          var cubeGeo = new THREE.BoxGeometry( 3, 3, 5);
          cubeMesh = new THREE.Mesh(cubeGeo, new THREE.MeshStandardMaterial( {
        color: 0xff0051,
        flatShading: true,
        metalness: 0,
        roughness: 0.8
    } ));
          cubeMesh.castShadow = true;
          meshes.push(cubeMesh);
          scene.add(cubeMesh);
       }
       function addSphere(){
          // Physics
          var body = new CANNON.Body({ mass: mass });
          var shape = new CANNON.Sphere(1.5);
          body.addShape(shape);
          body.position.set(8,5,0);
          world.addBody(body);
          bodies.push(body);
          // Graphics
          var sphereGeo = new THREE.SphereGeometry(1.45, 256, 256);
          sphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({
        color: 0x47689b,
        flatShading: true,
        metalness: 0,
        roughness: 0.8
    }));
          sphereMesh.castShadow = true;
          sphereMesh.name = 'sphere';
          meshes.push(sphereMesh);
          scene.add(sphereMesh);
       }
       function addCylinder(){
          // Physics
          var body = new CANNON.Body({ mass: mass });
          var shape = new CANNON.Cylinder(1, 1, 1, 10);
          var quat = new CANNON.Quaternion(0.5, 0, 0, 0.5);
          quat.normalize();
          body.addShape(shape, new CANNON.Vec3, quat);
          body.position.set(-3,5,0);
          world.addBody(body);
          bodies.push(body);
          // Graphics
          var geo = new THREE.CylinderGeometry(1,1,1,20,20,false);
          var mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: blue_color,
        flatShading: true,
        metalness: 0,
        roughness: 0.8
    }));
    mesh.castShadow = true;
          meshes.push(mesh);
          scene.add(mesh);
       }
       function addTrimesh(){
          // Physics
          var body = new CANNON.Body({ mass: mass });
          var shape = new CANNON.Trimesh.createTorus(1, 0.3, 16, 16);
          body.addShape(shape);
          body.position.set(-6,5,0);
          world.addBody(body);
          bodies.push(body);
          // Graphics
          var geo = new THREE.TorusGeometry(1,0.3,16,100);
          var mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: blue_color,
        flatShading: true,
        metalness: 0,
        roughness: 0.8
    }));
          meshes.push(mesh);
          scene.add(mesh);
       }
       function addHeightfield(){
          // Physics
          var body = new CANNON.Body({ mass: 0 });
          var matrix = [];
          var sizeX = 20, sizeY = 20;
          for (var i = 0; i < sizeX; i++) {
               matrix.push([]);
               for (var j = 0; j < sizeY; j++) {
                   var height = Math.cos(i/sizeX * Math.PI * 2)*Math.cos(j/sizeY * Math.PI * 2);
                   matrix[i].push(height);
               }
          }
       }
