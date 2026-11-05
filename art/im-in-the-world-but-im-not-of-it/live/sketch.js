////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
//                                                                                        //
//         ██╗ ██████╗ ██╗  ██╗███╗   ██╗    ██████╗ ██╗███████╗██╗███╗   ██╗ ██████╗     //
//         ██║██╔═══██╗██║  ██║████╗  ██║    ██╔══██╗██║██╔════╝██║████╗  ██║██╔════╝     //
//         ██║██║   ██║███████║██╔██╗ ██║    ██████╔╝██║███████╗██║██╔██╗ ██║██║  ███╗    //
//    ██   ██║██║   ██║██╔══██║██║╚██╗██║    ██╔══██╗██║╚════██║██║██║╚██╗██║██║   ██║    //
//    ╚█████╔╝╚██████╔╝██║  ██║██║ ╚████║    ██║  ██║██║███████║██║██║ ╚████║╚██████╔╝    //
//     ╚════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝     //
//                                                                                        //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
//
// README
// Hey! How did you find me?! Oh well, if you've gone enough out of your way to peak behind the
// curtain, I might as well explain to you how this thing works.
//      (1) The setup function calls an initialize function `init` and a main function `drawImage`
//      (2) `init` creates a canvas and sets parameters. For code "clarity" some of these
//          parameters are created by functions with short names, like r() for random().
//      (3) `drawImage` draws on the canvas.
//           (i) Three areas are drawn in: the background, the area below a horizon line, and a
//               rectangle where the primary object is set to be drawn.
//          (ii) Iteratively draw a swatch at random within the object's rectangle. The swatch may
//               be reflected below the horizon.
//      (4) A texture is added to the canvas with strokes with `dBG` and grain is added with `sG`.
//
// The functions `drawManyShapes` and `drawBGStrokes` are used in tandem to create an analog
// effect. `drawManyShapes` draws the same shape over and over with slight variations
// according to the parameters set in `init`. `drawBGStrokes` adds additional texture on top of
// the initial swatch.
//
// For brevity some commonly used function names are replaced by custom names. They are:
//      r = (a = 1) => random(a);
//      r2 = (a, b) => random(a, b);
//      N = (a = 0, b = 0, c = 0, d = 0) => noise(a, b, c, d);
//      cV = (x, y) => createVector(x, y);
//      C = (h, s, b, a = 1) => color(h, s, b, a);
//      F = (a) => floor(a);
//
// John Rising

// (1) The setup function calls an initialize function `init` and a main function `drawImage`.
// There is also an "iterate" flag, which when true lets you make 50 at a time and download the
// images. But that's for me.
var iterate = false;
function setup() {
  if (iterate) {
    for (let j = 0; j < 50; j++) {
      init();
      drawImage();
      saveCanvas("iter_" + String(seed), "png");
    }
  } else {
    init();
    drawImage();
    fxpreview();
  }
}

// (2) `init` creates a canvas and sets parameters.
function init() {
  // Initialize canvas and drawing modes
  seed = F(fxrand() * 1e12);
  randomSeed(seed);
  noiseSeed(seed);
  sC();
  colorMode(HSB, 1);
  rectMode(CORNERS);
  noStroke();

  // Set default parameters for drawing shapes
  roughness = r([0.1, 0.1, 1, 1, 2, 3, 5, 10]);
  [colors, bgc, H] = getColors();
  reflectRandom = r() > 0.7;
  warpMagnitude = r([1.5, 3, roughness > 3 ? 1.5 : 5, roughness > 3 ? 2 : 5]);
  warpAngleMagnitude = r([2, 3, 5, 5]);
  swirlMagnitude = PI;
  spiral = false;
  mix = r() > 0.9;
  rExp = 0.7;

  // Get composition properties
  [dimType, xMin, xMax, maxHeight, horizon, reflection] = getCoordinates();

  // Continue setting parameters for drawing shapes
  roughness =
    (dimType == "m") |
    (dimType == "p") |
    (dimType == "n") |
    (dimType == "s") |
    (dimType == "Q") |
    (dimType == "t") |
    (dimType == "f") |
    (dimType == "l")
      ? r(2)
      : roughness;
  warp = dimType !== "Q" && r() > 0.8;
  hard =
    (r() > 0.3 && roughness < 10) |
    (dimType == "m") |
    (dimType == "n") |
    (dimType == "d");
  roughBGStrokes = r([0, hard ? 0.8 : 0.3, 1]);
  BGstrokesFill = hard
    ? r([0.03, 0.05, 0.1, 0.1, 0.04])
    : r([0.02, 0.03, 0.05]);
  warpRandom = r() > 0.8;
  lines = r() > 0.5;

  // Sometimes, draw a high saturation variance case
  if (r() > 0.9 && H !== "B&W") {
    BGstrokesFill = 0.2;
    roughBGStrokes = 0.8;
    discoloration = 0.1;
    satVariance = satControl ? 1 : 3;
    brightVariance = satControl ? 0.8 : 0.3;
    warp = true;
    warpAngleMagnitude = r2(5, 8);
    warpMagnitude =
      r([-1, 1]) * ((dimType == "q") | (dimType == "l") ? r(2) : 5);
    hard = r() > 0.4;
    roughness = 2;
    co = 0.7;
  }

  // Sometimes, swirl it all up!
  swirl = r() > 0.7;
  if (swirl) {
    warp = true;
    warpAngleMagnitude = r([5, 10, 20]);
    warpMagnitude = warpAngleMagnitude > 5 ? r([5, 10]) : 10;
    swirlMagnitude = r() > 0.9 ? 20 * TAU : r([2, 4]) * TAU;
    roughness = 0.5;
    BGstrokesFill = r2(0.02, 0.07);
    hard = warpAngleMagnitude > 10 ? false : r() > 0.7;
    co = r2(0.6, 1);
    spiral = r() > 0.7 && !hard;
  }
}

// (3) `drawImage` draws on the canvas.
drawImage = () => {
  // Background
  background(bgc);
  drawBGStrokes(0, 0, width, height, bgc);

  // draw "ground" plane below horizon
  c0 = colors[1]; // base color
  if (r() > 0.5 && hard) {
    let v = [
      cV(0, horizon),
      cV(width, horizon),
      cV(width, height),
      cV(0, height),
    ];
    fill(c0);
    drawManyShapes(v, hard ? 10 + roughness : 0, c0);
    drawBGStrokes(0, horizon, width, height, c0);
  }
  drawLines(10);

  // fill in primary rectangle
  if (r() > 0.5 && dimType !== "Q" && hard) {
    let v = [
      cV(xMin, horizon),
      cV(xMax, horizon),
      cV(xMax, horizon - maxHeight),
      cV(xMin, horizon - maxHeight),
    ];
    c1 = colors[2];
    fill(c1);
    drawManyShapes(v, hard | (r() > 0.5) ? 20 + roughness : 0, c1);
  }

  // Fill each individual swatch
  for (im = 0; im < colors.length; im++) {
    // Select the color for the swatch
    c = colors[im % colors.length];
    fill(c);

    warp = mix && warpMagnitude > 1 && roughness < 5 ? r() > 0.5 : warp;

    // Set the swatch dimensions
    [xdims, ydims] = getDims(dimType, im, colors.length);
    xw = xMax - xMin;
    yh = maxHeight;
    xc = xMin + xw / 2;
    yc = horizon - yh / 2;
    x1 = xc - (xw * r(xdims)) / 2;
    y1 = yc - (yh * r(ydims)) / 2;
    x2 = xc + (xw * r(xdims)) / 2;
    y2 = yc + (yh * r(ydims)) / 2;
    dy = y2 - y1;

    // Mitigate drawing lines
    if (abs(x1 - x2) < cm / 100 && xdims.length > 1) {
      x2 = lerp(xMin, xMax, r(xdims));
    }
    if ((abs(y1 - y2) < cm / 100) & (ydims.length > 1)) {
      y2 = horizon - r(ydims) * maxHeight;
    }

    // draw local rectangle
    let vec = [cV(x1, y1), cV(x2, y1), cV(x2, y2), cV(x1, y2)];
    // ... or circle
    if (dimType == "Q") {
      vec = [];
      for (let a = 0; a < 40; a++) {
        theta = (TAU * a) / 40;
        rr = min(x2 - x1, y2 - y1) / 2;
        vec[a] = cV(xc + rr * sin(theta), yc + rr * cos(theta));
      }
    }
    drawManyShapes(vec, hard ? 20 + roughness : 0, c);
    drawBGStrokes(x1, y1, x2, y2, c);

    // Draw reflected shape
    if (reflection) {
      vy1 = 2 * horizon - y2;
      vy3 = 2 * horizon - y1;
      dxr =
        (r([-1, 0, 1]) *
          ((vy1 - horizon) / (height - horizon)) *
          reflectionShatter *
          width) /
        2;
      c = reflectRandom ? r(colors) : c;
      v = [
        cV(x1 + dxr, vy1),
        cV(x2 + dxr, vy1),
        cV(x2 + dxr, vy3),
        cV(x1 + dxr, vy3),
      ];

      drawManyShapes(v, hard ? 20 + roughness : 0, c);
      drawBGStrokes(x1 + dxr, vy1, x2 + dxr, vy3, c);
    }
  }
  dBG();
  sG();
  getFeatures();
};

getFeatures = () => {
  window.$fxhashFeatures = {
    Colors: H,
    Warp: warp,
    Hardness: hard ? "hard" : "soft",
  };
};

// Initialize the canvas
sC = () => {
  wW = windowWidth;
  wH = windowHeight;
  [vertDim, horDim] = r([
    [1, 1],
    [5, 4],
    [9, 16],
  ]);

  // This is a bit hacky.
  // Snap our dimensions to a grid. This ensures that various loops used to divide line segments
  // always go through the same number of iterations. This allows calls to random() to be
  // deterministic even when canvas dimensions change.
  precision = horDim == 16 ? 160 : 16;

  if (wW / wH > horDim / vertDim) {
    cy = F(wH / precision) * precision;
    cx = (cy * horDim) / vertDim;
  } else {
    cx = F(wW / precision) * precision;
    cy = (cx * vertDim) / horDim;
  }

  cnv = createCanvas(cx, cy);
  cm = min(cx, cy); // Minimum canvas dimension
};

// Parameters
// Get the rules for the composition.
getCoordinates = () => {
  let xMin = 0; // left edge of field
  let xMax = 0; // right edge of field
  let maxHeight = 0; // maximum height of field
  let aBorder = warpMagnitude < 1.5 ? 0 : 0.2 * cm; // additional border if heavily warped

  // location of horizon
  let horizon = round(
    r([height / 2, height * 0.7 - aBorder, height - 0.1 * cm - aBorder])
  );

  // Select xdims and ydims
  v = "mntsioqfcgpL" + (cx > cy ? "" : "Q");
  dimType = v.charAt(F(r(v.length)));

  // Whether to reflect design below the horizon
  reflection = horizon < height * 0.6 ? true : r() > 0.33;
  reflectionShatter =
    r() + (dimType == "t" ? r(2) : dimType == "q" ? r(2, 5) : 0);
  // Magnitude to "shatter" reflected swatches
  reflection = true;

  // Bounding dimensions
  [xMin, xMax, maxHeight] = r([
    [
      0.1 * cm + aBorder,
      width - 0.1 * cm - aBorder,
      horizon - 0.1 * cm - aBorder,
    ],
    r([
      [0.125 * width, width / 1.6, horizon * 0.8],
      [(1 - 1 / 1.6) * width, (width * 13) / 16, horizon / 1.6],
    ]),
    [0, width, horizon],
  ]);

  // Sometimes, make it a square
  if (r() > 0.7) {
    // default dimensions
    let D = 0.8 * cm;
    let R = D / 2;

    // By default the square is in the center
    horizon = height / 2;
    xMin = width / 2 - R;
    xMax = width / 2 + R;
    maxHeight = reflection ? R : D;
    reflectionShatter = 0;

    // Sometimes the horizon on bottom
    if (r() > 0.5) {
      reflection = false;
      maxHeight = D;
      horizon = height - (cm - D) / 2;
    }

    // Sometimes shift left or right
    if (r() > 2 / 3 && width > height) {
      let dr = r([-1, 1]) * R;
      xMin += dr;
      xMax += dr;
    }
  }
  return [dimType, xMin, xMax, maxHeight, horizon, reflection];
};
// Select colors
getColors = () => {
  let H = r([
    "Cocktails",
    "Planets",
    "Fall",
    "Adobe",
    "Ellsworth",
    "Wine Country",
    "Einstein on the Beach",
    "BLeU",
    "Twilight",
    "Golden Hour",
    "De Stijl",
    "Midnight",
    "B&W",
    "Lassen",
    "Night Fire",
    "Ice",
    "Den Haag",
    "Rembrandt",
    r(["Avery", "New"]),
  ]);

  // Defaults
  discoloration = r([-1, 1]) * r([0.04, 0.07, 0.06, 0.1, 0.12, 0.2]);
  satVariance = r2(0.1, 1);
  brightVariance = r2(0.1, 0.6);
  satControl = r() > 0.5;
  co = r();

  // Choose palette
  switch (H) {
    case "Cocktails":
      hmc = ["#264653", "#E3D091", "#E9B44C", "#9B2915", "#2a9d8f"];
      satControl = true;
      break;
    case "Class Clown":
      hmc = ["#c7405f", "#f2a73d", "#60935D", "#222e50"];
      satControl = true;
      break;
    case "Planets":
      hmc = ["#ffbf70", "#f76f8e", "#96616b", "#37505c"];
      satControl = true;
      break;
    case "Fall":
      hmc = ["#Fe5d26", "#F2C078", "#faedca", "#c1dbb3", "#7ebc89"];
      discoloration /= 2.5;
      satControl = true;
      break;
    case "Adobe":
      hmc = ["#365359", "#AB5C48", "#EBB6B0", "#92B4A7"];
      satVariance = r2(0.2, 0.6);
      brightVariance = r2(0.5, 1);
      satControl = true;
      break;
    case "California Coast":
      hmc = [
        "#4DA1B8",
        "#246B8C",
        "#D4B27D",
        "#5A8C49",
        "#386638",
        "#8C5549",
        "#8C5549",
        "#BA4836",
      ];
      break;
    case "Sierras":
      hmc = [
        "#8C5549",
        "#4C7047",
        "#C9BEB3",
        "#747E80",
        "#A5AD79",
        "#4C5753",
        "#6B818F",
      ];
      break;
    case "Ellsworth":
      hmc = ["#3D95BA", "#C44008", "#EBC12A", "#4A8A33", "#5C204D"];
      satControl = false;
      break;
    case "Wine Country":
      hmc = ["#4E634B", "#88947C", "#88947C", "#B0C29F", "#E3BF9A", "#6B7E8F"];
      satControl = true;
      break;
    case "Einstein on the Beach":
      hmc = r([
        [
          "#25344D",
          "#161d26",
          "#3C4654",
          "#ADB2BA",
          "#2D2D33",
          "#A39E98",
          "#F5EFE1",
        ],
        ["#A39E98", "#ADB2BA", "#000", "#000"],
      ]);
      break;
    case "BLeU":
      hmc = ["#0454A5", "#223F90", "#283880", "#243E8F", "#213179"];
      break;
    case "Twilight":
      hmc = ["#292666", "#955BB5", "#DB4F87", "#145a9c"];
      break;
    case "Golden Hour":
      hmc = ["#596591", "#9EBDF7", "#CEDDF0", "#F7B654", "#DE8D23", "#FCD497"];
      satControl = true;
      discoloration /= 2;
      satVariance = r2(0.2, 0.5);
      break;
    case "De Stijl":
      hmc = ["#B8352C", "#0254a1", "#ebab2d", "#fff", "#fff"];
      satControl = true;
      satVariance = r(0.2);
      brightVariance = r2(0.1, 0.9);
      break;
    case "Midnight":
      hmc = ["#11151f", "#323642", "#473B3B", "#302821", "#1F261F", "#ccd"];
      satControl = true;
      break;
    case "B&W":
      hmc =
        r() > 0.3
          ? [
              "#000012",
              "#faf8f7",
              "#0d0600",
              "#f5f6fa",
              "#04040d",
              "#faf6f2",
              "#0d0906",
              "#f9f7fc",
              "#fffbf7",
              r(["#000005", "#100005"]),
              "#fffffe",
            ]
          : [
              "#000005",
              "#fffff3",
              "#000005",
              "#fffff4",
              "#020100",
              "#fffff2",
              "#000005",
              "#fffff0",
              "#020100",
              "#9B2915",
              "#fffffa",
              r(["#000005", "#100005"]),
            ];
      satVariance = r(0.1);
      brightVariance = r2(0.3, 0.7);
      break;
    case "Lassen":
      hmc = [
        "#A14625",
        "#B0623E",
        "#9E7739",
        "#675F7A",
        "#2E5769",
        "#ADB096",
        "#C99465",
      ];
      satControl = true;
      break;
    case "Night Fire":
      hmc = [
        "#353D45",
        "#353D45",
        "#140021",
        "#2E112A",
        "#1D0933",
        "#001B40",
        "#0C0312",
        "#002026",
        "#140021",
        "#2E112A",
        "#1D0933",
        "#001B40",
        "#0C0312",
        "#002026",
      ];
      hmc =
        r() > 0.5
          ? hmc.concat(["#E89F3F", "#DC632A", "#CA412D"])
          : hmc.concat(["#e10"]);
      break;
    case "Ice":
      hmc = [
        "#C5D5E6",
        "#E4E7EF",
        "#F5EDF2",
        "#E1EDF0",
        "#F5F2FA",
        "#1D5B85",
        "#5B91BD",
        "#FAF5F7",
        "#fff",
        r(["#0B1324", "#fff"]),
      ];
      satControl = true;
      satVariance = r2(0.1, 0.3);
      break;
    case "Den Haag":
      hmc = [
        "#E04A39",
        "#EFB26C",
        "#cba685",
        "#EFDBC5",
        "#56B39F",
        "#30869e",
        "#172f55",
        "#473e45",
        "#CB6B7D",
      ];
      break;
    case "Rembrandt":
      hmc = [
        "#231f20",
        "#3e2e29",
        r(["#20282B", "#3B1B1D"]),
        "#635147",
        "#695105",
        "#9E8535",
        "#D2B965",
        "#D9D4BD",
      ];
      satControl = true;
      satVariance = r(0.3);
      brightVariance = r2(0.5, 1);
      break;
    case "Avery":
      hmc = ["#56a38c", "#cdc8a6", "#785851", "#d4b04f", "#1A1F1B"];
      satVariance = r2(0.1, 0.6);
      satControl = true;
      break;
    case "New":
      hmc = r([
        ["#D4949F", "#FF8095"],
        ["#FA390D", r(["#004EB5", "#FF5197"])],
        ["#0092A8", "#EB074B"],
      ]);
      discoloration *= 2;
      brightVariance = r2(0.1, 0.3);
      satVariance = r2(0.1, 0.5);
      break;
  }

  for (
    let i = 0;
    i < (hmc.length < 3 ? 5 : hmc.length < 8 ? r(3) : r(2));
    i++
  ) {
    hmc = hmc.concat(hmc);
  }
  hmc = r() > 0.8 ? shuffle(hmc) : hmc;
  bgc = hmc[0];

  return [hmc, bgc, H];
};

// Get dimensions
getDims = (dimType, i, n) => {
  let dims0 = [0, 1 / 3, 2 / 3, 1];
  let dims1 = [0, 1];
  let dims2 = [1 / 6, 1 / 3, 1 / 2, 2 / 3, 5 / 6, 1];

  // This started as a, b, c... until I started gutting them.
  switch (dimType) {
    case "c":
      xdims = dims2;
      ydims = dims0;
      break;
    case "f":
      xdims = dims2;
      ydims = [1 / 3];
      break;
    case "g":
      xdims = dims1;
      ydims = [1 / 2, 0.8, 23 / 30, 11 / 15, 21 / 30, 2 / 3];
      break;
    case "i":
      xdims = dims2;
      ydims = dims1;
      break;
    case "L":
      xdims = r([
        [0, 1 / 3, 1 / 2, 2 / 3, 1],
        [0, 1 / 3, 2 / 3, 1],
        [0, 1 / 4, 1 / 2, 3 / 4, 1],
        [0, 0.7, 0.8, 0.9, 1],
      ]);
      ydims = r([
        [0.2, 0.4, 0.6, 0.8, 1],
        [1 / 3, 1 / 2, 2 / 3, 1],
        [0, 1 / 8, 7 / 8, 1],
      ]);
      break;
    case "m":
      xdims = [1 - i / n];
      ydims = [0, r([1, i / n])];
      break;
    case "n":
      xdims = [1 - i / n];
      ydims = [r(0, 1), i / n];
      break;
    case "o":
      xdims = [1 / 2, 1];
      ydims = [1 - i / n, i / n];
      break;
    case "p":
      xdims = [1 - r([i, i - 1]) / n];
      ydims = [1 - r([i, i - 1]) / n];
      break;
    case "q":
      R = 1 - F((5 * i) / n) / 5;
      xdims = [R];
      ydims = [R];
      break;
    case "Q":
      R = 1 - F((5 * i) / n) / 5;
      xdims = [R];
      ydims = [R];
      break;
    case "s":
      xdims = [1 - r([i, i - 1]) / n];
      ydims = [1];
      break;
    case "t":
      ydims = [1 - r([i, i - 1]) / n];
      xdims = [1];
      break;
    default:
      xdims = dims2;
      ydims = dims1;
      break;
  }

  return [xdims, ydims];
};

// Function that layers many transparent shapes onto each other using `imperfectShape`
drawManyShapes = (v, nLayers, c) => {
  // This random seed is used to ensure that each `imperfectShape` in the loop is unique enough
  // from the other shapes
  S = r(99);
  for (let j = 0; j < nLayers; j++) {
    let s = saturation(c);
    s =
      s > 0.7 && satControl && brightness(c) > 0.5 ? 0.7 + (s - 0.7) * 0.1 : s;
    fill(hue(c), s, brightness(c), 0.2 * sqrt((j + 1) / nLayers));
    imperfectShape(v, cm / 100, (roughness * cm) / 100, S + j / nLayers);
  }
};

// Draw texture on top of swatch
drawBGStrokes = (x1, y1, x2, y2, c) => {
  // This random seed is used to ensure that each `imperfectShape` in the loop is unique enough
  // from the other shapes
  S = r(99);
  nStrokes = r([hard ? 100 : 300, swirl ? 300 : 150]);
  for (let k = 0; k < nStrokes; k++) {
    let newB =
      brightness(c) *
      (1 +
        r2(-brightVariance, brightVariance) * co +
        (1 - co) * (0.5 + 0.5 * N((2 * k) / nStrokes, S)) * brightVariance);
    let newS =
      saturation(c) * 1 +
      r2(-satVariance, satVariance) * co +
      (1 - co) * (0.5 + 0.5 * N((2 * k) / nStrokes, S)) * satVariance;
    cLoc = C(
      (hue(c) + N((5 * k) / nStrokes, S) * discoloration) % 1,
      newS > 0.7 && satControl && newB > 0.5 ? 0.7 + (newS - 0.7) * 0.1 : newS,
      newB,
      BGstrokesFill
    );

    // Draw random pentagon. We use `sortClockwise` to avoid self-intersections which look
    // too unnatural.
    v = sortClockwise([
      cV(randomEdge(x1, x2), randomEdge(y1, y2)),
      cV(randomEdge(x1, x2), randomEdge(y1, y2)),
      cV(randomEdge(x1, x2), randomEdge(y1, y2)),
      cV(randomEdge(x1, x2), randomEdge(y1, y2)),
      cV(randomEdge(x1, x2), randomEdge(y1, y2)),
    ]);

    // Different rules apply if roughBGStrokes is triggered
    if (k / nStrokes > roughBGStrokes) {
      dx = r() * ((x2 - x1) / 3);
      dy = r() * ((y2 - y1) / 3);
      x0 = r2(x1, x2 - dx);
      y0 = r2(y1, y2 - dy);
      v = sortClockwise([
        cV(x0, y0),
        cV(x0 + dx, y0),
        cV(x0 + dx, y0 + dy),
        cV(x0, y0 + dy),
      ]);
      cLoc.setAlpha(0.15);
    }

    // dimType == "Q" is a circle, so make the internal shapes circular not rectangular
    if (dimType == "Q") {
      rr = min(x2 - x1, y2 - y1) / 2;
      xc = x1 + (x2 - x1) / 2;
      yc = y1 + (y2 - y1) / 2;
      v = [];
      for (let a = 0; a < 5; a++) {
        theta = r(TAU);
        rrr = rr * r2(0.9, 1);
        v[a] = cV(xc + rrr * sin(theta), yc + rrr * cos(theta));
      }
      v = sortClockwise(v);
    }

    fill(cLoc);
    imperfectShape(
      v,
      cm / (hard ? (warp ? 200 : 100) : 200),
      (roughness * cm) / 100,
      S + k / nStrokes
    );
  }
};

// Function for drawing a shape modified by parameters set in `init`.
// This function takes a reference vector `vec`, divides it into smaller pieces, and warps the
// new points according to the parameters. Points are moved both according to their position
// on the canvas plus some amount of inherent randomness.
imperfectShape = (vec, dL, dW, rr) => {
  beginShape();
  n = 0;
  L = vec.length;
  // For each point of input vector...
  for (g = 0; g < L; g++) {
    v0 = vec[g];
    v1 = vec[(g + 1) % L];
    d = p5.Vector.dist(v0, v1);
    nK = F(10 * (d / dL)) / 10;
    j = 0;
    // ... split it into nK points.
    for (k = 0; k < nK; k++) {
      j = lerp(0, d, k / nK); // get the distance along the line that this point is at

      // Move the points in x and y. There are two components to the translation: a continuous
      // component and a random component. The continuous component is always +/- dW/2. The
      // magnitude of the random component is adjusted by `roughness`. The maximum distance
      // that the point can translate is not dW * (0.5 + roughness), but sqrt(2) * dW *
      // (0.5 + roughness) because the x and y components are translated independently.
      let dx =
        ((2 * N((0.1 * j) / dL, g, rr) - 1) * dW) / 2 + // Noise component is within range +/- dW/2
        r2(-dW, dW) / roughness / 2; // Random component is within range +/- roughness * dW/2
      let dy =
        ((2 * N(1 + (0.1 * j) / dL, g, rr) - 1) * dW) / 2 + // Noise component is within range +/- dW/2
        r2(-dW, dW) / roughness / 2; // Random component is within range +/- roughness * dW/2

      // If warp is true, we use the location of the points on the canvas to determine the
      // continuous component of the translation.
      if (warp) {
        let D =
          warpMagnitude * (warpRandom ? r2(dW * 0.3, dW) : r2(dW * 0.8, dW));
        let xloc = lerp(v0.x, v1.x, j / d) / width; // normalized x position
        let yloc = lerp(v0.y, v1.y, j / d) / height; // normalized y position
        let a =
          swirlMagnitude *
          (spiral
            ? dist((xloc * width) / cm, (yloc * height) / cm, 0.5, 0.5) *
              (1 + 1.5 * N(xloc, yloc))
            : N(warpAngleMagnitude * xloc, warpAngleMagnitude * yloc));
        dx = D * sin(a) + r2(-dW, dW) / roughness / 2;
        dy = D * cos(a) + r2(-dW, dW) / roughness / 2;
      }

      // Translate
      vx = lerp(v0.x, v1.x, j / d) + dx;
      vy = lerp(v0.y, v1.y, j / d) + dy;
      vertex(vx, vy);
      n++;
    }
  }
  endShape();
};

// Texture overlay
dBG = () => {
  // Draw stains.
  noiseDetail(4, 1);
  let nStains = round(r2(1, 10));
  let nP = round(r2(5, 20));
  // For each stain...
  for (let i = 0; i < nStains; i++) {
    let rRef = r2(cm / 20, cm / 2);
    push();
    translate(r(width), r(height));
    let dr = cm * r([r2(0.1, 0.4), r2(0.01, 0.04)]);
    let nK = 20;
    // ... draw successively bigger shapes ...
    for (let k = 0; k < nK; k++) {
      let rMax = rRef + (dr * k) / nK;
      let pts = [];
      // ... made up of a noisy line in polar coordinates.
      for (let j = 0; j < nP; j++) {
        let a = (TAU * j) / nP;
        let r =
          (0.3 + 0.7 * N((10 * j) / nP, i) + 0.2 * N(k / nK, j / nP)) * rMax;
        let x = r * sin(a);
        let y = r * cos(a);
        pts[j] = cV(x, y);
      }

      noFill();
      strokeWeight(dr / r2(1, 5));
      stroke(
        C(
          hue(bgc) + 0.02 * N(k / nK),
          saturation(bgc) - 0.1 * (brightness(bgc) < 0.4 ? 1 / 2 : 1),
          brightness(bgc) + 0.1 * (brightness(bgc) < 0.4 ? 2 : 1),
          0.003 * (1 - k / nK)
        )
      );
      dR(pts, cm, 0);
      noStroke();
    }
    pop();
  }

  // draw texture
  let o = r() > 0.5; // Cross hatch?
  let dx = (dy = cm / r([100, 150])); // Size of grid
  let setTexturec = brightness(bgc) + r([-0.2, 0.2]);
  let mag = r([0.01, 0.03, 0.05]);
  // Draw grid of little strokes to emulate the look of a weaved canvas
  for (let x = 0; x < width; x += dx) {
    for (let y = 0; y < height; y += dy) {
      sW = (r2(0.6, 1) * min(dx, dy)) / 4;
      strokeWeight(sW);
      noFill();
      let dL = r2(0.4, 0.7);
      colorMode(HSB, 1);
      stroke(
        C(hue(bgc), saturation(bgc), setTexturec, N(x / cm, y / cm) * mag)
      );
      line(x, y, x + dL * dx, y + dL * dy);
      if (o) {
        line(x, y, x - dL * dx, y + dL * dy);
        line(x, y, x + dL * dx, y - dL * dy);
      }
      stroke(C(0, 0, 1, r() > 0.5 ? 0.02 : 0));
      point(x + r((dx * dL) / 3), y + r((dy * dL) / 3));
    }
  }
};

// Create a grain.
// A typical method to do this is to modify the pixel array, but the effect is intense enough that
// it looks noticeably different at different resolutions. We'll just create our own grid and draw
// semitransparent white or black squares.
sG = () => {
  p = r() > 0.97 ? 0.1 : 0.05;
  dx = cm / 800;
  dy = dx;
  noStroke();
  rectMode(CORNER);
  for (x = 0; x < width; x += dx) {
    for (y = 0; y < height; y += dy) {
      fill(C(0, 0, r([0, 1]), r(p)));
      rect(x, y, dx, dy);
    }
  }
};

// Draw lines that seem to drip from one side of the canvas
drawLines = (n = 0, c = bgc) => {
  if (lines) {
    s = spiral; // Save the global spiral setting.
    spiral = false; // Turn off the spiral setting off.
    let theta = r([0, PI / 2, PI]);
    //
    for (let i = 0; i < n; i++) {
      let w = (width * r(-1, 1)) / 2; // length of the drip
      let h = r(cm / 10); // max thickness of the drip

      // Save global settings
      let oldWarpAngle = warpAngleMagnitude;
      let oldR = roughness;
      let oldWarp = warpMagnitude;

      // Set global settings so we don't have to pass them to each function
      warpAngleMagnitude = r(5, 10);
      roughness = r([r(2, oldR), oldR]);
      warpMagnitude = min(r(3, 6), oldWarp);

      // Create the reference shape and pass it to `drawManyShapes`
      push();
      translate(r(width), r(height));
      rotate(theta);
      let v = [];
      for (let j = 0; j < 40; j += 2) {
        v[j] = cV(j * w);
        v[j + 1] = cV((j + 1) * w, N((10 * j) / 40) * h);
      }
      v = sortClockwise(v);
      drawManyShapes(v, 20, c);

      // Set the global settings back and pretend nothing happened
      warpAngleMagnitude = oldWarpAngle;
      roughness = oldR;
      warpMagnitude = oldWarp;
      pop();
    }
    spiral = s; // Set the global spiral setting back
  }
};

// Sort an array clockwise
sortClockwise = (v) => {
  V = new Array(v.length);
  a = [];
  let r = [];
  let x = 0;
  let y = 0;
  // get centers
  for (let i = 0; i < v.length; i++) {
    x += v[i].x;
    y += v[i].y;
  }
  let c = cV(x / v.length, y / v.length);
  for (let i = 0; i < v.length; i++) {
    let vtemp = cV(v[i].x - c.x, v[i].y - c.y);

    a[i] = vtemp.heading();
    r[i] = dist(v[i].x, v[i].y, c.x, c.y);

    V[i] = [a[i], r[i], v[i].x, v[i].y];
  }
  let newv = V.sort(function (a, b) {
    return a[0] - b[0];
  });
  V = new Array(newv.length);
  for (let i = 0; i < newv.length; i++) {
    V[i] = cV(newv[i][2], newv[i][3]);
  }
  return V;
};

// Select random points with bias set by rExp
randomEdge = (a = 0, b = 1) => {
  return lerp(a, b, 0.5 + r([-0.5, 0.5]) * r() ** rExp);
};

// Curved shape from polygon
dR = (p, r, s) => {
  // Method from https://editor.p5js.org/davepagurek/sketches/AwgpGbabn.
  // Find the angle `T` of each corner. Find the radius of the circle that could fill that corner
  // without touching the halfway point of either side. Approximate this circle with a cubic bezier
  beginShape();
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const c = p[(i + 2) % p.length];
    const ba = a.copy().sub(b).normalize();
    const bc = c.copy().sub(b).normalize();
    var T = ba.angleBetween(bc);
    const maxR = (min(a.dist(b), c.dist(b)) / 2) * abs(sin(T / 2));
    const cR = min(r, maxR);
    var z = abs(cR / sin(T / 2));
    z = isNaN(z) ? 1 : z;
    const c1 = b.copy().add(ba.copy().mult(z));
    const c2 = b.copy().add(bc.copy().mult(z));
    // https://spencermortensen.com/articles/bezier-circle/
    const bD = 0.5523; // 4 / 3 * tan( pi / 8);
    const p1 = c1.copy().sub(ba.copy().mult(2 * cR * bD));
    const p2 = c2.copy().sub(bc.copy().mult(2 * cR * bD));
    vertex(c1.x, c1.y);
    bezierVertex(p1.x, p1.y, p2.x, p2.y, c2.x, c2.y);
  }
  endShape(CLOSE);
};

// Click to save to canvas
onclick = () => {
  saveCanvas(String(seed), "png");
};

// Common functions
r = (a = 1) => random(a);
r2 = (a, b) => random(a, b);
N = (a = 0, b = 0, c = 0, d = 0) => noise(a, b, c, d);
cV = (x, y) => createVector(x, y);
C = (h, s, b, a = 1) => color(h, s, b, a);
F = (a) => floor(a);
