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

setup = () => {
  seed = F($fx.rand() * 1e9);
  randomSeed(seed);
  noiseSeed(seed);
  sC();
  rectMode(CORNERS);
  noStroke();
  [colors, bgc, H] = getColors();
  colorMode(RGB);
  background(bgc);

  opt = [
    [1, 1, 6, 6, 7],
    [1, 1, 1, 1, 6, 7, 6],
    [1, 1, 2, 2],
    [0],
    [1, 1, 1],
    [r([2, 0, 1]), 3, 3, 3, 6, 6],
    [4, 4, 4, 4, 4, 4, 4, 6, 4],
    [1, 6, 6],
    [6, 6, 6, 6, 6],
    [1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
  ];
  nt = F(r(opt.length));
  types = opt[nt];

  inverseBezier = r() > 0.2;

  for (let z = 0; z < types.length; z++) {
    type = d(getParams(types[z]));
  }
  sG();
  getFeatures();
  console.log(H, nt);
};

onclick = () => {
  saveCanvas(String(seed), "png");
};

getParams = (type) => {
  noiseWarp = (r() > 0.7) | (types.length < 4) ? r([2, 3, 20]) : r(0.2);
  [
    nk,
    nj,
    ni,
    strokeLength,
    radius,
    variation,
    nN,
    sc,
    gradientType,
    opacity,
    baseOpacity,
    nFactor,
    afade,
    cvar,
    cvarInt,
  ] =
    type == 0
      ? [
          r([3, 10]),
          200,
          3,
          cm * r(0.2, 0.5) * (r() > 0.8 ? 0.1 : 1),
          r(0.003, 0.006) * cm,
          r([0.5, 2]),
          10,
          2 * cm,
          2,
          r([32, 64]),
          r([32, 64]),
          0,
          false,
          80, //r() > 0.9 ? 0 : 80,
          r([2, 1.1, 1.01, 1.01, 1.01, 1.01, 1.01]),
        ]
      : type == 1
      ? [
          1, // TODO: just 8? 1?
          200,
          3,
          0.01 * cm,
          0,
          r(0.5),
          r([3, 8]),
          r([-2, 2]) * cm,
          2,
          4,
          0,
          0,
          false,
          0,
          1,
        ]
      : type == 2
      ? [
          20,
          400,
          3,
          r([0.02, 0.01]) * cm,
          0.1 * cm,
          r([0, 0.1, 0.5, 2]),
          r([2, 5]),
          cm,
          random([1, 2]),
          64,
          0,
          0,
          true,
          20,
          1 + r([-1, 1]) / 400,
        ]
      : type == 3
      ? [
          1,
          500,
          3,
          0.02 * cm,
          r(0.1, 1) * cm,
          0.4,
          4,
          2 * cm,
          1,
          4,
          16,
          10,
          true,
          20,
          1 + r([-1, 1]) / 500,
        ]
      : type == 4
      ? [
          5, // r([5, 5, 5, 300]), //r(10),
          300,
          4,
          r([0.005, 0.003, 0.01]) * cm,
          0,
          r([1, 4]), //r([1, type4Step ? r([2,5]) : 10]), // TODO: fix
          1,
          r([0.1, 0.2, 0.5]) * cm,
          random([1, 2]),
          70, //0.4 * 255, //r([0.1, 10]) * 255,
          0,
          r() > 0.5 ? 0 : noiseWarp,
          true,
          40,
          1 + r([-1, 1]) / 300,
        ]
      : type == 5
      ? [
          8,
          1000,
          3,
          0.01 * cm,
          0.01 * cm,
          r([0, 0, 1, 2]),
          5,
          0.5 * cm,
          1,
          r([16, 128]),
          0,
          r(3),
          false,
          20,
          1 + r([-1, 1]) / 1000,
        ]
      : type == 6
      ? [
          20,
          200,
          4,
          (r() > 0.7 ? 0.1 : 0.01) * cm,
          inverseBezier ? -0.0005 * cm : 0,
          r([0, 0.1, 1, 10]),
          r([1, 2, 20]),
          r([0.03, 0.05, 0.1]) * cm,
          r([1, 2]),
          0.5 * 255, //r([0.1, 10]) * 255,
          0,
          noiseWarp,
          true,
          50,
          1 + r([-1, 1]) / 200,
        ]
      : type == 7
      ? [
          r([100, 300]),
          300,
          4,
          r([0.005, 0.003, 0.01]) * cm,
          r([0, 0.01]) * cm,
          r([0.7, 1.5]), //r([1, type4Step ? r([2,5]) : 10]), // TODO: fix
          1,
          r([0.5, 1, 1.5]) * cm,
          random([1, 2]),
          40, //0.4 * 255, //r([0.1, 10]) * 255,
          0,
          r([0, 1]),
          true,
          40,
          1 + r([-1, 1]) / r2(50, 300),
        ]
      : type == 8
      ? [
          20, // r([5, 5, 5, 300]), //r(10),
          300,
          5,
          r([0.005, 0.003, 0.05]) * cm,
          0.003 * cm,
          100, //r([1, type4Step ? r([2,5]) : 10]), // TODO: fix
          1,
          r([0.1, 0.2, 0.5, 0.5]) * cm,
          random([1, 2]),
          10, //0.4 * 255, //r([0.1, 10]) * 255,
          0,
          noiseWarp,
          true,
          40,
          1 + r([-1, 1]) / 300,
        ]
      : 0;
  return [
    nk,
    nj,
    ni,
    strokeLength,
    radius,
    variation,
    nN,
    sc,
    gradientType,
    opacity,
    baseOpacity,
    nFactor,
    afade,
    type,
    cvar,
    cvarInt,
  ];
};

d = (params) => {
  [
    nk,
    nj,
    ni,
    strokeLength,
    radius,
    variation,
    nN,
    sc,
    gradientType,
    opacity,
    baseOpacity,
    nFactor,
    afade,
    type,
    cvar,
    cvarInt,
  ] = params;

  // Draw nN strokes between c0 and c1.
  for (let n = 0; n < nN; n++) {
    // Center coordinates of the start and end of each shape
    border = type == 1 ? cm / 3 : cm / 5;
    cx0 = random(border, width - border);
    cy0 = random(border, height - border);
    cx1 = width - cx0;
    cy1 = height - cy0;

    if (type == 1 && r() > 0.6) {
      cx1 = random(border, width - border);
      cy1 = random(border, height - border);
    }

    if (r() > 0.8 && (type == 4 || type == 6 || type == 7)) {
      cx0 = r(width);
      cy0 = r(height);
      cx1 = r(width);
      cy1 = r(height);
    }

    // Draw nk shapes between c0 and c1.
    for (let k = 0; k < nk; k++) {
      crng = (cm / 2) * N(k / nk);
      cx = lerp(cx0, cx1, k / nk);
      cy = lerp(cy0, cy1, k / nk);

      // Draw nj individual shapes for each k.
      for (let j = 0; j < nj; j++) {
        nexp = 0.3;
        scl = (1 - j / nj) ** nexp;
        dx = (strokeLength * (1 - 2 * noise(n))) / 2;
        dy = (strokeLength * (1 - 2 * noise(n + 1))) / 2;

        if (nFactor > 0) {
          dx =
            (strokeLength *
              (1 -
                2 *
                  noise((nFactor * cx) / width, (nFactor * cy) / height, 0))) /
            2;
          dy =
            (strokeLength *
              (1 -
                2 *
                  noise((nFactor * cx) / width, (nFactor * cy) / height, 1))) /
            2;
        }

        cx += dx;
        cy += dy;

        // Coordinates of the shape
        p = [];
        for (let i = 0; i < ni; i++) {
          p[i] = cV(
            cx +
              (scl *
                sc *
                (0.3 +
                  0.7 *
                    (1 -
                      2 *
                        noise(
                          (variation * j) / nj,
                          i,
                          (variation * k) / nk
                        )))) /
                2,
            cy +
              (scl *
                sc *
                (0.3 +
                  0.7 *
                    (1 -
                      2 *
                        noise(
                          i,
                          (variation * j) / nj,
                          (variation * k) / nk
                        )))) /
                2
          );
        }
        to = color(colors[(n + k + 1) % colors.length]);
        from = color(colors[(n + k + 1) % colors.length]);
        c = lerpColor(
          from,
          to,
          gradientType == 1 ? (j / nj) ** 0.8 : abs(1 - 2 * (j / nj) ** 3)
        );
        dc = cvar * (1 - 2 * (j % cvarInt));
        fill(
          red(c) + dc,
          green(c) + dc,
          blue(c) + dc,
          baseOpacity +
            opacity * (afade ? sin((PI * j) / nj) : abs((2 * j) / nj - 1))
        );
        dR(p, radius, cm);
      }
    }
  }
};

sC = () => {
  wW = windowWidth;
  wH = windowHeight;
  [vertDim, horDim] = r([
    [1, 1],
    [5, 4],
    [9, 16],
  ]);

  // Determine which side
  if (wW / wH > horDim / vertDim) {
    cy = F(wH / 16) * 16;
    cx = (cy * horDim) / vertDim;
  } else {
    cx = F(wW / 16) * 16;
    cy = (cx * vertDim) / horDim;
  }

  cnv = createCanvas(cx, cy);
  cm = min(cx, cy);
};

sG = () => {
  p = r() > 0.97 ? 20 : 10;
  loadPixels();
  for (i = 0; i < pixels.length; i += 4) {
    dp = r2(-1, 1) * p;
    pixels[i + 0] += dp;
    pixels[i + 1] += dp;
    pixels[i + 2] += dp;
  }
  updatePixels();
};

getColors = () => {
  let H = r([
    //"Cocktails",
    // "Class Clown", //
    // "Planets", //
    // "Watermelon",
    // "Fall",
    // "Adobe",
    // "California Coast",
    // "Sierras", //
    // "Ellsworth",
    // "Wine Country",
    // "Einstein on the Beach",
    // "BLeU",
    // "Twilight",
    "Golden Hour",
    // "De Stijl",
    // "Midnight", //
    "B&W",
    //"Lassen",
    "Night Fire",
    "Ice",
    "Ice",
    "Den Haag",
    "Coffee",
    "Red",
    "Tobacco",
    "90s",
    "Fair",
    "Kazuhiro",
    "Butterscotch",
  ]);

  // Choose palette
  switch (H) {
    case "Cocktails":
      hmc = ["#264653", "#E3D091", "#E9B44C", "#9B2915", "#2a9d8f"];
      break;
    case "Class Clown":
      hmc = ["#c7405f", "#f2a73d", "#60935D", "#222e50"];
      break;
    case "Planets":
      hmc = ["#ffbf70", "#f76f8e", "#96616b", "#37505c"];
      break;
    case "Watermelon":
      hmc = ["#da2c38", "#226f54", "#87c38f", "#f0b67f"];
      break;
    case "Fall":
      hmc = ["#Fe5d26", "#F2C078", "#faedca", "#c1dbb3", "#7ebc89"];
      break;
    case "Adobe":
      hmc = ["#365359", "#AB5C48", "#EBB6B0", "#92B4A7"];
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
      break;
    case "Wine Country":
      hmc = ["#4E634B", "#88947C", "#88947C", "#B0C29F", "#E3BF9A", "#6B7E8F"];
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
      break;
    case "De Stijl":
      hmc = ["#B8352C", "#0254a1", "#ebab2d", "#fff", "#fff"];
      break;
    case "Midnight":
      hmc = ["#11151f", "#323642", "#473B3B", "#302821", "#1F261F"];
      break;
    case "Red":
      hmc = r([
        ["#4E0619", "#600D0D", "#FAF2E7", "#F6FEFF"],
        ["#54101B", "#030119", "#200", "#300", "#610", "#711"],
      ]);
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
    case "Coffee":
      hmc = [
        "#3B1305",
        "#b37c5f",
        "#FAD9B9",
        "#91462A",
        "#4F2911",
        "#240B02",
        "#E6C0A1",
      ];
      break;
    case "Tobacco":
      hmc = ["#823434", "#173B44", "#D9DAC8", "#271215"];
      break;
    case "90s":
      hmc = ["#DE3A73", "#DE5049", "#DD651F", "#DB8323", "#D9A027", "#47A5C2"];
      break;
    case "Fair":
      hmc = [
        "#121939",
        "#707A93",
        "#C9C5B3",
        "#427D70",
        "#121939",
        "#707A93",
        "#C9C5B3",
        "#427D70",
        "#DF6D2C",
      ];
      break;
    case "Kazuhiro":
      hmc = ["#CF5D00", "#9FB9C9", "#A8BBBA", "#0F1B27", "#D8E2D1"];
      break;
    case "Butterscotch":
      hmc = ["#C9924A", "#426249", "#A06450", "#A76985", "#8388BD"];
      break;
  }

  for (let i = 0; i < (hmc.length < 8 ? r(3) : r(2)); i++) {
    hmc = hmc.concat(hmc);
  }

  hmc = shuffle(hmc);
  bgc = hmc[0];
  return [hmc, bgc, H];
};

imperfectShape = (vec, dL, dW, rr) => {
  beginShape();
  n = 0;
  L = vec.length;
  for (g = 0; g < L; g++) {
    v0 = vec[g];
    v1 = vec[(g + 1) % L];
    d = p5.Vector.dist(v0, v1);
    nK = F(10 * (d / dL)) / 10;
    j = 0;
    for (k = 0; k < nK; k++) {
      j = lerp(0, d, k / nK);
      let dx =
        ((2 * N((0.1 * j) / dL, g, rr) - 1) * dW) / 2 +
        r2(-dW, dW) / roughness / 2;
      let dy =
        ((2 * N(1 + (0.1 * j) / dL, g, rr) - 1) * dW) / 2 +
        r2(-dW, dW) / roughness / 2;
      if (warp) {
        let D =
          warpMagnitude * (warpRandom ? r2(dW * 0.3, dW) : r2(dW * 0.8, dW));
        let xloc = lerp(v0.x, v1.x, j / d) / width;
        let yloc = lerp(v0.y, v1.y, j / d) / height;
        let a =
          swirlMagnitude *
          (spiral
            ? dist((xloc * width) / cm, (yloc * height) / cm, 0.5, 0.5) *
              (1 + 1.5 * N(xloc, yloc))
            : N(warpAngleMagnitude * xloc, warpAngleMagnitude * yloc));
        dx = D * sin(a) + r2(-dW, dW) / roughness / 2;
        dy = D * cos(a) + r2(-dW, dW) / roughness / 2;
      }
      vx = lerp(v0.x, v1.x, j / d) + dx;
      vy = lerp(v0.y, v1.y, j / d) + dy;
      vertex(vx, vy);
      n++;
    }
  }
  endShape();
};

drawManyShapes = (v, nLayers, c) => {
  S = r(99);
  for (let j = 0; j < nLayers; j++) {
    fill(hue(c), saturation(c), brightness(c), 0.2 * sqrt((j + 1) / nLayers));
    imperfectShape(v, cm / 100, (roughness * cm) / 100, S + j / nLayers);
  }
};

getFeatures = () => {
  $fx.features({
    Colors: H,
    Opts: nt,
  });
};

// Shorten
r = (a = 1) => random(a);
r2 = (a, b) => random(a, b);
N = (a = 0, b = 0, c = 0, d = 0) => noise(a, b, c, d);
cV = (x, y) => createVector(x, y);
C = (h, s, b, a = 1) => color(h, s, b, a);
F = (a) => floor(a);

// Shape functions
dR = (p, r, s) => {
  // Adapted from https://editor.p5js.org/davepagurek/sketches/AwgpGbabn
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
    const bD = 0.5523;
    const p1 = c1.copy().sub(ba.copy().mult(2 * cR * bD));
    const p2 = c2.copy().sub(bc.copy().mult(2 * cR * bD));
    vertex(c1.x, c1.y);
    bezierVertex(p1.x, p1.y, p2.x, p2.y, c2.x, c2.y);
  }
  endShape(CLOSE);
};
