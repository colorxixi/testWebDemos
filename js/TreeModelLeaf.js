/**
 * Created by Administrator on 13-12-8.
 */
var container_leaf,renderer_leaf,camera,scene_leaf,controls_leaf,axes_leaf,stats,lfmesh,ground;
var bend, bend2, modStack;
var dirLight,hemiLight;
var dirline;
var BEND_X_MIN,BEND_X_MAX,BEND_Y_MIN,BEND_Y_MAX,BEND_X_DEFAULT,BEND_Y_DEFAULT;
var ROTATE_X_MIN,ROTATE_X_MAX,ROTATE_Y_MIN,ROTATE_Y_MAX,ROTATE_Z_MIN,ROTATE_Z_MAX,ROTATE_X_DEFAULT,ROTATE_Y_DEFAULT,
    ROTATE_Z_DEFAULT;
var SCALE_X_MIN,SCALE_X_MAX,SCALE_Y_MIN,SCALE_Y_MAX,SCALE_X_DEFAULT,SCALE_Y_DEFAULT;
var SZ_MIN,SZ_MAX,SZ_DEFAULT,SA_MIN,SA_MAX,SA_DEFAULT;
var INT_MIN,INT_MAX,INT_DEFAULT;

var DIRLIGHT_RADIUS=30;
//0:index, 1:modelpage, 1.1:modelsim, 1.2:modelguide, 1.3:modelleaf, 1.4:modelleaves, 2:vegeinv, 3:readingbooks, 4:house
(function() {

    $("#countuser").load("../php/online.php?pinfo=p1.3");
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    BEND_X_MIN=$("#scrollrange_BX").attr("min");
    BEND_X_MAX=$("#scrollrange_BX").attr("max");
    BEND_X_DEFAULT=$("#scrollrange_BX").attr("value");
    BEND_Y_MIN=$("#scrollrange_BY").attr("min");
    BEND_Y_MAX=$("#scrollrange_BY").attr("max");
    BEND_Y_DEFAULT=$("#scrollrange_BY").attr("value");

    ROTATE_X_MIN=$("#scrollrange_RX").attr("min");
    ROTATE_X_MAX=$("#scrollrange_RX").attr("max");
    ROTATE_X_DEFAULT=$("#scrollrange_RX").attr("value");
    ROTATE_Y_MIN=$("#scrollrange_RY").attr("min");
    ROTATE_Y_MAX=$("#scrollrange_RY").attr("max");
    ROTATE_Y_DEFAULT=$("#scrollrange_RY").attr("value");
    ROTATE_Z_MIN=$("#scrollrange_RZ").attr("min");
    ROTATE_Z_MAX=$("#scrollrange_RZ").attr("max");
    ROTATE_Z_DEFAULT=$("#scrollrange_RZ").attr("value");

    SCALE_X_MIN=$("#scrollrange_SX").attr("min");
    SCALE_X_MAX=$("#scrollrange_SX").attr("max");
    SCALE_X_DEFAULT=$("#scrollrange_SX").attr("value");
    SCALE_Y_MIN=$("#scrollrange_SY").attr("min");
    SCALE_Y_MAX=$("#scrollrange_SY").attr("max");
    SCALE_Y_DEFAULT=$("#scrollrange_SY").attr("value");

    SA_MIN=$("#scrollrange_SA").attr("min");
    SA_MAX=$("#scrollrange_SA").attr("max");
    SA_DEFAULT=$("#scrollrange_SA").attr("value");
    SZ_MIN=$("#scrollrange_SZ").attr("min");
    SZ_MAX=$("#scrollrange_SZ").attr("max");
    SZ_DEFAULT=$("#scrollrange_SZ").attr("value");

    INT_MIN=$("#scrollrange_Int").attr("min");
    INT_MAX=$("#scrollrange_Int").attr("max");
    INT_DEFAULT=$("#scrollrange_Int").attr("value");

    container_leaf = document.getElementById("container_leaf");
    renderer_leaf = new THREE.WebGLRenderer({antialias: false,clearAlpha: 1});
    renderer_leaf.setSize(container_leaf.clientWidth, container_leaf.clientHeight,1);
    camera = new THREE.PerspectiveCamera(60, container_leaf.clientWidth / container_leaf.clientHeight, 0.1, 100);
    camera.position.set(4, -1, 4);

    scene_leaf = new THREE.Scene();
    scene_leaf.add(camera);
    camera.lookAt(scene_leaf.position);

    axes_leaf = buildAxes();
    scene_leaf.add(axes_leaf);

//    // create a point light
//    pointLight =
//        new THREE.PointLight(0xFFFFFF);
//    pointLight.position.x = 0;
//    pointLight.position.y = -1;
//    pointLight.position.z = 0;
//    pointLight.distance=100;
//    pointLight.intensity=10;
//    pointLight.shadowCameraVisible = false;
//    scene_leaf.add(pointLight);

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.8 );

    hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
    hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
    hemiLight.position.set( 0, 3, 0 );
//    scene_leaf.add(hemiLight);

    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.intensity=INT_DEFAULT;
    var origdir=new THREE.Vector3(
        Math.sin(SZ_DEFAULT*Math.PI/180)*Math.cos(SA_DEFAULT*Math.PI/180),
        Math.cos(SZ_DEFAULT*Math.PI/180),
        Math.sin(SZ_DEFAULT*Math.PI/180)*Math.sin(SA_DEFAULT*Math.PI/180)
    );
//    dirLight.position=origdir;
    dirLight.position=origdir.multiplyScalar(DIRLIGHT_RADIUS);
    dirLight.target.position.set( 0, 0, 0 );

    dirLight.name = "dirlight";
    scene_leaf.add( dirLight );




    var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x431616, specular: 0x431616 } );
//    var groundMat = new THREE.MeshPhongMaterial();
    groundMat.color.setHSL( 0.095, 1, 0.75 );

    ground = new THREE.Mesh( groundGeo, groundMat );
    ground.rotation.x = -Math.PI/2;
    ground.position.y = -3;
    scene_leaf.add( ground );

    var linegeo = new THREE.Geometry();
    linegeo.vertices.push(new THREE.Vector3(0,0,0));
    linegeo.vertices.push( dirLight.position);
    dirline = new THREE.Line( linegeo, new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 5, gapSize: 2 } ), THREE.LineStrip );

    scene_leaf.add(dirline);

//    var sphereGeo = new THREE.SphereGeometry(1,20,20);
//
//    var sphereMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xaaffff, specular: 0x050505 } );
//    sph = new THREE.Mesh(sphereGeo,sphereMat);
//    sph.position.z=-1;
//    sph.position.y=0;
//    scene_leaf.add(sph);

//    var plGeo = new THREE.PlaneGeometry(1,20,20);
//
//    var plMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x431616, specular: 0x050505 } );
//    pl = new THREE.Mesh(plGeo,plMat);
//    pl.position.z=-1;
//    pl.position.y=0;
//    scene_leaf.add(pl);
//    pl.castShadow=true;

    // add to the scene

    var ambient = new THREE.AmbientLight( 0xffffff );
    ambient.intensity=1;
    scene_leaf.add( ambient );

    controls_leaf = new THREE.TrackballControls(camera,container_leaf);
    controls_leaf.rotateSpeed = 1.0;
    controls_leaf.zoomSpeed = 1.5;
    controls_leaf.panSpeed = 0.8;
    controls_leaf.noZoom = false;
    controls_leaf.noPan = false;
    controls_leaf.staticMoving = false;
    controls_leaf.dynamicDampingFactor = 0.3;

    container_leaf.appendChild(renderer_leaf.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10px';
    stats.domElement.style.left='2px';

    container_leaf.appendChild( stats.domElement );

//    $("#countuser").load("../php/online.php");
//    var forestPts=new THREE.Object3D();
//    var objfilepath="data/leafB.obj"
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
////        scene_leaf.add(object);
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
////        scene_leaf.add( object );
////
////    });
////    loader.load( 'data/leafBC2.obj', 'data/leafBC2.mtl' );
//    var leafobj=new THREE.Object3D();
//    loader.load( 'data/rappy/rappy.obj', 'data/rappy/rappy.mtl', function ( object ) {
//        object.position.x = 5;
//        object.position.y = 0;
//        object.position.z = 0;
//        object.scale.set(0.3,0.3,0.3);
//        leafobj=object;
//        scene_leaf.add(object);
//    } );

    var csvfilepath="data/leafpts.csv";
    var lfline,lineMat,lfshape;
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
//            scene_leaf.add(lfmesh);



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
            scene_leaf.add(lfmesh);
        });
    lfmesh.scale.set(0.01,0.01,0.01);


//    lfmesh.position.set(-1.7,-2.5,0);
//    lfmesh.rotateX(Math.PI/2);

    modStack = new MOD3.ModifierStack(MOD3.LibraryThree, lfmesh);
    var box = new THREE.Box3();
    box.setFromObject(lfmesh);

    bend=new MOD3.Bend(0,0.5,0);//second parameter is the % of the bending center. 0.5 is right the object center.
//    bend.setAngle(Math.PI/3);
    bend.force=parseFloat(document.getElementById("scrollrange_BX").value);
//    bend.offset=1;
    bend.switchAxes=true;

    bend.constraint=MOD3.ModConstant.Y;
    modStack.addModifier(bend);
    modStack.apply();
    bend2=new MOD3.Bend(0,0.5,0);

    bend2.switchAxes=false;
    bend2.force=parseFloat(document.getElementById("scrollrange_BY").value);
    bend2.constraint=MOD3.ModConstant.Z;
//
    modStack.addModifier(bend2);
    modStack.apply();
//    lfmesh.rotateY(-Math.PI/2);
//    lfmesh.rotateY(-Math.PI/2);


//    renderer_leaf.shadowMapEnabled=false;
//    renderer_leaf.shadowMapSoft = true;
//    renderer_leaf.shadowCameraNear = 3;
//    renderer_leaf.shadowCameraFar = camera.far;
//    renderer_leaf.shadowCameraFov = 50;
//    renderer_leaf.shadowMapBias = 0.0039;
//    renderer_leaf.shadowMapDarkness = 0.5;
//    renderer_leaf.shadowMapWidth = 1024;
//    renderer_leaf.shadowMapHeight = 1024;
    dirLight.castShadow = true;
    lfmesh.castShadow=true;
    lfmesh.receiveShadow=true;
//    sph.receiveShadow=true;
//    sph.castShadow=true;
//    lfline.castShaow=true;
    ground.receiveShadow = true;
    ground.castShadow=false;
    dirLight.shadowCameraVisible = true;

    dirLight.shadowDarkness=0.65;
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 2048;
    renderer_leaf.shadowMapEnabled=true;
    renderer_leaf.shadowMapSoft = true;
//    renderer_leaf.shadowMapCullFace = THREE.CullFaceBack;
//    renderer_leaf.shadowMapCullFrontFaces = true;

    dirLight.shadowCameraNear = 0.01;
    dirLight.shadowCameraFar=camera.far;
//    dirLight.shadowCameraFar = camera.far;
    dirLight.shadowCameraFov = 40;
//    dirLight.shadowMapBias = 0.0039;
    dirLight.shadowMapDarkness =0.5;

    dirLight.shadowCameraLeft  = -10;
    dirLight.shadowCameraRight  = 10;

    dirLight.shadowCameraBottom  = -10;
    dirLight.shadowCameraTop  = 10;
    animate();

}());




function animate() {
    requestAnimationFrame(animate);
    controls_leaf.update();
    render();
    stats.update();
}

function render() {
    renderer_leaf.render( scene_leaf, camera );
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

// initialize rangeinput
$("#scrollrange_BX").rangeinput({
    onSlide: function(ev, step)  {
//        scroll.css({left: -step});
        $("#scroll_BX").html(step);
//        bend2.force=parseFloat(document.getElementById("scrollrange").value);
        bend.force=step;
        modStack.apply();
    },
    progress: true,
    value: BEND_X_DEFAULT,
//    change: function(e, i) {
////        scroll.animate({left: -i}, "fast");
//    },
    speed: 0
});

$("#scrollrange_BY").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_BY").html(step);
        bend2.force=step;
        modStack.apply();
    },
    progress: true,
    value: BEND_Y_DEFAULT,
    speed: 0
});
$("#scrollrange_SX").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_SX").html(step);
        lfmesh.scale.set(step*0.01,lfmesh.scale.y,0.01);
    },
    progress: true,
    value: SCALE_X_DEFAULT,
    speed: 0
});
$("#scrollrange_SY").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_SY").html(step);
        lfmesh.scale.set(lfmesh.scale.x,step*0.01,0.01);
    },
    progress: true,
    value: SCALE_Y_DEFAULT,
    speed: 0
});

$("#scrollrange_RX").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_RX").html(step);
        lfmesh.rotation.set(step*Math.PI/180,lfmesh.rotation.y,lfmesh.rotation.z);
    },
    progress: true,
    value: ROTATE_X_DEFAULT,
    speed: 0
});
$("#scrollrange_RY").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_RY").html(step);
        lfmesh.rotation.set(lfmesh.rotation.x,step*Math.PI/180,lfmesh.rotation.z);
    },
    progress: true,
    value: ROTATE_Y_DEFAULT,
    speed: 0
});
$("#scrollrange_RZ").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_RZ").html(step);
        lfmesh.rotation.set(lfmesh.rotation.x,lfmesh.rotation.y,step*Math.PI/180);
    },
    progress: true,
    value: ROTATE_Z_DEFAULT,
    speed: 0
});
$("#reset_btn").click(function( event ) {
//        event.preventDefault();
    $("#scroll_RX").html(ROTATE_X_DEFAULT);
    $("#scroll_RY").html(ROTATE_Y_DEFAULT);
    $("#scroll_RZ").html(ROTATE_Z_DEFAULT);
    $("#scroll_BX").html(BEND_X_DEFAULT);
    $("#scroll_BY").html(BEND_Y_DEFAULT);
    $("#scroll_SX").html(SCALE_X_DEFAULT);
    $("#scroll_SY").html(SCALE_Y_DEFAULT);

    $("#scroll_SZ").html(SZ_DEFAULT);
    $("#scroll_SA").html(SA_DEFAULT);
    $("#scroll_Int").html(INT_DEFAULT);


    bend.force=0;
    bend2.force=0;
    modStack.apply();

    lfmesh.rotation.set(0,0,0);
    lfmesh.scale.set(0.01,0.01,0.01);

    var origdir=new THREE.Vector3(
        Math.sin(SZ_DEFAULT*Math.PI/180)*Math.cos(SA_DEFAULT*Math.PI/180),
        Math.cos(SZ_DEFAULT*Math.PI/180),
        Math.sin(SZ_DEFAULT*Math.PI/180)*Math.sin(SA_DEFAULT*Math.PI/180)
    );

    dirline.geometry.verticesNeedUpdate=true;
    dirline.geometry.dynamic = true;
    dirline.geometry.vertices.pop();
    dirline.geometry.vertices.push(origdir.multiplyScalar(DIRLIGHT_RADIUS));
    dirLight.shadowCameraVisible=true;
    dirLight.position=origdir;
    dirLight.target.position.set( 0, 0, 0 );
    dirLight.intensity=INT_DEFAULT;

    var slidewidth=$(".slider").width();
    var handlewidth=$(".handle").width();
    $("#scrollwrap_BX").next().children(".handle").css("left",(BEND_X_DEFAULT-BEND_X_MIN)/(BEND_X_MAX-BEND_X_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_BX").next().children(".progress").css("width",(BEND_X_DEFAULT-BEND_X_MIN)/(BEND_X_MAX-BEND_X_MIN)*slidewidth+"px");

    $("#scrollwrap_BY").next().children(".handle").css("left",(BEND_Y_DEFAULT-BEND_Y_MIN)/(BEND_Y_MAX-BEND_Y_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_BY").next().children(".progress").css("width",(BEND_Y_DEFAULT-BEND_Y_MIN)/(BEND_Y_MAX-BEND_Y_MIN)*slidewidth+"px");

    $("#scrollwrap_RX").next().children(".handle").css("left",(ROTATE_X_DEFAULT-ROTATE_X_MIN)/(ROTATE_X_MAX-ROTATE_X_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_RX").next().children(".progress").css("width",(ROTATE_X_DEFAULT-ROTATE_X_MIN)/(ROTATE_X_MAX-ROTATE_X_MIN)*slidewidth+"px");

    $("#scrollwrap_RY").next().children(".handle").css("left",(ROTATE_Y_DEFAULT-ROTATE_Y_MIN)/(ROTATE_Y_MAX-ROTATE_Y_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_RY").next().children(".progress").css("width",(ROTATE_Y_DEFAULT-ROTATE_Y_MIN)/(ROTATE_Y_MAX-ROTATE_Y_MIN)*slidewidth+"px");

    $("#scrollwrap_RZ").next().children(".handle").css("left",(ROTATE_Z_DEFAULT-ROTATE_Z_MIN)/(ROTATE_Z_MAX-ROTATE_Z_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_RZ").next().children(".progress").css("width",(ROTATE_Z_DEFAULT-ROTATE_Z_MIN)/(ROTATE_Z_MAX-ROTATE_Z_MIN)*slidewidth+"px");

    $("#scrollwrap_SX").next().children(".handle").css("left",(SCALE_X_DEFAULT-SCALE_X_MIN)/(SCALE_X_MAX-SCALE_X_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_SX").next().children(".progress").css("width",(SCALE_X_DEFAULT-SCALE_X_MIN)/(SCALE_X_MAX-SCALE_X_MIN)*slidewidth+"px");

    $("#scrollwrap_SY").next().children(".handle").css("left",(SCALE_Y_DEFAULT-SCALE_Y_MIN)/(SCALE_Y_MAX-SCALE_Y_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_SY").next().children(".progress").css("width",(SCALE_Y_DEFAULT-SCALE_Y_MIN)/(SCALE_Y_MAX-SCALE_Y_MIN)*slidewidth+"px");

    $("#scrollwrap_SZ").next().children(".handle").css("left",(SZ_DEFAULT-SZ_MIN)/(SZ_MAX-SZ_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_SZ").next().children(".progress").css("width",(SZ_DEFAULT-SZ_MIN)/(SZ_MAX-SZ_MIN)*slidewidth+"px");

    $("#scrollwrap_SA").next().children(".handle").css("left",(SA_DEFAULT-SA_MIN)/(SA_MAX-SA_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_SA").next().children(".progress").css("width",(SA_DEFAULT-SA_MIN)/(SA_MAX-SA_MIN)*slidewidth+"px");

    $("#scrollwrap_Int").next().children(".handle").css("left",(INT_DEFAULT-INT_MIN)/(INT_MAX-INT_MIN)*(slidewidth-handlewidth)+"px");
    $("#scrollwrap_Int").next().children(".progress").css("width",(INT_DEFAULT-INT_MIN)/(INT_MAX-INT_MIN)*slidewidth+"px");
});

$("#scrollrange_SZ").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_SZ").html(step);
        var sa=parseFloat($("#scroll_SA").text())*Math.PI/180;
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
    value: SZ_DEFAULT,
    speed: 0
});
$("#scrollrange_SA").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_SA").html(step);
        var sz=parseFloat($("#scroll_SZ").text())*Math.PI/180;
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
    value: SA_DEFAULT,
    speed: 0
});

$("#scrollrange_Int").rangeinput({
    onSlide: function(ev, step)  {
        $("#scroll_Int").html(step);
        dirLight.intensity=step;
    },
    progress: true,
    value: INT_DEFAULT,
    speed: 0
});

