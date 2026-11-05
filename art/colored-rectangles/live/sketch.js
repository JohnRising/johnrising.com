function setup() {
  // fxhash seed
  seed = fxrand()*1e10
  randomSeed(seed)
  noiseSeed(seed)

  // Snap dimensions to make edge rendering more consistent
  minDim = floor(min(windowWidth,windowHeight)/100)*100;
  createCanvas(minDim, minDim);
  colorMode(HSB,1)
  
  // Initialize colors and square radius
  h0 = random();
  r = 0.3*minDim;
  [s,b] = random([[0.9, 0.1],[0.05, 0.95]])
  background(color(h0, s, b))
  // Easter egg
  if (random()>0.8){
    drawBackground(h0)
  }
  // Backgrounds
  noStroke();
  if (random()>0.5){
    d = random([[random([-1,1]), random([-1,1])], 
                [random([-1,1]), random([-1,1])], 
                [random([-0.1,0.1]), random([-0.1,0.1])]]);
    
    c0 = color(h0, 0.3, 0.9);
    c1 = color(h0, 0.9, 0.2);
    if (random()>0.9){[c0,c1]=[c1,c0]}
    if (random()>0.9){
      [c0,c1]=[color(0,1,0),color(0,0,1)]
    }
    
    // Cascading if statements to determine probability of each side appearing
    nSides = random([1,1,2,4])
    
    if (abs(d[0])<0.5 && nSides<2 && random()>0.95){
      fill(c1)
      triangle(width/2,height/2,0,0,width,0);
      triangle(width/2,height/2,0,height,width,height);
      fill(c0)
      triangle(width/2,height/2,0,0,0,height);
      triangle(width/2,height/2,width,height,width,0);
    }
    
    drawBG = false;
    drawSides(d,c0,c1)
    if (nSides>1){
      d = [-d[0],-d[1]]
      drawSides(d,c0,c1)
      if (nSides>2){
        d = [-d[0],d[1]]
        drawSides(d,c0,c1)
        d = [-d[0],-d[1]]
        drawSides(d,c0,c1)
      }
    }

  } else {
    fill(h0,s,(b+0.5)%1);
    if (random()>1){
      xdir = random([-1,1]);
      ydir = random([-1,1]);
      style = random([1,2,3,4]);
      console.log(style);
      
      nIter = 5
      for (i=0;i<nIter; i++){
        delta = (Iter)*minDim*(nIter-i)
        fill(lerpColor(color(h0,s,b),color(h0,s,(b+0.5)%1),i/nIter))
        square(width/2-r + xdir*delta,
               height/2 - r + ydir*delta,r*2)
        square(width/2-r - xdir*delta,
               height/2 - r - ydir*delta,r*2)            }
      noStroke();
    } else if (random()>0.5) {
      fill(h0,0.1,(b+0.5)%1);
      circle(width/2,height/2,r*PI)
    }
  }

  // Color properties
  sScale = random([[0.33, 0.5, 0.8],
                   [0.3, 0.1],
                   [0.2, 0.4, 0.6],
                   [0.5, 0.45, 0.4],
                   [0.9]]);

  hScale = random([[0],
                   [0, -0.1, 0.1],
                   [0.5],
                   [0, 0.5],
                   [0,1/3,0.5],
                   [0,1/6,1/3,1/2,2/3,5/6],
                   [0]]); 
  bScale = random([[0.1, 0.5, 1], 
                  [0.9, 0.6],
                  [0.8,0.2,0.6],
                  [0.1,0.2,0.3],
                  [0.9,0.95,0.85,0.8]])
  nColors = random([5, 5, 10, 10, 20]);
  
  // Types to fill square
  dimType = random(["halves","pareidolia","squares","rectangles","subdivide",
                    "a","e","f","h","i","j","k"])
  if (dimType=="squares"){
    nColors = random([5, 15, 30])
  }
  splitW = random([1/3, 0.5, 2/3]);
  splitH = splitW
  // Arrays of common dimensions to use later
  dims0 = [0.1,0.2,0.3]
  dims1 = [0.3];
  dims2 = [0.05, 0.10,0.15,0.20,0.25,0.3];
  dims3 = [0.1, 0.2, 0.3];
  dims4 = [0.1];
  dims5 = [0.25,0.24,0.23,0.22,0.21,0.2];
  dims6 = [0.3, 0.3, 0.3, 0.2, 0.2, 0.1];
  dims7 = [0, 0.3];
  dims8 = [0.26, 0.28];
  dims9 = [0, 0.3];
  var dimsX,
      dimsY
  
  dXdir = round(random(-1,1)*2)/3
  dYdir = round(random(-1,1)*2)/3
  scramble = false;
  if ((nColors>10) && random()>0.25){
    scramble=true;
  }
  
  // For each color, draw a rectangle
  for (n=0; n<nColors; n++){
    // Set color and offset
    h = (h0 + hScale[n%hScale.length])%1;
    s = sScale[n%sScale.length];
    b = bScale[n%bScale.length];
    dx = 0;
    dy = 0;
    dimsCheck = true;
    
    // Half of the time, s and b should be random
    if (random()>0.5){      
      s = random(sScale)
      b = random(bScale)
    }
    
    // Sometimes alternatve between six hues at high saturation
    if (random()>0.8){
      h = (h0 + floor(random()*6)/6)%1;
      s = 0.9//random(0.1,1);
      b = random([0.8, 0.5])
    }
    
    // Sometimes saturation converges to 0.5
    if (random()>0.8){
      s = random(n/nColors, 1-n/nColors)
      b = random([s, 1-s, random(bScale)])
    }

    // Set dimensions
      switch (dimType){
        case ("halves"):
          dimsX = [0.3*(1-n/nColors)];
          dimsY = [0,0.3*(1-n/nColors)];
          dimsCheck = false;
          break;
        case ("invaders"):
          dimsX = [0.3*(1-n/nColors),0.3*(1-n/nColors)];
          dimsY = [0,0.3*(n/nColors)];
          dimsCheck = false;
          if (nColors>5){
            dy = random([-1,1])*r*(1-n/nColors)*(n%2)
          }
          break;
        case ("pareidolia"):
          dimsX = [0.3*ceil(random(2))/2];
          dimsY = [0.3*(1-n/nColors),0.3*(n/nColors)];
          dimsCheck = false;
          break;
        case ("squares"):
          dimsX = [0.3*(1-n/nColors)];
          dimsY = [0.3*(1-n/nColors)];
          dx = round(dXdir*2)/2*r*n/nColors;
          dy = round(dYdir*2)/2*r*n/nColors;
          if (nColors>5 & scramble){
            dy = dy*(n%2)
          }
          dimsCheck = false;
          if (nColors > 5){
              s = 0.3 + 0.6*(n%3);
              b = 0.3+0.7*n/nColors*(n%2);
              }
          break;

        case ("rectangles"):
          dimsX = [0.3*(1-random([n,n-1])/nColors)];
          dimsY = [0.3*(1-random([n,n-1])/nColors)];
          dimsCheck = false;
          break;
        case ("a"):
          dimsX = dims9;
          dimsY = dims9;
          break;
        case ("b"):
          dimsX = dims1;
          dimsY = dims2;
          break;
        case ("c"):
          dimsX = dims2;
          dimsY = dims3;
          break;
        case ("d"):
          dimsX = dims3;
          dimsY = dims2;
          break;
        case ("e"):
          dimsX = dims4;
          dimsY = dims2;
          break;
        case ("f"):
          dimsX = dims2;
          dimsY = dims4;
          break;
        case ("g"):
          dimsX = dims1;
          dimsY = dims5;
          break;
        case ("h"):
          dimsX = dims6;
          dimsY = dims6;
          break;
        case ("i"):
          dimsX = dims2;
          dimsY = dims7;
          break;
        case ("j"):
          dimsX = dims7;
          dimsY = dims0;
          break;
        case ("k"):
          dimsX = [0,0.25,0.3];
          dimsY = [0.15,0.3];
          break;
        default:
          dimsX = dims2;
          dimsY = dims7;
          break;
      }

    // Set color to fill
    c = color(h,s,b);
    fill(c);
    noStroke();

    // Set corners of rectangle
    x0 = width/2 - minDim*random(dimsX)+dx;
    y0 = height/2 - minDim*random(dimsY)+dy;
    x1 = width/2 + minDim*random(dimsX)+dx;
    y1 = height/2 + minDim*random(dimsY)+dy;
    
    // Check for zero area rectangles
    if (x0==x1) {x1=x0+minDim*max(dimsX)}
    if (y0==y1) {y1=y0+minDim*max(dimsY)}
    if (dimsCheck & (x0==width/2-minDim*max(dimsX) &&
        y0==height/2-minDim*max(dimsY) &&
        x1==width/2+minDim*max(dimsX) &&
        y1==height/2+minDim*max(dimsY))){
        y1 = height/2-minDim*min(dimsY)
    }
    
    // Fill the square if n=0
    if (n==0) {
      x0=width/2-r;
      y0=height/2-r;
      x1=width/2+r;
      y1=height/2+r;
    }

    // Draw the rectangle. If the method is subdivide, some additional logic is needed
    if (dimType=="subdivide"){
      if (n==0){
        rectMode(CORNERS)
        rect(x0,y0,x1,y1)
      } else {
        [wDim, hDim] = random([[1,1],[1,1],[1,1],[1/3,1],[1,1/3]])
        drawSubRect(width/2-wDim*r,height/2-hDim*r,2*wDim*r, (2*hDim)*r, splitW, splitH)
      }
    } else {
      rectMode(CORNERS)
      rect(x0,y0,x1,y1)
    }
  }


function drawSides(d,c0,c1){
  
  noStroke();
    // Right
  if (d[0]>0){
    fill(c1)
    quad(width/2 + r,
         height/2 - r,
         width/2 + r + d[0]*minDim,
         height/2 - r + d[1]*minDim,
         width/2 + r + d[0]*minDim,
         height/2 + r + d[1]*minDim,
         width/2 + r,
         height/2 + r)
  } else {
    // Left
    fill(c1)
    quad(width/2-r,
         height/2-r,
         width/2-r,
         height/2+r,
         width/2-r+d[0]*minDim,
         height/2+r+d[1]*minDim,
         width/2-r+d[0]*minDim,
         height/2-r+d[1]*minDim)
  }
  if (d[1]<0) {
    // Top
    fill(c0)
    quad(width/2 - r,
         height/2 - r,
         width/2 + r,
         height/2 - r,
         width/2 + r + d[0]*minDim,
         height/2 - r + d[1]*minDim,
         width/2 - r + d[0]*minDim,
         height/2 - r + d[1]*minDim)
  } else {
    // Bottom
    fill(c0);
    quad(width/2-r,
         height/2+r,
         width/2+r,
         height/2+r,
         width/2+r+d[0]*minDim,
         height/2+r+d[1]*minDim,
         width/2-r+d[0]*minDim,
         height/2+0.3*minDim+d[1]*minDim)
  }
}
}

function drawSubRect(x,y,w,h,splitW,splitH){
  rectMode(CORNER)
  rect(x,y,w,h)
  hu = (h0 + hScale[n%hScale.length])%1;
  s = (1-y/height)
  b = (1-x/width)
  if (scramble){s=(x/width); b=(y/height)}
  fill(hu,s,b)
  
  var splitWidth = random()>0.5;
  if (scramble){splitwidth = n%2}
  //splitwidth = n%2

  if (splitWidth && w > minDim*0.1 && random()>(0.25*n/nColors)){
    drawSubRect(x,y,w*splitW,h,splitW,splitH);
    drawSubRect(x+w*splitW, y, w*(1-splitW), h,splitW,splitH);
  } else if (h>minDim*0.1 && random()>(0.25*n/nColors)){
    drawSubRect(x,y,w,h*splitH,splitW,splitH);
    drawSubRect(x,y+(h*splitH),w,h*(1-splitH),splitW,splitH);
  }
    n++;
}

function drawBackground(h0) {
  
  [nx, ny] = random([[1,2],[2,1],[2, 2]])
    
  dx = width/nx;
  dy = height/ny;
  
  nStrata = random([1, 20]);
  
  noiseDetail(5,0.7)
  xStrips = floor(random([0, 2, 3, 10]))
  yNoise = 1
  xNoise = random([0, 0.05, 0.15])
    
  dh = random([[0, 0.5], [0, -0.33, 0.33], [0, -0.1, 0.1]]);
  ds = random([0.1, 0.5, 0.8])
  db = random([[0.2, 0.3], [0.8, 0.9]]);
  
  for (x=0; x<width; x+=dx){
    for (y=0; y<height; y+=dy){
      n = noise(floor(random(xNoise) + xStrips*x/width), y/height + yNoise*random(-dy,dy)/height);
      s = floor(round(n*nStrata))/nStrata;
      h = (h0 + random(dh))%1;
      
      c = color(h,s*ds,random(db))
      fill(c); stroke(c);
      rect(x,y,dx,dy)
      //ellipse(x, y, 2*dx, 0.5*dy)
      //line(x,y,x+dx, y+dy);
    }
  }
}
