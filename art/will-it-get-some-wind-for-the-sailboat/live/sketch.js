function setup() {
  
  seed = F(fxrand()*1e9);
  console.log(seed)
  randomSeed(seed);
  noiseSeed(seed);
  
  cm = sC();
  
  w = width;
  h = height;
  colorMode(HSB,1);
  
  [cN, P] = getP();
  L = P.length;
  [rmin, nF, nx, ny, rM, sM, nM, cM, db] = gL();
  [res, sT, nP] = gSP();

  cMO = r()>0.7 & ny > 30 ? r(['circle','x','y','square']) : 'none';
  
  [xc1, yc1] = gR(3);
  [xc2, yc2] = gR(3);
  [xc3, yc3] = gR(3);
  [xc4, yc4] = gR(3);
  
  if (r()>0.7){
    [xc1, yc1] = [xc2, yc2] = [xc3, yc3] = [xc4, yc4] = [w/2,h/2];
  }
  
  mx = db*cm;
  my = db*cm;
  dBG();
  dK();
  T();
  sG();
  
  if (cMO!=='none'){cM = cM2!=cM3 ? cM2 + ' & ' + cM3 : cM2}
  window.$fxhashFeatures = {
    "Colors": cN,
    "Rotate": rM,
    "Scale": sM,
    "Noise": nM,
    "Color Layout": cM
  }
  fxpreview();
}

function dK() {
  // Colors
  cOi = 1;
  cIi = 2;
  xA = r() > 0.8 ? r2(7,10) : r2(1,5);
  yA = r() > 0.8 ? r2(7,10) : r2(1,5);
    
  let rF = r([[0,0], [r2(-2,2)*TAU, 0], [0, r2(-2,2)*TAU], [r(0.5),r(0.5)]]);
  let rW = r([0,1]);
  
  let dx0 = (w+2*mx)/nx;
  let dy0 = (h+2*my)/ny;
  let iS = r2(1/4,0.8);
  
  let [h00, h01, h02, h10, h11, h12] = (r()>0.2) ? 
      [0.2, 0.6, 0.2, 0.3, 0.5, 0.5] : r([[0.5, 0.4, 0, 0.5, 0, 0.4],[0.6, 0.1, 0.1, 0.6, 0.1, 0.1]]);
  
  let cMY = r([h/3,h/2,h*2/3]);
  let cMX = r()>0.9 ? w/2 : r([w/3,w*2/3]);
  
  cM2 = r(['swatch','swatch','grid','circles','radial','radial',r(['squares','square'])]);
  cM3 = r(['swatch','swatch','grid','circles','radial','radial',r(['squares','square'])]);
  
  
  let pM = r()>0.5 ? 'in' : (r()>0.05 ? r(['tall', 'wide']) : 'noInner');

  let [cxc1, cyc1] = r([[xc1,yc1],[xc3,yc3]])
  let [cxc2, cyc2] = r([[xc4,yc4],[cxc1,cyc1]]);
  let gridX = r([-1,1]);
  let gridY = r([-1,1]);
  
  for (x=-dx0; x<w+dx0; x+= nM=='grid'? dx0 : dx){
    for (y=-dy0; y<h+dy0; y+=nM=='grid'? dy0 : dy){
      nD(3,0.9);
      
      // Set cell dimensions
      dx = dx0*rmin + dx0*(1-rmin) * r();
      dy = dy0*rmin + dy0*(1-rmin) * r();
      
      // Set origin of cell
      xc = x+dx/2 + dx/2 * sin(TAU*N(nF*x/w,nF*y/h,0));
      yc = y+dy/2 + dy/2 * cos(TAU*N(nF*x/w,nF*y/h,1));
      
      // Change cM?
      switch (cMO){
        default:
        break;
        case 'y':
          cM = y>cMY ? cM3 : cM2;
        break;
        case 'x':
          cM = x>cMX ? cM3 : cM2;
        break;
        case 'circle':
          cM = D(x,y,w/2,h/2)>cm/4 ? cM3 : cM2;
          cM = D(x,y,cMX,cMY)>cm/4 ? cM3 : cM2;
        break;
        case 'square':
          cM = max(abs(x-w/2),abs(y-h/2))>cm/5 ? cM3 : cM2;
        break;
      }
      
      if (xc>mx & xc<w-mx & yc>my & yc<h-my){
        mW = dx*1.2;
        mH = dy*1.2;
        let xa = (x-xc1)/cm;
        let ya = (y-yc1)/cm;
        switch (cM){
          default: // alternating
            cOi = int((cOi+1)%L);
            cIi = int((cIi+1)%L);
          break;
          case 'swatch':
            cOi = F(N(xA*x/w)*L)%L;
            cIi = F(N(yA*y/h)*L)%L;
          break;
          case 'grid':
            cOi = F(N(sin(gridX*xA*TAU*x/w + gridY*TAU*yA*y/h))*L)%L;
            cIi = F(N(sin(gridY*yA*TAU*y/h + gridX*TAU*xA*x/w))*L)%L;
          break;
          case 'circles':
            cOi = F(xA*D(cxc1/cm,cyc1/cm,x/cm,y/cm)*L)%L;
            cIi = F(yA*D(cxc2/cm,cyc2/cm,x/cm,y/cm)*L)%L;
          break;
          case 'mono':
            cOi = 0;
            cIi = 0;
          break;
          case 'two':
            cOi = 1;
            cIi = 0;
          break;
          case 'radial':
            let a1 = atan2((x-xc1)/w,(y-yc1)/h) + rF[0]*D(x,y,xc1,rW==0?yc1:xc2)/cm;
            let a2 = atan2((x-xc2)/w,(y-yc2)/h) + rF[1]*D(x,y,rW==0?xc2:xc1,rW==0?yc2:xc2)/cm;
            cOi = F(xA*N(a1/TAU)*L)%L;
            cIi = F(yA*N(a2/TAU)*L)%L;
          break;
          case 'square':
            cOi = int(N(xA*max(abs(xa),abs(ya)))*L)%L;
            cIi = int(N(yA*max(abs(xa),abs(ya)))*L)%L;
          break;
          case 'squares':
            let xb = (x-xc2)/cm;
            let yb = (y-yc2)/cm;
            cOi = int(N(xA*max(abs(xa),abs(ya)))*L)%L;
            cIi = int(N(yA*max(abs(xb),abs(yb)))*L)%L;
          break;
        }
        
        let cO = C(hue(P[cOi]) + r2(-0.02, 0.02), 
                         S(P[cOi]) + r2(-0.05, 0.05),
                         B(P[cOi]) + r2(-0.05, 0.05));
        let cI   = C(hue(P[cIi]) + r2(-0.02, 0.02),
                         S(P[cIi]) + r2(-0.1, 0.1), 
                         B(P[cIi]) + r2(-0.05, 0.05));
        dO(xc,yc,mW,mH,cO,h00,h01,h02);
        switch (pM){
          case 'tall':
            dO(xc,yc,mW/2,mH,cI,h10,h11,h12);
          break;
          case 'wide':
            dO(xc,yc,mW,mH/2,cI,h10,h11,h12);
          break;
          case 'noInner':
          break;
          default:
            dO(xc,yc,mW*iS,mH*iS,cI,h10,h11,h12);   
          break;
        }
      }
    }
  }
}

function dO(x,y,W,H,c='#00f',h0=0.2,h1=0.6,h2=0.2){
  
  noStroke();
  fill(c);
  
  // Rotate
  scl = 1;
  [xC,yC] = [xc1, yc1];
  px = x - xC;
  py = y - yC;
  [xC,yC] = [xc2,yc2]
  px2 = x - xC;
  py2 = y - yC;
  d1 = D(0,0,px,py);
  d2 = D(0,0,px2,py2);
  t=t1=atan2(py,px);
  t2=atan2(py2,px2);
  switch (rM){
    default:
      t = 0;
    break;
    case 'circle':
      t = atan2(py,px);
      scl = (sM=='circle') ? 0.2 + 0.8*N(d1/cm) : scl;
    break;
    case 'dual':
      t = (d1<d2 ? t1: t2)
    break;
    case 'line':
      t = PI - PI/2 * (x/w-1/2);
    break;
  }
  
  // Scale
  switch (sM) {
    case 'none':
      scl = 1;
    break;
    case 'wavy':
      scl = 0.4 + 0.6*N(20*y/cm,20*x/cm);
    break;
    case 'circle':
      scl = (0.5 + 0.5*N(20*d1/cm, x/cm));
    break;
    case 'dual':
      scl = 1/4 + 0.37*N(20*d2/cm) + 0.37*N(20*d1/cm);
    break;
    case 'random':
      scl = r2(0.5,1.2);
    break;
    case 'sine':
      scl = 0.8+0.2*sin(3*PI*xA*x/cm)
    break;
    case 'linear':
      scl = 0.5 + 0.5*y/h;
    break;
    default:
      scl = scl;
    break;
  }
    
  let points = [];
  [shape, nP] = gS(sT, W, H, nP);
  nP = nP*res;
  
  // Draw
  push();
  translate(x,y)
  rotate(t);
  scale(scl);
  for (let i=0; i<nP; i++){
    let [ax,ay] = lP(shape, i/nP)
    let t = atan2(ay,ax);
    nD(2,1);
    switch (nM){
      default:
        n1 = 0.2 + 0.8*N(x/w,H*50/h,abs(t));
        nD(3,0.5);
        n2 = N(10*y/h,H/h,abs(t)*8);
      break;
      case 'circle':
        n1 = 0.2 + 0.8*N(x/w,H*50/h,abs(t));
        nD(3,0.5);
        n2 = 0.2+ 0.8*N(40*d1/cm)
      break;
      case 'dual':
        n1 = 0.34 + 0.2*N(50*d1/cm)+0.2*N(50*d2/cm);
        nD(3,0.5);
        n2 = N(10*y/h,H/h,abs(t)*8);
      break;
      case 'vertical':
        n1 = 0.2 + 0.8*N(50*y/h,abs(t));
        nD(3,0.5);
        n2 = N(10*y/h,H/h,abs(t)*8);
      break;
    }

    let dx = ax * (h0 + h1*n1 + h2*n2);
    let dy = ay * (h0 + h1*n1 + h2*n2);

    points[i] = cV(dx,dy);
  }
  dR(points,cm,0);
  
  let nShapes = 3;
  let nShapePoints = 4;
  for (let j=0; j<nShapes; j++){
    fill(hue(c),S(c)+r2(-1,1)/20,B(c)+r2(-1,1)/20,1);
    let pointsIn = [];
    pointsIn[0] = cV(0,0);
    for (let k=1; k<nShapePoints; k++){
      let ip = F(r(points.length));
      pointsIn[k] = cV(points[ip].x, points[ip].y);
    }
    dR(pointsIn,cm,0);
  }

  pop();
}

// Textures
function T() {
  let o = r([true,false]);
  let dx = cm/100;
  let dy = cm/100;
  let b = B(P[0]) + r([-0.2,0.2]);

  for (let x=0; x<w; x+=dx){
    for (let y=0; y<h; y+=dy){
      sW = r2(0.6,1)*min(dx,dy)/4;
      strokeWeight(sW)
      noFill();
      let dL = r2(0.4,0.7);
      colorMode(HSB,1)
      stroke(C(hue(P[0]),
                   S(P[0]),
                   b,
                   N(x/cm,y/cm)*0.05))
      line(x,y,x+dL*dx,y+dL*dy)
      if (o) {
        line(x,y,x-dL*dx,y+dL*dy)
        line(x,y,x+dL*dx,y-dL*dy)
      }
      stroke(C(0,0,1,r()>0.5?0.02:0))
      point(x + r(dx*dL/3),y + r(dy*dL/3))
    }
  }
}
function sG() {
  let p = 10;
  loadPixels();
  for (let i=0; i<pixels.length; i+=4){
    let dp = r2(-1,1)*p;
    pixels[i+0] += dp;
    pixels[i+1] += dp;
    pixels[i+2] += dp;
  }
  updatePixels();
}

// Geometry
function gL(){
  nx = F(r2(15,50));
  ny = F(nx*r2(0.75,1.5));
  [rmin, nF] = r([[ny/nx<1?0.8:1, 0],[0.8, 1],[r2(0.3, 1), r()]]);
  
  rM = r(['none','none','circle','dual','line']);
  sM = r(['none','wavy','random', 'sine','linear']);
  nM = r(['standard', 'vertical', 'grid']);
    cM = r()>0.98 ? 'mono' : r(['alternating','swatch','swatch','grid','circles','two','radial',r(['squares','square'])]);

  if (rM=='none' & r()>0.7){
    cM = r(['swatch','squares','square']);
    sM = 'none';
    rmin = 1;
    nF = 0;
  }
  
  if (rM == 'circle'){
    sM = r()>0.5 ?'circle' : sM;
    cM = r()>0.7 ? 'circles' : cM;
    nM = 'circle';
  }
  if (rM == 'dual'){
    sM = r()>0.7 ? 'dual' : sM;
    cM = r()>0.7 ? 'circles' : cM;
    nM = 'dual';
  }
  
  db = (r()>0.8) ? 0.05 : -0.05;
  
  return [rmin, nF, nx, ny, rM, sM, nM, cM, db]
}
function gSP(){
  sT = r()>0.4 ? 'stroke' : r(['circle','stroke']);
  nP = 30;
  res = 5;
  
  return [res, sT, nP]
}
function dR(p, r, s) {
  // Adapted from https://editor.p5js.org/davepagurek/sketches/AwgpGbabn
  beginShape();
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const c = p[(i + 2) % p.length];
    const ba = a.copy().sub(b).normalize();
    const bc = c.copy().sub(b).normalize();
    var T = ba.angleBetween(bc);
    T = isNaN(T) ? 0.01 : T;
    const maxR = (min(a.dist(b), c.dist(b)) / 2) * abs(sin(T / 2));
    const cR = min(r, maxR);
    var z = abs(cR / sin(T / 2));
    z = isNaN(z) ? 1 : z;
    const c1 = b.copy().add(ba.copy().mult(z));
    const c2 = b.copy().add(bc.copy().mult(z));
    const bD = 0.5523;
    const p1 = c1.copy().sub(ba.copy().mult(2 * cR * bD));
    const p2 = c2.copy().sub(bc.copy().mult(2 * cR * bD));
    vertex(c1.x, c1.y);
    bezierVertex(p1.x, p1.y, p2.x, p2.y, c2.x, c2.y);
  }
  endShape(CLOSE);
}
function lP(array, n){
  let n1 = F(n*array.length)%array.length;
  let n2 = (n1+1)%array.length;
  let p1 = n1/array.length;
  let p2 = n2/array.length;
  let i = (n-p1)/(p2-p1);
  let [x,y] = [lerp(array[n1].x, array[n2].x, i),
              lerp(array[n1].y, array[n2].y, i)]
  return [x,y]
}
function gS(sT, W, H, nP=30){
  let shape = [];
  switch (sT){
    case 'circle':
      nP = 30;
      for (let i=0; i<nP; i++){
        let t = TAU*i/nP;
        shape[i] = cV(W*cos(t)/2, H*sin(t)/2);
      }
    break;
    default:
      nP = 9;
      // Shape to base blotches on
      let s1 = r2(0.35,0.5);
      let s2 = r2(0.35,0.5);
      let s3 = r2(0.35,0.5);
      let s4 = r2(0.35,0.5);
      shape = [cV(-W*s1,-H*s1), // corner
               cV(0,-H/2), // side
               cV(W*s2, -H*s2), // corner
               cV(W/2, 0), // side
               cV(W*s3, H*s3), // corner
               cV(0, H/2), // side
               cV(-W*s4, H*s4), // corner
               cV(-W/2, 0), // side
               cV(-W*s1,-H*s1)];
    break;
  }
  return [shape, nP];
}
function gR(n){
  let x = w*round(r2(1,n-1))/n;
  let y = h*round(r2(1,n-1))/n;
  return [x,y]
}

// Colors
function getP(){
  let C = 'ACEFGHIJJKLLMNOP';
  let H = C.charAt(F(r(C.length)));
  let P = col(H);
  var cN = {
    A: 'Cocktails',
    B: 'Class Clown',
    C: 'Planets',
    D: 'Watermelon',
    E: 'Fall',
    F: 'Adobe',
    G: 'California Coast',
    H: 'Ellsworth',
    I: 'Wine Country',
    J: 'Einstein on the Beach',
    K: 'Twilight',
    L: 'Golden Hour',
    M: 'De Stijl',
    N: 'Midnight',
    O: 'Whanki',
    P: 'Algorithmic'
  }
  
  return [cN[H], P]
}
function col(H){
  let h = r([r(0.12),r(0.5,1)]);
  let dh = r([0,0,0.3,0.4,0.5,0.6])*r([-1,1]);
  var A = {
    A: // Cocktails
    ['#264653', '#E3D091', '#E9B44C', '#9B2915', '#2a9d8f'],
    B: // Class Clown
    ['#c7405f', '#f2a73d', '#60935D', '#222e50'],
    C: // Planets
    ['#ffbf70', '#f76f8e', '#96616b','#37505c'],
    D: // Watermelon
    ['#da2c38', '#226f54', '#87c38f', '#f0b67f'],
    E: // Fall
    ['#Fe5d26', '#F2C078', '#faedca', '#c1dbb3', '#7ebc89'],
    F: // Adobe
    ['#365359', '#AB5C48', '#EBB6B0', '#92B4A7'],
    G: // California Coast
    ['#4DA1B8', '#246B8C', '#D4B27D', '#5A8C49', '#386638', '#8C5549', '#8C5549', '#BA4836'],
    H: // Ellsworth
    ['#3D95BA', '#C44008', '#EBC12A', '#4A8A33', '#5C204D'],
    I: // Wine Country
    ['#4E634B','#88947C', '#88947C', '#B0C29F', '#E3BF9A', '#6B7E8F', '#b37f94'],
    J: // Einstein on the Beach
    r([['#25344D','#161d26', '#3C4654', '#ADB2BA', '#2D2D33', '#A39E98','#F5EFE1'], ['#A39E98','#ADB2BA','#000','#000']]),
    K: // Twilight
    ['#292666','#955BB5', '#DB4F87', '#145a9c'],
    L: // Golden Hour
    ['#596591','#9EBDF7', '#CEDDF0', '#F7B654', '#DE8D23', '#FCD497'],
    M: // De Stijl
    ['#B8352C', '#0254a1', '#ebab2d', '#fff', '#fff'],
    N: // Midnight
    ['#11151f','#323642','#473B3B','#302821','#1F261F'],
    O: // Whanki
    ['#465574', '#efd7ab', '#203272'],
    P: // random algorithmic
    r([
          [C((h+dh)%1,r2(0.3,0.7),r2(0.3,0.7)),
           C(h,r2(0.3,0.8),r2(0.3,0.9)),
           C(h,r2(0.3,0.8),r2(0.3,0.9)),
           C(h,r2(0.1,0.4),r2(0.6,1)),
           C(h,r2(0.5,0.9),r2(0.1,0.5)),
          ],
          [C((h+dh)%1,r2(0.3,0.7),r2(0.3,0.7)),
           C(h,r2(0.3,0.7),r2(0.3,0.8)),
           C(h,r2(0.3,0.7),r2(0.1,0.8)),
           C(h,r2(0.3,0.7),r2(0.3,0.8)),
          ],
      ]),
  };
  return shuffle(A[H]);
}

function dBG(){
  background(P[0]);
  nD(4,1);
  let nStains = round(r(20));
  let n = ceil(r2(5,20))
  for (let i=0; i<nStains; i++){
    let rRef = r2(cm/20,cm/3);
    push();
    translate(r(w),r(h));
    let dr = cm*r([r2(0.1,0.4),r2(0.01,0.04)]);
    let nK = 20;
    for (let k=0; k<nK; k++){
      let rMax = rRef + dr*k/nK;
      let pts = [];
      for (let j=0; j<n; j++){
        let a = TAU*j/n;
        let r = (0.01 + 0.9*N(10*j/n,i) + 0.2*N(k/nK,j/n))*rMax;
        let x = r*sin(a);
        
        let y = r*cos(a);
        pts[j] = cV(x,y);
      }
      noFill();
      strokeWeight(dr/r2(1,5));      
      stroke(C(hue(P[0])+0.02*N(k/nK),
                   S(P[0])-0.15*(B(P[0])<0.4 ? 1/2 : 1),
                   B(P[0])+0.05*(B(P[0])<0.4 ? 1/2 : 1),0.05*(1-k/nK)));
      dR(pts,cm,0);
      noStroke();
    }
    pop();
  }
  T();
}

function r(a=1){
  return random(a)
}
function r2(a,b){
  return random(a,b)
}
function N(a=0,b=0,c=0,d=0){
  return noise(a,b,c,d)
}
function cV(x,y){
  return createVector(x,y)
}
function C(h,s,b,a=1){
  return color(h,s,b,a)
}
function F(a){
  return floor(a)
}
function D(a,b,c,d){
  return dist(a,b,c,d)
}
function S(a){
  return saturation(a)
}
function B(a){
  return brightness(a)
}
function nD(a,b){
  noiseDetail(a,b)
}
function sC(){
  wW = windowWidth;
  wH = windowHeight;
  cx = wW/wH>4/5 ? wH*4/5: wW;
  cy = wW/wH>4/5 ? wH : wW*5/4;
  createCanvas(cx,cy);
  return min(cx,cy);
}