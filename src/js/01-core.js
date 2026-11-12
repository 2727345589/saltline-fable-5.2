/*
 * Saltline — 01-core.js
 * world config, quality presets, event bus, RNG, math helpers, fallback stubs, merge and primitive builders
 *
 * Source fragment. All numbered files share one top-level scope and are
 * concatenated in filename order inside a single IIFE at build time.
 * Keep top-level declaration names unique across files.
 */
var oi = {
    min: new W(-40, 0, -30),
    max: new W(40, 30, 30),
    groundY: 0,
    seaY: -1.6,
    quayX: 30,
  },
  Mn = {
    dir: new W(0.916, 0.225, 0.331).normalize(),
    color: new Ve(1, 0.72, 0.42),
    intensity: 9,
  },
  en = {
    zenith: new Ve(0.055, 0.085, 0.13),
    horizon: new Ve(0.95, 0.55, 0.28),
    horizonAway: new Ve(0.16, 0.22, 0.3),
    fog: new Ve(0.42, 0.47, 0.52),
  },
  Pi = {
    eye: 1.68,
    crouchEye: 1.05,
    radius: 0.32,
    height: 1.8,
    fov: 74,
    viewFov: 54,
  },
  vf = 0,
  zc = 1,
  Pr = {
    test: {
      name: "test",
      scale: 1,
      msaa: 0,
      shadow: 1024,
      tex: 256,
      volSteps: 10,
      ao: !0,
      planar: 0.5,
      bloom: !0,
      motionBlur: !1,
      rain: 0.4,
    },
    low: {
      name: "low",
      scale: 0.7,
      msaa: 0,
      shadow: 2048,
      tex: 512,
      volSteps: 12,
      ao: !1,
      planar: 0,
      bloom: !0,
      motionBlur: !1,
      rain: 0.5,
    },
    medium: {
      name: "medium",
      scale: 0.85,
      msaa: 2,
      shadow: 2048,
      tex: 1024,
      volSteps: 16,
      ao: !0,
      planar: 0.5,
      bloom: !0,
      motionBlur: !1,
      rain: 0.8,
    },
    high: {
      name: "high",
      scale: 1,
      msaa: 4,
      shadow: 4096,
      tex: 1024,
      volSteps: 24,
      ao: !0,
      planar: 0.5,
      bloom: !0,
      motionBlur: !0,
      rain: 1,
    },
    ultra: {
      name: "ultra",
      scale: 1,
      msaa: 4,
      shadow: 4096,
      tex: 2048,
      volSteps: 40,
      ao: !0,
      planar: 1,
      bloom: !0,
      motionBlur: !0,
      rain: 1,
    },
  };
function zy(i) {
  if (i && Pr[i]) return { ...Pr[i] };
  if (
    /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 &&
      Math.min(screen.width, screen.height) < 900)
  )
    return { ...Pr.low };
  let t = "";
  try {
    let s = document.createElement("canvas"),
      o = s.getContext("webgl2") || s.getContext("webgl");
    if (o) {
      let r = o.getExtension("WEBGL_debug_renderer_info");
      t = String(
        r
          ? o.getParameter(r.UNMASKED_RENDERER_WEBGL)
          : o.getParameter(o.RENDERER),
      );
      let a = o.getExtension("WEBGL_lose_context");
      a && a.loseContext();
    }
  } catch {}
  return {
    ...(/SwiftShader|llvmpipe|Software|Mali|Adreno|PowerVR/i.test(t) ||
    (/Intel/i.test(t) && !/Arc/i.test(t))
      ? Pr.medium
      : Pr.high),
  };
}
function Dy() {
  let i = new Map();
  return {
    on(e, t) {
      return (i.has(e) || i.set(e, []), i.get(e).push(t), () => this.off(e, t));
    },
    off(e, t) {
      let n = i.get(e);
      if (n) {
        let s = n.indexOf(t);
        s >= 0 && n.splice(s, 1);
      }
    },
    emit(e, t) {
      let n = i.get(e);
      if (n)
        for (let s = 0; s < n.length; s++)
          try {
            n[s](t);
          } catch (o) {
            console.error(`[events] handler for "${e}" threw`, o);
          }
    },
  };
}
function il(i = 1337) {
  let e = i >>> 0,
    t = () => {
      ((e |= 0), (e = (e + 1831565813) | 0));
      let n = Math.imul(e ^ (e >>> 15), 1 | e);
      return (
        (n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n),
        ((n ^ (n >>> 14)) >>> 0) / 4294967296
      );
    };
  return (
    (t.range = (n, s) => n + (s - n) * t()),
    (t.int = (n, s) => Math.floor(n + (s - n + 1) * t())),
    (t.pick = (n) => n[Math.floor(t() * n.length)]),
    (t.sign = () => (t() < 0.5 ? -1 : 1)),
    (t.fork = () => il(Math.floor(t() * 4294967296))),
    t
  );
}
var Zn = (i, e, t) => Math.min(t, Math.max(e, i)),
  bi = (i, e, t) => i + (e - i) * t,
  Fo = (i) => Math.min(1, Math.max(0, i)),
  sl = (i, e, t) => {
    let n = Fo((t - i) / (e - i));
    return n * n * (3 - 2 * n);
  },
  kn = (i, e, t, n) => e + (i - e) * Math.exp(-t * n);
var Wt = () => {},
  dr = {
    ground: () => ({
      stub: !0,
      update: Wt,
      wetnessAt: () => 0.5,
      isPuddle: () => !1,
    }),
    backdrop: () => ({ stub: !0, update: Wt }),
    fx: () => ({
      stub: !0,
      update: Wt,
      muzzleFlash: Wt,
      tracer: Wt,
      impact: Wt,
      sparks: Wt,
      smoke: Wt,
      explosion: Wt,
      debris: Wt,
      shell: Wt,
      decal: Wt,
      dust: Wt,
      clear: Wt,
      splash: Wt,
      addEmitter: () => ({ stop: Wt, setPos: Wt }),
    }),
    audio: () => {
      let i = { setPos: Wt, setGain: Wt, setPitch: Wt, stop: Wt };
      return {
        stub: !0,
        update: Wt,
        resume: Wt,
        play: Wt,
        loop: () => i,
        setIntensity: Wt,
        setInterior: Wt,
        setVolume: Wt,
        setPaused: Wt,
      };
    },
    weapon: () => ({
      stub: !0,
      update: Wt,
      reset: Wt,
      setVisible: Wt,
      ammo: 30,
      magSize: 30,
      reserve: 120,
      state: "idle",
      name: "KR-7",
      ads: 0,
      spread: 0.01,
    }),
    enemies: () => ({
      stub: !0,
      list: [],
      update: Wt,
      spawn: () => null,
      raycast: () => null,
      aliveCount: () => 0,
      clear: Wt,
      alert: Wt,
    }),
    hud: () => ({
      stub: !0,
      update: Wt,
      show: Wt,
      setObjective: Wt,
      message: Wt,
      hitmarker: Wt,
    }),
    mats: () => {
      let i = new Map();
      return {
        stub: !0,
        get: (t) => (
          i.has(t) || i.set(t, new Qt({ color: 7829367, roughness: 0.7 })),
          i.get(t)
        ),
        emissive: (t = 16777215, n = 4) =>
          new Nn({ color: new Ve(t).multiplyScalar(n) }),
        names: [],
        decal: () => ({
          material: new Nn({ transparent: !0, opacity: 0 }),
          aspect: 1,
        }),
        label: () => ({
          material: new Nn({ transparent: !0, opacity: 0 }),
          aspect: 4,
        }),
        uniforms: { wet: { value: 1 } },
        update: Wt,
      };
    },
  };
function sa(i, e = !1) {
  let t = i[0].index !== null,
    n = new Set(Object.keys(i[0].attributes)),
    s = new Set(Object.keys(i[0].morphAttributes)),
    o = {},
    r = {},
    a = i[0].morphTargetsRelative,
    l = new nt(),
    c = 0;
  for (let u = 0; u < i.length; ++u) {
    let h = i[u],
      f = 0;
    if (t !== (h.index !== null))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            u +
            ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.",
        ),
        null
      );
    for (let p in h.attributes) {
      if (!n.has(p))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              u +
              '. All geometries must have compatible attributes; make sure "' +
              p +
              '" attribute exists among all geometries, or in none of them.',
          ),
          null
        );
      (o[p] === void 0 && (o[p] = []), o[p].push(h.attributes[p]), f++);
    }
    if (f !== n.size)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            u +
            ". Make sure all geometries have the same number of attributes.",
        ),
        null
      );
    if (a !== h.morphTargetsRelative)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            u +
            ". .morphTargetsRelative must be consistent throughout all geometries.",
        ),
        null
      );
    for (let p in h.morphAttributes) {
      if (!s.has(p))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              u +
              ".  .morphAttributes must be consistent throughout all geometries.",
          ),
          null
        );
      (r[p] === void 0 && (r[p] = []), r[p].push(h.morphAttributes[p]));
    }
    if (e) {
      let p;
      if (t) p = h.index.count;
      else if (h.attributes.position !== void 0)
        p = h.attributes.position.count;
      else
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              u +
              ". The geometry must have either an index or a position attribute",
          ),
          null
        );
      (l.addGroup(c, p, u), (c += p));
    }
  }
  if (t) {
    let u = 0,
      h = [];
    for (let f = 0; f < i.length; ++f) {
      let p = i[f].index;
      for (let d = 0; d < p.count; ++d) h.push(p.getX(d) + u);
      u += i[f].attributes.position.count;
    }
    l.setIndex(h);
  }
  for (let u in o) {
    let h = Ly(o[u]);
    if (!h)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
            u +
            " attribute.",
        ),
        null
      );
    l.setAttribute(u, h);
  }
  for (let u in r) {
    let h = r[u][0].length;
    if (h === 0) break;
    ((l.morphAttributes = l.morphAttributes || {}),
      (l.morphAttributes[u] = []));
    for (let f = 0; f < h; ++f) {
      let p = [];
      for (let v = 0; v < r[u].length; ++v) p.push(r[u][v][f]);
      let d = Ly(p);
      if (!d)
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
              u +
              " morphAttribute.",
          ),
          null
        );
      l.morphAttributes[u].push(d);
    }
  }
  return l;
}
function Ly(i) {
  let e,
    t,
    n,
    s = -1,
    o = 0;
  for (let c = 0; c < i.length; ++c) {
    let u = i[c];
    if ((e === void 0 && (e = u.array.constructor), e !== u.array.constructor))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.",
        ),
        null
      );
    if ((t === void 0 && (t = u.itemSize), t !== u.itemSize))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.",
        ),
        null
      );
    if ((n === void 0 && (n = u.normalized), n !== u.normalized))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.",
        ),
        null
      );
    if ((s === -1 && (s = u.gpuType), s !== u.gpuType))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.",
        ),
        null
      );
    o += u.count * t;
  }
  let r = new e(o),
    a = new et(r, t, n),
    l = 0;
  for (let c = 0; c < i.length; ++c) {
    let u = i[c];
    if (u.isInterleavedBufferAttribute) {
      let h = l / t;
      for (let f = 0, p = u.count; f < p; f++)
        for (let d = 0; d < t; d++) {
          let v = u.getComponent(f, d);
          a.setComponent(f + h, d, v);
        }
    } else r.set(u.array, l);
    l += u.count * t;
  }
  return (s !== void 0 && (a.gpuType = s), a);
}
var oa = new W();
function $e(i, e, t, n = "center") {
  let s = new un(i, e, t),
    o = s.attributes.uv,
    r = s.attributes.position,
    a = s.attributes.normal;
  for (let l = 0; l < o.count; l++) {
    let c = Math.abs(a.getX(l)),
      u = Math.abs(a.getY(l)),
      h = r.getX(l),
      f = r.getY(l),
      p = r.getZ(l);
    c > 0.5 ? o.setXY(l, p, f) : u > 0.5 ? o.setXY(l, h, p) : o.setXY(l, h, f);
  }
  return (n === "bottom" && s.translate(0, e / 2, 0), s);
}
function Wi(i, e, t, n = 0.02, s = "center") {
  n = Math.min(n, i / 2 - 1e-4, e / 2 - 1e-4, t / 2 - 1e-4);
  let o = new un(i, e, t, 3, 3, 3),
    r = o.attributes.position,
    a = o.attributes.normal,
    l = o.attributes.uv,
    c = i / 2,
    u = e / 2,
    h = t / 2,
    f = (p, d) => {
      let v = Math.abs(p),
        g = Math.sign(p);
      return v > d - 1e-5 ? g * d : g * (d - n);
    };
  for (let p = 0; p < r.count; p++) {
    let d = f(r.getX(p), c),
      v = f(r.getY(p), u),
      g = f(r.getZ(p), h),
      x = Math.max(-(c - n), Math.min(c - n, d)),
      y = Math.max(-(u - n), Math.min(u - n, v)),
      b = Math.max(-(h - n), Math.min(h - n, g));
    if ((oa.set(d - x, v - y, g - b), oa.lengthSq() > 1e-10)) {
      oa.normalize();
      let M = a.getX(p),
        E = a.getY(p),
        w = a.getZ(p);
      (Math.abs(d) > c - 1e-5 ? 1 : 0) +
        (Math.abs(v) > u - 1e-5 ? 1 : 0) +
        (Math.abs(g) > h - 1e-5 ? 1 : 0) >=
      2
        ? ((d = x + oa.x * n),
          (v = y + oa.y * n),
          (g = b + oa.z * n),
          a.setXYZ(p, oa.x, oa.y, oa.z))
        : a.setXYZ(p, M, E, w);
    }
    r.setXYZ(p, d, v, g);
    let m = Math.abs(a.getX(p)),
      A = Math.abs(a.getY(p)),
      _ = Math.abs(a.getZ(p));
    m >= A && m >= _
      ? l.setXY(p, g, v)
      : A >= m && A >= _
        ? l.setXY(p, d, g)
        : l.setXY(p, d, v);
  }
  return (s === "bottom" && o.translate(0, e / 2, 0), o);
}
function ot(i, e, t, n = 16, s = !1, o = "center") {
  let r = new Ys(i, e, t, n, 1, s),
    a = r.attributes.uv,
    l = r.attributes.position,
    c = r.attributes.normal,
    u = Math.PI * (i + e);
  for (let h = 0; h < a.count; h++)
    Math.abs(c.getY(h)) > 0.9
      ? a.setXY(h, l.getX(h), l.getZ(h))
      : a.setXY(h, a.getX(h) * u, l.getY(h));
  return (o === "bottom" && r.translate(0, t / 2, 0), r);
}
function Fn(i, e = 0.03, t = 8, n = !1, s = 0) {
  let o = i.map((h) => (h.isVector3 ? h : new W(h[0], h[1], h[2]))),
    r = new Jr(o, n, "catmullrom", s),
    a = r.getLength(),
    l = Math.max(2, Math.ceil(a / Math.max(0.08, e * 3))),
    c = new Kr(r, Math.min(l, 400), e, t, n),
    u = c.attributes.uv;
  for (let h = 0; h < u.count; h++)
    u.setXY(h, u.getX(h) * a, u.getY(h) * Math.PI * 2 * e);
  return c;
}
var ky = new Ye(),
  Fy = new Lt(),
  Uy = new In(),
  Ny = new W(),
  Fg = new W();
function Dc(i, { p: e = [0, 0, 0], r: t = [0, 0, 0], s: n = 1 } = {}) {
  return (
    Uy.set(t[0], t[1], t[2]),
    Fy.setFromEuler(Uy),
    Ny.set(e[0], e[1], e[2]),
    typeof n == "number" ? Fg.set(n, n, n) : Fg.set(n[0], n[1], n[2]),
    ky.compose(Ny, Fy, Fg),
    i.applyMatrix4(ky),
    i
  );
}
function Lc(i, e) {
  let t = i.attributes.position,
    n = t.count,
    s = new Float32Array(n * 3);
  for (let o = 0; o < n; o++) {
    let r = typeof e == "function" ? e(t.getX(o), t.getY(o), t.getZ(o)) : e;
    ((s[o * 3] = r[0]), (s[o * 3 + 1] = r[1]), (s[o * 3 + 2] = r[2]));
  }
  return (i.setAttribute("color", new et(s, 3)), i);
}
function Ii(i) {
  let e = i
    .filter(Boolean)
    .map(
      (l) => (
        l.attributes.uv ||
          l.setAttribute(
            "uv",
            new et(new Float32Array(l.attributes.position.count * 2), 2),
          ),
        l.attributes.normal || l.computeVertexNormals(),
        l
      ),
    );
  if (!e.length) return new nt();
  let t = e.some((l) => l.attributes.color),
    n = e.map((l) => {
      let c = (l.index, l);
      if (t && !c.attributes.color) {
        let u = new Float32Array(c.attributes.position.count * 3).fill(1);
        c.setAttribute("color", new et(u, 3));
      }
      for (let u of Object.keys(c.attributes))
        ["position", "normal", "uv", "color"].includes(u) ||
          c.deleteAttribute(u);
      return c;
    }),
    s = n.every((l) => l.index),
    o = n.every((l) => !l.index),
    r = s || o ? n : n.map((l) => (l.index ? l.toNonIndexed() : l));
  return sa(r, !1) || new nt();
}
function By(i, { castShadow: e = !0, receiveShadow: t = !0 } = {}) {
  i.updateMatrixWorld(!0);
  let n = new Map(),
    s = [];
  i.traverse((r) => {
    if (!r.isMesh) return;
    let a = r,
      l = !1;
    for (; a; ) {
      if (a.userData && a.userData.noMerge) {
        l = !0;
        break;
      }
      a = a.parent;
    }
    if (
      l ||
      r.isSkinnedMesh ||
      r.isInstancedMesh ||
      Array.isArray(r.material)
    ) {
      s.push(r);
      return;
    }
    let c =
      r.material.uuid +
      (r.castShadow ? "c" : "n") +
      (r.receiveShadow ? "r" : "n") +
      ":" +
      r.layers.mask;
    n.has(c) ||
      n.set(c, {
        mat: r.material,
        geos: [],
        cast: r.castShadow,
        recv: r.receiveShadow,
        layers: r.layers.mask,
      });
    let u = r.geometry.clone();
    (u.applyMatrix4(r.matrixWorld), n.get(c).geos.push(u));
  });
  let o = new wt();
  for (let r of n.values()) {
    let a = new Qe(Ii(r.geos), r.mat);
    ((a.castShadow = r.cast && e),
      (a.receiveShadow = r.recv && t),
      (a.layers.mask = r.layers),
      o.add(a));
  }
  for (let r of s) {
    r.updateMatrixWorld(!0);
    let a = r.matrixWorld.clone();
    (o.add(r),
      r.matrix.copy(a),
      r.matrix.decompose(r.position, r.quaternion, r.scale));
  }
  return o;
}
function Qi(i, e, { cast: t = !0, recv: n = !0 } = {}) {
  let s = new Qe(i, e);
  return ((s.castShadow = t), (s.receiveShadow = n), s);
}
