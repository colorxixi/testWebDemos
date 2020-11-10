/**
 * Created by Administrator on 13-11-13.
 */
function micronClass(){
    this.pos=new THREE.Vector3();
    this.color=new THREE.Color();
    this.color.setRGB(100,100,0);
    this.dist=0;
    this.direction=new THREE.Vector3();
    this.shape='';
    this.isout=false;
}
micronClass.prototype.InitPos=function(pos){
    this.pos.x=pos.x;
    this.pos.y=pos.y;
    this.pos.z=pos.z;
}
micronClass.prototype.Init=function(pos,r,g,b,size,direction,shape){
    r=r||0;
    g=g||0;
    b=b||0;
    var color=new THREE.Color();
    color.setRGB(r,g,b);
    this.pos=pos||new THREE.Vector3();
    this.size=size||3;
    this.direction=direction||new THREE.Vector3();
    this.color=color;
    this.dist=0;
    this.shape='';
    this.isout=false;
}
function simpleEmitterClass()
{
    this.micra=[];
    this.COLLISION_DIST=5;
    this.FRAME_INTERVAL=10;
    this.MAX_DIST=500;
    this.MAX_NUM=300;
    this.ONCE_NUM=10;
    this.DEFAULT_COLOR=new THREE.Color();
    this.DEFAULT_COLOR.setRGB(100,100,0);
    this.DEFAULT_SIZE=5;
    this.INIT_DIRECT=new THREE.Vector3(5,0,0);
    this.origin=[];
    this.currentfame=0;
    this.counter=0;
}
simpleEmitterClass.prototype.Init=function(max_num){
    max_num=max_num||this.MAX_NUM;
    for (var i= 0;i<max_num;i++){
        this.origin.push(new THREE.Vector3(0,0,0));
        var photon=new micronClass();
        photon.InitPos(this.origin[i]);
        photon.direction=this.INIT_DIRECT.clone();
        this.micra.push(photon);
    }
    this.MAX_NUM = max_num;
}

simpleEmitterClass.prototype.Update=function(obstacles){
    this.currentfame++;
    for (var i=0;i<this.MAX_NUM;i++)
    {
        if (this.micra[i].isout){
            var newdirection=this.CollisionTest(this.micra[i].pos,this.micra[i].direction,obstacles);
            this.micra[i].pos.x+=newdirection.x;
            this.micra[i].pos.y+=newdirection.y;
            this.micra[i].pos.z+=newdirection.z;
            this.micra[i].dist+=Math.sqrt(newdirection.x*newdirection.x+newdirection.y*newdirection.y+newdirection.z*newdirection.z);
            if (this.micra[i].dist>this.MAX_DIST){
                this.micra[i].InitPos(this.origin[i]);
                this.micra[i].dist=0;
                this.micra[i].direction=this.INIT_DIRECT.clone();
                this.micra[i].isout=false;
            }
        }else{

            if (this.counter<=this.ONCE_NUM){
                this.micra[i].pos.x+=this.micra[i].direction.x;
                this.micra[i].pos.y+=this.micra[i].direction.y;
                this.micra[i].pos.z+=this.micra[i].direction.z;
                this.counter++;
                this.micra[i].isout=true;
            }
        }
    }
    if (this.currentfame>=this.FRAME_INTERVAL) {this.counter=0;this.currentfame=0;}
}
simpleEmitterClass.prototype.CollisionTest=function(currentpos,currentdirect,obstacles){
    var nomrvec=new THREE.Vector3(currentdirect.x/currentdirect.length(),currentdirect.y/currentdirect.length(),currentdirect.z/currentdirect.length());
    var raycaster = new THREE.Raycaster(currentpos,nomrvec,0,this.COLLISION_DIST);
    var intersects = raycaster.intersectObjects(obstacles.children,true);
    if(intersects.length>0){
        var chance=Math.random();
        if (chance<obstacles.REF){
            var worldNormal=intersects[0].face.normal;
            var azimuth0=2*Math.PI*Math.random();
            var zenith0=Math.acos(2*Math.random()-1);
            var vec=new THREE.Vector3();
            vec.x=currentdirect.length()*Math.cos(zenith0)*Math.cos(azimuth0);
            vec.y=currentdirect.length()*Math.cos(zenith0)*Math.sin(azimuth0);
            vec.z=currentdirect.length()*Math.sin(zenith0);

            var zenith=Math.acos(worldNormal.z/Math.sqrt(worldNormal.x*worldNormal.x+worldNormal.y*worldNormal.y));

            var azimuth=Math.atan2(worldNormal.y,worldNormal.x);
            currentdirect.x=vec.x*Math.cos(azimuth)*Math.cos(zenith)-vec.y*Math.sin(azimuth)+vec.z*Math.cos(azimuth)*Math.sin(zenith);
            currentdirect.y=vec.x*Math.sin(azimuth)*Math.cos(zenith)+vec.y*Math.cos(azimuth)+vec.z*Math.sin(azimuth)*Math.sin(zenith);
            currentdirect.z=-vec.x*Math.sin(zenith)+vec.z*Math.cos(zenith);

        }else if(chance<obstacles.REF+obstacles.SPEC){
            var worldNormal=intersects[0].face.normal;
            var vecscalar=(currentdirect.x*worldNormal.x+currentdirect.y*worldNormal.y+currentdirect.z*worldNormal.z)/
                (worldNormal.x*worldNormal.x+worldNormal.y*worldNormal.y+worldNormal.z*worldNormal.z);
            var vertVecNeg2=new THREE.Vector3(-2*vecscalar*worldNormal.x,-2*vecscalar*worldNormal.y,-2*vecscalar*worldNormal.z);
            currentdirect.x=vertVecNeg2.x+currentdirect.x;
            currentdirect.y=vertVecNeg2.y+currentdirect.y;
            currentdirect.z=vertVecNeg2.z+currentdirect.z;
        }
//        var normalMatrix = new THREE.Matrix3().getNormalMatrix(obstacle.matrixWorld);
//        worldNormal = intersects[0].face.normal.clone().applyMatrix3( normalMatrix ).normalize();
    }
    return currentdirect;
}
