function setup() {
  cWidth = min(windowWidth, windowHeight);

  randomSeed(fxrand());
  noiseSeed(fxrand());
  createCanvas(cWidth, cWidth);
  colorMode(HSB, 1);
  rectMode(CENTER);
  cols = floor(4 + 5 * fxrand());
  if (fxrand() > 0.95) {
    cols = 20;
  }
  rows = cols;
  frameRate(30);

  noiseDetail(5, 0.95);

  // Properties
  icolorTheme = fxrand();
  ishapeMode = fxrand();

  if (icolorTheme >= 0.0) {
    colorTheme = "Monochromatic";
  }
  if (icolorTheme > 0.07) {
    colorTheme = "Analogous";
  }
  if (icolorTheme > 0.3) {
    colorTheme = "Complementary";
  }
  if (icolorTheme > 0.5) {
    colorTheme = "Triadic";
  }
  if (icolorTheme > 0.8) {
    colorTheme = "Tetradic";
  }

  if (ishapeMode >= 0) {
    shapeMode = "Ordered";
  }
  if (ishapeMode > 0.2) {
    shapeMode = "Lemons";
  }
  if ((ishapeMode > 0.3) & (cols > 4)) {
    shapeMode = "Square";
  }
  if (ishapeMode > 0.5) {
    shapeMode = "Circles";
  }
  if (ishapeMode > 0.7) {
    shapeMode = "Random";
  }

  drawInner = false;
  if (
    (fxrand() > 0.5) |
    (colorTheme == "Monochromatic") |
    (shapeMode == "Square")
  ) {
    drawInner = true;
  }
  darkMode = false;
  if ((fxrand() > 0.85) & (colorTheme != "Monochromatic") & (cols > 4)) {
    darkMode = true;
  }
  animated = false;
  if (fxrand() > 0.98) {
    animated = true;
  }
  shadow = false;
  if ((fxrand() > 0.75) & (shapeMode != "Square")) {
    shadow = true;
  }
  strokes = false;
  if (fxrand() > 0.8) {
    strokes = true;
  }

  decay = false;
  if (
    (fxrand() > 0.9) &
    (cols >= 8) &
    (animated == false) &
    (shapeMode == "Square")
  ) {
    decay = true;
  }

  // Initial color
  hi = fxrand();
  sat = 0.7 + 0.2 * fxrand();
  bi = 0.9 + 0.05 * fxrand();
  h2Var = fxrand();
  h3Var = fxrand();
  h4Var = fxrand();

  if (darkMode) {
    bi = 0.5 + 0.1 * fxrand();
  } else {
    bi = bi;
  }
}

function draw() {
  // Colors
  switch (colorTheme) {
    case "Monochromatic":
      si = sat;
      h1 = hi;
      s1 = si;
      b1 = bi;
      h2 = hi;
      s2 = si;
      b2 = bi;
      h3 = hi;
      s3 = si;
      b3 = bi;
      h4 = hi;
      s4 = si;
      b4 = bi;
      break;
    case "Analogous":
      si = sat;
      h1 = hi + 0.0;
      s1 = si;
      b1 = bi;
      h2 = hi + 0.25 + 0.1 * h2Var;
      s2 = si;
      b2 = bi;
      h3 = hi - 0.25 + 0.1 * h3Var;
      s3 = si;
      b3 = bi;
      h4 = hi + 0.25 + 0.21 * h4Var;
      s4 = si;
      b4 = bi;
      break;
    case "Complementary":
      si = sat;
      h1 = hi;
      s1 = si;
      b1 = bi;
      h2 = hi + 0.5 * h2Var;
      s2 = si;
      b2 = bi;
      h3 = hi + 0.5 * h3Var;
      s3 = si;
      b3 = bi;
      h4 = h4Var;
      s4 = si;
      b4 = bi;
      break;
    case "Triadic":
      si = sat;
      h1 = hi;
      s1 = si;
      b1 = bi;
      h2 = hi + 0.03 * h2Var;
      s2 = si;
      b2 = bi;
      h3 = hi + 0.33 + 0.03 * h3Var;
      s3 = si;
      b3 = bi;
      h4 = hi + 0.66 + 0.03 * h4Var;
      s4 = si;
      b4 = bi;
      break;
    case "Tetradic":
      si = sat;
      h1 = hi;
      s1 = si;
      b1 = bi;
      h2 = hi + 0.25 + 0.1 * h2Var;
      s2 = si;
      b2 = bi;
      h3 = hi + 0.0 + 0.25 * h3Var;
      s3 = si;
      b3 = bi;
      h4 = hi + 0.25 + 0.1 * h4Var;
      s4 = si - 0.2;
      b4 = bi;
      break;
  }

  if (animated) {
    h1 = h1 + millis() * 1e-4;
    h2 = h2 + millis() * 1e-4;
    h3 = h3 + millis() * 1e-4;
    h4 = h4 + millis() * 1e-4;
  }

  c1 = color(h1 % 1, s1 % 1, b1 % 1);
  c2 = color(h2 % 1, s2 % 1, b2 % 1);
  c3 = color(h3 % 1, s3 % 1, b3 % 1);
  c4 = color(h4 % 1, s4 % 1, b4 % 1);

  // Draw grid
  cell_width = width / cols;
  cell_height = height / rows;
  background((hue(c1) + 0.5) % 1, 0.05, 0.96);

  for (x = 1; x < cols - 1; x++) {
    for (y = 1; y < rows - 1; y++) {
      // Where to draw
      xcoord = cell_width * x;
      ycoord = cell_height * y;

      // Radii of cells
      switch (shapeMode) {
        case "Ordered":
          r1 = (cell_width * y) / rows;
          r2 = (cell_height * x) / rows;
          r3 = (cell_width * y) / cols;
          r4 = (cell_height * x) / cols;
          break;
        case "Lemons":
          r1 = cell_width * (0.2 + 0.3 * floor(noise(x / cols, y / rows)));
          r2 = cell_height * (0.5 - 0.2 * floor(noise(x / cols, y / rows)));
          r3 = cell_width * (0.2 + 0.3 * floor(noise(x / cols, y / rows)));
          r4 = cell_height * (0.5 - 0.2 * floor(noise(x / cols, y / rows)));
          break;
        case "Square":
          r1 = r2 = r3 = r4 = 0;
          break;
        case "Circles":
          r1 = r2 = r3 = r4 = cell_width;
          break;
        case "Random":
          r1 = (cell_width * floor(noise(x / cols, y / rows))) / 4;
          r4 = r3 = r2 = r1;
          strokes = false;
          break;
      }

      // Color of cell and inner shape
      c = interpColors();

      // Inner Shape Color
      ci = color((hue(c) + 0.5) % 1, 0.6, 0.9);
      switch (colorTheme) {
        case "Monochromatic":
          c = color(hue(c) % 1, noise(x / rows) % 1, noise(y / cols) % 1);
          ci = color(hue(c) % 1, 0.1, 0.9);
          break;
        case "Analogous":
          ci = color((hue(c) + 0.1) % 1, 0.6, 0.9);
          break;
        case "Complementary":
          ci = color((hue(c) + 0.5) % 1, 0.6, 0.9);
          break;
        case "Tetradic":
          ci = color((hue(c) + 0.25) % 1, 0.6, 0.9);
          break;
      }
      if (decay & (noise(x / cols, y / cols) ** 2 < (1.5 * y) / cols)) {
      } else {
        drawElement();
      }
    }
  }
}

function interpColors() {
  xi = x / (cols - 1);
  yi = y / (rows - 1);

  w1 = (1 - xi) * (1 - yi);
  w2 = (1 - xi) * yi;
  w3 = xi * (1 - yi);
  w4 = xi * yi;

  h = w1 * h1 + w2 * h2 + w3 * h3 + w4 * h4;
  s = w1 * s1 + w2 * s2 + w3 * s3 + w4 * s4;
  b = w1 * b1 + w2 * b2 + w3 * b3 + w4 * b4;

  c = color(h % 1, s % 1, b);

  return c;
}

function drawElement() {
  push();
  strokeWeight(cell_width * 0.01);
  translate(xcoord + cell_width / 2, ycoord + cell_height / 2);
  topsyTurvy = true;
  if (decay) {
    rotate(((1 - y) / rows) * noise(y));
  }
  if (shadow) {
    fill(ci);
    noStroke();
    if (strokes) {
      stroke(ci);
    } else {
      noStroke(ci);
    }
    rect(
      0.1 * cell_width,
      0.1 * cell_height,
      cell_width,
      cell_height,
      r1,
      r2,
      r3,
      r4
    );
  }
  fill(c);
  if (strokes) {
    stroke(ci);
  } else {
    noStroke();
  }
  rect(0, 0, cell_width, cell_height, r1, r2, r3, r4);
  if (drawInner) {
    fill(ci);
    if (strokes) {
      stroke((hue(c) + hue(ci)) % 1, saturation(ci), brightness(ci));
    } else {
      noStroke();
    }
    rect(
      0,
      0,
      cell_width * 0.5,
      cell_height * 0.5,
      r1 * 0.5,
      r2 * 0.5,
      r3 * 0.5,
      r4 * 0.5
    );
  }

  pop();
}
