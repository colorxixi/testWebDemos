var container,camera,scene,axes,particles,particleGeometry,mat,emitter,controls,projector,mouseVector;
var PARTICLE_COUNT = 200, BEAM_COUNT = 40, MAX_DISTANCE = 1000, STAR_ROT_SPEED = 0.01, BEAM_ROT_SPEED = 0.003;
var renderer,stars=[],sphere;
var lastDownTarget,inter_obj;

var obstacles;
//var IS_ACT=false;
var SEL_COLOR=0x2faea0;
var NONSEL_COLOR=0x0e6e80;
var MOVING_STEP=20;
var SMALL_MOVING_STEP=4;
var TRANSMISSION=0.2;
var REFLECTION=0.5;
var SPECULAR=0.3;
//0:index, 1:modelpage, 1.1:modelsim, 1.2:modelguide, 1.3:modelleaf, 1.4:modelleaves, 2:vegeinv, 3:readingbooks, 4:house
(function()
{
		$("#countuser").load("../php/online.php?pinfo=p1.1");
		
    emitter=new simpleEmitterClass();
    container = document.getElementById("container_sim");
    renderer = new THREE.WebGLRenderer({antialias: false,clearAlpha: 1});
    renderer.setSize(container.clientWidth, container.clientHeight,1);
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 10000);
    camera.position.x=10;
    camera.position.y=10;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.add(camera);
    camera.lookAt( scene.position );

    controls = new THREE.TrackballControls(camera,container);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
//    controls.keys = [65, 83, 68];
    controls.addEventListener('change', render);


//// directional lighting
//    var directionalLight = new THREE.DirectionalLight(0xffffff);
//    directionalLight.position.set(-10, 0, 0).normalize();
//    scene.add(directionalLight);

    obstacles = new THREE.Object3D();
//    sphere = new THREE.Mesh(new THREE.SphereGeometry(150, 50, 50), new THREE.MeshNormalMaterial());
    mat = new THREE.MeshBasicMaterial();
    mat.color.setHex(NONSEL_COLOR);
    sphere = new THREE.Mesh(new THREE.SphereGeometry(200, 50, 50), mat);
    sphere.position=new THREE.Vector3(230,-190,0);
    sphere.isAct=false;
//    sphere.overdraw = true;
    obstacles.REF=REFLECTION;
    obstacles.TRANS=TRANSMISSION;
    obstacles.SPEC=SPECULAR;
    obstacles.add(sphere);
    scene.add(obstacles);



    // Axes
    axes = buildAxes();
    scene.add( axes );

    var loader = new THREE.OBJLoader();
    loader.load( 'data/TestTreeMesh.obj', function ( object ) {
        var mat2 = new THREE.MeshBasicMaterial();
        mat2.color.setHex(NONSEL_COLOR);
        object.scale.set(1,1,1);
        object.position.x+=150;
        object.position.y-=15;
        object.traverse( function ( child )
        {
            if ( child instanceof THREE.Mesh )
                child.material.needsUpdate = true;
                child.material=mat2;
//                child.material.color.setHex(NONSEL_COLOR);
        });
        object.isAct=false;
        obstacles.add(object);
//        sphere = new THREE.Mesh(new THREE.SphereGeometry(150, 50, 50), mat);
//        var mat2=new THREE.MeshBasicMaterial();
//        mat2.color.setHex(NONSEL_COLOR);

//        object.setMaterials(mat2);
//    scene.add(object);
    } );


    particleGeometry = new THREE.Geometry();
    emitter.Init(PARTICLE_COUNT);

    var material = new THREE.ParticleSystemMaterial( { size: 2, vertexColors: true } );
    particleGeometry.__dirtyVertices = true;

    for (var i= 0;i<emitter.micra.length;i++){
        particleGeometry.vertices[i]=emitter.micra[i].pos;
        particleGeometry.colors[i]=emitter.micra[i].color;
}

    particles = new THREE.ParticleSystem(particleGeometry, material);
    particles.sortParticles = false;
    particles.dynamic=true;
    scene.add(particles);
    scene.autoUpdate = true;
    animate();
    container.appendChild(renderer.domElement);
    projector = new THREE.Projector();
    mouseVector = new THREE.Vector3();
    document.addEventListener( "keypress", onContainerKeyPress, false);
    container.addEventListener( 'dblclick', onContainerMouseDblClick, false);

//    window.addEventListener( 'resize', onWindowResize(), false );
}());

function animate(){
    particleGeometry.verticesNeedUpdate=true;
//    hitdetect();
    emitter.Update(obstacles);
    render();
    controls.update();
    requestAnimationFrame(animate,container);
}
function render(){
    renderer.render(scene, camera);
}
function onContainerKeyPress(e){
//    if (!IS_ACT){return;}
    if (!inter_obj){return;}
    if (!inter_obj.isAct){return;}
    if(lastDownTarget.parentElement == container) {
        var keys=String.fromCharCode(e.which);
        switch (keys)
        {
            case 'W':
                inter_obj.translateY(SMALL_MOVING_STEP);break;
            case 'w':
                inter_obj.translateY(MOVING_STEP);break;
            case 'A':
                inter_obj.translateX(-SMALL_MOVING_STEP);break;
            case 'a':
                inter_obj.translateX(-MOVING_STEP);break;
            case 'S':
                inter_obj.translateY(-SMALL_MOVING_STEP);break;
            case 's':
                inter_obj.translateY(-MOVING_STEP);break;
            case 'D':
                inter_obj.translateX(SMALL_MOVING_STEP);break;
            case 'd':
                inter_obj.translateX(MOVING_STEP);break;
            case 'Q':
                inter_obj.translateZ(SMALL_MOVING_STEP);break;
            case 'q':
                inter_obj.translateZ(MOVING_STEP);break;
            case 'E':
                inter_obj.translateZ(-SMALL_MOVING_STEP);break;
            case 'e':
                inter_obj.translateZ(-MOVING_STEP);break;

        }
    }

}
var getElementPosition = function(element) {
    var top =0;
    var left = 0;
    do {
        top  += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element =  element.offsetParent;
    }
    while (element);
    return {top: top, left: left};
}

function onContainerMouseDblClick(e){
//    IS_ACT=!IS_ACT;
    lastDownTarget= e.target;
//    var curcolor=IS_ACT==true?SEL_COLOR:NONSEL_COLOR;
//    alert(e.clientY);
//    var mouseX = e.clientX +document.body.scrollLeft+ renderer.domElement.scrollLeft- renderer.domElement.getBoundingClientRect().left;
//    var mouseY = e.clientY +document.body.scrollTop+ renderer.domElement.scrollTop- renderer.domElement.getBoundingClientRect().top;

    var mouseX = e.clientX +document.body.scrollLeft+ renderer.domElement.scrollLeft- getElementPosition(renderer.domElement).left;
    var mouseY = e.clientY +document.body.scrollTop+ renderer.domElement.scrollTop- getElementPosition(renderer.domElement).top;
//    mouseVector.x = 2 * ((e.clientX-container.clientLeft) / container.clientWidth) - 1;
//    mouseVector.y = 1 - 2 * (( e.clientY-container.clientTop) / container.clientHeight );
//    projector.unprojectVector( mouseVector.clone(), camera );
    mouseVector.x=(mouseX / renderer.domElement.getBoundingClientRect().width) * 2 - 1;
    mouseVector.y=- (mouseY / renderer.domElement.getBoundingClientRect().height) * 2 + 1;

    var raycaster = projector.pickingRay( mouseVector.clone(), camera ),
        intersects = raycaster.intersectObjects( obstacles.children,true);
        if (intersects.length>0){
            inter_obj = intersects[0].object;
            for(var j=0;j<obstacles.children.length;j++){
                obstacles.children[j].isAct=false;
                obstacles.children[j].material.color.setHex(NONSEL_COLOR);
            }
            inter_obj.isAct=true;
            inter_obj.material.color.setHex(SEL_COLOR);
        }else{
            for(var j=0;j<obstacles.children.length;j++){
                obstacles.children[j].isAct=false;
                obstacles.children[j].material.color.setHex(NONSEL_COLOR);
            }
            inter_obj=null;
        }
//    obstacles.children.forEach(function( obstacle ) {
//        obstacle.material.color.setRGB( 10,10 ,10  );
//    });



//    for( var i = 0; i < intersects.length; i++ ) {
//        var intersection = intersects[ i ],
//            obj = intersection.object;
//        obj.material.color.setHex(curcolor);
//    }

}

function buildAxes() {
    var axes = new THREE.Object3D();

    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 100, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -100, 0, 0 ), 0x800000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 100, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -100, 0 ), 0x008000, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 100 ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -100 ), 0x000080, true ) ); // -Z

    return axes;

}
function buildAxis( src, dst, colorHex, dashed ) {
    var geom = new THREE.Geometry(),
        mat;
    if(dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 5, gapSize: 5 });
    } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
    }
    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    var axis = new THREE.Line( geom, mat );
    return axis;

}

//function onWindowResize() {
//
//    windowHalfX = container.clientWidth / 2;
//    windowHalfY = container.clientHeight / 2;
//
//    camera.aspect = container.clientWidth / container.clientHeight;
//    camera.updateProjectionMatrix();
//
//    renderer.setSize( container.clientWidth, container.clientHeight);
//
//}