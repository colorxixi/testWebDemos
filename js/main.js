var container, stats;
var camera, controls,scene, renderer,particleSystem;
var forest1;
//var mesh;
var islider=0;
var NSLIDER=5;
//0:index, 1:modelpage, 1.1:modelsim, 1.2:modelguide, 1.3:modelleaf, 1.4:modelleaves
(function() {
	$("#onlinenum").load("../php/online.php?pinfo=p0");
	$(".VisitingStat").hover(function(){
    $("#onlinelist").slideDown("fast");
    var str = '';
    $.getJSON("../php/geo.php",function(json){
        $.each(json,function(index,array){
            str = str + "<li><span>"+array['total']+"</span>"+array['country'] + " - "+array['state']+ " - "+array['city'] +"</li>";
        });
        $("#onlinelist").html(str);
    });
},function(){
    $("#onlinelist").slideUp("fast");
});
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    scene = new THREE.Scene();

    container = document.getElementById("jFlowSlider");
//    container.background. = "rgba(0, 0, 200, 0.5)";
    camera = new THREE.PerspectiveCamera(60,container.clientWidth/container.clientWidth, 0.1, 10000);
    camera.position.set(100, 0, 30);
    camera.lookAt(scene.position);
//    camera.rotateOnAxis(new THREE.Vector3(0,0,1),1.57);

    controls = new THREE.TrackballControls(camera,container);
//    controls.reset();

//    controls.target=new THREE.Vector3(160, 0, 80);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
//    controls.noRotate=true;

    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

//    controls.keys = [65, 83, 68];
//    controls.addEventListener('change', render);

// Grid

    var material = new THREE.LineBasicMaterial( { color: 0xbbbbbb } );
    var xAxis = new THREE.Vector3( 1, 0, 0 ); //red
    var yAxis = new THREE.Vector3( 0, 1, 0 ); //green
    var zAxis = new THREE.Vector3( 0, 0, 1 ); //blue

    var geometry = new THREE.Geometry();
    var floor = -0.01;
    var step = 1;
    var size = 14;

    for ( var i = 0; i <= size / step * 2; i ++ )
    {

        geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
        geometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );
        geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
        geometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );

    }

    var line = new THREE.Line( geometry, material, THREE.LinePieces );
    scene.add(line);

    // AXIS HELPER
    var axes1 = new THREE.AxisHelper();
    axes1.scale.set(20, 20, 20);
    scene.add(axes1);

    var axes2 = new THREE.AxisHelper();
    axes2.scale.set(-20, -20, -20);
    scene.add(axes2);

//    camera = new THREE.PerspectiveCamera( 27, container.clientWidth / container.clientHeight, 5, 3500 );
//    camera.position.z = 2750;
//    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );


    forest1 = new myForest();
    forest1.init();
    forest1.ImportFromCSV("data/Trunk.csv",scene);

//    scene.clearColor = new THREE.Color4(0,0,0,0.0000000000000001);
    renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
//    renderer.setClearColor( scene.fog.color, 1 );
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10px';
    stats.domElement.style.left='2px';

    container.appendChild( stats.domElement );

//    renderer.render( scene, camera );
//    stats.update();
    window.addEventListener( 'resize', onWindowResize(container), false );
    animate();
    //    app.init({ container: container });
}());
function animate() {

    requestAnimationFrame(animate);
    controls.update();
    render();
    stats.update();

}

function render() {

//    var time = Date.now() * 0.001;

//    forest1.forestPts.rotation.x = time * 0.25;
//    forest1.forestPts.rotation.y = time * 0.5;
//    if (forest1.ImportFromCSV("data/Trunk.csv")){scene.add( forest1.forestPts );}
    renderer.render( scene, camera );

}
function onWindowResize() {

    windowHalfX = container.clientWidth / 2;
    windowHalfY = container.clientHeight / 2;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, container.clientHeight);

}
$(window).scroll(function() {
    if ($(this).scrollTop()) {
        $('#toTop').fadeIn();
    } else {
        $('#toTop').fadeOut();
    }
});
$("#toTop").click(function(){
    $("html body").animate({scrollTop: 0}, 200);
//    alert(0);
});
$("#toTop").mouseenter(function(){
    $( "#toTopHover" ).animate({
        opacity: 100
    }, 50, function() {
        // Animation complete.
    });
//    alert(0);
});
$("#toTop").mouseleave(function(){
    $( "#toTopHover" ).animate({
        opacity: 0
    }, 50, function() {
        // Animation complete.
    });
});
$(".jFlowPrev").click(function(){
    islider--;
    if (islider<0){islider=NSLIDER-1};
    DisplaySlider(islider);
});
$(".jFlowNext").click(function(){
    islider++;
    if (islider>NSLIDER-1){islider=0};
    DisplaySlider(islider);
});
function DisplaySlider(ind){
    if(ind==0){
//        $(".flowslider_cls").css("z-index",0);
        $(".flowslider_cls").css("display","none");
        $("#jFlowSlider").css("display","block");

    }else if (ind==1){
//        $(".flowslider_cls").css("z-index",0);
        $(".flowslider_cls").css("display","none");
        $("#jFlowSlider_2").css("display","block");
    }else if (ind==2){
//        $(".flowslider_cls").css("z-index",0);
        $(".flowslider_cls").css("display","none");
        $("#jFlowSlider_3").css("display","block");

    }else if (ind==3){
//        $(".flowslider_cls").css("z-index",0);
        $(".flowslider_cls").css("display","none");
        $("#jFlowSlider_4").css("display","block");

    }else if (ind==4){
//        $(".flowslider_cls").css("z-index",0);
        $(".flowslider_cls").css("display","none");
        $("#jFlowSlider_5").css("display","block");
    }
}


//$(function(){
//
//});

//$("#onlinenum").load(connect());

