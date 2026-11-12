/*
 * Saltline — 14-weapon.js
 * PAC-9 Longshore viewmodel, animation, reload and hitscan firing
 *
 * Source fragment. All numbered files share one top-level scope and are
 * concatenated in filename order inside a single IIFE at build time.
 * Keep top-level declaration names unique across files.
 */
var nm = new W(),
  zf = new W();
var Xv = {};
br(Xv, { create: () => dm, showcase: () => PC });
var im = (i, e, t) => {
    let n = Math.sin(i * 12.9898 + e * 78.233 + t * 37.719) * 43758.5453;
    return n - Math.floor(n);
  },
  cC = (i, e, t) => Math.max(Math.abs(i), Math.abs(e), Math.abs(t)) < 0.95,
  b_ = (i, e, t) => {
    let n = Math.abs(t);
    return n > 0.15 && n < 0.95;
  };
function sm(i, e, t = 0, n = null) {
  let s = i.attributes.position,
    o = i.attributes.normal,
    r = s.count,
    a = new Float32Array(r * 3);
  for (let l = 0; l < r; l++) {
    let c = s.getX(l),
      u = s.getY(l),
      h = s.getZ(l),
      f =
        0.9 +
        0.2 * im(Math.round(c * 70), Math.round(u * 70), Math.round(h * 70));
    if (t > 0 && n && n(o.getX(l), o.getY(l), o.getZ(l))) {
      let p = im(Math.round(c * 300), Math.round(u * 300), Math.round(h * 300));
      {
        let d = Math.max(0, p - 0.84) / 0.16;
        f *= 1 + t * 1.6 * d * d;
      }
    }
    ((a[l * 3] = e[0] * f),
      (a[l * 3 + 1] = e[1] * f),
      (a[l * 3 + 2] = e[2] * f));
  }
  return (i.setAttribute("color", new et(a, 3)), i);
}
var y_ = new In(),
  uC = new Ye();
function Rt(i, e, t, n, s, o, r, a, l = 0, c = null) {
  let u = Wi(i, e, t, n);
  return (
    sm(u, a, l, cC),
    c &&
      (y_.set(c[0], c[1], c[2]), u.applyMatrix4(uC.makeRotationFromEuler(y_))),
    u.translate(s, o, -r),
    u
  );
}
function hC(i, e) {
  let t = new ji();
  if (
    (i.forEach((n, s) => (s ? t.lineTo(n[0], n[1]) : t.moveTo(n[0], n[1]))),
    t.closePath(),
    e)
  )
    for (let n of e) t.holes.push(new or(n.map((s) => new Ae(s[0], s[1]))));
  return t;
}
function __(i, e, t, n) {
  return new rr(hC(i, n), {
    depth: Math.max(1e-4, e - 2 * t),
    bevelEnabled: t > 0,
    bevelThickness: t,
    bevelSize: t,
    bevelOffset: -t,
    bevelSegments: 1,
    steps: 1,
    curveSegments: 6,
  });
}
function M_(i) {
  i.computeBoundingBox();
  let e = i.boundingBox.min.z,
    t = i.boundingBox.max.z,
    n = i.attributes.position,
    s = i.attributes.normal;
  for (let o = 0; o < n.count; o++) {
    let r = s.getZ(o),
      a = Math.abs(r);
    if (a < 0.15 || a > 0.95) continue;
    let l = n.getZ(o);
    if (Math.abs(l - e) < 1e-6 || Math.abs(l - t) < 1e-6)
      s.setXYZ(o, 0, 0, Math.sign(r));
    else {
      let c = Math.hypot(s.getX(o), s.getY(o)) || 1;
      s.setXYZ(o, s.getX(o) / c, s.getY(o) / c, 0);
    }
  }
  return i;
}
function xr(i, e, t, n, s, o = 0, r = null) {
  let a = __(i, t - e, n, r);
  return (
    sm(a, s, o, b_),
    M_(a),
    a.translate(0, 0, e + n),
    a.rotateY(Math.PI / 2),
    a
  );
}
function qo(i, e, t, n, s, o = 0, r = null) {
  let a = __(i, t - e, n, r);
  return (sm(a, s, o, b_), M_(a), a.translate(0, 0, -t + n), a);
}
function Cn(i, e, t, n = 0, s = 0, o = 0, r = null) {
  let a = [],
    l = [],
    c = [],
    u = [],
    h = 0;
  for (let p = 0; p < i.length - 1; p++) {
    let [d, v] = i[p],
      [g, x] = i[p + 1],
      y = g - d,
      b = x - v,
      m = Math.hypot(y, b);
    if (m < 1e-7) continue;
    let A = b / m,
      _ = -y / m,
      M = Math.abs(A) > 0.25 && Math.abs(_) > 0.25;
    for (let E = 0; E <= e; E++) {
      let w = (E / e) * Math.PI * 2,
        S = Math.cos(w),
        z = Math.sin(w);
      for (let H = 0; H < 2; H++) {
        let O = H ? g : d,
          q = H ? x : v,
          U = s + O * S,
          T = o + O * z,
          D = -q;
        (a.push(U, T, D), l.push(A * S, A * z, -_));
        let C = 0.9 + 0.2 * im(Math.round(q * 150), Math.round(w * 3), p);
        if (M && n > 0) {
          let j = im(E * 7.1, p * 3.3, q * 100);
          {
            let N = Math.max(0, j - 0.84) / 0.16;
            C *= 1 + n * 1.6 * N * N;
          }
        }
        let G = r ? r(O, q, t) : t;
        c.push(G[0] * C, G[1] * C, G[2] * C);
      }
    }
    for (let E = 0; E < e; E++) {
      let w = h + E * 2,
        S = w + 2,
        z = w + 1,
        H = w + 3;
      u.push(w, z, S, S, z, H);
    }
    h += (e + 1) * 2;
  }
  let f = new nt();
  return (
    f.setAttribute("position", new He(a, 3)),
    f.setAttribute("normal", new He(l, 3)),
    f.setAttribute("color", new He(c, 3)),
    f.setAttribute("uv", new He(new Float32Array((a.length / 3) * 2), 2)),
    f.setIndex(u),
    f
  );
}
function Fi(i, e, t, n, s, o, r = 12, a = 0) {
  let l = Math.min(i * 0.25, e * 0.25),
    c = e / 2,
    u = Cn(
      [
        [0, -c],
        [i - l, -c],
        [i, -c + l],
        [i, c - l],
        [i - l, c],
        [0, c],
      ],
      r,
      o,
      a,
    );
  return (u.rotateY(Math.PI / 2), u.translate(t, n, -s), u);
}
function Dv(i, e, t, n, s = 4) {
  let o = [],
    r = n / 2,
    a = t / 2 - r;
  for (let l = 0; l <= s; l++) {
    let c = -Math.PI / 2 + (l / s) * Math.PI;
    o.push([i + a + Math.cos(c) * r, e + Math.sin(c) * r]);
  }
  for (let l = 0; l <= s; l++) {
    let c = Math.PI / 2 + (l / s) * Math.PI;
    o.push([i - a + Math.cos(c) * r, e + Math.sin(c) * r]);
  }
  return o;
}
var fC = (i, e, t, n, s) => [
    [i + s, e],
    [t - s, e],
    [t, e + s],
    [t, n - s],
    [t - s, n],
    [i + s, n],
    [i, n - s],
    [i, e + s],
  ],
  mi = {
    name: "PAC-9 Longshore",
    muzzle: [0, 0, -0.531],
    eject: [0.023, 0.004, -0.028],
    sightY: 0.069,
    lensF: 0.0285,
    window: [
      [-0.016, 0.057],
      [0.016, 0.057],
      [0.016, 0.0772],
      [0.0122, 0.081],
      [-0.0122, 0.081],
      [-0.016, 0.0772],
    ],
    magPos: [0, -0.02, -0.0665],
    boltTravel: 0.062,
    railTop: 0.0435,
    grip: [0, -0.1, 0.073],
    handguard: [0, 0, -0.255],
    handguardR: 0.021,
    handlePos: [-0.026, 0.007, -0.078],
    squeeze: 0.86,
  };
function w_() {
  let i = [1, 1, 1],
    e = [1, 1, 1],
    t = [5.5, 5.5, 5.7],
    n = [0.4, 0.4, 0.42],
    s = [1, 1, 1],
    o = [0.022, 0.022, 0.023],
    r = [],
    a = [],
    l = [],
    c = [],
    u = [],
    h = [],
    f = [],
    p = 9,
    d = 5,
    v = 0.6,
    g = [
      [-0.1, -0.02],
      [0.1, -0.02],
      [0.1, 0.027],
      [0.093, 0.034],
      [-0.088, 0.034],
      [-0.1, 0.024],
    ];
  (r.push(
    xr(g, 0, 0.0205, 0.0014, i, p, [fC(-0.012, -0.01, 0.06, 0.012, 0.003)]),
  ),
    r.push(
      xr(g, -0.0205, 0, 0.0014, i, p, [Dv(0.032, 0.007, 0.112, 0.0075, 4)]),
    ),
    a.push(Rt(0.004, 0.036, 0.19, 5e-4, -0.0135, 0.006, 0, n)),
    a.push(Rt(0.004, 0.012, 0.19, 5e-4, 0.0145, 0.022, 0, n)),
    a.push(Rt(0.004, 0.008, 0.19, 5e-4, 0.0145, -0.014, 0, n)),
    a.push(
      Cn(
        [
          [0, 0.058],
          [0.0128, 0.058],
          [0.0128, 0.099],
          [0, 0.099],
        ],
        16,
        [0.8, 0.8, 0.82],
      ),
    ),
    r.push(
      Rt(0.009, 0.02, 0.018, 0.003, 0.0225, 0.004, -0.026, i, p, [0, -0.35, 0]),
    ),
    r.push(
      Cn(
        [
          [0, -0.086],
          [0.0062, -0.086],
          [0.0072, -0.084],
          [0.0072, -0.06],
          [0.0045, -0.057],
          [0, -0.057],
        ],
        12,
        i,
        p,
        0.0215,
        0.012,
      ),
    ),
    a.push(
      Cn(
        [
          [0, -0.094],
          [0.0048, -0.094],
          [0.0055, -0.092],
          [0.0055, -0.086],
          [0, -0.086],
        ],
        12,
        t,
        0,
        0.0215,
        0.012,
      ),
    ),
    r.push(Rt(0.004, 0.012, 0.05, 0.0015, -0.0212, -0.006, -0.055, i, p)),
    r.push(Rt(0.004, 0.006, 0.15, 0.0015, -0.0212, 0.0215, 0.012, i, p)),
    r.push(Rt(0.003, 0.01, 0.03, 0.001, 0.0212, 0.022, 0.075, i, p)),
    r.push(
      qo(
        [
          [-0.0078, 0.0335],
          [0.0078, 0.0335],
          [0.0106, 0.0402],
          [-0.0106, 0.0402],
        ],
        -0.096,
        0.397,
        5e-4,
        i,
        0,
      ),
    ));
  let x = [
    [-0.0102, 0.0398],
    [0.0102, 0.0398],
    [0.0106, 0.0408],
    [0.0084, 0.0435],
    [-0.0084, 0.0435],
    [-0.0106, 0.0408],
  ];
  for (let F = 0; F < 49; F++) {
    let X = -0.094 + F * 0.01;
    r.push(qo(x, X, X + 0.0048, 8e-4, i, p));
  }
  let y = [
    [-0.1, -0.021],
    [0.099, -0.021],
    [0.101, -0.03],
    [0.098, -0.088],
    [0.036, -0.082],
    [0.031, -0.058],
    [-0.03, -0.058],
    [-0.04, -0.066],
    [-0.078, -0.055],
    [-0.1, -0.044],
  ];
  (l.push(xr(y, -0.019, 0.019, 0.0014, s, v)),
    l.push(
      Rt(0.043, 0.01, 0.066, 0.002, 0, -0.0835, 0.0668, s, v, [-0.095, 0, 0]),
    ),
    l.push(Rt(0.0405, 0.052, 0.005, 8e-4, 0, -0.052, 0.0975, s, v)),
    l.push(Rt(0.0405, 0.04, 0.005, 8e-4, 0, -0.048, 0.0345, s, v)),
    a.push(Fi(0.0038, 0.0396, 0, -0.031, -0.086, t, 12)),
    a.push(Fi(0.0038, 0.0396, 0, -0.029, 0.087, t, 12)),
    a.push(Fi(0.0022, 0.0392, 0, -0.04, -0.012, t, 8)),
    a.push(Fi(0.0022, 0.0392, 0, -0.032, -0.032, t, 8)));
  for (let F of [-1, 1])
    (a.push(Fi(0.0068, 0.004, F * 0.0205, -0.036, -0.048, e, 14, d)),
      a.push(
        Rt(
          0.004,
          0.006,
          0.024,
          0.0015,
          F * 0.0228,
          -0.036,
          -0.036,
          e,
          d,
          [0.5, 0, 0],
        ),
      ));
  a.push(Rt(0.0045, 0.024, 0.013, 0.0015, -0.0212, -0.03, 0.022, e, d));
  for (let F = 0; F < 4; F++)
    a.push(
      Rt(0.0012, 0.002, 0.012, 5e-4, -0.0238, -0.021 - F * 0.0045, 0.022, e, d),
    );
  (a.push(Fi(0.0058, 0.005, 0.0205, -0.042, 0.016, e, 12, d)),
    l.push(Rt(0.004, 0.004, 0.026, 8e-4, 0.0205, -0.051, 0.016, s, v)),
    l.push(Rt(0.004, 0.02, 0.004, 8e-4, 0.0205, -0.043, 0.027, s, v)),
    l.push(
      xr(
        [
          [0.033, -0.056],
          [0.033, -0.093],
          [0.024, -0.1005],
          [-0.031, -0.1005],
          [-0.041, -0.09],
          [-0.041, -0.06],
        ],
        -0.0085,
        0.0085,
        8e-4,
        s,
        v,
        [
          [
            [0.028, -0.059],
            [0.028, -0.091],
            [0.022, -0.096],
            [-0.029, -0.096],
            [-0.036, -0.088],
            [-0.036, -0.061],
          ],
        ],
      ),
    ),
    a.push(
      xr(
        [
          [-0.006, -0.057],
          [0.004, -0.057],
          [0.003, -0.069],
          [0.0065, -0.079],
          [0.01, -0.086],
          [0.0065, -0.088],
          [0.001, -0.081],
          [-0.004, -0.07],
        ],
        -0.0032,
        0.0032,
        8e-4,
        t,
        0,
      ),
    ),
    l.push(
      xr(
        [
          [-0.038, -0.05],
          [-0.045, -0.074],
          [-0.049, -0.086],
          [-0.049, -0.1],
          [-0.054, -0.112],
          [-0.057, -0.13],
          [-0.064, -0.158],
          [-0.11, -0.152],
          [-0.102, -0.112],
          [-0.096, -0.082],
          [-0.095, -0.064],
          [-0.103, -0.046],
          [-0.08, -0.044],
        ],
        -0.0165,
        0.0165,
        0.005,
        s,
        v,
      ),
    ));
  for (let F = 0; F < 9; F++) {
    let X = -0.078 - F * 0.0082,
      ne = -0.073 + (X + 0.078) * 0.26;
    l.push(Rt(0.0345, 0.0028, 0.03, 0.001, 0, X, ne, s, v, [-0.25, 0, 0]));
  }
  for (let F = 0; F < 7; F++) {
    let X = -0.078 - F * 0.01,
      ne = -0.098 + (X + 0.078) * 0.14;
    l.push(Rt(0.022, 0.0045, 0.006, 0.0015, 0, X, ne, s, v, [-0.14, 0, 0]));
  }
  (l.push(Rt(0.035, 0.006, 0.05, 0.002, 0, -0.157, -0.087, s, v, [0.13, 0, 0])),
    a.push(Fi(0.003, 0.034, 0, -0.15, -0.085, t, 8)));
  let b = mi.handguardR,
    m = 0.00885,
    A = 0.0028,
    _ = 0.101,
    M = 0.398,
    E = [
      [_, -m],
      [M, -m],
      [M, m],
      [_, m],
    ];
  for (let F = 0; F < 8; F++) {
    let X = [];
    if (F === 0 || F === 4 || F === 6)
      for (let $ = 0; $ < 6; $++)
        X.push(Dv(0.13 + $ * 0.047, 0, 0.032, 0.007, 4));
    else if (F !== 2)
      for (let $ = 0; $ < 10; $++) {
        let ue = 0.124 + $ * 0.027;
        (F === 3 && ue > 0.3) || X.push(Dv(ue, 0, 0.013, 0.0052, 3));
      }
    let ne = xr(E, b - A, b, 9e-4, i, p, X);
    (ne.rotateZ((F * Math.PI) / 4), r.push(ne));
    let re = ((F + 0.5) * Math.PI) / 4;
    r.push(
      Cn(
        [
          [0, _],
          [0.003, _],
          [0.003, M],
          [0, M],
        ],
        8,
        i,
        0,
        Math.cos(re) * 0.0197,
        Math.sin(re) * 0.0197,
      ),
    );
  }
  (r.push(
    qo(
      [
        [-0.0088, 0.02],
        [0.0088, 0.02],
        [0.0106, 0.029],
        [0.0082, 0.0338],
        [-0.0082, 0.0338],
        [-0.0106, 0.029],
      ],
      0.1012,
      0.3978,
      0.0012,
      i,
      p,
    ),
  ),
    r.push(
      Cn(
        [
          [0.016, 0.096],
          [0.0238, 0.096],
          [0.0243, 0.0966],
          [0.0243, 0.106],
          [0.0232, 0.1075],
          [0.016, 0.1075],
        ],
        24,
        i,
        p,
      ),
    ),
    r.push(
      Cn(
        [
          [0.018, 0.3985],
          [0.0224, 0.3985],
          [0.0224, 0.4003],
          [0.0218, 0.401],
          [0.018, 0.401],
          [0.018, 0.3985],
        ],
        8,
        i,
        p,
      ),
    ));
  for (let F of [-1, 1])
    for (let X of [0.112, 0.126])
      a.push(Fi(0.0024, 0.0024, F * 0.0212, -0.004, X, t, 10));
  for (let F of [0.115, 0.215, 0.3, 0.385])
    for (let X of [-1, 1])
      a.push(
        Cn(
          [
            [0, -8e-4],
            [0.0017, -8e-4],
            [0.002, -4e-4],
            [0.002, 6e-4],
            [0, 6e-4],
          ],
          8,
          t,
          0,
          0,
          0,
        )
          .rotateX(Math.PI / 2)
          .translate(X * 0.0098, 0.0312, -F),
      );
  {
    let X = [
      qo(
        [
          [-0.0078, 0.0206],
          [0.0078, 0.0206],
          [0.0106, 0.0242],
          [-0.0106, 0.0242],
        ],
        0.318,
        0.396,
        5e-4,
        i,
        0,
      ),
    ];
    for (let ne = 0; ne < 8; ne++) {
      let re = 0.319 + ne * 0.01;
      X.push(
        qo(
          x.map(($) => [$[0], $[1] - 0.016]),
          re,
          re + 0.0048,
          5e-4,
          i,
          p,
        ),
      );
    }
    for (let ne of X) (ne.rotateZ(Math.PI / 4), r.push(ne));
  }
  {
    let F = [];
    for (let X = 0; X < 4; X++) {
      let ne = 0.352 + X * 0.01;
      F.push(
        qo(
          x.map((re) => [re[0], re[1] - 0.016]),
          ne,
          ne + 0.0048,
          5e-4,
          i,
          p,
        ),
      );
    }
    F.push(
      qo(
        [
          [-0.0078, 0.0206],
          [0.0078, 0.0206],
          [0.0106, 0.0242],
          [-0.0106, 0.0242],
        ],
        0.35,
        0.392,
        5e-4,
        i,
        0,
      ),
    );
    for (let X of F) (X.rotateZ(Math.PI), r.push(X));
  }
  (l.push(
    xr(
      [
        [0.35, -0.026],
        [0.392, -0.026],
        [0.388, -0.036],
        [0.372, -0.05],
        [0.362, -0.05],
        [0.354, -0.036],
      ],
      -0.011,
      0.011,
      0.003,
      s,
      v,
    ),
  ),
    l.push(
      xr(
        [
          [0.2395, -0.0215],
          [0.2725, -0.0215],
          [0.2725, -0.03],
          [0.27, -0.092],
          [0.2665, -0.0965],
          [0.2455, -0.0975],
          [0.242, -0.093],
          [0.2395, -0.03],
        ],
        -0.014,
        0.014,
        0.0045,
        s,
        v,
      ),
    ));
  for (let F = 0; F < 6; F++)
    l.push(
      Rt(
        0.0292,
        0.0022,
        0.0315,
        8e-4,
        0,
        -0.04 - F * 0.0085,
        0.256 - F * 3e-4,
        s,
        v,
      ),
    );
  (l.push(Rt(0.03, 0.005, 0.04, 0.0015, 0, -0.024, 0.256, s, v)),
    a.push(Fi(0.003, 0.031, 0, -0.025, 0.256, t, 10)),
    a.push(
      Cn(
        [
          [0.0115, 0.095],
          [0.0115, 0.15],
          [0.0095, 0.153],
          [0.0095, 0.285],
          [0.009, 0.288],
          [0.009, 0.322],
          [0.0086, 0.326],
          [0.0086, 0.435],
          [0.0092, 0.437],
          [0.0092, 0.453],
          [0.0075, 0.455],
          [0.0075, 0.461],
        ],
        20,
        e,
        d,
      ),
    ),
    a.push(
      Cn(
        [
          [0.0092, 0.286],
          [0.0135, 0.286],
          [0.0142, 0.2875],
          [0.0142, 0.3165],
          [0.0135, 0.318],
          [0.0092, 0.318],
        ],
        16,
        e,
        d,
      ),
    ),
    a.push(Rt(0.014, 0.009, 0.03, 0.002, 0, 0.0145, 0.302, e, d)),
    a.push(
      Cn(
        [
          [0, 0.1],
          [0.0026, 0.1],
          [0.0026, 0.3],
          [0, 0.3],
        ],
        8,
        t,
        0,
        0,
        0.0172,
      ),
    ),
    a.push(Fi(0.002, 0.0145, 0, 0.012, 0.308, t, 6)),
    a.push(
      Cn(
        [
          [0.0075, 0.459],
          [0.0108, 0.459],
          [0.0116, 0.4605],
          [0.0116, 0.477],
          [0.011, 0.478],
          [0.0052, 0.478],
        ],
        20,
        e,
        d,
      ),
    ),
    a.push(
      Cn(
        [
          [0.0052, 0.477],
          [0.0052, 0.517],
        ],
        12,
        n,
      ),
    ));
  for (let F of [0.4865, 0.4965, 0.5065])
    a.push(
      Cn(
        [
          [0.0052, F - 0.0019],
          [0.011, F - 0.0019],
          [0.0116, F - 0.0012],
          [0.0116, F + 0.0012],
          [0.011, F + 0.0019],
          [0.0052, F + 0.0019],
        ],
        20,
        e,
        d,
      ),
    );
  a.push(
    Cn(
      [
        [0.0052, 0.5145],
        [0.011, 0.5145],
        [0.0116, 0.5155],
        [0.0116, 0.527],
        [0.0102, 0.5305],
        [0.0048, 0.5305],
        [0.0036, 0.526],
        [0.0036, 0.495],
      ],
      20,
      e,
      d,
      0,
      0,
      (F, X, ne) => (F < 0.0047 ? [0.25, 0.25, 0.25] : ne),
    ),
  );
  for (let F of [-1, 1])
    a.push(Rt(0.0125, 0.0042, 0.042, 0.0012, 0, F * 0.0096, 0.496, e, d));
  for (let F = 0; F < 3; F++)
    a.push(Fi(0.0016, 0.0236, 0, 0, 0.4675 + F * 0.0035, n, 6));
  (r.push(
    Cn(
      [
        [0, -0.292],
        [0.0142, -0.292],
        [0.0148, -0.2905],
        [0.0148, -0.1],
      ],
      20,
      i,
      p,
    ),
  ),
    r.push(
      Cn(
        [
          [0.0148, -0.122],
          [0.0185, -0.122],
          [0.0195, -0.1205],
          [0.0195, -0.1115],
          [0.0185, -0.11],
          [0.0148, -0.11],
        ],
        12,
        i,
        p * 1.5,
      ),
    ));
  {
    let F = [
        [-0.019, -0.024],
        [0.019, -0.024],
        [0.021, -0.018],
        [0.021, 0.018],
        [0.016, 0.024],
        [-0.016, 0.024],
        [-0.021, 0.018],
        [-0.021, 0.006],
        [-0.036, 0.004],
        [-0.04, -0.002],
        [-0.04, -0.014],
        [-0.034, -0.02],
        [-0.021, -0.02],
      ],
      X = [
        [-0.025, -0.014],
        [-0.025, -0.002],
        [-0.033, -5e-4],
        [-0.036, -0.004],
        [-0.036, -0.012],
        [-0.032, -0.016],
      ];
    a.push(qo(F, -0.1095, -0.1045, 8e-4, [1.6, 1.6, 1.65], d, [X]));
  }
  (l.push(
    xr(
      [
        [-0.146, 0.024],
        [-0.3, 0.024],
        [-0.331, 0.014],
        [-0.334, -0.086],
        [-0.318, -0.101],
        [-0.29, -0.096],
        [-0.232, -0.04],
        [-0.146, -0.024],
      ],
      -0.019,
      0.019,
      0.004,
      s,
      v,
      [
        [
          [-0.262, -0.036],
          [-0.306, -0.036],
          [-0.306, -0.074],
          [-0.292, -0.074],
        ],
      ],
    ),
  ),
    l.push(Rt(0.033, 0.016, 0.118, 0.006, 0, 0.031, -0.232, s, v)));
  for (let F of [-0.196, -0.268]) a.push(Fi(0.0032, 0.035, 0, 0.03, F, t, 8));
  (l.push(Rt(0.012, 0.012, 0.04, 0.003, 0, -0.033, -0.19, s, v, [0.2, 0, 0])),
    f.push(Rt(0.037, 0.12, 0.011, 0.004, 0, -0.04, -0.3395, o, 0)));
  for (let F = 0; F < 9; F++)
    f.push(Rt(0.031, 0.004, 0.003, 0.001, 0, 0.004 - F * 0.011, -0.3455, o, 0));
  for (let F of [-1, 1])
    a.push(Fi(0.0065, 0.003, F * 0.0195, -0.06, -0.318, t, 12));
  let w = mi.sightY,
    S = mi.window,
    z = [0.012, 0.012, 0.013];
  (r.push(Rt(0.03, 0.0092, 0.04, 0.0016, 0, 0.048, 0.021, i, p)),
    r.push(Rt(0.0045, 0.0085, 0.034, 0.001, -0.0162, 0.0452, 0.021, i, p)));
  for (let F of [0.009, 0.033])
    (a.push(Fi(0.004, 0.0042, -0.02, 0.0452, F, t, 6)),
      a.push(Fi(0.003, 0.0022, 0.016, 0.0452, F, t, 10)));
  let H = [
    [-0.0192, 0.0525],
    [0.0192, 0.0525],
    [0.0192, 0.0788],
    [0.0138, 0.0842],
    [-0.0138, 0.0842],
    [-0.0192, 0.0788],
  ];
  (r.push(qo(H, 0.008, 0.034, 0.001, i, p, [S])),
    f.push(
      qo(
        S.map((F) => [F[0] * 1.004, (F[1] - w) * 1.004 + w]),
        0.0078,
        0.0342,
        0,
        z,
        0,
        [S.map((F) => [F[0] * 0.982, (F[1] - w) * 0.982 + w])],
      ),
    ));
  let O = [
    [-0.0204, 0.06],
    [-0.0204, 0.0792],
    [-0.0143, 0.0854],
    [0.0143, 0.0854],
    [0.0204, 0.0792],
    [0.0204, 0.06],
    [0.0193, 0.06],
    [0.0193, 0.0788],
    [0.0138, 0.0843],
    [-0.0138, 0.0843],
    [-0.0193, 0.0788],
    [-0.0193, 0.06],
  ];
  (r.push(qo(O, 0.029, 0.038, 3e-4, i, p)),
    a.push(
      Cn(
        [
          [0, -0.006],
          [0.0052, -0.006],
          [0.0058, -0.0054],
          [0.0058, 0.0036],
          [0.0052, 0.0042],
          [0, 0.0042],
        ],
        14,
        e,
        d,
        0,
        0,
      )
        .rotateY(Math.PI / 2)
        .translate(0.0222, 0.0625, -0.021),
    ));
  for (let F of [0.0165, 0.0245])
    f.push(Rt(0.0022, 0.0055, 0.0055, 9e-4, -0.0196, 0.064, F, o, 0));
  for (let F of [0.012, 0.03])
    for (let X of [-1, 1])
      a.push(Fi(0.0016, 0.0012, X * 0.0195, 0.0555, F, t, 8));
  f.push(Rt(0.009, 0.0026, 0.006, 6e-4, 0, 0.058, 0.0115, z));
  for (let [F, X] of [
    [0.0128, 0.0548],
    [-0.0128, 0.0548],
  ])
    a.push(
      Cn(
        [
          [0, -6e-4],
          [0.0019, -6e-4],
          [0.0022, -2e-4],
          [0.0022, 7e-4],
          [0, 7e-4],
        ],
        10,
        t,
        0,
        F,
        X,
      )
        .translate(0, 0, -0.008 + 1e-4)
        .rotateY(0),
    );
  (a.push(
    Cn(
      [
        [0, -0.001],
        [0.0026, -0.001],
        [0.003, -5e-4],
        [0.003, 0.0012],
        [0, 0.0012],
      ],
      12,
      t,
      0,
      0,
      0,
    )
      .rotateX(Math.PI / 2)
      .translate(0.009, 0.0842, -0.014),
  ),
    f.push(Rt(0.0012, 2e-4, 0.0044, 5e-5, 0.009, 0.0855, 0.014, z)),
    f.push(
      qo(S, 0.0304, 0.0318, 0, z, 0, [
        S.map((F) => [F[0] * 0.955, (F[1] - w) * 0.955 + w]),
      ]),
    ));
  for (let [F, X] of [
    [-0.03, 1],
    [0.372, -1],
  ])
    (a.push(Rt(0.021, 0.0075, 0.03, 0.0015, 0, 0.0472, F, e, d)),
      a.push(Rt(0.0125, 0.004, 0.036, 0.001, 0, 0.0527, F + X * 0.004, e, d)),
      a.push(Fi(0.0028, 0.024, 0, 0.0505, F - X * 0.013, e, 8)),
      a.push(Rt(0.004, 0.006, 0.006, 0.001, X * 0.0125, 0.0475, F, e, d)),
      a.push(Fi(0.0042, 0.0045, -0.0125, 0.0475, F + 0.006, t, 8)));
  (a.push(
    Cn(
      [
        [0.0016, -0.0012],
        [0.0034, -0.0012],
        [0.0038, -8e-4],
        [0.0038, 8e-4],
        [0.0034, 0.0012],
        [0.0016, 0.0012],
        [0.0016, -0.0012],
      ],
      12,
      e,
      d,
      0,
      0,
    )
      .rotateX(Math.PI / 2)
      .translate(0, 0.0553, 0.016),
  ),
    a.push(Fi(0.0048, 0.005, 0.015, 0.049, -0.036, e, 12, d)));
  for (let F = 0; F < 6; F++)
    a.push(
      Rt(
        0.0044,
        0.001,
        0.001,
        3e-4,
        0.015,
        0.049 + Math.sin(F * 1.047) * 0.0046,
        -0.036 + Math.cos(F * 1.047) * 0.0046,
        e,
        d,
      ),
    );
  (r.push(Rt(0.016, 0.005, 0.02, 0.0012, 0, 0.0355, -0.098, i, p)),
    a.push(Rt(0.01, 0.003, 0.008, 8e-4, 0, 0.0392, -0.0985, e, d)));
  for (let F = 0; F < 4; F++)
    a.push(
      Rt(0.0092, 8e-4, 0.001, 3e-4, 0, 0.0409, -0.0958 - F * 0.0018, e, d),
    );
  let q = -0.0267,
    U = 0.0267;
  (a.push(
    Cn(
      [
        [0, 0.308],
        [0.0095, 0.308],
        [0.0108, 0.3095],
        [0.0108, 0.322],
        [0.0118, 0.323],
        [0.0118, 0.378],
        [0.0128, 0.38],
        [0.0142, 0.382],
        [0.0142, 0.404],
        [0.0136, 0.406],
        [0.0142, 0.408],
        [0.0142, 0.412],
        [0.0128, 0.4135],
        [0.0118, 0.4135],
        [0.0112, 0.409],
      ],
      18,
      e,
      d,
      q,
      U,
    ),
  ),
    a.push(
      Cn(
        [
          [0.0112, 0.409],
          [0, 0.409],
        ],
        18,
        [0.35, 0.4, 0.45],
        0,
        q,
        U,
      ),
    ));
  for (let F = 0; F < 5; F++)
    a.push(
      Cn(
        [
          [0.0118, 0.33 + F * 0.008],
          [0.0124, 0.3305 + F * 0.008],
          [0.0124, 0.3335 + F * 0.008],
          [0.0118, 0.334 + F * 0.008],
        ],
        18,
        e,
        d,
        q,
        U,
      ),
    );
  {
    let F = Rt(0.02, 0.008, 0.04, 0.0012, 0, 0.028, 0.352, e, d);
    (F.rotateZ(Math.PI / 4), a.push(F));
  }
  {
    let F = Fi(0.004, 0.006, 0.0135, 0.028, 0.352, t, 8);
    (F.rotateZ(Math.PI / 4), a.push(F));
  }
  f.push(Rt(0.0185, 0.0065, 0.07, 0.0025, 0, 0.0468, 0.214, o, 0));
  for (let F = 0; F < 6; F++)
    f.push(Rt(0.014, 0.0012, 0.004, 5e-4, 0, 0.0503, 0.192 + F * 0.009, o, 0));
  let T = Fn(
    [
      [q, U, -0.308],
      [q - 0.001, U + 0.002, -0.296],
      [-0.0265, 0.0235, -0.284],
      [-0.0255, 0.0215, -0.272],
      [-0.0235, 0.027, -0.262],
      [-0.016, 0.04, -0.256],
      [-0.007, 0.0465, -0.252],
      [-0.002, 0.047, -0.247],
    ],
    0.0018,
    6,
  );
  (sm(T, o, 0), f.push(T));
  for (let F of [
    [-0.0262, 0.0228, 0.28],
    [-0.0242, 0.0255, 0.265],
  ]) {
    let X = Rt(0.0065, 0.0026, 0.0035, 8e-4, 0, 0, 0, [0.03, 0.03, 0.03], 0);
    (X.rotateZ(Math.PI / 4), X.translate(F[0], F[1], -F[2]), f.push(X));
  }
  c.push(
    Cn(
      [
        [0, -0.058],
        [0.0118, -0.058],
        [0.0124, -0.057],
        [0.0124, -0.01],
        [0.0116, -0.008],
        [0.0116, -0.002],
        [0.0124, 0],
        [0.0124, 0.046],
        [0.0105, 0.048],
        [0.0105, 0.056],
        [0.0062, 0.056],
        [0.0062, 0.06],
        [0, 0.06],
      ],
      16,
      [7, 7, 7.2],
      0,
      0,
      0.001,
    ),
  );
  for (let F = 0; F < 5; F++)
    c.push(
      Rt(
        0.0015,
        0.008,
        0.003,
        5e-4,
        0.0122,
        0.001,
        0.01 + F * 0.007,
        [1.2, 1.2, 1.2],
        0,
      ),
    );
  c.push(Rt(0.012, 0.0055, 0.014, 0.0015, -0.0165, 0.007, 0.078, e, d));
  {
    let F = Cn(
      [
        [0, -0.009],
        [0.0045, -0.009],
        [0.0056, -0.0078],
        [0.0056, -0.003],
        [0.0048, -0.002],
        [0.0048, 0.002],
        [0.0056, 0.003],
        [0.0056, 0.0078],
        [0.0045, 0.009],
        [0, 0.009],
      ],
      12,
      e,
      d,
    );
    (F.rotateY(Math.PI / 2), F.translate(-0.031, 0.007, -0.078), c.push(F));
  }
  let D = (F) => 1.5 * Math.pow(Math.max(0, F - 0.07), 2),
    C = (F) => 3 * Math.max(0, F - 0.07),
    G = [1, 1, 1],
    j = [],
    N = 0.212,
    Q = 12;
  for (let F = 0; F <= Q; F++) {
    let X = -0.004 + ((N + 0.004) * F) / Q;
    j.push([D(X) + 0.0298, -X]);
  }
  for (let F = Q; F >= 0; F--) {
    let X = -0.004 + ((N + 0.004) * F) / Q;
    j.push([D(X) - 0.0298, -X]);
  }
  u.push(xr(j, -0.0113, 0.0113, 0.002, G, 0.25));
  for (let F = 0; F < 8; F++) {
    let X = 0.082 + F * 0.0155;
    u.push(
      Rt(0.0246, 0.0058, 0.05, 0.0016, 0, -X, D(X), G, 0.3, [
        Math.atan(C(X)),
        0,
        0,
      ]),
    );
  }
  for (let F = 0; F < 10; F++) {
    let X = 0.078 + F * 0.013;
    u.push(
      Rt(0.012, 0.011, 0.004, 0.001, 0, -X, D(X) + 0.0302, G, 0.3, [
        Math.atan(C(X)),
        0,
        0,
      ]),
    );
  }
  (u.push(
    Rt(0.027, 0.009, 0.068, 0.003, 0, -N - 0.003, D(N) + 0.001, G, 0.3, [
      Math.atan(C(N)),
      0,
      0,
    ]),
  ),
    u.push(
      Rt(
        0.01,
        0.004,
        0.012,
        0.001,
        0,
        -N - 0.008,
        D(N) - 0.01,
        [0.6, 0.6, 0.6],
        0,
        [Math.atan(C(N)), 0, 0],
      ),
    ),
    u.push(Rt(0.003, 0.006, 0.04, 0.001, -0.0085, 0.0045, 0.004, G, 0.3)),
    u.push(Rt(0.003, 0.006, 0.04, 0.001, 0.0085, 0.0045, 0.004, G, 0.3)));
  let K = [1.25, 0.72, 0.5];
  (h.push(
    Cn(
      [
        [0, -0.02],
        [0.004, -0.02],
        [0.0047, -0.019],
        [0.0047, 0.01],
        [0.0034, 0.014],
        [0.0034, 0.018],
      ],
      12,
      [1, 1, 1],
      0,
      0.002,
      0.0062,
    ),
  ),
    h.push(
      Cn(
        [
          [0.003, 0.018],
          [0.0029, 0.024],
          [0.0022, 0.03],
          [0.001, 0.0345],
          [0, 0.0352],
        ],
        12,
        K,
        0,
        0.002,
        0.0062,
      ),
    ),
    h.push(
      Cn(
        [
          [0, -0.02],
          [0.004, -0.02],
          [0.0047, -0.019],
          [0.0047, 0.01],
        ],
        10,
        [0.8, 0.8, 0.8],
        0,
        -0.003,
        5e-4,
      ),
    ));
  let ie = {
    ano: Ii(r),
    gun: Ii(a),
    poly: Ii(l),
    plain: Ii(f),
    bolt: Ii(c),
    mag: Ii(u),
    round: Ii(h),
  };
  for (let F of ["ano", "gun", "poly", "plain", "bolt"]) {
    let X = ie[F].attributes.position;
    for (let ne = 0; ne < X.count; ne++)
      X.getZ(ne) > -0.1002 &&
        X.getY(ne) < 0.0341 &&
        X.setX(ne, X.getX(ne) * mi.squeeze);
  }
  for (let F in ie) ie[F].computeBoundingSphere();
  return ie;
}
var Kc = (i) => (i.index ? i.index.count : i.attributes.position.count) / 3;
var ti = W,
  vl = Lt,
  rm = Ye,
  Bv = [31, 21.5, 12.5],
  Fv = [5.6, 5.3, 5],
  Lv = [3.2, 3.1, 3],
  am = [12.5, 10, 7.6],
  lm = [16, 11, 6.6],
  dC = [3, 2.6, 2.2],
  kf = [36, 27, 16],
  gl = [20, 14, 8.4],
  Df = [4.8, 4.5, 4.2],
  pC = [30, 9.5, 2.2],
  E_ = [5, 6.9, 9],
  mC = [30, 9.5, 2.2],
  gC = [26, 26, 25],
  um = (i) => (i < 0 ? 0 : i > 1 ? 1 : i),
  xl = (i, e, t) => ((t = um((t - i) / (e - i))), t * t * (3 - 2 * t)),
  Ff = (i, e) => Math.sign(i) * Math.pow(Math.abs(i), e),
  vC = (i) => {
    let e = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return e - Math.floor(e);
  },
  Xo = new ti(),
  S_ = new ti(0, 0, -1),
  yl = class {
    constructor(e) {
      ((this.N = e), (this.P = []), (this.C = []), (this.weld = []));
    }
    v(e, t, n = 1) {
      (this.P.push(e.x, e.y, e.z), this.C.push(t[0] * n, t[1] * n, t[2] * n));
    }
    rings() {
      return this.P.length / 3 / this.N;
    }
    collapse() {
      this.weld.push(this.rings() - 1);
    }
    geo(e = !1) {
      let t = this.N,
        n = this.rings(),
        s = [];
      for (let a = 0; a < n - 1; a++)
        for (let l = 0; l < t; l++) {
          let c = a * t + l,
            u = a * t + ((l + 1) % t),
            h = c + t,
            f = u + t;
          e ? s.push(c, u, h, u, f, h) : s.push(c, h, u, u, h, f);
        }
      let o = new nt();
      (o.setAttribute("position", new He(this.P, 3)),
        o.setAttribute("color", new He(this.C, 3)),
        o.setAttribute(
          "uv",
          new He(new Float32Array((this.P.length / 3) * 2), 2),
        ),
        o.setIndex(s),
        o.computeVertexNormals());
      let r = o.attributes.normal;
      for (let a of this.weld) {
        let l = 0,
          c = 0,
          u = 0;
        for (let f = 0; f < t; f++)
          ((l += r.getX(a * t + f)),
            (c += r.getY(a * t + f)),
            (u += r.getZ(a * t + f)));
        let h = Math.hypot(l, c, u) || 1;
        for (let f = 0; f < t; f++) r.setXYZ(a * t + f, l / h, c / h, u / h);
      }
      return o;
    }
  };
function I_(i, e, t) {
  let n = [],
    s = [],
    o = [],
    r = i.length,
    a = e.length;
  for (let c = 0; c < a; c++)
    for (let u = 0; u < r; u++) {
      let h = t(i[u], e[c], Xo);
      (n.push(Xo.x, Xo.y, Xo.z), s.push(h[0], h[1], h[2]));
    }
  for (let c = 0; c < a - 1; c++)
    for (let u = 0; u < r - 1; u++) {
      let h = c * r + u,
        f = h + 1,
        p = h + r,
        d = p + 1;
      o.push(h, f, p, f, d, p);
    }
  let l = new nt();
  return (
    l.setAttribute("position", new He(n, 3)),
    l.setAttribute("color", new He(s, 3)),
    l.setAttribute("uv", new He(new Float32Array((n.length / 3) * 2), 2)),
    l.setIndex(o),
    l.computeVertexNormals(),
    l
  );
}
var Uv = [-1, -0.9, -0.5, 0, 0.5, 0.9, 1],
  cm = (i) => (Math.abs(i) > 0.95 ? -1 : Math.abs(i) > 0.8 ? 0.82 : 1);
function Lf(i, e, t, n, s, o, r, a = null, l = !1, c = Uv, u = Uv) {
  return I_(c, u, (h, f, p) => {
    let d = i + h * t,
      v = e + (l ? f : -f) * n,
      g = Math.min(cm(h), cm(f)),
      x = r(d, v) + (g < 0 ? -0.0022 : s * g);
    (p.set(d, l ? -x : x, v), a && a(p));
    let y = typeof o == "function" ? o(h, f) : o,
      b = g < 0 ? 0.5 : g < 1 ? 0.8 : 1;
    return [y[0] * b, y[1] * b, y[2] * b];
  });
}
var om = [
    {
      base: [-0.031, 0, -0.094],
      len: [0.044, 0.026, 0.022],
      rad: [0.0096, 0.009, 0.0083, 0.0076],
    },
    {
      base: [-0.0105, 0.001, -0.099],
      len: [0.049, 0.03, 0.023],
      rad: [0.0097, 0.0091, 0.0084, 0.0077],
    },
    {
      base: [0.0105, 0, -0.095],
      len: [0.045, 0.028, 0.022],
      rad: [0.0094, 0.0088, 0.0081, 0.0074],
    },
    {
      base: [0.03, -0.002, -0.086],
      len: [0.035, 0.021, 0.02],
      rad: [0.0084, 0.0078, 0.0072, 0.0066],
    },
  ],
  Nv = [
    12, 34, 44, 68, 90, 112, 136, 146, 168, 192, 220, 245, 270, 295, 320, 348,
  ].map((i) => (i * Math.PI) / 180),
  T_ = Nv.length,
  A_ = 0.0012,
  R_ = [0.14, 0.22, 0.27, 0.73, 0.78, 0.88],
  xC = [0.1, 0.17, 0.1];
function z_(i) {
  let e = new yl(T_),
    { base: t, qs: n, len: s, rad: o } = i,
    r = i.pads || [1, 1, 0],
    a = i.patchJ ?? 1,
    l = i.bump || xC,
    c = i.tipW || 1,
    u = i.tipH || 1,
    h = [],
    f = [],
    p = t.clone();
  for (let M = 0; M < 3; M++)
    (h.push(p.clone()),
      f.push(S_.clone().applyQuaternion(n[M + 1])),
      p.addScaledVector(f[M], s[M]));
  let d = S_.clone().applyQuaternion(n[0]),
    v = (M) => (M ? f[M - 1] : d),
    g = [0, 1, 2].map((M) => new ti().addVectors(v(M), f[M]).normalize()),
    x = (M, E) =>
      (M.x - h[E].x) * g[E].x +
      (M.y - h[E].y) * g[E].y +
      (M.z - h[E].z) * g[E].z,
    y = (M, E) => {
      let w = x(M, E);
      w > 0 && M.addScaledVector(v(E), -w / v(E).dot(g[E]));
    },
    b = (M, E) => {
      let w = x(M, E);
      w < 0 && M.addScaledVector(f[E], -w / f[E].dot(g[E]));
    },
    m = new ti(),
    A = new vl(),
    _ = (M, E, w, S) => {
      let z = S.kD || 1,
        H = S.kP || 1,
        O = S.ao || 1;
      for (let q = 0; q < T_; q++) {
        let U = Math.cos(Nv[q]),
          T = Math.sin(Nv[q]),
          D = q >= 1 && q <= 7,
          C = q >= 2 && q <= 6,
          G = w * U,
          j =
            T > 0
              ? w * 0.96 * T * (C ? z : 1 + (z - 1) * 0.4)
              : w * 0.98 * T * H;
        (S.pad && C && ((G += U * A_), (j += T * A_)),
          (G *= S.wx || 1),
          (j *= S.wy || 1),
          m.set(G, j, 0).applyQuaternion(M).add(E),
          S.a >= 0 && y(m, S.a),
          S.b >= 0 && b(m, S.b));
        let N = D ? Bv : q >= 10 && q <= 14 ? am : lm,
          Q = O;
        (S.pad && C ? (N = Fv) : S.patch && C && ((N = lm), (Q *= 0.9)),
          ((S.pad && D && !C) || (S.edge && D)) && (N = dC),
          S.saddle && q >= 8 && ((N = am), (Q *= 0.9)),
          S.stitch && D && ((N = kf), (Q *= 0.8)),
          (q === 0 || q === 8 || q === 9 || q === 15) && (Q *= 0.72),
          q >= 9 && (Q *= S.aoP || 1),
          e.v(m, N, Q));
      }
    };
  (_(
    n[0],
    Xo.copy(h[0]).addScaledVector(d, -(i.rootBack || 0.012) - 0.002),
    1e-5,
    { a: 0, b: -1, ao: i.rootAo || 0.5 },
  ),
    e.collapse(),
    _(
      n[0],
      Xo.copy(h[0]).addScaledVector(d, -(i.rootBack || 0.012)),
      o[0] * (i.rootK || 1),
      { a: 0, b: -1, ao: i.rootAo || 0.5, saddle: i.saddle },
    ));
  for (let M = 0; M < 3; M++) {
    for (let E = 0; E < 4; E++) {
      let w = E / 3;
      (A.slerpQuaternions(n[M], n[M + 1], w),
        _(
          A,
          Xo.copy(h[M]).addScaledVector(E < 2 ? v(M) : f[M], (E - 1.5) * 4e-4),
          o[M],
          {
            a: w < 0.5 ? M : -1,
            b: w < 0.5 ? -1 : M,
            kD: 1 + l[M] * (E === 0 || E === 3 ? 0.55 : 1),
            patch: M === a,
            saddle: i.saddle && M < 2,
            wx: M === 2 ? 1 + (c - 1) * 0.5 : 1,
            wy: M === 2 ? 1 + (u - 1) * 0.5 : 1,
            ao: M === 0 && !i.rootAo ? 0.62 + 0.1 * E : 1,
            aoP: E === 1 || E === 2 ? 0.55 : 0.8,
          },
        ));
    }
    if (M < 2)
      for (let E = 0; E < R_.length; E++) {
        let w = R_[E],
          S =
            (o[M] + (o[M + 1] - o[M]) * w) * (1 - 0.06 * Math.sin(Math.PI * w));
        _(n[M + 1], Xo.copy(h[M]).addScaledVector(f[M], s[M] * w), S, {
          a: M + 1,
          b: M,
          pad: r[M] && (E === 2 || E === 3),
          edge: r[M] && (E === 1 || E === 4),
          saddle: i.saddle && M === 0,
          ao: M === 0 && !i.rootAo ? 0.86 + 0.14 * xl(0, 0.5, w) : 1,
        });
      }
    else {
      let E = o[3],
        w = s[2] - E;
      (_(n[3], Xo.copy(h[2]).addScaledVector(f[2], s[2] * 0.2), o[2] * 0.97, {
        a: -1,
        b: 2,
        stitch: 1,
        wx: c,
        wy: u,
      }),
        _(
          n[3],
          Xo.copy(h[2]).addScaledVector(f[2], s[2] * 0.42),
          (o[2] + E) * 0.5,
          { a: -1, b: 2, kP: 1.08, wx: c, wy: u },
        ));
      for (let S of [0, 0.6, 1.05, 1.36])
        _(
          n[3],
          Xo.copy(h[2]).addScaledVector(f[2], w + E * 1.08 * Math.sin(S)),
          E * Math.cos(S),
          { a: -1, b: -1, kP: 1.06, wx: c, wy: u },
        );
      (_(n[3], Xo.copy(h[2]).addScaledVector(f[2], w + E * 1.08), 1e-5, {
        a: -1,
        b: -1,
      }),
        e.collapse());
    }
  }
  return e.geo();
}
var yC = (i) => new vl().setFromAxisAngle(new ti(0, 1, 0), i),
  bC = (i) => new vl().setFromAxisAngle(new ti(1, 0, 0), i);
function C_(i, e) {
  let t = [yC(e[3] || 0)];
  for (let n = 0; n < 3; n++) t.push(t[n].clone().multiply(bC(-e[n])));
  return z_({
    base: new ti(i.base[0], i.base[1], i.base[2]),
    qs: t,
    len: i.len,
    rad: i.rad,
  });
}
function _C(i, e) {
  let t = i.clone().negate(),
    n = new ti().crossVectors(e, t);
  (n.lengthSq() < 1e-6 && n.set(1, 0, 0), n.normalize());
  let s = new ti().crossVectors(t, n);
  return new vl().setFromRotationMatrix(new rm().makeBasis(n, s, t));
}
function MC(i) {
  let e = i.map((o) => new ti(o[0], o[1], o[2]).normalize()),
    t = new ti(-0.72, 0.69, 0),
    n = [],
    s = e[2].clone().sub(e[0]);
  s.length() > 0.12 &&
    t.multiplyScalar(0.25).addScaledVector(s.normalize(), -1);
  for (let o = 0; o < 3; o++) n.push(_C(e[o], t));
  return (
    n.unshift(n[0].clone()),
    z_({
      base: new ti(-0.028, -0.007, -0.014),
      qs: n,
      len: [0.044, 0.031, 0.026],
      rad: [0.0165, 0.0118, 0.011, 0.01],
      pads: [0, 1, 0],
      patchJ: 2,
      bump: [0, 0.2, 0.2],
      tipW: 1.12,
      tipH: 0.86,
      saddle: 1,
      rootBack: 0.01,
      rootK: 0.72,
      rootAo: 0.9,
    })
  );
}
var Qc = 0.006,
  D_ = (i) => -0.0975 + 0.0125 * Math.pow((i + 0.008) / 0.04, 2),
  Ov = (i) => D_(i) + 0.006,
  Hv = (i) => 0.029 + 0.014 * xl(0.05, 0.85, i),
  L_ = (i) => 0.0185 - 0.0065 * xl(0.1, 1, i),
  k_ = (i) =>
    0.0185 + 0.003 * Math.sin(Math.PI * um(i * 1.6)) - 0.0055 * xl(0.3, 1, i);
function kv(i, e) {
  let t = um((Qc - e) / (Qc - Ov(i))),
    n = Math.min(0.999, Math.abs(i / Hv(t)));
  return L_(t) * Math.pow(1 - Math.pow(n, 2.5), 0.4);
}
function wC(i, e) {
  let t = um((Qc - e) / (Qc - Ov(i))),
    n = Hv(t),
    s = Math.min(0.999, Math.abs(i / n));
  return (
    k_(t) *
    Math.pow(1 - Math.pow(s, 2.5), 0.4) *
    (1 + 0.14 * Math.max(0, i / n) * Math.sin(Math.PI * t))
  );
}
function EC() {
  let e = new yl(24),
    t = new ti(),
    n = [
      [0, 0, 1, 1],
      [0.1, 0, 1, 1],
      [0.22, 0, 1, 1],
      [0.36, 0, 1, 1],
      [0.5, 0, 1, 1],
      [0.64, 0, 1, 1],
      [0.77, 0, 1, 1],
      [0.89, 0, 1, 1],
      [1, 0, 1, 1],
      [1, -0.005, 0.8, 1],
      [1, -0.009, 0.45, 0.985],
      [1, -0.0105, 0.04, 0.97],
    ];
  for (let [s, o, r, a] of n) {
    let l = Hv(s) * a,
      c = L_(s) * r,
      u = k_(s) * r;
    for (let h = 0; h < 24; h++) {
      let f = ((h + 0.5) / 24) * Math.PI * 2,
        p = Math.cos(f),
        d = Math.sin(f),
        v = l * Ff(p, 0.8),
        g =
          d >= 0
            ? c * Ff(d, 0.8)
            : u *
              Ff(d, 0.8) *
              (1 + 0.14 * Math.max(0, v / l) * Math.sin(Math.PI * s));
      t.set(v, g, Qc + (Ov(v) - Qc) * s + o);
      let x = d > 0.3 ? Bv : d < -0.3 ? am : lm,
        y = 1;
      (s === 0.1 && d > 0.3 && ((x = kf), (y = 0.75)),
        o < 0 && ((x = lm), (y = 0.7 + o * 30)),
        d < -0.3 && (y *= 0.82 + 0.18 * Math.abs(p)),
        e.v(t, x, y));
    }
  }
  return e.geo();
}
function SC(i) {
  let t = new yl(12),
    n = new ti(),
    s = new ti(),
    o = new ti(),
    r = new ti(),
    a = new ti(),
    l = new ti(i.x, i.y, i.z - 1).normalize(),
    c = [-0.12, 0, 0.2, 0.4, 0.6, 0.78, 0.9];
  for (let d = 0; d < c.length; d++) {
    let v = c[d],
      g = d === 0 || d === c.length - 1;
    (s.set(-0.028, -0.007, -0.014).addScaledVector(i, 0.044 * v),
      o.set(-0.03, -0.003, -0.022 - 0.06 * v),
      r.subVectors(s, o));
    let x = r.length() * 0.5 + 0.005;
    (r.normalize(), a.crossVectors(r, l).normalize());
    let y = g ? 1e-5 : 0.0085 * (1 - 0.55 * v),
      b = g ? 1e-5 : x * (1 - 0.3 * v * v);
    for (let m = 0; m < 12; m++) {
      let A = ((m + 0.5) / 12) * Math.PI * 2,
        _ = Math.cos(A),
        M = Math.sin(A);
      n.copy(s)
        .add(o)
        .multiplyScalar(0.5)
        .addScaledVector(r, _ * b)
        .addScaledVector(a, M * y);
      let E = a.y * M < 0;
      t.v(n, E ? am : Bv, E ? 0.85 : 0.92);
    }
    g && t.collapse();
  }
  let u = t.geo(),
    h = u.attributes.position,
    f = u.index.array,
    p = 0;
  for (let d = 0; d < f.length; d += 3)
    (s.fromBufferAttribute(h, f[d]),
      o.fromBufferAttribute(h, f[d + 1]),
      n.fromBufferAttribute(h, f[d + 2]),
      (p += s.dot(o.cross(n))));
  if (p < 0) {
    for (let d = 0; d < f.length; d += 3) {
      let v = f[d + 1];
      ((f[d + 1] = f[d + 2]), (f[d + 2] = v));
    }
    u.computeVertexNormals();
  }
  return u;
}
function P_(i) {
  if ((i.scale(-1, 1, 1), !i.index)) {
    let t = i.attributes.position.count,
      n = new Uint32Array(t);
    for (let s = 0; s < t; s++) n[s] = s;
    i.setIndex(new et(n, 1));
  }
  let e = i.index.array;
  for (let t = 0; t < e.length; t += 3) {
    let n = e[t + 1];
    ((e[t + 1] = e[t + 2]), (e[t + 2] = n));
  }
  return i;
}
function Vv(i) {
  let e = [],
    t = i.debugParts || null,
    n = (d, v) => (e.push(v), t && t.push([d, v]), v);
  n("palm", EC());
  {
    let d = [];
    for (let v = 0; v <= 30; v++) d.push(-1 + v / 15);
    n(
      "guard",
      I_(d, [-1, -0.9, -0.5, 0, 0.5, 0.9, 1], (v, g, x) => {
        let y = -5e-4 + v * 0.0405,
          b = D_(y) + 0.0045 - g * 0.011,
          m = Math.min(cm(v), cm(g)),
          A = 0;
        for (let M = 0; M < 4; M++) {
          let E = (y - om[M].base[0]) / 0.0058;
          A += (M === 3 ? 0.8 : 1) * Math.exp(-E * E);
        }
        ((A = Math.min(1, A) * (1 - 0.55 * g * g)),
          x.set(
            y,
            kv(y, b) +
              (m < 0 ? (g > 0.95 ? -0.008 : -0.003) : (0.0016 + 0.006 * A) * m),
            b,
          ));
        let _ = m < 0 ? 0.6 : 0.85 + 1.3 * A;
        return [Lv[0] * _, Lv[1] * _, Lv[2] * _];
      }),
    );
  }
  for (let d = 0; d < 3; d++)
    n(
      "bar",
      Lf(0.001, -0.034 - d * 0.015, 0.023 + d * 0.0025, 0.0052, 0.0019, Fv, kv),
    );
  (n(
    "seam",
    Lf(
      0,
      -0.0225,
      0.027,
      0.0013,
      9e-4,
      kf.map((d) => d * 0.8),
      kv,
      null,
      !1,
      Uv,
      [-1, 0, 1].map((d) => d * 0.9),
    ),
  ),
    n("heelPad", Lf(0.013, -0.03, 0.0135, 0.017, 0.0017, Fv, wC, null, !0)));
  let s = [];
  for (let d = 0; d < 4; d++) {
    if (d === 0 && i.indexPoses) {
      for (let v of i.indexPoses) s.push(C_(om[0], v));
      continue;
    }
    n("finger" + d, C_(om[d], i.fingers[d]));
  }
  (n("thumb", MC(i.thumb)),
    n(
      "web",
      SC(new ti(i.thumb[0][0], i.thumb[0][1], i.thumb[0][2]).normalize()),
    ));
  let o = new ti(i.forearm[0], i.forearm[1], i.forearm[2]).normalize(),
    r = i.sleeve || 0.36,
    a = 0.022,
    l = new vl().setFromUnitVectors(new ti(0, 0, 1), o),
    c = new vl(),
    u = new vl(),
    h = (d) => (
      u.slerpQuaternions(c, l, xl(0.002, 0.042, d.z)),
      (d.z -= a),
      d.applyQuaternion(u),
      (d.z += a),
      d
    );
  {
    let v = new yl(24),
      g = new ti(),
      x = [
        [-0.0085, -0.0015, Df, 0.6],
        [-0.009, 0.0022, Df, 1.3],
        [-0.006, 0.0026, Df, 1.3],
        [-0.0052, 0.002, gl, 0.75],
        [0.004, 0.0014, gl, 1],
        [0.011, 0.0016, gl, 0.7],
        [0.0122, 0.003, Df, 1.2],
        [0.0305, 0.0032, Df, 1.2],
        [0.0317, 0.0018, gl, 0.7],
        [0.04, 0.002, gl, 1],
        [0.054, 0.0024, gl, 1],
        [0.058, 0.0026, kf, 0.7],
        [0.058, -0.004, gl, 0.4],
      ];
    for (let [y, b, m, A] of x)
      for (let _ = 0; _ < 24; _++) {
        let M = ((_ + 0.5) / 24) * Math.PI * 2,
          E = Math.sin(M);
        v.v(
          h(
            g.set(
              (0.0296 + b) * Ff(Math.cos(M), 0.8),
              (E >= 0 ? 0.0185 + b : 0.0204 + b) * Ff(E, 0.8),
              y,
            ),
          ),
          m,
          A,
        );
      }
    n("cuff", v.geo(!0));
  }
  (n(
    "strapTab",
    Lf(
      0.009,
      0.0215,
      0.0135,
      0.0076,
      0.0017,
      (d) => (d > 0.55 ? kf.map((v) => v * 0.75) : [9, 9, 9.6]),
      (d) =>
        0.0217 *
        Math.pow(1 - Math.pow(Math.min(0.999, Math.abs(d / 0.0328)), 2.5), 0.4),
      h,
    ),
  ),
    n(
      "pullTab",
      Lf(0.003, 0.004, 0.0065, 0.0115, 0.0022, pC, () => 0.022, h, !0),
    ));
  {
    let d = [];
    for (let z = 0; z < 24; z++)
      (d.push(z * 15),
        (z === 4 || z === 16) && d.push(z * 15 + 11.5),
        (z === 5 || z === 17) && d.push(z * 15 + 3.5));
    d.sort((z, H) => z - H);
    let v = d.length,
      g = d.indexOf(75),
      x = d.indexOf(255),
      y = new yl(v),
      b = new ti(),
      m = 0.04 + r,
      A = [
        [0.0415, 0],
        [0.04, 1],
        [0.044, 2],
        [0.049, 3],
        [0.055, 3],
        [0.061, 3],
        [0.0655, 4],
        [0.0685, 5],
      ],
      _ = [0.1415, 0.143, 0.157, 0.1582, 0.1662, 0.1674, 0.181, 0.1825],
      M = _.slice(),
      E = Math.ceil((m - 0.074) / 0.0052);
    for (let z = 0; z <= E; z++) {
      let H = 0.074 + ((m - 0.074) * z) / E;
      _.some((O) => Math.abs(O - H) < 0.0016) || M.push(H);
    }
    M.sort((z, H) => z - H);
    for (let z of M) A.push([z, 6]);
    let w = 0;
    for (let [z, H] of A)
      for (let O = 0; O < v; O++) {
        let q = (d[O] * Math.PI) / 180,
          U,
          T = 1,
          D = E_;
        if (H === 0) ((U = 0.0292), (T = 0.4));
        else if (H === 1) ((U = 0.0372), (T = 1.15));
        else if (H === 2) ((U = 0.0377), (T = 1.1));
        else if (H === 3) {
          let C = Math.cos(q * 12);
          ((U = 0.0368 + 0.0012 * C), (T = 0.62 + 0.26 * C));
        } else if (H === 4) ((U = 0.0356), (T = 0.55));
        else if (H === 5) ((U = 0.038), (T = 0.9));
        else {
          let C = (z - 0.0685) / (m - 0.0685),
            G = 0.0048 * Math.exp(-Math.pow((C - 0.13) / 0.11, 2)),
            j = 0.0048 * xl(0.62, 0.85, C),
            N =
              Math.pow(
                Math.abs(
                  Math.sin(
                    (Math.PI * z) / 0.027 +
                      1.7 * Math.sin(q + 0.5) +
                      0.8 * Math.sin(2 * q + 1.3),
                  ),
                ),
                0.6,
              ) *
                2 -
              1.25,
            Q =
              Math.pow(
                Math.abs(
                  Math.sin(
                    (Math.PI * z) / 0.034 +
                      1.9 * Math.sin(q - 0.8) +
                      0.7 * Math.sin(2 * q),
                  ),
                ),
                0.6,
              ) *
                2 -
              1.25,
            K =
              Math.sin(z * 40 + 2 * Math.sin(q * 2 + 1)) +
              0.6 * Math.sin(3 * q + z * 25);
          ((U =
            0.0405 +
            0.012 * Math.pow(C, 0.85) +
            0.0025 * Math.exp(-Math.pow((z - 0.082) / 0.012, 2)) +
            G * N +
            j * Q +
            0.0016 * K),
            (T =
              0.78 +
              0.26 * xl(-1.1, 0.5, (G * N + j * Q) / (G + j + 8e-4)) +
              0.04 * K));
          let ie = vC(w);
          z > 0.1575 && z < 0.167
            ? ((D = gC), (T *= 0.85 + 0.25 * ie))
            : z > 0.1425 && z < 0.1815 && ((D = mC), (T *= 0.78 + 0.3 * ie));
        }
        (H > 0 &&
          (O === g || O === x
            ? ((U += 0.0019), (T *= 1.3))
            : (Math.abs(O - g) === 1 || Math.abs(O - x) === 1) && (T *= 0.52)),
          b.set(Math.cos(q) * U, Math.sin(q) * U * 0.84, z),
          y.v(b, D, T),
          w++);
      }
    for (let z = 0; z < v; z++) y.v(b.set(0, 0, m + 0.006), E_, 0.3);
    y.collapse();
    let S = y.geo(!0);
    (S.applyMatrix4(
      new rm()
        .makeTranslation(0, 0, a)
        .multiply(new rm().makeRotationFromQuaternion(l))
        .multiply(new rm().makeTranslation(0, 0, -a)),
    ),
      n("sleeve", S));
  }
  let p = {
    fabric: Ii(e),
    rubber: null,
    index: s.length ? s : null,
    knuckle: om[0].base.slice(),
  };
  return (
    i.mirror &&
      (P_(p.fabric), p.index && p.index.forEach(P_), (p.knuckle[0] *= -1)),
    p
  );
}
var hm = {
    model: [8, 8, 330, 84],
    maker: [8, 100, 560, 40],
    cal: [8, 146, 560, 40],
    prop: [8, 192, 700, 40],
    safe: [8, 240, 90, 34],
    semi: [110, 240, 90, 34],
    auto: [212, 240, 90, 34],
    rack: [8, 290, 300, 110],
    warn: [330, 290, 420, 110],
    optic: [580, 8, 300, 60],
    light: [580, 76, 300, 60],
    dots: [320, 240, 60, 34],
    r2: [8, 420, 56, 40],
    r4: [72, 420, 56, 40],
    r6: [136, 420, 56, 40],
    r8: [200, 420, 56, 40],
    r10: [264, 420, 56, 40],
    r12: [328, 420, 56, 40],
  },
  Uf = 1024,
  Nf = 512;
function TC() {
  let i = document.createElement("canvas");
  ((i.width = Uf), (i.height = Nf));
  let e = i.getContext("2d");
  (e.clearRect(0, 0, Uf, Nf), (e.textBaseline = "middle"));
  let t = (u, h, f, p, d = "left") => {
      let [v, g, x, y] = hm[u];
      ((e.font = f),
        (e.fillStyle = p),
        (e.textAlign = d),
        e.fillText(h, d === "left" ? v + 2 : v + x / 2, g + y / 2 + 1, x - 4));
    },
    n = '"Barlow Condensed", "Arial Narrow", Arial, sans-serif',
    s = '"IBM Plex Mono", "Courier New", monospace',
    o = '"Big Shoulders Display", "Barlow Condensed", Impact, sans-serif',
    r = "rgba(196,198,194,0.92)";
  (t("model", "PAC-9", `700 78px ${o}`, r),
    t("maker", "LONGSHORE ARMS WORKS  \xB7  SALTLINE", `600 30px ${n}`, r),
    t("cal", "CAL 5.8\xD740   SN PA-004217", `500 27px ${s}`, r),
    t(
      "prop",
      "PROPERTY OF PORT AUTHORITY \u2014 BERTH 4 ARMOURY",
      `600 28px ${n}`,
      r,
    ),
    t("safe", "S", `700 30px ${n}`, r, "center"),
    t("semi", "1", `700 30px ${n}`, r, "center"),
    t("auto", "A", `700 30px ${n}`, "rgba(205,60,40,0.95)", "center"),
    t("rack", "B4-07", `800 104px ${o}`, "rgba(214,206,170,0.9)", "center"));
  for (let u of [2, 4, 6, 8, 10, 12])
    t("r" + u, "T" + u, `600 30px ${s}`, "rgba(190,192,188,0.85)", "center");
  (t("optic", "HX-2 REFLEX", `700 44px ${n}`, r, "center"),
    t("light", "900 LM  IPX8", `600 40px ${n}`, r, "center"));
  {
    let [u, h] = hm.warn;
    ((e.fillStyle = r),
      (e.textAlign = "left"),
      (e.font = `600 24px ${n}`),
      [
        "WARNING \u2014 CLEAR CHAMBER BEFORE",
        "STOWAGE. AUTHORISED BREACH",
        "PERSONNEL ONLY. PA-REG 44/7",
      ].forEach((f, p) => e.fillText(f, u + 2, h + 20 + p * 34)));
  }
  {
    let [u, h, f, p] = hm.dots;
    ((e.fillStyle = r),
      e.beginPath(),
      e.arc(u + 12, h + p / 2, 7, 0, 7),
      e.fill(),
      (e.fillStyle = "rgba(205,60,40,0.95)"),
      e.beginPath(),
      e.arc(u + 40, h + p / 2, 7, 0, 7),
      e.fill());
  }
  e.globalCompositeOperation = "destination-out";
  let a = 7,
    l = () => ((a = (a * 16807) % 2147483647), a / 2147483647);
  for (let u = 0; u < 2600; u++) {
    e.fillStyle = `rgba(0,0,0,${0.25 + l() * 0.6})`;
    let h = l() < 0.9 ? 1 + l() * 1.5 : 2 + l() * 5;
    e.fillRect(l() * Uf, l() * Nf, h, h * (0.4 + l()));
  }
  let c = new xs(i);
  return (
    (c.colorSpace = Vn),
    (c.anisotropy = 8),
    (c.generateMipmaps = !0),
    (c.minFilter = Ln),
    c
  );
}
function F_(i) {
  let e = [],
    t = [],
    n = [],
    s = [];
  for (let [l, c, u, h, f, p, d = 0] of i) {
    let [v, g, x, y] = hm[l],
      b = (f * x) / y,
      m = v / Uf,
      A = (v + x) / Uf,
      _ = 1 - g / Nf,
      M = 1 - (g + y) / Nf,
      E = e.length / 3,
      w;
    if (
      (p === "L"
        ? (w = [
            [c, u - f / 2, -(h + b / 2)],
            [c, u - f / 2, -(h - b / 2)],
            [c, u + f / 2, -(h - b / 2)],
            [c, u + f / 2, -(h + b / 2)],
          ])
        : p === "R"
          ? (w = [
              [c, u - f / 2, -(h - b / 2)],
              [c, u - f / 2, -(h + b / 2)],
              [c, u + f / 2, -(h + b / 2)],
              [c, u + f / 2, -(h - b / 2)],
            ])
          : (w = [
              [c - b / 2, u, -(h - f / 2)],
              [c + b / 2, u, -(h - f / 2)],
              [c + b / 2, u, -(h + f / 2)],
              [c - b / 2, u, -(h + f / 2)],
            ]),
      d)
    ) {
      let z = Math.cos(d),
        H = Math.sin(d),
        O = u,
        q = -h;
      for (let U of w) {
        let T = U[1] - O,
          D = U[2] - q;
        ((U[1] = O + T * z - D * H), (U[2] = q + T * H + D * z));
      }
    }
    for (let z of w) e.push(z[0], z[1], z[2]);
    t.push(m, M, A, M, A, _, m, _);
    let S = p === "L" ? [-1, 0, 0] : p === "R" ? [1, 0, 0] : [0, 1, 0];
    for (let z = 0; z < 4; z++) n.push(S[0], S[1], S[2]);
    s.push(E, E + 1, E + 2, E, E + 2, E + 3);
  }
  let o = new nt();
  (o.setAttribute("position", new He(e, 3)),
    o.setAttribute("uv", new He(t, 2)),
    o.setAttribute("normal", new He(n, 3)),
    o.setIndex(s));
  let r = new Qt({
      map: TC(),
      transparent: !0,
      roughness: 0.62,
      metalness: 0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
      side: Sn,
    }),
    a = new Qe(o, r);
  return ((a.renderOrder = 2), a);
}
function U_(i, e) {
  let t = new ji();
  (i.forEach((r, a) => (a ? t.lineTo(r[0], r[1]) : t.moveTo(r[0], r[1]))),
    t.closePath());
  let n = new H0(t);
  n.translate(0, 0, -e);
  {
    let r = 1e9,
      a = -1e9,
      l = 1e9,
      c = -1e9;
    for (let f of i)
      ((r = Math.min(r, f[0])),
        (a = Math.max(a, f[0])),
        (l = Math.min(l, f[1])),
        (c = Math.max(c, f[1])));
    let u = n.attributes.position,
      h = n.attributes.uv;
    for (let f = 0; f < u.count; f++)
      h.setXY(f, (u.getX(f) - r) / (a - r), (u.getY(f) - l) / (c - l));
  }
  let s = new zn({
      transparent: !0,
      premultipliedAlpha: !0,
      depthWrite: !1,
      side: Sn,
      uniforms: {
        uBright: { value: 7 },
        uSun: { value: Mn.dir.clone() },
        uSunCol: { value: Mn.color.clone() },
        uZen: { value: en.zenith.clone() },
        uHor: { value: en.horizonAway.clone() },
        uTilt: { value: 0.1 },
      },
      vertexShader: `
      varying vec3 vView, vFwd, vRight, vUp, vWPos, vWN; varying vec2 vUv;
      uniform float uTilt;
      void main(){
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0); vView = mv.xyz;
        vFwd = (modelViewMatrix * vec4(0.0, 0.0, -1.0, 0.0)).xyz; vRight = (modelViewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz; vUp = (modelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz;
        vWPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vWN = normalize(mat3(modelMatrix) * normalize(vec3(0.0, -uTilt, 1.0)));   // real sights tilt the glass a few degrees
        gl_Position = projectionMatrix * mv;
      }`,
      fragmentShader: `
      varying vec3 vView, vFwd, vRight, vUp, vWPos, vWN; varying vec2 vUv;
      uniform float uBright; uniform vec3 uSun, uSunCol, uZen, uHor;
      void main(){
        vec3 d = normalize(vView), fw = normalize(vFwd);
        float k = max(dot(d, fw), 1e-3);
        vec2 a = vec2(dot(d, normalize(vRight)), dot(d, normalize(vUp))) / k;      // tangent of the angle off the bore axis
        float r = length(a), px = max(fwidth(r), 1e-5);
        float dotR = max(0.0011, px * 0.9), ringW = max(0.00045, px * 0.6);
        float dotI = 1.0 - smoothstep(dotR - px, dotR + px, r);
        float ring = 1.0 - smoothstep(ringW - px * 0.5, ringW + px, abs(r - 0.0128));
        float ang = atan(a.y, a.x);
        float tick = (1.0 - smoothstep(0.0, px * 1.2 + 0.0004, min(abs(a.x), abs(a.y)))) * step(0.0128, r) * (1.0 - smoothstep(0.0165, 0.0175, r));
        float ret = clamp(dotI + ring * 0.8 + tick * 0.8, 0.0, 1.0);
        // faint halo so the bloom has something to hold on to
        ret += 0.05 * exp(-r * r / 0.00002);
        vec3 retCol = vec3(1.0, 0.11, 0.045) * ret * uBright;
        // coated glass: sky/sun reflection through a ruby-teal dichroic coating, stronger at grazing angles
        vec3 wv = normalize(vWPos - cameraPosition); vec3 n = normalize(vWN); if (dot(n, wv) > 0.0) n = -n;
        vec3 rf = reflect(wv, n);
        float fres = pow(1.0 - abs(dot(wv, n)), 3.0);
        vec3 sky = mix(uHor, uZen, clamp(rf.y * 1.4 + 0.2, 0.0, 1.0));
        float sd = max(dot(rf, uSun), 0.0);
        sky += uSunCol * (pow(sd, 6.0) * 0.6 + pow(sd, 90.0) * 6.0);
        // blue -> amber dichroic coating across the glass, a soft diagonal sheen band, and a thin dark edge
        float band = smoothstep(0.25, 0.5, vUv.x * 0.6 + vUv.y) * (1.0 - smoothstep(0.62, 0.95, vUv.x * 0.6 + vUv.y));
        vec3 coat = mix(vec3(0.30, 0.50, 0.95), vec3(1.0, 0.62, 0.28), clamp(fres * 2.2 + vUv.y * 0.75 - 0.15, 0.0, 1.0));
        vec2 e = abs(vUv - 0.5) * 2.0; float edge = smoothstep(0.90, 1.0, max(e.x, e.y));
        float refl = 0.12 + 0.60 * fres + 0.07 * band;
        // faint emitter glow that stays visible off-axis (what you see of a powered sight from the hip)
        vec2 eg = (vUv - vec2(0.5, 0.16)) * vec2(1.0, 1.6); retCol += vec3(1.0, 0.10, 0.04) * 0.20 * exp(-dot(eg, eg) * 60.0) * (1.0 - smoothstep(0.985, 0.9995, k));
        vec3 col = (sky * 1.5 + vec3(0.03, 0.035, 0.045)) * coat * refl * (1.0 - edge) + retCol;
        float alpha = clamp(0.20 + 0.32 * fres + 0.05 * band + 0.6 * edge, 0.0, 0.94);
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    }),
    o = new Qe(n, s);
  return ((o.renderOrder = 5), o);
}
function N_() {
  let i = [],
    e = [],
    t = [],
    n = [],
    s = (d, v, g, x, y) => {
      let b = i.length / 3;
      for (let m of [d, v, g, x]) i.push(m[0], m[1], m[2]);
      e.push(0, 0, 1, 0, 1, 1, 0, 1);
      for (let m = 0; m < 4; m++) t.push(y);
      n.push(b, b + 1, b + 2, b, b + 2, b + 3);
    };
  (s(
    [-0.13, -0.13, -0.03],
    [0.13, -0.13, -0.03],
    [0.13, 0.13, -0.03],
    [-0.13, 0.13, -0.03],
    0,
  ),
    s(
      [-0.13 * 0.7, -0.13 * 0.7, -0.09],
      [0.13 * 0.7, -0.13 * 0.7, -0.09],
      [0.13 * 0.7, 0.13 * 0.7, -0.09],
      [-0.13 * 0.7, 0.13 * 0.7, -0.09],
      0,
    ));
  let r = 0.065,
    a = 0.34;
  (s([-r, 0, 0.01], [r, 0, 0.01], [r, 0, -a], [-r, 0, -a], 1),
    s([0, -r, 0.01], [0, r, 0.01], [0, r, -a], [0, -r, -a], 1));
  let l = 0.17,
    c = 0.05,
    u = 0.035;
  (s([-l, -c, u], [l, -c, u], [l, c, u], [-l, c, u], 2),
    s([-l, 0, u + c], [l, 0, u + c], [l, 0, u - c], [-l, 0, u - c], 2),
    s(
      [-0.05, -0.05, -0.01],
      [0.05, -0.05, -0.01],
      [0.05, 0.05, -0.01],
      [-0.05, 0.05, -0.01],
      3,
    ),
    s(
      [-0.03, -0.03, 0.02],
      [0.03, -0.03, 0.02],
      [0.03, 0.03, 0.02],
      [-0.03, 0.03, 0.02],
      4,
    ));
  let h = new nt();
  (h.setAttribute("position", new He(i, 3)),
    h.setAttribute("uv", new He(e, 2)),
    h.setAttribute("aType", new He(t, 1)),
    h.setIndex(n));
  let f = new zn({
      transparent: !0,
      depthWrite: !1,
      blending: hr,
      side: Sn,
      uniforms: {
        uSeed: { value: 0 },
        uInt: { value: 0 },
        uHeat: { value: 0 },
        uJet: { value: 1 },
      },
      vertexShader: `attribute float aType; varying vec2 vUv; varying float vType;
      void main(){ vUv = uv; vType = aType; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec2 vUv; varying float vType; uniform float uSeed, uInt, uHeat, uJet;
      float h1(float n){ return fract(sin(n * 127.1 + uSeed * 311.7) * 43758.5453); }
      void main(){
        vec2 p = vUv * 2.0 - 1.0; float r = length(p), a = atan(p.y, p.x); float I = 0.0; vec3 tintc = vec3(1.0, 0.50, 0.16);
        if (vType < 0.5) {
          float n1 = 3.0 + floor(h1(1.0) * 3.0), n2 = 5.0 + floor(h1(2.0) * 4.0);
          float pet = pow(abs(cos(a * n1 * 0.5 + h1(3.0) * 6.283)), 5.0) * (0.55 + 0.45 * h1(4.0));
          pet += pow(abs(cos(a * n2 * 0.5 + h1(5.0) * 6.283)), 14.0) * 0.55;
          float reach = 0.35 + 0.65 * pet;
          I = (0.25 + pet) * smoothstep(reach, reach * 0.15, r) * (0.75 + 0.25 * sin(r * 26.0 + h1(6.0) * 20.0));
        } else if (vType < 1.5) {
          float y = vUv.y, x = p.x * (1.0 + 0.5 * sin(y * 17.0 + h1(7.0) * 30.0) * y);
          float wdt = mix(0.20, 0.75, smoothstep(0.0, 0.35, y)) * (1.0 - y * 0.75);
          I = exp(-x * x / (wdt * wdt * 0.35)) * pow(1.0 - y, 1.4) * (0.7 + 0.3 * sin(y * 31.0 + h1(8.0) * 9.0)) * 0.9;
        } else if (vType < 2.5) {
          float u = abs(p.x), len = 0.55 + 0.45 * h1(9.0 + step(0.0, p.x));
          float wv = p.y * (1.0 + u * 3.0) + 0.12 * sin(u * 14.0 + h1(10.0) * 20.0) * u;
          I = exp(-wv * wv * 22.0) * smoothstep(len, 0.06, u) * smoothstep(0.02, 0.10, u) * 0.85 * uJet;
        } else if (vType < 3.5) {
          I = exp(-r * r * 5.0) * 2.4 * smoothstep(1.0, 0.6, r); tintc = vec3(1.0, 0.82, 0.58);
        } else {
          gl_FragColor = vec4(vec3(1.0, 0.28, 0.06) * exp(-r * r * 4.0) * smoothstep(1.0, 0.5, r) * uHeat, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          return;
        }
        vec3 col = mix(tintc, vec3(1.0, 0.90, 0.70), clamp(I * I * 0.7, 0.0, 1.0)) * I * uInt;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    }),
    p = new Qe(h, f);
  return ((p.renderOrder = 10), (p.frustumCulled = !1), p);
}
var Wv = { value: 1 },
  AC = `
varying vec3 vObjP; varying vec3 vWNrm; varying vec3 vONrm; uniform float uKind; uniform float uRain;
float dh3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float dn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(dh3(i), dh3(i + vec3(1,0,0)), f.x), mix(dh3(i + vec3(0,1,0)), dh3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(dh3(i + vec3(0,0,1)), dh3(i + vec3(1,0,1)), f.x), mix(dh3(i + vec3(0,1,1)), dh3(i + vec3(1,1,1)), f.x), f.y), f.z); }
vec2 dh2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
vec2 dDrops(vec2 uv, float cell, float seed){ vec2 g = uv / cell, i = floor(g), f = fract(g); float best = 0.0;
  for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) { vec2 o = vec2(float(a), float(b)); vec2 r = dh2(i + o + seed);
    float keep = step(0.70, fract(r.x * 7.31 + r.y * 3.17)); vec2 c = o + 0.2 + 0.6 * r; float rad = (0.16 + 0.22 * fract(r.x * 13.7)) * keep;
    float d = length(f - c); best = max(best, sqrt(max(rad * rad - d * d, 0.0))); }
  return vec2(best * cell, step(1e-6, best)); }
vec3 dBump(vec3 N, float h){ vec3 dpdx = dFdx(-vViewPosition), dpdy = dFdy(-vViewPosition); float dhx = dFdx(h), dhy = dFdy(h);
  vec3 r1 = cross(dpdy, N), r2 = cross(N, dpdx); float det = dot(dpdx, r1); vec3 g = sign(det) * (dhx * r1 + dhy * r2);
  return normalize(abs(det) * N - g); }
`,
  RC = `
vec3 dP = vObjP; vec3 dAn = abs(vONrm);
vec2 dUV = (dAn.y > dAn.x && dAn.y > dAn.z) ? dP.xz : (dAn.x > dAn.z ? dP.zy : dP.xy);
float dSm = dn3(dP * 36.0), dSm2 = dn3(dP * 150.0 + 7.0), dFine = dn3(dP * 2400.0);
float dHt = 0.0, dR = 0.0;
if (uKind < 0.5) {
  float scuff = smoothstep(0.70, 0.9, dn3(dP * vec3(420.0, 420.0, 26.0) + 3.0));
  float smudge = smoothstep(0.55, 0.8, dn3(dP * 55.0 + 11.0));
  dR = (dSm - 0.5) * 0.20 + (dSm2 - 0.5) * 0.10 + (dFine - 0.5) * 0.08 + scuff * 0.18 - smudge * 0.12;
  dHt = dFine * 0.000010 - scuff * 0.000015;
} else if (uKind < 1.5) {
  float ring = sin(dP.z * 5200.0) * 0.5 + 0.5, streak = dn3(vec3(dP.z * 950.0, 1.0, 2.0));
  dR = (streak - 0.5) * 0.26 + (dSm - 0.5) * 0.14 + (dFine - 0.5) * 0.10;
  dHt = ring * 0.000014 + dFine * 0.000010;
} else {
  float st = dn3(dP * 1500.0) * 0.6 + dn3(dP * 3100.0 + 5.0) * 0.4;
  dR = (dSm - 0.5) * 0.18 + (st - 0.5) * 0.14 - smoothstep(0.6, 0.85, dSm2) * 0.10;
  dHt = st * 0.000075;
}
float dUp = smoothstep(0.30, 0.75, vWNrm.y) * uRain;
vec2 dD1 = dDrops(dUV, 0.0046, 3.0), dD2 = dDrops(dUV + 0.31, 0.0023, 9.0);
float dDrop = max(dD1.y, dD2.y) * dUp, dDropH = max(dD1.x, dD2.x) * dUp;
float dWet = dUp * (0.5 + 0.5 * smoothstep(0.3, 0.7, dSm));
roughnessFactor = clamp(roughnessFactor + dR, 0.10, 1.0);
roughnessFactor = mix(roughnessFactor, roughnessFactor * 0.5, dWet);
roughnessFactor = mix(roughnessFactor, 0.10, dDrop);
diffuseColor.rgb *= 1.0 - 0.18 * dWet;
`,
  CC = `
normal = dBump(normal, dHt + dDropH * 0.32);
`;
function Bf(i, e) {
  return (
    (i.onBeforeCompile = (t) => {
      ((t.uniforms.uKind = { value: e }),
        (t.uniforms.uRain = Wv),
        (t.vertexShader = t.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vObjP; varying vec3 vWNrm; varying vec3 vONrm;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vObjP = position; vONrm = normal; vWNrm = normalize(mat3(modelMatrix) * normal);`,
          )),
        (t.fragmentShader = t.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + AC,
          )
          .replace(
            "#include <roughnessmap_fragment>",
            `#include <roughnessmap_fragment>
` + RC,
          )
          .replace(
            "#include <normal_fragment_maps>",
            `#include <normal_fragment_maps>
` + CC,
          )));
    }),
    (i.customProgramCacheKey = () => "pac9-detail-" + e),
    i
  );
}
var gi = W,
  fm = Lt,
  Gv = 30,
  B_ = 150,
  O_ = 720,
  H_ = 26,
  V_ = 300,
  eu = { p: [0.118, -0.122, -0.275], r: [0.034, 0.085, -0.03] },
  qv = { p: [0, -mi.sightY, -0.135], r: [0, 0, 0] },
  tu = { p: [-0.035, 0.004, 0.03], r: [-0.04, 0.62, 0.26] },
  nu = { p: [-0.03, 0.1, -0.02], r: [0.46, 0.22, -0.8] },
  W_ = 2.1,
  G_ = 2.72,
  Yo = (i) => ((i = Fo(i)), i * i * i * (i * (6 * i - 15) + 10)),
  pa = (i, e) => ({ x: 0, v: 0, k: i, c: e });
function ma(i, e, t) {
  let n = t > 0.012 ? Math.ceil(t / 0.008) : 1,
    s = t / n;
  for (let o = 0; o < n; o++)
    ((i.v += ((e - i.x) * i.k - i.v * i.c) * s), (i.x += i.v * s));
  return i.x;
}
var i0 = (i, e, t, n = "XYZ") => new fm().setFromEuler(new In(i, e, t, n));
async function dm(i) {
  let e = new wt();
  e.name = "viewmodel-pac9";
  let t = w_(),
    n = {
      anodized_black: 2,
      gunmetal: 2,
      brass: 4,
      glove_fabric: 3,
      rubber: 4,
    },
    s = (Me) =>
      i.mats.get(Me, { triplanar: !0, vertexColors: !0, scale: n[Me] || 1 }),
    o = (Me, we) => {
      let be = new Qe(Me, we);
      return (
        (be.castShadow = !1),
        (be.receiveShadow = !0),
        (be.frustumCulled = !1),
        be
      );
    },
    r = new Qt({
      color: new Ve(0.0085, 0.009, 0.0105),
      roughness: 0.4,
      metalness: 0.45,
      vertexColors: !0,
    });
  ((r.name = "pac9_anodised"), Bf(r, 0));
  let a = new Qt({
    color: 16777215,
    roughness: 0.92,
    metalness: 0,
    vertexColors: !0,
  });
  a.name = "pac9_matte";
  let l = new Qt({
    color: new Ve(0.016, 0.016, 0.0165),
    roughness: 0.5,
    metalness: 0.7,
    vertexColors: !0,
  });
  ((l.name = "pac9_phosphate"), Bf(l, 1));
  let c = new Qt({
    color: new Ve(0.0125, 0.0128, 0.0135),
    roughness: 0.62,
    metalness: 0,
    vertexColors: !0,
  });
  ((c.name = "pac9_polymer"), Bf(c, 2));
  let u = new Qt({
    color: new Ve(0.105, 0.08, 0.05),
    roughness: 0.62,
    metalness: 0,
    vertexColors: !0,
  });
  ((u.name = "pac9_polymer_tan"),
    Bf(u, 2),
    e.add(o(t.ano, r), o(t.gun, l), o(t.poly, c), o(t.plain, a)));
  let h = o(t.bolt, l);
  e.add(h);
  let f = new wt(),
    p = new gi().fromArray(mi.magPos);
  f.position.copy(p);
  let d = o(t.round, s("brass"));
  (f.add(o(t.mag, u), d), e.add(f));
  let v = null,
    g = null,
    x = null;
  try {
    ((v = F_([
      ["model", -0.0168, -0.0315, 0.064, 0.0095, "L"],
      ["maker", -0.0168, -0.042, 0.064, 0.003, "L"],
      ["cal", -0.0168, -0.0465, 0.064, 0.0028, "L"],
      ["prop", -0.0168, -0.071, 0.066, 0.0026, "L"],
      ["auto", -0.0168, -0.027, -0.0335, 0.0036, "L"],
      ["semi", -0.0168, -0.0262, -0.049, 0.0036, "L"],
      ["safe", -0.0168, -0.0362, -0.062, 0.0036, "L"],
      ["rack", -0.0168, -0.004, -0.205, 0.02, "L"],
      ["warn", -0.0181, -0.01, 0.03, 0.0062, "L"],
      ["optic", -0.0195, 0.0735, 0.021, 0.0024, "L"],
      ["model", 0.0168, -0.0315, 0.068, 0.0095, "R"],
      ["warn", 0.0168, -0.066, 0.066, 0.0075, "R"],
      ["rack", 0.0168, -0.004, -0.205, 0.02, "R"],
      ["auto", 0.0168, -0.027, -0.0335, 0.0036, "R"],
      ["safe", 0.0168, -0.0362, -0.062, 0.0036, "R"],
      ["optic", 0.0195, 0.0735, 0.021, 0.0024, "R"],
      ["cal", 0.0181, 0.0245, -0.055, 0.0026, "R"],
      ["r2", 0, 0.04365, -0.0816, 0.003, "T"],
      ["r4", 0, 0.04365, -0.0616, 0.003, "T"],
      ["r6", 0, 0.04365, 0.0584, 0.003, "T"],
      ["r8", 0, 0.04365, 0.0784, 0.003, "T"],
      ["r10", 0, 0.04365, 0.0984, 0.003, "T"],
      ["r12", 0, 0.04365, 0.1184, 0.003, "T"],
    ])),
      (v.castShadow = !1),
      (v.receiveShadow = !0),
      (v.frustumCulled = !1),
      e.add(v));
  } catch (Me) {
    console.warn("[weapon] markings skipped: " + Me);
  }
  ((g = U_(
    mi.window.map((Me) => [
      Me[0] * 1.01,
      (Me[1] - mi.sightY) * 1.01 + mi.sightY,
    ]),
    mi.lensF + 0.0025,
  )),
    (g.frustumCulled = !1),
    e.add(g),
    (x = N_()),
    x.position.fromArray(mi.muzzle),
    (x.visible = !1),
    e.add(x));
  let y = (Me, we, be) => {
      let Oe = new gi(we[0], we[1], we[2])
        .normalize()
        .applyQuaternion(Me.clone().invert());
      return (be && (Oe.x *= -1), [Oe.x, Oe.y, Oe.z]);
    },
    b = i0(-0.24, 0, 0).multiply(i0(0, 0, -Math.PI / 2)),
    m = Vv({
      mirror: !1,
      fingers: [
        null,
        [0.62, 1.72, 0.8, 0],
        [0.68, 1.7, 0.8, -0.03],
        [0.74, 1.66, 0.8, -0.09],
      ],
      indexPoses: [
        [0.1, 0.16, 0.1, 0.05],
        [0.46, 1.15, 0.5, 0],
      ],
      thumb: [
        y(b, [-0.85, 0.05, -0.5]),
        y(b, [-0.6, -0.05, -0.8]),
        y(b, [-0.05, -0.2, -0.97]),
      ],
      forearm: y(b, [0.27, -0.44, 0.86]),
      sleeve: 0.34,
    }),
    A = new wt();
  (A.quaternion.copy(b),
    A.position
      .fromArray(mi.grip)
      .sub(new gi(0.006, -0.031, -0.085).applyQuaternion(b)));
  let _ = s("glove_fabric");
  A.add(o(m.fabric, _));
  let M = o(m.index[0].clone(), _);
  (A.add(M), e.add(A));
  let E = m.index[0].attributes,
    w = m.index[1].attributes,
    S = -1;
  function z(Me) {
    if (Math.abs(Me - S) < 0.004) return;
    S = Me;
    let we = M.geometry.attributes.position,
      be = M.geometry.attributes.normal,
      Oe = E.position.array,
      pt = w.position.array,
      ut = E.normal.array,
      nn = w.normal.array;
    for (let bt = 0; bt < Oe.length; bt++)
      ((we.array[bt] = Oe[bt] + (pt[bt] - Oe[bt]) * Me),
        (be.array[bt] = ut[bt] + (nn[bt] - ut[bt]) * Me));
    ((we.needsUpdate = !0), (be.needsUpdate = !0));
  }
  let H = i0(0, 0, Math.PI / 2).multiply(i0(0.06, 0, 0)),
    O = Vv({
      mirror: !0,
      fingers: [
        [1.27, 1.42, 0.75, 0.02],
        [1.3, 1.45, 0.75, 0],
        [1.3, 1.45, 0.75, -0.02],
        [1.33, 1.45, 0.75, -0.05],
      ],
      thumb: [
        y(H, [0, 0.25, -0.97], !0),
        y(H, [0.05, 0.1, -0.99], !0),
        y(H, [0, 0, -1], !0),
      ],
      forearm: y(H, [-0.5, -0.35, 0.79], !0),
      sleeve: 0.34,
    }),
    q = new wt();
  (q.add(o(O.fabric, _)), e.add(q));
  let U = new gi(0, -0.015, -0.055),
    T = (Me, we, be = U) => ({
      q: Me.clone(),
      p: new gi(we[0], we[1], we[2]).sub(be.clone().applyQuaternion(Me)),
    }),
    D = (Me, we, be, Oe, pt = null) => ({
      q: pt ? pt.clone() : Me.q.clone(),
      p: Me.p.clone().add(new gi(we, be, Oe)),
    }),
    C = i0(0, 0, Math.PI / 2).multiply(i0(0.12, 0, 0)),
    G = T(H, [-0.015, -0.062, -0.236]),
    j = T(C, [-0.0135, -0.15, -0.0745]),
    N = D(j, -0.035, -0.02, 0.01),
    Q = D(j, -0.06, -0.3, 0.13, C.clone().multiply(i0(-0.5, 0, 0.25))),
    K = D(j, 0, -0.035, 0.004),
    ie = D(j, -0.004, -0.06, 0),
    F = D(j, 0, -0.012, 0),
    X = i0(-0.6, 0, 0).multiply(
      new fm().setFromRotationMatrix(
        new Ye().makeBasis(new gi(0, 0, 1), new gi(-1, 0, 0), new gi(0, -1, 0)),
      ),
    ),
    ne = T(
      X,
      [mi.handlePos[0] - 0.004, mi.handlePos[1], mi.handlePos[2]],
      new gi(0, -0.024, -0.118),
    ),
    re = D(ne, 0, 0, mi.boltTravel),
    $ = [
      [0, G],
      [0.1, G],
      [0.36, N],
      [0.44, j],
      [0.5, j],
      [0.8, Q],
      [0.98, Q],
      [1.28, K],
      [1.35, j],
      [1.45, ie],
      [1.52, F],
      [1.62, j],
      [1.7, N],
      [2.02, G],
      [9, G],
    ],
    ue = [
      ...$.slice(0, 12),
      [1.7, N],
      [1.96, ne],
      [2.02, ne],
      [2.14, re],
      [2.19, re],
      [2.26, ne],
      [2.36, ne],
      [2.66, G],
      [9, G],
    ],
    me = 0.47,
    ee = 1.345,
    B = 2.02,
    P = 2.14,
    V = 2.19,
    Y = new gi(),
    L = new fm(),
    Z = new fm(),
    J = new gi(),
    oe = new gi(),
    fe = new gi();
  function le(Me, we) {
    let be = 0;
    for (; be < Me.length - 2 && we > Me[be + 1][0]; ) be++;
    let Oe = Me[be],
      pt = Me[be + 1],
      ut = Yo((we - Oe[0]) / Math.max(1e-4, pt[0] - Oe[0]));
    (Y.copy(Oe[1].p).lerp(pt[1].p, ut), L.copy(Oe[1].q).slerp(pt[1].q, ut));
  }
  (q.position.copy(G.p), q.quaternion.copy(G.q));
  let R = C.clone().invert();
  (e.traverse((Me) => {
    Me.layers.set(zc);
  }),
    i.camera.add(e));
  let I =
      Object.values(t).reduce((Me, we) => Me + Kc(we), 0) +
      Kc(m.fabric) +
      Kc(m.index[0]) +
      Kc(O.fabric) +
      (v ? Kc(v.geometry) : 0) +
      2,
    se = 0;
  (e.traverse((Me) => {
    Me.isMesh && se++;
  }),
    console.log(
      `[weapon] ${mi.name}: ${Math.round(I)} tris, ${se} meshes (flash only while firing)`,
    ));
  let ae = i.rng && i.rng.fork ? i.rng.fork() : Math.random,
    k = {
      t: 0,
      cooldown: 0,
      prevFire: !1,
      dryDone: !1,
      autoReload: -1,
      reload: null,
      burst: 0,
      lastShot: -9,
      bloom: 0,
      heat: 0,
      smoke: 0,
      smokeTick: 0,
      adsLin: 0,
      adsE: 0,
      sprintT: 0,
      reloadW: 0,
      rackW: 0,
      bobPhase: 0,
      bobAmt: 0,
      finger: 0,
      boltT: 9,
      boltLocked: !1,
      flashT: 0,
      flashDur: 0.05,
      recPhase: 0,
      wasGround: !0,
      lastVy: 0,
      spreadS: 0.0125,
      idleT: 0,
      inspect: -1,
      kZ: pa(520, 30),
      kP: pa(380, 26),
      kY: pa(300, 22),
      kR: pa(300, 20),
      swY: pa(110, 15),
      swP: pa(110, 15),
      jY: pa(140, 13),
      jP: pa(140, 13),
      bump: pa(600, 30),
    },
    ce = { freeze: !1, reloadT: null, empty: !1, flash: !1, noFire: !1 },
    ve = {
      name: mi.name,
      ammo: Gv,
      magSize: Gv,
      reserve: B_,
      state: "idle",
      ads: 0,
      spread: 0.0125,
      damage: H_,
      rpm: O_,
      root: e,
      debug: ce,
      info: { tris: Math.round(I), meshes: se },
      update: Xe,
      reset: _e,
      setVisible(Me) {
        e.visible = !!Me;
      },
      muzzleWorld: Re,
      reloadNow: Fe,
      addAmmo(Me) {
        ve.reserve += Me;
      },
      setWetness(Me) {
        Wv.value = Math.max(0, Math.min(1, +Me || 0));
      },
      snap() {
        k.adsLin = i.input.ads ? 1 : 0;
        for (let Me of [
          "kZ",
          "kP",
          "kY",
          "kR",
          "swY",
          "swP",
          "jY",
          "jP",
          "bump",
        ])
          ((k[Me].x = 0), (k[Me].v = 0));
        k.sprintT = i.player.sprinting ? 1 : 0;
      },
    };
  function _e() {
    ((ve.ammo = Gv),
      (ve.reserve = B_),
      (ve.state = "idle"),
      (ve.ads = 0),
      Object.assign(k, {
        cooldown: 0,
        prevFire: !1,
        dryDone: !1,
        autoReload: -1,
        reload: null,
        burst: 0,
        lastShot: -9,
        bloom: 0,
        heat: 0,
        smoke: 0,
        adsLin: 0,
        adsE: 0,
        sprintT: 0,
        reloadW: 0,
        boltT: 9,
        boltLocked: !1,
        flashT: 0,
        idleT: 0,
        inspect: -1,
      }));
    for (let Me of ["kZ", "kP", "kY", "kR", "swY", "swP", "jY", "jP", "bump"])
      ((k[Me].x = 0), (k[Me].v = 0));
    ((d.visible = !0),
      (f.visible = !0),
      f.position.copy(p),
      f.quaternion.identity(),
      q.position.copy(G.p),
      q.quaternion.copy(G.q));
  }
  let Te = new Ye();
  function Pe(Me, we) {
    (e.updateMatrix(), we.fromArray(Me).applyMatrix4(e.matrix));
    let be = i.camera,
      Oe =
        Math.tan((be.fov * Math.PI) / 360) /
        Math.tan((i.viewCamera.fov * Math.PI) / 360);
    return (
      (we.x *= Oe),
      (we.y *= Oe),
      we.applyQuaternion(be.quaternion).add(be.position)
    );
  }
  function Re(Me = new gi()) {
    return Pe(mi.muzzle, Me);
  }
  function Fe() {
    if (k.reload || ve.ammo >= ve.magSize || ve.reserve <= 0) return !1;
    let Me = ve.ammo <= 0;
    return (
      (k.reload = { t: 0, T: Me ? G_ : W_, empty: Me, f: {} }),
      (k.autoReload = -1),
      i.events.emit("weapon:reload", { phase: "start", empty: Me }),
      !0
    );
  }
  let ze = new gi(),
    We = new gi(),
    Ne = new gi(),
    dt = new gi(),
    xe = new gi(),
    Ie = new gi();
  function Be() {
    let Me = i.player,
      we = i.camera;
    (ve.ammo--,
      k.burst++,
      (k.lastShot = k.t),
      (k.heat = Math.min(1.3, k.heat + 0.05)));
    let be = ve.spread,
      Oe = ae() * Math.PI * 2,
      pt = Math.tan(be) * Math.sqrt(ae());
    (ze
      .set(Math.cos(Oe) * pt, Math.sin(Oe) * pt, -1)
      .normalize()
      .applyQuaternion(we.quaternion),
      Ie.copy(Me.eye || we.position));
    let ut = null;
    try {
      ut = i.combat.playerShot(Ie, ze, { damage: H_, range: V_ });
    } catch {}
    (ut && ut.point ? Ne.copy(ut.point) : Ne.copy(Ie).addScaledVector(ze, V_),
      Re(We));
    let nn = i.fx;
    (nn &&
      (nn.tracer && nn.tracer(We, Ne),
      nn.shell &&
        (Pe(mi.eject, dt),
        xe
          .set(2 + ae() * 1.2, 1.2 + ae() * 0.8, 0.5 - ae() * 0.6)
          .applyQuaternion(we.quaternion),
        Me.vel && xe.add(Me.vel),
        nn.shell(dt, xe))),
      i.render &&
        i.render.lightPool &&
        i.render.lightPool.flash(We, 16756832, 45, 9, 0.05),
      i.events.emit("weapon:fire", {
        origin: Ie,
        dir: ze,
        muzzle: We,
        ads: k.adsE,
      }));
    let bt = bi(1, 0.55, k.adsE) * (Me.crouching ? 0.85 : 1),
      Os = k.burst,
      pn = Os <= 9 ? 1 : 0.38,
      Ti =
        (Os < 4
          ? (ae() - 0.5) * 0.0022
          : Math.sin(Os * 0.57 + k.recPhase) * 0.0042 + (ae() - 0.5) * 0.002) *
        bt;
    (Me.addRecoil && Me.addRecoil(0.0068 * pn * bt * (0.85 + ae() * 0.3), Ti),
      Me.addShake && Me.addShake(0.12 * bt),
      (k.kZ.v += 1.5 * bi(1, 0.6, k.adsE)),
      (k.kP.v += 1.5 * bt),
      (k.kY.v += (ae() - 0.5) * 1 * bt),
      (k.kR.v += (ae() - 0.5) * 1.8 * bt),
      (k.bloom = Math.min(1, k.bloom + 0.17)),
      (k.flashT = k.flashDur = 0.036 + ae() * 0.02));
    let ho = x.material.uniforms;
    ((ho.uSeed.value = ae() * 100),
      (ho.uJet.value = 0.6 + ae() * 0.6),
      (x.rotation.z = (ae() - 0.5) * 0.4));
    let Rs = (0.8 + ae() * 0.5) * bi(1, 0.62, k.adsE);
    (x.scale.set(Rs, Rs, Rs * (0.8 + ae() * 0.5)),
      (k.boltT = 0),
      ve.ammo <= 0 && ((k.boltLocked = !0), (d.visible = !1)));
  }
  function Xe(Me) {
    let we = i.player,
      be = i.input;
    if (!we || !be || !we.alive) {
      ((k.prevFire = !1), x && (x.visible = !1));
      return;
    }
    k.t += Me;
    let Oe = !!be.fire && e.visible && !ce.noFire,
      pt = Oe && !k.prevFire;
    ((k.prevFire = Oe), Oe || (k.dryDone = !1));
    let ut = !!we.sprinting && !Oe && !be.ads && !k.reload;
    ((k.sprintT = kn(k.sprintT, ut ? 1 : 0, 9, Me)),
      be.pressed && be.pressed("reload") && Fe(),
      k.autoReload >= 0 && ((k.autoReload -= Me), k.autoReload < 0 && Fe()));
    let nn = 0;
    if (
      (ce.reloadT != null &&
        !k.reload &&
        (k.reload = { t: 0, T: ce.empty ? G_ : W_, empty: ce.empty, f: {} }),
      k.reload)
    ) {
      let Je = k.reload;
      ce.reloadT != null ? (Je.t = ce.reloadT) : (Je.t += Me);
      let Pt = Je.t,
        Vt = (Tt, Ai) =>
          Pt >= Ai && !Je.f[Tt]
            ? ((Je.f[Tt] = 1),
              i.events.emit("weapon:reload", { phase: Tt, empty: Je.empty }),
              !0)
            : !1;
      if (
        (Vt("magout", me) && (k.bump.v -= 0.25),
        Pt > 0.86 && !Je.f.fresh && ((Je.f.fresh = 1), (d.visible = !0)),
        Vt("magin", ee))
      ) {
        k.bump.v += 0.55;
        let Tt = Math.min(ve.magSize - ve.ammo, ve.reserve);
        ((ve.ammo += Tt), (ve.reserve -= Tt), Je.empty || (k.boltLocked = !1));
      }
      (Pt >= 1.5 && !Je.f.tap && ((Je.f.tap = 1), (k.bump.v += 0.4)),
        Je.empty &&
          (Pt >= B &&
            (nn =
              Pt < P
                ? Yo((Pt - B) / (P - B))
                : Pt < V
                  ? 1
                  : Math.max(0, 1 - (Pt - V) / 0.035)),
          Vt("bolt", V) &&
            ((k.boltLocked = !1), (k.bump.v += 0.3), (k.kZ.v -= 0.5))),
        le(Je.empty ? ue : $, Pt),
        q.position.copy(Y),
        q.quaternion.copy(L),
        Pt >= me && Pt < ee
          ? (Z.copy(L).multiply(R),
            f.quaternion.copy(Z),
            f.position.copy(p).sub(j.p).applyQuaternion(Z).add(Y))
          : (f.quaternion.identity(), f.position.copy(p)));
      let ss = Yo(Pt / 0.3),
        Hs = 1 - Yo((Pt - (Je.T - 0.46)) / 0.4);
      ((k.reloadW = Math.min(ss, Hs)),
        (k.rackW = Je.empty ? Yo((Pt - 1.62) / 0.3) * Hs : 0),
        Pt >= Je.T &&
          ce.reloadT == null &&
          ((k.reload = null),
          (k.reloadW = 0),
          (k.rackW = 0),
          i.events.emit("weapon:reload", { phase: "done" }),
          q.position.copy(G.p),
          q.quaternion.copy(G.q)));
    }
    k.cooldown -= Me;
    let bt = !k.reload && k.sprintT < 0.45;
    if (Oe && bt)
      if (ve.ammo > 0) {
        let Je = 0;
        for (; k.cooldown <= 0 && ve.ammo > 0 && Je < 3; )
          (Be(), (k.cooldown += 60 / O_), Je++);
      } else
        k.dryDone ||
          ((k.dryDone = !0),
          i.events.emit("weapon:dry", {}),
          (k.bump.v -= 0.08),
          ve.reserve > 0 && (k.autoReload = 0.32));
    (k.cooldown < 0 && (k.cooldown = Math.max(k.cooldown, -0.001)),
      k.t - k.lastShot > 0.24 &&
        (k.burst > 0 && (k.recPhase = ae() * 6.28), (k.burst = 0)),
      (k.bloom = Math.max(0, k.bloom - Me * 1.5)),
      k.t - k.lastShot > 0.11 &&
        k.t - k.lastShot < 0.11 + Me * 1.5 &&
        k.heat > 0.4 &&
        (k.smoke = Math.min(1.6, k.heat * 1.3)),
      k.smoke > 0 &&
        ((k.smoke -= Me),
        (k.smokeTick -= Me),
        k.smokeTick <= 0 &&
          i.fx &&
          i.fx.smoke &&
          ((k.smokeTick = 0.085),
          Re(We),
          i.fx.smoke(We, {
            size: 0.1 + k.smoke * 0.06,
            life: 1.3,
            rise: 0.5,
            count: 1,
            alpha: 0.22,
          }))),
      (k.heat = Math.max(0, k.heat - Me * 0.2)));
    let Os = !!be.ads && !k.reload && k.sprintT < 0.35;
    ((k.adsLin = Zn(k.adsLin + (Os ? Me : -Me) / 0.18, 0, 1)),
      (k.adsE = Yo(k.adsLin)),
      (ve.ads = k.adsE));
    let pn = we.speed || 0,
      Ti = Fo(pn / 6),
      ho =
        bi(0.0125, 0.0012, k.adsE) +
        Ti * bi(0.013, 0.004, k.adsE) +
        k.bloom * bi(0.0065, 0.0022, k.adsE) +
        (we.onGround === !1 ? 0.022 : 0) -
        (we.crouching ? 0.002 * (1 - k.adsE) : 0);
    ((k.spreadS = kn(k.spreadS, ho, 18, Me)),
      (ve.spread = k.spreadS),
      Oe ||
      !!be.ads ||
      !!k.reload ||
      pn > 0.2 ||
      (be.look && Math.abs(be.look.dx) + Math.abs(be.look.dy) > 0.002) ||
      k.sprintT > 0.1
        ? ((k.idleT = 0),
          k.inspect >= 0 && (k.inspect = Math.max(k.inspect, 2.9)))
        : (k.idleT += Me),
      k.inspect < 0 && k.idleT > 24 && (k.inspect = 0));
    let Un = 0,
      zo = 0,
      $i = 0;
    if (k.inspect >= 0) {
      let Je = (k.inspect += Me);
      ((Un = Yo(Je / 0.5) * (1 - Yo((Je - 1.4) / 0.5))),
        (zo = Yo((Je - 1.5) / 0.5) * (1 - Yo((Je - 2.8) / 0.5))),
        ($i = Yo(Je / 0.5) * (1 - Yo((Je - 2.9) / 0.5))),
        Je > 3.5 && ((k.inspect = -1), (k.idleT = 0)));
    }
    ((ve.state = k.reload
      ? "reloading"
      : k.inspect >= 0
        ? "inspect"
        : k.sprintT > 0.5
          ? "sprinting"
          : k.t - k.lastShot < 0.14
            ? "firing"
            : "idle"),
      (k.boltT += Me));
    let ya = 0.072,
      ba = k.boltT < ya ? Math.sin((Math.PI * k.boltT) / ya) : 0;
    (k.boltLocked && k.boltT > ya * 0.5 && (ba = Math.max(ba, 0.86)),
      (h.position.z = mi.boltTravel * Math.max(ba * 0.95, nn)),
      (k.finger = kn(k.finger, (Oe && bt) || ce.flash ? 1 : 0, 30, Me)),
      z(k.finger));
    let Hn = x.material.uniforms;
    if (
      (ce.flash && ((k.flashT = k.flashDur = 0.05), (Hn.uSeed.value = 3.7)),
      (k.flashT -= Me),
      (Hn.uInt.value =
        k.flashT > 0 ? 9.5 * Math.sqrt(Math.max(0, k.flashT / k.flashDur)) : 0),
      (Hn.uHeat.value = Fo((k.heat - 0.45) / 0.8) * 2.2),
      (x.visible = Hn.uInt.value > 0 || Hn.uHeat.value > 0.02),
      ce.freeze)
    )
      return;
    let fo = we.onGround !== !1,
      ln = we.vel ? we.vel.y : 0;
    ((k.bobAmt = kn(k.bobAmt, fo ? Fo(pn / 3.6) : 0, 8, Me)),
      (k.bobPhase += Me * (pn > 0.3 && fo ? 5.2 + pn * 1.55 : 0)));
    let Zo = k.bobPhase,
      yr = k.bobAmt * bi(1, 0.12, k.adsE) * (1 + k.sprintT * 1.4),
      lu = Math.sin(Zo) * 0.006 * yr,
      de =
        (Math.sin(2 * Zo) * 0.0042 -
          Math.pow(0.5 + 0.5 * Math.cos(2 * Zo + 0.6), 4) * 0.0048) *
        yr,
      te = bi(1, 0.3, k.adsE),
      he = k.t,
      pe = bi(1, 0.4, k.adsE);
    if (
      ((k.swY.v += Zn(be.look ? be.look.dx : 0, -0.2, 0.2) * 3.2 * pe),
      (k.swP.v += Zn(be.look ? be.look.dy : 0, -0.2, 0.2) * 2.6 * pe),
      ma(k.swY, 0, Me),
      ma(k.swP, 0, Me),
      (k.swY.x = Zn(k.swY.x, -0.09, 0.09)),
      (k.swP.x = Zn(k.swP.x, -0.07, 0.07)),
      k.wasGround && !fo && ln > 1 && ((k.jY.v -= 0.22), (k.jP.v += 0.7)),
      !k.wasGround && fo)
    ) {
      let Je = Zn(-k.lastVy * 0.06, 0, 0.6);
      ((k.jY.v -= Je), (k.jP.v -= Je * 3.2), (k.kR.v += (ae() - 0.5) * Je * 2));
    }
    ((k.wasGround = fo),
      fo || (k.lastVy = ln),
      ma(k.jY, fo ? 0 : Zn(-ln * 0.0045, -0.02, 0.024), Me),
      ma(k.jP, fo ? 0 : Zn(ln * 0.012, -0.06, 0.06), Me),
      ma(k.kZ, 0, Me),
      ma(k.kP, 0, Me),
      ma(k.kY, 0, Me),
      ma(k.kR, 0, Me),
      ma(k.bump, 0, Me));
    let ge = be.move ? be.move.x : 0,
      ye = be.move ? be.move.y : 0,
      Le = 1 - k.adsE,
      ke = k.adsE,
      Ue = k.sprintT,
      ct = k.reloadW,
      De = k.rackW,
      it =
        bi(eu.p[0], qv.p[0], ke) +
        tu.p[0] * Ue +
        nu.p[0] * ct +
        lu +
        Math.sin(he * 0.85 + 1) * 0.0012 * te -
        k.swY.x * 0.06 -
        ge * 0.004 * Le -
        0.035 * $i,
      gt =
        bi(eu.p[1], qv.p[1], ke) +
        tu.p[1] * Ue +
        nu.p[1] * ct +
        de +
        Math.sin(he * 1.7) * 0.0016 * te +
        k.swP.x * 0.05 +
        k.jY.x +
        k.bump.x * 0.6 +
        0.045 * $i,
      Ot =
        bi(eu.p[2], qv.p[2], ke) +
        tu.p[2] * Ue +
        nu.p[2] * ct +
        k.kZ.x * 0.55 +
        ye * 0.004 * Le * (1 - Ue),
      xn =
        eu.r[0] * Le +
        tu.r[0] * Ue +
        nu.r[0] * ct -
        0.16 * De +
        Math.sin(he * 1.7 + 0.8) * 0.0035 * te +
        Math.sin(2 * Zo + 0.5) * 0.008 * yr +
        k.swP.x +
        k.jP.x +
        k.kP.x +
        k.bump.x * 1.5 +
        0.3 * $i,
      $t =
        eu.r[1] * Le +
        tu.r[1] * Ue +
        nu.r[1] * ct +
        Math.sin(he * 0.6) * 0.002 * te +
        Math.sin(Zo) * 0.01 * yr +
        k.swY.x +
        k.kY.x +
        0.18 * $i +
        0.25 * zo,
      Ht =
        eu.r[2] * Le +
        tu.r[2] * Ue +
        nu.r[2] * ct +
        0.62 * De +
        Math.sin(Zo) * 0.014 * yr +
        k.swY.x * 0.7 -
        ge * 0.035 * Le +
        k.kR.x -
        0.75 * Un +
        0.55 * zo +
        Math.sin(he * 0.5) * 0.004 * te;
    (e.position.set(it, gt, Ot), e.rotation.set(xn, $t, Ht, "YXZ"));
  }
  return (_e(), ve);
}
async function PC(i) {
  let e = await dm(i);
  i.weapon = e;
  let t = e.root,
    n = new gi(0, 1.68, 4),
    s = {
      south: [0.28, -0.01, 1],
      east: [1, 0, 0.25],
      north: [-0.2, -0.01, -1],
      west: [-1, 0, 0.1],
      nw: [-0.75, -0.01, -0.65],
    },
    o = {
      side: [Math.PI, [1.12, 1.3, 0.11], [0, 1.235, 0.11], 30],
      right: [0, [1.12, 1.3, -0.11], [0, 1.235, -0.11], 30],
      top: [Math.PI * 0.86, [0.62, 1.8, -0.42], [0, 1.24, 0.12], 32],
      hands: [Math.PI, [0.4, 1.4, 0.02], [0.02, 1.215, 0.25], 30],
      rhand: [0, [0.36, 1.22, 0.27], [0.03, 1.16, 0.09], 30],
      muzzle: [Math.PI, [0.26, 1.37, 0.98], [0, 1.262, 0.44], 30],
      optic: [Math.PI, [0.2, 1.4, -0.26], [0, 1.31, 0.02], 30],
      lower: [Math.PI, [0.34, 1.26, 0.04], [0, 1.2, 0.03], 30],
    },
    r = window.__setShot,
    a = null;
  function l(u, h = {}) {
    a = u;
    let f = o[u],
      p = i.input,
      d = i.player;
    ((p.ads = !1),
      (p.fire = !1),
      (d.sprinting = !1),
      (d.speed = 0),
      (e.debug.reloadT = null),
      (e.debug.flash = !1),
      (e.debug.empty = !1),
      (e.debug.freeze = !!f),
      e.reset());
    let v, g, x;
    if (f)
      (i.scene.add(t),
        t.position.set(0, 1.25, 0),
        t.rotation.set(0, f[0], 0, "YXZ"),
        t.traverse((y) => y.layers.set(vf)),
        (v = f[1]),
        (g = f[2]),
        (x = f[3]),
        h.wt != null &&
          ((e.debug.reloadT = +h.wt), (e.debug.empty = !!h.wempty)));
    else {
      (i.camera.add(t), t.traverse((b) => b.layers.set(zc)));
      let y = s[h.wlook] || s.south;
      ((v = [n.x, n.y, n.z]),
        (g = [n.x + y[0] * 50, n.y + y[1] * 50, n.z + y[2] * 50]),
        (x = 74),
        u === "ads" && ((p.ads = !0), (x = 52)),
        u === "sprint" && ((d.sprinting = !0), (d.speed = 6)),
        u === "fire" &&
          ((e.debug.flash = !0), h.wads && ((p.ads = !0), (x = 52))),
        (u === "reload" || u === "empty") &&
          ((e.debug.reloadT = h.wt != null ? +h.wt : 0.62),
          (e.debug.empty = u === "empty")),
        u === "empty" && (e.ammo = 0));
    }
    return (
      e.snap(),
      e.update(0.016),
      e.snap(),
      r &&
        r({
          cam: h.cam || [...v, ...g].join(","),
          fov: h.fov || x,
          exposure: h.exposure,
        }),
      { cam: v, target: g }
    );
  }
  window.__setShot = (u) => {
    u && u.wpose ? l(u.wpose, u) : r && r(u);
  };
  let c = l(i.params.wpose || "hip", i.params);
  return {
    cam: c.cam,
    target: c.target,
    update(u) {
      (e.update(u), a === "fire" && (e.debug.flash = !0));
    },
  };
}
