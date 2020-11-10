/**
 * Created by truebelief on 14-6-13.
 */
/**
 * Created by Administrator on 13-12-8.
 */
var container_house,renderer_house,camera,scene_house,controls_house,axes_house,stats,house,housewire,ground;
var dirLight,hemiLight;
var dirline;
var DIRLIGHT_RADIUS=50;

//0:index, 1:modelpage, 1.1:modelsim, 1.2:modelguide, 1.3:modelleaf, 1.4:modelleaves, 2:vegeinv, 3:readingbooks, 4:house
(function() {

    $("#countuser").load("../php/online.php?pinfo=p4");
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    container_house = document.getElementById("container_house");
    renderer_house = new THREE.WebGLRenderer({antialias: false,clearAlpha: 1});
    renderer_house.setSize(container_house.clientWidth, container_house.clientHeight,1);
    camera = new THREE.PerspectiveCamera(40, container_house.clientWidth / container_house.clientHeight, 0.1, 100);
    camera.position.set(-15, 5, 15);
    camera.name='cameraobj';

    scene_house = new THREE.Scene();
    scene_house.add(camera);
    camera.lookAt(scene_house.position);

    axes_house = buildAxes();
    axes_house.name='axesobj';
    scene_house.add(axes_house);

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
    hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
    hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
    hemiLight.position.set( 0, 20, 0 );
    scene_house.add(hemiLight);

    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.intensity=0.8;
    var origdir=new THREE.Vector3(
        Math.sin(45*Math.PI/180)*Math.cos(45*Math.PI/180),
        Math.cos(45*Math.PI/180),
        Math.sin(45*Math.PI/180)*Math.sin(45*Math.PI/180)
    );
//    dirLight.position=origdir;
    dirLight.position=origdir.multiplyScalar(DIRLIGHT_RADIUS);
    dirLight.target.position.set( 0, 0, 0 );

    dirLight.name = "dirlight";
    scene_house.add( dirLight );




    var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x431616, specular: 0x431616 } );
    groundMat.color.setHSL( 0.095, 1, 0.75 );

    ground = new THREE.Mesh( groundGeo, groundMat );
    ground.rotation.x = -Math.PI/2;
    ground.position.y = -1;
    ground.name='groundobj';
    scene_house.add( ground );

    var linegeo = new THREE.Geometry();
    linegeo.vertices.push(new THREE.Vector3(0,0,0));
    linegeo.vertices.push( dirLight.position);
    dirline = new THREE.Line( linegeo, new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 5, gapSize: 2 } ), THREE.LineStrip );
    dirline.name='dirlineobj';
    scene_house.add(dirline);

    // add to the scene

    var ambient = new THREE.AmbientLight( 0xffffff );
    ambient.intensity=0.5;
    ambient.name='ambientobj';
    scene_house.add( ambient );

    controls_house = new THREE.TrackballControls(camera,container_house);
    controls_house.rotateSpeed = 1.0;
    controls_house.zoomSpeed = 1.5;
    controls_house.panSpeed = 0.8;
    controls_house.noZoom = false;
    controls_house.noPan = false;
    controls_house.staticMoving = false;
    controls_house.dynamicDampingFactor = 0.3;

    container_house.appendChild(renderer_house.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10px';
    stats.domElement.style.left='2px';

    container_house.appendChild( stats.domElement );

    var loader0 = new THREE.OBJLoader();
    loader0.load( 'data/house_solid.obj', function ( object ) {
        object.traverse( function ( object ) {
            if ( object instanceof THREE.Mesh ) {
                object.material=new THREE.MeshBasicMaterial({color:0x00ffff,wireframe: true});
            }
        } );

    })

    house=new THREE.Object3D();//very important, or without it, variable house will change to null.
    housewire=new THREE.Object3D();
    var loader = new THREE.OBJMTLLoader();
    loader.load( 'data/house_solid2.obj', 'data/house_solid2.mtl', function ( object ) {
        house=object.clone();
        house.name='houseobj';
        house.traverse( function( node ) {
            if( node.material ) {
                node.material.side=THREE.DoubleSide;
            }
        });
        object.traverse( function( node ) {
            if( node.material ) {
                node.material=new THREE.MeshBasicMaterial({color:0x00ffff,wireframe: true});
            }
        });
        housewire=object;
        house.castShadow=true;
        house.receiveShadow=true;
        housewire.name='housewireobj';
        scene_house.add(house);
    });

    ground.receiveShadow = true;
    ground.castShadow=false;

    dirLight.shadowCameraVisible = true;
    dirLight.castShadow = true;
    dirLight.shadowDarkness=0.65;
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 2048;
    renderer_house.shadowMapEnabled=true;
    renderer_house.shadowMapSoft = true;

    dirLight.shadowCameraNear = 0.1;
    dirLight.shadowCameraFar=camera.far;
    dirLight.shadowCameraFov = 20;
    dirLight.shadowMapDarkness =0.5;

    dirLight.shadowCameraLeft  = -10;
    dirLight.shadowCameraRight  = 10;

    dirLight.shadowCameraBottom  = -10;
    dirLight.shadowCameraTop  = 10;
    animate();

}());




function animate() {
    requestAnimationFrame(animate);
    controls_house.update();
    render();
    stats.update();
}

function render() {
    renderer_house.render( scene_house, camera );
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

$('#myonoffswitch_house').click(function() {
    if (this.checked){
        scene_house.remove(house);
        scene_house.add(housewire);
    }else{
        scene_house.remove(housewire);
        scene_house.add(house);
    };
});



