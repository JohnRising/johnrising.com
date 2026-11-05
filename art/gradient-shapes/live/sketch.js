function setup() {
  seed = fxrand()*1e10;
  randomSeed(seed);
  noiseSeed(seed);
  minDim = min(windowWidth, windowHeight);
  minDim = floor(minDim/10)*10;
  createCanvas(minDim, minDim, WEBGL);
  w = width;
  h = height;
  imageMode(CENTER);
  rectMode(CORNERS);
  colorMode(HSB, 1);

  angle = PI * random([0, 0.25]);
  o = createGraphics(w, h);

  maskType = random(["circle", "full", "old-tv"]);
  patternType = random(["stripes","circles","squares","kiss","taijitu","taijitu","lines","pills"]);
  if (random()>0.95){patternType="grid"}
  switch (patternType) {
    case "stripes":
      angle = (PI * floor(random() * 16)) / 8;
      break;
    case "circles":
      maskType = random(["circle", "full"]);
      break;
    case "squares":
      maskType = "full"
      break;
    case "grid":
      maskType = random(["circle", "old-tv"]);
      break;
    case "kiss":
      maskType = random(["old-tv","circle","full"])
    case "taijitu":
      break;
    case "lines":
      maskType = "full"
      break;
    default:
      break;
  }
  switch (maskType) {
    case "circle":
      o.circle(w / 2, h / 2, 0.8 * w);
      break;
    case "rounded-square":
      o.square(0.1 * w, 0.1 * h, 0.8 * w, 0.2 * w);
      break;
    case "old-tv":
      let skewness = random([0,0,0,4]); 
      let minR = w*0.45
      if (skewness>0 && patternType !== "taijitu"){minR = w*0.2}
      drawCurvedShape(o,w/2,h/2,w*0.45,minR,4,1,1,true,skewness)
      break;
    case "full":
      o.rect(0.05*w,0.05*h,0.9*w,0.9*h)
      if (patternType!=="square") {o.rect(0,0,w,h)}
      break;
    default:
      o.rect(0, 0, w, h);
      break;
  }
  drawMasks(patternType);

  animate = true;

  [dc1, dc2, dc3, dc4] = random([
    [0, 0, 0, 0],
    [0, 0.25, 0.5, 0.75],
  ]);

  db1 = db2 = db3 = db4 = 0;
  ds1 = ds2 = ds3 = ds4 = 0;
  s1 = s2 = s3 = s4 = 1;
  b1 = b2 = b3 = b4 = 1;
  bt = st = 0;

  // Set hues
  h0 = random();
  dh = random([0.125, 0.2, 0.5, 0.625]);
  dh1 = random([1/3, 0.5, 1]);
  dh2 = random([1/3, 0.5, 1]);
  dh3 = random([1/3, 0.5, 1]);
  dh4 = random([1/3, 0.5, 1]);
  if (random()>0.9){
    dh1=dh2=-0.5;dh3=dh4=0.5
  }
  // Set saturation and brightness
  mood = random([
    "chill",
    "chill",
    "intense",
    "intense",
    "broody",
    "noir",
    "monochrome",
    "linear",
    "subtle"
  ]);
  switch (mood) {
    case "chill":
      s1 = s2 = s3 = s4 = random(0.35,0.55)
      b1 = b2 = b3 = b4 = random(0.8,1)
      bt = 0;
      st = 0;
      break;
    case "intense":
      s1 = s2 = s3 = s4 = 1;
      b1 = b2 = b3 = b4 = 1;
      bt = 0;
      st = 0;
      break;
    case "broody":
      s1 = s2 = s3 = s4 = 1;
      b1 = b2 = b3 = b4 = 0.3;
      bt = st = 0;
      break;
    case "noir":
      s1 = s2 = s3 = s4 = 0;
      b1 = random();
      b2 = random();
      b3 = random();
      b4 = random();
      db1 = 5 * dh1;
      db2 = 5 * dh2;
      db3 = 5 * dh3;
      db4 = 5 * dh4;
      bt = 1;
      st = 0;
      break;
    case "monochrome":
      b1 = b2 = b3 = b4 = 1;
      s1 = random();
      s2 = random();
      s3 = random();
      s4 = random();
      ds1 = 5 * dh1;
      ds2 = 5 * dh2;
      ds3 = 5 * dh3;
      ds4 = 5 * dh4;
      db1 = db2 = db3 = db4 = 3;
      dh = dh1 = dh2 = dh3 = dh4 = 0;
      dc1 = dc2 = dc3 = dc4 = 0;
      bt = 1;
      st = 1;
      break;
    case "linear":
      s1 = s2 = s3 = s4 = 0.8;
      b1 = b2 = b3 = b4 = 0.8;
      dh4 = dh3 = random();
      dh2 = dh1 = random();
      break;
    case "subtle":
      s1 = s2 = s3 = s4 = random([0.5,1]);
      s1 = s2 = 0.5;
      b1 = b2 = b3 = b4 = 1;
      bt = 0;
      st = 0;
      if (random()>0.5){
        dc1=dc4=0.5;dc2=0;dc3=0.0;
      } else {
        dc1=dc3=0.5;dc2=0;dc4=0.1;
      }
      dh1=dh2=dh3=dh4=1
      dh = 0;
      break;
    default:
      s1 = s2 = s3 = s4 = random(0.35,0.55)
      b1 = b2 = b3 = b4 = random(0.8,1)
      bt = 0;
      st = 0;
      break;
  }
  rot = random([1/60,0.1])
  rotDir1 = random([-1,1]);
  rotDir2 = random([-1,1]);
  hdir = random([-1,1]);
  
  window.$fxhashFeatures = {
  "Mask": maskType,
  "Pattern": patternType,
  "Style": mood,
  }
  
}

function draw() {
  //background("rgba(30.6,30.6,30.6,1)")
  //m.background("rgba(30,30,30,0)")
  //n.background("rgba(30,30,30,0)")
  if (animate) {
    t = millis() / 1e4;
    angle = TAU*(t * rot + 1/8);

    // Draw gradient for pattern 1 ("p")
    c1 = color(
      abs(h0 + hdir*t * dh1 + dc1) % 1,
      s1 + st * sin(t * ds1),
      b1 + bt * sin(t * db1)
    );
    c2 = color(
      abs(h0 + hdir*t * dh2 + dc2) % 1,
      s2 + st * cos(t * ds2),
      b2 + bt * cos(t * db2)
    );
    c3 = color(
      abs(h0 + hdir*t * dh3 + dc3) % 1,
      s3 + st * sin(t * ds3),
      b3 + bt * sin(t * db3)
    );
    c4 = color(
      abs(h0 + hdir*t * dh4 + dc4) % 1,
      s4 + st * cos(t * ds4),
      b4 + bt * cos(t * db4)
    );
    drawGradient(p, rotDir1*angle, c1, c2, c3, c4);

    // Draw gradient for pattern 2 ("q")
    c1 = color(
      abs(h0 + hdir*t * dh1 + dc1 + dh) % 1,
      s1 + st * cos(t * dh1),
      b1 + bt * cos(t * db1)
    );
    c2 = color(
      abs(h0 + hdir*t * dh2 + dc2 + dh) % 1,
      s2 + st * sin(t * ds2),
      b2 + bt * sin(t * db2)
    );
    c3 = color(
      abs(h0 + hdir*t * dh3 + dc3 + dh) % 1,
      s3 + st * cos(t * dh3),
      b3 + bt * cos(t * db3)
    );
    c4 = color(
      abs(h0 + hdir*t * dh4 + dc4 + dh) % 1,
      s4 + st * sin(t * ds4),
      b4 + bt * sin(t * db4)
    );

    if (dh !== 0) {
      drawGradient(q, rotDir2*angle, c1, c2, c3, c4);
    } else {
      drawGradient(q, rotDir2*angle, c3, c4, c1, c2);
    }

    // Apply masks
    mask(m, p, r);
    mask(n, q, r);
    mask(o, r);
  }
  
}

function drawGradient(p, angle, c1, c2, c3, c4) {
  p.push();
  p.rotate(angle);
  p.beginShape();
  p.fill(c1);
  p.vertex(-w, -h);
  p.fill(c2);
  p.vertex(w, -h);
  p.fill(c3);
  p.vertex(w, h);
  p.fill(c4);
  p.vertex(-w, h);
  p.endShape(CLOSE);
  p.pop();
}

function drawGradientStrip(angle, x0, y0, x1, y1, c1, c2, c3, c4) {
  push();
  translate(x0, y0);
  rotate(angle);
  beginShape();
  fill(c1);
  vertex(0, 0);
  fill(c2);
  vertex(x1, 0);
  fill(c3);
  vertex(x1, y1);
  fill(c4);
  vertex(0, y1);
  endShape(CLOSE);
  pop();
}

function mask(m, p, o) {
  m.drawingContext.globalCompositeOperation = "source-in";
  m.image(p, 0, 0);
  try {
    o.image(m, 0, 0);
  } catch (err) {
    image(m, 0, 0);
  }
}

function drawMasks(patternType) {
  m = createGraphics(w, h);
  n = createGraphics(w, h);
  r = createGraphics(w, h);
  p = createGraphics(w, h, WEBGL);
  q = createGraphics(w, h, WEBGL);
  
  m.push();
  m.translate(w / 2, h / 2);
  m.rotate(angle);
  n.push();
  n.translate(w / 2, h / 2);
  n.rotate(angle);

  switch (patternType) {
    case "stripes":
      nS = random([1.5, 3, 4.5, 10, 20,100]);
      dx = w / nS;
      i = 0;
      for (x = -w; x < 2 * w; x += dx) {
        if (i % 2) {
          m.rectMode(CENTER);
          m.rect(x, 0, dx, 2 * h);
        } else {
          n.rectMode(CENTER);
          n.rect(x, 0, dx, 2 * h);
        }
        i++;
      }
      break;
    case "circles":
      yPos = h/2//
      m.background(color(0,0,0,0))
      nS = random([3, 5, 10, 20, 50]);
      sw = (0.5 * w) / nS + 0.5;
      dim = (0.25 * w) / nS;
      if (random() > 0.5 && nS > 40) {
        dim = dim * 4;
      }
      dx = random([-dim, 0, 0, 0, 0, 0, dim]);
      dy = random([-dim, 0, 0, 0, 0, 0, dim]);
      i = 0;
      for (z = 0; z < 3 * nS; z++) {
        rad = w * (1 - (z + 1) / nS) + 0.1;
        if (i % 2) {
          m.noFill();
          m.strokeWeight(sw);
          m.circle(0, 0, rad);
        } else {
          n.noFill();
          n.strokeWeight(sw);
          n.circle(dx, dy, rad);
        }
        i++;
      }
      break;
    case "squares":
      m.background(color(0,0,0,0))
      rectMode(CENTER);
      nS = random([3, 5, 10]);
      dim = (0.25 * w) / nS;
      dx = random([-dim, 0, 0, 0, 0, 0, 0, dim]);
      dy = random([-dim, 0, 0, 0, 0, 0, 0, dim]);
      sw = (0.5 * w) / nS + 0.5;
      i = 0;
      for (z = 0; z < 3 * nS; z++) {
        rad = w * (1 - (z + 1) / nS) + 0.1;
        if (i % 2) { 
          m.noFill();
          m.strokeWeight(sw);
          m.square(-rad / 2 + dx, -rad / 2 + dy, rad);
        } else {
          n.noFill();
          n.strokeWeight(sw);
          n.square(-rad / 2, -rad / 2, rad);
        }
        i++;
      }
      break;
    case "kiss":
      if (random()>0.7){m.rect(-w,-h,2*w,2*h)} else {m.background(color(0,0,0,0))}
      r1 = w*random([2/3,random(2/3,1),1]);
      r1gap = 0.02*w;
      let v = random([-1,1])
      let [e1,e2] = random([[2,random(0.5,1)],[1,1],[3,3],[1e5,1]])
      //n.circle(v*w/2,0,r1-r1gap/2)
      n.ellipse(v*w/2,0,r1-r1gap/2,e1*r1)
      //n.circle(-v*w/2,0,2*w-r1-r1gap/2)
      //n.ellipse(-v*w/2,0,2*w-r1-r1gap/2,e2*(2*w-r1-r1gap/2))
      // /**
      n.push();
      n.translate(-v*w/2,0)
      if (e2<1) {n.rotate(random([0,0,0,0,0.1*PI]))}
      n.ellipse(0,0,2*w-r1-r1gap/2,e2*(2*w-r1-r1gap/2))
      n.pop();
      // **/
      break;
    case "sine":
      m.background(color(0,0,0,0))

      m.rect(-w,-h,2*w,2*h)
      let nStripes = random([5]);
      let phase = 0//PI*random([0,0,0,1/2,1])
      let [m1, m2] = random([[1,-1]])
      for (f=0; f<nStripes; f++) {
        n.beginShape();
        let gap = (0.8/nStripes)*h//random(0.2,0.4)*h;
        yPos = -0.75*h + f*gap*2

        for (let x=-w;x<w; x+=0.001*w){
          n.vertex(x,
                   yPos + w*0.05*sin(m1*PI*x/width) - gap/2);
        }
        for (let x=w;x>-w; x-=0.01*w){
          n.vertex(x,yPos + w*0.05*sin(m2*PI*x/width + phase) + gap/2)
        }
        n.endShape();
      }
      break;
    case "taijitu":
      m.background(color(0,0,0,0))
      m.rect(-w,-h,2*w,2*h)
      n.rect(-w,0,2*w,h)
      let taijituType = random([1,2,3,4])
      if (maskType=="old-tv" | maskType =="circle"){
        taijituType = random([1,3,4])
      }
      switch (taijituType){
        case 1:
          let r = random([0.3,0.4])*h
          n.circle(0,-0.2*h,r)
          n.erase();
          n.circle(0,0.2*h,r)
          n.noErase();
          break;
        case 2:
          n.rectMode(CENTER)
          n.square(0,-0.2*h,h*0.4)
          n.erase();
          n.square(0,0.2*h,h*0.4)
          n.noErase();
          break;
        case 3:
          let lT = w/3//w/10
          let hT = lT//lT*sqrt(3)
          n.triangle(-lT,0,0,-hT,lT,0)
          n.erase();
          n.triangle(-lT,0,0,hT,lT,0)
          n.noErase();
          break;
        case 4:
        let arcW = random([w/2,0.8*w])
          n.arc(0,0,arcW,h/2,PI,TAU)
          n.erase();
          n.arc(0,0,arcW,h/2,0,PI);
          n.noErase();
          break;
      }
      break;
    case "lines":
      let lType = random([1,2,3]);
      m.rect(-w,-h,2*w,2*h);
      n.noFill();
      n.strokeWeight(round(w/80));
      switch (lType){
        case 1:
          n.circle(0,0,w*2/3)
          /**
          if (random()>0.5){
            n.strokeWeight(w/2)
            n.circle(0,0,w*1.25)
          }
          **/
          break;
        case 2:
          n.rectMode(CENTER)
          n.square(0,0,w/2)
          /**
          if (random()>0.5){
            n.strokeWeight(w/2)
            n.square(0,0,w*1.1)
          }
          **/
          break;
        case 3:
          n.strokeCap(SQUARE);
          if (random()>0.5){
            n.line(-w/3,0,w/3,0)
          } else {
            n.line(0,-h/3,0,h/3)
          }
          break;
      }
      break;
    case "pills":
      /**
      m.rect(-w,-h,2*w,2*h);
      let x3 = random(0);
      let y3 = random(0);
      n.triangle(-w+x3, -h+y3, -w+x3, y3, x3, y3);
      n.triangle(w+x3,h+y3,w+x3,y3,x3,y3)
      n.circle(w/8,-h/4,w*0.25)
      **/
      m.background(color(0,0,0,0))
      if (random()>0.5){
        m.rect(-w,-h,2*w,2*h)
        n.rect(-w,0,w*1.25,h/2,w)
      } else
        {
          m.rect(-w,0,w*1.25,h/2,w)
        }
      n.rect(-w/4,-h/2,w*1.25,h/2,w)
      break;
    default:
      m.background(color(0,0,0,0))
      nS = random([21, 41]);
      dx = w / nS;
      dy = dx;
      dxx = 0;
      dyy = 0;
      if (nS > 3) {
        dxx = random([-dx / 4, dx / 4]);
        dyy = random([-dy / 4, 0, 0, dy / 4]);
      }
      i = 0;
      for (x = -w; x < 2 * w; x += dx) {
        for (y = -h; y < 2 * h; y += dy) {
          if (i % 2) {
            m.rectMode(CENTER);
            m.rect(x, y, dx);
          } else {
            n.rectMode(CENTER);
            n.rect(x + dxx, y + dxx, dy);
          }
          i++;
        }
      }
      break;
  }
  m.pop();
  n.pop();
}

function drawCurvedShape(
  o,
  x0,
  y0,
  maxRadius,
  minRadius,
  nSides,
  nVertex,
  noiseLevel,
  curved,
  skewFactor
) {
  o.push();
  o.translate(x0, y0);
  o.rotate(PI / nSides);
  nVertex = nSides * nVertex; //random([1,2,3]);
  noiseDetail(noiseLevel, 0.8);
  o.beginShape();
  da = TAU / nVertex;
  let phase = random();
  for (let a = 0; a < 2 * TAU; a += da) {
    dr = skewFactor*noise(cos(a/2))
    let r = min(
      minRadius +
      (maxRadius - minRadius) *
        (noise(cos((nSides * a) / 2)) +
        dr),maxRadius);
    x = r * sin(a);
    y = r * cos(a);

    if (curved) {
      o.curveVertex(x, y);
    } else {
      o.vertex(x, y);
    }
  }
  o.endShape();
  o.pop();
}
