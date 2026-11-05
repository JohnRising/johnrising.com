function setup() {
  minDim = min(windowWidth, windowHeight);
  maxDim = max(windowWidth, windowHeight);
  xBorder = yBorder = minDim * 0.1;

  colorMode(HSB, 1);
  createCanvas(minDim, minDim);

  composition = "ZigZag";
  if (fxrand() > 0.33) {
    composition = "Crossing";
  }
  if (fxrand() > 0.67) {
    composition = "StackedSloping";
  }
  rot = false;
  if (fxrand() > 0.5) {
    rot = true;
  }

  push();
  noStroke();
  if (rot) {
    rotate(PI / 2);
    translate(0, -height);
  }
  
  switch (composition) {
    case "ZigZag":
      drawZigZag(
        (nLines = 1 + 2 * floor(fxrandRange(2, 8))),
        (xStart = xBorder),
        (yStart = height - yBorder),
        (xEnd = width - xBorder),
        (yEnd = yBorder)
      );
      break;
    case "Crossing":
      drawCrossing(
        (nLines = floor(fxrandRange(4, 21))),
        (xStart = xBorder),
        (yStart = height - yBorder),
        (xEnd = width - xBorder),
        (yEnd = yBorder)
      );
      break;
    case "StackedSloping":
      drawStackedSloping(
        (nLines = 2 * floor(fxrandRange(2, 5))),
        (xStart = xBorder),
        (yStart = height - yBorder),
        (xEnd = width - xBorder),
        (yEnd = yBorder)
      );
      break;
  }
  pop();
}

function drawZigZag(nLines, xStart, yStart, xEnd, yEnd) {
  fillFactor = 0.8;
  if (fxrand() > 0.5) {
    fillFactor = 0.5;
  }

  springiness = "zag";
  if (fxrand() > 0.5) {
    springiness = "zig";
  }
  if ((fxrand() > 0.5) & (nLines < 7)) {
    springiness = "crawl";
    xStart = xStart + 0.25 * (xEnd - xStart);
    xEnd = xEnd - 0.25 * (xEnd - xStart);
  }
  
  ringsType = "none"
  if (fxrand()>0.50 | rot) {
    ringsType = "portal"
  }
  if (fxrand()>0.95) {
    ringsType = "rings"
  }
  
  nSegments = floor(0.5 * nLines + 1);

  lineWidth = (yStart - yEnd) / nSegments;
  yStart = yStart - 0.5 * lineWidth;
  yEnd = yEnd + 0.5 * lineWidth;
  xStart = xStart + 0.5 * lineWidth;
  xEnd = xEnd - 0.5 * lineWidth;
  dx = xEnd - xStart;
  dy = -lineWidth;

  hStart = fxrand();
  sStart = 0.8;
  bStart = 0.9;
  dHue = fxrandRange(0.05, 0.2);
  hDir = 1;

  bgColor = color(hStart % 1, 0.03, 0.98);
  if (fxrand() > 0.5) {
    bgColor = color((hStart + 0.33) % 1, 0.3, 0.2);
  }
  background(bgColor);
  createBackgroundTexture();

  for (n = 0; n < nLines; n++) {
    // First, determine which direction to move on color wheel
    if ((hStart + dHue * hDir >= 1) | (hStart + dHue * hDir <= 0.0)) {
      hDir = -hDir;
    }

    // Select new colors
    hNew = hStart + dHue * hDir;
    sNew = 0.2 + 0.9 * fxrand();
    bNew = 0.5 + 0.5 * fxrand();

    c1 = color(hStart, sStart, bStart);
    c2 = color(hNew, sNew, bNew);

    // Determine points of spring
    switch (springiness) {
      case "zag":
        xNew = xStart - dx * (2 * floor(n % 2) - 1);
        yNew = yStart + dy * floor(n % 2);
        break;
      case "zig":
        xNew = xStart - dx * (2 * floor(n % 2) - 1);
        yNew = yStart - ((lineWidth * (nSegments - 0.5)) / nSegments) * 0.5;
        break;
      case "crawl":
        xNew = xStart - dx * (2 * floor(n % 2) - 1);
        yNew = yStart - ((lineWidth * (nSegments - 0.5)) / nSegments) * 0.5;
        break;
    }
        
    if (ringsType=="portal"){
      noFill()
      strokeWeight(lineWidth*0.15)
      stroke(c1)
      ellipse(xStart,yStart,lineWidth*0.25*fillFactor, lineWidth*fillFactor)
      ellipse(xNew,yNew,lineWidth*0.25*fillFactor, lineWidth*fillFactor)
      noStroke()
    }

    if (ringsType=="rings"){
      noFill()
      strokeWeight(lineWidth*0.15)
      stroke(c1)
      circle(xStart, yStart, lineWidth)
      circle(xNew, yNew, lineWidth)
      noStroke()
    }

    
    drawGradientLine(
      xStart,
      yStart,
      xNew,
      yNew,
      lineWidth * fillFactor*0.25,
      lineWidth * fillFactor*0.25,
      lineWidth * fillFactor,
      lineWidth * fillFactor,
      color(hStart, sStart, bStart),
      color(hNew, sNew, bNew)
    );
    

    xStart = xNew;
    yStart = yNew;
    hStart = hNew;
    sStart = sNew;
    bStart = bNew;
  }
}

function drawCrossing(nLines, xStart, yStart, xEnd, yEnd) {
  lineWidth = (yStart - yEnd) / (nLines + 1);

  dHue = fxrandRange(0.03, 0.08);
  dSat = fxrandRange(0.05, 0.1);
  dBright = fxrandRange(0.05, 0.1);
  hStart = fxrand();
  sStart = fxrandRange(0.3, 0.9);
  bStart = fxrandRange(0.7, 0.95);
  hDir = 1;
  sDir = 1;
  bDir = 1;
  adj = fxrandRange(-1, 1);

  fillFactor = 1.0;
  if (fxrand() > 0.25) {
    fillFactor = 0.9;
  }
  if (fxrand() > 0.5) {
    fillFactor = 0.8;
  }
  if (fxrand() > 0.75) {
    fillFactor = 0.5;
  }

  dotMode = fxrand();

  bgColor = color((hStart + 0.33) % 1, 0.03, 0.98);
  background(bgColor);
  createBackgroundTexture();

  for (n = nLines; n >= 0; n--) {
    // noprotect
    // First, determine which direction to move on color wheel
    if ((hStart + dHue * hDir >= 1) | (hStart + dHue * hDir <= 0)) {
      hDir = -hDir;
    }
    if ((sStart + dSat * sDir >= 0.9) | (sStart + dSat * sDir <= 0.2)) {
      sDir = -sDir;
    }
    if ((bStart + dBright * bDir >= 0.95) | (bStart + dBright * bDir <= 0.5)) {
      bDir = -bDir;
    }

    hNew = hStart + dHue * hDir;
    sNew = sStart + dSat * sDir;
    bNew = bStart + dBright * bDir;
    c1 = color(hStart, sStart, bStart);
    c2 = color(hNew, sNew, bNew);

    dY = lineWidth * n + 0.5 * lineWidth;

    breakGap = 2 * lineWidth;
    breakPoint = fxrandRange(lineWidth, xEnd - xStart - 2 * breakGap);

    noStroke();
    drawGradientLine(
      xStart + lineWidth,
      yEnd + dY,
      xStart + breakPoint,
      yEnd + dY,
      lineWidth * fillFactor,
      lineWidth * fillFactor,
      lineWidth * fillFactor,
      lineWidth * fillFactor,
      c1,
      c2
    );

    //fill(color(hNew%1, 0.95, 0.95))
    if (dotMode > 0.2) {
      fill(c1);
    }
    if (dotMode > 0.6) {
      fill(c2);
    }
    if ((dotMode > 0.9) & (fillFactor < 0.95)) {
      fill(0.95, 0.1, 0.2);
    }
    circle(xStart + breakPoint + lineWidth, yEnd + dY, lineWidth * fillFactor);

    drawGradientLine(
      xStart + breakPoint + breakGap,
      yEnd + dY,
      xEnd - lineWidth,
      yEnd + dY,
      lineWidth * fillFactor,
      lineWidth * fillFactor,
      lineWidth * fillFactor,
      lineWidth * fillFactor,
      c2,
      c1
    );

    hStart = hNew;
    sStart = sNew;
    bStart = bNew;
  }
}

function drawStackedSloping(nLines, xStart, yStart, xEnd, yEnd) {
  // Determine offset of each element
  lineWidth = (yStart - yEnd) / (nLines + 1);

  // Set the scale of each end of the element
  minScale = fxrandRange(0.5, 1);
  maxScale = minScale + fxrandRange(0.5, 1);

  // Avoid small gaps between elements
  if (abs(minScale + maxScale - 2) < 0.2) {
    maxScale -= 0.15;
    minScale -= 0.15;
  }

  // Sometimes draw pegs, bow tie shape
  drawRings = false;
  if (fxrand() > 0.5) {
    drawRings = true;
  }
  bowTie = false;
  if (fxrand() > 0.5) {
    bowTie = true;
    maxScale = fxrandRange(1, 1.5);
    minScale = fxrandRange(-0.5, -0.2) * maxScale;
  }

  // Initialize starting colors
  dHue = fxrandRange(0.05, 0.1);
  dSat = fxrandRange(0.1, 0.2);
  dBright = fxrandRange(0.05, 0.1);
  hStart = fxrand();
  sStart = fxrandRange(0.3, 0.9);
  bStart = fxrandRange(0.7, 0.95);
  hDir = 1;
  sDir = 1;
  bDir = 1;

  // Set background
  bgColor = color((hStart + 0.1) % 1, 0.03, 0.98);
  background(bgColor);
  createBackgroundTexture();

  // Draw each element
  for (n = nLines; n > 0; n--) {
    // First, determine which direction to move on color wheel
    if ((hStart + dHue * hDir >= 1) | (hStart + dHue * hDir <= 0)) {
      hDir = -hDir;
    }
    if ((sStart + dSat * sDir >= 0.9) | (sStart + dSat * sDir <= 0.2)) {
      sDir = -sDir;
    }
    if ((bStart + dBright * bDir >= 0.95) | (bStart + dBright * bDir <= 0.5)) {
      bDir = -bDir;
    }

    hNew = hStart + dHue * hDir;
    sNew = sStart + dSat * sDir;
    bNew = bStart + dBright * bDir;
    c1 = color(hStart, sStart, bStart);
    c2 = color(hNew, sNew, bNew);

    dY = lineWidth * n;

    // Set the start and end dimensions of each element
    // floor(n % 2) is used to switch direction
    w1 = lineWidth * (minScale * floor(n % 2) + maxScale * (1 - floor(n % 2)));
    w2 = lineWidth * (maxScale * floor(n % 2) + minScale * (1 - floor(n % 2)));
    h1 = lineWidth * (minScale * floor(n % 2) + maxScale * (1 - floor(n % 2)));
    h2 = lineWidth * (maxScale * floor(n % 2) + minScale * (1 - floor(n % 2)));

    // Start and end positions
    x1 = xStart + 0.5 * abs(w1);
    y1 = dY + yEnd;
    x2 = xEnd - 0.5 * abs(w2);
    y2 = dY + yEnd;

    drawGradientLine(x1, y1, x2, y2, w1, w2, h1, h2, c1, c2);

    // Draw pegs
    if (drawRings) {
      fill((hue(c1) + 0.5) % 1, 0.9, 0.5);
      circle(x1, y1, abs(w1) * 0.5);
      fill((hue(c2) + 0.5) % 1, 0.9, 0.5);
      circle(x2, y2, abs(w2) * 0.5);
    }

    // The last color of this element is the start color of the next element
    hStart = hNew;
    sStart = sNew;
    bStart = bNew;
  }
}

function drawGradientLine(x1, y1, x2, y2, w1, w2, h1, h2, c1, c2) {
  steps = maxDim;
  for (ii = 0; ii < steps; ii++) {
    x = lerp(x1, x2, ii / steps);
    y = lerp(y1, y2, ii / steps);
    w = lerp(w1, w2, ii / steps);
    h = lerp(h1, h2, ii / steps);
    if (abs(w) < 0.005 * minDim) {
      w = 0;
    }
    if (abs(h) < 0.005 * minDim) {
      h = 0;
    }
    hu = (0.5 * (hue(c1) * (1 - ii / steps) + hue(c2) * (ii / steps))) % 1;
    s = lerp(saturation(c1), saturation(c2), ii / steps);
    b = lerp(brightness(c1), brightness(c2), ii / steps);
    c = color(hu, s, b);
    fill(c);
    ellipse(x, y, w, h);
  }
}

function createBackgroundTexture() {
  noFill();

  paperType = "dots"
  if (fxrand()>0.30) {paperType="rough"}
  if (fxrand()>0.60) {paperType="cloth"}
  if (fxrand()>0.95) {paperType="fiber"}
  
  if (paperType == "rough") {
    strokeWidth = fxrandRange(0.001, 0.010) * minDim;
    dL = fxrandRange(0,3) * strokeWidth;
    strokeBorder = strokeWidth;
    strokeWeight(strokeWidth);
    phi = 0.5*PI;

    dxi = dL + 2 * strokeBorder;
    dyi = strokeWidth + strokeBorder;

    for (xi = 0; xi < width; xi += dxi) {
      for (yi = 0; yi < height; yi += dyi) {
        // draw shadow
        stroke(hue(bgColor), 0.1, brightness(bgColor) - 0.05, 0.2);
        line(
          xi,
          yi + strokeWidth * 0.5,
          xi + dL * sin(phi),
          yi + dL * cos(phi) + strokeWidth * 0.5
        );

        // draw highlight
        stroke(
          hue(bgColor),
          saturation(bgColor),
          brightness(bgColor) + 0.03,
          0.8
        );
        line(xi, yi, xi + dL * sin(phi), yi + dL * cos(phi));
      }
    }
  }
  if (paperType == "fiber") {
    
    // draw fibers
    strokeCap(ROUND)
    for (xi = 0; xi < 2000; xi++) {
      stroke(
        hue(bgColor),
        saturation(bgColor) + fxrandRange(-0.02, 0.02),
        brightness(bgColor) + fxrandRange(-0.02,0.02),
        0.2
      );
      xf = fxrandRange(0, width);
      yf = fxrandRange(0, height);
      strokeWeight(fxrandRange(0.001*minDim, 0.01 * minDim));
      for (yi = 0; yi < fxrandRange(1, 5); yi++) {
        dxf = fxrandRange(-0.02*minDim, 0.02 * minDim);
        dyf = fxrandRange(0, 0.0 * minDim);
        line(xf, yf, xf + dxf, yf + dyf);
        xf = xf + dxf;
        yf = yf + dyf;
      }
    }
    
    // draw specs
    strokeCap(ROUND)
    for (xi = 0; xi < 10000; xi++) {
      noStroke();
      fill(hue(bgColor), 0.1, brightness(bgColor) - 0.1, 0.05);
      ellipse(
        fxrandRange(0, width),
        fxrandRange(0, height),
        fxrandRange(0.003 * minDim, 0.01 * minDim),
        0.01 * minDim
      );
    }


  } 
  if (paperType == "cloth") {
    strokeWeight(0.002*minDim)
    type=fxrand();
    for (nc=0; nc<10000; nc++){
      stroke(hue(bgColor), saturation(bgColor), brightness(bgColor)-0.02, 1)
      
      xo = floor(2*fxrand()) // x orientation, 0 or 1
      yo = 1-xo // y orientation, inverse of x orientation
      
      if (type>0.50) {
        xc = width*round(fxrandRange(0,100))/100
        yc = height*round(fxrandRange(0,100))/100
        xLength = xo*minDim*fxrandRange(-0.10, 0.10)
        yLength = yo*minDim*fxrandRange(-0.10, 0.10)
      } else {
        xc = fxrandRange(0,width)
        yc = fxrandRange(0,height)
        xLength = xo*fxrandRange(0.01, 0.05)*minDim
        yLength = yo*fxrandRange(0.01, 0.05)*minDim
      }

      strokeCap(SQUARE)
      line(xc, yc, xc + xLength, yc+yLength)
      strokeCap(ROUND)
    }
  }
  
  if (paperType == "dots") {
    noStroke()
    
    segs = ceil(2*fxrandRange(1,5))
    dxd = width/segs
    dyd = dxd
    
    if (fxrand()>0.9) {
      dyd = dxd*segs/ceil(2*fxrandRange(1,5))
    }

    for (xd=0; xd<(width); xd+=dxd){
      for (yd=0; yd<(height); yd+=dyd){
        fill((hue(bgColor)+0.0)%1, saturation(bgColor)+0.015, brightness(bgColor)-0.01, 1)
        rect(xd, yd, dxd, dyd,
             0.5*dxd, 0.5*dxd, 0.5*dxd, 0.5*dxd)
      }
    }
  }
  
  else {
  }
  noStroke();
}

function fxrandRange(a, b) {
  return fxrand() * (b - a) + a;
}
