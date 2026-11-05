function setup() {
  createCanvas(windowWidth, windowHeight);
  minDim = min(windowWidth, windowHeight);
  background(HCYtoRGB(0.53, 0.00, 1.0));

  inspiration = randIndex(["Anuszkiewick", "Riley"]);

  // Set drawing space as square in center of canvas
  minBorder = 0.1 * minDim;
  w = minDim - 2 * minBorder;
  h = minDim - 2 * minBorder;
  xStart = 0.5 * width - 0.5 * w;
  yStart = 0.5 * height - 0.5 * h;
  xEnd = 0.5 * width + 0.5 * w;
  yEnd = 0.5 * height + 0.5 * h;

  //drawPacking();

  switch (inspiration) {
    case "Anuszkiewick":
      [cols, rows] = randIndex([
        [50, 1],
        [1, 50],
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 3],
        [4, 4]
      ]);
      gridType = randIndex(["squares", "circles", "evolving"]);
      if (max(cols, rows) > 10) {
        gridType = "squares";
      }
      colorScheme = randIndex(["triadic", "complementary", "monochrome"]);

      drawGrid(xStart, xEnd, yStart, yEnd, cols, rows, gridType, colorScheme);
      break;
    case "Riley":
      colorized=randIndex([false,false,false,true]);
      colorSeed = fxrand();
      if (fxrand() < 0.3) {
        drawZebraCircle(width/2, height/2, max(height,width), 100, 50, true, 0, colorized, colorSeed)
        fill(255,255,255); noStroke(); circle(width/2, height/2, minDim*0.8)
        drawZebraCircle(width/2, height/2, minDim*0.4, randIndex([20, 50, 100]), randIndex([5, 10, 20]), randIndex([true, false]), 0.2, colorized, colorSeed)
      } else if (fxrand() < 0.6) {
        nGrid = randIndex([2,3,5]);
        drawZebraCircle(width/2, height/2, max(height,width), 100, 10, false, 0, colorized, colorSeed)
        dxi = (xEnd-xStart)/nGrid;
        dyi = (yEnd-yStart)/nGrid;
        fill(255,255,255); rectMode(CORNERS); rect(xStart+dxi*0.5, yStart+dyi*0.5, xEnd-dxi*0.5, yEnd-dyi*0.5)

        for (var xi = xStart+0.5*dxi; xi<=xEnd; xi+=dxi) {
          for (var yi = yStart+0.5*dyi; yi<=yEnd; yi+=dyi) {
            //square(xi-dxi/2,yi-dyi/2,min(dxi,dyi))
            if (xi<xEnd-dxi & yi<yEnd-dyi){
                drawZebraCircle(xi+dxi/2, yi+dyi/2,0.5*(1-0*sqrt(2))*min(dxi,dyi),randIndex([20,30]),5,false,0.1,colorized, colorSeed)
              }
            fill(255,255,255); noStroke();
            circle(xi,yi,min(dxi,dyi))
            drawZebraCircle(xi,yi,0.5*min(dxi,dyi),50,10, false,0.2,colorized, colorSeed)
          }
        }
      }
      else {
        colorScheme = randIndex([
          "triadic",
          "complementary",
          "monochrome",
          "b&w",
          "hue shift",
        ]);
        drawZebraCircle(width/2, height/2, max(height,width), 100, 50, true, 0, false, 0)
        gapFactor = 1.15;
        drawZebraPattern(
          xStart,
          xEnd,
          yStart,
          yEnd,
          floor(fxrandRange(10, 51)),
          floor(fxrandRange(20, 51)),
          colorScheme,
          gapFactor,
          randIndex([true, false]));
      }
      
      break;
  }
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

function drawSquareTarget(nIter, x, y, w, h, h1, colorScheme, radiusFactor) {
  // Initialize color variables as default "triadic"
  var h2 = (h1 + 0.33) % 1;
  var h3 = (h1 + 0.67) % 1;

  var c1 = 1; //0.0 + 0.7*(1-y/height);
  var c2 = 1; //0.7;
  var c3 = 1; //0.7 - 0.5*(1-y/height);

  var y1 = 0.5 - 0.5 * (1 - y / height);
  var y2 = 0.5 + 0.5 * (1 - y / height);
  var y3 = 0.5 - 0.5 * (1 - y / height);

  switch (colorScheme) {
    case "triadic":
      break;
    case "complementary":
      h2 = (h1 + 0.1) % 1;
      h3 = (h1 + 0.5) % 1;
      break;
    case "monochrome":
      h2 = (h1 + 0.0) % 1;
      h3 = (h1 + 0.0) % 1;

      c1 = 0; //0.0 + 0.7*(1-y/height);
      c2 = 0.5; //0.7;
      c3 = 1; //0.7 - 0.5*(1-y/height);

      y1 = 0.5 - 0.5 * (1 - y / height);
      y2 = 0.5 + 0.5 * (1 - y / height);
      y3 = 0.5 - 0.5 * (1 - y / height);
      break;
  }

  for (n = 0; n < nIter; n++) {
    if (n % 2 != 0) {
      fill(
        HCYtoRGB((h1 + (0.5 * n) / nIter) % 1, 0.8, 0.2 + 0.3 * (1 - n / nIter))
      );
    } else {
      fill(HCYtoRGB((h2 + (0.5 * n) / nIter) % 1, 0.8, 0.5));
    }

    if (n % 3 == 0) {
      fill(HCYtoRGB(h1, c1, y1));
    } else if (n % 3 == 1) {
      fill(HCYtoRGB(h2, c2, y2));
    } else if (n % 3 == 2) {
      fill(HCYtoRGB(h3, c3, y3));
    }

    rect(
      x,
      y,
      w * (1 - n / nIter),
      h * (1 - n / nIter),
      (radiusFactor * min(w, h) * n) / nIter
    );
  }
}

function drawCircleTarget(nIter, x, y, d, h1, colorScheme) {
  noStroke();
  // Default triadic
  h2 = (h1 + 0.33) % 1;

  switch (colorScheme) {
    case "triadic":
      break;
    case "complementary":
      h2 = (h1 + 0.5) % 1;
      break;
    case "monochrome":
      h2 = h1;
      break;
  }

  for (n = 0; n < nIter; n++) {
    if (n % 2 != 0) {
      fill(HCYtoRGB(h1, 0.8, 0.2 + 0.5 * (1 - n / nIter)));
    } else {
      fill(HCYtoRGB(h2, 0.8, 0.5));
    }
    circle(x, y, d * (1 - n / nIter));
  }
}

function drawGrid(xStart, xEnd, yStart, yEnd, nx, ny, gridType, colorScheme) {
  dx = (xEnd - xStart) / nx;
  dy = (yEnd - yStart) / ny;
  
  console.log("Grid", nx, ny, gridType, colorScheme)

  nIter = ceil(fxrandRange(6, 20));
  if (max(nx, ny) > 10) {
    nIter = randIndex([20, 30, 40]);
  }

  rectMode(CENTER);
  noStroke();

  h0 = fxrand();
  hueScale = fxrandRange(0.25, 5);
  hueDir = randIndex([0, 0.5, 0.5, 1]);
  
  if (gridType=="circles" | (gridType == "evolving")){
    drawCircleTarget(50, width/2, height/2, sqrt(2)*max(width,height), h0, "complementary")
  } else if (gridType=="squares"){
    drawSquareTarget(50, width/2, height/2, max(width,height), max(width,height), h0, "complementary", 0)
  }

  for (x = xStart + 0.5 * dx; x <= xEnd; x += dx) {
    for (y = yStart + 0.5 * dy; y <= yEnd; y += dy) {
      h1 =
        (h0 + hueScale * ((hueDir * x) / width + ((1 - hueDir) * y) / height)) %
        1;
      if (gridType == "squares") {
        drawSquareTarget(nIter, x, y, dx, dy, h1, colorScheme, 0);
      } else if (gridType == "evolving") {
        drawSquareTarget(nIter, x, y, dx, dy, h1, colorScheme, 0.25);
      } else if (gridType == "circles") {
        if(x<xEnd-dx & y<yEnd-dy){
          drawCircleTarget(nIter, x+0.5*dx, y+0.5*dx, dx, h1, colorScheme);
        }
        drawCircleTarget(nIter, x, y, dx, h1, colorScheme);
      }
    }
  }
}

function drawZebraCircle(x, y, radius, nLines, nRadius, curved, radiusFactor, colorized, colorSeed) {
  // initialize parameters that control geometry
  var points = [];
  var xOff = randIndex([0, 0.15, 0.3]);
  var yOff = xOff; //randIndex([0, xOff]);
  rotAngle = TWO_PI * fxrand();
  dx = radius * (yOff * sin(rotAngle) - xOff * cos(rotAngle));
  dy = radius * (-yOff * cos(rotAngle) - xOff * sin(rotAngle));
  xScale = 1 / (1 - xOff);
  yScale = 1 / (1 - yOff);

  // Create reference vector for each line that extends radially from the center
  push();
  translate(x + dx * xScale, y + dy * yScale);
  rotate(rotAngle);
  scale(xScale, yScale);
  for (var i = 0; i <= nRadius; i++) {
    points.push([
      radius * (radiusFactor + ((1-radiusFactor) * i) / nRadius),
      (randIndex([-0.5, 0, 0.5]) * PI) / (0.5 * nLines),
    ]);
  }
  
  // Draw each line, adjusting vector to achieve desired composition
  for (var j = 0; j < nLines; j++) {
    if (colorized){fill(HCYtoRGB((colorSeed + j/2)%1, 0.8, 0.2))} else {fill(0,0,0)}
    noStroke();
    beginShape();
    // +r direction
    for (var k = 0; k <= nRadius; k++) {
      r = points[k][0];
      a = points[k][1];
      aLine = (TWO_PI * j) / nLines;
      xNew = r * ((1 - xOff) * cos(aLine + a) + xOff);
      yNew = r * ((1 - yOff) * sin(aLine + a) + yOff);
      if (curved) {
        curveVertex(xNew, yNew);
      } else {
        vertex(xNew, yNew);
      }
    }
    // -r direction
    for (k = nRadius; k >= 0; k--) {
      r = points[k][0];
      a = points[k][1];
      aLine = (TWO_PI * (j + 0.5)) / nLines;
      xNew = r * ((1 - xOff) * cos(aLine + a) + xOff);
      yNew = r * ((1 - yOff) * sin(aLine + a) + yOff);
      if (curved) {
        curveVertex(xNew, yNew);
      } else {
        vertex(xNew, yNew);
      }
    }
    endShape();
  }
  pop();
}

function drawZebraPattern(
  xStart,
  xEnd,
  yStart,
  yEnd,
  nx,
  ny,
  colorScheme,
  gapFactor,
  curved
) {
  var dx = (xEnd - xStart) / nx;
  var dy = (yEnd - yStart) / ny;
  var iter = 0;
  hueScale = fxrandRange(0, 2);

  // Reference shape
  var points = [];
  for (var n = 0; n <= nx; n++) {
    points.push([n * dx, dy * fxrandRange(-0.2, 0.2)]);
  }

  noStroke();
  var h0 = fxrand();
  var scale = fxrand();
  for (y = yStart; y < yEnd; y += dy) {
    switch (colorScheme) {
      case "triadic":
        h = (h0 + iter / 3) % 1;
        c = 0.8;
        Y = 0.6;
        break;
      case "complementary":
        h = (h0 + iter / 2) % 1;
        c = 0.8;
        Y = 0.8;
        break;
      case "monochrome":
        h = h0;
        c = 0.8*(iter%2);
        Y = 0.5*(iter%2);
        break;
      case "b&w":
        h = 0;
        c = 0;
        Y = iter%2;
        break;
      case "hue shift":
        h = (h0 + (hueScale * iter) / ny) % 1;
        c = 0.8;
        Y = 0.5;
    }

    fill(HCYtoRGB(h, c, Y));
    iter++;
    beginShape();
    for (n = 0; n <= nx; n++) {
      if (curve) {
        curveVertex(
          xStart + points[n][0],
          y + points[n][1] * 2 * (1 + (y - yStart) / (yEnd - yStart)) ** 2
        );
      } else {
        vertex(
          xStart + points[n][0],
          y + points[n][1] * 2 * (1 + (y - yStart) / (yEnd - yStart)) ** 2
        );
      }
    }
    for (n = nx; n >= 0; n--) {
      if (curved) {
        curveVertex(
          xStart + points[n][0],
          y +
            points[n][1] * 2 * (1 + (y - yStart) / (yEnd - yStart)) ** 2 +
            gapFactor * dy
        );
      } else {
        vertex(
          xStart + points[n][0],
          y +
            points[n][1] * 2 * (1 + (y - yStart) / (yEnd - yStart)) ** 2 +
            gapFactor * dy
        );
      }
    }
    endShape(CLOSE);
  }
}

function randIndex(array) {
  return array[floor(fxrand() * array.length)];
}

function fxrandRange(a, b) {
  return fxrand() * (b - a) + a;
}
