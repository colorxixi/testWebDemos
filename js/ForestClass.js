/**
 * Created by Administrator on 13-11-7.
 */
function myForest()
{
    this.forestCollections=[];
    this.forestGeometry = new THREE.BufferGeometry();
    this.forestPts=new THREE.Object3D();
    this.forestMaterial=[];
}
myForest.prototype.init=function()
{
}
myForest.prototype.initOctree=function(scene)
{
    this.forestOctree=octree = new THREE.Octree( {
        undeferred: false,
        depthMax: Infinity,
        objectsThreshold: 8,
        overlapPct: 0.15,
        scene: scene
    } );

}

myForest.prototype.ImportFromCSV=function(csvfilepath,scene)
{
    var _that=this;
    var isdone=false;
    var csvpts='';

    $.ajax({
        type:    "GET",
        url: csvfilepath,
        dataType: 'text',
        cache: true,
        async: true,
        error: function(){
            alert('fail get csv file!');
        }
        }).done(function(csvAsString){
            csvpts=csvAsString.split('\n');
            csvpts.pop();
            _that.forestGeometry.addAttribute( 'position', Float32Array, csvpts.length, 3 );
            _that.forestGeometry.addAttribute( 'color', Float32Array, csvpts.length, 3 );
            var positions = _that.forestGeometry.attributes.position.array;
            var colors = _that.forestGeometry.attributes.color.array;
            var color = new THREE.Color();

            var tmpcolors=new Array(csvpts.length);
//    positions

            for (var i=0;i< csvpts.length;i++)
            {
                var csvpt=csvpts[i].split(',');

                positions[ i*3 ]=parseFloat(csvpt[0])*10;
                positions[ i*3+1 ]=parseFloat(csvpt[2])*10;
                positions[ i*3+2 ]=parseFloat(csvpt[1])*10;

                tmpcolors[i]=parseInt(csvpt[3]);
            }
            var rainbow = new Rainbow();

            rainbow.setNumberRange(ss.quantile(tmpcolors,0.25), ss.quantile(tmpcolors,0.75));
            rainbow.setSpectrum('blue', 'green','yellow');
            for (var i = 0; i < tmpcolors.length; i++) {
                var c = rainbow.colourAt(tmpcolors[i]);
                colors[ i*3 ]     = parseInt(c.substring(0,2),16);
                colors[ i*3 + 1 ] = parseInt(c.substring(2,4),16);
                colors[ i*3 + 2 ] = parseInt(c.substring(4,6),16);
            }


            _that.forestGeometry.computeBoundingSphere();
            var material = new THREE.ParticleSystemMaterial( { size: 0.02, vertexColors: true } );
            _that.forestPts=new THREE.ParticleSystem( _that.forestGeometry, material);
            if (scene){scene.add(_that.forestPts)};
            isdone=true;
    });

return isdone;

}
myForest.prototype.MultiImportFromCSV=function(csvfolderpath,csvnamelist,scene)
{
    var isdone=false;
    var rainbow = new Rainbow();

    rainbow.setNumberRange(0,csvnamelist.length-1);
    rainbow.setSpectrum('blue','navy','lime','green','olive','yellow','red','purple');

    var iterColor=0;
    for (var i=0;i< csvnamelist.length;i++){

        var csvpts='';
        $.ajax({
            type:    "GET",
            url: csvfolderpath+'/'+csvnamelist[i]+'.csv',
            dataType: 'text',
            cache: true,
            async: true,
            error: function(){
                alert('fail get csv file!');
            }
        }).done(function(csvAsString){
                csvpts=csvAsString.split('\n');
                csvpts.pop();
                var forestGeometry=new THREE.BufferGeometry();
                var forestPts;
                forestGeometry.addAttribute( 'position', Float32Array, csvpts.length, 3 );
                forestGeometry.addAttribute( 'color', Float32Array, csvpts.length, 3 );
                var positions = forestGeometry.attributes.position.array;
                var colors = forestGeometry.attributes.color.array;
                var color = new THREE.Color();
//    positions
                for (var j=0;j< csvpts.length;j++)
                {
                    var csvpt=csvpts[j].split(',');

                    positions[ j*3 ]=parseFloat(csvpt[0])*10;
                    positions[ j*3+1 ]=parseFloat(csvpt[2])*10;
                    positions[ j*3+2 ]=parseFloat(csvpt[1])*10;
                    colors[ j*3 ]     = parseInt(rainbow.colourAt(iterColor).substring(0,2),16)/255;
                    colors[ j*3 + 1 ] = parseInt(rainbow.colourAt(iterColor).substring(2,4),16)/255;
                    colors[ j*3 + 2 ] = parseInt(rainbow.colourAt(iterColor).substring(4,6),16)/255;
                }

                forestGeometry.computeBoundingSphere();
                var material = new THREE.ParticleSystemMaterial( { size: 0.02, vertexColors: true } );
                forestPts=new THREE.ParticleSystem(forestGeometry, material);
//                this.forestCollections.push(forestPts);
                iterColor++;
                scene.add(forestPts);
                isdone=true;
            });
    }
    return isdone;
}
myForest.prototype.ImportFromXML=function(xmlfilepath,scene)
{
//    this.forestPts=new THREE.Object3D();
//    var segObj=this.forestPts;
    var isdone=false;
    var mat = new THREE.LineBasicMaterial({ linewidth: 5,color: 0xffff00 });
    $.ajax({
        type:    "GET",
        url: xmlfilepath,
        dataType: 'xml',
        cache: true,
        async: true,
        error: function(){
            alert('fail get xml file!');
        }
    }).done(function(xmldata){
            var $xml=$(xmldata);
            var xml_nodes=$('Node',xmldata);
            var xmlnodes=new Array(xml_nodes.length);
            var xmlnodesNeighborID=new Array(xml_nodes.length);
            for (var k=1;k<=xml_nodes.length;k++)
            {
                var xmlnode=$xml.find("Node[ID='"+ k.toString()+"']");
                var xmlnodeLoc=xmlnode.attr('Location').split(',');
                xmlnodes[k-1]={"x":10*parseFloat(xmlnodeLoc[0]),"y":10*parseFloat(xmlnodeLoc[2]),"z":10*parseFloat(xmlnodeLoc[1])};
                xmlnodesNeighborID[k-1]=parseInt(xmlnode.attr('Neighbor'))-1;
            }
            $xml.find("Branch").each(function() {
                var nodeIDs = $(this).attr("Nodes").split(',');
                var geom = new THREE.Geometry();
                var nd0ID=0;
                if ($(this).attr("Father")!="0")
                {
                    var nd0Loc;
//                    var ndStartCandi=$xml.find("Node[ID='"+ $(this).attr("Father")+"']").attr('Child').split(',');
                    var ndStartCandi=$(this).parent().attr('Child').split(',');
                    for (var ind=0;ind<ndStartCandi.length;ind++){
                        if ($.inArray(ndStartCandi[ind], nodeIDs) !== -1){
                            nd0ID=parseInt(ndStartCandi[ind])-1;
                            break;
                        }
                    }
                    nd0Loc=xmlnodes[nd0ID];
                    var ndFatherLoc=xmlnodes[parseInt($(this).attr("Father"))-1];
                    geom.vertices.push( new THREE.Vector3(ndFatherLoc.x,ndFatherLoc.y,ndFatherLoc.z));
                    geom.vertices.push( new THREE.Vector3(nd0Loc.x,nd0Loc.y,nd0Loc.z));
                    var branchSeg= new THREE.Line( geom, mat );
//                    segObj.add(branchSeg);
                    scene.add(branchSeg);
                }
                var ndID=nd0ID;
                while(xmlnodesNeighborID[ndID]!=-2){
                    geom = new THREE.Geometry();
                    var nd=xmlnodes[ndID];
                    var nd2=xmlnodes[xmlnodesNeighborID[ndID]];
                    geom.vertices.push( new THREE.Vector3(nd.x,nd.y,nd.z));
                    geom.vertices.push( new THREE.Vector3(nd2.x,nd2.y,nd2.z));
                    branchSeg= new THREE.Line( geom, mat );
//                    segObj.add(branchSeg);
                    ndID=xmlnodesNeighborID[ndID];
                    scene.add(branchSeg);
                }
                isdone=true;
            });
        });
    return isdone;
}
myForest.prototype.ImportFromObj=function(objfilepath,scene)
{
    var isdone=false;
    this.forestPts=new THREE.Object3D();
    var loader = new THREE.OBJLoader();
    loader.load( objfilepath, function ( object ) {
        var mat2 = new THREE.MeshBasicMaterial({color: 0xF0AEFF});
//        object.scale.set(10,10,10);
        object.traverse( function ( child )
        {
            if ( child instanceof THREE.Mesh )
                child.material.needsUpdate = true;
                child.material=mat2;
        });
//        var axes = new THREE.Object3D();
//        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 100, 0, 0 ), 0xFF0000, false ) ); // +X
        this.forestPts=object;
//        this.forestPts.rotation.y+=Math.PI/2;
        var rotationMatrix = new THREE.Matrix4(
            0,0,10,0,
            0,10,0,0,
            10,0,0,0,
            0,0,0,1);
//        rotationMatrix = new THREE.Matrix4(
//            10,0,0,0,
//            0,10,0,0,
//            0,0,10,0,
//            0,0,0,1);
        rotationMatrix.multiply(new THREE.Matrix4(
            0,0,-1,1,
            0,1,0,0,
            1,0,0,0,
            0,0,0,1
        ))
        rotationMatrix.multiply(new THREE.Matrix4(
            1,0,0,0,
            0,1,0,0,
            0,0,1,1,
            0,0,0,1
        ))
        this.forestPts.matrixAutoUpdate=false;
//        this.forestPts.rotation.y+=Math.PI;
//        this.forestPts.matrix.multiply(rotationMatrix);
        this.forestPts.applyMatrix(rotationMatrix);
//        this.forestPts.matrixAutoUpdate=true;
//
        scene.add(object);
        isdone=true;
    } );
    return isdone;
}

myForest.prototype.Shading=function()
{

}
