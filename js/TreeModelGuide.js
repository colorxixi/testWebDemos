/**
 * Created by Administrator on 13-11-15.
 */
var container_raw,controls_seg,container_skl,container_grow;
var stats,renderer,camera,scene,controls, forest1;
var renderer_raw,renderer_seg,renderer_skl,renderer_grow;
var scene_raw,scene_seg,scene_skl,scene_grow;
var forest_raw,forest_seg,forest_skl,forest_skl_pts,forest_grow,forest_grow_pts;
var axes_raw,axes_seg,axes_skl,axes_grow;
var controls_raw,controls_seg,controls_skl,controls_grow;
var ctrl_target,ctrl_position,ctrl_up;

//var octree;

//0:index, 1:modelpage, 1.1:modelsim, 1.2:modelguide, 1.3:modelleaf, 1.4:modelleaves, 2:vegeinv, 3:readingbooks, 4:house
(function()
{
		$("#countuser").load("../php/online.php?pinfo=p1.2");
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    container_raw = document.getElementById("container_raw");
    renderer_raw = new THREE.WebGLRenderer({antialias: false,clearAlpha: 1});
    renderer_raw.setSize(container_raw.clientWidth, container_raw.clientHeight,1);
    camera = new THREE.PerspectiveCamera(60, container_raw.clientWidth / container_raw.clientHeight, 0.001, 10000);
    camera.position.set(100, 0, 30);

    scene_raw = new THREE.Scene();
    scene_raw.add(camera);
    camera.lookAt(scene_raw.position);

    axes_raw = buildAxes();
    scene_raw.add(axes_raw);


    controls_raw = new THREE.TrackballControls(camera,container_raw);

    controls_raw.rotateSpeed = 1.0;
    controls_raw.zoomSpeed = 1.2;
    controls_raw.panSpeed = 0.8;
    controls_raw.noZoom = false;
    controls_raw.noPan = false;
    controls_raw.staticMoving = true;
    controls_raw.dynamicDampingFactor = 0.3;
//    controls_raw.addEventListener('change', render);
//    controls_raw.reset();

    forest_raw = new myForest();
    forest_raw.init();
    forest_raw.ImportFromCSV("data/LidarPoint_pks_gt1500.csv",scene_raw)

    container_raw.appendChild(renderer_raw.domElement);



    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10px';
    stats.domElement.style.left='2px';

    container_raw.appendChild( stats.domElement );

//more containers
    container_seg= document.getElementById("container_seg");
    renderer_seg = new THREE.WebGLRenderer({antialias: false,clearAlpha: 1});
    renderer_seg.setSize(container_seg.clientWidth, container_seg.clientHeight,1);
    scene_seg= new THREE.Scene();
    forest_seg = new myForest();
    forest_seg.init();
    var namelist=[];
    var filestr="Region_pts_";
    for (var fileid=1;fileid<=19;fileid++){
        namelist.push(filestr+fileid.toString());
    }
    forest_seg.MultiImportFromCSV("data/segments",namelist,scene_seg);
//    for (var j=0;j<forest_seg.forestCollections.length;j++){
//        scene_seg.add(forest_seg.forestCollections[j]);
//    }

    scene_seg.add(camera);
    axes_seg = buildAxes();
    scene_seg.add(axes_seg);
    controls_seg = new THREE.TrackballControls(camera,container_seg);
    controls_seg.rotateSpeed = 1.0;
    controls_seg.zoomSpeed = 1.2;
    controls_seg.panSpeed = 0.8;
    controls_seg.noZoom = false;
    controls_seg.noPan = false;
    controls_seg.staticMoving = true;
    controls_seg.dynamicDampingFactor = 0.3;
//    controls_seg.reset();
//    controls_seg.addEventListener('change', render);
    container_seg.appendChild(renderer_seg.domElement);

    container_skl=document.getElementById("container_skl");
    renderer_skl = new THREE.WebGLRenderer({antialias: false,clearAlpha: 1});
    renderer_skl.setSize(container_skl.clientWidth, container_skl.clientHeight,1);
    scene_skl= new THREE.Scene();
    forest_skl = new myForest();
    forest_skl.init();
    forest_skl.ImportFromXML( 'data/Tree.xml',scene_skl);
//    scene_skl.add( forest_skl.forestPts );

    forest_skl_pts = new myForest();
    forest_skl_pts.init();
    forest_skl_pts.ImportFromCSV("data/Trunk.csv");

    scene_skl.add(camera);
    axes_skl = buildAxes();
    scene_skl.add(axes_skl);
    controls_skl = new THREE.TrackballControls(camera,container_skl);
    controls_skl.rotateSpeed = 1.0;
    controls_skl.zoomSpeed = 1.2;
    controls_skl.panSpeed = 0.8;
    controls_skl.noZoom = false;
    controls_skl.noPan = false;
    controls_skl.staticMoving = true;
    controls_skl.dynamicDampingFactor = 0.3;
//    controls_skl.reset();
//    controls_skl.addEventListener('change', render);
    container_skl.appendChild(renderer_skl.domElement);

    container_grow=document.getElementById("container_grow");
    renderer_grow = new THREE.WebGLRenderer({antialias: false,clearAlpha: 1});
    renderer_grow.setSize(container_grow.clientWidth, container_grow.clientHeight,1);
    scene_grow= new THREE.Scene();

    forest_grow=new myForest();
    forest_grow.init();
    forest_grow.ImportFromObj("data/myTreeGen.obj",scene_grow);
//    scene_grow.add(forest_grow.forestPts);

    forest_grow_pts = new myForest();
    forest_grow_pts.init();
    forest_grow_pts.ImportFromCSV("data/Trunk.csv");

    scene_grow.add(camera);
    axes_grow = buildAxes();
    scene_grow.add(axes_grow);
    controls_grow = new THREE.TrackballControls(camera,container_grow);
    controls_grow.rotateSpeed = 1.0;
    controls_grow.zoomSpeed = 1.2;
    controls_grow.panSpeed = 0.8;
    controls_grow.noZoom = false;
    controls_grow.noPan = false;
    controls_grow.staticMoving = true;
    controls_grow.dynamicDampingFactor = 0.3;
//    controls_grow.reset();
//    controls_grow.addEventListener('change', render);
    container_grow.appendChild(renderer_grow.domElement);

    animate();
}());
function animate() {
    requestAnimationFrame(animate);
    controls_raw.update();
    controls_seg.update();
    controls_skl.update();
    controls_grow.update();

    render();
//    forest1.forestOctree.update();
    stats.update();
}
$('#myonoffswitch1').click(function() {
    if (this.checked){
        scene_skl.add(forest_skl_pts.forestPts);

    }else{
        if (forest_skl_pts.forestPts){
            var obj, i;
            for ( i = scene_skl.children.length - 1; i >= 0 ; i -- ) {
                obj = scene_skl.children[ i ];
                if ( obj == forest_skl_pts.forestPts) {
                    scene_skl.remove(obj);
                }
            }
        }
    };
});
$('#myonoffswitch2').click(function() {

    if (this.checked){
        scene_grow.add(forest_grow_pts.forestPts);
    }else{
        if (forest_grow_pts.forestPts){
            var obj, i;
            for ( i = scene_grow.children.length - 1; i >= 0 ; i -- ) {
                obj = scene_grow.children[ i ];
                if ( obj == forest_grow_pts.forestPts) {
                    scene_grow.remove(obj);
                }
            }
        }
    };
});
//function animate_seg() {
//    requestAnimationFrame(animate_seg,container_seg);
//    controls_seg.update();
//    render();
////    stats.update();
//}
//function animate_skl() {
//    requestAnimationFrame(animate_skl,container_seg);
//    controls_skl.update();
//    render();
////    stats.update();
//}
//function animate_grow() {
//    requestAnimationFrame(animate_grow,container_grow);
//    controls_grow.update();
//    render();
////    stats.update();
//}

function render() {
    renderer_raw.render( scene_raw, camera );
    renderer_seg.render( scene_seg, camera );
    renderer_skl.render( scene_skl, camera );
    renderer_grow.render( scene_grow, camera );
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


