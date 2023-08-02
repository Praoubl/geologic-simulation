//var ctx = canvas.getContext('2d');
var canvas = document.getElementById('canvas');
var pix1=[0,0,0], pix2=[0,0,0], pix3=[0,0,0],tiles=[],objs=[];
var i=0;
var j=0;
var k=0;
var i2=0;
var j2=0;
var t=0;
var sq2=Math.sqrt(2);
//var p=[];
var mid=[],mid2=[],mid3=0,mid4=[];
var mid5=[];
window.addEventListener("keydown", (event) => {
  press(event)
});
window.addEventListener("keyup", (event) => {
  release(event)
});
var input = {
  right: false,
  up: false,
  left: false,
  down: false,
  restart: false,
  attack:false,
  x:false,
  z:false,
  c:false,
  e:false,
};
var KEY = {
  D: 68,
  W: 87,
  A: 65,
  S:83,
  RIGHT:39,
  UP:38,
  LEFT:37,
  DOWN:40,
  Q:81,
  R:16,
  X:88,
  Z:90,
  C:67,
  E:69,
};
function press(evt) {
  var code = evt.keyCode;
  switch(code) {
    case KEY.RIGHT:
    case KEY.D: input.right = true; break;
    case KEY.UP:
    case KEY.W: input.up = true; break;
    case KEY.LEFT:
    case KEY.A: input.left = true; break;
    case KEY.DOWN:
    case KEY.S: input.down = true; break;
    case KEY.Q: input.restart = true; break;      
    case KEY.R: input.attack = true; break;
    case KEY.X: input.x = true; break;
    case KEY.Z: input.z = true; break;
    case KEY.C: input.c = true; break;
    case KEY.E: input.e = true; break;
  }
};
function release(evt) {
  var code = evt.keyCode;
  switch(code) {
    case KEY.RIGHT:
    case KEY.D: input.right = false; break;
    case KEY.UP:
    case KEY.W: input.up = false; break;
    case KEY.LEFT:
    case KEY.A: input.left = false; break;
    case KEY.DOWN:
    case KEY.S: input.down = false; break;
    case KEY.Q: input.restart = false; break;
    case KEY.R: input.attack = false; break;
    case KEY.X: input.x = false; break;
    case KEY.Z: input.z = false; break;
    case KEY.C: input.c = false; break;
    case KEY.E: input.e = false; break;
  }
};
var mouseX=10;
var mouseY=10;
var mouseIsClicked=false;
function mouseMoveHandler(e) {
  mouseX = e.clientX - 10;
  mouseY = e.clientY - 10;
};
function mouseClickHandler(e) {
  mouseIsClicked=true;
  //alert('click');
};
window.addEventListener("mousemove", mouseMoveHandler, false);
window.addEventListener("click", mouseClickHandler, false);
var map={
  scale:1,
  zoom:1,
  x:0,
  y:0,
  update:true,
  input:function(){},
  ter:[]//10 meter squares?
};
var mapSeeds={
  base:Math.random(),
  erosion:Math.random(),
  LIPs:Math.random(),
  boundaries:Math.random(),
  boundaries2:Math.random()
};
var scene="map";
var erosionMax=0.2;
var mapSplines={
  base:{x:
[0,0.075,0.2,0.5,0.54,0.57,0.59,1],y:   
[0,0.25,0.3,0.35,0.45,0.5,0.52,0.55]},
  erosion:{x:[0,0.5,0.7,1],y:[0,0.1,0.2,erosionMax]},
  LIPs:{x:[0,0.65,1],y:[0,0,0.2]},
  plates:{x:[0,0.5,0.61,0.61,1],y:[0,0,1,0,0]},
  plates2:{x:[1,1.3625,1.4125,1.425,1.4375,1.4875,2,2,2.3625,2.4125,2.425,2.4375,2.4875,2.55,2.7,2.85,2.9 ,3,3,3.1 ,3.15 ,3.175,3.37 ,3.47,3.7 ,3.93,3.97,4,4,5,5,6],y:
             [0,0     ,0.15  ,0.07 ,0.15  ,0.05  ,0,0,0     ,0.15  ,0.07 ,0.15  ,0.07  ,0.09,0.3,0.1 ,0.05,0,0,-0.1,-0.35,-0.05,0   ,0.15,0.65,0.15,0.05,0,0,0,0,0]}, //transverse,transverse former convergent,convergent,none,none
  boundaries:{x:[0,0.2,0.2,0.4,0.4,0.6,0.6,0.8,0.8,1],y:[1,1,2,2,3,3,4,4,5,5]},
  boundaries2:{x:[0,0.2,0.2,0.4,0.4,0.6,0.6,0.8,0.8,1],y:[1,1,3,3,7,7,13,13,17,17]},
  boundaries3:{x:[0,0.1,0.1,1],y:[0,0,1,1]}
};
var erosionEquilibrium=0.34;
var baseTer=[];
var erosion=[];
var mountainousness=[];
var depositon=[];
var volcanism=[];
var rivers=[];
var hotspots=[];
var LIPs=[];
var plates=[];
var plates2=[];
var boundaries=[];
var boundaries2=[];
var ter=[];
var smooth1d=function(b){
  mid=b;
  for(i=0;i<b.length-2;i++){
    mid[i+1]=(b[i]+b[i+2])/2;
  };
  return(mid);
};
var smooth2d=function(c,q){
  mid=c;
  for(i=q;i<c.length-q;i++){
    if(q<i<c.length-q-1&&0<i-(Math.floor((i-1)/q)*q)<q-1){
      mid[i]=(c[i-q]+c[i-1]+(96*c[i])+c[i+1]+c[i+q])/100;
    //}else if(0<i-(Math.floor(i/q)*q)<q-1){
      //mid[i]=(c[i-1]+c[i]+c[i+1])/3;
    };
  };
  return(mid);
};
var smooth2dTiles=function(){
  mid=tiles;
  for(i=1;i<(canvas.width/4)-1;i++){
      for(j=1;j<(canvas.height/4)-1;j++){
        tiles[i][j][0].r=((mid[i-1][j][0].r)+(mid[i+1][j][0].r)+(mid[i][j-1][0].r)+(mid[i][j+1][0].r)+(mid[i][j][0].r))/3;
        tiles[i][j][0].g=((mid[i-1][j][0].g)+(mid[i+1][j][0].g)+(mid[i][j-1][0].g)+(mid[i][j+1][0].g)+(mid[i][j][0].g))/3;
        tiles[i][j][0].b=((mid[i-1][j][0].b)+(mid[i+1][j][0].b)+(mid[i][j-1][0].b)+(mid[i][j+1][0].b)+(mid[i][j][0].b))/3;
      };
    };
};
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

(function(global){
  var module = global.noise = {};

  function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }
  
  Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
  };

  Grad.prototype.dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
  };

  var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
               new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
               new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

  var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  // To remove the need for index wrapping, double the permutation table length
  var perm = new Array(512);
  var gradP = new Array(512);

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  module.seed = function(seed) {
    if(seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
      seed |= seed << 8;
    }

    for(var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  module.seed(0);

  /*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/

  // Skewing and unskewing factors for 2, 3, and 4 dimensions
  var F2 = 0.5*(Math.sqrt(3)-1);
  var G2 = (3-Math.sqrt(3))/6;

  var F3 = 1/3;
  var G3 = 1/6;

  // 2D simplex noise
  module.simplex2 = function(xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1; j1=0;
    } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  };

  // 3D simplex noise
  module.simplex3 = function(xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin+zin)*F3; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);

    var t = (i+j+k)*G3;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    var z0 = zin-k+t;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if(x0 >= y0) {
      if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;

    var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
    var y2 = y0 - j2 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;

    var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255;
    j &= 255;
    k &= 255;
    var gi0 = gradP[i+   perm[j+   perm[k   ]]];
    var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
    var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
    var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if(t3<0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 32 * (n0 + n1 + n2 + n3);

  };

  // ##### Perlin noise stuff

  function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
  }

  function lerp(a, b, t) {
    return (1-t)*a + t*b;
  }

  // 2D Perlin Noise
  module.perlin2 = function(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
       fade(y));
  };

  // 3D Perlin Noise
  module.perlin3 = function(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    // Get relative xyz coordinates of point within that cell
    x = x - X; y = y - Y; z = z - Z;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255; Z = Z & 255;

    // Calculate noise contributions from each of the eight corners
    var n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
    var n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
    var n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
    var n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
    var n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
    var n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
    var n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
    var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

    // Compute the fade curve value for x, y, z
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    // Interpolate
    return lerp(
        lerp(
          lerp(n000, n100, u),
          lerp(n001, n101, u), w),
        lerp(
          lerp(n010, n110, u),
          lerp(n011, n111, u), w),
       v);
  };

})(this);//from github.com/josephg/noisejs/blob/master/perlin.js
var dirw=[{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},{x:0,y:-1},{x:0,y:1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},{x:0,y:-1},{x:0,y:1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:-1,y:0},{x:0,y:-1},{x:0,y:1},{x:1,y:0}];
var randDir=function(){
  return(dirw[Math.floor(20*Math.random())]);
};
var randPos=function(){
  return({x:Math.floor(Math.random()*canvas.width/4),y:Math.floor(Math.random()*canvas.height/4)});
};
var blob=function(bSize,bObj,bPos){
  resetmid2();
  mid5=[bPos];
  mid2[bPos.x][bPos.y].unshift(bObj);
  for(j=1;j<bSize;j++){
    mid5[j]={x:mid5[j-1].x,y:mid5[j-1].y};
    mid3=randDir();
    mid5[j].x+=mid3.x;
    mid5[j].y+=mid3.y;
    mid2[mid5[j].x][mid5[j].y].unshift(bObj);
    console.log(mid5[j].x+","+mid5[j].y);
  }
  return(mid2);
};
bGradient=function(bSize,bObj,bPos){
  resetmid2();
  mid5=[bPos];
  mid2[bPos.x][bPos.y].unshift(bObj);
  for(j=1;j<bSize;j++){
    mid3=randDir();
    mid5[j-1].x+=mid3.x;
    mid5[j-1].y+=mid3.y;
    mid2[mid5.x][mid5.y].unshift(bObj);
  }
  return(mid5);
};
var placeBlob=function(tobobj,tobsize,tobpos){
  mid4=blob(tobsize,tobobj,tobpos);
  for(i=0;i<canvas.height/4;i++){
    for(j=0;j<canvas.width/4;j++){
      if(mid4[i][j][0]===tobobj){
        tiles[i][j].unshift(tobobj);
        console.log(i+","+j);
      }
    }
  }
};
var lerp=function(lX,lY,lIn){// ordered pair,pair,float
  return(lY[0]+(lIn-lX[0])*(lY[1]-lY[0])/(lX[1]-lX[0]));
};
var lerpSpline=function(lspX,lspY,lspIn){// ordered list,list,float
  for(i2=0;i2<lspX.length-1;i2++){
    if(lspIn>lspX[i2]&&lspIn<lspX[i2+1]){
      return(lerp([lspX[i2],lspX[i2+1]],[lspY[i2],lspY[i2+1]],lspIn));
    }
  };
  return(0);
};
var noiseify=function(xnScale,ynScale,nScale,nSpline,nOctaves){
  mid=[];
  mid3=Math.random();
  noise.seed(mid3);
  for(i=0;i<canvas.height/4;i++){
    mid[i]=[];
    for(j=0;j<canvas.width/4;j++){
      mid[i][j]=0;
      for(k=0;k<nOctaves;k++){
        mid[i][j]+=nScale[k]*(1+noise.simplex2(i/xnScale[k],j/ynScale[k]))/2;
      }
      mid[i][j]=lerpSpline(nSpline.x,nSpline.y,mid[i][j]);
    };
  };
  console.log(mid3);
  return(mid);
};
var noiseifySeeded=function(xnScale,ynScale,nScale,nSpline,nOctaves,nSeed){
  mid=[];
  noise.seed(nSeed);
  for(i=0;i<canvas.height/4;i++){
    mid[i]=[];
    for(j=0;j<canvas.width/4;j++){
      mid[i][j]=0;
      for(k=0;k<nOctaves;k++){
        mid[i][j]+=nScale[k]*(1+noise.simplex2(i/xnScale[k],j/ynScale[k]))/2;
      }
      mid[i][j]=lerpSpline(nSpline.x,nSpline.y,mid[i][j]);
    };
  };
  return(mid);
};
noiseifyPoint=function(xnScale,ynScale,nScale,nSpline,nOctaves,nSeed,nX,nY){
  mid3=0;
  noise.seed(nSeed);
  for(k=0;k<nOctaves;k++){
    mid3+=nScale[k]*(1+noise.simplex2(nX/xnScale[k],nY/ynScale[k]))/2;
  }
  mid3=lerpSpline(nSpline.x,nSpline.y,mid3);
  return(mid3);
};
var positify=function(pIn){
  return(Math.max(0,pIn));
};
draw=function(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var cw=canvas.width/4;
  var ch=canvas.height/4;
  if(t===0){
    for(i=0;i<canvas.width/4;i++){
      tiles[i]=[];
      for(j=0;j<canvas.height/4;j++){
        tiles[i][j]=[{r:0,g:0,b:0}];
      }
    }
    resetmid2=function(){
      mid2=[];
      for(i2=0;i2<canvas.width/4;i2++){
        mid2[i2]=[];
        for(j2=0;j2<canvas.height/4;j2++){
          mid2[i2][j2]=[{r:0,g:0,b:0}];
        }
      }
    };
  }
  if(map.update){
    //placeBlob({type:"mountain",r:100,g:100,b:150},100,randPos());
    //placeBlob({type:"mountain",r:100,g:100,b:100},100,{x:64,y:64});
    for(i=0;i<ch;i++){
      baseTer[i]=[];
      erosion[i]=[];
      LIPs[i]=[];
      plates[i]=[];
      plates2[i]=[];
      boundaries[i]=[];
      boundaries2[i]=[];
      map.ter[i]=[];
      for(j=0;j<cw;j++){
        baseTer[i][j]=noiseifyPoint([80*map.scale,40*map.scale,20*map.scale,10*map.scale,5*map.scale,2.5*map.scale],[80*map.scale,40*map.scale,20*map.scale,10*map.scale,5*map.scale,2.5*map.scale],[0.45,0.26,0.135,0.0725,0.04125,0.025625],mapSplines.base,6,mapSeeds.base,i+map.x*map.scale,j+map.y*map.scale);
        plates[i][j]=noiseifyPoint([80*map.scale,40*map.scale,20*map.scale,10*map.scale],[80*map.scale,40*map.scale,20*map.scale,10*map.scale],[0.45,0.26,0.135,0.0725],mapSplines.plates,4,mapSeeds.base,i+map.x*map.scale,j+map.y*map.scale);
        boundaries[i][j]=noiseifyPoint([160*map.scale,80*map.scale],[160*map.scale,80*map.scale],[0.9,0.1],mapSplines.boundaries,2,mapSeeds.boundaries,i+map.x*map.scale,j+map.y*map.scale);
        boundaries2[i][j]=noiseifyPoint([640*map.scale,320*map.scale],[640*map.scale,320*map.scale],[0.9,0.1],mapSplines.boundaries2,2,mapSeeds.boundaries2,i+map.x*map.scale,j+map.y*map.scale);
        erosion[i][j]=noiseifyPoint([32*map.scale,16*map.scale,8*map.scale,4*map.scale],[32*map.scale,16*map.scale,8*map.scale,4*map.scale],[0.5625,0.25,0.125,0.0625],mapSplines.erosion,4,mapSeeds.erosion,i+map.x*map.scale,j+map.y*map.scale);
        LIPs[i][j]=noiseifyPoint([32*map.scale,16*map.scale,8*map.scale,4*map.scale],[32*map.scale,16*map.scale,8*map.scale,4*map.scale],[0.5625,0.25,0.125,0.0625],mapSplines.LIPs,4,mapSeeds.LIPs,i+map.x*map.scale,j+map.y*map.scale);
        map.ter[i][j]=baseTer[i][j];
        map.ter[i][j]=Math.min(1,map.ter[i][j]+LIPs[i][j]);
        plates[i][j]=lerpSpline(mapSplines.boundaries3.x,mapSplines.boundaries3.y,plates[i][j])*(plates[i][j]+((boundaries[i][j]*boundaries2[i][j])%5.00000001));
        plates2[i][j]=lerpSpline(mapSplines.plates2.x,mapSplines.plates2.y,plates[i][j]);
        map.ter[i][j]+=plates2[i][j];
        map.ter[i][j]=((map.ter[i][j]-erosionEquilibrium)*(1-erosion[i][j]))+erosionEquilibrium;
        if(map.ter[i][j]<0.5){
          tiles[i][j][0]={r:10,g:30,b:20+180*(map.ter[i][j])};
        }else{
          tiles[i][j][0]={r:220*2*positify(map.ter[i][j]-0.5),g:220*map.ter[i][j],b:220*2*positify(map.ter[i][j]-0.5)};
        }
        //tiles[i][j][0]={r:30+180*(plates2[i][j]),g:70,b:10};
      };
    };
    map.update=false;
  }
  
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (scene==="map"){
    for(i=0;i<ch;i++){
      for(j=0;j<cw;j++){
        ctx.fillStyle="rgb(0,0,0)";
        ctx.fillStyle="rgb("+(tiles[i][j][0].r)+","+(tiles[i][j][0].g)+","+(tiles[i][j][0].b)+")";
        ctx.fillRect(i*4,j*4,4,4);
      };
    };
    if(input.up){
      map.y-=1/map.scale;
      map.update=true;
    }
    if(input.down){
      map.y+=1/map.scale;
      map.update=true;
    }
    if(input.left){
      map.x-=1/map.scale;
      map.update=true;
    }
    if(input.right){
      map.x+=1/map.scale;
      map.update=true;
    }
    if(input.x){
      map.scale*=1.1;
      map.update=true;
    }
    if(input.z){
      map.scale/=1.1;
      map.update=true;
    }
  }else if(scene==="map3d"){
    for(i=0;i<ch;i++){
      for(j=0;j<cw;j++){
        ctx.fillStyle="rgb(0,0,0)";
        ctx.fillStyle="rgb("+(tiles[i][j][0].r)+","+(tiles[i][j][0].g)+","+(tiles[i][j][0].b)+")";
        ctx.fillRect((2*sq2*(i+j))-((sq2-1)*cw*2),(2*(j-i))+((0.99)*cw*2)-(map.ter[i][j]-map.ter[cw/2][ch/2])*10*map.scale,4,4);
      };
    };
    if(input.up){
      map.y-=1/map.scale;
      map.x+=1/map.scale;
      map.update=true;
    }
    if(input.down){
      map.y+=1/map.scale;
      map.x-=1/map.scale;
      map.update=true;
    }
    if(input.left){
      map.x-=1/map.scale;
      map.y-=1/map.scale;
      map.update=true;
    }
    if(input.right){
      map.x+=1/map.scale;
      map.y+=1/map.scale;
      map.update=true;
    }
    if(input.x){
      map.scale*=1.1;
      map.update=true;
    }
    if(input.z){
      map.scale/=1.1;
      map.update=true;
    }
  }
  ctx.font = '15px sans-serif';
  ctx.fillStyle= 'rgb(250, 250, 250)';
  ctx.fillText(map.ter[Math.floor(mouseX/4)][Math.floor(mouseY/4)],0,12);
  t++;
  mouseIsClicked=false;
};
//window.requestAnimationFrame(draw);
var callback1 = setInterval(draw, 20);
