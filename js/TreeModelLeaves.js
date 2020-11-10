/**
 * Created by Administrator on 13-12-17.
 */
/**
 * Created by Administrator on 13-12-8.
 */
var container_leaves,renderer_leaves,camera,scene_leaves,controls_leaves,axes_leaves,stats,lfmesh,ground;
var bend, bend2, modStack;
var dirLight,hemiLight;
var origdir,dirline;
var LEAF_BEND_X_MIN,LEAF_BEND_X_MAX,LEAF_BEND_X_DEFAULT,LEAF_BEND_Y_MIN,LEAF_BEND_Y_MAX,LEAF_BEND_Y_DEFAULT;
var LEAF_SCALE_X_MIN,LEAF_SCALE_X_MAX,LEAF_SCALE_X_DEFAULT,LEAF_SCALE_Y_MIN,LEAF_SCALE_Y_MAX,LEAF_SCALE_Y_DEFAULT;

var LAD_A_MIN,LAD_A_MAX,LAD_A_DEFAULT,LAD_B_MIN,LAD_B_MAX,LAD_B_DEFAULT,LAD_C_MIN,LAD_C_MAX,LAD_C_DEFAULT;
var LAI_PO_MIN,LAI_PO_MAX,LAI_PO_DEFAULT,LAI_CLU_MIN,LAI_CLU_MAX,LAI_CLU_DEFAULT,LAI_DIS_MIN,LAI_DIS_MAX,LAI_DIS_DEFAULT;

var CROWN_SCALE_X_MIN,CROWN_SCALE_X_MAX,CROWN_SCALE_X_DEFAULT,CROWN_SCALE_Y_MIN,CROWN_SCALE_Y_MAX,CROWN_SCALE_Y_DEFAULT;
var CROWN_PO_MIN,CROWN_PO_MAX,CROWN_PO_DEFAULT,CROWN_CLU_MIN,CROWN_CLU_MAX,CROWN_CLU_DEFAULT,CROWN_DIS_MIN,CROWN_DIS_MAX,CROWN_DIS_DEFAULT;

var SCENE_SIZE_MIN,SCENE_SIZE_MAX,SCENE_SIZE_DEFAULT;
var DIRLIGHT_ZENITH_MIN,DIRLIGHT_ZENITH_MAX,DIRLIGHT_ZENITH_DEFAULT;
var DIRLIGHT_AZIMUTH_MIN,DIRLIGHT_AZIMUTH_MAX,DIRLIGHT_AZIMUTH_DEFAULT;
var DIRLIGHT_INTENSITY_MIN,DIRLIGHT_INTENSITY_MAX,DIRLIGHT_INTENSITY_DEFAULT;

var DIRLIGHT_RADIUS=300;

var LEAF_SIDE=1;//leaf size screen scale
var leaf_scaling_factor;
var SPHERE_RADIUS=10;
var SCENE_SIDE=100;

var lfmesh_factory,leaflist,crownlist;
var particles,particleGeometry,particle_material;
var pointLocList,pointAngList;
var pointCount;
var crownLocList;
var boundingobj,boundingobjC,boundinggeo,boundinggeoC,boundingmat,boundingmatC;
var CROWN_CLUSTER_DIST=1; //two crown radius distance
var LEAF_CLUSTER_DIST=2; //two leaf size distance

//0:index, 1:modelpage, 1.1:modelsim, 1.2:modelguide, 1.3:modelleaf, 1.4:modelleaves, 2:vegeinv, 3:readingbooks, 4:house
(function() {
    $("#countuser").load("../php/online.php?pinfo=p1.4");
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    LEAF_BEND_X_MIN=$("#scrollrange_LEAF_BX").attr("min");
    LEAF_BEND_X_MAX=$("#scrollrange_LEAF_BX").attr("max");
    LEAF_BEND_X_DEFAULT=$("#scrollrange_LEAF_BX").attr("value");
    LEAF_BEND_Y_MIN=$("#scrollrange_LEAF_BY").attr("min");
    LEAF_BEND_Y_MAX=$("#scrollrange_LEAF_BY").attr("max");
    LEAF_BEND_Y_DEFAULT=$("#scrollrange_LEAF_BY").attr("value");

    LEAF_SCALE_X_MIN=$("#scrollrange_LEAF_SX").attr("min");
    LEAF_SCALE_X_MAX=$("#scrollrange_LEAF_SX").attr("max");
    LEAF_SCALE_X_DEFAULT=$("#scrollrange_LEAF_SX").attr("value");
    LEAF_SCALE_Y_MIN=$("#scrollrange_LEAF_SY").attr("min");
    LEAF_SCALE_Y_MAX=$("#scrollrange_LEAF_SY").attr("max");
    LEAF_SCALE_Y_DEFAULT=$("#scrollrange_LEAF_SY").attr("value");

    LAD_A_MIN=$("#scrollrange_LAD_A").attr("min");
    LAD_A_MAX=$("#scrollrange_LAD_A").attr("max");
    LAD_A_DEFAULT=$("#scrollrange_LAD_A").attr("value");
    LAD_B_MIN=$("#scrollrange_LAD_B").attr("min");
    LAD_B_MAX=$("#scrollrange_LAD_B").attr("max");
    LAD_B_DEFAULT=$("#scrollrange_LAD_B").attr("value");
    LAD_C_MIN=$("#scrollrange_LAD_C").attr("min");
    LAD_C_MAX=$("#scrollrange_LAD_C").attr("max");
    LAD_C_DEFAULT=$("#scrollrange_LAD_C").attr("value");

    LAI_PO_MIN=$("#scrollrange_LAI_PO").attr("min");
    LAI_PO_MAX=$("#scrollrange_LAI_PO").attr("max");
    LAI_PO_DEFAULT=$("#scrollrange_LAI_PO").attr("value");
    LAI_CLU_MIN=$("#scrollrange_LAI_CLU").attr("min");
    LAI_CLU_MAX=$("#scrollrange_LAI_CLU").attr("max");
    LAI_CLU_DEFAULT=$("#scrollrange_LAI_CLU").attr("value");
    LAI_DIS_MIN=$("#scrollrange_LAI_DIS").attr("min");
    LAI_DIS_MAX=$("#scrollrange_LAI_DIS").attr("max");
    LAI_DIS_DEFAULT=$("#scrollrange_LAI_DIS").attr("value");

    CROWN_SCALE_X_MIN=$("#scrollrange_CROWN_SX").attr("min");
    CROWN_SCALE_X_MAX=$("#scrollrange_CROWN_SX").attr("max");
    CROWN_SCALE_X_DEFAULT=$("#scrollrange_CROWN_SX").attr("value");
    CROWN_SCALE_Y_MIN=$("#scrollrange_CROWN_SY").attr("min");
    CROWN_SCALE_Y_MAX=$("#scrollrange_CROWN_SY").attr("max");
    CROWN_SCALE_Y_DEFAULT=$("#scrollrange_CROWN_SY").attr("value");

    CROWN_PO_MIN=$("#scrollrange_CROWN_PO").attr("min");
    CROWN_PO_MAX=$("#scrollrange_CROWN_PO").attr("max");
    CROWN_PO_DEFAULT=$("#scrollrange_CROWN_PO").attr("value");
    CROWN_CLU_MIN=$("#scrollrange_CROWN_CLU").attr("min");
    CROWN_CLU_MAX=$("#scrollrange_CROWN_CLU").attr("max");
    CROWN_CLU_DEFAULT=$("#scrollrange_CROWN_CLU").attr("value");
    CROWN_DIS_MIN=$("#scrollrange_CROWN_DIS").attr("min");
    CROWN_DIS_MAX=$("#scrollrange_CROWN_DIS").attr("max");
    CROWN_DIS_DEFAULT=$("#scrollrange_CROWN_DIS").attr("value");

    SCENE_SIZE_MIN=$("#scrollrange_SCENE_S").attr("min");
    SCENE_SIZE_MAX=$("#scrollrange_SCENE_S").attr("max");
    SCENE_SIZE_DEFAULT=$("#scrollrange_SCENE_S").attr("value");



    DIRLIGHT_ZENITH_MIN=$("#scrollrange_DIR_ZE").attr("min");
    DIRLIGHT_ZENITH_MAX=$("#scrollrange_DIR_ZE").attr("max");
    DIRLIGHT_ZENITH_DEFAULT=$("#scrollrange_DIR_ZE").attr("value");
    DIRLIGHT_AZIMUTH_MIN=$("#scrollrange_DIR_AZ").attr("min");
    DIRLIGHT_AZIMUTH_MAX=$("#scrollrange_DIR_AZ").attr("max");
    DIRLIGHT_AZIMUTH_DEFAULT=$("#scrollrange_DIR_AZ").attr("value");
    DIRLIGHT_INTENSITY_MIN=$("#scrollrange_DIR_INT").attr("min");
    DIRLIGHT_INTENSITY_MAX=$("#scrollrange_DIR_INT").attr("max");
    DIRLIGHT_INTENSITY_DEFAULT=$("#scrollrange_DIR_INT").attr("value");

    container_leaves = document.getElementById("container_leaves");
    renderer_leaves = new THREE.WebGLRenderer({antialias: false,clearAlpha: 1});
    renderer_leaves.setSize(container_leaves.clientWidth, container_leaves.clientHeight,1);
    camera = new THREE.PerspectiveCamera(60, container_leaves.clientWidth / container_leaves.clientHeight, 0.001, 10000);
    camera.position.set(4, -1, 4);

    scene_leaves = new THREE.Scene();
    scene_leaves.add(camera);
    camera.lookAt(scene_leaves.position);

    axes_leaves = buildAxes();
    scene_leaves.add(axes_leaves);

//    // create a point light
//    pointLight =
//        new THREE.PointLight(0xFFFFFF);
//    pointLight.position.x = 0;
//    pointLight.position.y = -1;
//    pointLight.position.z = 0;
//    pointLight.distance=100;
//    pointLight.intensity=10;
//    pointLight.shadowCameraVisible = false;
//    scene_leaves.add(pointLight);

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.8 );

    hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
    hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
    hemiLight.position.set( 0, 3, 0 );
//    scene_leaves.add(hemiLight);

    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.intensity=DIRLIGHT_INTENSITY_DEFAULT;
    origdir=new THREE.Vector3(
        Math.sin(DIRLIGHT_ZENITH_DEFAULT*Math.PI/180)*Math.cos(DIRLIGHT_AZIMUTH_DEFAULT*Math.PI/180),
        Math.cos(DIRLIGHT_ZENITH_DEFAULT*Math.PI/180),
        Math.sin(DIRLIGHT_ZENITH_DEFAULT*Math.PI/180)*Math.sin(DIRLIGHT_AZIMUTH_DEFAULT*Math.PI/180)
    );
    dirLight.position=origdir.clone();
    dirLight.position.multiplyScalar(DIRLIGHT_RADIUS);
    dirLight.target.position.set( 0, 0, 0 );

    dirLight.name = "dirlight";
    scene_leaves.add( dirLight );




    var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x431616, specular: 0x431616 } );
//    var groundMat = new THREE.MeshPhongMaterial();
    groundMat.color.setHSL( 0.095, 1, 0.75 );

    ground = new THREE.Mesh( groundGeo, groundMat );
    ground.rotation.x = -Math.PI/2;
    ground.position.y = -20;
    scene_leaves.add( ground );

    var linegeo = new THREE.Geometry();
    linegeo.vertices.push(new THREE.Vector3(0,0,0));
    linegeo.vertices.push( dirLight.position);
    dirline = new THREE.Line( linegeo, new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 5, gapSize: 2 } ), THREE.LineStrip );
    scene_leaves.add(dirline);

//    var sphereGeo = new THREE.SphereGeometry(1,20,20);
//
//    var sphereMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xaaffff, specular: 0x050505 } );
//    sph = new THREE.Mesh(sphereGeo,sphereMat);
//    sph.position.z=-1;
//    sph.position.y=0;
//    scene_leaves.add(sph);

//    var plGeo = new THREE.PlaneGeometry(1,20,20);
//
//    var plMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x431616, specular: 0x050505 } );
//    pl = new THREE.Mesh(plGeo,plMat);
//    pl.position.z=-1;
//    pl.position.y=0;
//    scene_leaves.add(pl);
//    pl.castShadow=true;

    // add to the scene

    var ambient = new THREE.AmbientLight( 0xffffff );
    ambient.intensity=1;
    scene_leaves.add( ambient );

    controls_leaves = new THREE.TrackballControls(camera,container_leaves);
    controls_leaves.rotateSpeed = 1.0;
    controls_leaves.zoomSpeed = 1.5;
    controls_leaves.panSpeed = 0.8;
    controls_leaves.noZoom = false;
    controls_leaves.noPan = false;
    controls_leaves.staticMoving = false;
    controls_leaves.dynamicDampingFactor = 0.3;

    container_leaves.appendChild(renderer_leaves.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10px';
    stats.domElement.style.left='2px';

    container_leaves.appendChild( stats.domElement );

//    $("#countuser").load("../php/online.php");
//    var forestPts=new THREE.Object3D();
//    var objfilepath="data/leavesB.obj"
//    var loader;
//    loader = new THREE.OBJLoader();
//    loader.load( objfilepath, function ( object ) {
//        var mat2 = new THREE.MeshBasicMaterial({color: 0x00FF11});
//        mat2.side = THREE.DoubleSide;
////        object.scale.set(10,10,10);
//        object.traverse( function ( child )
//        {
//            if ( child instanceof THREE.Mesh )
//                child.material.needsUpdate = true;
//                child.material=mat2;
//        });
//        forestPts=object;
////        scene_leaves.add(object);
//    });
//
//
//    var loader = new THREE.OBJMTLLoader();
//////    var loader = new THREE.OBJMTLLoader();
////    loader.addEventListener( 'load', function ( event ) {
////
////        var object = event.content;
////
//////        object.position.y = - 80;
////        scene_leaves.add( object );
////
////    });
////    loader.load( 'data/leavesBC2.obj', 'data/leavesBC2.mtl' );
//    var leavesobj=new THREE.Object3D();
//    loader.load( 'data/rappy/rappy.obj', 'data/rappy/rappy.mtl', function ( object ) {
//        object.position.x = 5;
//        object.position.y = 0;
//        object.position.z = 0;
//        object.scale.set(0.3,0.3,0.3);
//        leavesobj=object;
//        scene_leaves.add(object);
//    } );

    var csvfilepath="data/leafpts.csv";
    var lfshape;
    $.ajax({
        type:    "GET",
        url: csvfilepath,
        dataType: 'text',
        cache: true,
        async: false,
        error: function(){
            alert('fail get csv file!');
        }
    }).done(function(csvAsString){
            var csvpts=csvAsString.split('\n');
            csvpts.pop();
            var vecArr=[];
            for (var i=0;i< csvpts.length;i++)
            {
                var csvpt=csvpts[i].split(',');
                vecArr.push(new THREE.Vector3(parseFloat(csvpt[0]),parseFloat(csvpt[1]),0));
            }
            var lspline = new THREE.SplineCurve(vecArr);
            lfshape = new THREE.Shape(lspline.getSpacedPoints(300));

//            var lfshapegeo=new THREE.ShapeGeometry(lfshape);

//            //move centroid to origin
//            var lfcenteroid=new THREE.Vector3();
//            for (var i = 0, l = lfshapegeo.vertices.length; i < l; i++) {
//                lfcenteroid.add(lfshapegeo.vertices[i].clone());
//            }
//            lfcenteroid.divideScalar(lfshapegeo.vertices.length);
//            var offset = lfcenteroid.clone();

//            lfshapegeo.applyMatrix(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));

            var lfmat=new THREE.MeshPhongMaterial({transparent: true, opacity: 1}); // transparent for png alpha part
            var lfmatB=new THREE.MeshPhongMaterial({transparent: true, opacity: 1});

//            var lfshapegeoB=lfshapegeo.clone();
////            for (var i=0;i<lfshapegeoB.faces.length;i++){
////                lfshapegeoB.faces[i].normal.set(-lfshapegeoB.faces[i].x,-lfshapegeoB.faces[i].y,-lfshapegeoB.faces[i].z);
////            }
//            lfshapegeoB.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
//            THREE.GeometryUtils.merge( lfshapegeo, lfshapegeoB, 1 );

//            lfmat.side = THREE.FrontSide;
//            lfmatB.side=THREE.FrontSide;

            var lftexture=THREE.ImageUtils.loadTexture("data/f1.png");
            var lftextureB=THREE.ImageUtils.loadTexture("data/b1.png");
            lftexture.repeat.x=0.0028;
            lftexture.repeat.y =0.00185;

//            lftexture.offset.x = 0;
//            lftexture.offset.y = 0.0;

            lftextureB.repeat.x=0.0028;
            lftextureB.repeat.y =0.00186;

            lfmat.map=lftexture;
            lfmatB.map=lftextureB;
            var lfmatS = new THREE.MeshLambertMaterial( { transparent: false, opacity: 1, color: 0x000000 } );
//            lfmesh=new THREE.Mesh(lfshapegeo,new THREE.MeshFaceMaterial([lfmat,lfmatB]));
//            scene_leaves.add(lfmesh);

            var extrusionSettings = {
                size: 1, height: 1, curveSegments: 30,
                bevelThickness: 1, bevelSize: 1, bevelEnabled: false,
                material: 0, extrudeMaterial: 1,amount: 2
            };

            var lfGeometry = new THREE.ExtrudeGeometry( lfshape, extrusionSettings );
            var lfcenteroid=new THREE.Vector3();
            for (var i = 0, l = lfGeometry.vertices.length; i < l; i++) {
                lfcenteroid.add(lfGeometry.vertices[i].clone());
            }
            var s=1;
            lfcenteroid.divideScalar(lfGeometry.vertices.length);
            var offset = lfcenteroid.clone();
            lfGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
            var materialArray = [ lfmatB, lfmatS,lfmat ];
            var lfMaterial = new THREE.MeshFaceMaterial(materialArray);

            lfmesh = new THREE.Mesh( lfGeometry, lfMaterial );

            for ( var face in lfmesh.geometry.faces ) {
                if (lfmesh.geometry.faces[ face ].normal.z == 1) lfmesh.geometry.faces[ face ].materialIndex = 2;
            }
            lfmesh.position.set(0,0,0);
            lfmesh.castShadow=true;
            lfmesh.receiveShadow=true;
            leaflist=[];
            pointAngList=[(new THREE.Vector3(0,0,0))];

            var box = new THREE.Box3();
            box.setFromObject(lfmesh);
            var lfxside=box.max.x-box.min.x;
            var lfyside=box.max.y-box.min.y;
//            var lfzside=box.max.z-box.min.z;
            leaf_scaling_factor=LEAF_SIDE/lfxside;//0.002
            lfmesh.scale.set(leaf_scaling_factor,leaf_scaling_factor,leaf_scaling_factor);
            lfmesh_factory=lfmesh.clone();
            crownLocList=[];
            pointLocList=[];
            crownlist=[];

            ResetLeavesObj(true);
        });
    SetLeavesBend();
    $("#myonoffswitch_wire").prop("checked", false);
    $("#myonoffswitch_dot").prop("checked", false);
    $("#myonoffswitch_leaves").prop("checked", true);
//    lfmesh.rotateY(-Math.PI/2);
//    lfmesh.rotateY(-Math.PI/2);


//    renderer_leaves.shadowMapEnabled=false;
//    renderer_leaves.shadowMapSoft = true;
//    renderer_leaves.shadowCameraNear = 3;
//    renderer_leaves.shadowCameraFar = camera.far;
//    renderer_leaves.shadowCameraFov = 50;
//    renderer_leaves.shadowMapBias = 0.0039;
//    renderer_leaves.shadowMapDarkness = 0.5;
//    renderer_leaves.shadowMapWidth = 1024;
//    renderer_leaves.shadowMapHeight = 1024;

//    lfmesh.castShadow=true;
//    lfmesh.receiveShadow=true;

//    sph.receiveShadow=true;
//    sph.castShadow=true;
//    lfline.castShaow=true;
    dirLight.castShadow = true;
    ground.receiveShadow = true;
    ground.castShadow=false;
    dirLight.shadowCameraVisible = true;

    dirLight.shadowDarkness=0.85;
    //defining the shadow resolution (impacted by shadow camera size)
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 2048*2;

//    renderer_leaves.shadowMapCullFace = THREE.CullFaceBack;
//    renderer_leaves.shadowMapCullFrontFaces = true;

    dirLight.shadowCameraNear = 1;
    dirLight.shadowCameraFar=camera.far;
//    dirLight.shadowCameraFar = camera.far;
    dirLight.shadowCameraFov = 40;
//    dirLight.shadowMapBias = 0.0039;
    dirLight.shadowMapDarkness =0.5;

    dirLight.shadowCameraLeft  = -160;
    dirLight.shadowCameraRight  = 160;

    dirLight.shadowCameraBottom  = -160;
    dirLight.shadowCameraTop  = 160;

    renderer_leaves.shadowMapEnabled=true;
    renderer_leaves.shadowMapSoft = true;
    animate();

}());

function GenPoisson(lambda,BoundaryObject){
    var pointList=[];
    var box = new THREE.Box3();
    box.setFromObject(BoundaryObject);
    var xside=box.max.x-box.min.x;
    var yside=box.max.y-box.min.y;
    var zside=box.max.z-box.min.z;
    var npoints = Math.floor(lambda * xside * yside * zside);
    for (var i=0;i<npoints;i++)
    {
        pointList.push(new THREE.Vector3(Math.random()*xside+box.min.x,Math.random()*yside+box.min.y,Math.random()*zside+box.min.z));
    }
    return pointList;
};
// S_lambda   - nr of offspring per parent event. Should be an integer bigger than 0.
// E_distance - mean distance from offspring to parent
function GenPoissonCluster(lambda,S_lambda,E_distance,BoundaryObject){
    var pointList = [];

    var box = new THREE.Box3();
    box.setFromObject(BoundaryObject);
    var xside=box.max.x-box.min.x;
    var yside=box.max.y-box.min.y;
    var zside=box.max.z-box.min.z;

    var nparentpoints = Math.floor(lambda/S_lambda * xside * yside * zside);
    if (nparentpoints<1){nparentpoints=1;}
    for (var i=0;i<nparentpoints;i++)
    {
        var pointparentX=Math.random()*xside+box.min.x;
        var pointparentY=Math.random()*yside+box.min.y;
        var pointparentZ=Math.random()*zside+box.min.z;
        for (var j=1;j<Math.round(S_lambda);j++){
            var R = SampleFromDistrEXP(E_distance);
            var azimuth = Math.random()*2*Math.PI;
            var zenith = Math.asin((Math.random()*2*R - R)/R);// random point on sphere of R distance
            var dz=R*Math.cos(zenith);
            var dx=R*Math.sin(zenith)*Math.cos(azimuth);
            var dy=R*Math.sin(zenith)*Math.sin(azimuth);
            pointList.push(new THREE.Vector3(pointparentX+dx,pointparentY+dy,pointparentZ+dz));
        }
    }

    return pointList;
};
function GenSimpleInhibit(lambda,delta,BoundaryObject){
    var pointList = [];
    var box = new THREE.Box3();
    box.setFromObject(BoundaryObject);
    var xside=box.max.x-box.min.x;
    var yside=box.max.y-box.min.y;
    var zside=box.max.z-box.min.z;

    var npoints = Math.floor(lambda * xside * yside * zside);
    if (npoints * Math.pow(delta,3)> xside*yside*zside){delta=Math.pow(lambda,1/3)};

    while(pointList.length < npoints){
        var testptX = Math.random()* xside+box.min.x;
        var testptY = Math.random()* yside+box.min.y;
        var testptZ = Math.random()* zside+box.min.z;

        var discard = 0;
        for (var i = 0;i<pointList.length;i++){
            var dist=Math.sqrt(Math.pow((testptX-pointList[i].x),2)+Math.pow((testptY-pointList[i].y),2)+
                Math.pow((testptZ-pointList[i].z),2));
            if (dist<delta){
                discard = 1;
                break;
            }
        }
        if (discard == 0){
            pointList.push(new THREE.Vector3(testptX,testptY,testptZ));
        }
    }
    return pointList;
}

function SamplesFromDistrTRI(a,b,c,xstart,xend,xstep,N_ITERATION){
    var x=[],y=[];
//    var a=2/Math.PI;
//    var b=-2/Math.PI;
//    var c=1/Math.PI;
//    var xstep=Math.PI/500;
//    var xstart=Math.PI/30;
//    var xend=Math.PI*29/30;
    for (var i=xstart;i<=xend;i+=xstep){
        x.push(i);
        y.push(calcfuncTRI(i,a,b,c));
    }
    var f_prop=[],p_prop=[];
    var sum_f_prop=0;
    for (var ix= 0;ix<x.length-1;ix++){
        var maxf=Math.max(y[ix],y[ix+1]);
        f_prop.push(maxf);
        sum_f_prop+=maxf;
    }
    f_prop.push(f_prop[x.length-2]);
    sum_f_prop+=f_prop[x.length-2];

    for (var ix= 0;ix<x.length;ix++){
        p_prop[ix]=f_prop[ix]/sum_f_prop;
    }
//    var N_ITERATION=10000;
    var samples=[];
    var numiter=N_ITERATION;
    while(numiter>=0){
        var r = Math.random();
        var i_prop = mapsegid(r,cumsum(p_prop));
        var x_prop=Math.random()*(x[i_prop+1]-x[i_prop])+x[i_prop];
        var alpha=calcfuncTRI(x_prop,a,b,c)/f_prop[i_prop];
        var u=Math.random();
        if (u<alpha){
            samples.push(x_prop);
            numiter--;
        }
    }
    return samples;
}
function SampleFromDistrEXP(E_distance){
    x=Math.random();
    return -Math.log(x*E_distance)*E_distance;
}
function calcfuncTRI(x,a,b,c){
    var eps=10^(-10);
    return((a+b*Math.cos(2*x)+c*Math.cos(4*x))/Math.sin(x+eps));
}
function cumsum(vec){
    var sumvec=[];
    for (var i=0; i<vec.length;sumvec[i] = 0, i++);
    for(var i=vec.length-1;i>=0;i--){
        var sum=0;
        for (var j=0;j<=i;j++){
            sum+=vec[j];
        }
        sumvec[i]=sum;
    }
    return sumvec;
}
function mapsegid(num,vecRef){
    var segid=0;
    for (var i=0;i<vecRef.length;i++){
        if (num>=vecRef[i]){segid=i};
    }
    return segid;
}


function CleanLeavesObj(){
    var obj, i;
    for ( i = scene_leaves.children.length - 1; i >= 0 ; i -- ) {
        obj = scene_leaves.children[ i ];
        if ( obj == particles || obj==boundingobjC || $.inArray(obj,leaflist)!=-1 || $.inArray(obj,crownlist)!=-1) {
            scene_leaves.remove(obj);
        }
    }
}
function ResetLeavesObj(resetview){
    CleanLeavesObj();
    $("#myonoffswitch_wire").prop("checked", false);
    $("#myonoffswitch_dot").prop("checked", false);
    $("#myonoffswitch_leaves").prop("checked", true);
    particleGeometry=new THREE.Geometry();
    particleGeometry.verticesNeedUpdate = true;
    particleGeometry.vertices[0]=new THREE.Vector3(0,0,0);
    particleGeometry.colors[0]=new THREE.Color(0xffff00);
    particle_material = new THREE.ParticleSystemMaterial({size: 0.8, vertexColors: true });
    particles = new THREE.ParticleSystem(particleGeometry, particle_material);
//    prev_particles=particles;

    boundinggeoC=new THREE.CubeGeometry(SCENE_SIDE, 2*SPHERE_RADIUS, SCENE_SIDE);
//    boundinggeoC.applyMatrix( new THREE.Matrix4().makeScale( csx, csy, csx ));

    boundingmatC=new THREE.MeshBasicMaterial({color:0x00ffff,wireframe: true});
    boundingmatC.side=THREE.DoubleSide;
    boundingobjC=new THREE.Mesh(boundinggeoC,boundingmatC);
    boundingobjC.position.set(0,0,0);
    ground.position.y = -boundinggeoC.height/2-10;

    crownlist.length=0;
    crownLocList=[(new THREE.Vector3(0,0,0))];
    boundinggeo=new THREE.SphereGeometry(SPHERE_RADIUS, 10, 10);
    boundingmat=new THREE.MeshBasicMaterial({color:0xff0000,wireframe: true});
    boundingmat.side=THREE.DoubleSide;
    boundingobj=new THREE.Mesh(boundinggeo,boundingmat);
    crownlist.push(boundingobj);
    crownlist[0].position.set(crownLocList[0].x,crownLocList[0].y,crownLocList[0].z);

    leaflist.length=0;
    leaflist.push(lfmesh_factory.clone());
    scene_leaves.add(leaflist[0]);

    pointCount=1;
    pointLocList=[(new THREE.Vector3(0,0,0))];
    pointAngList=[(new THREE.Vector3(0,0,0))];
    if (resetview){controls_leaves.reset();}

//    scene_leaves.add(dirline);
//    scene_leaves.add(dirLight);
//    dirLight.shadowCameraVisible = true;
//    dirLight.position=origdir.multiplyScalar(DIRLIGHT_RADIUS);
//    dirLight.target.position.set( 0, 0, 0 );
}
function CreateLeavesObj(){
    CleanLeavesObj();
    $("#myonoffswitch_wire").prop("checked", true);
    $("#myonoffswitch_dot").prop("checked", true);
    $("#myonoffswitch_leaves").prop("checked", true);

    scene_leaves.add(boundingobjC);
    for (var icr=0;icr<crownLocList.length;icr++){
        scene_leaves.add(crownlist[icr]);
    }
    particleGeometry = new THREE.Geometry();
    particle_material = new THREE.ParticleSystemMaterial({size: 0.8, vertexColors: true });
    particleGeometry.verticesNeedUpdate = true;
    var clr,newlfmesh;
    for (var ipt= 0;ipt<pointLocList.length;ipt++){
        particleGeometry.vertices[ipt]=pointLocList[ipt].clone();
        clr=new THREE.Color();
        clr.setRGB(50,50,0);
        particleGeometry.colors[ipt]=clr;
    }
    particles = new THREE.ParticleSystem(particleGeometry, particle_material);
    particles.sortParticles = false;
    particles.dynamic=true;
    scene_leaves.add(particles);
//    prev_particles=particles;
    leaflist.length=0;
    for (var ipt= 0;ipt<pointLocList.length;ipt++){
    newlfmesh = lfmesh_factory.clone();
    newlfmesh.position.set(pointLocList[ipt].x,pointLocList[ipt].y,pointLocList[ipt].z);
    newlfmesh.rotation.set(pointAngList[ipt].x,pointAngList[ipt].y,pointAngList[ipt].z);
    leaflist.push(newlfmesh);
    scene_leaves.add(newlfmesh);
    }


}

function SynUpdateLeavesObj(){
    CleanLeavesObj();
    var csx=parseFloat($("#scroll_CROWN_SX").text());
    var csy=parseFloat($("#scroll_CROWN_SY").text());
    var cdistp=parseFloat($("#scroll_CROWN_PO").text());
    var cdistc=parseFloat($("#scroll_CROWN_CLU").text());
    var cdistd=parseFloat($("#scroll_CROWN_DIS").text());

    var ldistp=parseFloat($("#scroll_LAI_PO").text());
    var ldistc=parseFloat($("#scroll_LAI_CLU").text());
    var ldistd=parseFloat($("#scroll_LAI_DIS").text());

    var scensz=parseFloat($("#scroll_SCENE_S").text());

    leaflist.length=0;
    crownlist.length=0;
    crownLocList.length=0;
    pointLocList.length=0;

    boundinggeoC=new THREE.CubeGeometry(SCENE_SIDE*scensz*csx, 2*SPHERE_RADIUS*csy, SCENE_SIDE*scensz*csx);
//    boundinggeoC.applyMatrix( new THREE.Matrix4().makeScale( csx, csy, csx ));

    boundingmatC=new THREE.MeshBasicMaterial({color:0x00ffff,wireframe: true});
    boundingmatC.side=THREE.DoubleSide;
    boundingobjC=new THREE.Mesh(boundinggeoC,boundingmatC);
    boundingobjC.position.set(0,0,0);
    ground.position.y = -boundinggeoC.height/2-10;

    if (cdistp!=0){
        if (cdistc!=0){
            crownLocList=GenPoissonCluster(cdistp*1/(SCENE_SIDE*2*SPHERE_RADIUS*SCENE_SIDE),cdistc+1,CROWN_CLUSTER_DIST*csx*SPHERE_RADIUS,boundingobjC);
        }else if(cdistd!=0){
            crownLocList=GenSimpleInhibit(cdistp*1/(SCENE_SIDE*2*SPHERE_RADIUS*SCENE_SIDE),cdistd/4*SPHERE_RADIUS*csx,boundingobjC);
        }else{
            crownLocList=GenPoisson(cdistp*1/(SCENE_SIDE*2*SPHERE_RADIUS*SCENE_SIDE),boundingobjC);
        }
    }else{
        crownLocList=[(new THREE.Vector3(0,0,0))];
    }

    boundinggeo=new THREE.SphereGeometry(SPHERE_RADIUS, 10, 10);
    boundinggeo.applyMatrix( new THREE.Matrix4().makeScale( csx, csy, csx ));

//    boundinggeo.position=new THREE.Vector3(0,0,0);

    boundingmat=new THREE.MeshBasicMaterial({color:0xff0000,wireframe: true});
    boundingmat.side=THREE.DoubleSide;
    boundingobj=new THREE.Mesh(boundinggeo,boundingmat);


    for (var icr=0;icr<crownLocList.length;icr++){
        crownlist.push(boundingobj.clone());
        crownlist[icr].position.set(crownLocList[icr].x,crownLocList[icr].y,crownLocList[icr].z);

        var pointLoc=[];
        if (ldistp!=0){
            if (ldistc!=0){
                pointLoc=GenPoissonCluster(ldistp*1/(SPHERE_RADIUS*SPHERE_RADIUS*Math.PI),ldistc+1,LEAF_CLUSTER_DIST*LEAF_SIDE,crownlist[icr]);
            }else if(ldistd!=0){
                pointLoc=GenSimpleInhibit(ldistp*1/(SPHERE_RADIUS*SPHERE_RADIUS*Math.PI),ldistd/3*LEAF_SIDE,crownlist[icr]);
            }else{
                pointLoc=GenPoisson(ldistp*1/(SPHERE_RADIUS*SPHERE_RADIUS*Math.PI),crownlist[icr]);
            }
        }else{
            pointLoc=[(new THREE.Vector3(0,0,0))];
        }
        var raycasterU,raycasterD;
        //trim point located outside the geometry
        for (var ipt=pointLoc.length-1;ipt>=0;ipt--){
            raycasterU=new THREE.Raycaster(pointLoc[ipt].clone(),new THREE.Vector3(0,0,1),0,10000);
            raycasterD=new THREE.Raycaster(pointLoc[ipt].clone(),new THREE.Vector3(0,0,-1),0,10000);
            var intsctsU=raycasterU.intersectObject(crownlist[icr]);
            var intsctsD=raycasterD.intersectObject(crownlist[icr]);
            if (intsctsU.length<1 || intsctsD.length<1){
                pointLoc.splice(ipt,1);
            }
        }
        pointLocList=pointLocList.concat(pointLoc);
    }

    var newAng;
    pointAngList.length=0;

    for (var ipt=0;ipt<pointLocList.length;ipt++)
    {
        newAng=new THREE.Vector3(0,0,0);
        pointAngList.push(newAng);
    }

    CreateLeavesObj();
    ModifyLeavesAng();
}

function SetLeavesBend(){
    modStack = new MOD3.ModifierStack(MOD3.LibraryThree, lfmesh);
    bend=new MOD3.Bend(0,0.5,0);
//    bend.setAngle(Math.PI/3);
    bend.force=parseFloat(document.getElementById("scrollrange_LEAF_BX").value);
//    bend.offset=1;
    bend.switchAxes=true;

    bend.constraint=MOD3.ModConstant.Y;
    modStack.addModifier(bend);
    modStack.apply();

    bend2=new MOD3.Bend(0,0.5,0);
    bend2.switchAxes=false;
    bend2.force=parseFloat(document.getElementById("scrollrange_LEAF_BY").value);
    bend2.constraint=MOD3.ModConstant.Z;

    modStack.addModifier(bend2);
    modStack.apply();
}

function ModifyLeavesAng(){
//    var a=1/Math.PI;
//    var b=-2/Math.PI;
//    var c=1/Math.PI;
    var a=parseFloat($("#scroll_LAD_A").text())/Math.PI;
    var b=parseFloat($("#scroll_LAD_B").text())/Math.PI;
    var c=parseFloat($("#scroll_LAD_C").text())/Math.PI;

    if(a==0 && b==0 && c==0){
        for (var i=0;i<pointLocList.length;i++){
            pointAngList.length=0;
            pointAngList.push(new THREE.Vector3(0,0,0));
            leaflist[i].rotation.set(0,0,0);
        }
        return;
    }
    pointAngList.length=0;
    var xstep=Math.PI/500;
    var xstart=Math.PI/30;
    var xend=Math.PI*29/30;
    var N_ITERATION=pointLocList.length;


    var zelist=SamplesFromDistrTRI(a,b,c,xstart,xend,xstep,N_ITERATION);
    for (var i=0;i<pointLocList.length;i++){
        var az=Math.random()*Math.PI*2;
        pointAngList.push(new THREE.Vector3(0,az,zelist[i]));
        leaflist[i].rotation.set(0,az,zelist[i]);
    }

}
function animate() {
    requestAnimationFrame(animate);
    controls_leaves.update();
    render();
    stats.update();
}

function render() {
    renderer_leaves.render( scene_leaves, camera );
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


$("#reset_btn").click(function( event ) {
//        event.preventDefault();

    $("#scroll_LEAF_BX").html(LEAF_BEND_X_DEFAULT);
    $("#scroll_LEAF_BY").html(LEAF_BEND_Y_DEFAULT);
    $("#scroll_LEAF_SX").html(LEAF_SCALE_X_DEFAULT);
    $("#scroll_LEAF_SY").html(LEAF_SCALE_Y_DEFAULT);

    $("#scroll_LAD_A").html(LAD_A_DEFAULT);
    $("#scroll_LAD_B").html(LAD_B_DEFAULT);
    $("#scroll_LAD_C").html(LAD_C_DEFAULT);

    $("#scroll_LAI_PO").html(LAI_PO_DEFAULT);
    $("#scroll_LAI_CLU").html(LAI_CLU_DEFAULT);
    $("#scroll_LAI_DIS").html(LAI_DIS_DEFAULT);

    $("#scroll_CROWN_SX").html(CROWN_SCALE_X_DEFAULT);
    $("#scroll_CROWN_SY").html(CROWN_SCALE_Y_DEFAULT);
    $("#scroll_CROWN_PO").html(CROWN_PO_DEFAULT);
    $("#scroll_CROWN_CLU").html(CROWN_CLU_DEFAULT);
    $("#scroll_CROWN_DIS").html(CROWN_DIS_DEFAULT);
    $("#scroll_SCENE_S").html(SCENE_SIZE_DEFAULT);
    $("#scroll_DIR_ZE").html(DIRLIGHT_ZENITH_DEFAULT);
    $("#scroll_DIR_AZ").html(DIRLIGHT_AZIMUTH_DEFAULT);
    $("#scroll_DIR_INT").html(DIRLIGHT_INTENSITY_DEFAULT);


    bend.force=0;
    bend2.force=0;
    modStack.apply();

    ResetLeavesObj(true);

//    var origdir=new THREE.Vector3(
//        Math.sin(DIRLIGHT_ZENITH_DEFAULT*Math.PI/180)*Math.cos(DIRLIGHT_AZIMUTH_DEFAULT*Math.PI/180),
//        Math.cos(DIRLIGHT_ZENITH_DEFAULT*Math.PI/180),
//        Math.sin(DIRLIGHT_ZENITH_DEFAULT*Math.PI/180)*Math.sin(DIRLIGHT_AZIMUTH_DEFAULT*Math.PI/180)
//    );
//

    dirLight.position=origdir.clone();
    dirLight.position.multiplyScalar(DIRLIGHT_RADIUS);
    dirLight.target.position.set( 0, 0, 0 );
    dirLight.intensity=DIRLIGHT_INTENSITY_DEFAULT;
    dirline.geometry.verticesNeedUpdate=true;
    dirline.geometry.dynamic = true;
    dirline.geometry.vertices.pop();
    dirline.geometry.vertices.push(dirLight.position.clone());

    var slidewidth=$(".slider").width();
    var handlewidth=$(".handle").width();
    $("#scrollwrap_LEAF_BX").next().children(".handle").css("left",(LEAF_BEND_X_DEFAULT-LEAF_BEND_X_MIN)/(LEAF_BEND_X_MAX-LEAF_BEND_X_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LEAF_BX").next().children(".progress").css("width",(LEAF_BEND_X_DEFAULT-LEAF_BEND_X_MIN)/(LEAF_BEND_X_MAX-LEAF_BEND_X_MIN)*slidewidth+"px");

    $("#scrollwrap_LEAF_BY").next().children(".handle").css("left",(LEAF_BEND_Y_DEFAULT-LEAF_BEND_Y_MIN)/(LEAF_BEND_Y_MAX-LEAF_BEND_Y_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LEAF_BY").next().children(".progress").css("width",(LEAF_BEND_Y_DEFAULT-LEAF_BEND_Y_MIN)/(LEAF_BEND_Y_MAX-LEAF_BEND_Y_MIN)*slidewidth+"px");

    $("#scrollwrap_LEAF_SX").next().children(".handle").css("left",(LEAF_SCALE_X_DEFAULT-LEAF_SCALE_X_MIN)/(LEAF_SCALE_X_MAX-LEAF_SCALE_X_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LEAF_SX").next().children(".progress").css("width",(LEAF_SCALE_X_DEFAULT-LEAF_SCALE_X_MIN)/(LEAF_SCALE_X_MAX-LEAF_SCALE_X_MIN)*slidewidth+"px");

    $("#scrollwrap_LEAF_SX").next().children(".handle").css("left",(LEAF_SCALE_Y_DEFAULT-LEAF_SCALE_Y_MIN)/(LEAF_SCALE_Y_MAX-LEAF_SCALE_Y_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LEAF_SY").next().children(".progress").css("width",(LEAF_SCALE_Y_DEFAULT-LEAF_SCALE_Y_MIN)/(LEAF_SCALE_Y_MAX-LEAF_SCALE_Y_MIN)*slidewidth+"px");

    $("#scrollwrap_LAD_A").next().children(".handle").css("left",(LAD_A_DEFAULT-LAD_A_MIN)/(LAD_A_MAX-LAD_A_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LAD_A").next().children(".progress").css("width",(LAD_A_DEFAULT-LAD_A_MIN)/(LAD_A_MAX-LAD_A_MIN)*slidewidth+"px");

    $("#scrollwrap_LAD_B").next().children(".handle").css("left",(LAD_B_DEFAULT-LAD_B_MIN)/(LAD_B_MAX-LAD_B_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LAD_B").next().children(".progress").css("width",(LAD_B_DEFAULT-LAD_B_MIN)/(LAD_B_MAX-LAD_B_MIN)*slidewidth+"px");

    $("#scrollwrap_LAD_C").next().children(".handle").css("left",(LAD_C_DEFAULT-LAD_C_MIN)/(LAD_C_MAX-LAD_C_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LAD_C").next().children(".progress").css("width",(LAD_C_DEFAULT-LAD_C_MIN)/(LAD_C_MAX-LAD_C_MIN)*slidewidth+"px");

    $("#scrollwrap_LAI_PO").next().children(".handle").css("left",(LAI_PO_DEFAULT-LAI_PO_MIN)/(LAI_PO_MAX-LAI_PO_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LAI_PO").next().children(".progress").css("width",(LAI_PO_DEFAULT-LAI_PO_MIN)/(LAI_PO_MAX-LAI_PO_MIN)*slidewidth+"px");

    $("#scrollwrap_LAI_CLU").next().children(".handle").css("left",(LAI_CLU_DEFAULT-LAI_CLU_MIN)/(LAI_CLU_MAX-LAI_CLU_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LAI_CLU").next().children(".progress").css("width",(LAI_CLU_DEFAULT-LAI_CLU_MIN)/(LAI_CLU_MAX-LAI_CLU_MIN)*slidewidth+"px");

    $("#scrollwrap_LAI_DIS").next().children(".handle").css("left",(LAI_DIS_DEFAULT-LAI_DIS_MIN)/(LAI_DIS_MAX-LAI_DIS_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_LAI_DIS").next().children(".progress").css("width",(LAI_DIS_DEFAULT-LAI_DIS_MIN)/(LAI_DIS_MAX-LAI_DIS_MIN)*slidewidth+"px");

    $("#scrollwrap_CROWN_SX").next().children(".handle").css("left",(CROWN_SCALE_X_DEFAULT-CROWN_SCALE_X_MIN)/(CROWN_SCALE_X_MAX-CROWN_SCALE_X_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_CROWN_SX").next().children(".progress").css("width",(CROWN_SCALE_X_DEFAULT-CROWN_SCALE_X_MIN)/(CROWN_SCALE_X_MAX-CROWN_SCALE_X_MIN)*slidewidth+"px");

    $("#scrollwrap_CROWN_SY").next().children(".handle").css("left",(CROWN_SCALE_Y_DEFAULT-CROWN_SCALE_Y_MIN)/(CROWN_SCALE_Y_MAX-CROWN_SCALE_Y_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_CROWN_SY").next().children(".progress").css("width",(CROWN_SCALE_Y_DEFAULT-CROWN_SCALE_Y_MIN)/(CROWN_SCALE_Y_MAX-CROWN_SCALE_Y_MIN)*slidewidth+"px");

    $("#scrollwrap_CROWN_PO").next().children(".handle").css("left",(CROWN_PO_DEFAULT-CROWN_PO_MIN)/(CROWN_PO_MAX-CROWN_PO_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_CROWN_PO").next().children(".progress").css("width",(CROWN_PO_DEFAULT-CROWN_PO_MIN)/(CROWN_PO_MAX-CROWN_PO_MIN)*slidewidth+"px");

    $("#scrollwrap_CROWN_CLU").next().children(".handle").css("left",(CROWN_CLU_DEFAULT-CROWN_CLU_MIN)/(CROWN_CLU_MAX-CROWN_CLU_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_CROWN_CLU").next().children(".progress").css("width",(CROWN_CLU_DEFAULT-CROWN_CLU_MIN)/(CROWN_CLU_MAX-CROWN_CLU_MIN)*slidewidth+"px");

    $("#scrollwrap_CROWN_DIS").next().children(".handle").css("left",(CROWN_DIS_DEFAULT-CROWN_DIS_MIN)/(CROWN_DIS_MAX-CROWN_DIS_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_CROWN_DIS").next().children(".progress").css("width",(CROWN_DIS_DEFAULT-CROWN_DIS_MIN)/(CROWN_DIS_MAX-CROWN_DIS_MIN)*slidewidth+"px");


    $("#scrollwrap_DIR_ZE").next().children(".handle").css("left",(DIRLIGHT_ZENITH_DEFAULT-DIRLIGHT_ZENITH_MIN)/(DIRLIGHT_ZENITH_MAX-DIRLIGHT_ZENITH_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_DIR_ZE").next().children(".progress").css("width",(DIRLIGHT_ZENITH_DEFAULT-DIRLIGHT_ZENITH_MIN)/(DIRLIGHT_ZENITH_MAX-DIRLIGHT_ZENITH_MIN)*slidewidth+"px");

    $("#scrollwrap_DIR_AZ").next().children(".handle").css("left",(DIRLIGHT_AZIMUTH_DEFAULT-DIRLIGHT_AZIMUTH_MIN)/(DIRLIGHT_AZIMUTH_MAX-DIRLIGHT_AZIMUTH_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_DIR_AZ").next().children(".progress").css("width",(DIRLIGHT_AZIMUTH_DEFAULT-DIRLIGHT_AZIMUTH_MIN)/(DIRLIGHT_AZIMUTH_MAX-DIRLIGHT_AZIMUTH_MIN)*slidewidth+"px");

    $("#scrollwrap_DIR_INT").next().children(".handle").css("left",(DIRLIGHT_INTENSITY_DEFAULT-DIRLIGHT_INTENSITY_MIN)/(DIRLIGHT_INTENSITY_MAX-DIRLIGHT_INTENSITY_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_DIR_INT").next().children(".progress").css("width",(DIRLIGHT_INTENSITY_DEFAULT-DIRLIGHT_INTENSITY_MIN)/(DIRLIGHT_INTENSITY_MAX-DIRLIGHT_INTENSITY_MIN)*slidewidth+"px");

    $("#scrollwrap_SCENE_S").next().children(".handle").css("left",(SCENE_SIZE_DEFAULT-SCENE_SIZE_MIN)/(SCENE_SIZE_MAX-SCENE_SIZE_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_SCENE_S").next().children(".progress").css("width",(SCENE_SIZE_DEFAULT-SCENE_SIZE_MIN)/(SCENE_SIZE_MAX-SCENE_SIZE_MIN)*slidewidth+"px");


});
// initialize rangeinput
$("#scrollrange_LEAF_BX").rangeinput({
    onSlide: function(ev, step)  {
//        scroll.css({left: -step});
        $("#scroll_LEAF_BX").html(step);
//        bend2.force=parseFloat(document.getElementById("scrollrange").value);
        bend2.force=step;
        modStack.apply();
    },
    progress: true,
    value: LEAF_BEND_X_DEFAULT,
//    change: function(e, i) {
////        scroll.animate({left: -i}, "fast");
//    },
    speed: 0
});
$("#scrollrange_LEAF_BY").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_LEAF_BY").html(step);
        bend.force=step;
        modStack.apply();
    },
    progress: true,
    value: LEAF_BEND_Y_DEFAULT,
    speed: 0
});
$("#scrollrange_LEAF_SX").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_LEAF_SX").html(step);
        for (var ipt= 0;ipt<leaflist.length;ipt++){
            leaflist[ipt].scale.set(step*leaf_scaling_factor,leaflist[ipt].scale.y,leaf_scaling_factor);;
        }
    },
    progress: true,
    value: LEAF_SCALE_X_DEFAULT,
    speed: 0
});
$("#scrollrange_LEAF_SY").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_LEAF_SY").html(step);
        for (var ipt= 0;ipt<leaflist.length;ipt++){
            leaflist[ipt].scale.set(leaflist[ipt].scale.x,step*leaf_scaling_factor,leaf_scaling_factor);;
        }
    },
    progress: true,
    value: LEAF_SCALE_Y_DEFAULT,
    speed: 0
});

$("#scrollrange_LAD_A").rangeinput({
    change: function(ev, step)  {
        $("#scroll_LAD_A").html(step);
        ModifyLeavesAng();
    },
    progress: true,
    value: LAD_A_DEFAULT,
    speed: 0
});
$("#scrollrange_LAD_B").rangeinput({
    change: function(ev, step)  {
        $("#scroll_LAD_B").html(step);
        ModifyLeavesAng();
    },
    progress: true,
    value: LAD_B_DEFAULT,
    speed: 0
});
$("#scrollrange_LAD_C").rangeinput({
    change: function(ev, step)  {
        $("#scroll_LAD_C").html(step);
        ModifyLeavesAng();
    },
    progress: true,
    value: LAD_C_DEFAULT,
    speed: 0
});
$("#scrollrange_LAI_PO").rangeinput({
    change: function(ev, step)  {
        $("#scroll_LAI_PO").html(step);
        if (step==0) {
            ResetLeavesObj(false);
            return;
        };
//        CleanLeavesObj();
        SynUpdateLeavesObj();
    },
    progress: true,
    value: LAI_PO_DEFAULT,
    speed: 0
});
$("#scrollrange_LAI_CLU").rangeinput({
    change: function(ev, step)  {
        $("#scroll_LAI_CLU").html(step);
        if (step==0) {
            ResetLeavesObj(false);
            return;
        };
        var slidewidth=$(".slider").width();
        var handlewidth=$(".handle").width();
        $("#scroll_LAI_DIS").html(LAI_DIS_DEFAULT);
        $("#scrollwrap_LAI_DIS").next().children(".handle").css("left",(LAI_DIS_DEFAULT-LAI_DIS_MIN)/
            (LAI_DIS_MAX-LAI_DIS_MIN)*(slidewidth-handlewidth)+"px");
        $("#scrollwrap_LAI_DIS").next().children(".progress").css("width",(LAI_DIS_DEFAULT-LAI_DIS_MIN)/
            (LAI_DIS_MAX-LAI_DIS_MIN)*slidewidth+"px");
        SynUpdateLeavesObj();
//        lfmesh.rotation.set(lfmesh.rotation.x,lfmesh.rotation.y,step*Math.PI/180);
    },
    progress: true,
    value: LAI_CLU_DEFAULT,
    speed: 0
});
$("#scrollrange_LAI_DIS").rangeinput({
    change: function(ev, step)  {
        $("#scroll_LAI_DIS").html(step);
        if (step==0) {
            ResetLeavesObj(false);
            return;
        };
        var slidewidth=$(".slider").width();
        var handlewidth=$(".handle").width();
        $("#scroll_LAI_CLU").html(LAI_CLU_DEFAULT);
        $("#scrollwrap_LAI_CLU").next().children(".handle").css("left",(LAI_CLU_DEFAULT-LAI_CLU_MIN)/
            (LAI_CLU_MAX-LAI_CLU_MIN)*(slidewidth-handlewidth)+"px");
        $("#scrollwrap_LAI_CLU").next().children(".progress").css("width",(LAI_CLU_DEFAULT-LAI_CLU_MIN)/
            (LAI_CLU_MAX-LAI_CLU_MIN)*slidewidth+"px");
        SynUpdateLeavesObj();
//        lfmesh.rotation.set(lfmesh.rotation.x,lfmesh.rotation.y,step*Math.PI/180);
    },
    progress: true,
    value: LAI_DIS_DEFAULT,
    speed: 0
});


$("#scrollrange_DIR_ZE").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_DIR_ZE").html(step);
        var sa=parseFloat($("#scroll_DIR_AZ").text())*Math.PI/180;
        dirLight.position.set(
            Math.sin(step*Math.PI/180)*Math.cos(sa),
            Math.cos(step*Math.PI/180),
            Math.sin(step*Math.PI/180)*Math.sin(sa)
        );
        dirLight.position.multiplyScalar(DIRLIGHT_RADIUS);
        dirline.geometry.verticesNeedUpdate=true;
        dirline.geometry.dynamic = true;
        dirline.geometry.vertices.pop();
        dirline.geometry.vertices.push(dirLight.position);
    },
    progress: true,
    value: DIRLIGHT_ZENITH_DEFAULT,
    speed: 0
});
$("#scrollrange_DIR_AZ").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_DIR_AZ").html(step);
        var sz=parseFloat($("#scroll_DIR_ZE").text())*Math.PI/180;
        dirLight.position.set(
            Math.sin(sz)*Math.cos(step*Math.PI/180),
            Math.cos(sz),
            Math.sin(sz)*Math.sin(step*Math.PI/180)
        );
        dirLight.position.multiplyScalar(DIRLIGHT_RADIUS);
        dirline.geometry.verticesNeedUpdate=true;
        dirline.geometry.dynamic = true;
        dirline.geometry.vertices.pop();
        dirline.geometry.vertices.push(dirLight.position);

    },
    progress: true,
    value: DIRLIGHT_AZIMUTH_DEFAULT,
    speed: 0
});
$("#scrollrange_DIR_INT").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_DIR_INT").html(step);
        dirLight.intensity=step;
    },
    progress: true,
    value: DIRLIGHT_INTENSITY_DEFAULT,
    speed: 0
});

$("#scrollrange_CROWN_SX").rangeinput({
    change: function(ev, step)  {
        $("#scroll_CROWN_SX").html(step);
        SynUpdateLeavesObj();
    },
    progress: true,
    value: CROWN_SCALE_X_DEFAULT,
    speed: 0
});
$("#scrollrange_CROWN_SY").rangeinput({
    change: function(ev, step)  {
        $("#scroll_CROWN_SY").html(step);
        SynUpdateLeavesObj();
    },
    progress: true,
    value: CROWN_SCALE_Y_DEFAULT,
    speed: 0
});
$("#scrollrange_SCENE_S").rangeinput({
    change: function(ev, step)  {
        $("#scroll_SCENE_S").html(step);
        if (step==1) {
            ResetLeavesObj(false);
            return;
        };
        SynUpdateLeavesObj();
    },
    progress: true,
    speed: 0
});
$("#scrollrange_CROWN_PO").rangeinput({
    change: function(ev, step)  {
        $("#scroll_CROWN_PO").html(step);
        if (step==0) {
            ResetLeavesObj(false);
            return;
        };
        SynUpdateLeavesObj();
    },
    progress: true,
    speed: 0
});
$("#scrollrange_CROWN_CLU").rangeinput({
    change: function(ev, step)  {
        $("#scroll_CROWN_CLU").html(step);
        if (step==0) {
            ResetLeavesObj(false);
            return;
        };
        var slidewidth=$(".slider").width();
        var handlewidth=$(".handle").width();
        $("#scroll_CROWN_DIS").html(CROWN_DIS_DEFAULT);
        $("#scrollwrap_CROWN_DIS").next().children(".handle").css("left",(CROWN_DIS_DEFAULT-CROWN_DIS_MIN)/
            (CROWN_DIS_MAX-CROWN_DIS_MIN)*(slidewidth-handlewidth)+"px");
        $("#scrollwrap_CROWN_DIS").next().children(".progress").css("width",(CROWN_DIS_DEFAULT-CROWN_DIS_MIN)/
            (CROWN_DIS_MAX-CROWN_DIS_MIN)*slidewidth+"px");
        SynUpdateLeavesObj();
    },
    progress: true,
    speed: 0
});
$("#scrollrange_CROWN_DIS").rangeinput({
    change: function(ev, step)  {
        $("#scroll_CROWN_DIS").html(step);
        if (step==0) {
            ResetLeavesObj(false);
            return;
        };
        var slidewidth=$(".slider").width();
        var handlewidth=$(".handle").width();
        $("#scroll_CROWN_CLU").html(CROWN_CLU_DEFAULT);
        $("#scrollwrap_CROWN_CLU").next().children(".handle").css("left",(CROWN_CLU_DEFAULT-CROWN_CLU_MIN)/
            (CROWN_CLU_MAX-CROWN_CLU_MIN)*(slidewidth-handlewidth)+"px");
        $("#scrollwrap_CROWN_CLU").next().children(".progress").css("width",(CROWN_CLU_DEFAULT-CROWN_CLU_MIN)/
            (CROWN_CLU_MAX-CROWN_CLU_MIN)*slidewidth+"px");
        SynUpdateLeavesObj();
    },
    progress: true,
    speed: 0
});

$('#myonoffswitch_leaves').click(function() {
    if (this.checked){
        for (var ipt= 0;ipt<leaflist.length;ipt++){
            scene_leaves.add(leaflist[ipt]);
        }
    }else{
        var obj, i;
        for ( i = scene_leaves.children.length - 1; i >= 0 ; i -- ) {
            obj = scene_leaves.children[ i ];
            if ( $.inArray(obj,leaflist)!=-1) {
                scene_leaves.remove(obj);
            }
        }

    };
});
$('#myonoffswitch_wire').click(function() {
    if (this.checked){
        for (var icr=0;icr<crownLocList.length;icr++){
            scene_leaves.add(crownlist[icr]);
        }
    }else{
        var obj, i;
        for ( i = scene_leaves.children.length - 1; i >= 0 ; i -- ) {
            obj = scene_leaves.children[ i ];
            if ( $.inArray(obj,crownlist)!=-1) {
                scene_leaves.remove(obj);
            }
        }
    };
});
$('#myonoffswitch_dot').click(function() {
    if (this.checked){
        scene_leaves.add(particles);
    }else{
        var obj, i;
        for ( i = scene_leaves.children.length - 1; i >= 0 ; i -- ) {
            obj = scene_leaves.children[ i ];
            if ( obj==particles) {
                scene_leaves.remove(obj);
            }
        }

    };
});