function setup() {
  rs = fxrand()*1e10;
  console.log(rs);
  randomSeed(rs);
  
  AspectRatio = random([9/16, 16/9, 1, 1])
  minDim = min(windowWidth,windowHeight)
  maxDim = max(windowWidth,windowHeight)

  z = 20 // highest nx or ny
  
  if (AspectRatio<1) {
    refY = floor(windowHeight/z)*z
    refX = floor(AspectRatio*windowHeight/z)*z
  } else if (AspectRatio>1) {
    refX = floor(windowWidth/z)*z
    refY = floor(windowWidth/AspectRatio/z)*z
  } else {
    refX=floor(minDim/z)*z;
    refY=floor(minDim/z)*z;
  }
  createCanvas(refX, refY);
  maxDim = sqrt(width**2 + height**2)
  colorSchema = ""

  // Select style
  let style = random(["Light","Hatched","Hatched","Bullseye","Bullseye"]);
  switch (style){
    // Light bars and watermelons
    case "Light":
      nx = random([1, 2, 5, 20]);
      [nx, ny] = random([[1, 1],
                  [1, 2],
                  [2, 1],
                  [2, 2],
                  [3,2],
                  [2,3],
                  [4, 1],
                  [5, 1]]);

      [nLines, lineWidth] = random([[1, 1],
                                        [300, 0.5]])

      xBorder = 1;
      yBorder = 1;
      hM = random([1, 1, 2])
      colorSchema="undefined"
      drawGridThing(nx, ny, nLines, xBorder, yBorder, lineWidth, hM)
      break;
    // Hatched
    case "Hatched":
      nx = random([2, 5, 10, 20])
      ny = random([3, 5, 10])
      
      nLines = random([100, 200]);
      lineWidth = 0.5;
      let [xScale, yScale] = random([[0.5, 1.5],
                              [1.5, 0.5],
                              [1, 1/3],
                              [1/3, 1],
                              [1.5, 2],
                              [2, 1.5]])
     
      colorSchema = random(["complementary", "triadic", "monochrome"])
      if (colorSchema=="monochrome") {lineWidth=0.5}
      if (nx<=5 | ny<=5) {lineWidth=0.5}
      drawGrid(nx, ny, nLines, lineWidth, xScale, yScale, colorSchema)
      break;
    // Bullseye
    case "Bullseye":
        colorSchema = random(["complementary", "triadic", "monochrome","analogous"])
      colorSchema = drawBullseyeMoire(colorSchema)
      break;
    default:
      break;
  }
  //**/
  
  window.$fxhashFeatures = {
    "Style": style,
    "Colors": colorSchema,
  }
  
  console.log(style, colorSchema)
  
}

function drawLines(pg, nLines, lineWidth, angle, c) {
  pg.strokeWeight(lineWidth);
  pg.stroke(c)
  
  for (ii=0; ii<nLines; ii++){
    pg.push();
    pg.rotate(angle);
    pg.translate(maxDim*(ii+0.5)/nLines,0)
    pg.line(0, -maxDim, 0, maxDim)
    pg.pop();
  }
}

function drawMoireLines(pg, n, nLines, lineWidth, cStart, cEnd, alignment) {
  for (let jj=0; jj<n; jj++){
    //a = random([0, PI/2])//random();
    //a = ((jj/n)*(PI/2)) + 0*random([0, PI/4, PI/2])
    a = alignment[jj];
    if (alignment[jj]=="random"){a=random([0,PI/4,PI/2])}
    c = lerpColor(cStart, cEnd, jj/n)
    drawLines(pg, nLines, lineWidth, a, c)
    //drawLines(pg, nLines*1.1, lineWidth, a[0]+PI/10, c)
  }

}

function fillMaskedShape(m, n, nLines, lineWidth, cStart, cEnd, alignment) {
  pattern = createGraphics(width,height)
  drawMoireLines(pattern, n, nLines, lineWidth, cStart, cEnd, alignment);
  
  m.drawingContext.globalCompositeOperation = 'source-in';
  m.image(pattern,0,0)
  image(m,0,0)
}

function createMaskedShape(shapeType, x, y, wt, ht, cStart, cEnd, nLines, lineWidth, alignment){
  m = createGraphics(width, height);
  switch (shapeType) {
    case "ellipse":
      m.ellipse(x, y, wt, ht)
      break;
    case "rect":
      m.rectMode(CENTER)
      m.rect(x, y, wt, ht)
      break;
    case "pill":
      corner = max(wt,ht)
      m.rectMode(CENTER)
      m.rect(x,y,wt,ht,corner)
      break;
    case "circle":
      m.circle(x,y,min(wt,ht))
      break;
    default:
      m.rectMode(CENTER)
      m.rect(x, y, wt, ht)
      break;
  }
  fillMaskedShape(m, 2, nLines, lineWidth, cStart, cEnd, alignment);
}

function drawGridThing(nx, ny, nLines, xBorder, yBorder, lineWidthScale, hM){
  dx = width/nx;
  dy = height/ny;
  hMod = random([0, 0.5])
  let [cM, yM] = random([[2, 1.1],
                         [2, 0.8],
                         [3, 2],
                         [5, 1.1],
                         [2, 4]])
  hScale = random() + nx/hM;
  
  let y0 = random([0.2,0.8])
  let c0 = random([0.2,1.0])
  if (ny>1) {[xBorder,yBorder]=random([[1,1],
                                      [0.9,0.9]])}
  shape = random(["rect","rect","ellipse"]);
  if (nx>3 | ny>1) {shape = "rect"}
  if (nx<3 | ny==1 | shape == random(["ellipse","pill","circle"])) {
    lineWidthScale=2;
    xBorder = 0.9;
    yBorder = 0.9;
  }

  let [xWarp, yWarp] = random([[false, true],
                            [true, false],
                            [true, true]])
  if (shape=="ellipse") {[xWarp, yWarp] = random([[false, true], [true, false]])}
  
  for (let x=dx/2; x<width; x+=dx){
    for (let y=dy/2; y<height; y+=dy){
      lineWidth = lineWidthScale*maxDim/nLines
      h = (hScale + hScale*x/width)%1
      cStart = color(HCYtoRGB(h, c0, y0, 1))
      cEnd = color(HCYtoRGB((h+hMod)%1, c0, y0, 1))
      rectMode(CENTER);
      noStroke(); fill(cStart)
      rect(x, y, dx, dy)
      alignment = [0, PI/2]
      createMaskedShape("rect", x, y, dx, dy, cStart, cEnd, nLines/4, 4*lineWidth, alignment)
      let n=0;
      for (let ii=1; ii>0; ii-=0.05){
        cStart = color(HCYtoRGB(h, 0.9, 1, 1))
        cEnd = color(HCYtoRGB((h+hM)%1, (n%cM), (n%yM), 1))
        alignment = [random([0, PI/4, PI/2]), random([0, PI/4, PI/2])]
        alignment = [0,PI/2]
        xi = 1;
        yi = 1;
        if (xWarp) {xi=ii}
        if (yWarp) {yi=ii}
        
        createMaskedShape(shape, x, y, dx*xi*xBorder, dy*yi*yBorder, cStart, cEnd, nLines, lineWidth, alignment)
        n++
      }
    }
  }
}

function drawGrid(nx, ny, nLines, lineWidthScale, xScale, yScale, colorSchema){
  let dx = width/nx;
  let dy = height/ny;
  h0 = random();
  let [hScaleX, hScaleY] = random([[1, 0],
                                   [0, 1],
                                   [nx/2.1, ny/2.1],
                                   [nx/1.9, ny/3.1],
                                   [nx/3.1, ny/3.1]])
  
  //let [c1c, c2c, c3c]=[1,0.5,1]
  //let [c1y, c2y, c3y]=[0.9, 0.8, 0.9]
  let [c1c, c1y] = random([[1, 0.3],
                          [0.3, 0.8],
                          [0.8, 0.9]]);
  let [c2c, c2y] = random([[1, 0.3],
                          [0.3, 0.8],
                          [0.8, 0.9]]);
  let [c3c, c3y] = random([[1, 0.3],
                          [0.3, 0.8],
                          [0.8, 0.9]]);
  
  let alignment = random([[0, 0],
                         [PI/2, PI/4],
                         [0, PI/2],
                         ["random","random"]])
  cySchema = random([1,2,3,4]);
  if (colorSchema=="monochrome"){cySchema=5}
  cySchemaF = random();
    
  for (let x=dx/2; x<width; x+=dx){
    for (let y=dy/2; y<height; y+=dy){
      
      let xs = x-dx/2
      let ys = y-dy/2
      let xe = x+dx/2
      let ye = y+dy/2
      
      lineWidth = lineWidthScale*maxDim/nLines
      h = (h0 + hScaleX * x/width + hScaleY * y/height)%1
      switch (cySchema){
        case 1:
          c1y = ((nx/3)*x/width)%1
          c2y = ((nx/2)*y/height)%1
          c3y = ((nx/2)*y/height)%1
          break;
        case 2:
          c1c = cySchemaF + (1-cySchemaF)*x/width;
          c1y = cySchemaF + (1-cySchemaF)*x/width;
          c3c = 1-cySchemaF + (1-cySchemaF)*x/width;
          c3y = 1-cySchemaF + (1-cySchemaF)*x/width;
          break;
        case 3:
          c1c = cySchemaF + (1-cySchemaF)*x/width;
          c1y = cySchemaF + (1-cySchemaF)*y/height;
          break;
        case 4:
          c1c = random()
          c1y = random(0.2, 0.8)
          c2c = random()
          c2y = random(0.2,0.8)
          c3c = random()
          c3y = random(0.2, 0.8)
          break;
        case 5:
          c1c = 0
          c1y = 0
          c2c = 0
          c2y = 1 - random([y/height,random(),0])
          c3c = 0
          c3y = 0
          alignment = random([["random","random"],
                              [0, 0.5*PI/nLines],
                              [PI/2, 0.5*PI/nLines],
                             [0,0],
                             [PI/2, PI/2]]);
          break;
        default:
          break;
              }
      switch (colorSchema){
        case "complementary":
          c1 = color(HCYtoRGB((h+0.5)%1, c1c, c1y, 1))
          c2 = color(HCYtoRGB(h%1, c2c, c2y, 1))
          c3 = color(HCYtoRGB(abs(h+0.5)%1, c3c, c3y, 1))
          break;
        case "triadic":
          c1 = color(HCYtoRGB((h+0.33)%1, c1c, c1y, 1))
          c2 = color(HCYtoRGB(h%1, c2c, c2y, 1))
          c3 = color(HCYtoRGB(abs(h+0.67)%1, c3c, c3y, 1))
          break;
        case "monochrome":
          c1 = color(HCYtoRGB(h0, random(1-y/height), 1-y/height, 1))
          c2 = color(HCYtoRGB(h0, x/width, x/width, 1))
          c3 = color(HCYtoRGB(h0, 1-x/width, 1-y/height, 1))
          break;
      }
      
      rectMode(CENTER);
      fill(c1); noStroke();
      rect(x, y, dx+2, dy+2)
      
      /**
      alignment = random([[0, PI/2],
                         [0, PI/4],
                         [PI/2, 0],
                         [PI/4, PI/2],
                         [0, PI/50],
                         [PI/50, PI/2-PI/50]])
      **/
      
      createMaskedShape("rect", x, y, dx, dy, c1, c2, nLines, lineWidth, alignment)
      createMaskedShape("rect", x, y, dx*xScale, dy*yScale, c2, c3, nLines, lineWidth, alignment)
      
      }
    }
}

function drawBullseye(x, y, d, nb, h, hH, chroma, lineWidthScale, shape, yOverride){
  dd = d/nb;
  alignment = random([[0, 0], [PI/2, PI/2], [PI/4, PI/4]])
  nLines = random([50, 100, 150])
  if (random()>0.9 && shape=="ellipse") {nLines = 20}
  let yFactor = random([2,3]);
  let y0 = random();
  if (yOverride) {y0=1; yFactor=-0.8}
  for (let n=0; n<nb; n++){
    c = HCYtoRGB((h + n/hH)%1, chroma, (y0+yFactor*n/nb)%1, 1)
    createMaskedShape(shape, x, y, d-dd*n, d-dd*n, c, c, nLines, lineWidthScale*maxDim/nLines, alignment)
  }
}

function drawBullseyeMoire(colorSchema){
  
  x0 = width/2
  y0 = height/2
  chroma = random([0.5,0.75,0.9])
  
  if (random()>0.95){chroma=0; colorSchema="monochrome"}
  if (random()>0.9){chroma=0.2}
  shape = random(["rect", "ellipse"])
  style = random(["Bullseye 1", "Bullseye 2", "Bullseye 3"]);
  
  let hH = 1;
  // Choose color variables
    if (colorSchema=="complementary"){
        hH = 2;
      } else if (colorSchema=="triadic"){
        hH = 3
      } else if (colorSchema=="monochrome"){
        hH = 1;
      } else if (colorSchema=="analogous"){
        hH = 12
      }
  dh = random([0,1/12,1/3,1/2]);
  h = random();
  nb = 10;
  
  switch (style){
    case "Bullseye 1":
      drawBullseye(x0,random([1,2])*height/3,3*maxDim,nb,h,hH,chroma,1,shape,false)
      drawBullseye(x0,random([1,2])*height/3 + height/50,3*maxDim,nb+0.5,(h+dh)%1,hH,chroma,0.5,shape,false)
      break;
    case "Bullseye 2":
      n0 = floor(random(10,40))
      drawBullseye(random([1, 2])*width/3,y0,3*maxDim,10,(h+dh)%1,hH,chroma,1,shape)
      drawBullseye(random([1, 2])*width/3+width/50,y0,3*maxDim,10.5,(h+dh)%1,hH,chroma,0.5,shape)
      break;
    default:
      shape = "ellipse"
      yOverride = true
      n0 = random([10, 50, 100]);
      if (colorSchema=="monochrome"){n0=10}
      hH = n0*random([1/3,1/2,1,2]);
      if (n0>50 && colorSchema!=="monochrome"){n0=300; hH=random(0.5,2)*n0; colorSchema="Rainbow"}
      let [x1, y1] = [random([0,width]), random([0,height])];
      let [x2, y2] = [random([0,width]), random([0,height])];
      if (x1==x2 & y1==y2) {x2=abs(width-x1)} drawBullseye(x1,y1,maxDim*3,n0,h,hH,chroma,1,shape,yOverride)
      drawBullseye(x2, y2,maxDim*3,n0,(h+dh)%1,hH,chroma,0.5,shape,yOverride)
      
      if (random()>0.0 & n0<100){
        drawBullseye(width/2,height/2,
                     maxDim*3,n0,(h+2*dh)%1,hH,chroma,0.25,shape, yOverride)
      }
      break;
  }
  return colorSchema
}

// HCY to RGB
function HCYtoRGB(h, c, y, a) {
  colorMode(RGB, 1);
  // Coefficients for weighting red/green/blue contribution
  R = 0.2126;
  G = 0.7152;
  B = 0.0722;

  //R = 0.3;
  //G = 0.59;
  //B = 0.11;

  // Intermediate variables
  let hm = h * 6;
  let x = c * (1 - abs((hm % 2) - 1));
  r1 = 0;
  g1 = 0;
  b1 = 0;

  // Find point along rgb color cube
  if ((hm >= 0) & (hm < 1)) {
    r1 = c;
    g1 = x;
    b1 = 0;
  }
  if ((hm >= 1) & (hm < 2)) {
    r1 = x;
    g1 = c;
    b1 = 0;
  }
  if ((hm >= 2) & (hm < 3)) {
    r1 = 0;
    g1 = c;
    b1 = x;
  }
  if ((hm >= 3) & (hm < 4)) {
    r1 = 0;
    g1 = x;
    b1 = c;
  }
  if ((hm >= 4) & (hm < 5)) {
    r1 = x;
    g1 = 0;
    b1 = c;
  }
  if ((hm >= 5) & (hm <= 6)) {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  // return rgb
  m = y - (R * r1 + G * g1 + B * b1);
  r = r1 + m;
  g = g1 + m;
  b = b1 + m;
  return color(r, g, b);
}
