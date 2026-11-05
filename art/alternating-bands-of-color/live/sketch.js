function setup() {
  seed = ceil(fxrand()*1e9);
  randomSeed(seed);
  noiseSeed(seed);
  console.log(seed);
  cm = sC();
  sV = true;
  ww = width;
  hh = height;
  [H, nR, nS, MR, nC, mR, dV, rT, nO, BR] = P();
  hmc = col(H);
  bgc = rd(hmc);
  background(bgc);
  if (D=='A' & rd()>0.7){
      [dx,dy] = rd([[ww, hh],[ww/2, hh],[ww, hh/2],[ww/2, hh*rd([3,4])],[ww/3, hh]]);
    nO = rd([10,60]);
    for (let x=0; x<ww; x+=dx/2){
      for (let y=0; y<hh; y+=dy/2){
        bw = ['#fff', '#000'];
        NS();
        F(H=='M' ? '#000' : '#fff');
        for (let j=0; j<nO; j++){
          let cx = x + dx/2;
          let cy = y + dy/2;
          dxi = (1-j/nO)*dx/2;
          dyi = (1-j/nO)*dy/2;
          let sq = [vc(cx-dxi,cy-dyi),
                    vc(cx+dxi,cy-dyi),
                    vc(cx+dxi,cy+dyi),
                    vc(cx-dxi,cy+dyi)
                    ];
          if (nO>1){
            fc = N(x/ww,y/hh,j/nO)>0.5 && BW ? bw[j%bw.length] : hmc[j%hmc.length]
            F(fc)
          }
          dB(x,y,sq);
        }
      }
    }
  } else {
    for (let i=0; i<nS; i++){
      nV = rd(nC)
      C = rng(rT);
      s = nS>100 ? MR*r2(0.33,1) : MR;
      dS(nR, nV, C[0], C[1], 0, s*cm);
    }
  }
  if (rd()>0.1 & D!='A'){
    noFill();
    stroke(bgc);
    strokeWeight(cm/10);
    rect(0,0,ww,hh)
  }
  BGT();
  aG();
  T();
  fxpreview();
  
}

function col(H){
  const cT = {
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
    ['#4E634B','#88947C', '#88947C', '#B0C29F', '#E3BF9A', '#6B7E8F'],
    J: // Einstein on the Beach
    rd([['#25344D','#161d26', '#3C4654', '#ADB2BA', '#2D2D33', '#A39E98','#F5EFE1'], ['#A39E98','#ADB2BA','#000','#000']]),
    K: // Twilight
    ['#292666','#955BB5', '#DB4F87', '#145a9c'],
    L: // Golden Hour
    ['#596591','#9EBDF7', '#CEDDF0', '#F7B654', '#DE8D23', '#FCD497'],
    M: // De Stijl
    ['#B8352C', '#0254a1', '#ebab2d', '#fff', '#fff'],
    N: // Midnight
    ['#11151f','#323642','#473B3B','#302821','#1F261F']
  };
  return shuf(cT[H]);
}

function sC(){
  wW = windowWidth;
  wH = windowHeight;
  cx = wW/wH>5/4 ? wH*5/4 : wW;
  cy = wW/wH>5/4 ? wH : wW*4/5;
  createCanvas(cx,cy);
  return min(cx,cy);
}

function P(){
  let v = 'ABDEFGHHIJKLM';
  H = v.charAt(floor(rd(v.length)));
  v = 'ABCDEF';
  D = v.charAt(floor(rd(v.length)));
  BW = true;
  rT = 'a'
  nO = 4;
  sV = true;

  switch (D){
    case 'A': // Close
      Z = rd([
        [rd([20,25,30]), 1, 2, [1000], r2(0.8,0.9), 2],
        [80, 1, 2.5, [20,30], 0, 0],
      ]);
        rT = (rd()>0.2) ? 'oo' : rd(['c','o'])
      nO = 3;
      break;
    case "B": // Tumultuous
      Z = rd([
        [350, 5, 10, [4,9], -0.8, 0.1],
        [200, 5, 10, [4,9], -0.8, 0.08]
        ]);
      sV = false;
      rT = 'oo';
      nO = 2;
    break;
    case "C": // Reverb
      Z =
        rd([
        [100, 1, 2, [3,4,6], 0.8, 1000],
        [600, 1, 4, [3,4], 0.6, 600.2],
        [400, 1, 4, [3], 0.5, 12],
      ]);
      rT = rd(["c","i"]);
      break;
    case "D": // Tracks
      Z = rd([
        [rd([20,40,80]), 3, 5/4, [6], 1, 0],
        [30, 30, 2.5, [3], 1, 0],
        ]);
      rT = 'o';
      if (rd()>2/3){
        Z = [100, 3, 3, [5,4], 0.85, 0];
      rT = 'f';
      }
      nO = 1;
      break;
    case "E": // Topsy Turvy
      Z =
        rd([
        [100, 1, 5, [8], -0.2, 0.4],
        [400, 3, 5, [8], -0.5, 1],
        [200, 10, 3, [6,8], -0.1, 0.4]
        ]);
      sV = false;
      rT = rd()>0.8 ? 'c' : 'O';
      if (rd()>0.7){
        Z[5]=1;
        rT = 'oo'
      }
      if (rd()>0.8){
        Z = rd([
          [500, 1, 6, [22], 0.3, 0.5],
          [400, 1, 6, [60], 0.3, 0.4]
          ]);
        rT = 'f'
      }
      break;
      case "F": // Calm
      Z = rd([
        [400, 3, 3, [8], -0.2, 1],
        [400, 1, 2, [90], 0.5, 20],
        [400, 4, 2.5, [3], 0.5, 4],
        [20, 8, 4, [3], 0.4, 0],
        [400, 2, 3.7, [12], -0.3, 0.5],
        [400, 2, 4.5, [22], -0.3, 0.3],
        ]);
      rT = 'oo'
      sV = false
      nO = 2;
      
      if (rd()>0.9){
        Z = [400, 3, 3.5, [12], 0.5, 4];
        H = 'N'?'H':H;
        rT = 'f'
        sV = true
      }
      break;
  }
  [nR, nS, MR, nC, mR, dV] = Z;
  return [H, nR, nS, MR, nC, mR, dV, rT, nO, BW]
}
    
function sv(n, R=1, s=1){
  v = [];
  r = [];
  for (i=0; i<n; i++){
    a = i*TAU/n + TAU/n * N(i,s);
    f = (N(i,s+1,dV*R/cm));
    sc = (mR + (1-mR)*f);
    r[i] = R*sc;
    v[i] = vc(r[i]*sin(a), r[i]*cos(a));
  }
  return sV ? CW(v) : v
}

function dB(x,y,vN){
  push();
  translate(x,y);
  dR(vN,cm,1)
  pop();
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
    const T = ba.angleBetween(bc);
    const maxR = (min(a.dist(b), c.dist(b)) / 2) * abs(sin(T / 2));
    const cR = min(r, maxR);
    const z = abs(cR / sin(T / 2));
    const c1 = b.copy().add(ba.copy().mult(z));
    const c2 = b.copy().add(bc.copy().mult(z));
    var bD = 0.5523;
    const p1 = c1.copy().sub(ba.copy().mult(2 * cR * bD));
    const p2 = c2.copy().sub(bc.copy().mult(2 * cR * bD));
    vertex(c1.x, c1.y);
    bezierVertex(p1.x, p1.y, p2.x, p2.y, c2.x, c2.y);
  }
  endShape(CLOSE);
}

function dS(nO, nV, x, y, rmin=0 ,rmax=cm){
  s = (rT == 'o' | rT == 'c') ? 0 : rd();
  for (j=0; j<nO; j++){
    r = rmin + (rmax-rmin)*(1-(j/nO))
    v = sv(nV, r, s)
    bw = ['#fff', '#000']
    c = hmc;
    NS();
    fc = N(x/ww,y/hh,j/nO)>0.5 && BW ? bw[j%bw.length] : c[j%c.length]
    fc = fc==bgc && nR < 3 ? c[(j+1)%c.length] : fc;
    fc = (D=='D' & nR<4? j==0 ? '#fff' : bgc : fc)
    if (D=='F'){
      fc = LC(c,j/nO);
    }
    F(fc);
    if (D=='B' | (D=='A' && mR < 0)){
      strokeWeight(cm/50)
      S(fc);
    }
    dB(x,y,v)
  }
}

function BG(){
  dx = cm/100; dy = cm/100;
  for (x=0; x<ww; x+=dx){
    for (y=0; y<hh; y+=dy){
      rectMode(CENTER);
      F(L(rd(hmc)));
      NS();
      push();
      translate(x,y);
      rect(0,0,dx,dy)
      pop();
    }
  }
}

function shuf(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = floor(rd() * (i + 1));
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  n = (D=="C") ? 4 : ((rd()>0.5) ? round(r2(2,a.length)) : a.length)
  n = (H=="M" | "K" | "L") ? a.length : n;
  n = (D=="F") ? round(r2(3,a.length)) : n;
    
  b = [];
  for (i=0; i<n; i++){
    b[i] = a[i];
  }
  return b
}

function rng(rT){
  let RT = {
    a: [r2(-1/3,4/3), r2(-1/3,4/3)],
    O: rd([[r2(-0.2,0),
            r2(-0.2,1.2)],
           [r2(1,1.2),
            r2(-0.2,1.2)],
           [r2(-0.2,1.2),
            r2(-0.2,0)],
           [r2(-0.2,1.2),
            r2(1,1.2)]
          ]),
    o: [round(rd(nO))/nO, round(rd(nO))/nO],
    c: [1/2,1/2],
    oo: rd([
           [-0.2, 0.5],
           [0.5, -0.2],
           [0.5, 1.2],
           [1.2, 0.5]
           ]),
    i: [r2(0.2,0.8), r2(0.2,0.8)],
    f: [rd([-1, 2]), rd([-1, 2])]
    }
  let [x,y] = RT[rT];
  return [x*ww,y*hh]
}

function aG() {
  p = 10;
  loadPixels();
  for (i=0; i<pixels.length; i+=4){
    dp = r2(-1,1)*p;
    pixels[i+0] += dp;
    pixels[i+1] += dp;
    pixels[i+2] += dp;
  }
  updatePixels();
}

function BGT() {
  let o = rd([true,false]);
  dx = cm/100;
  dy = cm/100;
  bgtc = rd([0.33,0.5,0.67]);
  for (x=0; x<ww; x+=dx){
    for (y=0; y<hh; y+=dy){
      sW = r2(0.6,1)*min(dx,dy)/4;
      strokeWeight(sW)
      noFill();
      dL = r2(0.4,0.7);
      colorMode(HSB,1)
      S(color(hue(bgc),
              saturation(bgc)<0.1? 0 : 0.5, bgtc, N(x/ww,y/hh)*0.05))
      line(x,y,x+dL*dx,y+dL*dy)
      if (o) {
        line(x,y,x-dL*dx,y+dL*dy)
        line(x,y,x+dL*dx,y-dL*dy)
      }
      S(color(0,0,1,rd()>0.5?0.02:0))
      point(x + rd(dx*dL/3),y + rd(dy*dL/3))
    }
  }
}

function CW(v){
  // Sorts an array of vectors clockwise around its geometric mean
  
  let V = [];
  let a = [];
  let r = [];
  let x = 0;
  let y = 0;

  // get centers
  for (let i=0; i<v.length; i++){
    x += v[i].x;
    y += v[i].y;
  }
  c = vc(x/v.length, y/v.length);
  
  for (let i=0; i<v.length; i++){
    vt = vc(v[i].x - c.x,
            v[i].y - c.y);

    a[i] = vt.heading();
    r[i] = dist(v[i].x,v[i].y,c.x,c.y)
    
    V[i] = [a[i], r[i], v[i].x, v[i].y]
    
  }
  
  let nv = V.sort(function(a,b) {
    return a[0] - b[0];
    });
  
  V = [];
  for (let i=0; i<nv.length; i++){
    V[i] = vc(nv[i][2],nv[i][3]);
  }
  
  return V
}

function LC(array, n){

  c1 = floor(n*array.length)%array.length;
  c2 = (c1+1)%array.length;
  p1 = c1/array.length;
  p2 = c2/array.length;
  i = (n-p1)/(p2-p1);
  c = lerpColor(color(array[c1]), L(array[c2]), i)
  return c
  
}

function rd(a=1){
  return random(a);
}
function r2(a=0,b=1){
  return random(a,b);
}
function vc(a,b){
  return createVector(a,b)
}
function N(a=0,b=0,c=0){
  return noise(a,b,c)
}
function F(a){
  fill(a)
}
function S(a){
  stroke(a)
}
function NS(){
  noStroke()
}
function L(a){
  return color(a)
}
function T(){
  TD = {
    A: 'Close',
    B: 'Tumultuous',
    C: 'Reverb',
    D: 'Tracks',
    E: 'Topsy Turvy',
    F: 'Calm'
  }
  TH = {
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
    N: 'Midnight'
  }
  window.$fxhashFeatures = {
    "Colors": TH[H],
    "Style": TD[D]
  }
  console.log(TD[D], TH[H])
}
