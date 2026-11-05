// Blobs
// John Rising 2022

function setup() {
  // Set up
  colorMode(HSB, 1);
  cm = floor(min(windowWidth, windowHeight));
  cm = max(min(cm, 1e4), 256); // restrict canvas size to ensure pixel collision checking works
  S = floor(fxrand()*1e10);
  randomSeed(S);
  noiseSeed(S);
  console.log("seed = " + S);

  // Canvas dimensions
  C = random(["5:4", "9:16", "16:9"]);
  if (C == "5:4") {
    D = [1, 4/5];
  }
  if (C == "9:16") {
    D = [9 / 16, 1];
  }
  if (C == "16:9") {
    D = [1, 9 / 16];
  }
  createCanvas(cm * D[0], cm * D[1]);
  cW = width;
  cH = height;

  // Set parameters
  [sM, cM, F, H, G, J, bgh, bgs, bgb, n, R, wR, hR, P] = params();

  // Draw background
  bgc = color(bgh, bgs, bgb);
  background(bgc);
  
  if (random()>0.7 && sM=="large"){
    bgc = color('#' + random(hmc))
    bgc = color(hue(bgc), 0.6, 0.4)
    background(bgc);
  }

  // Create foreground canvas
  fg = createGraphics(cW, cH);
  fg.fill(bgc);
  fg.noStroke();

  // Draw each shape
  for (let i = 0; i < n; i++) {
    x = random(wR[0], wR[1]);
    y = random(hR[0], hR[1]);
    
    // Only draw large shape in center of canvas if square
    if (sM == "large") {
      x = random([random(wR[0], cW * 0.4), random(cW * 0.6, wR[1])]);
      y = random([random(hR[0], cH * 0.4), random(cH * 0.6, hR[1])]);
      if (random() > 0.7 && C == "5:4") {
        x = cW / 2;
        y = cH / 2;
      }
      if (random()>0.6 && C == "9:16"){
        y = random([hR[0], hR[1]]);
      }
      if (random()>0.6 && C == "16:9"){
        x = random([wR[0], wR[1]]);
      }
    }
    
    // draw shape using a function instead of creating shape objects for no good reason
    index = i;
    drawShape(x, y, R[0] * cm, R[1] * cm);
  }

  // Write to main canvas
  image(fg, 0, 0);

  window.$fxhashFeatures = {
    "Canvas": C,
    "Frame": F,
    "Shape Mode": sM,
    "Colors": H,
    "Perfection": P,
  }

  // Frame
  sw = cm / 40;
  noFill();
  strokeWeight(sw);
  if (F == "background") {
    stroke(bgc);
    rect(sw / 2, sw / 2, cW - sw, cH - sw);
  }
  
  if (!P) {drawBGtexture()}
  
  addGrain();
  
  fxpreview();
}

function mouseClicked() {
  saveCanvas(S.toString(), "png");
}

function drawRounded(p, r, img, s) {
  // Adapted from https://editor.p5js.org/davepagurek/sketches/AwgpGbabn
  // This draws a bezier shape with control points of equal length on the corner of a polygon.
  B = []; // vector of points along bezier curve
  img.beginShape();
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const c = p[(i + 2) % p.length];
    const ba = a.copy().sub(b).normalize();
    const bc = c.copy().sub(b).normalize();
    const T = ba.angleBetween(bc);

    // Find the circle radius that would cause us to round off half of the shortest edge
    const maxR = (min(a.dist(b), c.dist(b)) / 2) * abs(sin(T / 2));
    const cR = min(r, maxR);
    // Find the distance away from the corner that has a distance z of 2*cR between the edges
    const z = abs(cR / sin(T / 2));

    // Anchor points
    const c1 = b.copy().add(ba.copy().mult(z));
    const c2 = b.copy().add(bc.copy().mult(z));
    
    // Bezier distance per https://stackoverflow.com/a/27863181, but add a little spice
    var bD = 0.5523;
    switch (cM) {
      case "circle":
        bD = 0.5523 - 0.1 + 0.1 * noise(i / 2, s);
        break;
      case "all":
        bD = 0.3 + 0.5 * noise(i, s);
        break;
    }
    
    // Control points
    const p1 = c1.copy().sub(ba.copy().mult(2 * cR * bD));
    const p2 = c2.copy().sub(bc.copy().mult(2 * cR * bD));
    img.vertex(c1.x, c1.y);
    img.bezierVertex(p1.x, p1.y, p2.x, p2.y, c2.x, c2.y);
    
    // interpolated points along curve for determining interior
    if (!P){
      np = 20;
      for (let j=0; j<np; j++){
        let X = bezierPoint(c1.x, p1.x, p2.x, c2.x, j/np)
        let Y = bezierPoint(c1.y, p1.y, p2.y, c2.y, j/np)
        B.push(createVector(X,Y));
      }
    }
  }
  img.endShape(CLOSE);
  return B;
}

function createShape(cx, cy, rMax, iM, rot) {
  // Initialize
  s = [];
  a = 0;
  noiseDetail(6, 0.5);

  // Create points
  
  for (i = 0; i < iM; i++) {
    a = map(i, 0, iM, 0, TAU) + (J ? (noise(cx/width, cy/height, iM) * TAU) / iM : 0); // angle
    r = rMax * noise(cx/width, cy/height, a);// radial position
    s[i] = createVector(
      0 + r * sin(a), // x
      0 + r * cos(a)  // y
    );
  }
  
  for (i=0;i<s.length;i++){
    s[i].rotate(rot)
    s[i].add(createVector(cx,cy))
  }
  
  return s;
}

function isOverlapping(pO, pN, d) {
  // pO and pN must have same pixel density, width, and height
  overlap = false;
  pixelLoop: for (let i = 0; i < pO.length; i += 4) {
    // check for collisions in alpha channel
    if (pO[i + 3] > 0 && pN[i + 3] > 0) {
      overlap = true;
      break pixelLoop;
    }
  }
  return overlap;
}

function drawShape(x, y, rm, rM) {
  fg.loadPixels();

  // Shape color
  bc = color(bgh, bgs, bgb, 0.001);
  c = color('#' + hmc[index%hmc.length]);

  // Shape properties
  iM = floor(random(3, 6)); // number of corners
  //iM = (J && sM!="tight") ? random([iM,8]) : iM;
  ns = random(10); // local random seed
  
  // Draw shape with successively bigger dimensions on temporary img canvas.
  img = createGraphics(fg.width, fg.height);
  img.noStroke();
  rot = noise(x/width,y/width)*TAU;
  
  expand: for (t = 0; t < nt; t++) {
    
    // outline
    img.fill(bc);
    img.noStroke();
    r = map(t, 0, nt, rm, rM) + G * cm;
    s = createShape(x, y, r, iM, rot);
    drawRounded(s, cm, img, ns);
    
    // fill
    img.fill(c);
    img.noStroke();
    r = map(t, 0, nt, rm, rM);
    s = createShape(x, y, r, iM, rot);
    B = drawRounded(s, cm, img, ns);
    
    // Write to image if no overlap detected
    img.loadPixels();
    if (isOverlapping(fg.pixels, img.pixels, pixelDensity())) {
      break expand;
    } else {
      fg.image(img, 0, 0);
      // add interior
      if (!P){paintify(fg,x,y,B,c,r)}
    }
  }
  
  img.clear();
}

function params() {
  // Is the background light or dark
  [bgb, bgs] = random([
                      [0.07, 0.9],
                      [1, 0.03]]);
  // Jumble corners?
  J = random([true, false]);
  
  // Paint effect
  P = random()>0.8 ? true : false;
  
  // Growth rings
  nt = 10;

  // Select palette
  H = random(["Cocktails",
              "Cocktails",
              "Class Clown",
              "Planets",
              "Watermelon",
              "Fall",
              "Adobe",
              "California Coast",
              "Sierras",
              "Ellsworth",
              "Ellsworth",
              "Wine Country"]);

  // Set shape options
  sM = random(["normal", "large"]);
  if (random() > 0.9) {
    sM = random(["align", "strip"]);
  }
  if (random() > 0.8) {
    sM = "tight";
  }
  cM = random(["circle", "all"]);
  F = random(["background", "none"]);
  
  // Choose palette
  switch (H){
    case "Cocktails":
      hmc =  ['264653', 'E3D091', 'E9B44C', '9B2915', '2a9d8f'];
      break;
    case "Class Clown":
      hmc = ['c7405f', 'f2a73d', '60935D', '222e50'];
      break;
    case "Planets":
      hmc = ['ffbf70', 'f76f8e', '96616b','37505c'];
      break;
    case "Watermelon":
      hmc = ['da2c38', '226f54', '87c38f', 'f0b67f'];
      break;
    case "Fall":
      hmc = ['F2711B','1C6270','9ABCA7','B88932'];
      break;
    case "Adobe":
      hmc = ['365359', 'AB5C48', 'EBB6B0', '92B4A7'];
      break;
    case "California Coast":
      hmc = ['4DA1B8', '246B8C', 'D4B27D', '5A8C49', '386638', '8C5549', '8C5549', 'BA4836'];
      break;
    case "Sierras":
      hmc = ['8C5549', '4C7047', 'C9BEB3', '747E80', 'A5AD79', '4C5753', '6B818F'];
      break;
    case "Ellsworth":
      hmc = ['3D95BA', 'C44008', 'EBC12A', '4A8A33', '5C204D'];
      break;
    case "Wine Country":
      hmc = ['4E634B', '88947C', 'B0C29F', 'BDA48C', 'C9AB8D', 'E3BF9A', '8F6173','8F6173', '6B7E8F'];
    break;
  }
  

  bgh = hue('#' + random(hmc));

  // Gap between shapes relative to cm
  G = random([
              0.00,
              0.02,
              0.08,
              0.20,
    ]);

  // How to fill canvas with shapes
  switch (sM) {
    case "normal": // Small to big
      n = 20
      R = [0.1, 0.9];
      wR = [0, cW];
      hR = [0, cH];
      break;
    case "large": // Mid to bigger
      n = 8;
      R = [0.3, 1];
      wR = [0, cW];
      hR = [0, cH];
      break;
    case "tight": // Bunch of little shapes
      n = 150;
      R = [0.05, 0.9];
      wR = [0.1 * cW, 0.9 * cW];
      hR = [0.1 * cH, 0.9 * cH];
      break;
    case "align": // Draw shapes on centerlines
      n = 200;
      R = [0.1, random(0.2, 0.4)];
      if (C == "5:4") {
        wR = [0, cW];
        hR = [cH / 2, cH / 2];
        if (random() > 1 / 2) {
          wR = [cW / 2, cW / 2];
          hR = [0, cH];
        }
      }
      if (C == "9:16") {
        wR = [cW / 2, cW / 2];
        hR = [0, cH];
      }
      if (C == "16:9") {
        wR = [0, cW];
        hR = [cH / 2, cH / 2];
      }
      break;
    case "strip": // Draw shapes on strip
      n = 200;
      R = [0.05, 0.2];
      G = random([G, 0]);
      sW = random([0.1, 0.2]);
      if (C == "5:4") {
        wR = [0, cW];
        hR = [cH * (1 / 2 - sW), cH * (1 / 2 + sW)];
        if (random() > 1 / 2) {
          wR = [cW * (1 / 2 - sW), cW * (1 / 2 + sW)];
          hR = [0, cH];
        }
      }
      if (C == "9:16") {
        wR = [cW * (1 / 2 - sW), cW * (1 / 2 + sW)];
        hR = [0, cH];
      }
      if (C == "16:9") {
        wR = [0, cW];
        hR = [cH * (1 / 2 - sW), cH * (1 / 2 + sW)];
      }
      break;
  }
  

  // Display properties in console for troubleshooting
  console.log("canvas = " + C);
  console.log("frame = " + F);
  console.log("shapeMode = " + sM);
  console.log("colors = " + H);
  console.log("cornerMode = " + cM);
  console.log("gap = " + G);
  console.log("jumble = " + J);
  console.log("perfection = " + P)

  return [sM, cM, F, H, G, J, bgh, bgs, bgb, n, R, wR, hR, P];
}

function addGrain() {
    
  // uniform graininess
  p = 10;
  loadPixels();
  for (i=0; i<pixels.length; i+=4){
    dp = random([-1,0,1])*random(p);
    pixels[i+0] += dp;
    pixels[i+1] += dp;
    pixels[i+2] += dp;
  }
  updatePixels();
}

function drawBGtexture() {
  let o = random([true,false]);
  dx = cm/100;
  dy = cm/100;
  for (x=0; x<width; x+=dx){
    for (y=0; y<height; y+=dy){
      sW = random(0.6,1)*min(dx,dy)/4;
      strokeWeight(sW)
      noFill();
      if (noise(x/width,y/height)>0.0) {
        dL = random(0.4,0.7);
        stroke(color(0,0,0.95-bgb,noise(x/width,y/height)*0.02))
        line(x,y,x+dL*dx,y+dL*dy)
        if (o) {
          line(x,y,x-dL*dx,y+dL*dy)
          line(x,y,x+dL*dx,y-dL*dy)
        }
        stroke(color(0,0,1,random()>0.5?0.02:0))
        point(x + random(dx*dL/3),y + random(dy*dL/3))
      }
    }
  }
  
}

function paintify(fg, x, y, B, c, R){
  
  // Center texture
  nS = 100;
  m = random([1,2,3])
  for (let i = 0; i < nS; i++){
    fg.fill(color(hue(c)+m*random(-0.01,0.01), saturation(c)+m*random(-0.05,0.05), brightness(c)+m*random(-0.08,0.08), 0.03))
    fg.noStroke();
    pt = [];
    for (let j = 0; j < 6; j++){
      [X, Y] = getRandomPoint(x,y,B)
      pt[j] = createVector(X,Y);
    }
    drawRounded(pt, cm, fg, 1)
  }
  
  // Edges
  /**
  if (R>0.10*cm & random()>0.5){
    nE = 2;
    for (let i = 0; i < nE; i++){
      m  = random([0,1])*max(cm/1500,R/400);
      fg.beginShape();
      jStart = floor(random(B.length));
      for (let j = jStart; j < B.length+jStart; j++){
        fg.noFill();
        fg.strokeWeight(2*m);
        fg.stroke(c);
        X = (B[j%B.length].x + B[(j+1)%B.length].x)/2 + random(-1,1)*m/2;
        Y =(B[j%B.length].y + B[(j+1)%B.length].y)/2 + random(-1,1)*m/2;
        fg.curveVertex(X,Y)
        }
      fg.endShape(CLOSE);
    }
  }
  **/
}

function getRandomPoint(x,y,B){
  // Random point inside blob
  k = floor(random(B.length));
  r = random(0.3,1);
  X = lerp(x, B[k].x, r);
  Y = lerp(y, B[k].y, r);
  return [X,Y]
}

function pArray(img, nPixels){
  let t = createGraphics(nPixels*D[0], nPixels*D[1]);
  t.image(img, 0, 0, t.width, t.height);
  t.loadPixels();
  return t.pixels
}

