/*
 * Saltline — 07-backdrop.js
 * distant cranes, ship, boat, skyline and harbour backdrop
 *
 * Source fragment. All numbered files share one top-level scope and are
 * concatenated in filename order inside a single IIFE at build time.
 * Keep top-level declaration names unique across files.
 */
var mv = {};
br(mv, { create: () => pv, showcase: () => MR });
var _t = (i, e, t) => new W(i, e, t),
  al = (i) => (i.isVector3 ? i : new W(i[0], i[1], i[2])),
  hb = new W(0, 1, 0),
  gR = new W(1, 1, 1),
  ub = new Lt(),
  I1 = new Ye();
function t0(i, e, t) {
  let n =
    Math.imul(i, 374761393) ^
    Math.imul(e, 668265263) ^
    Math.imul(t, 1274126177);
  return (
    (n = Math.imul(n ^ (n >>> 13), 1274126177)),
    ((n ^ (n >>> 16)) >>> 0) / 4294967295
  );
}
function rl(i, e, t) {
  let n = Math.floor(i),
    s = Math.floor(e),
    o = Math.floor(t),
    r = i - n,
    a = e - s,
    l = t - o;
  ((r = r * r * (3 - 2 * r)),
    (a = a * a * (3 - 2 * a)),
    (l = l * l * (3 - 2 * l)));
  let c = (u, h, f) => u + (h - u) * f;
  return c(
    c(
      c(t0(n, s, o), t0(n + 1, s, o), r),
      c(t0(n, s + 1, o), t0(n + 1, s + 1, o), r),
      a,
    ),
    c(
      c(t0(n, s, o + 1), t0(n + 1, s, o + 1), r),
      c(t0(n, s + 1, o + 1), t0(n + 1, s + 1, o + 1), r),
      a,
    ),
    l,
  );
}
function uv(i) {
  let e = i >>> 0;
  return () => (
    (e = (Math.imul(e, 1664525) + 1013904223) >>> 0),
    e / 4294967296
  );
}
var P1 = [1, 1, 1],
  fb = [1, 1, 1];
function hv(i, e, t, n = fb, s = 1) {
  let o = rl(i * 0.31 + 11.3, e * 0.23 + 5.1, t * 0.31 + 3.7),
    r = rl(i * 1.7 + 40.2, 9.5, t * 1.7 + 17.9),
    a = 1 - s * (0.3 - 0.36 * o),
    l = n[0] * a,
    c = n[1] * a,
    u = n[2] * a;
  if (r > 0.68) {
    let h =
      Math.min(1, (r - 0.68) / 0.3) *
      0.6 *
      s *
      (0.35 + 0.65 * rl(i * 0.9, e * 0.45, t * 0.9));
    ((l *= 1 + 0.45 * h), (c *= 1 - 0.3 * h), (u *= 1 - 0.6 * h));
  }
  return ((P1[0] = l), (P1[1] = c), (P1[2] = u), P1);
}
var db = new WeakSet();
function so(i, e, t = {}) {
  let n = i.mats.get(e, { vertexColors: !0, ...t });
  return (db.add(n), n);
}
var io = class {
  constructor() {
    ((this.b = new Map()),
      (this.tris = 0),
      (this.remap = null),
      (this.dz = 0),
      (this.minSize = 0));
  }
  add(e, t, n) {
    if (!t) return;
    if (Array.isArray(t)) {
      for (let o of t) this.add(e, o, n);
      return;
    }
    if (this.remap) {
      let o = this.remap(e, n);
      if (!o) return;
      if (this.minSize) {
        t.computeBoundingBox();
        let r = t.boundingBox;
        if (
          Math.max(r.max.x - r.min.x, r.max.y - r.min.y, r.max.z - r.min.z) <
          this.minSize
        )
          return;
      }
      ((e = o[0]), (n = o[1]), this.dz && t.translate(0, 0, this.dz));
    }
    db.has(e) &&
      !t.attributes.color &&
      Lc(t, (o, r, a) => hv(o, r, a, n || fb));
    let s = this.b.get(e.uuid);
    (s || ((s = { mat: e, geos: [] }), this.b.set(e.uuid, s)),
      s.geos.push(t),
      (this.tris +=
        (t.index ? t.index.count : t.attributes.position.count) / 3));
  }
  build({ cast: e = !0, recv: t = !0 } = {}) {
    let n = new wt();
    for (let s of this.b.values()) {
      let o = Ii(s.geos),
        r = new Qe(o, s.mat),
        a = s.mat.isMeshBasicMaterial || s.mat.transparent;
      ((r.castShadow = e && !a), (r.receiveShadow = t && !a), n.add(r));
    }
    return (this.b.clear(), n);
  }
};
function Ee(i, e, t, n, s, o, r = 0) {
  let a = Math.abs(n - i),
    l = Math.abs(s - e),
    c = Math.abs(o - t),
    u = r > 0 ? Wi(a, l, c, r) : $e(a, l, c);
  return (u.translate((i + n) / 2, (e + s) / 2, (t + o) / 2), u);
}
function xt(i, e, t, n, s, o, r, a = 12, l = !1) {
  let c = ot(i, e, t, a, l);
  return (
    n === "x" ? c.rotateZ(Math.PI / 2) : n === "z" && c.rotateX(Math.PI / 2),
    c.translate(s, o, r),
    c
  );
}
function Ke(i, e, t = 0.03, n = 5, s = !1) {
  ((i = al(i)), (e = al(e)));
  let o = new W().subVectors(e, i),
    r = o.length();
  if (r < 1e-5) return null;
  let a = ot(t, t, r, n, !s);
  return (
    ub.setFromUnitVectors(hb, o.multiplyScalar(1 / r)),
    I1.compose(new W().addVectors(i, e).multiplyScalar(0.5), ub, gR),
    a.applyMatrix4(I1),
    a
  );
}
function jt(i, e, t = 0.3, n = 0.3, s = 0) {
  ((i = al(i)), (e = al(e)));
  let o = new W().subVectors(e, i),
    r = o.length();
  o.multiplyScalar(1 / r);
  let a = new W().crossVectors(o, hb);
  a.lengthSq() < 1e-6 ? a.set(1, 0, 0) : a.normalize();
  let l = new W().crossVectors(a, o),
    c = s > 0 ? Wi(t, r, n, s) : $e(t, r, n);
  return (
    I1.makeBasis(a, o, l).setPosition(
      (i.x + e.x) / 2,
      (i.y + e.y) / 2,
      (i.z + e.z) / 2,
    ),
    c.applyMatrix4(I1),
    c
  );
}
function kr(i, e = 0.03, t = 5) {
  let n = [];
  for (let s = 0; s < i.length - 1; s++) {
    let o = Ke(i[s], i[s + 1], e, t);
    o && n.push(o);
  }
  return n;
}
function ua(i, e, t = 1, n = 10) {
  ((i = al(i)), (e = al(e)));
  let s = [];
  for (let o = 0; o <= n; o++) {
    let r = o / n,
      a = new W().lerpVectors(i, e, r);
    ((a.y -= t * 4 * r * (1 - r)), s.push(a));
  }
  return s;
}
function ll(i, e, t, n, s, o = 0, r = 0) {
  let a = new rn(i, e);
  return (r && a.rotateX(r), o && a.rotateY(o), a.translate(t, n, s), a);
}
function ns(
  i,
  e,
  t,
  { h: n = 1.1, post: s = 2.2, r: o = 0.022, tint: r, mid: a = !0 } = {},
) {
  t = t.map(al);
  for (let l = 0; l < t.length - 1; l++) {
    let c = t[l],
      u = t[l + 1],
      h = c.distanceTo(u),
      f = Math.max(1, Math.round(h / s));
    for (let p = l === 0 ? 0 : 1; p <= f; p++) {
      let d = new W().lerpVectors(c, u, p / f);
      i.add(e, Ke(d, _t(d.x, d.y + n, d.z), o, 4), r);
    }
    (i.add(e, Ke(_t(c.x, c.y + n, c.z), _t(u.x, u.y + n, u.z), o * 1.15, 5), r),
      a &&
        i.add(
          e,
          Ke(
            _t(c.x, c.y + n * 0.5, c.z),
            _t(u.x, u.y + n * 0.5, u.z),
            o * 0.9,
            4,
          ),
          r,
        ));
  }
}
function pb() {
  let i = { value: 0 },
    e = new Nn({ vertexColors: !0, fog: !1 });
  ((e.onBeforeCompile = (n) => {
    ((n.uniforms.uTime = i),
      (n.vertexShader =
        `attribute vec3 blink;
uniform float uTime;
varying float vBlink;
` +
        n.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
 float bph = fract(uTime / max(blink.x, 0.001) + blink.y);
 vBlink = blink.x <= 0.0 ? 1.0 : mix(0.02, 1.0, smoothstep(0.0, 0.06, bph) * (1.0 - smoothstep(blink.z, blink.z + 0.12, bph)));`,
        )),
      (n.fragmentShader =
        `varying float vBlink;
` +
        n.fragmentShader.replace(
          "#include <color_fragment>",
          `#include <color_fragment>
 diffuseColor.rgb *= vBlink;`,
        )));
  }),
    (e.customProgramCacheKey = () => "saltline-blink"));
  let t = [];
  return {
    uTime: i,
    mat: e,
    add(n, s, o = 0, r = 0, a = 0.5) {
      if (!n) return;
      let l = n.index ? n.toNonIndexed() : n,
        c = l.attributes.position.count,
        u = new Float32Array(c * 3),
        h = new Float32Array(c * 3);
      for (let p = 0; p < c; p++)
        ((u[p * 3] = s[0]),
          (u[p * 3 + 1] = s[1]),
          (u[p * 3 + 2] = s[2]),
          (h[p * 3] = o),
          (h[p * 3 + 1] = r),
          (h[p * 3 + 2] = a));
      let f = new nt();
      (f.setAttribute("position", l.attributes.position),
        f.setAttribute("color", new et(u, 3)),
        f.setAttribute("blink", new et(h, 3)),
        t.push(f));
    },
    build() {
      if (!t.length) return null;
      let n = new Qe(sa(t.splice(0), !1), e);
      return ((n.castShadow = !1), (n.receiveShadow = !1), n);
    },
  };
}
var Bn = (i, e, t, n = 0.12) => {
  let s = new Na(n, 0);
  return (s.translate(i, e, t), s);
};
var Bt = 18.5,
  is = 28.5,
  Di = 5.4,
  fv = 21.2,
  ai = 22.8,
  On = 1.8,
  wo = 12,
  Xi = 62,
  ks = 41,
  wn = [0.82, 0.95, 1.12],
  Ms = [0.6, 0.72, 0.86],
  En = [1, 0.95, 0.85],
  cl = [0.95, 0.96, 0.97];
function z1(i, e, t = {}) {
  let n = !!t.into,
    s = t.dz || 0,
    o = t.into || new io(),
    r = n
      ? {
          add(R, I, se, ae, k) {
            (R.translate(0, 0, s), e.add(R, I, se, ae, k));
          },
        }
      : e,
    a = so(i, "paint_grey"),
    l = so(i, "paint_yellow"),
    c = so(i, "paint_white"),
    u = so(i, "paint_red"),
    h = i.mats.get("steel_galv"),
    f = i.mats.get("steel_dark"),
    p = i.mats.get("hazard_stripes"),
    d = i.mats.get("glass"),
    v = i.mats.emissive(16769716, 6),
    g = (R, I, se) => o.add(R, I, se),
    x = [];
  if (n) {
    let R = new Map([
        [a.uuid, [0.2, 0.25, 0.31]],
        [l.uuid, [0.72, 0.52, 0.12]],
        [c.uuid, [0.78, 0.78, 0.76]],
        [u.uuid, [0.5, 0.14, 0.1]],
        [h.uuid, [0.5, 0.52, 0.54]],
        [f.uuid, [0.1, 0.1, 0.11]],
        [p.uuid, [0.7, 0.5, 0.1]],
      ]),
      I = t.mat;
    ((o.remap = (se, ae) => {
      let k = R.get(se.uuid);
      return k
        ? [I, ae ? [k[0] * ae[0], k[1] * ae[1], k[2] * ae[2]] : k]
        : null;
    }),
      (o.dz = s),
      (o.minSize = 2.6));
  }
  function y(R, I) {
    let se = R < 23.5 ? 1 : -1;
    for (let ae of [-1.12, 1.12]) {
      let k = I + ae;
      g(l, Ee(R - 0.3, 0.36, k - 0.98, R + 0.3, 0.84, k + 0.98, 0.04), En);
      for (let ce of [-0.56, 0.56])
        (g(f, xt(0.33, 0.33, 0.14, "x", R, 0.33, k + ce, 16)),
          g(f, xt(0.37, 0.37, 0.025, "x", R - 0.085, 0.33, k + ce, 16)),
          g(f, xt(0.37, 0.37, 0.025, "x", R + 0.085, 0.33, k + ce, 16)),
          g(h, xt(0.11, 0.11, 0.7, "x", R, 0.33, k + ce, 8)));
      (g(f, xt(0.16, 0.16, 0.5, "z", R + se * 0.5, 0.6, k, 10)),
        g(
          l,
          Ee(
            R + se * 0.3,
            0.42,
            k - 0.56 - 0.16,
            R + se * 0.62,
            0.8,
            k - 0.3,
            0.03,
          ),
          En,
        ));
    }
    (g(f, Ee(R - 0.2, 0.1, I - 0.22, R + 0.2, 0.9, I + 0.22, 0.03)),
      g(a, Ee(R - 0.34, 0.9, I - 1.8, R + 0.34, 1.42, I + 1.8, 0.05), wn));
    for (let ae of [-1.12, 0, 1.12])
      g(h, xt(0.14, 0.14, 0.8, "x", R, ae ? 1.08 : 1.22, I + ae, 10));
    g(a, Ee(R - 0.54, 1.42, I - 0.54, R + 0.54, 1.6, I + 0.54, 0.03), Ms);
    for (let ae of [-1, 1]) {
      let k = I + ae * 2.1;
      (g(l, Ee(R - 0.16, 0.44, k - 0.12, R + 0.16, 0.8, k + 0.12, 0.02), En),
        g(h, xt(0.08, 0.08, 0.34, "z", R, 0.62, k + ae * 0.28, 8)),
        g(f, xt(0.17, 0.15, 0.12, "z", R, 0.62, k + ae * 0.5, 12)),
        g(p, Ee(R - 0.28, 0.04, k + ae * 0.13, R + 0.28, 0.4, k + ae * 0.16)));
    }
    (x.push({ min: [R - 0.5, 0, I - 2.7], max: [R + 0.5, 1.5, I + 2.7] }),
      x.push({
        min: [R - 0.62, 0, I - 0.62],
        max: [R + 0.62, 24, I + 0.62],
      }));
  }
  let b = [3.6, 7.6, 11.2, 12.5, 13.5, 17.2, 20.6, 23.8];
  for (let R of [Bt, is])
    for (let I of [-Di, Di]) {
      (y(R, I), g(p, Ee(R - 0.6, 1.6, I - 0.6, R + 0.6, 3.6, I + 0.6, 0.04)));
      for (let se = 0; se < b.length - 1; se++)
        (g(
          a,
          Ee(R - 0.6, b[se], I - 0.6, R + 0.6, b[se + 1], I + 0.6, 0.05),
          wn,
        ),
          (se === 0 || se === 1 || se === 5) &&
            g(
              a,
              Ee(
                R - 0.64,
                b[se] - 0.05,
                I - 0.64,
                R + 0.64,
                b[se] + 0.05,
                I + 0.64,
              ),
              Ms,
            ));
    }
  let m = i.mats.decal("hazard_voltage");
  for (let R of [-Di, Di]) {
    let I = Bt - 0.6;
    (g(
      c,
      Ee(I - 0.035, 1.72, R - 0.36, I, 3.48, R + 0.36, 0.012),
      [0.62, 0.66, 0.7],
    ),
      g(f, Ee(I - 0.05, 1.66, R - 0.42, I - 0.005, 1.72, R + 0.42)),
      g(f, Ee(I - 0.05, 3.48, R - 0.42, I - 0.005, 3.54, R + 0.42)),
      g(f, Ee(I - 0.05, 1.66, R - 0.42, I - 0.005, 3.54, R - 0.36)),
      g(f, Ee(I - 0.05, 1.66, R + 0.36, I - 0.005, 3.54, R + 0.42)),
      g(
        h,
        Ke([I - 0.08, 2.45, R + 0.26], [I - 0.08, 2.75, R + 0.26], 0.014, 5),
      ));
    for (let se of [2, 3.2])
      g(f, Ee(I - 0.06, se - 0.07, R - 0.37, I - 0.03, se + 0.07, R - 0.33));
    (g(h, Ee(I - 0.3, 1.5, R - 0.4, I, 1.56, R + 0.4)),
      g(h, Ee(I - 0.3, 1, R - 0.4, I - 0.02, 1.05, R + 0.4)),
      g(m.material, ll(0.3, 0.3, I - 0.04, 3.1, R, -Math.PI / 2)));
  }
  for (let R of [Bt, is]) {
    g(a, Ee(R - 0.45, 3.6, -Di + 0.6, R + 0.45, 4.6, Di - 0.6, 0.05), wn);
    for (let I of [-2.4, 0, 2.4])
      g(a, Ee(R - 0.48, 3.58, I - 0.03, R + 0.48, 4.62, I + 0.03), Ms);
  }
  (g(l, xt(1.15, 1.15, 0.06, "x", Bt - 0.62, 5.85, -2.2, 24), En),
    g(l, xt(1.15, 1.15, 0.06, "x", Bt - 1.02, 5.85, -2.2, 24), En),
    g(f, xt(0.7, 0.7, 0.36, "x", Bt - 0.82, 5.85, -2.2, 20)),
    g(h, xt(0.12, 0.12, 0.9, "x", Bt - 0.6, 5.85, -2.2, 8)),
    g(a, Ee(Bt - 0.5, 4.6, -2.5, Bt + 0.3, 5.9, -1.9, 0.03), Ms),
    g(
      f,
      Ke([Bt - 0.82, 4.75, -2.2 + 1], [Bt - 0.82, 0.02, -1.2 + 0.3], 0.035, 6),
    ),
    g(h, Ee(Bt - 1, 0, -1.15, Bt - 0.64, 0.5, -0.65, 0.02)),
    x.push({ min: [Bt - 1, 0, -1.15], max: [Bt - 0.64, 0.5, -0.65] }),
    g(c, Ee(Bt - 0.42, 4.6, 1, Bt + 0.42, 6.3, 3.6, 0.03), cl));
  for (let R of [1.65, 2.3, 2.95])
    g(f, Ee(Bt - 0.44, 4.7, R - 0.01, Bt - 0.42, 6.2, R + 0.01));
  g(h, Ee(Bt - 0.47, 5.6, 1.2, Bt - 0.42, 6.1, 1.55));
  for (let R of [-Di, Di]) {
    g(a, Ee(Bt + 0.6, 12.5, R - 0.45, is - 0.6, 13.5, R + 0.45, 0.05), wn);
    for (let se of [21, 23.5, 26])
      g(a, Ee(se - 0.03, 12.48, R - 0.48, se + 0.03, 13.52, R + 0.48), Ms);
    let I = Math.sign(R);
    (g(a, jt([Bt + 0.5, 9.6, R], [Bt + 3.4, 12.6, R], 0.4, 0.4, 0.03), wn),
      g(a, jt([is - 0.5, 9.6, R], [is - 3.4, 12.6, R], 0.4, 0.4, 0.03), wn));
    for (let se of [Bt, is])
      g(
        a,
        jt([se, 9.6, R - I * 0.5], [se, 12.6, R - I * 3.4], 0.4, 0.4, 0.03),
        wn,
      );
    (g(a, Ke([is - 0.4, 13.7, R], [Bt + 0.4, 22.7, R], 0.2, 10), wn),
      g(a, Ke([Bt + 0.4, 13.7, R], [is - 0.4, 22.7, R], 0.2, 10), wn),
      g(
        a,
        Ee(23.5 - 0.5, 17.7, R - 0.24, 23.5 + 0.5, 18.7, R + 0.24, 0.03),
        Ms,
      ),
      g(a, Ee(Bt + 0.6, 22.95, R - 0.35, is - 0.6, 23.7, R + 0.35, 0.04), wn));
  }
  for (let R of [Bt, is]) {
    (g(a, Ee(R - 0.45, 12.5, -Di + 0.6, R + 0.45, 13.5, Di - 0.6, 0.05), wn),
      g(a, Ee(R - 0.45, 22.8, -Di + 0.6, R + 0.45, 23.8, Di - 0.6, 0.05), wn));
    for (let I of [-1, 1])
      g(
        a,
        jt(
          [R, 20.2, I * (Di - 0.5)],
          [R, 22.8, I * (On + 1.2)],
          0.36,
          0.36,
          0.03,
        ),
        wn,
      );
  }
  (g(h, Ee(Bt + 0.9, 13.5, 4.05, is - 0.9, 13.55, 4.95)),
    ns(
      o,
      l,
      [
        [Bt + 0.9, 13.55, 4.08],
        [is - 0.9, 13.55, 4.08],
      ],
      { tint: En },
    ),
    g(h, Ee(Bt + 0.45, 13.45, -4.6, Bt + 1.25, 13.5, 4.05)),
    ns(
      o,
      l,
      [
        [Bt + 1.22, 13.5, -4.6],
        [Bt + 1.22, 13.5, 4.05],
      ],
      { tint: En },
    ));
  let A = is + 1.3;
  for (let R of [-1, 1]) {
    let I = R * On,
      se = [
        wo,
        15.4,
        Bt,
        22,
        25.2,
        is,
        A - 0.15,
        A + 0.15,
        34.6,
        39.2,
        43.8,
        48.4,
        53,
        57.6,
        Xi,
      ];
    for (let ce = 0; ce < se.length - 1; ce++)
      ce !== 6 &&
        (g(a, Ee(se[ce], fv, I - 0.45, se[ce + 1], ai, I + 0.45, 0.05), wn),
        ce > 0 &&
          ce !== 7 &&
          g(
            a,
            Ee(
              se[ce] - 0.035,
              fv - 0.05,
              I - 0.5,
              se[ce] + 0.035,
              ai + 0.05,
              I + 0.5,
            ),
            Ms,
          ));
    (g(
      a,
      Ee(A - 0.7, ai - 0.1, I - 0.52, A + 0.7, ai + 0.55, I - 0.4, 0.03),
      Ms,
    ),
      g(
        a,
        Ee(A - 0.7, ai - 0.1, I + 0.4, A + 0.7, ai + 0.55, I + 0.52, 0.03),
        Ms,
      ),
      g(h, xt(0.16, 0.16, 1.2, "z", A, ai + 0.22, I, 12)),
      g(
        f,
        Ee(
          wo + 0.3,
          ai,
          I - R * 0.32 - 0.05,
          Xi - 0.3,
          ai + 0.09,
          I - R * 0.32 + 0.05,
        ),
      ));
    let ae = I + R * 0.45,
      k = I + R * 1.35;
    g(h, Ee(wo + 0.2, 21.86, Math.min(ae, k), Xi - 0.2, 21.9, Math.max(ae, k)));
    for (let ce = wo + 0.6; ce < Xi; ce += 2.45)
      (g(a, jt([ce, 21.84, ae], [ce, 21.3, ae], 0.07, 0.07), Ms),
        g(a, jt([ce, 21.82, k], [ce, 21.36, ae], 0.06, 0.08), Ms));
    (ns(
      o,
      l,
      [
        [wo + 0.2, 21.9, k - R * 0.03],
        [Xi - 0.2, 21.9, k - R * 0.03],
      ],
      { post: 2.45, tint: En },
    ),
      g(
        l,
        Ee(
          wo + 0.2,
          21.9,
          k - R * 0.03 - 0.008,
          Xi - 0.2,
          22.02,
          k - R * 0.03 + 0.008,
        ),
        En,
      ));
    for (let ce of [44, 58])
      g(a, Ee(ce - 0.18, ai, I - 0.2, ce + 0.18, ai + 1.5, I + 0.2, 0.03), wn);
  }
  for (let R of [44, 58])
    g(
      a,
      Ee(R - 0.2, ai + 1.2, -On - 0.3, R + 0.2, ai + 1.6, On + 0.3, 0.04),
      wn,
    );
  for (let R of [wo + 0.25, Xi - 0.25]) {
    g(
      a,
      Ee(R - 0.25, fv + 0.1, -On + 0.45, R + 0.25, ai - 0.1, On - 0.45, 0.05),
      wn,
    );
    let I = R < 30 ? 1 : -1;
    for (let se of [-0.8, 0.8])
      g(f, xt(0.14, 0.14, 0.4, "x", R + I * 0.45, 22, se, 10));
  }
  (g(h, Ee(Xi - 0.1, 21.86, -On - 1.35, Xi + 0.9, 21.9, On + 1.35)),
    ns(
      o,
      l,
      [
        [Xi - 0.1, 21.9, -On - 1.32],
        [Xi + 0.87, 21.9, -On - 1.32],
        [Xi + 0.87, 21.9, On + 1.32],
        [Xi - 0.1, 21.9, On + 1.32],
      ],
      { post: 1.4, tint: En },
    ),
    g(h, Ke([Xi + 0.6, 21.9, 0], [Xi + 0.6, 25.2, 0], 0.035, 6)),
    g(h, Ke([Xi + 0.6, 24.8, -0.45], [Xi + 0.6, 24.8, 0.45], 0.015, 4)),
    r.add(Bn(Xi + 0.6, 25.32, 0, 0.13), [9, 0.5, 0.25], 2.6, 0.5, 0.45),
    g(f, xt(0.1, 0.12, 0.1, "y", Xi + 0.6, 25.2, 0, 8)));
  let _ = 27.6,
    M = 30,
    E = 1.5;
  for (let R of [-1, 1]) {
    (g(a, jt([is, 23.8, R * Di], [_, M, R * E], 0.55, 0.55, 0.04), wn),
      g(a, jt([Bt, 23.8, R * Di], [_, M, R * E], 0.5, 0.5, 0.04), wn));
    for (let [I, se] of [
      [44, 0.1],
      [58, 0.1],
    ]) {
      let ae = _t(_ + 0.3, M, R * E),
        k = _t(I, ai + 1.45, R * On);
      g(a, Ke(ae, k, se, 8), wn);
      let ce = ae.clone().lerp(k, 0.5);
      g(
        a,
        Ee(
          ce.x - 0.3,
          ce.y - 0.16,
          ce.z - 0.14,
          ce.x + 0.3,
          ce.y + 0.16,
          ce.z + 0.14,
          0.03,
        ),
        Ms,
      );
    }
    (g(f, Ke([_ + 0.2, M + 0.35, R * 0.9], [50, ai + 0.2, R * 1], 0.022, 5)),
      g(f, xt(0.5, 0.5, 0.18, "z", _, M + 0.25, R * 0.9, 16)));
  }
  g(a, Ee(_ - 0.45, M - 0.35, -E - 0.5, _ + 0.45, M + 0.3, E + 0.5, 0.05), wn);
  {
    let R = (k, ce) =>
        _t(is + (_ - is) * k, 23.8 + (M - 23.8) * k, ce * (Di + (E - Di) * k)),
      I = (k, ce) =>
        _t(Bt + (_ - Bt) * k, 23.8 + (M - 23.8) * k, ce * (Di + (E - Di) * k));
    (g(a, jt(R(0.5, -1), R(0.5, 1), 0.3, 0.3, 0.02), wn),
      g(a, jt(I(0.55, -1), I(0.55, 1), 0.3, 0.3, 0.02), wn),
      g(a, Ke(I(0.55, -1), R(0.5, -1), 0.09, 6), wn),
      g(a, Ke(I(0.55, 1), R(0.5, 1), 0.09, 6), wn));
    let se = R(0.02, 1),
      ae = R(0.97, 1);
    for (let k of [-0.22, 0.22])
      g(
        h,
        Ke(
          [se.x - 0.42, se.y, se.z + k],
          [ae.x - 0.42, ae.y, ae.z + k],
          0.02,
          4,
        ),
      );
    for (let k = 0.03; k < 1; k += 0.045) {
      let ce = se.clone().lerp(ae, k);
      g(
        h,
        Ke(
          [ce.x - 0.42, ce.y, ce.z - 0.22],
          [ce.x - 0.42, ce.y, ce.z + 0.22],
          0.012,
          4,
        ),
      );
    }
  }
  g(a, Ee(wo + 0.05, ai, -3.6, wo + 0.55, ai + 0.4, 3.6, 0.04), wn);
  for (let R of [-1, 1])
    (g(
      a,
      Ee(
        wo + 0.08,
        ai + 0.4,
        R * 3.3 - 0.2,
        wo + 0.52,
        ai + 1,
        R * 3.3 + 0.2,
        0.03,
      ),
      Ms,
    ),
      g(a, Ke([_ - 0.3, M, R * E], [wo + 0.3, ai + 0.8, R * 3.3], 0.1, 8), wn),
      g(h, xt(0.12, 0.12, 0.6, "z", wo + 0.3, ai + 0.8, R * 3.3, 10)));
  (g(h, Ee(_ - 1, M + 0.3, -E - 0.6, _ + 1, M + 0.34, E + 0.6)),
    ns(
      o,
      l,
      [
        [_ - 0.98, M + 0.34, -E - 0.58],
        [_ + 0.98, M + 0.34, -E - 0.58],
        [_ + 0.98, M + 0.34, E + 0.58],
        [_ - 0.98, M + 0.34, E + 0.58],
        [_ - 0.98, M + 0.34, -E - 0.58],
      ],
      { post: 1.2, tint: En },
    ),
    g(h, Ke([_, M + 0.34, 0], [_, M + 2, 0], 0.045, 6)),
    g(h, Ke([_, M + 2, 0], [_, M + 3.6, 0], 0.016, 4)),
    g(h, Ke([_ - 0.5, M + 1.5, 0], [_ + 0.5, M + 1.5, 0], 0.018, 4)));
  for (let R of [-0.5, 0.5])
    (g(f, xt(0.1, 0.12, 0.1, "y", _ + R, M + 1.56, 0, 8)),
      r.add(Bn(_ + R, M + 1.72, 0, 0.15), [10, 0.5, 0.25], 2.6, 0, 0.45));
  let w = 20.4,
    S = 27.9,
    z = ai,
    H = 26,
    O = 2.9;
  (g(c, Ee(w, z, -O, S, H, O, 0.06), cl),
    g(
      a,
      Ee(w - 0.15, z - 0.12, -O - 0.15, S + 0.15, z + 0.1, O + 0.15, 0.03),
      Ms,
    ),
    g(h, Ee(w - 0.2, H, -O - 0.2, S + 0.2, H + 0.12, O + 0.2, 0.03)));
  for (let R = w + 1.3; R < S; R += 1.3)
    for (let I of [-1, 1])
      g(
        c,
        Ee(R - 0.02, z + 0.1, I * O - 0.015, R + 0.02, H, I * O + 0.015),
        [0.7, 0.72, 0.74],
      );
  function q(R, I, se, ae, k, ce) {
    let ve = [Ee(-ae / 2, -k / 2, 0, ae / 2, k / 2, 0.02)],
      _e = Math.round(k / 0.12);
    for (let Te = 0; Te < _e; Te++) {
      let Pe = Ee(-ae / 2 + 0.03, -0.012, 0, ae / 2 - 0.03, 0.012, 0.11);
      (Pe.rotateX(0.7),
        Pe.translate(0, -k / 2 + (Te + 0.5) * (k / _e), 0.03),
        ve.push(Pe));
    }
    for (let Te of ve) (Te.rotateY(ce), Te.translate(R, I, se));
    (g(f, ve.shift()), g(h, ve));
  }
  for (let R of [-1, 1])
    for (let I of [w + 1.4, w + 3.9, w + 6.1])
      q(I, 24.5, R * (O + 0.005), 1.5, 1.3, R > 0 ? 0 : Math.PI);
  (q(w - 0.005, 23.75, -1.9, 1.4, 1.1, -Math.PI / 2),
    g(
      c,
      Ee(w - 0.03, z + 0.15, 0.8, w, z + 2.15, 1.7, 0.01),
      [0.6, 0.64, 0.68],
    ),
    g(h, Ke([w - 0.06, z + 1, 1.55], [w - 0.06, z + 1.3, 1.55], 0.014, 5)),
    g(h, Ee(w - 0.9, z + 0.05, 0.3, w, z + 0.1, 2.2)),
    ns(
      o,
      l,
      [
        [w, z + 0.1, 0.32],
        [w - 0.88, z + 0.1, 0.32],
        [w - 0.88, z + 0.1, 2.18],
        [w, z + 0.1, 2.18],
      ],
      { post: 1, tint: En },
    ));
  let U = i.mats.decal("logo_a");
  (g(
    U.material,
    ll(1.1 * Math.min(3, U.aspect || 1), 1.1, w - 0.012, 25.2, 0, -Math.PI / 2),
  ),
    ns(
      o,
      l,
      [
        [w, H + 0.12, -O],
        [S, H + 0.12, -O],
        [S, H + 0.12, O],
        [w, H + 0.12, O],
        [w, H + 0.12, -O],
      ],
      { post: 1.95, tint: En },
    ));
  for (let R of [w + 1.9, w + 5.6])
    (g(h, xt(0.28, 0.28, 0.5, "y", R, H + 0.37, -1.2, 10)),
      g(h, xt(0.1, 0.5, 0.22, "y", R, H + 0.72, -1.2, 10)));
  (g(f, xt(0.13, 0.13, 1.6, "y", w + 3.7, H + 0.9, 1.9, 8)),
    g(f, xt(0.2, 0.14, 0.2, "y", w + 3.7, H + 1.75, 1.9, 8)),
    g(
      c,
      Ee(w + 5.4, H + 0.12, 0.4, w + 6.7, H + 0.85, 1.8, 0.03),
      [0.7, 0.72, 0.75],
    ),
    g(h, Ke([w + 0.3, H + 0.12, 2.5], [w + 0.3, H + 1.9, 2.5], 0.03, 5)),
    r.add(Bn(w + 0.3, H + 2.02, 2.5, 0.13), [9, 0.5, 0.25], 2.6, 0.25, 0.45));
  let T = 6.15,
    D = 6.97,
    C = 7.8,
    G = [19.4, 20.6],
    j = [26.4, 27.6];
  function N(R, I, se, ae, k, ce) {
    let ve = ae - I,
      _e = Math.max(2, Math.round(ve / 0.21));
    for (let Te of [k + 0.03, ce - 0.03]) {
      (g(h, jt([R, I - 0.12, Te], [se, ae - 0.12, Te], 0.05, 0.24)),
        g(l, Ke([R, I + 1, Te], [se, ae + 1, Te], 0.024, 5), En),
        g(l, Ke([R, I + 0.5, Te], [se, ae + 0.5, Te], 0.018, 4), En));
      for (let Pe = 0; Pe <= 4; Pe++) {
        let Re = Pe / 4,
          Fe = R + (se - R) * Re,
          ze = I + ve * Re;
        g(l, Ke([Fe, ze - 0.05, Te], [Fe, ze + 1, Te], 0.02, 4), En);
      }
    }
    for (let Te = 1; Te <= _e; Te++) {
      let Pe = (Te - 0.5) / _e,
        Re = R + (se - R) * Pe,
        Fe = I + ve * (Te / _e);
      g(h, Ee(Re - 0.13, Fe - 0.03, k + 0.06, Re + 0.13, Fe, ce - 0.06));
    }
  }
  function Q(R, I, se, ae) {
    (g(h, Ee(R, se - 0.05, T, I, se, C)),
      g(h, Ee(R, se - 0.2, T, I, se - 0.05, T + 0.06)),
      g(h, Ee(R, se - 0.2, C - 0.06, I, se - 0.05, C)));
    let k = ae > 0 ? I - 0.03 : R + 0.03,
      ce = ae > 0 ? R : I;
    ns(
      o,
      l,
      [
        [ce, se, C - 0.03],
        [k, se, C - 0.03],
        [k, se, T + 0.03],
      ],
      { post: 0.9, tint: En },
    );
  }
  let K = [3.6, 6.9, 10.2, 13.5, 16.8, 20.1];
  for (let R = 0; R < 5; R++)
    R % 2 === 0
      ? (Q(G[0], G[1], K[R], -1), N(G[1], K[R], j[0], K[R + 1], T, D))
      : (Q(j[0], j[1], K[R], 1), N(j[0], K[R], G[1], K[R + 1], D, C));
  (Q(j[0], j[1], K[5], 1),
    N(j[0], K[5], 23.4, 21.9, D, C),
    g(h, Ee(22.5, 21.85, On + 1.35, 23.4, 21.9, C)),
    ns(
      o,
      l,
      [
        [22.53, 21.9, On + 1.4],
        [22.53, 21.9, C - 0.03],
        [23.37, 21.9, C - 0.03],
      ],
      { post: 1.3, tint: En },
    ),
    ns(
      o,
      l,
      [
        [23.37, 21.9, On + 1.4],
        [23.37, 21.9, D],
      ],
      { post: 1.3, tint: En },
    ),
    g(h, Ee(j[0], 13.45, 4.95, j[1], 13.5, T)));
  for (let R of [G[0], j[1]])
    for (let I of [T - 0.05, C + 0.05])
      g(a, Ee(R - 0.07, 3.3, I - 0.07, R + 0.07, 21.4, I + 0.07), wn);
  for (let R = 0; R < K.length; R++) {
    let I = K[R] - 0.25;
    g(a, Ee(G[0], I - 0.06, C + 0, j[1], I + 0.06, C + 0.1), Ms);
    for (let se of [G[0], j[1]])
      g(a, Ee(se - 0.05, I - 0.06, 5.9, se + 0.05, I + 0.06, C + 0.1), Ms);
    if (R < K.length - 1) {
      let se = K[R + 1] - 0.25;
      (g(a, Ke([G[0], I, C + 0.05], [j[1], se, C + 0.05], 0.03, 5), wn),
        g(a, Ke([j[1], I, C + 0.05], [G[0], se, C + 0.05], 0.03, 5), wn));
    }
  }
  {
    let R = G[0] - 0.05,
      I = 7.35;
    for (let ae of [-0.22, 0.22])
      g(h, Ke([R, 0.05, I + ae], [R, 4.75, I + ae], 0.022, 5));
    for (let ae = 0.3; ae < 4.7; ae += 0.3)
      g(h, Ke([R, ae, I - 0.22], [R, ae, I + 0.22], 0.012, 4));
    let se = (ae) => {
      let k = [];
      for (let ce = 0; ce <= 8; ce++) {
        let ve = (Math.PI * ce) / 8;
        k.push(_t(R - Math.sin(ve) * 0.7, ae, I - Math.cos(ve) * 0.36));
      }
      return k;
    };
    for (let ae = 2.3; ae <= 4.75; ae += 0.6) g(h, kr(se(ae), 0.012, 4));
    for (let ae = 1; ae < 8; ae += 1.5) {
      let k = (Math.PI * ae) / 8;
      g(
        h,
        Ke(
          [R - Math.sin(k) * 0.7, 2.3, I - Math.cos(k) * 0.36],
          [R - Math.sin(k) * 0.7, 4.75, I - Math.cos(k) * 0.36],
          0.01,
          4,
        ),
      );
    }
    x.push({
      min: [R - 0.72, 0, I - 0.4],
      max: [R + 0.05, 4.7, I + 0.4],
      bulletOnly: !1,
    });
  }
  g(f, Ee(13, 21.02, -On - 0.95, ks - 1.2, 21.12, -On - 0.85));
  for (let R = 13.5; R < ks - 1.2; R += 3.3)
    g(f, Ee(R - 0.03, 21.1, -On - 0.93, R + 0.03, 21.86, -On - 0.87));
  {
    let se = (ks - 1.6 - 13.6) / 15;
    for (let ae = 0; ae < 15; ae++) {
      let k = 13.6 + ae * se,
        ce = 1.1 + 0.25 * Math.sin(ae * 2.1);
      g(f, Ee(k - 0.1, 20.9, -On - 0.98, k + 0.1, 21.02, -On - 0.82));
      for (let ve of [-0.05, 0.05]) {
        let _e = [];
        for (let Te = 0; Te <= 7; Te++) {
          let Pe = Te / 7;
          _e.push(
            _t(
              k + se * Pe,
              20.92 - ce * (1 - (2 * Pe - 1) ** 2),
              -On - 0.9 + ve,
            ),
          );
        }
        g(f, kr(_e, 0.03, 4));
      }
    }
  }
  function ie(R, I, se, ae, k = "z") {
    let ce = ae * 0.46;
    k === "z"
      ? g(f, Ee(R - 0.03, I, se - ce / 2, R + 0.03, I + 0.06, se + ce / 2))
      : g(f, Ee(R - ce / 2, I, se - 0.03, R + ce / 2, I + 0.06, se + 0.03));
    for (let ve = 0; ve < ae; ve++) {
      let _e = (ve - (ae - 1) / 2) * 0.46,
        Te = k === "z" ? R : R + _e,
        Pe = k === "z" ? se + _e : se;
      (g(f, Ee(Te - 0.17, I - 0.2, Pe - 0.17, Te + 0.17, I, Pe + 0.17, 0.02)),
        g(
          v,
          Ee(Te - 0.14, I - 0.215, Pe - 0.14, Te + 0.14, I - 0.2, Pe + 0.14),
        ));
    }
  }
  for (let R of [33, 47.5, 59.5])
    for (let I of [-1, 1]) ie(R, 21.3, I * (On + 1.3), 3, "x");
  for (let R of [-1, 1])
    (ie(23.5, 12.28, R * (Di - 0.2), 4, "x"),
      ie(15, 21.3, R * (On + 1.3), 2, "x"));
  (ie(is + 0.1, 12.28, 0, 3, "z"),
    ie(Bt - 0.1, 12.28, 0, 3, "z"),
    ie(_ + 0.6, M - 0.55, 0, 3, "z"),
    g(l, Ee(ks - 2.3, 21.35, -1.25, ks + 2.3, 22.2, 1.25, 0.06), En),
    g(l, Ee(ks - 1.6, 20.7, -1.1, ks + 1.6, 21.35, 1.1, 0.05), En));
  for (let R of [-1.8, 1.8])
    for (let I of [-1, 1])
      (g(f, xt(0.24, 0.24, 0.16, "z", ks + R, 22.42, I * 1.3, 12)),
        g(
          l,
          Ee(
            ks + R - 0.35,
            22.1,
            I * 1.3 - 0.14,
            ks + R + 0.35,
            22.5,
            I * 1.3 + 0.14,
            0.03,
          ),
          En,
        ));
  (g(f, xt(0.42, 0.42, 1.5, "z", ks - 0.9, 22.35, 0, 14)),
    g(f, xt(0.42, 0.42, 1.5, "z", ks + 0.9, 22.35, 0, 14)));
  let F = ks + 0.25,
    X = ks + 2.65,
    ne = 2.35,
    re = 4.4,
    $ = 18.3,
    ue = 20.7;
  for (let R of [F + 0.12, X - 0.3]) {
    g(l, Ee(R - 0.12, 20.88, -1, R + 0.12, 21.16, re, 0.03), En);
    for (let I of [ne + 0.1, re - 0.1])
      g(l, Ee(R - 0.06, ue, I - 0.06, R + 0.06, 20.9, I + 0.06), En);
  }
  (g(c, Ee(F, $, ne, X, $ + 0.14, re, 0.03), cl),
    g(
      c,
      Ee(F - 0.08, ue - 0.02, ne - 0.08, X + 0.12, ue + 0.12, re + 0.08, 0.03),
      cl,
    ),
    g(c, Ee(F, $ + 0.14, ne, F + 0.08, ue, re), cl));
  for (let R of [ne, re - 0.06])
    (g(c, Ee(F, $ + 0.14, R, X - 0.5, $ + 0.95, R + 0.06), cl),
      g(d, Ee(F + 0.08, $ + 0.95, R + 0.02, X - 0.06, ue, R + 0.04)),
      g(d, Ee(X - 0.5, $ + 0.14, R + 0.02, X - 0.06, $ + 0.95, R + 0.04)));
  for (let R of [X - 0.06])
    for (let I of [ne, re - 0.06, (ne + re) / 2 - 0.03])
      g(c, Ee(R, $ + 0.14, I, R + 0.06, ue, I + 0.06), cl);
  (g(d, Ee(X - 0.04, $ + 0.14, ne + 0.06, X - 0.02, ue, re - 0.06)),
    g(d, Ee(X - 0.9, $ + 0.02, ne + 0.3, X - 0.1, $ + 0.04, re - 0.3)),
    g(f, Ee(F + 0.9, $ + 0.14, 3.1, F + 1.45, $ + 0.6, 3.65, 0.04)),
    g(f, Ee(F + 0.82, $ + 0.6, 3.1, F + 0.96, $ + 1.35, 3.65, 0.04)));
  for (let R of [2.75, 4])
    (g(f, Ee(F + 1.2, $ + 0.14, R - 0.16, F + 1.75, $ + 0.85, R + 0.16, 0.03)),
      r.add(
        Ee(F + 1.3, $ + 0.855, R - 0.1, F + 1.6, $ + 0.865, R + 0.1),
        [0.75, 0.5, 0.26],
        0,
      ));
  (r.add(
    Ee(F + 0.5, ue - 0.045, 3, F + 1.5, ue - 0.03, 3.2),
    [0.75, 0.5, 0.26],
    0,
  ),
    ie(X + 0.15, $ + 0.1, 3.37, 2, "z"),
    g(h, Ee(F - 0.9, $ + 0.1, ne, F, $ + 0.14, re)),
    ns(
      o,
      l,
      [
        [F, $ + 0.14, ne + 0.03],
        [F - 0.87, $ + 0.14, ne + 0.03],
        [F - 0.87, $ + 0.14, re - 0.03],
        [F, $ + 0.14, re - 0.03],
      ],
      { post: 1, tint: En },
    ));
  let me = i.mats.label("SALTLINE 04", {
      color: "white",
      font: "stencil",
      distress: 0.35,
    }),
    ee = Math.max(1, me.aspect || 6);
  {
    let R = Math.min(1.15, 8.6 / ee);
    for (let I of [-1, 1])
      g(
        me.material,
        ll(R * ee, R, 36.9, 22, I * (On + 0.453), I > 0 ? 0 : Math.PI),
      );
  }
  {
    let R = Math.min(0.86, 9.4 / ee);
    g(me.material, ll(R * ee, R, Bt - 0.453, 13, 0, -Math.PI / 2));
  }
  if (n) return ((o.remap = null), (o.dz = 0), (o.minSize = 0), null);
  let B = o.build({ cast: !0, recv: !0 });
  B.name = "crane";
  let P = new io(),
    V = (R, I, se) => P.add(R, I, se),
    Y = 8.3;
  for (let R of [-0.9, 0.9])
    for (let I of [-0.8, 0.8])
      V(f, Ke([R, 0, I], [R * 0.8, -Y, I * 0.7], 0.022, 5));
  V(l, Ee(-0.95, -Y - 0.55, -0.75, 0.95, -Y, 0.75, 0.05), En);
  for (let R of [-0.45, 0.45])
    V(f, xt(0.3, 0.3, 0.12, "z", 0, -Y + 0.12, R, 12));
  let L = -Y - 0.55,
    Z = L - 0.34;
  for (let R of [-0.6, 0.6])
    V(l, Ee(R - 0.16, Z, -6.02, R + 0.16, L, 6.02, 0.03), En);
  for (let R of [-5.92, 5.92])
    V(l, Ee(-1.22, Z, R - 0.14, 1.22, L, R + 0.14, 0.03), En);
  V(l, Ee(-0.9, Z - 0.02, -1.3, 0.9, L + 0.1, 1.3, 0.04), En);
  for (let R of [-1.2, 1.2])
    for (let I of [-6, 6])
      (V(f, Ee(R - 0.1, Z - 0.1, I - 0.1, R + 0.1, Z + 0.05, I + 0.1)),
        V(
          l,
          jt(
            [R * 1.02, Z, I * 1.01],
            [R * 1.22, Z - 0.55, I * 1.04],
            0.28,
            0.03,
          ),
          En,
        ));
  let J = Z - 0.08,
    oe = J - 2.59,
    fe = [0.9, 0.82, 0.8];
  V(u, Ee(-1.2, oe, -6.08, 1.2, J, 6.08, 0.03), fe);
  for (let R of [-1.22, 1.22])
    for (let I = -5.7; I <= 5.71; I += 0.57)
      V(u, Ee(R - 0.02, oe + 0.16, I - 0.1, R + 0.02, J - 0.12, I + 0.1), fe);
  for (let R of [-6.095, 6.095])
    for (let I of [-1.22, 1.22])
      V(u, Ee(I - 0.08, oe, R - 0.08, I + 0.08, J, R + 0.08), [0.7, 0.62, 0.6]);
  for (let R of [-0.8, -0.3, 0.3, 0.8])
    V(f, Ke([R, oe + 0.08, 6.1], [R, J - 0.08, 6.1], 0.02, 5));
  let le = P.build({ cast: !0, recv: !0 });
  return (
    le.position.set(ks, 20.7, 0),
    (le.userData.noMerge = !0),
    (le.name = "crane-spreader"),
    B.add(le),
    { root: B, spreader: le, colliders: x, tris: o.tris + P.tris }
  );
}
function mb(
  i,
  e,
  t,
  n,
  { s = 1, up: o = !1, tint: r = [0.3, 0.36, 0.44] } = {},
) {
  let a = [],
    l = (c, u, h, f, p, d) => a.push(Ee(c, u, h, f, p, d));
  for (let c of [-5, 5])
    for (let u of [-5.4, 5.4]) l(c - 0.6, 0, u - 0.6, c + 0.6, 24, u + 0.6);
  for (let c of [-5.4, 5.4])
    (l(-5, 12.5, c - 0.45, 5, 13.5, c + 0.45),
      l(-5, 23, c - 0.4, 5, 23.8, c + 0.4),
      a.push(jt([-5, 13.5, c], [5, 23, c], 0.4, 0.4)));
  for (let c of [-5, 5])
    (l(c - 0.45, 12.5, -5.4, c + 0.45, 13.5, 5.4),
      l(c - 0.45, 22.8, -5.4, c + 0.45, 23.8, 5.4),
      l(c - 0.45, 3.6, -5.4, c + 0.45, 4.6, 5.4));
  (l(-11.5, 21.2, -2.3, 6.3, 22.8, 2.3), l(-10.9, 22.8, -2.9, -3.1, 26, 2.9));
  for (let c of [-1, 1])
    (a.push(jt([5, 23.8, c * 5.4], [4.1, 30, c * 1.5], 0.6, 0.6)),
      a.push(jt([-5, 23.8, c * 5.4], [4.1, 30, c * 1.5], 0.5, 0.5)));
  (l(3.6, 29.6, -2, 4.6, 30.4, 2),
    o
      ? (a.push(jt([6.6, 22, 0], [10.5, 52, 0], 4.6, 1.6)),
        a.push(jt([4.1, 30, 0], [9.4, 44, 0], 0.3, 0.3)))
      : (l(6.6, 21.2, -2.3, 38.5, 22.8, 2.3),
        a.push(jt([4.1, 30, 0], [20.5, 24.3, 0], 0.3, 0.3)),
        a.push(jt([4.1, 30, 0], [34.5, 24.3, 0], 0.3, 0.3)),
        l(15, 18.3, 2.4, 19.5, 22.2, 4.4)));
  for (let c of a) (c.scale(s, s, s), c.translate(t, 0, n), i.add(e, c, r));
  return o ? [t + 10.5 * s, 52.6 * s, n] : [t + 4.1 * s, 31 * s, n];
}
var rt = 41,
  vR = 8,
  Eo = -9,
  qn = 63,
  xR = -4.4,
  Fs = 13,
  Vc = -1.6,
  gb = (i, e, t) => {
    let n = Math.min(1, Math.max(0, (t - i) / (e - i)));
    return n * n * (3 - 2 * n);
  },
  yR = (i) =>
    1.7 * Math.pow(Math.max(0, 1 - i / 20), 2) +
    0.5 * Math.pow(Math.max(0, (i - (qn - 12)) / 12), 2),
  hs = (i) => Fs + yR(i),
  Tf = (i) => 1.15 * (1 - gb(14.5, 18, i) + gb(qn - 10.5, qn - 8, i)),
  Bo = (i) => hs(i) + Tf(i),
  bR = Bo(0);
function fn(i, e, t) {
  let n = (bR - e) * 0.22,
    s = Math.max(0, 1 - i / 22),
    o = Eo - i - n * s,
    r = Math.min(1, Math.max(0, (e - Vc) / (Fs - Vc))),
    a = 17 - 8.5 * Math.pow(r, 1.3),
    l = i / a,
    c = l >= 1 ? 1 : Math.pow(Math.sin((l * Math.PI) / 2), 0.72),
    u = 0.2 + (vR - 0.2) * c,
    h = (i - (qn - 10)) / 10;
  return (
    h > 0 && (u *= 1 - 0.24 * h * h * (1 - 0.6 * r)),
    new W(rt + t * u, e, o)
  );
}
function ha(i, e, t) {
  let s = fn(i + 0.05, e, t).sub(fn(Math.max(0, i - 0.05), e, t)),
    o = fn(i, e + 0.05, t).sub(fn(i, e - 0.05, t)),
    r = s.cross(o).normalize();
  return (r.x * t + r.z * 0.25 < 0 && r.negate(), r);
}
function ul(i, e, t, n, s, o = 0.012, r = 6, a = 1) {
  let l = [],
    c = [],
    u = [],
    h = [];
  for (let d = 0; d <= a; d++)
    for (let v = 0; v <= r; v++) {
      let g = i + ((e - i) * v) / r,
        x = t + ((n - t) * d) / a,
        y = ha(g, x, s),
        b = fn(g, x, s).addScaledVector(y, o);
      (l.push(b.x, b.y, b.z),
        u.push(y.x, y.y, y.z),
        c.push(s < 0 ? 1 - v / r : v / r, d / a));
    }
  let f = r + 1;
  for (let d = 0; d < a; d++)
    for (let v = 0; v < r; v++) {
      let g = d * f + v,
        x = g + 1,
        y = g + f + 1,
        b = g + f;
      s > 0 ? h.push(g, x, y, g, y, b) : h.push(g, y, x, g, b, y);
    }
  let p = new nt();
  return (
    p.setAttribute("position", new He(l, 3)),
    p.setAttribute("normal", new He(u, 3)),
    p.setAttribute("uv", new He(c, 2)),
    p.setIndex(h),
    p
  );
}
var D1 = class {
    constructor() {
      ((this.p = []), (this.n = []), (this.u = []), (this.c = []));
    }
    v(e, t, n, s, o) {
      (this.p.push(e.x, e.y, e.z),
        this.n.push(t.x, t.y, t.z),
        this.u.push(n, s),
        this.c.push(o[0], o[1], o[2]));
    }
    quad(e, t, n, s) {
      let o = e[1].clone().sub(e[0]),
        r = e[3].clone().sub(e[0]),
        a = o.cross(r).dot(t[0]) >= 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
      for (let l of a) this.v(e[l], t[l], n[l][0], n[l][1], s[l]);
    }
    geo() {
      let e = new nt();
      return (
        e.setAttribute("position", new He(this.p, 3)),
        e.setAttribute("normal", new He(this.n, 3)),
        e.setAttribute("uv", new He(this.u, 2)),
        e.setAttribute("color", new He(this.c, 3)),
        e
      );
    }
  },
  hl = (i, e) => {
    let t = Math.imul(i + 31, 374761393) ^ Math.imul(e + 17, 668265263);
    return (
      (t = Math.imul(t ^ (t >>> 13), 1274126177)),
      ((t ^ (t >>> 16)) >>> 0) / 4294967295
    );
  };
function vb(i, e) {
  let t = new io(),
    n = so(i, "hull_paint"),
    s = so(i, "hull_red"),
    o = so(i, "paint_white"),
    r = i.mats.get("steel_dark"),
    a = i.mats.get("steel_galv"),
    l = i.mats.get("rope"),
    c = i.mats.get("rubber"),
    u = [2.6, 1.75, 0.95],
    h = ($) => e.add($, u, 0),
    f = ($, ue, me) => t.add($, ue, me),
    p = [0, 0.35, 0.9, 1.8, 3, 4.5, 6, 8, 10, 12, 14.5, 17, 20];
  for (let $ = 23; $ < qn - 0.5; $ += 3) p.push($);
  p.push(qn);
  let d = [0, 0.17, 0.34, 0.5, 0.66, 0.83, 1],
    v = ($) => {
      let ue = hs($),
        me = [xR, -2.3, -0.4, 1];
      for (let ee = 1; ee < d.length; ee++) me.push(1 + (ue - 1) * d[ee]);
      return (me.push(Bo($)), me);
    },
    g = 10,
    x = 3,
    y = new D1(),
    b = new D1(),
    m = ($, ue, me, ee) => {
      let B = hv($.x * 0.6, $.y, $.z * 0.6, void 0, 0.8),
        P = [B[0] * ee, B[1] * ee, B[2] * ee];
      return (
        ue < x
          ? $.y < -0.2
            ? ((P[0] *= 0.55), (P[1] *= 0.72), (P[2] *= 0.55))
            : me && ((P[0] *= 1.12), (P[1] *= 1), (P[2] *= 0.92))
          : $.y < 1.1 && ((P[0] *= 1.7), (P[1] *= 1.62), (P[2] *= 1.45)),
        P
      );
    };
  for (let $ of [-1, 1])
    for (let ue = 0; ue < p.length - 1; ue++) {
      let me = p[ue],
        ee = p[ue + 1],
        B = v(me),
        P = v(ee);
      for (let V = 0; V < g; V++) {
        if (V === g - 1 && Tf(me) < 0.02 && Tf(ee) < 0.02) continue;
        let Y = (V < x ? 0.8 : 0.58) + 0.36 * hl(ue * 7 + ($ > 0 ? 100 : 0), V),
          L = [
            fn(me, B[V], $),
            fn(ee, P[V], $),
            fn(ee, P[V + 1], $),
            fn(me, B[V + 1], $),
          ],
          Z = [
            ha(me, B[V], $),
            ha(ee, P[V], $),
            ha(ee, P[V + 1], $),
            ha(me, B[V + 1], $),
          ],
          J = [
            [me, B[V]],
            [ee, P[V]],
            [ee, P[V + 1]],
            [me, B[V + 1]],
          ],
          oe = [
            m(L[0], V, !1, Y),
            m(L[1], V, !1, Y),
            m(L[2], V, !0, Y),
            m(L[3], V, !0, Y),
          ];
        if (me > 1.5 && V >= 2 && V < g - 1) {
          let fe = L[0]
            .clone()
            .add(L[1])
            .add(L[2])
            .add(L[3])
            .multiplyScalar(0.25);
          for (let le = 0; le < 4; le++)
            Z[le]
              .addScaledVector(fe.clone().sub(L[le]).normalize(), 0.075)
              .normalize();
        }
        (V < x ? y : b).quad(L, Z, J, oe);
      }
    }
  {
    let $ = v(0),
      ue = v(qn),
      me = _t(0, 0.2, 1).normalize(),
      ee = _t(0, 0, -1),
      B = _t(0, 1, 0);
    for (let P = 0; P < g; P++) {
      let V = P < x ? [0.8, 0.8, 0.8] : [0.9, 0.9, 0.9];
      ((P < x ? y : b).quad(
        [
          fn(0, $[P], -1),
          fn(0, $[P], 1),
          fn(0, $[P + 1], 1),
          fn(0, $[P + 1], -1),
        ],
        [me, me, me, me],
        [
          [0, $[P]],
          [0.4, $[P]],
          [0.4, $[P + 1]],
          [0, $[P + 1]],
        ],
        [V, V, V, V],
      ),
        (P < x ? y : b).quad(
          [
            fn(qn, ue[P], -1),
            fn(qn, ue[P], 1),
            fn(qn, ue[P + 1], 1),
            fn(qn, ue[P + 1], -1),
          ],
          [ee, ee, ee, ee],
          [
            [0, ue[P]],
            [14, ue[P]],
            [14, ue[P + 1]],
            [0, ue[P + 1]],
          ],
          [V, V, V, V],
        ));
    }
    for (let P = 0; P < p.length - 1; P++) {
      let V = fn(p[P], hs(p[P]), -1),
        Y = fn(p[P], hs(p[P]), 1),
        L = fn(p[P + 1], hs(p[P + 1]), 1),
        Z = fn(p[P + 1], hs(p[P + 1]), -1),
        J = [0.75, 0.72, 0.7];
      y.quad(
        [V, Y, L, Z],
        [B, B, B, B],
        [
          [V.x, V.z],
          [Y.x, Y.z],
          [L.x, L.z],
          [Z.x, Z.z],
        ],
        [J, J, J, J],
      );
    }
  }
  (f(s, y.geo()), f(n, b.geo()));
  {
    let $ = (me, ee) => fn(me, ee, -1).addScaledVector(ha(me, ee, -1), 0.012),
      ue = [1.05, 0.92, 0.8];
    for (let me = 2; me < p.length - 1; me++) {
      let ee = v(p[me]),
        B = v(p[me + 1]);
      for (let P = 4; P <= 9; P++)
        f(n, jt($(p[me], ee[P]), $(p[me + 1], B[P]), 0.03, 0.045), ue);
      for (let P = 3; P < 9; P++)
        (me + P) % 2 === 0 &&
          f(n, jt($(p[me], ee[P]), $(p[me], ee[P + 1]), 0.035, 0.03), ue);
    }
  }
  for (let $ of [-1, 1]) {
    for (let Y = 3; Y < p.length - 1; Y++) {
      let L = (Z, J) => fn(Z, J, $).addScaledVector(ha(Z, J, $), 0.07);
      (f(n, jt(L(p[Y], 9.6), L(p[Y + 1], 9.6), 0.16, 0.3), [0.55, 0.55, 0.55]),
        Tf(p[Y]) > 0.6 &&
          Tf(p[Y + 1]) > 0.6 &&
          f(
            r,
            Ke(fn(p[Y], Bo(p[Y]), $), fn(p[Y + 1], Bo(p[Y + 1]), $), 0.07, 6),
          ));
    }
    for (let Y = 0; Y < 3; Y++)
      f(r, Ke(fn(p[Y], Bo(p[Y]), $), fn(p[Y + 1], Bo(p[Y + 1]), $), 0.07, 6));
    let ue = [];
    for (let Y = 18; Y <= qn - 10.4; Y += 3)
      ue.push(fn(Y, hs(Y), $).add(_t(-$ * 0.12, 0, 0)));
    ns(t, r, ue, { h: 1.05, post: 1.5, r: 0.028 });
    let me = 4.6,
      ee = hs(me) - 2.3,
      B = fn(me, ee, $),
      P = ha(me, ee, $);
    f(
      r,
      Ke(
        B.clone().addScaledVector(P, -0.3),
        B.clone().addScaledVector(P, 0.22),
        0.5,
        12,
        !0,
      ),
    );
    let V = (Y, L, Z) => fn(Y, L, $).addScaledVector(ha(Y, L, $), Z);
    (f(r, jt(V(me, ee - 0.1, 0.34), V(me, ee - 2.3, 0.3), 0.22, 0.22, 0.03)),
      f(
        r,
        jt(
          V(me - 0.95, ee - 2.45, 0.34),
          V(me + 0.95, ee - 2.45, 0.34),
          0.42,
          0.42,
          0.05,
        ),
      ));
    for (let Y of [-0.8, 0.8])
      f(
        r,
        jt(
          V(me + Y, ee - 2.4, 0.3),
          V(me + Y * 1.1, ee - 1.1, 0.34),
          0.5,
          0.12,
          0.02,
        ),
      );
  }
  let A = i.mats.label("KITTIWAKE", {
    color: "white",
    font: "sans",
    distress: 0.3,
  });
  {
    let ue = Math.min(12, 1.7 * Math.max(2, A.aspect || 6));
    (f(A.material, ul(7.6, 7.6 + ue, 10.25, 10.25 + 1.7, -1, 0.014, 10, 1)),
      f(A.material, ul(7.6, 7.6 + ue, 10.25, 10.25 + 1.7, 1, 0.014, 10, 1)));
  }
  let _ = i.mats.decal("rust_run");
  f(
    _.material,
    ul(4.6 - 0.8, 4.6 + 0.8, hs(4.6) - 9.5, hs(4.6) - 2.6, -1, 0.012, 2, 3),
  );
  for (let $ = 21.5; $ < qn - 11; $ += 5.5) {
    let ue = fn($, Fs - 0.45, -1);
    f(
      r,
      Ee(
        ue.x - 0.04,
        ue.y - 0.09,
        ue.z - 0.3,
        ue.x + 0.01,
        ue.y + 0.09,
        ue.z + 0.3,
      ),
    );
    let me = 2.6 + 3.2 * hl(Math.round($ * 10), 5);
    f(
      _.material,
      ul($ - 0.45, $ + 0.45, Fs - 0.5 - me, Fs - 0.5, -1, 0.012, 1, 1),
    );
  }
  for (let $ of [6.4, qn - 7])
    for (let ue = 0; ue < 9; ue++) {
      let me = 1.6 + ue * 0.62;
      f(
        o,
        ul($, $ + (ue % 2 ? 0.28 : 0.5), me, me + 0.13, -1, 0.01, 1, 1),
        [1.1, 1.1, 1.05],
      );
    }
  (f(o, ul(33, 33.9, 3.2, 3.3, -1, 0.01, 1, 1), [1.1, 1.1, 1.05]),
    f(o, ul(33.4, 33.5, 2.4, 4.1, -1, 0.01, 1, 1), [1.1, 1.1, 1.05]));
  let M = hs(7);
  for (let $ of [-1, 1]) {
    (f(r, xt(0.55, 0.55, 0.9, "x", rt + $ * 1.5, M + 0.75, Eo - 6.2, 12)),
      f(
        r,
        Ee(rt + $ * 0.5, M, Eo - 6.9, rt + $ * 2.6, M + 0.5, Eo - 5.5, 0.04),
      ));
    for (let ue of [0, 0.7])
      f(r, xt(0.16, 0.16, 0.7, "y", rt + $ * 4.2, M + 0.35, Eo - 8.5 - ue, 8));
  }
  let E = Eo - 10.5,
    w = M + 15;
  (f(o, xt(0.26, 0.42, 15, "y", rt, M + 7.5, E, 10), [0.85, 0.8, 0.7]),
    f(
      o,
      Ee(rt - 2.6, M + 10, E - 0.12, rt + 2.6, M + 10.24, E + 0.12),
      [0.85, 0.8, 0.7],
    ),
    f(r, Ke([rt, w, E], [rt, w + 2.4, E], 0.03, 5)));
  for (let $ of [-1, 1])
    (f(
      r,
      Ke(
        [rt + $ * 2.5, M + 10.2, E],
        [rt + $ * 5.6, M + 0.6, E - 1.2],
        0.022,
        4,
      ),
    ),
      f(r, Ke([rt + $ * 2.5, M + 10.2, E], [rt, w, E], 0.02, 4)));
  (f(r, Ke([rt, w, E], [rt, Bo(0) + 0.3, Eo - 0.4], 0.022, 4)),
    f(r, Ke([rt, Bo(0), Eo - 0.3], [rt, Bo(0) + 2.6, Eo - 0.15], 0.03, 5)));
  let S = _t(rt, M + 2.2, E - 0.5),
    z = _t(rt + 1.2, M + 9.5, E - 11.5);
  (f(o, Ke(S, z, 0.2, 8, !0), [0.85, 0.8, 0.7]),
    f(r, Ke(z, [rt, w - 0.4, E], 0.022, 4)),
    f(r, Ke(z, [z.x, Fs + 4, z.z], 0.018, 4)),
    f(
      r,
      Ee(
        z.x - 0.18,
        Fs + 3.4,
        z.z - 0.18,
        z.x + 0.18,
        Fs + 4,
        z.z + 0.18,
        0.04,
      ),
    ),
    e.add(Bn(rt, w - 0.6, E + 0.5, 0.14), [5, 4.6, 3.8], 0));
  let H = [
    [0.62, 0.17, 0.13],
    [0.17, 0.29, 0.5],
    [0.2, 0.42, 0.3],
    [0.78, 0.36, 0.12],
    [0.8, 0.62, 0.16],
    [0.82, 0.83, 0.8],
    [0.4, 0.43, 0.47],
    [0.16, 0.42, 0.45],
  ];
  [
    [-45.6, 12.19],
    [-32.7, 12.19],
    [-22.8, 6.06],
  ].forEach(([$, ue], me) => {
    f(
      s,
      Ee(
        rt - 7.7,
        Fs,
        $ - ue / 2 - 0.2,
        rt + 7.7,
        Fs + 0.42,
        $ + ue / 2 + 0.2,
        0.04,
      ),
      [0.6, 0.6, 0.62],
    );
    for (let ee = 0; ee < 6; ee++) {
      let B = rt + (ee - 2.5) * 2.52,
        P = me === 2 ? 2 : 2 + (hl(ee * 3 + me, 9) > 0.4 ? 1 : 0);
      for (let V = 0; V < P; V++) {
        let Y = Fs + 0.44 + V * 2.61,
          L = H[Math.floor(hl(ee * 5 + V * 13 + me * 29, 2) * H.length)];
        if (
          (f(
            o,
            Ee(B - 1.22, Y, $ - ue / 2, B + 1.22, Y + 2.59, $ + ue / 2, 0.035),
            L,
          ),
          ee === 0)
        )
          for (let Z = $ - ue / 2 + 0.5; Z < $ + ue / 2 - 0.3; Z += 0.58)
            f(
              o,
              Ee(B - 1.24, Y + 0.15, Z - 0.1, B - 1.21, Y + 2.45, Z + 0.1),
              L,
            );
      }
    }
    for (let ee of [$ - ue / 2 - 0.45, $ + ue / 2 + 0.45]) {
      for (let B = 0; B <= 6; B++)
        f(
          r,
          Ee(
            rt + (B - 3) * 2.52 - 0.05,
            Fs,
            ee - 0.05,
            rt + (B - 3) * 2.52 + 0.05,
            Fs + 5.6,
            ee + 0.05,
          ),
        );
      for (let B of [Fs + 2.9, Fs + 5.6])
        f(r, Ee(rt - 7.6, B - 0.05, ee - 0.12, rt + 7.6, B + 0.05, ee + 0.12));
    }
  });
  let q = [0.92, 0.93, 0.92],
    U = -53,
    T = -66.5;
  [
    [7.2, 13, 15.9, 0],
    [6.7, 15.9, 18.7, 0.5],
    [6.3, 18.7, 21.5, 1],
    [6.5, 21.5, 24.4, 1.5],
  ].forEach(([$, ue, me, ee], B) => {
    (f(o, Ee(rt - $, ue, T + ee * 0.4, rt + $, me, U - ee, 0.08), q),
      f(
        o,
        Ee(
          rt - $ - 0.7,
          me - 0.06,
          T + ee * 0.4 - 0.3,
          rt + $ + 0.7,
          me + 0.06,
          U - ee + 1,
        ),
        [0.7, 0.72, 0.72],
      ));
    let P = me + 0.06,
      V = rt - $ - 0.67,
      Y = rt + $ + 0.67,
      L = U - ee + 0.97,
      Z = T + ee * 0.4 - 0.27;
    if (
      (ns(
        t,
        a,
        [
          [V, P, Z],
          [V, P, L],
          [Y, P, L],
          [Y, P, Z],
        ],
        { h: 1.05, post: 1.6, r: 0.026 },
      ),
      B < 3)
    )
      for (let J = U - ee - 1.2, oe = 0; J > T + 1.5; J -= 1.45, oe++) {
        let fe = hl(oe * 3 + B * 11, 4) > 0.8;
        for (let le of [-1, 1]) {
          let R = Ee(
            rt + le * ($ + 0.012) - 0.012,
            ue + 1.25,
            J - 0.33,
            rt + le * ($ + 0.012) + 0.012,
            ue + 1.85,
            J + 0.33,
          );
          fe && le < 0 ? h(R) : f(r, R);
        }
      }
    if (B < 3)
      for (let J = rt - $ + 1, oe = 0; J < rt + $ - 0.6; J += 1.5, oe++) {
        let fe = Ee(
          J - 0.33,
          ue + 1.25,
          U - ee - 0.01,
          J + 0.33,
          ue + 1.85,
          U - ee + 0.014,
        );
        hl(oe + B * 7, 8) > 0.84 ? h(fe) : f(r, fe);
      }
  });
  let C = 21.5,
    G = U - 1.5,
    j = 6.5;
  f(r, Ee(rt - j + 0.2, C + 1.3, G - 0.01, rt + j - 0.2, C + 2.25, G + 0.02));
  for (let $ = rt - j + 0.75, ue = 0; $ < rt + j - 0.4; $ += 1.05, ue++)
    (hl(ue, 21) > 0.62 &&
      h(Ee($ - 0.44, C + 1.36, G + 0.02, $ + 0.44, C + 2.19, G + 0.03)),
      f(o, Ee($ + 0.48, C + 1.3, G, $ + 0.57, C + 2.25, G + 0.04), q));
  for (let $ of [-1, 1])
    (f(
      r,
      Ee(
        rt + $ * j - 0.02,
        C + 1.3,
        G - 5,
        rt + $ * j + 0.02,
        C + 2.25,
        G - 0.2,
      ),
    ),
      f(
        o,
        Ee(
          rt + $ * 6.4,
          C - 0.12,
          G - 3.4,
          rt + $ * 8.3,
          C + 0.02,
          G + 0.9,
          0.03,
        ),
        q,
      ),
      f(o, Ee(rt + $ * 8.22, C, G - 3.4, rt + $ * 8.3, C + 1.1, G + 0.9), q),
      f(o, Ee(rt + $ * 6.5, C, G + 0.82, rt + $ * 8.3, C + 1.1, G + 0.9), q),
      f(
        r,
        jt(
          [rt + $ * 6.6, C - 2.6, G - 1.2],
          [rt + $ * 8.1, C - 0.1, G - 1.2],
          0.12,
          0.12,
        ),
      ),
      e.add(
        Bn(rt + $ * 8.25, C + 1.35, G - 0.4, 0.13),
        $ < 0 ? [0.3, 5, 1.6] : [6, 0.4, 0.3],
        0,
      ));
  (h(Ee(rt - 2.2, 24.42, G + 0.6, rt - 1.6, 24.52, G + 0.9)),
    h(Ee(rt + 1.6, 24.42, G + 0.6, rt + 2.2, 24.52, G + 0.9)));
  let N = _t(rt, 24.46, -57.5);
  (f(o, xt(0.16, 0.28, 8.5, "y", N.x, N.y + 4.25, N.z, 8), q),
    f(
      o,
      Ee(N.x - 2.4, N.y + 5.2, N.z - 0.08, N.x + 2.4, N.y + 5.36, N.z + 0.08),
      q,
    ),
    f(
      o,
      Ee(N.x - 1.3, N.y + 7.3, N.z - 0.06, N.x + 1.3, N.y + 7.42, N.z + 0.06),
      q,
    ),
    f(o, Ee(N.x - 0.5, N.y + 3.2, N.z, N.x + 0.5, N.y + 3.3, N.z + 1.2), q));
  for (let $ of [-2.3, -1.2, 1.2, 2.3])
    f(
      r,
      Ke(
        [N.x + $, N.y + 5.36, N.z],
        [N.x + $, N.y + 5.36 + (Math.abs($) > 2 ? 3.2 : 1.2), N.z],
        0.012,
        4,
      ),
    );
  f(r, Ke([N.x, N.y + 8.5, N.z], [N.x, N.y + 10.8, N.z], 0.015, 4));
  for (let $ of [-1, 1])
    f(
      r,
      Ke([N.x + $ * 2.3, N.y + 5.3, N.z], [rt + $ * 6, 24.5, T + 2], 0.014, 4),
    );
  (e.add(Bn(N.x, N.y + 8.7, N.z + 0.3, 0.14), [5, 4.6, 3.8], 0),
    e.add(Bn(N.x, N.y + 7.6, N.z, 0.12), [8, 0.4, 0.25], 3.4, 0.6, 0.4));
  let Q = -62.6;
  (f(
    o,
    Ee(rt - 1.7, 24.4, Q - 2.3, rt + 1.7, 29.3, Q + 2.1, 0.25),
    [0.2, 0.34, 0.5],
  ),
    f(
      o,
      Ee(rt - 1.72, 27.2, Q - 2.32, rt + 1.72, 28.1, Q + 2.12, 0.1),
      [0.9, 0.88, 0.8],
    ),
    f(
      o,
      Ee(rt - 1.75, 29.3, Q - 2.35, rt + 1.75, 30.3, Q + 2.15, 0.2),
      [0.07, 0.07, 0.08],
    ));
  for (let $ of [-0.9, 0.5])
    f(r, xt(0.28, 0.28, 1.1, "y", rt, 30.7, Q + $, 10));
  let K = i.mats.decal("logo_b");
  f(
    K.material,
    ll(
      2.6,
      2.6 / Math.max(1, K.aspect || 1),
      rt - 1.705,
      26.1,
      Q - 0.1,
      -Math.PI / 2,
    ),
  );
  {
    let $ = rt - 7.9,
      ue = 17.5,
      me = -61,
      ee = [1.25, 0.42, 0.1],
      B = new U0(1.15, 3.6, 4, 12);
    (B.rotateX(Math.PI / 2),
      B.scale(0.95, 0.82, 1),
      B.translate($, ue, me),
      f(o, B, ee),
      f(
        o,
        Ee($ - 0.6, ue + 0.7, me - 1.2, $ + 0.6, ue + 1.25, me + 0.9, 0.12),
        ee,
      ));
    for (let P of [-2.1, 2.1])
      (f(
        r,
        jt([rt - 6.9, 15.9, me + P], [$ - 0.2, ue + 2.3, me + P], 0.16, 0.22),
      ),
        f(
          r,
          Ke([$ - 0.2, ue + 2.2, me + P], [$, ue + 0.9, me + P * 0.8], 0.02, 4),
        ));
  }
  (f(
    r,
    Ke([rt, Bo(qn), Eo - qn + 0.4], [rt, Bo(qn) + 3.4, Eo - qn - 0.3], 0.03, 5),
  ),
    e.add(Bn(rt, Bo(qn) + 0.6, Eo - qn - 0.1, 0.1), [4, 3.7, 3], 0));
  {
    let $ = _t(32.55, 13, -51.5),
      ue = _t(31.4, 1.25, -38.5);
    for (let me of [-0.4, 0.4])
      (f(
        a,
        jt(
          [$.x + me, $.y - 0.1, $.z],
          [ue.x + me, ue.y - 0.1, ue.z],
          0.05,
          0.3,
        ),
      ),
        f(
          a,
          Ke([$.x + me, $.y + 1, $.z], [ue.x + me, ue.y + 1, ue.z], 0.025, 5),
        ),
        f(
          a,
          Ke(
            [$.x + me, $.y + 0.5, $.z],
            [ue.x + me, ue.y + 0.5, ue.z],
            0.02,
            4,
          ),
        ));
    for (let me = 0; me <= 8; me++) {
      let ee = $.clone().lerp(ue, me / 8);
      for (let B of [-0.4, 0.4])
        f(
          a,
          Ke([ee.x + B, ee.y - 0.1, ee.z], [ee.x + B, ee.y + 1, ee.z], 0.02, 4),
        );
    }
    for (let me = 1; me < 44; me++) {
      let ee = $.clone().lerp(ue, me / 44);
      f(
        a,
        Ee(
          ee.x - 0.38,
          ee.y - 0.02,
          ee.z - 0.12,
          ee.x + 0.38,
          ee.y,
          ee.z + 0.12,
        ),
      );
    }
    (f(a, Ee(31, 1.15, -38.5, 32, 1.2, -37.3)),
      f(a, jt([31.2, 1.2, -37.9], [29.2, 0.12, -37.9], 0.8, 0.06)),
      ns(
        t,
        a,
        [
          [31, 1.2, -37.32],
          [32, 1.2, -37.32],
          [32, 1.2, -38.5],
        ],
        { post: 1.1 },
      ),
      f(
        r,
        Ke([$.x, $.y + 3.2, $.z + 4], [ue.x, ue.y + 1.2, ue.z + 0.3], 0.014, 4),
      ),
      f(r, jt([33.2, 13.2, $.z + 4], [32.2, 16.4, $.z + 4], 0.14, 0.14)));
  }
  let ie = ($, ue, me, ee) => {
    let B = fn($, ue, -1);
    ((B.x -= 0.1), f(l, kr(ua(B, me, ee, 12), 0.042, 5)));
    let P = ua(B, me, ee, 12)[3],
      V = ua(B, me, ee, 12)[4].clone().sub(P).normalize(),
      Y = xt(0.42, 0.42, 0.012, "y", 0, 0, 0, 12);
    (Y.applyQuaternion(new Lt().setFromUnitVectors(_t(0, 1, 0), V)),
      Y.translate(P.x, P.y, P.z),
      f(a, Y),
      f(
        r,
        Ee(
          B.x - 0.12,
          B.y - 0.28,
          B.z - 0.35,
          B.x + 0.12,
          B.y + 0.28,
          B.z + 0.35,
          0.05,
        ),
      ));
  };
  (ie(4.4, hs(4.4) + 0.55, _t(29.2, 0.5, -12), 1.3),
    ie(4.9, hs(4.9) + 0.55, _t(29.2, 0.36, -12.1), 1.7),
    ie(1.6, hs(1.6) + 0.6, _t(29.2, 0.5, -2), 1.6),
    ie(2.2, hs(2.2) + 0.6, _t(29.2, 0.36, -2.1), 2.2),
    ie(qn - 5, hs(qn - 5) + 0.6, _t(29.2, 0.5, -82), 1.6),
    ie(qn - 9, hs(qn - 9) + 0.6, _t(29.2, 0.45, -58), 1.2));
  for (let $ of [-82, -58])
    (f(r, xt(0.2, 0.26, 0.55, "y", 29.2, 0.27, $, 10)),
      f(r, xt(0.34, 0.3, 0.14, "y", 29.2, 0.6, $, 10)));
  for (let $ of [-17.6, -37, -54])
    (f(c, xt(1.25, 1.25, 2.2, "z", 31.55, Vc + 0.35, $, 14)),
      f(c, xt(0.45, 1.25, 0.5, "z", 31.55, Vc + 0.35, $ + 1.35, 14)),
      f(c, xt(1.25, 0.45, 0.5, "z", 31.55, Vc + 0.35, $ - 1.35, 14)),
      f(l, Ke([31.55, Vc + 1.6, $], [29.9, 0.1, $ + 0.6], 0.03, 4)));
  let F = t.build({ cast: !0, recv: !0 });
  F.name = "ship";
  let X = new io();
  (X.add(o, Ee(-1.25, -0.07, -0.1, 1.25, 0.07, 0.1, 0.02), q),
    X.add(o, xt(0.1, 0.12, 0.25, "y", 0, -0.18, 0, 8), q));
  let ne = X.build({ cast: !1 });
  (ne.position.set(N.x, N.y + 3.62, N.z + 0.8),
    (ne.userData.noMerge = !0),
    F.add(ne));
  let re = [
    { min: [33, -5, Eo - qn], max: [49, 15, -17.5] },
    { min: [34.9, -5, -17.5], max: [47.1, 15.5, -13] },
    { min: [37.7, -5, -13], max: [44.3, 16, -9.3] },
    { min: [rt - 7.2, 13, T], max: [rt + 7.2, 24.4, U] },
  ];
  return {
    root: F,
    radar: ne,
    colliders: re,
    tris: t.tris,
    name: "KITTIWAKE",
  };
}
function xb(i, e) {
  let t = new io(),
    n = so(i, "plastic_grey"),
    s = so(i, "paint_orange"),
    o = i.mats.get("polymer_black"),
    r = i.mats.get("steel_galv"),
    a = i.mats.get("glass"),
    l = (U, T, D) => t.add(U, T, D),
    c = [2, 2.02, 2.08],
    u = [0.5, 0.5, 0.52],
    h = [1.9, 1.7, 1.2],
    f = [
      [-3.35, 0.5, 1.03],
      [-1.6, 0.5, 1.06],
      [0.5, 0.52, 1.05],
      [1.8, 0.58, 0.93],
      [2.75, 0.68, 0.6],
      [3.3, 0.78, 0.22],
    ],
    p = [
      ...f.map((U) => _t(U[0], U[1], U[2])),
      _t(3.43, 0.8, 0),
      ...f
        .slice()
        .reverse()
        .map((U) => _t(U[0], U[1], -U[2])),
    ],
    d = new Jr(p, !1, "centripetal"),
    v = new Kr(d, 60, 0.27, 12, !1);
  {
    let U = v.attributes.uv,
      T = d.getLength();
    for (let D = 0; D < U.count; D++)
      U.setXY(D, U.getX(D) * T, U.getY(D) * 1.7);
  }
  l(n, v, c);
  for (let U of [-1, 1])
    l(n, xt(0.07, 0.27, 0.42, "x", -3.56, 0.5, U * 1.03, 12), c);
  let g = 11,
    x = [];
  for (let U = 0; U < g; U++) {
    let T = 0.04 + (0.92 * U) / (g - 1),
      D = d.getPointAt(T),
      C = d.getTangentAt(T),
      G = new Ci(0.276, 0.016, 5, 14);
    (G.applyQuaternion(new Lt().setFromUnitVectors(_t(0, 0, 1), C)),
      G.translate(D.x, D.y, D.z),
      l(n, G, u));
    let j = _t(D.x, 0, D.z)
      .sub(_t(Math.min(D.x, 2.2), 0, 0))
      .normalize();
    x.push(
      D.clone()
        .addScaledVector(j, 0.2)
        .add(_t(0, 0.2, 0)),
    );
  }
  for (let U = 0; U < g - 1; U++)
    l(n, kr(ua(x[U], x[U + 1], 0.1, 4), 0.012, 4), h);
  let y = [-3.4, -2, -0.5, 1, 2, 2.8, 3.3],
    b = [0.9, 0.93, 0.93, 0.85, 0.62, 0.34, 0.08],
    m = [0.22, 0.22, 0.24, 0.3, 0.42, 0.56, 0.7],
    A = [-0.3, -0.32, -0.33, -0.3, -0.15, 0.15, 0.62],
    _ = [],
    M = (U, T, D) => {
      let C = T.clone().sub(U).cross(D.clone().sub(U)),
        G = U.clone()
          .add(T)
          .add(D)
          .multiplyScalar(1 / 3),
        j = _t(0, G.y - 0.45, G.z);
      (Math.abs(G.x) > 3.39 && j.set(G.x, 0, 0),
        C.dot(j) < 0
          ? _.push(U.x, U.y, U.z, D.x, D.y, D.z, T.x, T.y, T.z)
          : _.push(U.x, U.y, U.z, T.x, T.y, T.z, D.x, D.y, D.z));
    };
  for (let U of [-1, 1]) {
    for (let T = 0; T < y.length - 1; T++) {
      let D = _t(y[T], A[T], 0),
        C = _t(y[T + 1], A[T + 1], 0),
        G = _t(y[T], m[T], U * b[T]),
        j = _t(y[T + 1], m[T + 1], U * b[T + 1]),
        N = _t(y[T], 0.5 + Math.max(0, m[T] - 0.22) * 0.6, U * (b[T] + 0.1)),
        Q = _t(
          y[T + 1],
          0.5 + Math.max(0, m[T + 1] - 0.22) * 0.6,
          U * (b[T + 1] + 0.1),
        );
      (M(D, C, j), M(D, j, G), M(G, j, Q), M(G, Q, N));
    }
    (M(
      _t(-3.4, A[0], 0),
      _t(-3.4, m[0], U * b[0]),
      _t(-3.4, 0.78, U * (b[0] + 0.1)),
    ),
      M(
        _t(-3.4, A[0], 0),
        _t(-3.4, 0.78, U * (b[0] + 0.1)),
        _t(-3.4, 0.78, 0),
      ));
  }
  let E = new nt();
  (E.setAttribute("position", new He(_, 3)),
    E.computeVertexNormals(),
    l(o, E),
    l(n, Ee(-3.38, 0.2, -0.86, 2.1, 0.26, 0.86), u),
    l(n, Ee(2, 0.26, -0.62, 2.85, 0.56, 0.62, 0.05), u),
    l(o, Ee(-3.46, 0.1, -0.92, -3.34, 0.8, 0.92, 0.02)),
    l(r, Ke([3.2, 0.95, -0.12], [3.2, 0.95, 0.12], 0.02, 5)),
    l(r, Ke([3.2, 0.8, 0], [3.2, 0.95, 0], 0.018, 5)),
    l(s, Ee(0.3, 0.26, -0.4, 1, 1.12, 0.4, 0.05), [1, 0.9, 0.85]),
    l(o, jt([0.28, 1.14, 0], [0.86, 1.3, 0], 0.76, 0.05)));
  let w = Ee(-0.012, 0, -0.42, 0.012, 0.5, 0.42);
  (w.rotateZ(0.42), w.translate(0.95, 1.2, 0), l(a, w));
  for (let U of [-0.43, 0.43])
    l(
      r,
      Ke(
        [0.95, 1.2, U],
        [0.95 - Math.sin(0.42) * 0.52, 1.2 + Math.cos(0.42) * 0.52, U],
        0.016,
        5,
      ),
    );
  l(
    r,
    Ke(
      [0.95 - Math.sin(0.42) * 0.52, 1.2 + Math.cos(0.42) * 0.52, -0.43],
      [0.95 - Math.sin(0.42) * 0.52, 1.2 + Math.cos(0.42) * 0.52, 0.43],
      0.016,
      5,
    ),
  );
  let S = new Ci(0.18, 0.017, 6, 18);
  (S.rotateY(Math.PI / 2),
    S.rotateZ(-0.5),
    S.translate(0.2, 1.12, -0.12),
    l(o, S),
    l(r, Ke([0.2, 1.12, -0.12], [0.36, 1.03, -0.12], 0.02, 5)));
  for (let U of [0, 2.1, 4.2])
    l(
      r,
      Ke(
        [0.2, 1.12, -0.12],
        [
          0.2 + Math.sin(-0.5) * Math.cos(U) * -0.17,
          1.12 + Math.cos(-0.5) * Math.cos(U) * 0.17,
          -0.12 + Math.sin(U) * 0.17,
        ],
        0.01,
        4,
      ),
    );
  (l(o, Ee(0.34, 1.16, 0.16, 0.5, 1.34, 0.3, 0.02)),
    l(r, Ke([0.42, 1.34, 0.23], [0.36, 1.48, 0.23], 0.012, 4)),
    l(r, Ke([0.35, 0.3, -0.46], [0.35, 1, -0.46], 0.02, 5)),
    l(r, Ke([0.35, 1, -0.46], [0.95, 1, -0.46], 0.02, 5)),
    l(r, Ke([0.35, 0.3, 0.46], [0.35, 1, 0.46], 0.02, 5)),
    l(r, Ke([0.35, 1, 0.46], [0.95, 1, 0.46], 0.02, 5)));
  for (let U of [-0.75, -1.75])
    (l(s, Ee(U - 0.28, 0.26, -0.2, U + 0.28, 0.82, 0.2, 0.05), [1, 0.9, 0.85]),
      l(o, Ee(U - 0.3, 0.82, -0.22, U + 0.3, 0.93, 0.22, 0.04)),
      l(o, Ee(U - 0.34, 0.93, -0.2, U - 0.26, 1.2, 0.2, 0.03)),
      l(r, Ke([U + 0.3, 0.6, -0.22], [U + 0.3, 1.02, 0], 0.014, 4)),
      l(r, Ke([U + 0.3, 0.6, 0.22], [U + 0.3, 1.02, 0], 0.014, 4)));
  l(s, Ee(-2.9, 0.26, -0.3, -2.45, 0.58, 0.3, 0.04), [1.1, 0.5, 0.4]);
  for (let U of [-1, 1])
    (l(r, Ke([-2.95, 0.55, U * 0.9], [-2.75, 2, U * 0.55], 0.03, 6)),
      l(r, Ke([-2.3, 0.55, U * 0.9], [-2.75, 1.3, U * 0.7], 0.022, 5)));
  (l(r, Ke([-2.75, 2, -0.55], [-2.75, 2, 0.55], 0.03, 6)),
    l(r, Ee(-2.88, 2, -0.2, -2.62, 2.04, 0.2)),
    l(o, xt(0.05, 0.06, 0.1, "y", -2.75, 2.09, 0, 8)),
    l(o, Ke([-2.75, 2, 0.42], [-2.9, 3.7, 0.46], 0.011, 5)),
    l(o, xt(0.16, 0.16, 0.07, "y", -2.75, 2.1, -0.36, 10)));
  for (let U of [-0.36, 0.36])
    (l(r, Ee(-3.6, 0.42, U - 0.16, -3.44, 0.78, U + 0.16, 0.02)),
      l(o, Ee(-4.1, 0.78, U - 0.23, -3.48, 1.4, U + 0.23, 0.09)),
      l(n, Ee(-4.11, 1, U - 0.235, -3.47, 1.05, U + 0.235), [1.4, 1.4, 1.4]),
      l(o, Ee(-3.92, -0.05, U - 0.085, -3.62, 0.8, U + 0.085, 0.03)),
      l(o, Ee(-4.02, -0.52, U - 0.04, -3.6, -0.05, U + 0.04, 0.015)),
      l(o, xt(0.07, 0.03, 0.42, "x", -3.9, -0.3, U, 8)));
  for (let U of [-1.8, 0.4, 1.7])
    (l(s, xt(0.11, 0.11, 0.42, "y", U, 0.42, 1.36, 10), [1.2, 0.8, 0.7]),
      l(n, Ke([U, 0.63, 1.36], [U, 0.78, 1.12], 0.01, 4), h));
  let z = new Ci(0.26, 0.07, 6, 16);
  (z.rotateY(Math.PI / 2),
    z.translate(1.02, 0.72, 0),
    l(s, z, [1.3, 0.6, 0.45]));
  let H = t.build({ cast: !0, recv: !0 });
  (e.add(Bn(-2.75, 2.2, 0, 0.075), [1.2, 11, 3.2], 1.5, 0, 0.1),
    e.add(Bn(-2.75, 2.2, 0, 0.074), [1.2, 11, 3.2], 1.5, 0.2, 0.08));
  let O = e.build();
  O && ((O.frustumCulled = !1), H.add(O));
  let q = new wt();
  return (
    (q.name = "boat"),
    q.add(H),
    (q.userData.noMerge = !0),
    { root: q, hullGrp: H, tris: t.tris }
  );
}
var dv = new Ve(12172214),
  k1 = (i, e = 1) => {
    let t = new Ve(i);
    return [(e * t.r) / dv.r, (e * t.g) / dv.g, (e * t.b) / dv.b];
  },
  yb = [
    8200729, 8200729, 6957596, 2047846, 2047846, 2307146, 2906692, 2906692,
    11751962, 9062946, 5922920, 5922920, 4146764, 2055523, 10121752, 8093308,
    6962468, 6962468,
  ].map((i) => k1(i)),
  L1 = [
    [0.6, 0.17, 0.13],
    [0.17, 0.29, 0.5],
    [0.2, 0.42, 0.3],
    [0.76, 0.35, 0.12],
    [0.78, 0.6, 0.16],
    [0.8, 0.81, 0.78],
    [0.4, 0.43, 0.47],
    [0.16, 0.42, 0.45],
    [0.55, 0.2, 0.15],
    [0.2, 0.3, 0.45],
  ],
  _b = (i, e, t) => {
    let n = Math.min(1, Math.max(0, (t - i) / (e - i)));
    return n * n * (3 - 2 * n);
  },
  bb = (i, e) => 1 - 0.6 * _b(38, 160, Math.hypot(i + 5, e));
function Mb(i, e) {
  let t = new io(),
    n = so(i, "paint_white"),
    s = uv(90417),
    o = [5.5, 4.3, 2.9],
    r = [8, 0.45, 0.25],
    a = [0, 0, 0];
  function l(D, C, G, j, N = 1) {
    let Q = rl(C * 0.23 + 1.3, G * 0.31, j * 0.23 + 7.7),
      K = rl(C * 1.9 + 4.1, 2.2, j * 1.9 + 9.3),
      ie = N * (0.56 + 0.52 * Q) * (0.62 + 0.38 * _b(0, 5, G)),
      F = D[0] * ie,
      X = D[1] * ie,
      ne = D[2] * ie;
    if (K > 0.62) {
      let re = Math.min(1, (K - 0.62) / 0.3) * 0.55;
      ((F = F * (1 - re) + 0.3 * re * ie),
        (X = X * (1 - re) + 0.15 * re * ie),
        (ne = ne * (1 - re) + 0.08 * re * ie));
    }
    return ((a[0] = F), (a[1] = X), (a[2] = ne), a);
  }
  let c = (D, C) => {
      if (!D) return;
      if (Array.isArray(D)) {
        for (let Q of D) c(Q, C);
        return;
      }
      D.computeBoundingBox();
      let G = D.boundingBox,
        j = (G.min.x + G.max.x) / 2,
        N = (G.min.z + G.max.z) / 2;
      if (j < 31) {
        let Q = bb(j, N);
        (Lc(D, (K, ie, F) => l(C, K, ie, F, Q)), t.add(n, D));
      } else t.add(n, D, C);
    },
    u = [],
    h = [],
    f = [],
    p = [];
  function d(D, C, G) {
    let j = D[1][0] - D[0][0],
      N = D[1][1] - D[0][1],
      Q = D[1][2] - D[0][2],
      K = D[3][0] - D[0][0],
      ie = D[3][1] - D[0][1],
      F = D[3][2] - D[0][2],
      X =
        (N * F - Q * ie) * C[0] +
          (Q * K - j * F) * C[1] +
          (j * ie - N * K) * C[2] <
        0;
    for (let ne of X ? [0, 2, 1, 0, 3, 2] : [0, 1, 2, 0, 2, 3]) {
      let re = D[ne];
      (u.push(re[0], re[1], re[2]),
        h.push(C[0], C[1], C[2]),
        p.push(G[ne][0], G[ne][1], G[ne][2]),
        Math.abs(C[0]) > 0.5
          ? f.push(re[2], re[1])
          : Math.abs(C[1]) > 0.5
            ? f.push(re[0], re[2])
            : f.push(re[0], re[1]));
    }
  }
  let v = [0.866, -0.5, 0],
    g = (D, C, G) => C.map((j) => l(D, j[0], j[1], j[2], G).slice());
  function x(D, C, G, j, N, Q, K, ie, F) {
    for (let X of ie) {
      let ne, re;
      X === "E"
        ? ((ne = [
            [j, C, Q],
            [j, C, G],
            [j, N, G],
            [j, N, Q],
          ]),
          (re = v))
        : X === "W"
          ? ((ne = [
              [D, C, G],
              [D, C, Q],
              [D, N, Q],
              [D, N, G],
            ]),
            (re = [-1, 0, 0]))
          : X === "S"
            ? ((ne = [
                [D, C, Q],
                [j, C, Q],
                [j, N, Q],
                [D, N, Q],
              ]),
              (re = [0, 0, 1]))
            : X === "N"
              ? ((ne = [
                  [j, C, G],
                  [D, C, G],
                  [D, N, G],
                  [j, N, G],
                ]),
                (re = [0, 0, -1]))
              : ((ne = [
                  [D, N, Q],
                  [j, N, Q],
                  [j, N, G],
                  [D, N, G],
                ]),
                (re = [0, 1, 0]));
      let $ = g(K, ne, X === "T" ? F * 0.8 : X === "E" ? F * 0.92 : F);
      if (C < 0.1 && X !== "T")
        for (let ue of [0, 1])
          (($[ue][0] *= 0.62), ($[ue][1] *= 0.62), ($[ue][2] *= 0.62));
      d(ne, re, $);
    }
  }
  function y(
    D,
    C,
    G,
    { faceZ: j = 0, ribs: N = !1, doorRows: Q = 0, west: K = !1 } = {},
  ) {
    let ie = Math.sign(G - C),
      F = [];
    for (let re = C, $ = 1; ie > 0 ? re < G : re > G; re += ie * 2.62, $++)
      $ % 8 >= 1 &&
        $ % 8 <= 5 &&
        F.push({ z: re, blk: Math.floor($ / 8), first: $ === 1 });
    let X = F.map((re, $) =>
        D.map((ue, me) => {
          let ee = rl(ue * 0.04 + 3, 0.5, re.z * 0.05 + 7),
            B = Math.round(0.2 + ee * 5.4 + (s() - 0.5) * 2.4);
          return (
            !re.first && s() < 0.07 && (B = 0),
            Math.max(re.first ? 2 : 0, Math.min(5, B))
          );
        }),
      ),
      ne = (re, $) =>
        re >= 0 && re < F.length && $ >= 0 && $ < D.length ? X[re][$] : 0;
    F.forEach((re, $) =>
      D.forEach((ue, me) => {
        let ee = X[$][me],
          B = re.z,
          P = bb(ue, B),
          V = Math.max(Math.abs(ue + 5) - 40, Math.abs(B) - 30) < 55,
          Y = (L, Z) =>
            L >= 0 &&
            Z >= 0 &&
            L < D.length &&
            Z < D.length &&
            Math.abs(D[L] - D[Z]) < 12.8;
        for (let L = 0; L < ee; L++) {
          let Z = yb[Math.floor(s() * yb.length)],
            J = 0.6 + s() * 0.4,
            oe = [Z[0] * J, Z[1] * J, Z[2] * J],
            fe = (s() - 0.5) * 0.22,
            le = L * 2.6,
            R = ue - 6.095 + fe,
            I = ue + 6.095 + fe,
            se = B - 1.22,
            ae = B + 1.22,
            k = L === ee - 1 ? "T" : "";
          for (let Pe of j ? [j] : [-1, 1]) {
            let Re = $ + Pe * ie;
            (!(
              Re >= 0 &&
              Re < F.length &&
              F[Re].blk === re.blk &&
              Math.abs(F[Re].z - B) < 2.7
            ) ||
              ne(Re, me) <= L) &&
              (k += Pe > 0 ? "S" : "N");
          }
          let ce = !(Y(me - 1, me) && ne($, me - 1) > L),
            ve = !K && !(Y(me + 1, me) && ne($, me + 1) > L);
          (ce && (k += "E"),
            ve && (k += "W"),
            x(R, le, se, I, le + 2.59, ae, oe, k, P));
          let _e = [oe[0] * 0.45, oe[1] * 0.45, oe[2] * 0.45],
            Te = re.first
              ? j
                ? [j]
                : [-ie]
              : me === 0 && K && Math.abs(B) < 42
                ? [-1, 1].filter((Pe) => k.includes(Pe > 0 ? "S" : "N"))
                : [];
          if (N && V && Te.length) {
            let Pe = Te;
            for (let Re of Pe) {
              let Fe = Re > 0 ? ae : se,
                ze = Fe + Re * 0.04,
                We = le + 0.15,
                Ne = le + 2.45,
                dt = [oe[0] * 0.7, oe[1] * 0.7, oe[2] * 0.7];
              for (let xe = R + 0.24; xe < I - 0.3; xe += 0.575) {
                let Ie = [
                  [xe, We, Fe],
                  [xe + 0.07, We, ze],
                  [xe + 0.07, Ne, ze],
                  [xe, Ne, Fe],
                ];
                (d(Ie, [-0.5, 0, Re * 0.87], g(dt, Ie, P)),
                  (Ie = [
                    [xe + 0.07, We, ze],
                    [xe + 0.2, We, ze],
                    [xe + 0.2, Ne, ze],
                    [xe + 0.07, Ne, ze],
                  ]),
                  d(Ie, [0, 0, Re], g(oe, Ie, P)),
                  (Ie = [
                    [xe + 0.2, We, ze],
                    [xe + 0.27, We, Fe],
                    [xe + 0.27, Ne, Fe],
                    [xe + 0.2, Ne, ze],
                  ]),
                  d(Ie, [0.42, -0.52, Re * 0.74], g(dt, Ie, P)));
              }
              for (let [xe, Ie] of [
                [le, We],
                [Ne, le + 2.59],
              ]) {
                let Be = Fe + Re * 0.05,
                  Xe = [
                    [R, xe, Be],
                    [I, xe, Be],
                    [I, Ie, Be],
                    [R, Ie, Be],
                  ];
                (d(Xe, [0, 0, Re], g(_e, Xe, P)),
                  (Xe = [
                    [R, Ie, Fe],
                    [I, Ie, Fe],
                    [I, Ie, Be],
                    [R, Ie, Be],
                  ]),
                  d(Xe, [0, xe === le ? 1 : -1, 0], g(_e, Xe, P)));
              }
            }
          }
          if (ce && me === 0 && $ < Q) {
            let Pe = I + 0.03,
              Re = I + 0.055,
              Fe = le + 0.02,
              ze = le + 2.57,
              We = [oe[0] * 0.55, oe[1] * 0.55, oe[2] * 0.55],
              Ne = [0.34, 0.35, 0.36],
              dt = [0.05, 0.05, 0.055],
              xe = (Ie, Be, Xe, Me, we, be) => {
                let Oe = [
                    [Ie, Me, Xe],
                    [Ie, Me, Be],
                    [Ie, we, Be],
                    [Ie, we, Xe],
                  ],
                  pt = g(be, Oe, P);
                if (le < 0.1 && Me < 0.3)
                  for (let ut of [0, 1])
                    ((pt[ut][0] *= 0.62),
                      (pt[ut][1] *= 0.62),
                      (pt[ut][2] *= 0.62));
                d(Oe, v, pt);
              };
            (xe(Pe, se, se + 0.13, Fe, ze, We),
              xe(Pe, ae - 0.13, ae, Fe, ze, We),
              xe(Pe, se + 0.13, ae - 0.13, le, le + 0.15, We),
              xe(Pe, se + 0.13, ae - 0.13, le + 2.44, le + 2.59, We),
              xe(Pe, B - 0.018, B + 0.018, le + 0.15, le + 2.44, dt));
            for (let Ie of [-0.8, -0.32, 0.32, 0.8])
              if (
                (xe(Re, B + Ie - 0.024, B + Ie + 0.024, le + 0.1, le + 2.5, Ne),
                $ < 8)
              )
                for (let Be of [0.32, 2.2])
                  xe(
                    Re + 0.01,
                    B + Ie - 0.07,
                    B + Ie + 0.07,
                    le + Be,
                    le + Be + 0.09,
                    Ne,
                  );
            if ($ < 8)
              for (let Ie of [-0.56, 0.56])
                xe(
                  Re + 0.01,
                  B + Ie - 0.1,
                  B + Ie + 0.1,
                  le + 1.02,
                  le + 1.1,
                  Ne,
                );
          }
        }
      }),
    );
  }
  let b = [-48.6, -61.2, -73.8, -90.5, -103.1, -115.7, -132, -144.6],
    m = [6.3, -6.3, -18.9, -31.5];
  (y(b, -4.9, -112, { ribs: !0, doorRows: 15, west: !0 }),
    y(b, 14.9, 112, { ribs: !0, doorRows: 15, west: !0 }),
    y(m, -36.4, -110, { faceZ: 1, ribs: !0, doorRows: 12 }),
    y(m, 33.9, 110, { faceZ: -1, ribs: !0, doorRows: 12 }));
  {
    let D = new nt();
    (D.setAttribute("position", new He(u, 3)),
      D.setAttribute("normal", new He(h, 3)),
      D.setAttribute("uv", new He(f, 2)),
      D.setAttribute("color", new He(p, 3)),
      t.add(n, D));
  }
  let A = k1(5922920, 0.85),
    _ = [0.1, 0.1, 0.11],
    M = [0.36, 0.38, 0.4],
    E = k1(12159516, 0.5),
    w = [0.5, 0.5, 0.48];
  function S(D, C, G, j, N) {
    let K = G,
      ie = [K[0] * 0.7, K[1] * 0.7, K[2] * 0.7];
    for (let ne of [-1, 1]) {
      let re = C + ne * 9.5;
      for (let $ of [-1, 1]) {
        let ue = D + $ * 7.5;
        (c(Ee(ue - 1.5, 0.05, re - 0.28, ue + 1.5, 0.8, re + 0.28), _),
          c(Ee(ue - 0.36, 0.8, re - 0.36, ue + 0.36, 19.1, re + 0.36), K),
          c(Ee(ue - 0.4, 6.9, re - 0.4, ue + 0.4, 7, re + 0.4), ie),
          c(Ee(ue - 0.4, 13, re - 0.4, ue + 0.4, 13.1, re + 0.4), ie),
          c(jt([ue, 14.6, re], [ue - $ * 3.2, 19.1, re], 0.3, 0.3), K));
      }
      (c(Ee(D - 9.3, 0.8, re - 0.4, D + 9.3, 1.7, re + 0.4), K),
        c(Ee(D - 8, 19.1, re - 0.45, D + 8, 20.2, re + 0.45), K),
        c(Ee(D - 2.4, 1.7, re - 0.5, D + 0.8, 3.9, re + 0.5), w));
    }
    for (let ne of [-1, 1]) {
      let re = D + ne * 3.3,
        $ = C - 9.5 - 5.6,
        ue = C + 9.5 + 5.6;
      c(Ee(re - 0.45, 20.2, $, re + 0.45, 21.9, ue), K);
      for (let me = $ + 4.4; me < ue; me += 4.4)
        c(Ee(re - 0.48, 20.15, me - 0.03, re + 0.48, 21.95, me + 0.03), ie);
      (c(Ee(re + ne * 0.45, 21, $, re + ne * 1.3, 21.05, ue), M),
        ns(
          z,
          null,
          [
            [re + ne * 1.27, 21.05, $],
            [re + ne * 1.27, 21.05, ue],
          ],
          { post: 3.3, r: 0.035, mid: !1, tint: E },
        ),
        c(
          Ke([re, 20.2, C - 9.5 + 0.5], [re, 20.2, C + 9.5 - 0.5], 0.05, 4),
          _,
        ));
    }
    for (let ne of [C - 9.5 - 5.4, C + 9.5 + 5.4])
      c(Ee(D - 3.3, 20.4, ne - 0.25, D + 3.3, 21.7, ne + 0.25), K);
    let F = C + j;
    (c(Ee(D - 4, 21.9, F - 2.3, D + 4, 22.5, F + 2.3), E),
      c(Ee(D - 2.6, 22.5, F - 1.7, D + 1.4, 24.5, F + 1.7), w),
      c(Ee(D + 1.8, 22.5, F - 0.9, D + 3.4, 23.3, F + 0.9), _),
      c(Ee(D + 4.3, 17.2, F - 1, D + 6.1, 19.5, F + 1), w),
      c(
        Ee(D + 4.4, 18.2, F - 1.02, D + 6.12, 19.2, F + 1.02),
        [0.08, 0.1, 0.12],
      ));
    for (let ne of [-0.9, 0.9])
      c(Ee(D + 4.9, 19.5, F + ne - 0.06, D + 5.05, 21.9, F + ne + 0.06), E);
    let X = 21.9 - N;
    for (let ne of [-2.2, 2.2])
      for (let re of [-0.8, 0.8])
        c(Ke([D + ne, 21.9, F + re], [D + ne, X, F + re], 0.03, 4), _);
    (c(Ee(D - 6.1, X - 0.4, F - 1.22, D + 6.1, X, F + 1.22), E),
      c(Ee(D - 2.4, X, F - 0.9, D + 2.4, X + 0.5, F + 0.9), E));
    {
      let ne = D - 7.5 - 0.5,
        re = C - 9.5,
        $ = 1.7;
      for (let ue = 0; ue < 6; ue++) {
        let me = re + (ue % 2 ? 1.9 : -1.9),
          ee = re + (ue % 2 ? -1.9 : 1.9),
          B = Math.min(20.2, $ + 3.1);
        (c(jt([ne, $, me], [ne, B, ee], 0.6, 0.07), M),
          c(Ke([ne - 0.3, $ + 1, me], [ne - 0.3, B + 1, ee], 0.03, 4), E),
          c(Ee(ne - 0.35, B - 0.04, ee - 0.5, ne + 0.35, B, ee + 0.5), M),
          ($ = B));
      }
      for (let ue of [-2.4, 2.4])
        c(
          Ee(ne - 0.3, 1.7, re + ue - 0.05, ne - 0.2, 20.2, re + ue + 0.05),
          ie,
        );
      (c(xt(1.25, 1.25, 0.5, "z", D + 7.5 + 1, 3.3, C + 9.5 + 0.9, 12), E),
        c(xt(0.5, 0.5, 0.6, "z", D + 7.5 + 1, 3.3, C + 9.5 + 0.9, 8), _));
      for (let ue of [-0.2, 0.2])
        c(
          Ke(
            [D + 7.5 + 0.45, 1.7, C - 9.5 + ue],
            [D + 7.5 + 0.45, 20.2, C - 9.5 + ue],
            0.022,
            4,
          ),
          M,
        );
    }
    (e.add(Bn(D, 24.9, F, 0.3), r, 3.1, s(), 0.4),
      e.add(Bn(D - 3.3, 20, C - 4, 0.24), o, 0),
      e.add(Bn(D + 3.3, 20, C + 4, 0.24), o, 0));
  }
  let z = { add: (D, C, G) => c(C, G) },
    H = k1(6172444, 0.7);
  (S(-61, -52.06, A, -3, 4.5),
    S(-61, 41.1, H, 5, 9),
    S(-103, -10.14, H, 2, 3),
    S(-6, -62.6, A, -6, 7),
    S(-12, 60.1, A, 4, 5));
  for (let [D, C, G] of [
    [-67.5, -22, 32],
    [-67.5, 31, 32],
    [-122, 4, 34],
    [-12.6, -53, 30],
    [-12.6, 51, 30],
    [-140, -84, 34],
    [-96, 96, 34],
    [0.2, -100, 30],
    [-52, -70, 28],
    [-55, 72, 28],
    [-84, -45, 34],
    [-84, 24, 34],
    [-25, -84, 30],
    [-28, 90, 30],
    [-120, 60, 34],
    [10.5, 49, 26],
  ]) {
    (c(xt(0.14, 0.3, G, "y", D, G / 2, C, 6), M),
      c(xt(1.5, 1.5, 0.18, "y", D, G - 0.5, C, 8), _));
    for (let [j, N] of [
      [-1.4, 0],
      [1.4, 0],
      [0, -1.4],
      [0, 1.4],
    ])
      (c(
        Ee(
          D + j - 0.25,
          G - 0.95,
          C + N - 0.25,
          D + j + 0.25,
          G - 0.6,
          C + N + 0.25,
        ),
        _,
      ),
        e.add(Bn(D + j, G - 1.05, C + N, 0.2), o, 0));
  }
  for (let [D, C, G] of [
    [-158, -30, 62],
    [-76, -128, 48],
    [-150, 104, 54],
  ]) {
    let N = [
      [-1.1, -0.638],
      [1.1, -0.638],
      [0, 1.265],
    ];
    for (let [Q, K] of N)
      c(
        Ke([D + Q, 0, C + K], [D + Q * 0.3, G, C + K * 0.3], 0.07, 4),
        [0.42, 0.14, 0.1],
      );
    for (let Q = 3, K = 0; Q < G; Q += 6, K++)
      for (let ie = 0; ie < 3; ie++) {
        let F = N[ie],
          X = N[(ie + 1) % 3],
          ne = 1 - (0.7 * Q) / G,
          re = 1 - (0.7 * Math.min(G, Q + 6)) / G;
        c(
          Ke(
            [D + F[0] * ne, Q, C + F[1] * ne],
            [D + X[0] * re, Math.min(G, Q + 6), C + X[1] * re],
            0.04,
            3,
          ),
          K % 2 ? w : [0.42, 0.14, 0.1],
        );
      }
    for (let Q of [0.5, 2.6, 4.7])
      c(
        Ke(
          [D, G * 0.72, C],
          [D + Math.cos(Q) * G * 0.5, 0, C + Math.sin(Q) * G * 0.5],
          0.025,
          3,
        ),
        _,
      );
    (c(Ke([D, G, C], [D, G + 5, C], 0.04, 3), _),
      c(Ee(D - 0.9, G * 0.8, C - 0.25, D + 0.9, G * 0.8 + 1.6, C + 0.25), w),
      e.add(Bn(D, G + 0.4, C, 0.35), r, 2.4, s(), 0.45),
      e.add(Bn(D, G * 0.55, C, 0.28), r, 0));
  }
  for (let [D, C, G] of [
    [-178, -70, 90],
    [-182, 40, 110],
    [-60, -150, 70],
    [-70, 150, 80],
  ]) {
    let j = Math.abs(C) > 120,
      N = (Q, K, ie, F, X, ne, re) =>
        c(
          j
            ? Ee(D + Q, K, C + ie, D + F, X, C + ne)
            : Ee(D + ie, K, C + Q, D + ne, X, C + F),
          re,
        );
    (N(-G / 2, 0, -16, G / 2, 9.5, 16, [0.2, 0.22, 0.24]),
      N(-G / 2, 9.5, -16.4, G / 2, 9.9, 16.4, [0.12, 0.12, 0.13]),
      N(-G / 2, 9.9, -10, G / 2, 12.2, 10, [0.17, 0.18, 0.2]),
      N(-G / 2 + 4, 12.2, -1.2, G / 2 - 4, 13.3, 1.2, [0.13, 0.13, 0.14]));
    for (let Q = -G / 2 + 6; Q < G / 2 - 5; Q += 12)
      (N(Q - 0.25, 0, -16.2, Q + 0.25, 9.5, 16.2, [0.13, 0.14, 0.15]),
        (Q | 0) % 3 === 0 &&
          N(Q + 2, 0, -16.1, Q + 8, 6.2, 16.1, [0.06, 0.06, 0.07]));
  }
  (z1(i, e, { into: t, mat: n, dz: 66 }),
    [
      [-132, 1.15, !0, [0.14, 0.17, 0.21]],
      [-186, 1.25, !1, [0.14, 0.17, 0.21]],
      [-252, 1.35, !0, [0.26, 0.12, 0.06]],
      [-336, 1.4, !1, [0.26, 0.12, 0.06]],
      [128, 1.2, !1, [0.14, 0.17, 0.21]],
      [182, 1.3, !0, [0.24, 0.25, 0.27]],
      [250, 1.4, !1, [0.24, 0.25, 0.27]],
      [330, 1.45, !0, [0.26, 0.12, 0.06]],
    ].forEach(([D, C, G, j], N) => {
      let Q = mb(t, n, 23.5, D, { s: C, up: G, tint: j });
      e.add(
        Bn(Q[0], Q[1], Q[2], 0.45 * C),
        r,
        2.6 + (N % 3) * 0.35,
        N * 0.37,
        0.45,
      );
    }),
    c(Ee(-230, -1.6, -384, 30, -0.12, 425), [0.24, 0.24, 0.25]));
  function q(D, C, G, j, N, Q, K) {
    (c(Ee(D, -1.6, G, C, N, j), Q),
      c(Ee(D, -1.6, G, C, 0.8, j + 0.2), [0.42, 0.14, 0.1]));
    let ie = j - G,
      F = G + ie * K;
    (c(Ee(D + 2, N, F - 7, C - 2, N + 17, F + 7), [0.72, 0.73, 0.7]),
      c(
        Ee((D + C) / 2 - 3, N + 17, F - 5, (D + C) / 2 + 3, N + 24, F + 1),
        [0.2, 0.3, 0.45],
      ));
    for (let X = G + 12; X < j - 12; X += 13.2) {
      if (Math.abs(X + 6 - F) < 14) continue;
      let ne = 2.6 * (2 + Math.floor(s() * 4)),
        re = L1[Math.floor(s() * L1.length)];
      c(Ee(D + 1, N, X, (D + C) / 2 - 0.2, N + ne, X + 12.2), re);
      let $ = L1[Math.floor(s() * L1.length)];
      c(
        Ee(
          (D + C) / 2 + 0.2,
          N,
          X,
          C - 1,
          N + ne - 2.6 * Math.floor(s() * 2),
          X + 12.2,
        ),
        $,
      );
    }
    e.add(Bn((D + C) / 2, N + 26, F, 0.4), [5, 4.6, 3.8], 0);
  }
  (q(34, 62, 140, 345, 11, [0.1, 0.13, 0.2], 0.78),
    q(34, 58, -360, -205, 10, [0.2, 0.08, 0.07], 0.2),
    q(470, 500, -190, -40, 9, [0.12, 0.14, 0.17], 0.8),
    q(600, 626, 160, 300, 9, [0.16, 0.12, 0.1], 0.2));
  for (let D = 340; D > -66; D -= 12.5) {
    let C = 398 + Math.sin(D * 0.013) * 14 + (s() - 0.5) * 3,
      G = Ee(-6 - s() * 2, -1.6, -7, 6 + s() * 2, 2.2 + s() * 1.2, 7);
    (G.rotateY((s() - 0.5) * 0.5),
      G.translate(C, 0, D),
      c(G, [0.2, 0.21, 0.22]));
  }
  {
    (c(xt(5, 6, 3.6, "y", 399, 0.2, -72, 10), [0.3, 0.3, 0.3]),
      c(xt(1.7, 2.3, 6, "y", 399, 5, -72, 10), [0.85, 0.85, 0.82]),
      c(xt(1.5, 1.7, 4, "y", 399, 10, -72, 10), [0.62, 0.14, 0.1]),
      c(xt(1.3, 1.5, 4, "y", 399, 14, -72, 10), [0.85, 0.85, 0.82]),
      c(xt(2, 2, 0.3, "y", 399, 16.1, -72, 10), [0.3, 0.3, 0.32]),
      c(xt(0.2, 1.3, 1.2, "y", 399, 18.9, -72, 8), [0.25, 0.25, 0.27]));
    for (let G = 0; G < 6; G++) {
      let j = (G / 6) * 6.283;
      c(
        Ee(
          399 + Math.cos(j) * 1.1 - 0.06,
          16.2,
          -72 + Math.sin(j) * 1.1 - 0.06,
          399 + Math.cos(j) * 1.1 + 0.06,
          18.3,
          -72 + Math.sin(j) * 1.1 + 0.06,
        ),
        [0.25, 0.25, 0.27],
      );
    }
    e.add(Bn(399, 17.25, -72, 0.85), [16, 15, 11], 6, 0, 0.09);
  }
  let U = 300;
  c(Ee(U - 330, -1.6, -520, U + 330, 2.2, -430), [0.16, 0.17, 0.18]);
  for (let [D, C, G, j] of [
    [-150, -452, 17, 15],
    [-112, -458, 17, 15],
    [-76, -450, 13, 18],
    [20, -455, 20, 14],
    [64, -462, 20, 14],
    [104, -452, 14, 19],
    [136, -462, 14, 19],
    [210, -456, 22, 12],
  ])
    (c(xt(G, G, j, "y", U + D, 2.2 + j / 2, C, 14), [0.62, 0.63, 0.62]),
      c(
        xt(G * 0.2, G, j * 0.12, "y", U + D, 2.2 + j * 1.06, C, 14),
        [0.52, 0.53, 0.53],
      ));
  for (let [D, C, G, j] of [
    [-32, -470, 96, 3.2],
    [168, -475, 70, 2.6],
  ]) {
    c(xt(j * 0.62, j, G, "y", U + D, 2.2 + G / 2, C, 10), [0.5, 0.5, 0.5]);
    for (let N of [0.82, 0.94])
      c(
        xt(j * 0.66, j * 0.7, G * 0.05, "y", U + D, 2.2 + G * N, C, 10),
        [0.6, 0.15, 0.1],
      );
    (e.add(Bn(U + D, 3.2 + G, C, 0.9), r, 2.2, s(), 0.5),
      e.add(Bn(U + D + j, 2.2 + G * 0.55, C, 0.7), r, 2.2, s(), 0.5));
  }
  for (let [D, C, G, j, N] of [
    [-230, -455, 70, 16, 30],
    [-10, -445, 30, 22, 18],
    [0, -452, 8, 44, 8],
    [-18, -450, 5, 36, 5],
    [270, -450, 60, 12, 30],
    [150, -448, 26, 28, 14],
  ])
    c(
      Ee(U + D - G / 2, 2.2, C - N / 2, U + D + G / 2, 2.2 + j, C + N / 2),
      [0.34, 0.36, 0.38],
    );
  for (let D = 0; D < 26; D++)
    e.add(
      Bn(U - 300 + s() * 600, 6 + s() * 26, -436 + s() * 6, 0.55),
      s() > 0.3 ? o : [3, 3.4, 3.8],
      0,
    );
  let T = t.build({ cast: !1, recv: !1 });
  return ((T.name = "skyline"), { root: T, tris: t.tris });
}
function wb(i, e, t = 12) {
  let n = uv(5521),
    s = [],
    o = [],
    r = [];
  for (let u = 0; u < t; u++) {
    let f =
        u % 3 === 0
          ? [54 + n() * 30, 9 + n() * 14, -4 + n() * 56]
          : [16 + n() * 26, 33 + n() * 12, -14 + n() * 28],
      p = 9 + n() * 16,
      d = (0.16 + n() * 0.16) * (n() > 0.5 ? 1 : -1),
      v = n() * 6.283,
      g = 5 + n() * 3,
      x = [
        [0.15, 0, 0, 0],
        [-0.13, 0, 0, 0],
        [-0.24, 0, 0.8, 1],
        [0.15, 0, 0, 0],
        [-0.24, 0, -0.8, 1],
        [-0.13, 0, 0, 0],
      ];
    for (let y of x)
      (s.push(y[0], y[1] - 60, y[2]),
        o.push(f[0], f[1], f[2], p),
        r.push(d, v, g, y[3]));
  }
  let a = new nt();
  (a.setAttribute("position", new He(s, 3)),
    a.setAttribute("aOrbit", new He(o, 4)),
    a.setAttribute("aPar", new He(r, 4)));
  let l = new Nn({ color: new Ve(0.2, 0.21, 0.23), side: Sn, fog: !1 });
  ((l.onBeforeCompile = (u) => {
    ((u.uniforms.uTime = e),
      (u.vertexShader =
        `attribute vec4 aOrbit;
attribute vec4 aPar;
uniform float uTime;
` +
        u.vertexShader.replace(
          "#include <begin_vertex>",
          `
      float ga = aPar.y + uTime * aPar.x;
      float gdir = sign(aPar.x);
      vec3 gfw = vec3(-sin(ga), 0.0, cos(ga)) * gdir;
      vec3 grt = vec3(gfw.z, 0.0, -gfw.x);
      vec3 gl = position + vec3(0.0, 60.0, 0.0);
      float glide = smoothstep(-0.2, 0.5, sin(uTime * 0.31 + aPar.y * 3.0));
      float gflap = sin(uTime * aPar.z + aPar.y * 7.0) * mix(0.12, 0.55, glide) + 0.18;
      gl.y += aPar.w * gflap * abs(gl.z);
      gl.z *= mix(1.0, 0.86, aPar.w * abs(gflap));
      vec3 gc = aOrbit.xyz + vec3(cos(ga), 0.0, sin(ga)) * aOrbit.w + vec3(0.0, sin(ga * 0.7 + aPar.y) * 2.2 + sin(uTime * 0.23 + aPar.y) * 1.5, 0.0);
      vec3 transformed = gc + gfw * gl.x + grt * gl.z + vec3(0.0, gl.y - 0.3 * gdir * gl.z, 0.0);`,
        )));
  }),
    (l.customProgramCacheKey = () => "saltline-gulls"));
  let c = new Qe(a, l);
  return (
    (c.frustumCulled = !1),
    (c.castShadow = !1),
    (c.receiveShadow = !1),
    (c.name = "gulls"),
    c
  );
}
var _R = ["crane", "ship", "boat", "sky"];
function Eb(i, { only: e = null, showcase: t = !1 } = {}) {
  let n = (b) => !e || e === b,
    s = new wt();
  s.name = "backdrop";
  let o = pb(),
    r = new W(31.5, -1.6, 21);
  t && r.set(24, 0.34, 15);
  let a = null,
    l = null,
    c = null,
    u = null,
    h = null;
  if (
    (n("boat") &&
      ((a = xb(i, o)),
      a.root.position.copy(r),
      (a.root.rotation.y = -Math.PI / 2),
      s.add(a.root)),
    a && !t)
  ) {
    let b = new io(),
      m = i.mats.get("rope");
    (b.add(
      m,
      kr(ua(_t(3.2, 0.95, 0.05), _t(4.6, 2.12, 2.3), 0.22, 7), 0.016, 5),
    ),
      b.add(
        m,
        kr(ua(_t(-3.25, 0.82, 0.95), _t(-4.6, 2.12, 2.3), 0.2, 7), 0.016, 5),
      ),
      a.root.add(b.build({ cast: !1, recv: !1 })));
  }
  (n("crane") && ((l = z1(i, o)), s.add(l.root)),
    n("ship") && ((c = vb(i, o)), s.add(c.root)),
    n("sky") && ((u = Mb(i, o)), s.add(u.root)),
    (n("sky") || n("crane")) && ((h = wb(i, o.uTime, 12)), s.add(h)));
  let f = o.build();
  (f && ((f.name = "backdrop-lamps"), (f.frustumCulled = !1), s.add(f)),
    i.scene.add(s));
  let p = [],
    d = (b, m) => {
      i.physics &&
        i.physics.addBox &&
        p.push(
          i.physics.addBox(b.min, b.max, {
            surface: m,
            tag: "backdrop",
            noNav: !!b.noNav,
          }),
        );
    };
  if (l) for (let b of l.colliders) d(b, "metal");
  if (c) for (let b of c.colliders) d(b, "metal");
  a && !t && d({ min: [30.25, -1.7, 17.4], max: [32.8, -0.7, 24.6] }, "rubber");
  let v = 0,
    g = 0;
  s.traverse((b) => {
    if (b.isMesh) {
      g++;
      let m = b.geometry;
      v += (m.index ? m.index.count : m.attributes.position.count) / 3;
    }
  });
  let x = 0;
  function y(b) {
    if (((x += b), (o.uTime.value = x), l)) {
      let m = l.spreader;
      ((m.rotation.x =
        0.012 * Math.sin(x * 0.52) + 0.004 * Math.sin(x * 1.31 + 1)),
        (m.rotation.z = 0.009 * Math.sin(x * 0.41 + 1.1)));
    }
    (c && (c.radar.rotation.y = x * 1.9),
      a &&
        ((a.root.position.y =
          r.y +
          (t
            ? 0
            : 0.05 * Math.sin(x * 1.15) + 0.025 * Math.sin(x * 2.3 + 1.3))),
        (a.hullGrp.rotation.x =
          0.05 * Math.sin(x * 0.9 + 0.4) + 0.016 * Math.sin(x * 2.1)),
        (a.hullGrp.rotation.z = 0.02 * Math.sin(x * 1.3 + 2))));
  }
  return (
    y(0),
    {
      update: y,
      root: s,
      boat: a ? a.root : new on(),
      crane: l ? l.root : null,
      ship: c ? c.root : null,
      skyline: u ? u.root : null,
      gulls: h,
      lamps: f,
      colliders: p,
      spreader: l ? l.spreader : null,
      boatBase: r,
      extractionPoint: new W(30, 0, 20),
      shipName: "KITTIWAKE",
      craneId: "SALTLINE 04",
      stats: { tris: Math.round(v), drawCalls: g },
    }
  );
}
async function pv(i) {
  return Eb(i, {});
}
function MR(i) {
  let e = i.params && _R.includes(i.params.bshow) ? i.params.bshow : null,
    t = Eb(i, { only: e, showcase: !0 });
  console.log("[backdrop] " + JSON.stringify(t.stats));
  let n = {
    crane: { cam: [0, 1.7, 27], target: [33, 13, 0] },
    ship: { cam: [24, 1.7, -2], target: [38, 9, -24] },
    boat: { cam: [19.5, 1.7, 11.5], target: [24, 0.9, 15] },
    sky: { cam: [-32, 1.7, 6], target: [30, 9, 0] },
  };
  return { ...(n[e] || n.crane), update: (s) => t.update(s) };
}
