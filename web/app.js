(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vendor/tweetnacl.js
  var require_tweetnacl = __commonJS({
    "vendor/tweetnacl.js"(exports, module) {
      (function(nacl) {
        "use strict";
        var gf = function(init) {
          var i, r = new Float64Array(16);
          if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
          return r;
        };
        var randombytes = function() {
          throw new Error("no PRNG");
        };
        var _0 = new Uint8Array(16);
        var _9 = new Uint8Array(32);
        _9[0] = 9;
        var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
        function ts64(x, i, h, l) {
          x[i] = h >> 24 & 255;
          x[i + 1] = h >> 16 & 255;
          x[i + 2] = h >> 8 & 255;
          x[i + 3] = h & 255;
          x[i + 4] = l >> 24 & 255;
          x[i + 5] = l >> 16 & 255;
          x[i + 6] = l >> 8 & 255;
          x[i + 7] = l & 255;
        }
        function vn(x, xi, y, yi, n) {
          var i, d = 0;
          for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
          return (1 & d - 1 >>> 8) - 1;
        }
        function crypto_verify_16(x, xi, y, yi) {
          return vn(x, xi, y, yi, 16);
        }
        function crypto_verify_32(x, xi, y, yi) {
          return vn(x, xi, y, yi, 32);
        }
        function core_salsa20(o, p, k, c) {
          var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
          var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
          for (var i = 0; i < 20; i += 2) {
            u = x0 + x12 | 0;
            x4 ^= u << 7 | u >>> 32 - 7;
            u = x4 + x0 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x4 | 0;
            x12 ^= u << 13 | u >>> 32 - 13;
            u = x12 + x8 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x1 | 0;
            x9 ^= u << 7 | u >>> 32 - 7;
            u = x9 + x5 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x9 | 0;
            x1 ^= u << 13 | u >>> 32 - 13;
            u = x1 + x13 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x6 | 0;
            x14 ^= u << 7 | u >>> 32 - 7;
            u = x14 + x10 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x14 | 0;
            x6 ^= u << 13 | u >>> 32 - 13;
            u = x6 + x2 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x11 | 0;
            x3 ^= u << 7 | u >>> 32 - 7;
            u = x3 + x15 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x3 | 0;
            x11 ^= u << 13 | u >>> 32 - 13;
            u = x11 + x7 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
            u = x0 + x3 | 0;
            x1 ^= u << 7 | u >>> 32 - 7;
            u = x1 + x0 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x1 | 0;
            x3 ^= u << 13 | u >>> 32 - 13;
            u = x3 + x2 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x4 | 0;
            x6 ^= u << 7 | u >>> 32 - 7;
            u = x6 + x5 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x6 | 0;
            x4 ^= u << 13 | u >>> 32 - 13;
            u = x4 + x7 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x9 | 0;
            x11 ^= u << 7 | u >>> 32 - 7;
            u = x11 + x10 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x11 | 0;
            x9 ^= u << 13 | u >>> 32 - 13;
            u = x9 + x8 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x14 | 0;
            x12 ^= u << 7 | u >>> 32 - 7;
            u = x12 + x15 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x12 | 0;
            x14 ^= u << 13 | u >>> 32 - 13;
            u = x14 + x13 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
          }
          x0 = x0 + j0 | 0;
          x1 = x1 + j1 | 0;
          x2 = x2 + j2 | 0;
          x3 = x3 + j3 | 0;
          x4 = x4 + j4 | 0;
          x5 = x5 + j5 | 0;
          x6 = x6 + j6 | 0;
          x7 = x7 + j7 | 0;
          x8 = x8 + j8 | 0;
          x9 = x9 + j9 | 0;
          x10 = x10 + j10 | 0;
          x11 = x11 + j11 | 0;
          x12 = x12 + j12 | 0;
          x13 = x13 + j13 | 0;
          x14 = x14 + j14 | 0;
          x15 = x15 + j15 | 0;
          o[0] = x0 >>> 0 & 255;
          o[1] = x0 >>> 8 & 255;
          o[2] = x0 >>> 16 & 255;
          o[3] = x0 >>> 24 & 255;
          o[4] = x1 >>> 0 & 255;
          o[5] = x1 >>> 8 & 255;
          o[6] = x1 >>> 16 & 255;
          o[7] = x1 >>> 24 & 255;
          o[8] = x2 >>> 0 & 255;
          o[9] = x2 >>> 8 & 255;
          o[10] = x2 >>> 16 & 255;
          o[11] = x2 >>> 24 & 255;
          o[12] = x3 >>> 0 & 255;
          o[13] = x3 >>> 8 & 255;
          o[14] = x3 >>> 16 & 255;
          o[15] = x3 >>> 24 & 255;
          o[16] = x4 >>> 0 & 255;
          o[17] = x4 >>> 8 & 255;
          o[18] = x4 >>> 16 & 255;
          o[19] = x4 >>> 24 & 255;
          o[20] = x5 >>> 0 & 255;
          o[21] = x5 >>> 8 & 255;
          o[22] = x5 >>> 16 & 255;
          o[23] = x5 >>> 24 & 255;
          o[24] = x6 >>> 0 & 255;
          o[25] = x6 >>> 8 & 255;
          o[26] = x6 >>> 16 & 255;
          o[27] = x6 >>> 24 & 255;
          o[28] = x7 >>> 0 & 255;
          o[29] = x7 >>> 8 & 255;
          o[30] = x7 >>> 16 & 255;
          o[31] = x7 >>> 24 & 255;
          o[32] = x8 >>> 0 & 255;
          o[33] = x8 >>> 8 & 255;
          o[34] = x8 >>> 16 & 255;
          o[35] = x8 >>> 24 & 255;
          o[36] = x9 >>> 0 & 255;
          o[37] = x9 >>> 8 & 255;
          o[38] = x9 >>> 16 & 255;
          o[39] = x9 >>> 24 & 255;
          o[40] = x10 >>> 0 & 255;
          o[41] = x10 >>> 8 & 255;
          o[42] = x10 >>> 16 & 255;
          o[43] = x10 >>> 24 & 255;
          o[44] = x11 >>> 0 & 255;
          o[45] = x11 >>> 8 & 255;
          o[46] = x11 >>> 16 & 255;
          o[47] = x11 >>> 24 & 255;
          o[48] = x12 >>> 0 & 255;
          o[49] = x12 >>> 8 & 255;
          o[50] = x12 >>> 16 & 255;
          o[51] = x12 >>> 24 & 255;
          o[52] = x13 >>> 0 & 255;
          o[53] = x13 >>> 8 & 255;
          o[54] = x13 >>> 16 & 255;
          o[55] = x13 >>> 24 & 255;
          o[56] = x14 >>> 0 & 255;
          o[57] = x14 >>> 8 & 255;
          o[58] = x14 >>> 16 & 255;
          o[59] = x14 >>> 24 & 255;
          o[60] = x15 >>> 0 & 255;
          o[61] = x15 >>> 8 & 255;
          o[62] = x15 >>> 16 & 255;
          o[63] = x15 >>> 24 & 255;
        }
        function core_hsalsa20(o, p, k, c) {
          var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
          var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
          for (var i = 0; i < 20; i += 2) {
            u = x0 + x12 | 0;
            x4 ^= u << 7 | u >>> 32 - 7;
            u = x4 + x0 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x4 | 0;
            x12 ^= u << 13 | u >>> 32 - 13;
            u = x12 + x8 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x1 | 0;
            x9 ^= u << 7 | u >>> 32 - 7;
            u = x9 + x5 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x9 | 0;
            x1 ^= u << 13 | u >>> 32 - 13;
            u = x1 + x13 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x6 | 0;
            x14 ^= u << 7 | u >>> 32 - 7;
            u = x14 + x10 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x14 | 0;
            x6 ^= u << 13 | u >>> 32 - 13;
            u = x6 + x2 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x11 | 0;
            x3 ^= u << 7 | u >>> 32 - 7;
            u = x3 + x15 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x3 | 0;
            x11 ^= u << 13 | u >>> 32 - 13;
            u = x11 + x7 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
            u = x0 + x3 | 0;
            x1 ^= u << 7 | u >>> 32 - 7;
            u = x1 + x0 | 0;
            x2 ^= u << 9 | u >>> 32 - 9;
            u = x2 + x1 | 0;
            x3 ^= u << 13 | u >>> 32 - 13;
            u = x3 + x2 | 0;
            x0 ^= u << 18 | u >>> 32 - 18;
            u = x5 + x4 | 0;
            x6 ^= u << 7 | u >>> 32 - 7;
            u = x6 + x5 | 0;
            x7 ^= u << 9 | u >>> 32 - 9;
            u = x7 + x6 | 0;
            x4 ^= u << 13 | u >>> 32 - 13;
            u = x4 + x7 | 0;
            x5 ^= u << 18 | u >>> 32 - 18;
            u = x10 + x9 | 0;
            x11 ^= u << 7 | u >>> 32 - 7;
            u = x11 + x10 | 0;
            x8 ^= u << 9 | u >>> 32 - 9;
            u = x8 + x11 | 0;
            x9 ^= u << 13 | u >>> 32 - 13;
            u = x9 + x8 | 0;
            x10 ^= u << 18 | u >>> 32 - 18;
            u = x15 + x14 | 0;
            x12 ^= u << 7 | u >>> 32 - 7;
            u = x12 + x15 | 0;
            x13 ^= u << 9 | u >>> 32 - 9;
            u = x13 + x12 | 0;
            x14 ^= u << 13 | u >>> 32 - 13;
            u = x14 + x13 | 0;
            x15 ^= u << 18 | u >>> 32 - 18;
          }
          o[0] = x0 >>> 0 & 255;
          o[1] = x0 >>> 8 & 255;
          o[2] = x0 >>> 16 & 255;
          o[3] = x0 >>> 24 & 255;
          o[4] = x5 >>> 0 & 255;
          o[5] = x5 >>> 8 & 255;
          o[6] = x5 >>> 16 & 255;
          o[7] = x5 >>> 24 & 255;
          o[8] = x10 >>> 0 & 255;
          o[9] = x10 >>> 8 & 255;
          o[10] = x10 >>> 16 & 255;
          o[11] = x10 >>> 24 & 255;
          o[12] = x15 >>> 0 & 255;
          o[13] = x15 >>> 8 & 255;
          o[14] = x15 >>> 16 & 255;
          o[15] = x15 >>> 24 & 255;
          o[16] = x6 >>> 0 & 255;
          o[17] = x6 >>> 8 & 255;
          o[18] = x6 >>> 16 & 255;
          o[19] = x6 >>> 24 & 255;
          o[20] = x7 >>> 0 & 255;
          o[21] = x7 >>> 8 & 255;
          o[22] = x7 >>> 16 & 255;
          o[23] = x7 >>> 24 & 255;
          o[24] = x8 >>> 0 & 255;
          o[25] = x8 >>> 8 & 255;
          o[26] = x8 >>> 16 & 255;
          o[27] = x8 >>> 24 & 255;
          o[28] = x9 >>> 0 & 255;
          o[29] = x9 >>> 8 & 255;
          o[30] = x9 >>> 16 & 255;
          o[31] = x9 >>> 24 & 255;
        }
        function crypto_core_salsa20(out, inp, k, c) {
          core_salsa20(out, inp, k, c);
        }
        function crypto_core_hsalsa20(out, inp, k, c) {
          core_hsalsa20(out, inp, k, c);
        }
        var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
        function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
          var z = new Uint8Array(16), x = new Uint8Array(64);
          var u, i;
          for (i = 0; i < 16; i++) z[i] = 0;
          for (i = 0; i < 8; i++) z[i] = n[i];
          while (b >= 64) {
            crypto_core_salsa20(x, z, k, sigma);
            for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
            u = 1;
            for (i = 8; i < 16; i++) {
              u = u + (z[i] & 255) | 0;
              z[i] = u & 255;
              u >>>= 8;
            }
            b -= 64;
            cpos += 64;
            mpos += 64;
          }
          if (b > 0) {
            crypto_core_salsa20(x, z, k, sigma);
            for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
          }
          return 0;
        }
        function crypto_stream_salsa20(c, cpos, b, n, k) {
          var z = new Uint8Array(16), x = new Uint8Array(64);
          var u, i;
          for (i = 0; i < 16; i++) z[i] = 0;
          for (i = 0; i < 8; i++) z[i] = n[i];
          while (b >= 64) {
            crypto_core_salsa20(x, z, k, sigma);
            for (i = 0; i < 64; i++) c[cpos + i] = x[i];
            u = 1;
            for (i = 8; i < 16; i++) {
              u = u + (z[i] & 255) | 0;
              z[i] = u & 255;
              u >>>= 8;
            }
            b -= 64;
            cpos += 64;
          }
          if (b > 0) {
            crypto_core_salsa20(x, z, k, sigma);
            for (i = 0; i < b; i++) c[cpos + i] = x[i];
          }
          return 0;
        }
        function crypto_stream(c, cpos, d, n, k) {
          var s = new Uint8Array(32);
          crypto_core_hsalsa20(s, n, k, sigma);
          var sn = new Uint8Array(8);
          for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
          return crypto_stream_salsa20(c, cpos, d, sn, s);
        }
        function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
          var s = new Uint8Array(32);
          crypto_core_hsalsa20(s, n, k, sigma);
          var sn = new Uint8Array(8);
          for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
          return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
        }
        var poly1305 = function(key) {
          this.buffer = new Uint8Array(16);
          this.r = new Uint16Array(10);
          this.h = new Uint16Array(10);
          this.pad = new Uint16Array(8);
          this.leftover = 0;
          this.fin = 0;
          var t0, t1, t2, t3, t4, t5, t6, t7;
          t0 = key[0] & 255 | (key[1] & 255) << 8;
          this.r[0] = t0 & 8191;
          t1 = key[2] & 255 | (key[3] & 255) << 8;
          this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
          t2 = key[4] & 255 | (key[5] & 255) << 8;
          this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
          t3 = key[6] & 255 | (key[7] & 255) << 8;
          this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
          t4 = key[8] & 255 | (key[9] & 255) << 8;
          this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
          this.r[5] = t4 >>> 1 & 8190;
          t5 = key[10] & 255 | (key[11] & 255) << 8;
          this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
          t6 = key[12] & 255 | (key[13] & 255) << 8;
          this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
          t7 = key[14] & 255 | (key[15] & 255) << 8;
          this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
          this.r[9] = t7 >>> 5 & 127;
          this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
          this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
          this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
          this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
          this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
          this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
          this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
          this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
        };
        poly1305.prototype.blocks = function(m, mpos, bytes) {
          var hibit = this.fin ? 0 : 1 << 11;
          var t0, t1, t2, t3, t4, t5, t6, t7, c;
          var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
          var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
          var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
          while (bytes >= 16) {
            t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
            h0 += t0 & 8191;
            t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
            h1 += (t0 >>> 13 | t1 << 3) & 8191;
            t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
            h2 += (t1 >>> 10 | t2 << 6) & 8191;
            t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
            h3 += (t2 >>> 7 | t3 << 9) & 8191;
            t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
            h4 += (t3 >>> 4 | t4 << 12) & 8191;
            h5 += t4 >>> 1 & 8191;
            t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
            h6 += (t4 >>> 14 | t5 << 2) & 8191;
            t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
            h7 += (t5 >>> 11 | t6 << 5) & 8191;
            t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
            h8 += (t6 >>> 8 | t7 << 8) & 8191;
            h9 += t7 >>> 5 | hibit;
            c = 0;
            d0 = c;
            d0 += h0 * r0;
            d0 += h1 * (5 * r9);
            d0 += h2 * (5 * r8);
            d0 += h3 * (5 * r7);
            d0 += h4 * (5 * r6);
            c = d0 >>> 13;
            d0 &= 8191;
            d0 += h5 * (5 * r5);
            d0 += h6 * (5 * r4);
            d0 += h7 * (5 * r3);
            d0 += h8 * (5 * r2);
            d0 += h9 * (5 * r1);
            c += d0 >>> 13;
            d0 &= 8191;
            d1 = c;
            d1 += h0 * r1;
            d1 += h1 * r0;
            d1 += h2 * (5 * r9);
            d1 += h3 * (5 * r8);
            d1 += h4 * (5 * r7);
            c = d1 >>> 13;
            d1 &= 8191;
            d1 += h5 * (5 * r6);
            d1 += h6 * (5 * r5);
            d1 += h7 * (5 * r4);
            d1 += h8 * (5 * r3);
            d1 += h9 * (5 * r2);
            c += d1 >>> 13;
            d1 &= 8191;
            d2 = c;
            d2 += h0 * r2;
            d2 += h1 * r1;
            d2 += h2 * r0;
            d2 += h3 * (5 * r9);
            d2 += h4 * (5 * r8);
            c = d2 >>> 13;
            d2 &= 8191;
            d2 += h5 * (5 * r7);
            d2 += h6 * (5 * r6);
            d2 += h7 * (5 * r5);
            d2 += h8 * (5 * r4);
            d2 += h9 * (5 * r3);
            c += d2 >>> 13;
            d2 &= 8191;
            d3 = c;
            d3 += h0 * r3;
            d3 += h1 * r2;
            d3 += h2 * r1;
            d3 += h3 * r0;
            d3 += h4 * (5 * r9);
            c = d3 >>> 13;
            d3 &= 8191;
            d3 += h5 * (5 * r8);
            d3 += h6 * (5 * r7);
            d3 += h7 * (5 * r6);
            d3 += h8 * (5 * r5);
            d3 += h9 * (5 * r4);
            c += d3 >>> 13;
            d3 &= 8191;
            d4 = c;
            d4 += h0 * r4;
            d4 += h1 * r3;
            d4 += h2 * r2;
            d4 += h3 * r1;
            d4 += h4 * r0;
            c = d4 >>> 13;
            d4 &= 8191;
            d4 += h5 * (5 * r9);
            d4 += h6 * (5 * r8);
            d4 += h7 * (5 * r7);
            d4 += h8 * (5 * r6);
            d4 += h9 * (5 * r5);
            c += d4 >>> 13;
            d4 &= 8191;
            d5 = c;
            d5 += h0 * r5;
            d5 += h1 * r4;
            d5 += h2 * r3;
            d5 += h3 * r2;
            d5 += h4 * r1;
            c = d5 >>> 13;
            d5 &= 8191;
            d5 += h5 * r0;
            d5 += h6 * (5 * r9);
            d5 += h7 * (5 * r8);
            d5 += h8 * (5 * r7);
            d5 += h9 * (5 * r6);
            c += d5 >>> 13;
            d5 &= 8191;
            d6 = c;
            d6 += h0 * r6;
            d6 += h1 * r5;
            d6 += h2 * r4;
            d6 += h3 * r3;
            d6 += h4 * r2;
            c = d6 >>> 13;
            d6 &= 8191;
            d6 += h5 * r1;
            d6 += h6 * r0;
            d6 += h7 * (5 * r9);
            d6 += h8 * (5 * r8);
            d6 += h9 * (5 * r7);
            c += d6 >>> 13;
            d6 &= 8191;
            d7 = c;
            d7 += h0 * r7;
            d7 += h1 * r6;
            d7 += h2 * r5;
            d7 += h3 * r4;
            d7 += h4 * r3;
            c = d7 >>> 13;
            d7 &= 8191;
            d7 += h5 * r2;
            d7 += h6 * r1;
            d7 += h7 * r0;
            d7 += h8 * (5 * r9);
            d7 += h9 * (5 * r8);
            c += d7 >>> 13;
            d7 &= 8191;
            d8 = c;
            d8 += h0 * r8;
            d8 += h1 * r7;
            d8 += h2 * r6;
            d8 += h3 * r5;
            d8 += h4 * r4;
            c = d8 >>> 13;
            d8 &= 8191;
            d8 += h5 * r3;
            d8 += h6 * r2;
            d8 += h7 * r1;
            d8 += h8 * r0;
            d8 += h9 * (5 * r9);
            c += d8 >>> 13;
            d8 &= 8191;
            d9 = c;
            d9 += h0 * r9;
            d9 += h1 * r8;
            d9 += h2 * r7;
            d9 += h3 * r6;
            d9 += h4 * r5;
            c = d9 >>> 13;
            d9 &= 8191;
            d9 += h5 * r4;
            d9 += h6 * r3;
            d9 += h7 * r2;
            d9 += h8 * r1;
            d9 += h9 * r0;
            c += d9 >>> 13;
            d9 &= 8191;
            c = (c << 2) + c | 0;
            c = c + d0 | 0;
            d0 = c & 8191;
            c = c >>> 13;
            d1 += c;
            h0 = d0;
            h1 = d1;
            h2 = d2;
            h3 = d3;
            h4 = d4;
            h5 = d5;
            h6 = d6;
            h7 = d7;
            h8 = d8;
            h9 = d9;
            mpos += 16;
            bytes -= 16;
          }
          this.h[0] = h0;
          this.h[1] = h1;
          this.h[2] = h2;
          this.h[3] = h3;
          this.h[4] = h4;
          this.h[5] = h5;
          this.h[6] = h6;
          this.h[7] = h7;
          this.h[8] = h8;
          this.h[9] = h9;
        };
        poly1305.prototype.finish = function(mac, macpos) {
          var g = new Uint16Array(10);
          var c, mask, f, i;
          if (this.leftover) {
            i = this.leftover;
            this.buffer[i++] = 1;
            for (; i < 16; i++) this.buffer[i] = 0;
            this.fin = 1;
            this.blocks(this.buffer, 0, 16);
          }
          c = this.h[1] >>> 13;
          this.h[1] &= 8191;
          for (i = 2; i < 10; i++) {
            this.h[i] += c;
            c = this.h[i] >>> 13;
            this.h[i] &= 8191;
          }
          this.h[0] += c * 5;
          c = this.h[0] >>> 13;
          this.h[0] &= 8191;
          this.h[1] += c;
          c = this.h[1] >>> 13;
          this.h[1] &= 8191;
          this.h[2] += c;
          g[0] = this.h[0] + 5;
          c = g[0] >>> 13;
          g[0] &= 8191;
          for (i = 1; i < 10; i++) {
            g[i] = this.h[i] + c;
            c = g[i] >>> 13;
            g[i] &= 8191;
          }
          g[9] -= 1 << 13;
          mask = (c ^ 1) - 1;
          for (i = 0; i < 10; i++) g[i] &= mask;
          mask = ~mask;
          for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
          this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
          this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
          this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
          this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
          this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
          this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
          this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
          this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
          f = this.h[0] + this.pad[0];
          this.h[0] = f & 65535;
          for (i = 1; i < 8; i++) {
            f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
            this.h[i] = f & 65535;
          }
          mac[macpos + 0] = this.h[0] >>> 0 & 255;
          mac[macpos + 1] = this.h[0] >>> 8 & 255;
          mac[macpos + 2] = this.h[1] >>> 0 & 255;
          mac[macpos + 3] = this.h[1] >>> 8 & 255;
          mac[macpos + 4] = this.h[2] >>> 0 & 255;
          mac[macpos + 5] = this.h[2] >>> 8 & 255;
          mac[macpos + 6] = this.h[3] >>> 0 & 255;
          mac[macpos + 7] = this.h[3] >>> 8 & 255;
          mac[macpos + 8] = this.h[4] >>> 0 & 255;
          mac[macpos + 9] = this.h[4] >>> 8 & 255;
          mac[macpos + 10] = this.h[5] >>> 0 & 255;
          mac[macpos + 11] = this.h[5] >>> 8 & 255;
          mac[macpos + 12] = this.h[6] >>> 0 & 255;
          mac[macpos + 13] = this.h[6] >>> 8 & 255;
          mac[macpos + 14] = this.h[7] >>> 0 & 255;
          mac[macpos + 15] = this.h[7] >>> 8 & 255;
        };
        poly1305.prototype.update = function(m, mpos, bytes) {
          var i, want;
          if (this.leftover) {
            want = 16 - this.leftover;
            if (want > bytes)
              want = bytes;
            for (i = 0; i < want; i++)
              this.buffer[this.leftover + i] = m[mpos + i];
            bytes -= want;
            mpos += want;
            this.leftover += want;
            if (this.leftover < 16)
              return;
            this.blocks(this.buffer, 0, 16);
            this.leftover = 0;
          }
          if (bytes >= 16) {
            want = bytes - bytes % 16;
            this.blocks(m, mpos, want);
            mpos += want;
            bytes -= want;
          }
          if (bytes) {
            for (i = 0; i < bytes; i++)
              this.buffer[this.leftover + i] = m[mpos + i];
            this.leftover += bytes;
          }
        };
        function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
          var s = new poly1305(k);
          s.update(m, mpos, n);
          s.finish(out, outpos);
          return 0;
        }
        function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
          var x = new Uint8Array(16);
          crypto_onetimeauth(x, 0, m, mpos, n, k);
          return crypto_verify_16(h, hpos, x, 0);
        }
        function crypto_secretbox(c, m, d, n, k) {
          var i;
          if (d < 32) return -1;
          crypto_stream_xor(c, 0, m, 0, d, n, k);
          crypto_onetimeauth(c, 16, c, 32, d - 32, c);
          for (i = 0; i < 16; i++) c[i] = 0;
          return 0;
        }
        function crypto_secretbox_open(m, c, d, n, k) {
          var i;
          var x = new Uint8Array(32);
          if (d < 32) return -1;
          crypto_stream(x, 0, 32, n, k);
          if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
          crypto_stream_xor(m, 0, c, 0, d, n, k);
          for (i = 0; i < 32; i++) m[i] = 0;
          return 0;
        }
        function set25519(r, a) {
          var i;
          for (i = 0; i < 16; i++) r[i] = a[i] | 0;
        }
        function car25519(o) {
          var i, v, c = 1;
          for (i = 0; i < 16; i++) {
            v = o[i] + c + 65535;
            c = Math.floor(v / 65536);
            o[i] = v - c * 65536;
          }
          o[0] += c - 1 + 37 * (c - 1);
        }
        function sel25519(p, q, b) {
          var t, c = ~(b - 1);
          for (var i = 0; i < 16; i++) {
            t = c & (p[i] ^ q[i]);
            p[i] ^= t;
            q[i] ^= t;
          }
        }
        function pack25519(o, n) {
          var i, j, b;
          var m = gf(), t = gf();
          for (i = 0; i < 16; i++) t[i] = n[i];
          car25519(t);
          car25519(t);
          car25519(t);
          for (j = 0; j < 2; j++) {
            m[0] = t[0] - 65517;
            for (i = 1; i < 15; i++) {
              m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
              m[i - 1] &= 65535;
            }
            m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
            b = m[15] >> 16 & 1;
            m[14] &= 65535;
            sel25519(t, m, 1 - b);
          }
          for (i = 0; i < 16; i++) {
            o[2 * i] = t[i] & 255;
            o[2 * i + 1] = t[i] >> 8;
          }
        }
        function neq25519(a, b) {
          var c = new Uint8Array(32), d = new Uint8Array(32);
          pack25519(c, a);
          pack25519(d, b);
          return crypto_verify_32(c, 0, d, 0);
        }
        function par25519(a) {
          var d = new Uint8Array(32);
          pack25519(d, a);
          return d[0] & 1;
        }
        function unpack25519(o, n) {
          var i;
          for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
          o[15] &= 32767;
        }
        function A(o, a, b) {
          for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
        }
        function Z(o, a, b) {
          for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
        }
        function M(o, a, b) {
          var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
          v = a[0];
          t0 += v * b0;
          t1 += v * b1;
          t2 += v * b2;
          t3 += v * b3;
          t4 += v * b4;
          t5 += v * b5;
          t6 += v * b6;
          t7 += v * b7;
          t8 += v * b8;
          t9 += v * b9;
          t10 += v * b10;
          t11 += v * b11;
          t12 += v * b12;
          t13 += v * b13;
          t14 += v * b14;
          t15 += v * b15;
          v = a[1];
          t1 += v * b0;
          t2 += v * b1;
          t3 += v * b2;
          t4 += v * b3;
          t5 += v * b4;
          t6 += v * b5;
          t7 += v * b6;
          t8 += v * b7;
          t9 += v * b8;
          t10 += v * b9;
          t11 += v * b10;
          t12 += v * b11;
          t13 += v * b12;
          t14 += v * b13;
          t15 += v * b14;
          t16 += v * b15;
          v = a[2];
          t2 += v * b0;
          t3 += v * b1;
          t4 += v * b2;
          t5 += v * b3;
          t6 += v * b4;
          t7 += v * b5;
          t8 += v * b6;
          t9 += v * b7;
          t10 += v * b8;
          t11 += v * b9;
          t12 += v * b10;
          t13 += v * b11;
          t14 += v * b12;
          t15 += v * b13;
          t16 += v * b14;
          t17 += v * b15;
          v = a[3];
          t3 += v * b0;
          t4 += v * b1;
          t5 += v * b2;
          t6 += v * b3;
          t7 += v * b4;
          t8 += v * b5;
          t9 += v * b6;
          t10 += v * b7;
          t11 += v * b8;
          t12 += v * b9;
          t13 += v * b10;
          t14 += v * b11;
          t15 += v * b12;
          t16 += v * b13;
          t17 += v * b14;
          t18 += v * b15;
          v = a[4];
          t4 += v * b0;
          t5 += v * b1;
          t6 += v * b2;
          t7 += v * b3;
          t8 += v * b4;
          t9 += v * b5;
          t10 += v * b6;
          t11 += v * b7;
          t12 += v * b8;
          t13 += v * b9;
          t14 += v * b10;
          t15 += v * b11;
          t16 += v * b12;
          t17 += v * b13;
          t18 += v * b14;
          t19 += v * b15;
          v = a[5];
          t5 += v * b0;
          t6 += v * b1;
          t7 += v * b2;
          t8 += v * b3;
          t9 += v * b4;
          t10 += v * b5;
          t11 += v * b6;
          t12 += v * b7;
          t13 += v * b8;
          t14 += v * b9;
          t15 += v * b10;
          t16 += v * b11;
          t17 += v * b12;
          t18 += v * b13;
          t19 += v * b14;
          t20 += v * b15;
          v = a[6];
          t6 += v * b0;
          t7 += v * b1;
          t8 += v * b2;
          t9 += v * b3;
          t10 += v * b4;
          t11 += v * b5;
          t12 += v * b6;
          t13 += v * b7;
          t14 += v * b8;
          t15 += v * b9;
          t16 += v * b10;
          t17 += v * b11;
          t18 += v * b12;
          t19 += v * b13;
          t20 += v * b14;
          t21 += v * b15;
          v = a[7];
          t7 += v * b0;
          t8 += v * b1;
          t9 += v * b2;
          t10 += v * b3;
          t11 += v * b4;
          t12 += v * b5;
          t13 += v * b6;
          t14 += v * b7;
          t15 += v * b8;
          t16 += v * b9;
          t17 += v * b10;
          t18 += v * b11;
          t19 += v * b12;
          t20 += v * b13;
          t21 += v * b14;
          t22 += v * b15;
          v = a[8];
          t8 += v * b0;
          t9 += v * b1;
          t10 += v * b2;
          t11 += v * b3;
          t12 += v * b4;
          t13 += v * b5;
          t14 += v * b6;
          t15 += v * b7;
          t16 += v * b8;
          t17 += v * b9;
          t18 += v * b10;
          t19 += v * b11;
          t20 += v * b12;
          t21 += v * b13;
          t22 += v * b14;
          t23 += v * b15;
          v = a[9];
          t9 += v * b0;
          t10 += v * b1;
          t11 += v * b2;
          t12 += v * b3;
          t13 += v * b4;
          t14 += v * b5;
          t15 += v * b6;
          t16 += v * b7;
          t17 += v * b8;
          t18 += v * b9;
          t19 += v * b10;
          t20 += v * b11;
          t21 += v * b12;
          t22 += v * b13;
          t23 += v * b14;
          t24 += v * b15;
          v = a[10];
          t10 += v * b0;
          t11 += v * b1;
          t12 += v * b2;
          t13 += v * b3;
          t14 += v * b4;
          t15 += v * b5;
          t16 += v * b6;
          t17 += v * b7;
          t18 += v * b8;
          t19 += v * b9;
          t20 += v * b10;
          t21 += v * b11;
          t22 += v * b12;
          t23 += v * b13;
          t24 += v * b14;
          t25 += v * b15;
          v = a[11];
          t11 += v * b0;
          t12 += v * b1;
          t13 += v * b2;
          t14 += v * b3;
          t15 += v * b4;
          t16 += v * b5;
          t17 += v * b6;
          t18 += v * b7;
          t19 += v * b8;
          t20 += v * b9;
          t21 += v * b10;
          t22 += v * b11;
          t23 += v * b12;
          t24 += v * b13;
          t25 += v * b14;
          t26 += v * b15;
          v = a[12];
          t12 += v * b0;
          t13 += v * b1;
          t14 += v * b2;
          t15 += v * b3;
          t16 += v * b4;
          t17 += v * b5;
          t18 += v * b6;
          t19 += v * b7;
          t20 += v * b8;
          t21 += v * b9;
          t22 += v * b10;
          t23 += v * b11;
          t24 += v * b12;
          t25 += v * b13;
          t26 += v * b14;
          t27 += v * b15;
          v = a[13];
          t13 += v * b0;
          t14 += v * b1;
          t15 += v * b2;
          t16 += v * b3;
          t17 += v * b4;
          t18 += v * b5;
          t19 += v * b6;
          t20 += v * b7;
          t21 += v * b8;
          t22 += v * b9;
          t23 += v * b10;
          t24 += v * b11;
          t25 += v * b12;
          t26 += v * b13;
          t27 += v * b14;
          t28 += v * b15;
          v = a[14];
          t14 += v * b0;
          t15 += v * b1;
          t16 += v * b2;
          t17 += v * b3;
          t18 += v * b4;
          t19 += v * b5;
          t20 += v * b6;
          t21 += v * b7;
          t22 += v * b8;
          t23 += v * b9;
          t24 += v * b10;
          t25 += v * b11;
          t26 += v * b12;
          t27 += v * b13;
          t28 += v * b14;
          t29 += v * b15;
          v = a[15];
          t15 += v * b0;
          t16 += v * b1;
          t17 += v * b2;
          t18 += v * b3;
          t19 += v * b4;
          t20 += v * b5;
          t21 += v * b6;
          t22 += v * b7;
          t23 += v * b8;
          t24 += v * b9;
          t25 += v * b10;
          t26 += v * b11;
          t27 += v * b12;
          t28 += v * b13;
          t29 += v * b14;
          t30 += v * b15;
          t0 += 38 * t16;
          t1 += 38 * t17;
          t2 += 38 * t18;
          t3 += 38 * t19;
          t4 += 38 * t20;
          t5 += 38 * t21;
          t6 += 38 * t22;
          t7 += 38 * t23;
          t8 += 38 * t24;
          t9 += 38 * t25;
          t10 += 38 * t26;
          t11 += 38 * t27;
          t12 += 38 * t28;
          t13 += 38 * t29;
          t14 += 38 * t30;
          c = 1;
          v = t0 + c + 65535;
          c = Math.floor(v / 65536);
          t0 = v - c * 65536;
          v = t1 + c + 65535;
          c = Math.floor(v / 65536);
          t1 = v - c * 65536;
          v = t2 + c + 65535;
          c = Math.floor(v / 65536);
          t2 = v - c * 65536;
          v = t3 + c + 65535;
          c = Math.floor(v / 65536);
          t3 = v - c * 65536;
          v = t4 + c + 65535;
          c = Math.floor(v / 65536);
          t4 = v - c * 65536;
          v = t5 + c + 65535;
          c = Math.floor(v / 65536);
          t5 = v - c * 65536;
          v = t6 + c + 65535;
          c = Math.floor(v / 65536);
          t6 = v - c * 65536;
          v = t7 + c + 65535;
          c = Math.floor(v / 65536);
          t7 = v - c * 65536;
          v = t8 + c + 65535;
          c = Math.floor(v / 65536);
          t8 = v - c * 65536;
          v = t9 + c + 65535;
          c = Math.floor(v / 65536);
          t9 = v - c * 65536;
          v = t10 + c + 65535;
          c = Math.floor(v / 65536);
          t10 = v - c * 65536;
          v = t11 + c + 65535;
          c = Math.floor(v / 65536);
          t11 = v - c * 65536;
          v = t12 + c + 65535;
          c = Math.floor(v / 65536);
          t12 = v - c * 65536;
          v = t13 + c + 65535;
          c = Math.floor(v / 65536);
          t13 = v - c * 65536;
          v = t14 + c + 65535;
          c = Math.floor(v / 65536);
          t14 = v - c * 65536;
          v = t15 + c + 65535;
          c = Math.floor(v / 65536);
          t15 = v - c * 65536;
          t0 += c - 1 + 37 * (c - 1);
          c = 1;
          v = t0 + c + 65535;
          c = Math.floor(v / 65536);
          t0 = v - c * 65536;
          v = t1 + c + 65535;
          c = Math.floor(v / 65536);
          t1 = v - c * 65536;
          v = t2 + c + 65535;
          c = Math.floor(v / 65536);
          t2 = v - c * 65536;
          v = t3 + c + 65535;
          c = Math.floor(v / 65536);
          t3 = v - c * 65536;
          v = t4 + c + 65535;
          c = Math.floor(v / 65536);
          t4 = v - c * 65536;
          v = t5 + c + 65535;
          c = Math.floor(v / 65536);
          t5 = v - c * 65536;
          v = t6 + c + 65535;
          c = Math.floor(v / 65536);
          t6 = v - c * 65536;
          v = t7 + c + 65535;
          c = Math.floor(v / 65536);
          t7 = v - c * 65536;
          v = t8 + c + 65535;
          c = Math.floor(v / 65536);
          t8 = v - c * 65536;
          v = t9 + c + 65535;
          c = Math.floor(v / 65536);
          t9 = v - c * 65536;
          v = t10 + c + 65535;
          c = Math.floor(v / 65536);
          t10 = v - c * 65536;
          v = t11 + c + 65535;
          c = Math.floor(v / 65536);
          t11 = v - c * 65536;
          v = t12 + c + 65535;
          c = Math.floor(v / 65536);
          t12 = v - c * 65536;
          v = t13 + c + 65535;
          c = Math.floor(v / 65536);
          t13 = v - c * 65536;
          v = t14 + c + 65535;
          c = Math.floor(v / 65536);
          t14 = v - c * 65536;
          v = t15 + c + 65535;
          c = Math.floor(v / 65536);
          t15 = v - c * 65536;
          t0 += c - 1 + 37 * (c - 1);
          o[0] = t0;
          o[1] = t1;
          o[2] = t2;
          o[3] = t3;
          o[4] = t4;
          o[5] = t5;
          o[6] = t6;
          o[7] = t7;
          o[8] = t8;
          o[9] = t9;
          o[10] = t10;
          o[11] = t11;
          o[12] = t12;
          o[13] = t13;
          o[14] = t14;
          o[15] = t15;
        }
        function S(o, a) {
          M(o, a, a);
        }
        function inv25519(o, i) {
          var c = gf();
          var a;
          for (a = 0; a < 16; a++) c[a] = i[a];
          for (a = 253; a >= 0; a--) {
            S(c, c);
            if (a !== 2 && a !== 4) M(c, c, i);
          }
          for (a = 0; a < 16; a++) o[a] = c[a];
        }
        function pow2523(o, i) {
          var c = gf();
          var a;
          for (a = 0; a < 16; a++) c[a] = i[a];
          for (a = 250; a >= 0; a--) {
            S(c, c);
            if (a !== 1) M(c, c, i);
          }
          for (a = 0; a < 16; a++) o[a] = c[a];
        }
        function crypto_scalarmult(q, n, p) {
          var z = new Uint8Array(32);
          var x = new Float64Array(80), r, i;
          var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
          for (i = 0; i < 31; i++) z[i] = n[i];
          z[31] = n[31] & 127 | 64;
          z[0] &= 248;
          unpack25519(x, p);
          for (i = 0; i < 16; i++) {
            b[i] = x[i];
            d[i] = a[i] = c[i] = 0;
          }
          a[0] = d[0] = 1;
          for (i = 254; i >= 0; --i) {
            r = z[i >>> 3] >>> (i & 7) & 1;
            sel25519(a, b, r);
            sel25519(c, d, r);
            A(e, a, c);
            Z(a, a, c);
            A(c, b, d);
            Z(b, b, d);
            S(d, e);
            S(f, a);
            M(a, c, a);
            M(c, b, e);
            A(e, a, c);
            Z(a, a, c);
            S(b, a);
            Z(c, d, f);
            M(a, c, _121665);
            A(a, a, d);
            M(c, c, a);
            M(a, d, f);
            M(d, b, x);
            S(b, e);
            sel25519(a, b, r);
            sel25519(c, d, r);
          }
          for (i = 0; i < 16; i++) {
            x[i + 16] = a[i];
            x[i + 32] = c[i];
            x[i + 48] = b[i];
            x[i + 64] = d[i];
          }
          var x32 = x.subarray(32);
          var x16 = x.subarray(16);
          inv25519(x32, x32);
          M(x16, x16, x32);
          pack25519(q, x16);
          return 0;
        }
        function crypto_scalarmult_base(q, n) {
          return crypto_scalarmult(q, n, _9);
        }
        function crypto_box_keypair(y, x) {
          randombytes(x, 32);
          return crypto_scalarmult_base(y, x);
        }
        function crypto_box_beforenm(k, y, x) {
          var s = new Uint8Array(32);
          crypto_scalarmult(s, x, y);
          return crypto_core_hsalsa20(k, _0, s, sigma);
        }
        var crypto_box_afternm = crypto_secretbox;
        var crypto_box_open_afternm = crypto_secretbox_open;
        function crypto_box(c, m, d, n, y, x) {
          var k = new Uint8Array(32);
          crypto_box_beforenm(k, y, x);
          return crypto_box_afternm(c, m, d, n, k);
        }
        function crypto_box_open(m, c, d, n, y, x) {
          var k = new Uint8Array(32);
          crypto_box_beforenm(k, y, x);
          return crypto_box_open_afternm(m, c, d, n, k);
        }
        var K = [
          1116352408,
          3609767458,
          1899447441,
          602891725,
          3049323471,
          3964484399,
          3921009573,
          2173295548,
          961987163,
          4081628472,
          1508970993,
          3053834265,
          2453635748,
          2937671579,
          2870763221,
          3664609560,
          3624381080,
          2734883394,
          310598401,
          1164996542,
          607225278,
          1323610764,
          1426881987,
          3590304994,
          1925078388,
          4068182383,
          2162078206,
          991336113,
          2614888103,
          633803317,
          3248222580,
          3479774868,
          3835390401,
          2666613458,
          4022224774,
          944711139,
          264347078,
          2341262773,
          604807628,
          2007800933,
          770255983,
          1495990901,
          1249150122,
          1856431235,
          1555081692,
          3175218132,
          1996064986,
          2198950837,
          2554220882,
          3999719339,
          2821834349,
          766784016,
          2952996808,
          2566594879,
          3210313671,
          3203337956,
          3336571891,
          1034457026,
          3584528711,
          2466948901,
          113926993,
          3758326383,
          338241895,
          168717936,
          666307205,
          1188179964,
          773529912,
          1546045734,
          1294757372,
          1522805485,
          1396182291,
          2643833823,
          1695183700,
          2343527390,
          1986661051,
          1014477480,
          2177026350,
          1206759142,
          2456956037,
          344077627,
          2730485921,
          1290863460,
          2820302411,
          3158454273,
          3259730800,
          3505952657,
          3345764771,
          106217008,
          3516065817,
          3606008344,
          3600352804,
          1432725776,
          4094571909,
          1467031594,
          275423344,
          851169720,
          430227734,
          3100823752,
          506948616,
          1363258195,
          659060556,
          3750685593,
          883997877,
          3785050280,
          958139571,
          3318307427,
          1322822218,
          3812723403,
          1537002063,
          2003034995,
          1747873779,
          3602036899,
          1955562222,
          1575990012,
          2024104815,
          1125592928,
          2227730452,
          2716904306,
          2361852424,
          442776044,
          2428436474,
          593698344,
          2756734187,
          3733110249,
          3204031479,
          2999351573,
          3329325298,
          3815920427,
          3391569614,
          3928383900,
          3515267271,
          566280711,
          3940187606,
          3454069534,
          4118630271,
          4000239992,
          116418474,
          1914138554,
          174292421,
          2731055270,
          289380356,
          3203993006,
          460393269,
          320620315,
          685471733,
          587496836,
          852142971,
          1086792851,
          1017036298,
          365543100,
          1126000580,
          2618297676,
          1288033470,
          3409855158,
          1501505948,
          4234509866,
          1607167915,
          987167468,
          1816402316,
          1246189591
        ];
        function crypto_hashblocks_hl(hh, hl, m, n) {
          var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
          var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
          var pos = 0;
          while (n >= 128) {
            for (i = 0; i < 16; i++) {
              j = 8 * i + pos;
              wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
              wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
            }
            for (i = 0; i < 80; i++) {
              bh0 = ah0;
              bh1 = ah1;
              bh2 = ah2;
              bh3 = ah3;
              bh4 = ah4;
              bh5 = ah5;
              bh6 = ah6;
              bh7 = ah7;
              bl0 = al0;
              bl1 = al1;
              bl2 = al2;
              bl3 = al3;
              bl4 = al4;
              bl5 = al5;
              bl6 = al6;
              bl7 = al7;
              h = ah7;
              l = al7;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
              l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = ah4 & ah5 ^ ~ah4 & ah6;
              l = al4 & al5 ^ ~al4 & al6;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = K[i * 2];
              l = K[i * 2 + 1];
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = wh[i % 16];
              l = wl[i % 16];
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              th = c & 65535 | d << 16;
              tl = a & 65535 | b << 16;
              h = th;
              l = tl;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
              l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
              l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              bh7 = c & 65535 | d << 16;
              bl7 = a & 65535 | b << 16;
              h = bh3;
              l = bl3;
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = th;
              l = tl;
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              bh3 = c & 65535 | d << 16;
              bl3 = a & 65535 | b << 16;
              ah1 = bh0;
              ah2 = bh1;
              ah3 = bh2;
              ah4 = bh3;
              ah5 = bh4;
              ah6 = bh5;
              ah7 = bh6;
              ah0 = bh7;
              al1 = bl0;
              al2 = bl1;
              al3 = bl2;
              al4 = bl3;
              al5 = bl4;
              al6 = bl5;
              al7 = bl6;
              al0 = bl7;
              if (i % 16 === 15) {
                for (j = 0; j < 16; j++) {
                  h = wh[j];
                  l = wl[j];
                  a = l & 65535;
                  b = l >>> 16;
                  c = h & 65535;
                  d = h >>> 16;
                  h = wh[(j + 9) % 16];
                  l = wl[(j + 9) % 16];
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  th = wh[(j + 1) % 16];
                  tl = wl[(j + 1) % 16];
                  h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                  l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  th = wh[(j + 14) % 16];
                  tl = wl[(j + 14) % 16];
                  h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                  l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                  a += l & 65535;
                  b += l >>> 16;
                  c += h & 65535;
                  d += h >>> 16;
                  b += a >>> 16;
                  c += b >>> 16;
                  d += c >>> 16;
                  wh[j] = c & 65535 | d << 16;
                  wl[j] = a & 65535 | b << 16;
                }
              }
            }
            h = ah0;
            l = al0;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[0];
            l = hl[0];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[0] = ah0 = c & 65535 | d << 16;
            hl[0] = al0 = a & 65535 | b << 16;
            h = ah1;
            l = al1;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[1];
            l = hl[1];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[1] = ah1 = c & 65535 | d << 16;
            hl[1] = al1 = a & 65535 | b << 16;
            h = ah2;
            l = al2;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[2];
            l = hl[2];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[2] = ah2 = c & 65535 | d << 16;
            hl[2] = al2 = a & 65535 | b << 16;
            h = ah3;
            l = al3;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[3];
            l = hl[3];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[3] = ah3 = c & 65535 | d << 16;
            hl[3] = al3 = a & 65535 | b << 16;
            h = ah4;
            l = al4;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[4];
            l = hl[4];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[4] = ah4 = c & 65535 | d << 16;
            hl[4] = al4 = a & 65535 | b << 16;
            h = ah5;
            l = al5;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[5];
            l = hl[5];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[5] = ah5 = c & 65535 | d << 16;
            hl[5] = al5 = a & 65535 | b << 16;
            h = ah6;
            l = al6;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[6];
            l = hl[6];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[6] = ah6 = c & 65535 | d << 16;
            hl[6] = al6 = a & 65535 | b << 16;
            h = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = hh[7];
            l = hl[7];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[7] = ah7 = c & 65535 | d << 16;
            hl[7] = al7 = a & 65535 | b << 16;
            pos += 128;
            n -= 128;
          }
          return n;
        }
        function crypto_hash(out, m, n) {
          var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
          hh[0] = 1779033703;
          hh[1] = 3144134277;
          hh[2] = 1013904242;
          hh[3] = 2773480762;
          hh[4] = 1359893119;
          hh[5] = 2600822924;
          hh[6] = 528734635;
          hh[7] = 1541459225;
          hl[0] = 4089235720;
          hl[1] = 2227873595;
          hl[2] = 4271175723;
          hl[3] = 1595750129;
          hl[4] = 2917565137;
          hl[5] = 725511199;
          hl[6] = 4215389547;
          hl[7] = 327033209;
          crypto_hashblocks_hl(hh, hl, m, n);
          n %= 128;
          for (i = 0; i < n; i++) x[i] = m[b - n + i];
          x[n] = 128;
          n = 256 - 128 * (n < 112 ? 1 : 0);
          x[n - 9] = 0;
          ts64(x, n - 8, b / 536870912 | 0, b << 3);
          crypto_hashblocks_hl(hh, hl, x, n);
          for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
          return 0;
        }
        function add(p, q) {
          var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
          Z(a, p[1], p[0]);
          Z(t, q[1], q[0]);
          M(a, a, t);
          A(b, p[0], p[1]);
          A(t, q[0], q[1]);
          M(b, b, t);
          M(c, p[3], q[3]);
          M(c, c, D2);
          M(d, p[2], q[2]);
          A(d, d, d);
          Z(e, b, a);
          Z(f, d, c);
          A(g, d, c);
          A(h, b, a);
          M(p[0], e, f);
          M(p[1], h, g);
          M(p[2], g, f);
          M(p[3], e, h);
        }
        function cswap(p, q, b) {
          var i;
          for (i = 0; i < 4; i++) {
            sel25519(p[i], q[i], b);
          }
        }
        function pack(r, p) {
          var tx = gf(), ty = gf(), zi = gf();
          inv25519(zi, p[2]);
          M(tx, p[0], zi);
          M(ty, p[1], zi);
          pack25519(r, ty);
          r[31] ^= par25519(tx) << 7;
        }
        function scalarmult(p, q, s) {
          var b, i;
          set25519(p[0], gf0);
          set25519(p[1], gf1);
          set25519(p[2], gf1);
          set25519(p[3], gf0);
          for (i = 255; i >= 0; --i) {
            b = s[i / 8 | 0] >> (i & 7) & 1;
            cswap(p, q, b);
            add(q, p);
            add(p, p);
            cswap(p, q, b);
          }
        }
        function scalarbase(p, s) {
          var q = [gf(), gf(), gf(), gf()];
          set25519(q[0], X);
          set25519(q[1], Y);
          set25519(q[2], gf1);
          M(q[3], X, Y);
          scalarmult(p, q, s);
        }
        function crypto_sign_keypair(pk, sk, seeded) {
          var d = new Uint8Array(64);
          var p = [gf(), gf(), gf(), gf()];
          var i;
          if (!seeded) randombytes(sk, 32);
          crypto_hash(d, sk, 32);
          d[0] &= 248;
          d[31] &= 127;
          d[31] |= 64;
          scalarbase(p, d);
          pack(pk, p);
          for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
          return 0;
        }
        var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
        function modL(r, x) {
          var carry, i, j, k;
          for (i = 63; i >= 32; --i) {
            carry = 0;
            for (j = i - 32, k = i - 12; j < k; ++j) {
              x[j] += carry - 16 * x[i] * L[j - (i - 32)];
              carry = Math.floor((x[j] + 128) / 256);
              x[j] -= carry * 256;
            }
            x[j] += carry;
            x[i] = 0;
          }
          carry = 0;
          for (j = 0; j < 32; j++) {
            x[j] += carry - (x[31] >> 4) * L[j];
            carry = x[j] >> 8;
            x[j] &= 255;
          }
          for (j = 0; j < 32; j++) x[j] -= carry * L[j];
          for (i = 0; i < 32; i++) {
            x[i + 1] += x[i] >> 8;
            r[i] = x[i] & 255;
          }
        }
        function reduce(r) {
          var x = new Float64Array(64), i;
          for (i = 0; i < 64; i++) x[i] = r[i];
          for (i = 0; i < 64; i++) r[i] = 0;
          modL(r, x);
        }
        function crypto_sign(sm, m, n, sk) {
          var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
          var i, j, x = new Float64Array(64);
          var p = [gf(), gf(), gf(), gf()];
          crypto_hash(d, sk, 32);
          d[0] &= 248;
          d[31] &= 127;
          d[31] |= 64;
          var smlen = n + 64;
          for (i = 0; i < n; i++) sm[64 + i] = m[i];
          for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
          crypto_hash(r, sm.subarray(32), n + 32);
          reduce(r);
          scalarbase(p, r);
          pack(sm, p);
          for (i = 32; i < 64; i++) sm[i] = sk[i];
          crypto_hash(h, sm, n + 64);
          reduce(h);
          for (i = 0; i < 64; i++) x[i] = 0;
          for (i = 0; i < 32; i++) x[i] = r[i];
          for (i = 0; i < 32; i++) {
            for (j = 0; j < 32; j++) {
              x[i + j] += h[i] * d[j];
            }
          }
          modL(sm.subarray(32), x);
          return smlen;
        }
        function unpackneg(r, p) {
          var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
          set25519(r[2], gf1);
          unpack25519(r[1], p);
          S(num, r[1]);
          M(den, num, D);
          Z(num, num, r[2]);
          A(den, r[2], den);
          S(den2, den);
          S(den4, den2);
          M(den6, den4, den2);
          M(t, den6, num);
          M(t, t, den);
          pow2523(t, t);
          M(t, t, num);
          M(t, t, den);
          M(t, t, den);
          M(r[0], t, den);
          S(chk, r[0]);
          M(chk, chk, den);
          if (neq25519(chk, num)) M(r[0], r[0], I);
          S(chk, r[0]);
          M(chk, chk, den);
          if (neq25519(chk, num)) return -1;
          if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
          M(r[3], r[0], r[1]);
          return 0;
        }
        function crypto_sign_open(m, sm, n, pk) {
          var i;
          var t = new Uint8Array(32), h = new Uint8Array(64);
          var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
          if (n < 64) return -1;
          if (unpackneg(q, pk)) return -1;
          for (i = 0; i < n; i++) m[i] = sm[i];
          for (i = 0; i < 32; i++) m[i + 32] = pk[i];
          crypto_hash(h, m, n);
          reduce(h);
          scalarmult(p, q, h);
          scalarbase(q, sm.subarray(32));
          add(p, q);
          pack(t, p);
          n -= 64;
          if (crypto_verify_32(sm, 0, t, 0)) {
            for (i = 0; i < n; i++) m[i] = 0;
            return -1;
          }
          for (i = 0; i < n; i++) m[i] = sm[i + 64];
          return n;
        }
        var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
        nacl.lowlevel = {
          crypto_core_hsalsa20,
          crypto_stream_xor,
          crypto_stream,
          crypto_stream_salsa20_xor,
          crypto_stream_salsa20,
          crypto_onetimeauth,
          crypto_onetimeauth_verify,
          crypto_verify_16,
          crypto_verify_32,
          crypto_secretbox,
          crypto_secretbox_open,
          crypto_scalarmult,
          crypto_scalarmult_base,
          crypto_box_beforenm,
          crypto_box_afternm,
          crypto_box,
          crypto_box_open,
          crypto_box_keypair,
          crypto_hash,
          crypto_sign,
          crypto_sign_keypair,
          crypto_sign_open,
          crypto_secretbox_KEYBYTES,
          crypto_secretbox_NONCEBYTES,
          crypto_secretbox_ZEROBYTES,
          crypto_secretbox_BOXZEROBYTES,
          crypto_scalarmult_BYTES,
          crypto_scalarmult_SCALARBYTES,
          crypto_box_PUBLICKEYBYTES,
          crypto_box_SECRETKEYBYTES,
          crypto_box_BEFORENMBYTES,
          crypto_box_NONCEBYTES,
          crypto_box_ZEROBYTES,
          crypto_box_BOXZEROBYTES,
          crypto_sign_BYTES,
          crypto_sign_PUBLICKEYBYTES,
          crypto_sign_SECRETKEYBYTES,
          crypto_sign_SEEDBYTES,
          crypto_hash_BYTES,
          gf,
          D,
          L,
          pack25519,
          unpack25519,
          M,
          A,
          S,
          Z,
          pow2523,
          add,
          set25519,
          modL,
          scalarmult,
          scalarbase
        };
        function checkLengths(k, n) {
          if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
          if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
        }
        function checkBoxLengths(pk, sk) {
          if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
          if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
        }
        function checkArrayTypes() {
          for (var i = 0; i < arguments.length; i++) {
            if (!(arguments[i] instanceof Uint8Array))
              throw new TypeError("unexpected type, use Uint8Array");
          }
        }
        function cleanup(arr) {
          for (var i = 0; i < arr.length; i++) arr[i] = 0;
        }
        nacl.randomBytes = function(n) {
          var b = new Uint8Array(n);
          randombytes(b, n);
          return b;
        };
        nacl.secretbox = function(msg, nonce, key) {
          checkArrayTypes(msg, nonce, key);
          checkLengths(key, nonce);
          var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
          var c = new Uint8Array(m.length);
          for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
          crypto_secretbox(c, m, m.length, nonce, key);
          return c.subarray(crypto_secretbox_BOXZEROBYTES);
        };
        nacl.secretbox.open = function(box, nonce, key) {
          checkArrayTypes(box, nonce, key);
          checkLengths(key, nonce);
          var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
          var m = new Uint8Array(c.length);
          for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
          if (c.length < 32) return null;
          if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
          return m.subarray(crypto_secretbox_ZEROBYTES);
        };
        nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
        nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
        nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
        nacl.scalarMult = function(n, p) {
          checkArrayTypes(n, p);
          if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
          if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
          var q = new Uint8Array(crypto_scalarmult_BYTES);
          crypto_scalarmult(q, n, p);
          return q;
        };
        nacl.scalarMult.base = function(n) {
          checkArrayTypes(n);
          if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
          var q = new Uint8Array(crypto_scalarmult_BYTES);
          crypto_scalarmult_base(q, n);
          return q;
        };
        nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
        nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
        nacl.box = function(msg, nonce, publicKey, secretKey) {
          var k = nacl.box.before(publicKey, secretKey);
          return nacl.secretbox(msg, nonce, k);
        };
        nacl.box.before = function(publicKey, secretKey) {
          checkArrayTypes(publicKey, secretKey);
          checkBoxLengths(publicKey, secretKey);
          var k = new Uint8Array(crypto_box_BEFORENMBYTES);
          crypto_box_beforenm(k, publicKey, secretKey);
          return k;
        };
        nacl.box.after = nacl.secretbox;
        nacl.box.open = function(msg, nonce, publicKey, secretKey) {
          var k = nacl.box.before(publicKey, secretKey);
          return nacl.secretbox.open(msg, nonce, k);
        };
        nacl.box.open.after = nacl.secretbox.open;
        nacl.box.keyPair = function() {
          var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
          crypto_box_keypair(pk, sk);
          return { publicKey: pk, secretKey: sk };
        };
        nacl.box.keyPair.fromSecretKey = function(secretKey) {
          checkArrayTypes(secretKey);
          if (secretKey.length !== crypto_box_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
          crypto_scalarmult_base(pk, secretKey);
          return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
        };
        nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
        nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
        nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
        nacl.box.nonceLength = crypto_box_NONCEBYTES;
        nacl.box.overheadLength = nacl.secretbox.overheadLength;
        nacl.sign = function(msg, secretKey) {
          checkArrayTypes(msg, secretKey);
          if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
          crypto_sign(signedMsg, msg, msg.length, secretKey);
          return signedMsg;
        };
        nacl.sign.open = function(signedMsg, publicKey) {
          checkArrayTypes(signedMsg, publicKey);
          if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
            throw new Error("bad public key size");
          var tmp = new Uint8Array(signedMsg.length);
          var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
          if (mlen < 0) return null;
          var m = new Uint8Array(mlen);
          for (var i = 0; i < m.length; i++) m[i] = tmp[i];
          return m;
        };
        nacl.sign.detached = function(msg, secretKey) {
          var signedMsg = nacl.sign(msg, secretKey);
          var sig = new Uint8Array(crypto_sign_BYTES);
          for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
          return sig;
        };
        nacl.sign.detached.verify = function(msg, sig, publicKey) {
          checkArrayTypes(msg, sig, publicKey);
          if (sig.length !== crypto_sign_BYTES)
            throw new Error("bad signature size");
          if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
            throw new Error("bad public key size");
          var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
          var m = new Uint8Array(crypto_sign_BYTES + msg.length);
          var i;
          for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
          for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
          return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
        };
        nacl.sign.keyPair = function() {
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
          crypto_sign_keypair(pk, sk);
          return { publicKey: pk, secretKey: sk };
        };
        nacl.sign.keyPair.fromSecretKey = function(secretKey) {
          checkArrayTypes(secretKey);
          if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
            throw new Error("bad secret key size");
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
          return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
        };
        nacl.sign.keyPair.fromSeed = function(seed) {
          checkArrayTypes(seed);
          if (seed.length !== crypto_sign_SEEDBYTES)
            throw new Error("bad seed size");
          var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
          var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
          for (var i = 0; i < 32; i++) sk[i] = seed[i];
          crypto_sign_keypair(pk, sk, true);
          return { publicKey: pk, secretKey: sk };
        };
        nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
        nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
        nacl.sign.seedLength = crypto_sign_SEEDBYTES;
        nacl.sign.signatureLength = crypto_sign_BYTES;
        nacl.hash = function(msg) {
          checkArrayTypes(msg);
          var h = new Uint8Array(crypto_hash_BYTES);
          crypto_hash(h, msg, msg.length);
          return h;
        };
        nacl.hash.hashLength = crypto_hash_BYTES;
        nacl.verify = function(x, y) {
          checkArrayTypes(x, y);
          if (x.length === 0 || y.length === 0) return false;
          if (x.length !== y.length) return false;
          return vn(x, 0, y, 0, x.length) === 0 ? true : false;
        };
        nacl.setPRNG = function(fn) {
          randombytes = fn;
        };
        (function() {
          var crypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
          if (crypto && crypto.getRandomValues) {
            var QUOTA = 65536;
            nacl.setPRNG(function(x, n) {
              var i, v = new Uint8Array(n);
              for (i = 0; i < n; i += QUOTA) {
                crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
              }
              for (i = 0; i < n; i++) x[i] = v[i];
              cleanup(v);
            });
          }
        })();
      })(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
    }
  });

  // src/codec.js
  var require_codec = __commonJS({
    "src/codec.js"(exports, module) {
      "use strict";
      var nacl = require_tweetnacl();
      var KDF_NAMESPACE = "dsh-rc/v1";
      var NONCE_NAMESPACE = "dsh-rc/v1/nonce";
      var WRAP_LABEL = "dsh-rc/psk-wrap";
      var SAS_LABEL = "dsh-rc/sas";
      var UNIT_SEPARATOR = 31;
      var KEY_BYTES = 32;
      var NONCE_BYTES = 24;
      var PSK_BYTES = 16;
      var NONCE_PREFIX_BYTES = NONCE_BYTES - 8;
      var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var B64_INDEX = (() => {
        const table = /* @__PURE__ */ Object.create(null);
        for (let i = 0; i < B64.length; i += 1) table[B64.charAt(i)] = i;
        return table;
      })();
      function utf8(text) {
        if (typeof text !== "string") text = String(text);
        const out = [];
        for (let i = 0; i < text.length; i += 1) {
          let code = text.charCodeAt(i);
          if (code >= 55296 && code <= 56319 && i + 1 < text.length) {
            const next = text.charCodeAt(i + 1);
            if (next >= 56320 && next <= 57343) {
              code = 65536 + (code - 55296 << 10) + (next - 56320);
              i += 1;
            }
          }
          if (code < 128) out.push(code);
          else if (code < 2048) out.push(192 | code >> 6, 128 | code & 63);
          else if (code < 65536) out.push(224 | code >> 12, 128 | code >> 6 & 63, 128 | code & 63);
          else {
            out.push(
              240 | code >> 18,
              128 | code >> 12 & 63,
              128 | code >> 6 & 63,
              128 | code & 63
            );
          }
        }
        return new Uint8Array(out);
      }
      function fromUtf8(bytes) {
        let out = "";
        let i = 0;
        while (i < bytes.length) {
          const b = bytes[i++];
          let code;
          if (b < 128) code = b;
          else if (b >= 194 && b <= 223) code = (b & 31) << 6 | bytes[i++] & 63;
          else if (b >= 224 && b <= 239) {
            code = (b & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
          } else if (b >= 240 && b <= 244) {
            code = (b & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
          } else code = 65533;
          if (code > 65535) {
            code -= 65536;
            out += String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
          } else out += String.fromCharCode(code);
        }
        return out;
      }
      function toBase64(bytes) {
        let out = "";
        let i = 0;
        while (i < bytes.length) {
          const a = bytes[i++];
          const hasB = i < bytes.length;
          const b = hasB ? bytes[i++] : 0;
          const hasC = i < bytes.length;
          const c = hasC ? bytes[i++] : 0;
          const n = a << 16 | b << 8 | c;
          out += B64.charAt(n >> 18 & 63);
          out += B64.charAt(n >> 12 & 63);
          out += hasB ? B64.charAt(n >> 6 & 63) : "=";
          out += hasC ? B64.charAt(n & 63) : "=";
        }
        return out;
      }
      function fromBase64(text) {
        if (typeof text !== "string") return new Uint8Array(0);
        const clean = text.replace(/[^A-Za-z0-9+/=]/g, "");
        const out = [];
        let i = 0;
        while (i < clean.length) {
          const c1 = clean.charAt(i++);
          const c2 = clean.charAt(i++);
          const c3 = clean.charAt(i++);
          const c4 = clean.charAt(i++);
          const n1 = B64_INDEX[c1];
          const n2 = B64_INDEX[c2];
          if (n1 === void 0 || n2 === void 0) break;
          const n3 = c3 === "=" || c3 === "" ? 0 : B64_INDEX[c3];
          const n4 = c4 === "=" || c4 === "" ? 0 : B64_INDEX[c4];
          if (n3 === void 0 || n4 === void 0) break;
          const n = n1 << 18 | n2 << 12 | n3 << 6 | n4;
          out.push(n >> 16 & 255);
          if (c3 !== "=" && c3 !== "") out.push(n >> 8 & 255);
          if (c4 !== "=" && c4 !== "") out.push(n & 255);
        }
        return new Uint8Array(out);
      }
      function concat(parts) {
        let total = 0;
        for (const part of parts) total += part.length;
        const out = new Uint8Array(total);
        let at = 0;
        for (const part of parts) {
          out.set(part, at);
          at += part.length;
        }
        return out;
      }
      function kdfHash(parts) {
        const encoded = parts.map((p) => typeof p === "string" ? utf8(p) : p);
        let total = 0;
        for (const bytes of encoded) total += bytes.length + 1;
        const joined = new Uint8Array(total);
        let at = 0;
        for (const bytes of encoded) {
          joined.set(bytes, at);
          at += bytes.length;
          joined[at++] = UNIT_SEPARATOR;
        }
        return nacl.hash(joined).slice(0, KEY_BYTES);
      }
      function pskBytes(pskBase64) {
        const bytes = fromBase64(pskBase64);
        if (bytes.length !== PSK_BYTES) {
          throw new Error(`PSK must decode to ${PSK_BYTES} bytes, got ${bytes.length}`);
        }
        return bytes;
      }
      function deriveKey(pskBase64, direction, conversationId) {
        if (direction !== "c2h" && direction !== "h2c") throw new Error("bad direction");
        if (!conversationId) throw new Error("conversationId required");
        return kdfHash([KDF_NAMESPACE, direction, conversationId, pskBytes(pskBase64)]);
      }
      function noncePrefix(pskBase64, conversationId, installId) {
        if (!installId) throw new Error("installId required");
        return kdfHash([NONCE_NAMESPACE, installId, conversationId, pskBytes(pskBase64)]).slice(
          0,
          NONCE_PREFIX_BYTES
        );
      }
      function counterNonce(prefix, counter) {
        if (!prefix || prefix.length !== NONCE_PREFIX_BYTES) throw new Error("bad nonce prefix");
        if (!Number.isInteger(counter) || counter < 0 || counter > Number.MAX_SAFE_INTEGER) {
          throw new Error("bad nonce counter");
        }
        const high = Math.floor(counter / 4294967296);
        const low = counter >>> 0;
        const out = new Uint8Array(NONCE_BYTES);
        out.set(prefix, 0);
        out[16] = high >>> 24 & 255;
        out[17] = high >>> 16 & 255;
        out[18] = high >>> 8 & 255;
        out[19] = high & 255;
        out[20] = low >>> 24 & 255;
        out[21] = low >>> 16 & 255;
        out[22] = low >>> 8 & 255;
        out[23] = low & 255;
        return out;
      }
      function seal(key, payload, nonce) {
        if (!key || key.length !== KEY_BYTES) throw new Error("key must be 32 bytes");
        if (!nonce || nonce.length !== NONCE_BYTES) throw new Error("nonce must be 24 bytes");
        const text = JSON.stringify(payload);
        if (text === void 0) throw new Error("payload is not JSON serializable");
        const box = nacl.secretbox(utf8(text), nonce, key);
        return { ciphertext: toBase64(concat([nonce, box])) };
      }
      function open(key, record) {
        try {
          if (!record || typeof record.ciphertext !== "string") return null;
          const merged = fromBase64(record.ciphertext);
          if (merged.length < NONCE_BYTES + 16) return null;
          const box = nacl.secretbox.open(merged.subarray(NONCE_BYTES), merged.subarray(0, NONCE_BYTES), key);
          if (!box) return null;
          return JSON.parse(fromUtf8(box));
        } catch {
          return null;
        }
      }
      function wrapKey(shared) {
        return nacl.hash(concat([shared, utf8(WRAP_LABEL)])).slice(0, KEY_BYTES);
      }
      function unwrapPsk(shared, nonceBase64, wrappedBase64) {
        try {
          const key = wrapKey(shared);
          const nonce = fromBase64(nonceBase64);
          const wrapped = fromBase64(wrappedBase64);
          if (nonce.length !== NONCE_BYTES || wrapped.length === 0) return null;
          const psk = nacl.secretbox.open(wrapped, nonce, key);
          if (!psk || psk.length !== PSK_BYTES) return null;
          return toBase64(psk);
        } catch {
          return null;
        }
      }
      function sasCode(shared) {
        const bytes = nacl.hash(concat([shared, utf8(SAS_LABEL)])).slice(0, 4);
        const view = new DataView(bytes.buffer, bytes.byteOffset, 4);
        return String(view.getUint32(0) % 1e6).padStart(6, "0");
      }
      function randomBytes(length) {
        const size = Number(length) | 0;
        if (size <= 0) throw new Error("length must be positive");
        const out = new Uint8Array(size);
        const webcrypto = typeof globalThis !== "undefined" ? globalThis.crypto : void 0;
        if (!webcrypto || typeof webcrypto.getRandomValues !== "function") {
          throw new Error("secure random source unavailable");
        }
        for (let i = 0; i < size; i += 65536) {
          webcrypto.getRandomValues(out.subarray(i, Math.min(size, i + 65536)));
        }
        return out;
      }
      function keyPairFromSecret(secret) {
        if (!secret || secret.length !== 32) throw new Error("secret must be 32 bytes");
        const pair = nacl.box.keyPair.fromSecretKey(secret);
        return { publicKey: pair.publicKey, secretKey: pair.secretKey };
      }
      function newKeyPair() {
        return nacl.box.keyPair.fromSecretKey(randomBytes(32));
      }
      function sharedKey(secretKey, peerPublicKey) {
        if (!secretKey || secretKey.length !== nacl.box.secretKeyLength) throw new Error("bad secret key");
        if (!peerPublicKey || peerPublicKey.length !== nacl.box.publicKeyLength) throw new Error("bad public key");
        return nacl.box.before(peerPublicKey, secretKey);
      }
      function randomId(prefix, byteLength) {
        const bytes = randomBytes(byteLength || 8);
        let out = prefix || "";
        for (let i = 0; i < bytes.length; i += 1) out += bytes[i].toString(16).padStart(2, "0");
        return out;
      }
      function estimateWireBytes(payload) {
        const text = JSON.stringify(payload);
        const raw = utf8(text).length;
        const envelope = 160;
        return Math.ceil((raw + 16) * 4 / 3) + envelope;
      }
      module.exports = {
        KDF_NAMESPACE,
        NONCE_NAMESPACE,
        KEY_BYTES,
        NONCE_BYTES,
        PSK_BYTES,
        NONCE_PREFIX_BYTES,
        utf8,
        fromUtf8,
        toBase64,
        fromBase64,
        concat,
        kdfHash,
        pskBytes,
        deriveKey,
        noncePrefix,
        counterNonce,
        seal,
        open,
        wrapKey,
        unwrapPsk,
        sasCode,
        randomBytes,
        keyPairFromSecret,
        newKeyPair,
        sharedKey,
        randomId,
        estimateWireBytes
      };
    }
  });

  // src/hosts.js
  var require_hosts = __commonJS({
    "src/hosts.js"(exports, module) {
      "use strict";
      var MODES = ["relay", "lan"];
      var DEFAULT_LAN_PORT = 8787;
      function createHost(id, label) {
        return {
          id: String(id || ""),
          label: label || "host",
          endpoints: { relay: null, lan: null },
          activeMode: "",
          createdAt: 0
        };
      }
      function isWsUrl(url) {
        return /^wss?:\/\/[^\s]+$/i.test(String(url || ""));
      }
      function normalizeRelayUrl(input) {
        let text = String(input || "").trim();
        if (!text) throw new Error("empty url");
        if (/^https?:\/\//i.test(text)) text = text.replace(/^http/i, "ws");
        if (!/^[a-z]+:\/\//i.test(text)) text = `wss://${text}`;
        if (!isWsUrl(text)) throw new Error(`bad url: ${text}`);
        return text.replace(/\/+$/, "");
      }
      function normalizeLanUrl(input, port) {
        let text = String(input || "").trim();
        if (!text) throw new Error("empty address");
        if (/^https?:\/\//i.test(text)) text = text.replace(/^http/i, "ws");
        if (!/^[a-z]+:\/\//i.test(text)) {
          const defaultPort = port || DEFAULT_LAN_PORT;
          if (/^[^:/]+$/.test(text)) text = `ws://${text}:${defaultPort}`;
          else text = `ws://${text}`;
        }
        if (!isWsUrl(text)) throw new Error(`bad address: ${text}`);
        return text;
      }
      function setEndpoint(host, mode, url) {
        if (mode !== "relay" && mode !== "lan") throw new Error("bad mode");
        const resolved = mode === "lan" ? normalizeLanUrl(url) : normalizeRelayUrl(url);
        const previous = host.endpoints[mode];
        host.endpoints[mode] = {
          url: resolved,
          pskKey: `psk:${mode}`,
          pairing: previous ? previous.pairing || null : null
        };
        return host;
      }
      function setPairing(host, mode, pairing) {
        const endpoint = host.endpoints[mode];
        if (!endpoint) throw new Error("endpoint not configured");
        endpoint.pairing = pairing ? {
          channelId: pairing.channelId,
          hostId: pairing.hostId || "",
          psk: pairing.psk,
          clientId: pairing.clientId || "",
          pairedAt: pairing.pairedAt || 0,
          sendSeq: pairing.sendSeq || 0
        } : null;
        return host;
      }
      function pairingOf(host, mode) {
        const endpoint = host && host.endpoints ? host.endpoints[mode] : null;
        return endpoint && endpoint.pairing || null;
      }
      function hasPairing(host, mode) {
        const pairing = pairingOf(host, mode);
        return !!(pairing && pairing.channelId && pairing.psk);
      }
      function clearPairing(host, mode) {
        const endpoint = host.endpoints[mode];
        if (endpoint) endpoint.pairing = null;
        return host;
      }
      function activate(host, mode, available) {
        if (!host.endpoints[mode]) throw new Error("endpoint not configured");
        host.activeMode = mode;
        const endpoint = host.endpoints[mode];
        return { mode, url: endpoint.url, available: available !== false, pairing: endpoint.pairing || null };
      }
      function activeEndpoint(host) {
        if (!host || !host.activeMode) return null;
        const endpoint = host.endpoints[host.activeMode];
        if (!endpoint) return null;
        return { mode: host.activeMode, url: endpoint.url, pairing: endpoint.pairing || null };
      }
      function nextMode(host) {
        return host.activeMode === "lan" ? "relay" : "lan";
      }
      function describeMode(mode) {
        return mode === "lan" ? "\u5C40\u57DF\u7F51" : "\u4E2D\u7EE7";
      }
      module.exports = {
        MODES,
        DEFAULT_LAN_PORT,
        createHost,
        isWsUrl,
        normalizeRelayUrl,
        normalizeLanUrl,
        setEndpoint,
        setPairing,
        pairingOf,
        hasPairing,
        clearPairing,
        activate,
        activeEndpoint,
        nextMode,
        describeMode
      };
    }
  });

  // src/payloads.js
  var require_payloads = __commonJS({
    "src/payloads.js"(exports, module) {
      "use strict";
      var MAX_IMAGE_ATTACHMENTS2 = 4;
      var MAX_FILE_ATTACHMENTS2 = 4;
      var MAX_ATTACHMENT_BYTES = 512 * 1024;
      var MAX_ATTACHMENT_TOTAL_BYTES2 = 512 * 1024;
      var MAX_TEXT_CHARS = 2e4;
      var MAX_RELAY_MESSAGE_BYTES = 1024 * 1024;
      var COMMAND_TIMEOUT_MS = 12e3;
      var CMD_TYPES = [
        "cmd.send_prompt",
        "cmd.answer",
        "cmd.resolve_permission",
        "cmd.interrupt",
        "cmd.list_sessions",
        "cmd.keep_awake",
        "cmd.session_history",
        "cmd.new_session",
        "cmd.get_pending",
        "cmd.archive_session"
      ];
      var EV_TYPES = [
        "ev.session_changed",
        "ev.message_delta",
        "ev.tool_event",
        "ev.permission_request",
        "ev.permission_resolved",
        "ev.question_request",
        "ev.question_resolved",
        "ev.run_state",
        "ev.todo",
        "ev.retry",
        "ev.compaction",
        "ev.keep_awake_state",
        "ev.host_info",
        "ev.model",
        "ev.result",
        "ev.session_history",
        "ev.artifact"
      ];
      var SESSION_STATES = ["idle", "running", "detached", "archived", "awaiting-permission", "awaiting-answer"];
      function listSessions(cmdId) {
        return { t: "cmd.list_sessions", cmdId };
      }
      function sessionHistory(cmdId, fields) {
        const payload = { t: "cmd.session_history", cmdId, sessionId: fields.sessionId };
        if (fields.beforeSeq) payload.beforeSeq = fields.beforeSeq;
        if (fields.since) payload.since = fields.since;
        if (fields.limit) payload.limit = fields.limit;
        return payload;
      }
      function sendPrompt(cmdId, fields) {
        const payload = { t: "cmd.send_prompt", cmdId, sessionId: fields.sessionId, text: fields.text || "" };
        if (fields.images && fields.images.length) payload.images = fields.images;
        if (fields.files && fields.files.length) payload.files = fields.files;
        return payload;
      }
      function answer(cmdId, fields) {
        return {
          t: "cmd.answer",
          cmdId,
          sessionId: fields.sessionId,
          requestId: fields.requestId,
          answers: fields.answers || []
        };
      }
      function resolvePermission(cmdId, fields) {
        const payload = {
          t: "cmd.resolve_permission",
          cmdId,
          sessionId: fields.sessionId,
          requestId: fields.requestId,
          decision: String(fields.decision)
        };
        if (fields.note) payload.note = fields.note;
        return payload;
      }
      function interrupt(cmdId, fields) {
        return { t: "cmd.interrupt", cmdId, sessionId: fields.sessionId };
      }
      function newSession(cmdId, fields) {
        const payload = { t: "cmd.new_session", cmdId };
        if (fields && fields.workspace) payload.workspace = fields.workspace;
        return payload;
      }
      function archiveSession(cmdId, fields) {
        const payload = { t: "cmd.archive_session", cmdId, sessionId: fields.sessionId };
        if (fields.archived === false) payload.archived = false;
        return payload;
      }
      function getPermission(cmdId, fields) {
        return { t: "cmd.get_permission", cmdId, sessionId: fields.sessionId };
      }
      function setPermission(cmdId, fields) {
        return { t: "cmd.set_permission", cmdId, sessionId: fields.sessionId, preset: fields.preset };
      }
      function getPending(cmdId, fields) {
        const payload = { t: "cmd.get_pending", cmdId };
        if (fields && fields.sessionId) payload.sessionId = fields.sessionId;
        return payload;
      }
      function keepAwake(cmdId, fields) {
        const payload = { t: "cmd.keep_awake", cmdId, enabled: !!fields.enabled };
        if (fields.idleReleaseSec) payload.idleReleaseSec = fields.idleReleaseSec;
        return payload;
      }
      function isCmdType(name) {
        return CMD_TYPES.indexOf(name) !== -1;
      }
      function isEvType(name) {
        return EV_TYPES.indexOf(name) !== -1;
      }
      function b64Bytes(text) {
        if (typeof text !== "string") return 0;
        const clean = text.replace(/[^A-Za-z0-9+/=]/g, "");
        const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
        return Math.max(0, Math.floor(clean.length * 3 / 4) - padding);
      }
      function validatePrompt2(fields) {
        const text = String(fields.text || "");
        if (text.length > MAX_TEXT_CHARS) return { ok: false, error: `\u6B63\u6587\u8D85\u8FC7 ${MAX_TEXT_CHARS} \u5B57\u4E0A\u9650` };
        const images = fields.images || [];
        const files = fields.files || [];
        if (images.length > MAX_IMAGE_ATTACHMENTS2) return { ok: false, error: `\u56FE\u7247\u6700\u591A ${MAX_IMAGE_ATTACHMENTS2} \u5F20` };
        if (files.length > MAX_FILE_ATTACHMENTS2) return { ok: false, error: `\u6587\u4EF6\u6700\u591A ${MAX_FILE_ATTACHMENTS2} \u4E2A` };
        let total = 0;
        for (const image of images) {
          if (!image || image.mediaType !== "image/jpeg") return { ok: false, error: "\u56FE\u7247\u53EA\u652F\u6301 JPEG" };
          if (!image.name) return { ok: false, error: "\u56FE\u7247\u7F3A\u5C11\u6587\u4EF6\u540D" };
          const bytes = b64Bytes(image.data);
          if (bytes > MAX_ATTACHMENT_BYTES) return { ok: false, error: `\u56FE\u7247 ${image.name} \u8D85\u8FC7 512KB` };
          total += bytes;
        }
        for (const file of files) {
          if (!file || !file.name) return { ok: false, error: "\u6587\u4EF6\u7F3A\u5C11\u6587\u4EF6\u540D" };
          const bytes = b64Bytes(file.data);
          if (bytes > MAX_ATTACHMENT_BYTES) return { ok: false, error: `\u6587\u4EF6 ${file.name} \u8D85\u8FC7 512KB` };
          total += bytes;
        }
        if (total > MAX_ATTACHMENT_TOTAL_BYTES2) {
          return { ok: false, error: `\u9644\u4EF6\u5408\u8BA1\u8D85\u8FC7 ${Math.round(MAX_ATTACHMENT_TOTAL_BYTES2 / 1024)}KB \u4E0A\u9650` };
        }
        if (!text.trim() && images.length === 0 && files.length === 0) {
          return { ok: false, error: "\u5185\u5BB9\u4E3A\u7A7A" };
        }
        return { ok: true };
      }
      module.exports = {
        MAX_IMAGE_ATTACHMENTS: MAX_IMAGE_ATTACHMENTS2,
        MAX_FILE_ATTACHMENTS: MAX_FILE_ATTACHMENTS2,
        MAX_ATTACHMENT_BYTES,
        MAX_ATTACHMENT_TOTAL_BYTES: MAX_ATTACHMENT_TOTAL_BYTES2,
        MAX_TEXT_CHARS,
        MAX_RELAY_MESSAGE_BYTES,
        COMMAND_TIMEOUT_MS,
        CMD_TYPES,
        EV_TYPES,
        SESSION_STATES,
        listSessions,
        sessionHistory,
        sendPrompt,
        answer,
        resolvePermission,
        interrupt,
        newSession,
        archiveSession,
        getPermission,
        setPermission,
        getPending,
        keepAwake,
        isCmdType,
        isEvType,
        b64Bytes,
        validatePrompt: validatePrompt2
      };
    }
  });

  // src/chat-model.js
  var require_chat_model = __commonJS({
    "src/chat-model.js"(exports, module) {
      "use strict";
      var MAX_PART_CHARS = 2e4;
      var MAX_BLOCKS = 800;
      function createChatModel() {
        return {
          blocks: [],
          byId: /* @__PURE__ */ new Map(),
          toolIndex: /* @__PURE__ */ new Map(),
          todo: [],
          runState: "idle",
          runStartedAt: 0,
          model: null,
          nextBeforeSeq: 0,
          historyLoaded: false,
          historyEmpty: false,
          truncated: false
        };
      }
      function findMessage(model, id) {
        return id ? model.byId.get(id) || null : null;
      }
      function makeMessageBlock(ev, local) {
        return {
          kind: "message",
          id: ev.messageId || ev.clientMsgId || "",
          role: ev.role || "assistant",
          parts: [],
          done: false,
          local: !!local,
          clientMsgId: ev.clientMsgId || "",
          state: ev.state || "",
          error: "",
          images: ev.images || [],
          files: ev.files || [],
          at: ev.at || 0
        };
      }
      function partText(block, part) {
        const segment = block.parts.find((item) => item.part === part);
        return segment ? segment.text : "";
      }
      function appendDelta(block, part, delta) {
        const text = typeof delta === "string" ? delta : String(delta || "");
        if (!text) return false;
        let segment = block.parts.find((item) => item.part === part);
        if (!segment) {
          segment = { part, text: "" };
          block.parts.push(segment);
          block.parts.sort((a, b) => a.part - b.part);
        }
        if (segment.text.length >= MAX_PART_CHARS) return false;
        const room = MAX_PART_CHARS - segment.text.length;
        segment.text += text.length > room ? text.slice(0, room) : text;
        return true;
      }
      function mergeHistoryDelta(block, part, delta) {
        const text = typeof delta === "string" ? delta : String(delta || "");
        if (!text) return false;
        const current = partText(block, part);
        if (current === text) return false;
        if (current.endsWith(text)) return false;
        if (text.startsWith(current)) {
          const segment = block.parts.find((item) => item.part === part);
          if (segment) segment.text = text.slice(0, MAX_PART_CHARS);
          return true;
        }
        return appendDelta(block, part, text);
      }
      function applyMessageDelta(model, ev, opts) {
        const messageId = String(ev.messageId || "");
        if (!messageId) return null;
        let block = model.byId.get(messageId);
        let created = false;
        if (!block) {
          if (ev.role === "user" && (ev.done || opts.history)) {
            const pending = findPendingUser(model, ev.delta);
            if (pending) {
              adoptLocalMessage(model, pending, messageId);
              if (ev.done) pending.done = true;
              return pending;
            }
          }
          block = makeMessageBlock(ev, false);
          model.byId.set(messageId, block);
          if (opts.collect) opts.collect.push(block);
          else model.blocks.push(block);
          created = true;
        }
        const part = Number.isFinite(Number(ev.part)) ? Number(ev.part) : 0;
        const echoedAgain = !created && ev.role === "user" && partText(block, part) === String(ev.delta || "");
        if (echoedAgain) {
          if (ev.done) block.done = true;
          return block;
        }
        if (created || opts.replace) {
          if (ev.delta) appendDelta(block, part, ev.delta);
        } else if (opts.history) {
          mergeHistoryDelta(block, part, ev.delta);
        } else {
          appendDelta(block, part, ev.delta);
        }
        if (ev.role) block.role = ev.role;
        if (ev.done) block.done = true;
        return block;
      }
      function applyToolEvent(model, ev, opts) {
        const callId = String(ev.callId || "");
        if (!callId) return null;
        let block = model.toolIndex.get(callId);
        let created = false;
        if (!block) {
          block = {
            kind: "tool",
            id: callId,
            callId,
            tool: ev.tool || "",
            title: ev.title || "",
            phase: ev.phase || "started",
            argsPreview: ev.argsPreview || "",
            resultPreview: ev.resultPreview || ""
          };
          model.toolIndex.set(callId, block);
          if (opts.collect) opts.collect.push(block);
          else model.blocks.push(block);
          created = true;
        }
        if (ev.tool) block.tool = ev.tool;
        if (ev.title) block.title = ev.title;
        if (ev.phase) block.phase = ev.phase;
        if (ev.argsPreview !== void 0) block.argsPreview = ev.argsPreview || "";
        if (ev.resultPreview !== void 0) block.resultPreview = ev.resultPreview || "";
        return block;
      }
      function applyEvent(model, ev, options) {
        const opts = options || {};
        if (!ev || typeof ev.t !== "string") return { changed: false, created: null };
        const collect = opts.collect;
        let block = null;
        let created = null;
        switch (ev.t) {
          case "ev.message_delta":
            block = applyMessageDelta(model, ev, { ...opts, collect });
            if (block && block.parts.length === 0 && opts.collect) {
              created = block;
            }
            break;
          case "ev.tool_event":
            block = applyToolEvent(model, ev, { ...opts, collect });
            created = block && opts.collect ? block : null;
            break;
          case "ev.todo":
            model.todo = Array.isArray(ev.todos) ? ev.todos : [];
            return { changed: true, created: null };
          case "ev.artifact": {
            const id = String(ev.artifactId || `artifact:${model.blocks.length}:${ev.name || ""}`);
            if (model.byId.has(id)) return { changed: false, created: null };
            const block2 = {
              kind: "artifact",
              id,
              name: String(ev.name || "\u6587\u4EF6"),
              mediaType: String(ev.mediaType || "application/octet-stream"),
              bytes: Number(ev.bytes) || 0,
              data: typeof ev.data === "string" ? ev.data : "",
              description: String(ev.description || ""),
              error: String(ev.error || "")
            };
            model.blocks.push(block2);
            model.byId.set(id, block2);
            return { changed: true, created: block2 };
          }
          case "ev.run_state": {
            const next = ev.state === "running" ? "running" : "idle";
            if (next === "running" && model.runState !== "running") model.runStartedAt = Date.now();
            if (next === "idle") model.runStartedAt = 0;
            model.runState = next;
            return { changed: true, created: null };
          }
          case "ev.model":
            model.model = {
              provider: ev.provider || "",
              model: ev.model || "",
              canSwitch: !!ev.canSwitch,
              options: Array.isArray(ev.options) ? ev.options : [],
              reason: ev.reason || ""
            };
            return { changed: true, created: null };
          case "ev.retry":
            pushNotice(model, {
              noticeKind: "retry",
              text: `\u6A21\u578B\u91CD\u8BD5 ${ev.attempt}/${ev.max}${ev.reason ? ` \xB7 ${ev.reason}` : ""}`
            });
            return { changed: true, created: null };
          case "ev.compaction":
            pushNotice(model, {
              noticeKind: "compaction",
              text: ev.state === "started" ? "\u6B63\u5728\u538B\u7F29\u4E0A\u4E0B\u6587\u2026" : ev.state === "failed" ? `\u4E0A\u4E0B\u6587\u538B\u7F29\u5931\u8D25${ev.error ? `\uFF1A${ev.error}` : ""}` : "\u4E0A\u4E0B\u6587\u538B\u7F29\u5B8C\u6210"
            });
            return { changed: true, created: null };
          default:
            return { changed: false, created: null };
        }
        return { changed: true, created: created || (block && block.id ? block : null) };
      }
      function pushNotice(model, notice) {
        model.blocks.push({ kind: "notice", id: `n_${model.blocks.length}`, ...notice });
        trimBlocks(model);
      }
      function trimBlocks(model) {
        if (model.blocks.length <= MAX_BLOCKS) return;
        const dropped = model.blocks.splice(0, model.blocks.length - MAX_BLOCKS);
        model.truncated = true;
        for (const block of dropped) {
          if (block.kind === "message" && block.id) model.byId.delete(block.id);
          if (block.kind === "tool" && block.callId) model.toolIndex.delete(block.callId);
        }
      }
      function applyHistoryPage(model, items, options) {
        const opts = options || {};
        const list = Array.isArray(items) ? items : [];
        const collect = [];
        let changed = false;
        for (const item of list) {
          if (!item || typeof item.t !== "string") continue;
          if (item.t === "ev.run_state" || item.t === "ev.session_changed") continue;
          const result = applyEvent(model, item, { history: true, replace: false, collect });
          if (result.changed) changed = true;
        }
        const existing = new Set(model.blocks);
        const fresh = collect.filter((block) => !existing.has(block));
        if (fresh.length) {
          if (opts.older) model.blocks.unshift(...fresh);
          else model.blocks.push(...fresh);
        }
        if (opts.nextBeforeSeq !== void 0) model.nextBeforeSeq = opts.nextBeforeSeq || 0;
        if (opts.historyEmpty !== void 0) model.historyEmpty = opts.historyEmpty;
        model.historyLoaded = true;
        return changed;
      }
      function addLocalUserMessage(model, fields) {
        const block = makeMessageBlock(
          {
            clientMsgId: fields.clientMsgId,
            role: "user",
            at: fields.at,
            state: fields.state || "sending",
            images: fields.images || [],
            files: fields.files || []
          },
          true
        );
        block.parts = [{ part: 0, text: String(fields.text || "") }];
        block.done = false;
        model.blocks.push(block);
        model.byId.set(block.clientMsgId, block);
        return block;
      }
      function findPendingUser(model, text, clientMsgId) {
        const wanted = String(text || "").trim();
        for (let i = model.blocks.length - 1; i >= 0; i -= 1) {
          const block = model.blocks[i];
          if (block.kind !== "message" || block.role !== "user" || !block.local) continue;
          if (clientMsgId && block.clientMsgId === clientMsgId) return block;
          if (block.clientMsgId && wanted && partText(block, 0).trim() === wanted) return block;
        }
        return null;
      }
      function adoptLocalMessage(model, block, messageId) {
        if (!block || !messageId) return block;
        if (block.clientMsgId && model.byId.get(block.clientMsgId) === block) {
          model.byId.delete(block.clientMsgId);
        }
        block.id = messageId;
        block.local = false;
        block.done = true;
        block.state = "accepted";
        model.byId.set(messageId, block);
        return block;
      }
      function updateLocalState(model, clientMsgId, state, error) {
        const block = model.byId.get(clientMsgId);
        if (!block) return null;
        block.state = state;
        if (error !== void 0) block.error = error || "";
        if (state === "accepted") block.local = false;
        return block;
      }
      function partCount(model) {
        return model.blocks.filter((block) => block.kind === "message").length;
      }
      module.exports = {
        MAX_PART_CHARS,
        createChatModel,
        findMessage,
        partText,
        applyEvent,
        applyHistoryPage,
        addLocalUserMessage,
        findPendingUser,
        adoptLocalMessage,
        updateLocalState,
        partCount
      };
    }
  });

  // src/session-list.js
  var require_session_list = __commonJS({
    "src/session-list.js"(exports, module) {
      "use strict";
      var STATE_META2 = {
        running: { label: "\u8FD0\u884C\u4E2D", tone: "running" },
        "awaiting-permission": { label: "\u5F85\u5BA1\u6279", tone: "warn" },
        "awaiting-answer": { label: "\u5F85\u56DE\u7B54", tone: "warn" },
        idle: { label: "\u7A7A\u95F2", tone: "idle" },
        detached: { label: "\u5DF2\u65AD\u5F00", tone: "muted" },
        archived: { label: "\u5DF2\u5F52\u6863", tone: "muted" }
      };
      function stateOf(session) {
        const state = session && session.state;
        if (state && STATE_META2[state]) return state;
        if (session && session.running) return "running";
        return "idle";
      }
      function titleOf(session) {
        const title = session && typeof session.title === "string" ? session.title.trim() : "";
        if (title) return title;
        const workspace = session && typeof session.workspace === "string" ? session.workspace.trim() : "";
        if (workspace) return workspace.split(/[\\/]/).filter(Boolean).pop() || workspace;
        return session && session.id || "\u672A\u547D\u540D\u4F1A\u8BDD";
      }
      function timeOf(session) {
        const raw = session && session.updatedAt;
        if (!raw) return 0;
        const parsed = Date.parse(raw);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      function normalizeSession(session) {
        const state = stateOf(session);
        const title = session && typeof session.title === "string" ? session.title.trim() : "";
        const created = session && session.createdAt ? Date.parse(session.createdAt) || 0 : 0;
        const updated = timeOf(session);
        return {
          id: String(session && session.id || ""),
          title: titleOf(session),
          hasTitle: !!title,
          workspace: session && session.workspace || "",
          state,
          running: state === "running" || !!(session && session.running),
          archived: state === "archived",
          updatedAt: updated,
          createdAt: created,
          // A session created from the phone but never used has no title and no
          // updates; the desktop list hides it, so the phone list should too (unless
          // it is the session currently open).
          empty: !title && created > 0 && updated > 0 && Math.abs(updated - created) < 5e3,
          origin: session && session.origin || "",
          meta: STATE_META2[state]
        };
      }
      function normalizeSessions(sessions) {
        const seen = /* @__PURE__ */ new Set();
        const out = [];
        for (const raw of Array.isArray(sessions) ? sessions : []) {
          const session = normalizeSession(raw);
          if (!session.id || seen.has(session.id)) continue;
          seen.add(session.id);
          out.push(session);
        }
        out.sort((a, b) => {
          if (a.running !== b.running) return a.running ? -1 : 1;
          return b.updatedAt - a.updatedAt;
        });
        return out;
      }
      function groupSessions2(sessions) {
        const list = normalizeSessions(sessions);
        const groups = { running: [], recent: [], archived: [] };
        for (const session of list) {
          if (session.archived) groups.archived.push(session);
          else if (session.state === "running" || session.state === "awaiting-permission" || session.state === "awaiting-answer") {
            groups.running.push(session);
          } else groups.recent.push(session);
        }
        return groups;
      }
      function formatRelative2(updatedAt, now) {
        if (!updatedAt) return "";
        const current = typeof now === "number" ? now : Date.now();
        const diff = Math.max(0, current - updatedAt);
        const minute = 6e4;
        if (diff < minute) return "\u521A\u521A";
        if (diff < 60 * minute) return `${Math.floor(diff / minute)} \u5206\u949F\u524D`;
        if (diff < 24 * 60 * minute) return `${Math.floor(diff / (60 * minute))} \u5C0F\u65F6\u524D`;
        const date = new Date(updatedAt);
        const today = new Date(current);
        const yesterday = new Date(current - 24 * 60 * minute);
        if (date.toDateString() === yesterday.toDateString()) return "\u6628\u5929";
        if (date.getFullYear() === today.getFullYear()) return `${date.getMonth() + 1} \u6708 ${date.getDate()} \u65E5`;
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      }
      function findSession2(sessions, id) {
        for (const session of Array.isArray(sessions) ? sessions : []) {
          if (session && session.id === id) return session;
        }
        return null;
      }
      module.exports = {
        STATE_META: STATE_META2,
        stateOf,
        titleOf,
        normalizeSession,
        normalizeSessions,
        groupSessions: groupSessions2,
        formatRelative: formatRelative2,
        findSession: findSession2
      };
    }
  });

  // src/message-state.js
  var require_message_state = __commonJS({
    "src/message-state.js"(exports, module) {
      "use strict";
      var ALLOWED = {
        queued: ["sending", "cancelled"],
        sending: ["accepted", "failed", "cancelled"],
        accepted: ["done"],
        failed: ["queued", "cancelled"],
        done: [],
        cancelled: []
      };
      function createMessage(text, clientMsgId) {
        return {
          clientMsgId,
          text,
          state: "queued",
          error: "",
          attempts: 0,
          acceptedAt: 0
        };
      }
      function transition(message, next, at) {
        if (!message || !ALLOWED[message.state]) throw new Error("bad current state");
        if (!ALLOWED[message.state].includes(next)) {
          throw new Error(`illegal transition ${message.state} -> ${next}`);
        }
        message.state = next;
        if (next === "sending") message.attempts += 1;
        if (next === "accepted") {
          message.acceptedAt = at || Date.now();
          message.error = "";
        }
        if (next === "failed") message.error = message.error || "send failed";
        return message;
      }
      function markFailed(message, error, at) {
        if (!message) return message;
        if (message.state === "accepted" || message.state === "done") return message;
        if (message.state === "failed") return message;
        message.error = error || "send failed";
        return transition(message, "failed", at);
      }
      function markAccepted(message, at) {
        if (!message) return message;
        if (message.state === "accepted" || message.state === "done") return message;
        if (message.state === "failed") {
          message.state = "sending";
        }
        return transition(message, "accepted", at);
      }
      function canRetry(message) {
        return !!message && message.state === "failed";
      }
      module.exports = { createMessage, transition, markFailed, markAccepted, canRetry };
    }
  });

  // src/frames.js
  var require_frames = __commonJS({
    "src/frames.js"(exports, module) {
      "use strict";
      var PROTOCOL_VERSION2 = 1;
      var PAIRING_TOKEN_RE = /^\d{6}$/;
      var ENDPOINT_FRAMES = ["hello", "pair-begin", "pair-begin-client", "pair-grant", "resync", "enc", "enc-batch", "session-leave", "summary", "ping"];
      var RELAY_FRAMES = ["hello-ok", "pair-ready", "pair-request", "pair-grant", "paired", "pair-fail", "peer-joined", "peer-left", "error", "pong", "enc", "enc-batch", "resume-gap"];
      var PAIR_FAIL_REASONS = ["invalid_or_expired", "already_used", "host_offline", "bad_token"];
      function helloClient(options) {
        const opts = options || {};
        const frame = {
          t: "hello",
          role: "client",
          protocol: PROTOCOL_VERSION2,
          clientId: opts.clientId
        };
        frame.clientMeta = {
          platform: opts.platform || "android",
          label: opts.label || "DSH Remoto"
        };
        if (opts.softwareVersion) frame.softwareVersion = opts.softwareVersion;
        return frame;
      }
      function helloHost(options) {
        const opts = options || {};
        const frame = {
          t: "hello",
          role: "host",
          protocol: PROTOCOL_VERSION2,
          token: opts.token
        };
        if (opts.hostId) frame.hostId = opts.hostId;
        if (opts.label) frame.label = opts.label;
        if (opts.softwareVersion) frame.softwareVersion = opts.softwareVersion;
        return frame;
      }
      function pairClaim(token, clientPub) {
        const frame = { t: "pair-begin-client", pairingToken: String(token) };
        if (clientPub) frame.clientPub = clientPub;
        return frame;
      }
      function pairBegin(token) {
        return { t: "pair-begin", pairingToken: String(token) };
      }
      function pairGrant(sessionId, hostPub, nonce, wrappedPsk) {
        return { t: "pair-grant", sessionId, hostPub, nonce, wrappedPsk };
      }
      function encFrame(sessionId, ciphertext) {
        return { t: "enc", sessionId, ciphertext };
      }
      function encBatchFrame(sessionId, items) {
        return { t: "enc-batch", sessionId, items };
      }
      function sessionLeave(sessionId) {
        return { t: "session-leave", sessionId };
      }
      function resync(sessionIds) {
        return { t: "resync", sessionIds };
      }
      function ping(ts) {
        const frame = { t: "ping" };
        if (typeof ts === "number") frame.ts = ts;
        return frame;
      }
      function pong(ts) {
        const frame = { t: "pong" };
        if (typeof ts === "number") frame.ts = ts;
        return frame;
      }
      function parseFrame(text) {
        if (typeof text !== "string" || text.length === 0) return null;
        try {
          const value = JSON.parse(text);
          if (!value || typeof value !== "object" || Array.isArray(value)) return null;
          if (typeof value.t !== "string") return null;
          return value;
        } catch {
          return null;
        }
      }
      function isKnownRelayFrame(name) {
        return RELAY_FRAMES.indexOf(name) !== -1;
      }
      function isKnownEndpointFrame(name) {
        return ENDPOINT_FRAMES.indexOf(name) !== -1;
      }
      function classifyRelayFrame(value) {
        if (!value || typeof value !== "object") return { ok: false, reason: "not_object" };
        if (typeof value.t !== "string") return { ok: false, reason: "no_frame_type" };
        if (!isKnownRelayFrame(value.t)) return { ok: false, reason: "unknown_frame", frameType: value.t };
        if (value.t === "pair-fail" && PAIR_FAIL_REASONS.indexOf(value.reason) === -1) {
          return { ok: false, reason: "bad_frame", frameType: value.t };
        }
        return { ok: true, frame: value };
      }
      module.exports = {
        PROTOCOL_VERSION: PROTOCOL_VERSION2,
        PAIRING_TOKEN_RE,
        PAIR_FAIL_REASONS,
        ENDPOINT_FRAMES,
        RELAY_FRAMES,
        helloClient,
        helloHost,
        pairClaim,
        pairBegin,
        pairGrant,
        encFrame,
        encBatchFrame,
        sessionLeave,
        resync,
        ping,
        pong,
        parseFrame,
        isKnownRelayFrame,
        isKnownEndpointFrame,
        classifyRelayFrame
      };
    }
  });

  // src/pairing-flow.js
  var require_pairing_flow = __commonJS({
    "src/pairing-flow.js"(exports, module) {
      "use strict";
      var codec = require_codec();
      var DEFAULT_TTL_MS = 12e4;
      function createPairingFlow(options) {
        const opts = options || {};
        const now = opts.now || (() => Date.now());
        const makeKeyPair = opts.makeKeyPair || codec.newKeyPair;
        return {
          state: "idle",
          token: "",
          ttlMs: opts.ttlMs || DEFAULT_TTL_MS,
          expiresAt: 0,
          keyPair: null,
          channel: null,
          grant: null,
          sas: "",
          reason: "",
          now,
          makeKeyPair
        };
      }
      function start(flow, token, at) {
        if (!/^\d{6}$/.test(String(token || ""))) {
          flow.state = "failed";
          flow.reason = "bad_token";
          return { ok: false, reason: "bad_token" };
        }
        flow.token = String(token);
        flow.state = "claiming";
        flow.reason = "";
        flow.expiresAt = (typeof at === "number" ? at : flow.now()) + flow.ttlMs;
        flow.keyPair = flow.makeKeyPair();
        flow.channel = null;
        flow.grant = null;
        flow.sas = "";
        return {
          ok: true,
          frame: {
            t: "pair-begin-client",
            pairingToken: flow.token,
            clientPub: codec.toBase64(flow.keyPair.publicKey)
          }
        };
      }
      function onPairReady(flow, frame) {
        if (flow.state === "idle" || flow.state === "failed") return flow;
        const ttl = Number(frame && frame.ttlMs);
        if (Number.isFinite(ttl) && ttl > 0) {
          flow.ttlMs = ttl;
          flow.expiresAt = flow.now() + ttl;
        }
        return flow;
      }
      function onPaired(flow, frame) {
        if (flow.state === "idle" || flow.state === "failed") return flow;
        if (!frame || !frame.sessionId) return flow;
        if (flow.candidateChannel && flow.candidateChannel !== frame.sessionId) {
          return fail(flow, "invalid_or_expired");
        }
        flow.channel = { channelId: frame.sessionId, hostId: frame.hostId || "" };
        return maybeComplete(flow);
      }
      function onGrant(flow, frame) {
        if (flow.state === "idle" || flow.state === "failed" || !flow.keyPair) return flow;
        try {
          if (!frame || !frame.sessionId) return fail(flow, "invalid_or_expired");
          if (flow.channel && flow.channel.channelId !== frame.sessionId) {
            return fail(flow, "invalid_or_expired");
          }
          const shared = codec.sharedKey(flow.keyPair.secretKey, codec.fromBase64(frame.hostPub));
          const psk = codec.unwrapPsk(shared, frame.nonce, frame.wrappedPsk);
          if (!psk) return fail(flow, "invalid_or_expired");
          flow.grant = {
            channelId: frame.sessionId,
            psk,
            sas: codec.sasCode(shared)
          };
          flow.sas = flow.grant.sas;
          flow.candidateChannel = frame.sessionId;
          return maybeComplete(flow);
        } catch {
          return fail(flow, "invalid_or_expired");
        }
      }
      function maybeComplete(flow) {
        if (!flow.channel || !flow.grant) return flow;
        if (flow.channel.channelId !== flow.grant.channelId) return fail(flow, "invalid_or_expired");
        flow.state = "paired";
        return flow;
      }
      function fail(flow, reason) {
        flow.state = "failed";
        flow.reason = reason || "invalid_or_expired";
        return flow;
      }
      function isExpired(flow, at) {
        if (!flow.expiresAt) return false;
        return (typeof at === "number" ? at : flow.now()) > flow.expiresAt;
      }
      function tick(flow, at) {
        if (flow.state === "claiming" && isExpired(flow, at)) fail(flow, "timeout");
        return flow;
      }
      function result(flow) {
        if (flow.state !== "paired") return null;
        return {
          channelId: flow.channel.channelId,
          hostId: flow.channel.hostId,
          psk: flow.grant.psk,
          sas: flow.grant.sas
        };
      }
      function reset(flow) {
        flow.state = "idle";
        flow.token = "";
        flow.keyPair = null;
        flow.channel = null;
        flow.grant = null;
        flow.sas = "";
        flow.reason = "";
        flow.expiresAt = 0;
        flow.candidateChannel = "";
        return flow;
      }
      module.exports = {
        DEFAULT_TTL_MS,
        createPairingFlow,
        start,
        onPairReady,
        onPaired,
        onGrant,
        fail,
        isExpired,
        tick,
        result,
        reset
      };
    }
  });

  // src/transport.js
  var require_transport = __commonJS({
    "src/transport.js"(exports, module) {
      "use strict";
      function createTransport(url, factory, handlers) {
        if (!/^wss?:\/\//.test(String(url))) throw new Error("bad url");
        let socket = null;
        let closed = false;
        function connect() {
          if (closed) return;
          socket = factory(url);
          socket.onopen = () => handlers.onOpen && handlers.onOpen();
          socket.onmessage = (event) => handlers.onMessage && handlers.onMessage(String(event.data));
          socket.onclose = () => handlers.onClose && handlers.onClose();
          socket.onerror = (event) => handlers.onError && handlers.onError(event);
        }
        function send(text) {
          if (!socket || socket.readyState !== 1) return false;
          socket.send(text);
          return true;
        }
        function close() {
          closed = true;
          if (socket && socket.close) socket.close();
        }
        return { connect, send, close, current: () => socket };
      }
      module.exports = { createTransport };
    }
  });

  // src/connection.js
  var require_connection = __commonJS({
    "src/connection.js"(exports, module) {
      "use strict";
      var codec = require_codec();
      var frames = require_frames();
      var pairingFlow = require_pairing_flow();
      var { createTransport } = require_transport();
      var DEFAULT_CONFIG = {
        heartbeatMs: 3e4,
        pongTimeoutMs: 12e3,
        handshakeTimeoutMs: 15e3,
        backoffMinMs: 1e3,
        backoffMaxMs: 3e4,
        autoReconnect: true
      };
      function createConnection(options) {
        const opts = options || {};
        const config = { ...DEFAULT_CONFIG, ...opts.config || {} };
        const now = opts.now || (() => Date.now());
        const timers = {
          setTimeout: opts.setTimeout || ((fn, ms) => setTimeout(fn, ms)),
          clearTimeout: opts.clearTimeout || ((id) => clearTimeout(id)),
          setInterval: opts.setInterval || ((fn, ms) => setInterval(fn, ms)),
          clearInterval: opts.clearInterval || ((id) => clearInterval(id))
        };
        const factory = opts.factory || ((url) => {
          const Socket = typeof WebSocket !== "undefined" ? WebSocket : null;
          if (!Socket) throw new Error("WebSocket unavailable");
          return new Socket(url);
        });
        const listeners = /* @__PURE__ */ Object.create(null);
        const state = {
          phase: "idle",
          detail: "",
          hostOnline: false,
          attempt: 0,
          clientId: opts.clientId || "",
          url: opts.url || "",
          channelId: "",
          hostId: "",
          psk: "",
          keys: null,
          sendSeq: 0,
          undecryptable: 0,
          manualClose: false
        };
        const flow = pairingFlow.createPairingFlow({ now });
        let transport = null;
        let reconnectTimer = null;
        let heartbeatTimer = null;
        let handshakeTimer = null;
        let pongDeadline = 0;
        function on(event, fn) {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(fn);
          return () => {
            const list = listeners[event];
            const index = list.indexOf(fn);
            if (index !== -1) list.splice(index, 1);
          };
        }
        function emit(event, data) {
          const list = listeners[event];
          if (!list) return;
          for (const fn of list.slice()) {
            try {
              fn(data);
            } catch {
            }
          }
        }
        function setPhase(phase, detail) {
          state.phase = phase;
          state.detail = detail || "";
          emit("state", {
            state: phase,
            detail: state.detail,
            hostOnline: state.hostOnline,
            channelId: state.channelId,
            url: state.url
          });
        }
        function isOpen() {
          return !!(transport && transport.current() && transport.current().readyState === 1);
        }
        function sendFrame(frame) {
          if (!isOpen()) return false;
          try {
            return transport.send(JSON.stringify(frame));
          } catch {
            return false;
          }
        }
        function stopTimers() {
          if (heartbeatTimer) timers.clearInterval(heartbeatTimer);
          if (handshakeTimer) timers.clearTimeout(handshakeTimer);
          heartbeatTimer = null;
          handshakeTimer = null;
          pongDeadline = 0;
        }
        function clearReconnect() {
          if (reconnectTimer) timers.clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        function scheduleReconnect() {
          if (state.manualClose || !config.autoReconnect || reconnectTimer) return;
          const base = Math.min(config.backoffMaxMs, config.backoffMinMs * Math.pow(2, state.attempt));
          const delay = base + Math.floor(Math.random() * 500);
          state.attempt += 1;
          reconnectTimer = timers.setTimeout(() => {
            reconnectTimer = null;
            connect();
          }, delay);
        }
        function closeSocket() {
          if (transport) {
            try {
              transport.close();
            } catch {
            }
          }
          transport = null;
        }
        function handleStateLoss(detail) {
          stopTimers();
          closeSocket();
          if (state.manualClose) {
            setPhase("closed", detail);
            return;
          }
          setPhase("offline", detail);
          scheduleReconnect();
        }
        function startHandshake() {
          setPhase("handshaking");
          sendFrame(
            frames.helloClient({
              clientId: state.clientId,
              label: opts.label,
              platform: opts.platform,
              softwareVersion: opts.softwareVersion
            })
          );
          handshakeTimer = timers.setTimeout(() => {
            if (state.phase === "handshaking") handleStateLoss("handshake timeout");
          }, config.handshakeTimeoutMs);
        }
        function onOpen() {
          state.attempt = 0;
          startHandshake();
        }
        function onMessage(text) {
          const frame = frames.parseFrame(String(text));
          if (!frame) {
            emit("protocol-error", { reason: "bad_json" });
            return;
          }
          emit("frame", { t: frame.t });
          const verdict = frames.classifyRelayFrame(frame);
          if (!verdict.ok) {
            if (verdict.reason !== "unknown_frame") emit("protocol-error", verdict);
            return;
          }
          switch (frame.t) {
            case "hello-ok":
              onHelloOk(frame);
              break;
            case "ping":
              sendFrame(frames.pong(frame.ts));
              break;
            case "pong":
              pongDeadline = 0;
              break;
            case "pair-ready":
              pairingFlow.onPairReady(flow, frame);
              emit("pair", { stage: "ready", ttlMs: flow.ttlMs, token: flow.token });
              break;
            case "pair-grant":
              onPairGrant(frame);
              break;
            case "paired":
              onPaired(frame);
              break;
            case "pair-fail":
              onPairFail(frame);
              break;
            case "enc":
              onEncrypted(frame);
              break;
            case "enc-batch":
              onEncryptedBatch(frame);
              break;
            case "error":
              onRelayError(frame);
              break;
            case "peer-left":
              state.hostOnline = false;
              emit("peer-left", frame);
              emit("host", { online: false });
              break;
            case "peer-joined":
              state.hostOnline = true;
              emit("peer-joined", frame);
              emit("host", { online: true });
              break;
            case "resume-gap":
              emit("resume-gap", frame);
              break;
            default:
              break;
          }
        }
        function onError(event) {
          const detail = event && (event.message || event.error) || "socket error";
          handleStateLoss(String(detail).slice(0, 120));
        }
        function connect() {
          if (state.phase === "connecting" || state.phase === "handshaking" || state.phase === "ready") return;
          if (!state.url) {
            setPhase("idle", "no url");
            return;
          }
          clearReconnect();
          state.manualClose = false;
          setPhase("connecting");
          try {
            transport = createTransport(state.url, factory, {
              onOpen,
              onMessage,
              onClose: () => {
                if (!state.manualClose) handleStateLoss("closed");
              },
              onError
            });
            transport.connect();
          } catch (error) {
            setPhase("offline", String(error && error.message || error).slice(0, 120));
            scheduleReconnect();
          }
        }
        function onHelloOk(frame) {
          if (handshakeTimer) timers.clearTimeout(handshakeTimer);
          handshakeTimer = null;
          const previousClientId = state.clientId;
          if (frame.clientId) state.clientId = String(frame.clientId);
          if (frame.hostId) state.hostId = String(frame.hostId);
          state.hostOnline = true;
          setPhase("online");
          emit("hello-ok", {
            clientId: state.clientId,
            hostId: state.hostId,
            capabilities: Array.isArray(frame.capabilities) ? frame.capabilities : [],
            summary: frame.summary || null,
            notify: frame.notify || null
          });
          if (state.keys && previousClientId !== state.clientId) {
            deriveKeys();
          }
          if (flow.state === "claiming") {
            sendPairClaim();
            return;
          }
          setPhase("ready");
          startHeartbeat();
          emit("ready", { paired: !!state.keys, channelId: state.channelId, hostId: state.hostId });
        }
        function startHeartbeat() {
          stopHeartbeat();
          heartbeatTimer = timers.setInterval(() => {
            if (state.phase !== "ready") return;
            if (pongDeadline && now() > pongDeadline) {
              handleStateLoss("pong timeout");
              return;
            }
            pongDeadline = now() + config.pongTimeoutMs;
            sendFrame(frames.ping(now()));
          }, config.heartbeatMs);
        }
        function stopHeartbeat() {
          if (heartbeatTimer) timers.clearInterval(heartbeatTimer);
          heartbeatTimer = null;
          pongDeadline = 0;
        }
        function sendPairClaim() {
          const started = pairingFlow.start(flow, flow.token, now());
          if (!started.ok) {
            emit("pair", { stage: "fail", reason: started.reason });
            return;
          }
          setPhase("pairing");
          emit("pair", { stage: "claiming", token: flow.token });
          const sent = sendFrame(started.frame);
          if (!sent) emit("pair", { stage: "sending-failed" });
        }
        function beginPair(token) {
          if (!/^\d{6}$/.test(String(token || ""))) {
            emit("pair", { stage: "fail", reason: "bad_token" });
            return false;
          }
          flow.token = String(token);
          flow.state = "claiming";
          flow.reason = "";
          flow.expiresAt = now() + flow.ttlMs;
          flow.keyPair = null;
          flow.channel = null;
          flow.grant = null;
          flow.sas = "";
          if (state.phase === "ready" || state.phase === "online") {
            sendPairClaim();
          } else {
            if (state.phase === "offline" || state.phase === "closed" || state.phase === "idle") connect();
            emit("pair", { stage: "waiting-connection", token: flow.token });
          }
          return true;
        }
        function cancelPair() {
          pairingFlow.reset(flow);
          if (state.phase === "pairing") {
            setPhase(state.keys ? "ready" : "online");
          }
          emit("pair", { stage: "cancelled" });
        }
        function onPairGrant(frame) {
          pairingFlow.onGrant(flow, frame);
          if (flow.state === "failed") {
            emit("pair", { stage: "fail", reason: flow.reason || "invalid_or_expired" });
            return;
          }
          if (flow.sas) emit("pair", { stage: "verify", sas: flow.sas, ttlMs: flow.ttlMs });
          finishPairIfReady();
        }
        function onPaired(frame) {
          if (!flow.token && !state.channelId) return;
          if (flow.state === "idle") {
            return;
          }
          pairingFlow.onPaired(flow, frame);
          if (flow.state === "failed") {
            emit("pair", { stage: "fail", reason: flow.reason || "invalid_or_expired" });
            return;
          }
          finishPairIfReady();
        }
        function finishPairIfReady() {
          const result = pairingFlow.result(flow);
          if (!result) return;
          const clientId = state.clientId;
          pairingFlow.reset(flow);
          state.hostOnline = true;
          emit("pair", {
            stage: "paired",
            channelId: result.channelId,
            hostId: result.hostId,
            psk: result.psk,
            sas: result.sas,
            clientId
          });
        }
        function onPairFail(frame) {
          const reason = frame.reason || "invalid_or_expired";
          pairingFlow.fail(flow, reason);
          emit("pair", { stage: "fail", reason });
          setPhase(state.keys ? "ready" : "online");
        }
        function onRelayError(frame) {
          if (frame.code === "unknown_session") {
            clearSession();
            setPhase("online", "unknown_session");
            emit("lost", { reason: "unknown_session", message: frame.message || "" });
            return;
          }
          emit("error", {
            code: frame.code || "internal",
            message: frame.message || "",
            retryAfterMs: frame.retryAfterMs || 0
          });
        }
        function onEncrypted(frame) {
          if (!state.keys || state.phase === "pairing") return;
          const payload = codec.open(state.keys.recvKey, frame);
          if (!payload) {
            state.undecryptable += 1;
            emit("codec-error", { count: state.undecryptable });
            if (state.undecryptable >= 2) {
              clearSession();
              setPhase("online", "keys lost");
              emit("lost", { reason: "undecryptable" });
            }
            return;
          }
          state.undecryptable = 0;
          if (payload && typeof payload.t === "string") emit("payload", payload);
        }
        function onEncryptedBatch(frame) {
          if (!state.keys || state.phase === "pairing" || !Array.isArray(frame.items)) return;
          for (const item of frame.items) {
            const payload = codec.open(state.keys.recvKey, item);
            if (!payload) {
              state.undecryptable += 1;
              continue;
            }
            state.undecryptable = 0;
            if (payload && typeof payload.t === "string") emit("payload", payload);
          }
        }
        function configureSession(session) {
          if (!session || !session.channelId || !session.psk) throw new Error("bad session");
          state.channelId = String(session.channelId);
          state.hostId = String(session.hostId || "");
          state.psk = String(session.psk);
          deriveKeys();
          if (state.phase === "ready" || state.phase === "online" || state.phase === "pairing") {
            setPhase("ready");
            startHeartbeat();
            emit("ready", { paired: true, channelId: state.channelId, hostId: state.hostId });
          }
          return state.keys;
        }
        function deriveKeys() {
          if (!state.psk || !state.channelId) {
            state.keys = null;
            return;
          }
          const clientId = state.clientId;
          state.keys = {
            sendKey: codec.deriveKey(state.psk, "c2h", state.channelId),
            recvKey: codec.deriveKey(state.psk, "h2c", state.channelId),
            sendPrefix: codec.noncePrefix(state.psk, state.channelId, clientId)
          };
          state.sendSeq = opts.loadCounter ? Number(opts.loadCounter(state.channelId, clientId)) || 0 : 0;
          state.undecryptable = 0;
        }
        function clearSession() {
          state.keys = null;
          state.channelId = "";
          state.psk = "";
          state.hostId = "";
          state.sendSeq = 0;
        }
        function setUrl(url) {
          if (!/^wss?:\/\//.test(String(url || ""))) throw new Error("bad url");
          state.url = String(url);
          return state.url;
        }
        function sendCommand(payload) {
          if (!state.keys || !state.channelId || !isOpen()) return false;
          const nonce = codec.counterNonce(state.keys.sendPrefix, state.sendSeq);
          state.sendSeq += 1;
          if (opts.saveCounter) opts.saveCounter(state.channelId, state.clientId, state.sendSeq);
          let record;
          try {
            record = codec.seal(state.keys.sendKey, payload, nonce);
          } catch {
            return false;
          }
          return sendFrame(frames.encFrame(state.channelId, record.ciphertext));
        }
        function sendLeave() {
          if (!state.channelId) return false;
          return sendFrame(frames.sessionLeave(state.channelId));
        }
        function reconnectNow() {
          stopTimers();
          closeSocket();
          reconnectTimer = null;
          state.attempt = 0;
          connect();
        }
        function stop() {
          state.manualClose = true;
          stopTimers();
          clearReconnect();
          closeSocket();
          setPhase("closed", "manual");
        }
        function destroy() {
          stop();
          for (const key of Object.keys(listeners)) listeners[key] = [];
        }
        return {
          on,
          connect,
          stop,
          destroy,
          reconnectNow,
          setUrl,
          beginPair,
          cancelPair,
          configureSession,
          clearSession,
          sendCommand,
          sendLeave,
          getState: () => state.phase,
          isReady: () => state.phase === "ready" && !!state.keys,
          getClientId: () => state.clientId,
          getChannelId: () => state.channelId,
          getUrl: () => state.url,
          getPairingState: () => ({ state: flow.state, sas: flow.sas, ttlMs: flow.ttlMs, expiresAt: flow.expiresAt })
        };
      }
      module.exports = { DEFAULT_CONFIG, createConnection };
    }
  });

  // src/store.js
  var require_store = __commonJS({
    "src/store.js"(exports, module) {
      "use strict";
      var PREFIX = "drc.";
      var HISTORY_LIMIT = 80;
      function memoryBackend2() {
        const map = /* @__PURE__ */ new Map();
        return {
          getItem: (key) => map.has(key) ? map.get(key) : null,
          setItem: (key, value) => map.set(key, value),
          removeItem: (key) => map.delete(key),
          clear: () => map.clear()
        };
      }
      function createStore2(backend, options) {
        const opts = options || {};
        const storage = backend || memoryBackend2();
        function read(key, fallback) {
          try {
            const raw = storage.getItem(PREFIX + key);
            if (raw === null || raw === void 0) return fallback;
            return JSON.parse(raw);
          } catch {
            return fallback;
          }
        }
        function write(key, value) {
          try {
            storage.setItem(PREFIX + key, JSON.stringify(value));
          } catch {
          }
        }
        function remove(key) {
          try {
            storage.removeItem(PREFIX + key);
          } catch {
          }
        }
        return {
          read,
          write,
          remove,
          loadInstallId() {
            return read("installId", "");
          },
          ensureInstallId(makeId) {
            const existing = read("installId", "");
            if (existing) return existing;
            const created = makeId ? makeId() : `drc-${Math.random().toString(16).slice(2)}`;
            write("installId", created);
            return created;
          },
          loadHosts() {
            const hosts = read("hosts", []);
            return Array.isArray(hosts) ? hosts : [];
          },
          saveHosts(hosts) {
            write("hosts", Array.isArray(hosts) ? hosts : []);
          },
          loadActive() {
            const value = read("active", null);
            if (!value || typeof value !== "object") return null;
            return { hostId: value.hostId || "", mode: value.mode === "lan" ? "lan" : "relay" };
          },
          saveActive(active) {
            write("active", active || null);
          },
          loadSessions(hostId) {
            const list = read(`sessions.${hostId}`, []);
            return Array.isArray(list) ? list : [];
          },
          saveSessions(hostId, sessions) {
            write(`sessions.${hostId}`, Array.isArray(sessions) ? sessions : []);
          },
          loadHistory(hostId, sessionId) {
            const value = read(`history.${hostId}.${sessionId}`, null);
            if (Array.isArray(value)) return { items: value.slice(-HISTORY_LIMIT), nextBeforeSeq: 0, latestSeq: 0 };
            if (!value || typeof value !== "object") return { items: [], nextBeforeSeq: 0, latestSeq: 0 };
            return {
              items: Array.isArray(value.items) ? value.items.slice(-HISTORY_LIMIT) : [],
              nextBeforeSeq: Number(value.nextBeforeSeq) || 0,
              latestSeq: Number(value.latestSeq) || 0
            };
          },
          saveHistory(hostId, sessionId, state) {
            const value = state || {};
            write(`history.${hostId}.${sessionId}`, {
              items: Array.isArray(value.items) ? value.items.slice(-HISTORY_LIMIT) : [],
              nextBeforeSeq: Number(value.nextBeforeSeq) || 0,
              latestSeq: Number(value.latestSeq) || 0
            });
          },
          loadCounter(channelId, clientId) {
            const value = read(`counter.${channelId}.${clientId}`, 0);
            return Number.isSafeInteger(value) && value >= 0 ? value : 0;
          },
          saveCounter(channelId, clientId, value) {
            if (Number.isSafeInteger(value) && value >= 0) write(`counter.${channelId}.${clientId}`, value);
          },
          clearHistory(hostId) {
            remove(`sessions.${hostId}`);
          }
        };
      }
      module.exports = { PREFIX, HISTORY_LIMIT, memoryBackend: memoryBackend2, createStore: createStore2 };
    }
  });

  // src/client.js
  var require_client = __commonJS({
    "src/client.js"(exports, module) {
      "use strict";
      var codec = require_codec();
      var hostsModel = require_hosts();
      var payloads = require_payloads();
      var chatModel = require_chat_model();
      var sessionList = require_session_list();
      var messageState = require_message_state();
      var { createConnection } = require_connection();
      var { createStore: createStore2 } = require_store();
      var SEND_TIMEOUT_MS = payloads.COMMAND_TIMEOUT_MS;
      var HISTORY_PAGE_LIMIT = 40;
      var HISTORY_TIMEOUT_MS = 15e3;
      var IMAGE_RETRY_DELAY_MS = 12e3;
      var IMAGE_RETRY_LIMIT = 6;
      var DEFAULT_RELAY_URL = "";
      var PAIR_FAIL_TEXT = {
        invalid_or_expired: "\u914D\u5BF9\u7801\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u5728\u7535\u8111\u4E0A\u70B9\u300C\u5237\u65B0\u300D\u91CD\u65B0\u751F\u6210",
        already_used: "\u914D\u5BF9\u7801\u5DF2\u7ECF\u88AB\u4F7F\u7528\uFF0C\u8BF7\u5728\u7535\u8111\u4E0A\u91CD\u65B0\u751F\u6210",
        host_offline: "\u4E3B\u673A\u4E0D\u5728\u7EBF\uFF0C\u8BF7\u786E\u8BA4\u7535\u8111\u4E0A\u7684 DSH \u5DF2\u542F\u52A8",
        bad_token: "\u914D\u5BF9\u7801\u5FC5\u987B\u662F 6 \u4F4D\u6570\u5B57",
        timeout: "\u914D\u5BF9\u8D85\u65F6\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\u7535\u8111\u4E0A\u7684 6 \u4F4D\u7801"
      };
      var ERROR_TEXT = {
        bad_token: "\u4E3B\u673A\u4EE4\u724C\u65E0\u6548",
        unknown_session: "\u914D\u5BF9\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u914D\u5BF9",
        not_member: "\u5F53\u524D\u914D\u5BF9\u4E0D\u5C5E\u4E8E\u8FD9\u4E2A\u4F1A\u8BDD",
        host_unavailable: "\u4E3B\u673A\u6682\u65F6\u4E0D\u5728\u7EBF\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
        rate_limited: "\u64CD\u4F5C\u592A\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
        unsupported_protocol: "\u534F\u8BAE\u7248\u672C\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u66F4\u65B0\u5BA2\u6237\u7AEF",
        bad_frame: "\u4E3B\u673A\u4E0D\u63A5\u53D7\u8FD9\u6761\u8BF7\u6C42",
        history_window_exceeded: "\u5386\u53F2\u7A97\u53E3\u5DF2\u8FC7\u671F\uFF0C\u6B63\u5728\u91CD\u65B0\u52A0\u8F7D",
        internal: "\u4E3B\u673A\u5185\u90E8\u9519\u8BEF"
      };
      function createClient2(options) {
        const opts = options || {};
        const backend = opts.backend || null;
        const store = opts.store || createStore2(backend);
        const now = opts.now || (() => Date.now());
        const setTimeoutFn = opts.setTimeout || ((fn, ms) => setTimeout(fn, ms));
        const clearTimeoutFn = opts.clearTimeout || ((id) => clearTimeout(id));
        const defaults = opts.defaults || {};
        const makeSocket = opts.factory;
        const state = {
          hosts: [],
          activeHostId: "",
          mode: "relay",
          status: { phase: "idle", detail: "", hostOnline: false, paired: false },
          sessions: [],
          sessionsUpdatedAt: 0,
          reconcileRunState: false,
          currentSessionId: "",
          hostInfo: null,
          limits: null,
          keepAwake: { enabled: false, active: false, backend: "", platform: "" },
          pairing: { state: "idle", sas: "", error: "", token: "" }
        };
        const models = /* @__PURE__ */ new Map();
        const historyReq = /* @__PURE__ */ new Map();
        const historyBuffers = /* @__PURE__ */ new Map();
        const historyStatus = /* @__PURE__ */ new Map();
        const pendingPermissions = /* @__PURE__ */ new Map();
        const pendingQuestions = /* @__PURE__ */ new Map();
        const pendingSends = /* @__PURE__ */ new Map();
        const sendByCmd = /* @__PURE__ */ new Map();
        const pendingCommands = /* @__PURE__ */ new Map();
        const permissionRequests = /* @__PURE__ */ new Map();
        let connection = null;
        let connectionUrl = "";
        let pendingPairData = null;
        let lastRefreshAt = 0;
        let seq = 0;
        let installId = "";
        const listeners = /* @__PURE__ */ Object.create(null);
        function on(event, fn) {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(fn);
          return () => {
            const list = listeners[event];
            const index = list.indexOf(fn);
            if (index !== -1) list.splice(index, 1);
          };
        }
        function emit(event, data) {
          for (const fn of (listeners[event] || []).slice()) {
            try {
              fn(data);
            } catch {
            }
          }
        }
        function toast2(message, tone) {
          emit("toast", { message, tone: tone || "info" });
        }
        function makeId(prefix) {
          seq += 1;
          return `${prefix}_${now().toString(36)}_${seq.toString(36)}`;
        }
        function normalizeHost(raw) {
          const host = hostsModel.createHost(raw && raw.id, raw && raw.label);
          host.createdAt = raw && raw.createdAt || 0;
          for (const mode of hostsModel.MODES) {
            const endpoint = raw && raw.endpoints ? raw.endpoints[mode] : null;
            if (endpoint && endpoint.url) {
              host.endpoints[mode] = {
                url: endpoint.url,
                pskKey: `psk:${mode}`,
                pairing: endpoint.pairing || null
              };
            }
          }
          host.activeMode = raw && raw.activeMode === "lan" ? "lan" : raw && raw.activeMode === "relay" ? "relay" : "";
          return host;
        }
        function loadHosts() {
          const saved = store.loadHosts();
          state.hosts = Array.isArray(saved) ? saved.map(normalizeHost) : [];
          const active = store.loadActive();
          if (active && state.hosts.some((host2) => host2.id === active.hostId)) {
            state.activeHostId = active.hostId;
            state.mode = active.mode;
          } else if (state.hosts.length) {
            state.activeHostId = state.hosts[0].id;
            state.mode = state.hosts[0].activeMode || "relay";
          }
          const host = activeHost();
          if (host && !host.activeMode) host.activeMode = state.mode;
          emit("hosts", getHostsSnapshot());
        }
        function saveHosts() {
          store.saveHosts(state.hosts);
          store.saveActive({ hostId: state.activeHostId, mode: state.mode });
        }
        function activeHost() {
          return state.hosts.find((host) => host.id === state.activeHostId) || null;
        }
        function activeEndpoint() {
          const host = activeHost();
          if (!host) return null;
          return host.endpoints[state.mode] || null;
        }
        function getHostsSnapshot() {
          return {
            hosts: state.hosts.map((host) => ({
              id: host.id,
              label: host.label,
              active: host.id === state.activeHostId,
              activeMode: host.activeMode,
              endpoints: {
                relay: host.endpoints.relay ? { url: host.endpoints.relay.url, paired: hostsModel.hasPairing(host, "relay") } : null,
                lan: host.endpoints.lan ? { url: host.endpoints.lan.url, paired: hostsModel.hasPairing(host, "lan") } : null
              }
            })),
            activeHostId: state.activeHostId,
            mode: state.mode
          };
        }
        function addHost(input) {
          const fields = input || {};
          const id = `h_${codec.randomBytes(6).reduce((text, byte) => text + byte.toString(16).padStart(2, "0"), "")}`;
          const host = hostsModel.createHost(id, fields.label || "\u6211\u7684\u7535\u8111");
          host.createdAt = now();
          if (fields.relayUrl) hostsModel.setEndpoint(host, "relay", fields.relayUrl);
          if (fields.lanAddress) hostsModel.setEndpoint(host, "lan", fields.lanAddress);
          let mode = fields.mode === "lan" || fields.mode === "relay" ? fields.mode : "";
          if (!mode) mode = host.endpoints.lan ? "lan" : "relay";
          if (mode === "lan" && !host.endpoints.lan && host.endpoints.relay) mode = "relay";
          if (mode === "relay" && !host.endpoints.relay && host.endpoints.lan) mode = "lan";
          host.activeMode = mode;
          state.hosts.push(host);
          state.activeHostId = host.id;
          state.mode = host.activeMode;
          saveHosts();
          emit("hosts", getHostsSnapshot());
          return host;
        }
        function updateHost(id, patch) {
          const host = state.hosts.find((item) => item.id === id);
          if (!host) throw new Error("host not found");
          if (patch && patch.label) host.label = String(patch.label);
          if (patch && patch.relayUrl !== void 0) {
            if (patch.relayUrl) hostsModel.setEndpoint(host, "relay", patch.relayUrl);
            else {
              host.endpoints.relay = null;
              if (state.activeHostId === host.id && state.mode === "relay") disconnect();
            }
          }
          if (patch && patch.lanAddress !== void 0) {
            if (patch.lanAddress) hostsModel.setEndpoint(host, "lan", patch.lanAddress);
            else {
              host.endpoints.lan = null;
              if (state.activeHostId === host.id && state.mode === "lan") disconnect();
            }
          }
          saveHosts();
          emit("hosts", getHostsSnapshot());
          return host;
        }
        function removeHost(id) {
          const index = state.hosts.findIndex((host) => host.id === id);
          if (index === -1) return;
          if (state.activeHostId === id) {
            disconnect();
            models.clear();
            historyReq.clear();
            historyBuffers.clear();
            historyStatus.clear();
            pendingPermissions.clear();
            pendingQuestions.clear();
          }
          state.hosts.splice(index, 1);
          if (state.activeHostId === id) {
            state.activeHostId = state.hosts.length ? state.hosts[0].id : "";
            const host = activeHost();
            state.mode = host ? host.activeMode || "relay" : "relay";
            state.currentSessionId = "";
            state.sessions = host ? sessionList.normalizeSessions(store.loadSessions(sessionCacheKey())) : [];
          }
          saveHosts();
          emit("hosts", getHostsSnapshot());
          emit("sessions", state.sessions);
          emit("pending", getPendingSnapshot());
        }
        function selectHost(id) {
          const host = state.hosts.find((item) => item.id === id);
          if (!host) return false;
          if (id === state.activeHostId) return true;
          disconnect();
          for (const pending of historyReq.values()) {
            if (pending.timer) clearTimeoutFn(pending.timer);
          }
          historyReq.clear();
          historyBuffers.clear();
          historyStatus.clear();
          models.clear();
          pendingPermissions.clear();
          pendingQuestions.clear();
          state.activeHostId = id;
          state.mode = host.activeMode || (host.endpoints.relay ? "relay" : "lan");
          host.activeMode = state.mode;
          state.currentSessionId = "";
          state.sessions = sessionList.normalizeSessions(store.loadSessions(sessionCacheKey()));
          persist();
          emit("hosts", getHostsSnapshot());
          emit("sessions", state.sessions);
          emit("pending", getPendingSnapshot());
          emit("session", { sessionId: "" });
          return true;
        }
        function persist() {
          saveHosts();
        }
        function setMode(mode) {
          if (mode !== "relay" && mode !== "lan") throw new Error("bad mode");
          const host = activeHost();
          if (!host) throw new Error("no host");
          if (!host.endpoints[mode]) throw new Error("endpoint not configured");
          const wasActive = !!connection && state.status.phase !== "closed" && state.status.phase !== "idle";
          disconnect();
          state.mode = mode;
          host.activeMode = mode;
          persist();
          emit("hosts", getHostsSnapshot());
          if (wasActive) connect();
        }
        function clearHistoryCaches() {
          const host = activeHost();
          if (!host) return;
          models.clear();
          historyReq.clear();
          historyBuffers.clear();
          historyStatus.clear();
          try {
            store.clearHistory(host.id);
          } catch {
          }
          state.sessions = [];
          emit("sessions", state.sessions);
          emit("chat", { sessionId: state.currentSessionId });
        }
        function connectionConfig() {
          const host = activeHost();
          const endpoint = host ? host.endpoints[state.mode] : null;
          return { host, endpoint };
        }
        function destroyConnection() {
          if (connection) {
            try {
              connection.destroy();
            } catch {
            }
          }
          connection = null;
          connectionUrl = "";
        }
        function ensureConnection() {
          const { host, endpoint } = connectionConfig();
          if (!host) throw new Error("\u8BF7\u5148\u6DFB\u52A0\u4E3B\u673A");
          if (!endpoint) throw new Error(`\u8FD8\u6CA1\u6709\u914D\u7F6E${hostsModel.describeMode(state.mode)}\u5730\u5740`);
          if (connection && connectionUrl === endpoint.url) return connection;
          destroyConnection();
          connectionUrl = endpoint.url;
          connection = createConnection({
            url: endpoint.url,
            clientId: installId,
            label: "DSH Remoto",
            platform: "android",
            softwareVersion: opts.softwareVersion || "0.3.0",
            factory: makeSocket,
            loadCounter: (channelId, clientId) => store.loadCounter(channelId, clientId),
            saveCounter: (channelId, clientId, value) => store.saveCounter(channelId, clientId, value),
            config: opts.config
          });
          wireConnection(connection);
          if (endpoint.pairing) {
            try {
              connection.configureSession({
                channelId: endpoint.pairing.channelId,
                hostId: endpoint.pairing.hostId,
                psk: endpoint.pairing.psk,
                clientId: endpoint.pairing.clientId
              });
            } catch {
            }
          }
          return connection;
        }
        function wireConnection(conn) {
          conn.on("state", (data) => {
            state.status.phase = data.state;
            state.status.detail = data.detail || "";
            if (data.hostOnline !== void 0) state.status.hostOnline = !!data.hostOnline;
            if (data.state === "offline" || data.state === "closed") state.status.paired = false;
            emit("state", getStateSnapshot());
          });
          conn.on("ready", (data) => {
            const { endpoint } = connectionConfig();
            state.status.paired = !!(endpoint && endpoint.pairing);
            emit("state", getStateSnapshot());
            if (data && data.paired) {
              const stamp = now();
              if (stamp - lastRefreshAt > 1200) {
                lastRefreshAt = stamp;
                refreshSessions();
                getPending();
              }
            }
          });
          conn.on("pair", (data) => {
            if (data.stage === "claiming" || data.stage === "waiting-connection") {
              state.pairing = { state: "claiming", sas: "", error: "", token: data.token || state.pairing.token };
            } else if (data.stage === "verify") {
              state.pairing = { ...state.pairing, state: "verify", sas: data.sas || "" };
            } else if (data.stage === "paired") {
              pendingPairData = data;
              state.pairing = { ...state.pairing, state: "verify", sas: data.sas || state.pairing.sas };
              emit("pair", getPairingSnapshot());
              return;
            } else if (data.stage === "fail") {
              state.pairing = { state: "failed", sas: "", error: PAIR_FAIL_TEXT[data.reason] || PAIR_FAIL_TEXT.invalid_or_expired, token: "" };
              emit("pair", getPairingSnapshot());
              toast2(state.pairing.error, "error");
              return;
            } else if (data.stage === "cancelled") {
              state.pairing = { state: "idle", sas: "", error: "", token: "" };
            }
            emit("pair", getPairingSnapshot());
          });
          conn.on("payload", handlePayload);
          conn.on("lost", (data) => {
            const { host, endpoint } = connectionConfig();
            if (host && endpoint && endpoint.pairing) {
              hostsModel.clearPairing(host, state.mode);
              persist();
              emit("hosts", getHostsSnapshot());
            }
            state.status.paired = false;
            const text = data.reason === "unknown_session" ? "\u914D\u5BF9\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\u7535\u8111\u4E0A\u7684 6 \u4F4D\u7801" : "\u65E0\u6CD5\u89E3\u5BC6\u4E3B\u673A\u6D88\u606F\uFF0C\u8BF7\u91CD\u65B0\u914D\u5BF9";
            toast2(text, "error");
            emit("state", getStateSnapshot());
            emit("hosts", getHostsSnapshot());
          });
          conn.on("error", (data) => {
            const text = ERROR_TEXT[data.code] || data.message || data.code;
            toast2(text, "error");
            if (data.code === "history_window_exceeded") {
              const pending = Array.from(historyReq.values()).find((item) => item.since);
              if (pending) requestHistory(pending.sessionId, { older: false, force: true });
            }
          });
          conn.on("protocol-error", (data) => {
            if (data.reason !== "unknown_frame") toast2(`\u534F\u8BAE\u5E27\u5F02\u5E38\uFF1A${data.reason}`, "error");
          });
          conn.on("resume-gap", () => {
            if (state.currentSessionId) requestHistory(state.currentSessionId, { older: false, force: true });
          });
        }
        function acceptPairing(data) {
          const { host, endpoint } = connectionConfig();
          if (!host || !endpoint) return;
          const pairing = {
            channelId: data.channelId,
            hostId: data.hostId || "",
            psk: data.psk,
            clientId: data.clientId || installId,
            pairedAt: now(),
            sendSeq: 0
          };
          hostsModel.setPairing(host, state.mode, pairing);
          host.endpoints[state.mode].url = endpoint.url;
          persist();
          state.status.paired = true;
          state.pairing = { state: "paired", sas: data.sas || state.pairing.sas, error: "", token: "" };
          emit("pair", getPairingSnapshot());
          try {
            connection.configureSession({
              channelId: pairing.channelId,
              hostId: pairing.hostId,
              psk: pairing.psk,
              clientId: pairing.clientId
            });
          } catch {
          }
          emit("hosts", getHostsSnapshot());
          emit("state", getStateSnapshot());
          toast2("\u914D\u5BF9\u6210\u529F", "ok");
          refreshSessions();
          getPending();
        }
        function connect() {
          try {
            const conn = ensureConnection();
            conn.connect();
          } catch (error) {
            toast2(String(error.message || error), "error");
            throw error;
          }
        }
        function disconnect() {
          if (connection) connection.stop();
          state.status.phase = "closed";
          state.status.paired = false;
          emit("state", getStateSnapshot());
        }
        function resume(hiddenForMs) {
          if (!connection) return;
          if (hiddenForMs > 5e3 || state.status.phase !== "ready") connection.reconnectNow();
          else refreshSessions();
        }
        function pair(code) {
          const token = String(code || "").trim();
          if (!/^\d{6}$/.test(token)) throw new Error("\u914D\u5BF9\u7801\u5FC5\u987B\u662F 6 \u4F4D\u6570\u5B57");
          const { endpoint } = connectionConfig();
          if (!endpoint) throw new Error("\u8BF7\u5148\u586B\u5199\u4E2D\u7EE7\u5730\u5740\u6216\u5C40\u57DF\u7F51\u5730\u5740");
          pendingPairData = null;
          state.pairing = { state: "claiming", sas: "", error: "", token };
          const conn = ensureConnection();
          conn.beginPair(token);
          if (state.status.phase !== "handshaking" && state.status.phase !== "ready" && state.status.phase !== "online") {
            conn.connect();
          }
          emit("pair", getPairingSnapshot());
        }
        function confirmPairing() {
          if (!pendingPairData) return false;
          const data = pendingPairData;
          pendingPairData = null;
          acceptPairing(data);
          return true;
        }
        function cancelPair() {
          pendingPairData = null;
          if (connection) connection.cancelPair();
          state.pairing = { state: "idle", sas: "", error: "", token: "" };
          emit("pair", getPairingSnapshot());
        }
        function forgetPairing() {
          const host = activeHost();
          if (!host) return;
          hostsModel.clearPairing(host, state.mode);
          persist();
          if (connection) connection.clearSession();
          state.status.paired = false;
          state.sessions = [];
          models.clear();
          emit("hosts", getHostsSnapshot());
          emit("state", getStateSnapshot());
          emit("sessions", state.sessions);
        }
        function getStateSnapshot() {
          return {
            phase: state.status.phase,
            detail: state.status.detail,
            hostOnline: state.status.hostOnline,
            paired: state.status.paired,
            mode: state.mode,
            hostId: state.activeHostId,
            url: activeEndpoint() ? activeEndpoint().url : ""
          };
        }
        function getPairingSnapshot() {
          return {
            ...state.pairing,
            mode: state.mode,
            url: activeEndpoint() ? activeEndpoint().url : ""
          };
        }
        function sendCommand(payload, meta) {
          if (!connection || !connection.isReady()) return false;
          const sent = connection.sendCommand(payload);
          if (sent) {
            const entry = { ...payload, at: now(), ...meta };
            pendingCommands.set(payload.cmdId, entry);
            const timer = setTimeoutFn(() => {
              if (pendingCommands.has(payload.cmdId)) {
                pendingCommands.delete(payload.cmdId);
                if (meta && meta.onTimeout) meta.onTimeout();
              }
            }, SEND_TIMEOUT_MS);
            entry.timer = timer;
          }
          return sent;
        }
        function settleCommand(cmdId) {
          const entry = pendingCommands.get(cmdId);
          if (!entry) return null;
          pendingCommands.delete(cmdId);
          if (entry.timer) clearTimeoutFn(entry.timer);
          return entry;
        }
        function refreshSessions() {
          if (!connection || !connection.isReady()) return false;
          state.reconcileRunState = true;
          return sendCommand(payloads.listSessions(makeId("cmd")));
        }
        function getPending(sessionId) {
          if (!connection || !connection.isReady()) return false;
          return sendCommand(payloads.getPending(makeId("cmd"), { sessionId }));
        }
        function sessionCacheKey() {
          return state.activeHostId || "nohost";
        }
        function ensureModel(sessionId) {
          if (models.has(sessionId)) return models.get(sessionId);
          const model = chatModel.createChatModel();
          const cached = store.loadHistory(sessionCacheKey(), sessionId);
          if (cached.items.length) chatModel.applyHistoryPage(model, cached.items, { older: false });
          model.nextBeforeSeq = cached.nextBeforeSeq || 0;
          model.historyLoaded = cached.items.length > 0;
          models.set(sessionId, model);
          return model;
        }
        function openSession(sessionId) {
          if (!sessionId) return;
          state.currentSessionId = sessionId;
          const model = ensureModel(sessionId);
          const summary = sessionList.findSession(state.sessions, sessionId);
          if (summary && (summary.running || summary.state === "running") && model.runState !== "running") {
            model.runState = "running";
            model.runStartedAt = Date.now();
          } else if (summary && !summary.running && summary.state !== "running" && model.runState === "running") {
            model.runState = "idle";
            model.runStartedAt = 0;
          }
          emit("session", { sessionId, session: summary });
          emit("chat", { sessionId });
          if (connection && connection.isReady()) {
            requestHistory(sessionId, { older: false });
            getPending(sessionId);
          } else {
            historyStatus.set(sessionId, { loading: false, error: "\u79BB\u7EBF\uFF0C\u663E\u793A\u672C\u5730\u7F13\u5B58" });
            emit("history", { sessionId, ...historyStatus.get(sessionId) });
          }
        }
        function requestHistory(sessionId, options2) {
          const opts2 = options2 || {};
          const model = ensureModel(sessionId);
          const status = historyStatus.get(sessionId) || { loading: false, error: "" };
          if (status.loading && !opts2.force) return false;
          if (!connection || !connection.isReady()) {
            historyStatus.set(sessionId, { loading: false, error: "\u79BB\u7EBF\uFF0C\u663E\u793A\u672C\u5730\u7F13\u5B58" });
            emit("history", { sessionId, ...historyStatus.get(sessionId) });
            return false;
          }
          if (opts2.older && !model.nextBeforeSeq) return false;
          for (const [id, pending] of Array.from(historyReq.entries())) {
            if (pending.sessionId !== sessionId) continue;
            clearTimeoutFn(pending.timer);
            historyReq.delete(id);
          }
          const cmdId = makeId(opts2.older ? "old" : "hist");
          const fields = { sessionId, limit: HISTORY_PAGE_LIMIT };
          if (opts2.older) fields.beforeSeq = model.nextBeforeSeq;
          const timer = setTimeoutFn(() => {
            const pending = historyReq.get(cmdId);
            if (!pending) return;
            historyReq.delete(cmdId);
            historyStatus.set(sessionId, { loading: false, error: "\u8BFB\u53D6\u8D85\u65F6\uFF0C\u663E\u793A\u672C\u5730\u7F13\u5B58" });
            emit("history", { sessionId, ...historyStatus.get(sessionId) });
          }, HISTORY_TIMEOUT_MS);
          historyReq.set(cmdId, { sessionId, older: !!opts2.older, timer });
          historyStatus.set(sessionId, { loading: true, error: "" });
          emit("history", { sessionId, loading: true, error: "" });
          const sent = sendCommand(payloads.sessionHistory(cmdId, fields));
          if (!sent) {
            clearTimeoutFn(timer);
            historyReq.delete(cmdId);
            historyStatus.set(sessionId, { loading: false, error: "\u672A\u8FDE\u63A5\uFF0C\u663E\u793A\u672C\u5730\u7F13\u5B58" });
            emit("history", { sessionId, ...historyStatus.get(sessionId) });
            return false;
          }
          return true;
        }
        function loadEarlier() {
          if (!state.currentSessionId) return false;
          return requestHistory(state.currentSessionId, { older: true });
        }
        function handleHistory(payload) {
          const pending = historyReq.get(payload.cmdId);
          if (!pending) return;
          if (pending.sessionId !== payload.sessionId) return;
          clearTimeoutFn(pending.timer);
          historyReq.delete(payload.cmdId);
          const model = ensureModel(payload.sessionId);
          const items = Array.isArray(payload.items) ? payload.items : [];
          chatModel.applyHistoryPage(model, items, {
            older: pending.older,
            nextBeforeSeq: payload.nextBeforeSeq || 0,
            historyEmpty: items.length === 0
          });
          if (typeof payload.latestSeq === "number") model.latestSeq = payload.latestSeq;
          for (const item of items) {
            if (item && item.t === "ev.message_delta" && item.role === "user" && item.done) {
              confirmEcho({ sessionId: payload.sessionId, messageId: item.messageId });
            }
          }
          const cached = store.loadHistory(sessionCacheKey(), payload.sessionId);
          let cachedItems;
          if (pending.older) {
            cachedItems = items.concat(cached.items);
          } else {
            cachedItems = items;
          }
          store.saveHistory(sessionCacheKey(), payload.sessionId, {
            items: cachedItems,
            nextBeforeSeq: payload.nextBeforeSeq || 0,
            latestSeq: payload.latestSeq || cached.latestSeq || 0
          });
          historyStatus.set(payload.sessionId, { loading: false, error: "" });
          flushHistoryBuffer(payload.sessionId);
          emit("history", { sessionId: payload.sessionId, loading: false, error: "" });
          emit("chat", { sessionId: payload.sessionId });
        }
        function bufferDuringHistory(sessionId, payload) {
          if (!sessionId || sessionId !== state.currentSessionId) return false;
          const hasRequest = Array.from(historyReq.values()).some(
            (item) => item.sessionId === sessionId && !item.older
          );
          if (!hasRequest) return false;
          if (!historyBuffers.has(sessionId)) historyBuffers.set(sessionId, []);
          historyBuffers.get(sessionId).push(payload);
          return true;
        }
        function flushHistoryBuffer(sessionId) {
          const list = historyBuffers.get(sessionId);
          if (!list || !list.length) return;
          historyBuffers.delete(sessionId);
          const model = ensureModel(sessionId);
          for (const payload of list) applyChatPayload(model, payload, { fromBuffer: true, history: true });
        }
        function applyChatPayload(model, payload, options2) {
          const opts2 = options2 || {};
          const result = chatModel.applyEvent(model, payload, { history: !!opts2.history });
          if (result.changed) {
            if (!opts2.fromBuffer) appendLiveCache(payload);
          }
          return result;
        }
        function appendLiveCache(payload) {
          if (!payload.sessionId) return;
          if (payload.t === "ev.artifact" && payload.data) return;
          try {
            const hostKey = sessionCacheKey();
            const cached = store.loadHistory(hostKey, payload.sessionId);
            cached.items.push(payload);
            store.saveHistory(hostKey, payload.sessionId, {
              items: cached.items.slice(-120),
              nextBeforeSeq: cached.nextBeforeSeq,
              latestSeq: cached.latestSeq
            });
          } catch {
          }
        }
        function chatPayloadTouches(payload, sessionId) {
          if (!payload.sessionId) return false;
          return payload.sessionId === sessionId;
        }
        function handlePayload(payload) {
          if (!payload || typeof payload.t !== "string") return;
          switch (payload.t) {
            case "ev.session_changed":
              onSessions(payload);
              return;
            case "ev.session_history":
              handleHistory(payload);
              return;
            case "ev.result":
              onResult(payload);
              return;
            case "ev.host_info":
              state.hostInfo = payload;
              state.limits = payload.limits || null;
              emit("host", payload);
              return;
            case "ev.keep_awake_state":
              state.keepAwake = {
                enabled: !!payload.enabled,
                active: !!payload.active,
                backend: payload.backend || "",
                platform: payload.platform || ""
              };
              emit("keepAwake", state.keepAwake);
              return;
            case "ev.permission_request":
              onPermissionRequest(payload);
              return;
            case "ev.permission_resolved":
              onPermissionResolved(payload);
              return;
            case "ev.question_request":
              onQuestionRequest(payload);
              return;
            case "ev.question_resolved":
              onQuestionResolved(payload);
              return;
            default:
              break;
          }
          if (!payload.sessionId) return;
          if (payload.sessionId !== state.currentSessionId) return;
          if (bufferDuringHistory(payload.sessionId, payload)) return;
          const model = ensureModel(payload.sessionId);
          const result = applyChatPayload(model, payload);
          if (!result.changed) return;
          if (payload.t === "ev.message_delta" && payload.role === "user" && payload.done) {
            confirmEcho(payload);
          }
          if (payload.t === "ev.run_state") {
            const session = state.sessions.find((item) => item.id === payload.sessionId);
            if (session) {
              session.state = payload.state === "running" ? "running" : session.state === "archived" ? "archived" : "idle";
              session.running = payload.state === "running";
              emit("sessions", state.sessions);
            }
          }
          emit("chat", { sessionId: payload.sessionId });
        }
        function confirmEcho(payload) {
          const model = models.get(payload.sessionId);
          if (!model) return;
          const block = model.byId.get(payload.messageId);
          if (!block || !block.clientMsgId) return;
          const entry = pendingSends.get(block.clientMsgId);
          if (!entry) return;
          if (entry.timer) clearTimeoutFn(entry.timer);
          sendByCmd.delete(entry.cmdId);
          messageState.markAccepted(entry.message);
          block.state = "accepted";
          block.error = "";
          pendingSends.delete(block.clientMsgId);
        }
        function onSessions(payload) {
          const sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
          state.sessions = sessions;
          state.sessionsUpdatedAt = now();
          store.saveSessions(sessionCacheKey(), sessions);
          emit("sessions", sessions);
          emit("session", {
            sessionId: state.currentSessionId,
            session: sessionList.findSession(sessions, state.currentSessionId)
          });
          if (state.reconcileRunState) {
            state.reconcileRunState = false;
            const summary = sessionList.findSession(sessions, state.currentSessionId);
            const model = models.get(state.currentSessionId);
            if (model && summary && !summary.running && summary.state !== "running" && model.runState === "running") {
              model.runState = "idle";
              model.runStartedAt = 0;
              emit("chat", { sessionId: state.currentSessionId });
            }
          }
        }
        function onResult(payload) {
          const permission = permissionRequests.get(payload.cmdId);
          if (permission) {
            permissionRequests.delete(payload.cmdId);
            if (permission.timer) clearTimeoutFn(permission.timer);
            if (payload.ok) permission.resolve(payload.data || {});
            else permission.reject(new Error(payload.message || "\u6743\u9650\u64CD\u4F5C\u5931\u8D25"));
            return;
          }
          const sendEntry = sendByCmd.get(payload.cmdId);
          if (sendEntry) {
            sendByCmd.delete(payload.cmdId);
            onSendResult(sendEntry, payload);
            return;
          }
          const entry = settleCommand(payload.cmdId);
          if (entry && entry.kind === "resolve_permission") {
            const card = pendingPermissions.get(entry.requestId);
            if (card) {
              card.state = payload.ok ? "submitted" : "open";
              emit("pending", getPendingSnapshot());
            }
          }
          if (entry && entry.kind === "answer") {
            const card = pendingQuestions.get(entry.requestId);
            if (card) {
              card.state = payload.ok ? "submitted" : "open";
              emit("pending", getPendingSnapshot());
            }
          }
          if (!payload.ok) {
            toast2(payload.message || "\u4E3B\u673A\u8FD4\u56DE\u5931\u8D25", "error");
          } else if (entry && entry.kind === "new_session") {
            const newId = payload.data && payload.data.sessionId;
            refreshSessions();
            if (newId) {
              setTimeoutFn(() => {
                openSession(newId);
                refreshSessions();
              }, 400);
            }
          } else if (entry && (entry.kind === "archive" || entry.kind === "unarchive")) {
            refreshSessions();
          }
        }
        function clearImageRetry(block) {
          if (!block) return;
          if (block.retryTimer) {
            clearTimeoutFn(block.retryTimer);
            block.retryTimer = null;
          }
          block.retryPending = false;
        }
        function scheduleImageRetry(entry, block) {
          clearImageRetry(block);
          block.retryPending = true;
          block.retryTimer = setTimeoutFn(() => {
            block.retryTimer = null;
            if (!block.retryPending) return;
            block.retryPending = false;
            if (block.state !== "failed" || block.fileFallbackSent) return;
            if (state.currentSessionId !== entry.sessionId) return;
            if (!connection || !connection.isReady()) return;
            const result = retrySend(entry.clientMsgId, { auto: true });
            if (!result.ok) {
              block.error = result.error || "\u81EA\u52A8\u91CD\u8BD5\u5931\u8D25";
              emit("chat", { sessionId: entry.sessionId });
            }
          }, IMAGE_RETRY_DELAY_MS);
        }
        function cancelImageRetry(clientMsgId) {
          const model = models.get(state.currentSessionId);
          const block = model ? model.byId.get(clientMsgId) : null;
          if (block) clearImageRetry(block);
        }
        function onSendResult(entry, payload) {
          const block = models.get(entry.sessionId) ? models.get(entry.sessionId).byId.get(entry.clientMsgId) : null;
          if (payload.ok) {
            if (entry.timer) clearTimeoutFn(entry.timer);
            if (block) {
              clearImageRetry(block);
              block.retryCount = 0;
            }
            messageState.markAccepted(entry.message);
            pendingSends.delete(entry.clientMsgId);
            if (block) {
              block.state = "accepted";
              block.error = "";
              emit("chat", { sessionId: entry.sessionId });
            }
          } else {
            if (entry.timer) clearTimeoutFn(entry.timer);
            const hadImages = !!(block && (block.images || []).length);
            const raw = String(payload.message || "");
            const busyReject = hadImages && /prompt rejected/i.test(raw);
            const unsupported = hadImages && /does not support image input/i.test(raw);
            let message = payload.message || "\u53D1\u9001\u5931\u8D25";
            if (busyReject && block) {
              block.retryCount = (block.retryCount || 0) + 1;
              if (block.retryCount <= IMAGE_RETRY_LIMIT) {
                const seconds = Math.round(IMAGE_RETRY_DELAY_MS / 1e3);
                message = `\u7535\u8111\u6B63\u5728\u5904\u7406\u4E0A\u4E00\u8F6E\uFF0C\u56FE\u7247\u4E0D\u80FD\u6392\u961F\uFF1B${seconds} \u79D2\u540E\u81EA\u52A8\u91CD\u8BD5\uFF08\u7B2C ${block.retryCount}/${IMAGE_RETRY_LIMIT} \u6B21\uFF09`;
                scheduleImageRetry(entry, block);
              } else {
                message = "\u56FE\u7247\u4ECD\u672A\u53D1\u51FA\uFF1A\u7535\u8111\u53EF\u80FD\u4E00\u76F4\u5728\u5FD9\u3002\u53EF\u4EE5\u70B9\u201C\u91CD\u8BD5\u201D\uFF0C\u6216\u201C\u6539\u6210\u6587\u4EF6\u53D1\u9001\u201D\u3002";
              }
            } else if (unsupported) {
              message = "\u5F53\u524D\u6A21\u578B\u4E0D\u652F\u6301\u56FE\u7247\u8F93\u5165\uFF0C\u8BF7\u70B9\u201C\u6539\u6210\u6587\u4EF6\u53D1\u9001\u201D\u3002";
            }
            messageState.markFailed(entry.message, message);
            pendingSends.delete(entry.clientMsgId);
            if (block) {
              block.state = "failed";
              block.error = message;
              emit("chat", { sessionId: entry.sessionId });
            }
            const finalFailure = !busyReject || block && block.retryCount > IMAGE_RETRY_LIMIT;
            if (!entry.autoRetry || finalFailure) toast2(message, "error");
          }
        }
        function onPermissionRequest(payload) {
          const card = {
            requestId: payload.requestId,
            sessionId: payload.sessionId || "",
            action: payload.action || "",
            resource: payload.resource || "",
            reason: payload.reason || "",
            options: Array.isArray(payload.options) ? payload.options : [],
            expiresAt: payload.expiresAt || "",
            state: "open",
            receivedAt: now()
          };
          pendingPermissions.set(card.requestId, card);
          emit("pending", getPendingSnapshot());
          emit("chat", { sessionId: state.currentSessionId });
        }
        function onPermissionResolved(payload) {
          const card = pendingPermissions.get(payload.requestId);
          if (card) {
            card.state = "resolved";
            card.by = payload.by || "desktop";
            emit("pending", getPendingSnapshot());
            emit("chat", { sessionId: state.currentSessionId });
          }
        }
        function onQuestionRequest(payload) {
          const card = {
            requestId: payload.requestId,
            sessionId: payload.sessionId || "",
            questions: Array.isArray(payload.questions) ? payload.questions : [],
            expiresAt: payload.expiresAt || "",
            state: "open",
            receivedAt: now()
          };
          pendingQuestions.set(card.requestId, card);
          emit("pending", getPendingSnapshot());
          emit("chat", { sessionId: state.currentSessionId });
        }
        function onQuestionResolved(payload) {
          const card = pendingQuestions.get(payload.requestId);
          if (card) {
            card.state = "resolved";
            card.by = payload.by || "desktop";
            emit("pending", getPendingSnapshot());
            emit("chat", { sessionId: state.currentSessionId });
          }
        }
        function getPendingSnapshot() {
          return {
            permissions: Array.from(pendingPermissions.values()),
            questions: Array.from(pendingQuestions.values()),
            count: Array.from(pendingPermissions.values()).filter((card) => card.state === "open").length + Array.from(pendingQuestions.values()).filter((card) => card.state === "open").length
          };
        }
        function sendPrompt(text, attachments) {
          const sessionId = state.currentSessionId;
          if (!sessionId) return { ok: false, error: "\u8BF7\u5148\u8FDB\u5165\u4E00\u4E2A\u4F1A\u8BDD" };
          if (!connection || !connection.isReady()) return { ok: false, error: "\u672A\u8FDE\u63A5\u4E3B\u673A" };
          const images = attachments && attachments.images || [];
          const files = attachments && attachments.files || [];
          const check = payloads.validatePrompt({ text, images, files });
          if (!check.ok) return { ok: false, error: check.error };
          const clientMsgId = makeId("u");
          const cmdId = makeId("cmd");
          const message = messageState.createMessage(text, clientMsgId);
          messageState.transition(message, "sending");
          const model = ensureModel(sessionId);
          const block = chatModel.addLocalUserMessage(model, {
            clientMsgId,
            text,
            images,
            files,
            state: "sending",
            at: now()
          });
          const payload = payloads.sendPrompt(cmdId, { sessionId, text, images, files });
          const sent = connection.sendCommand(payload);
          if (!sent) {
            messageState.markFailed(message, "\u672A\u8FDE\u63A5");
            block.state = "failed";
            block.error = "\u672A\u8FDE\u63A5";
            emit("chat", { sessionId });
            return { ok: false, error: "\u672A\u8FDE\u63A5\u4E3B\u673A" };
          }
          const timer = setTimeoutFn(() => {
            const entry2 = pendingSends.get(clientMsgId);
            if (!entry2) return;
            entry2.timer = null;
            entry2.timedOut = true;
            entry2.block.state = "uncertain";
            entry2.block.error = "\u5DF2\u53D1\u9001\uFF0C\u7B49\u5F85\u4E3B\u673A\u786E\u8BA4";
            emit("chat", { sessionId });
          }, SEND_TIMEOUT_MS);
          const entry = { clientMsgId, cmdId, sessionId, text, images, files, message, block, timer };
          pendingSends.set(clientMsgId, entry);
          sendByCmd.set(cmdId, entry);
          emit("chat", { sessionId });
          return { ok: true, clientMsgId };
        }
        function retrySend(clientMsgId, options2) {
          const existing = pendingSends.get(clientMsgId);
          if (existing) return { ok: false, error: "\u8FD8\u5728\u53D1\u9001\u4E2D" };
          if (!state.currentSessionId) return { ok: false, error: "\u8BF7\u5148\u8FDB\u5165\u4F1A\u8BDD" };
          const model = models.get(state.currentSessionId);
          const block = model ? model.byId.get(clientMsgId) : null;
          if (!block || block.state !== "failed") return { ok: false, error: "\u8FD9\u6761\u6D88\u606F\u4E0D\u9700\u8981\u91CD\u8BD5" };
          if (block.fileFallbackSent) return { ok: false, error: "\u5DF2\u7ECF\u6539\u6210\u6587\u4EF6\u53D1\u9001\u4E86" };
          if (!connection || !connection.isReady()) return { ok: false, error: "\u672A\u8FDE\u63A5\u4E3B\u673A" };
          clearImageRetry(block);
          const cmdId = makeId("cmd");
          const message = messageState.createMessage(
            block.parts.map((part) => part.text).join(""),
            clientMsgId
          );
          messageState.transition(message, "sending");
          const payload = payloads.sendPrompt(cmdId, {
            sessionId: state.currentSessionId,
            text: message.text,
            images: block.images,
            files: block.files
          });
          if (!connection.sendCommand(payload)) return { ok: false, error: "\u672A\u8FDE\u63A5\u4E3B\u673A" };
          block.state = "sending";
          block.error = "";
          const timer = setTimeoutFn(() => {
            const pending = pendingSends.get(clientMsgId);
            if (!pending) return;
            pending.timer = null;
            pending.timedOut = true;
            pending.block.state = "uncertain";
            pending.block.error = "\u5DF2\u53D1\u9001\uFF0C\u7B49\u5F85\u4E3B\u673A\u786E\u8BA4";
            emit("chat", { sessionId: state.currentSessionId });
          }, SEND_TIMEOUT_MS);
          const entry = {
            clientMsgId,
            cmdId,
            sessionId: state.currentSessionId,
            message,
            block,
            timer,
            autoRetry: !!(options2 && options2.auto)
          };
          pendingSends.set(clientMsgId, entry);
          sendByCmd.set(cmdId, entry);
          emit("chat", { sessionId: state.currentSessionId });
          return { ok: true };
        }
        function getPermission() {
          return requestPermission(false, "");
        }
        function setPermission(preset) {
          return requestPermission(true, preset);
        }
        function requestPermission(isSet, preset) {
          return new Promise((resolve, reject) => {
            const sessionId = state.currentSessionId;
            if (!sessionId) {
              reject(new Error("\u8BF7\u5148\u8FDB\u5165\u4E00\u4E2A\u4F1A\u8BDD"));
              return;
            }
            if (!connection || !connection.isReady()) {
              reject(new Error("\u672A\u8FDE\u63A5\u4E3B\u673A"));
              return;
            }
            const cmdId = makeId("perm");
            const timer = setTimeoutFn(() => {
              permissionRequests.delete(cmdId);
              reject(new Error("\u7535\u8111\u6CA1\u6709\u54CD\u5E94"));
            }, 12e3);
            permissionRequests.set(cmdId, { resolve, reject, timer });
            const payload = isSet ? payloads.setPermission(cmdId, { sessionId, preset }) : payloads.getPermission(cmdId, { sessionId });
            if (!connection.sendCommand(payload)) {
              clearTimeoutFn(timer);
              permissionRequests.delete(cmdId);
              reject(new Error("\u672A\u8FDE\u63A5\u4E3B\u673A"));
            }
          });
        }
        function resolvePermission(requestId, decision, note) {
          const card = pendingPermissions.get(requestId);
          if (!card || !card.sessionId) return { ok: false, error: "\u5BA1\u6279\u4E0D\u5B58\u5728" };
          if (!connection || !connection.isReady()) return { ok: false, error: "\u672A\u8FDE\u63A5\u4E3B\u673A" };
          const cmdId = makeId("cmd");
          const sent = sendCommand(
            payloads.resolvePermission(cmdId, {
              sessionId: card.sessionId,
              requestId,
              decision,
              note
            }),
            { kind: "resolve_permission", requestId }
          );
          if (!sent) return { ok: false, error: "\u672A\u8FDE\u63A5\u4E3B\u673A" };
          card.state = "sending";
          emit("pending", getPendingSnapshot());
          return { ok: true };
        }
        function answerQuestion(requestId, answers) {
          const card = pendingQuestions.get(requestId);
          if (!card || !card.sessionId) return { ok: false, error: "\u63D0\u95EE\u4E0D\u5B58\u5728" };
          if (!connection || !connection.isReady()) return { ok: false, error: "\u672A\u8FDE\u63A5\u4E3B\u673A" };
          const cmdId = makeId("cmd");
          const sent = sendCommand(payloads.answer(cmdId, { sessionId: card.sessionId, requestId, answers }), {
            kind: "answer",
            requestId
          });
          if (!sent) return { ok: false, error: "\u672A\u8FDE\u63A5\u4E3B\u673A" };
          card.state = "sending";
          emit("pending", getPendingSnapshot());
          return { ok: true };
        }
        function interrupt(sessionId) {
          const target = sessionId || state.currentSessionId;
          if (!target) return false;
          return sendCommand(payloads.interrupt(makeId("cmd"), { sessionId: target }), { kind: "interrupt" });
        }
        function newSession(workspace) {
          return sendCommand(payloads.newSession(makeId("cmd"), { workspace }), { kind: "new_session" });
        }
        function archiveSession(sessionId, archived) {
          return sendCommand(payloads.archiveSession(makeId("cmd"), { sessionId, archived: archived !== false }), {
            kind: archived === false ? "unarchive" : "archive"
          });
        }
        function setKeepAwake(enabled, idleReleaseSec) {
          return sendCommand(payloads.keepAwake(makeId("cmd"), { enabled, idleReleaseSec }), {
            kind: "keep_awake"
          });
        }
        function clearPendingCards() {
          pendingPermissions.clear();
          pendingQuestions.clear();
          emit("pending", getPendingSnapshot());
        }
        function init() {
          installId = store.ensureInstallId(() => `drc-${codec.randomBytes(8).reduce((t, b) => t + b.toString(16).padStart(2, "0"), "")}`);
          loadHosts();
          const host = activeHost();
          if (host) {
            state.mode = host.activeMode || state.mode;
            state.sessions = sessionList.normalizeSessions(store.loadSessions(sessionCacheKey()));
          }
          emit("sessions", state.sessions);
        }
        function destroy() {
          disconnect();
          for (const entry of pendingCommands.values()) {
            if (entry.timer) clearTimeoutFn(entry.timer);
          }
          pendingCommands.clear();
          for (const entry of permissionRequests.values()) {
            if (entry.timer) clearTimeoutFn(entry.timer);
          }
          permissionRequests.clear();
          sendByCmd.clear();
          for (const entry of pendingSends.values()) {
            if (entry.timer) clearTimeoutFn(entry.timer);
          }
          pendingSends.clear();
          for (const entry of historyReq.values()) {
            if (entry.timer) clearTimeoutFn(entry.timer);
          }
          historyReq.clear();
          historyBuffers.clear();
          destroyConnection();
          for (const key of Object.keys(listeners)) listeners[key] = [];
        }
        function exportConfig() {
          return JSON.stringify(
            {
              app: "DSH Remoto",
              version: opts.softwareVersion || "0.3.1",
              exportedAt: new Date(now()).toISOString(),
              active: { hostId: state.activeHostId, mode: state.mode },
              hosts: state.hosts
            },
            null,
            2
          );
        }
        function importConfig(text) {
          let data;
          try {
            data = typeof text === "string" ? JSON.parse(text) : text;
          } catch {
            throw new Error("JSON \u683C\u5F0F\u4E0D\u5BF9");
          }
          if (!data || !Array.isArray(data.hosts) || data.hosts.length === 0) {
            throw new Error("\u6CA1\u6709\u53EF\u5BFC\u5165\u7684\u4E3B\u673A");
          }
          const hosts = data.hosts.map(normalizeHost).filter((host) => host.id && (host.endpoints.relay || host.endpoints.lan));
          if (!hosts.length) throw new Error("\u914D\u7F6E\u91CC\u6CA1\u6709\u6709\u6548\u7684\u4E3B\u673A\u5730\u5740");
          destroyConnection();
          pendingPairData = null;
          for (const entry of pendingCommands.values()) {
            if (entry.timer) clearTimeoutFn(entry.timer);
          }
          pendingCommands.clear();
          for (const entry of permissionRequests.values()) {
            if (entry.timer) clearTimeoutFn(entry.timer);
          }
          permissionRequests.clear();
          sendByCmd.clear();
          for (const entry of pendingSends.values()) {
            if (entry.timer) clearTimeoutFn(entry.timer);
          }
          pendingSends.clear();
          for (const entry of historyReq.values()) {
            if (entry.timer) clearTimeoutFn(entry.timer);
          }
          historyReq.clear();
          historyBuffers.clear();
          historyStatus.clear();
          models.clear();
          pendingPermissions.clear();
          pendingQuestions.clear();
          state.hosts = hosts;
          const wanted = data.active && data.active.hostId;
          state.activeHostId = hosts.some((host) => host.id === wanted) ? wanted : hosts[0].id;
          const active = activeHost();
          state.mode = data.active && (data.active.mode === "lan" || data.active.mode === "relay") ? data.active.mode : active.activeMode || (active.endpoints.relay ? "relay" : "lan");
          active.activeMode = state.mode;
          state.currentSessionId = "";
          state.status = { phase: "idle", detail: "", hostOnline: false, paired: false };
          state.pairing = { state: "idle", sas: "", error: "", token: "" };
          state.sessions = sessionList.normalizeSessions(store.loadSessions(sessionCacheKey()));
          saveHosts();
          emit("hosts", getHostsSnapshot());
          emit("sessions", state.sessions);
          emit("pending", getPendingSnapshot());
          emit("state", getStateSnapshot());
          emit("session", { sessionId: "" });
          return hosts.length;
        }
        return {
          on,
          init,
          destroy,
          exportConfig,
          importConfig,
          addHost,
          updateHost,
          removeHost,
          selectHost,
          setMode,
          connect,
          disconnect,
          resume,
          pair,
          confirmPairing,
          cancelPair,
          forgetPairing,
          refreshSessions,
          getPending,
          openSession,
          loadEarlier,
          requestHistory,
          sendPrompt,
          retrySend,
          cancelImageRetry,
          getPermission,
          setPermission,
          resolvePermission,
          answerQuestion,
          interrupt,
          newSession,
          archiveSession,
          setKeepAwake,
          clearPendingCards,
          clearHistoryCaches,
          getHosts: getHostsSnapshot,
          getState: getStateSnapshot,
          getPairing: getPairingSnapshot,
          getSessions: () => state.sessions,
          getCurrentSessionId: () => state.currentSessionId,
          getModel: (sessionId) => models.get(sessionId || state.currentSessionId) || null,
          getHistoryStatus: (sessionId) => historyStatus.get(sessionId || state.currentSessionId) || { loading: false, error: "" },
          getPendingCards: getPendingSnapshot,
          getHostInfo: () => state.hostInfo,
          getLimits: () => state.limits,
          getKeepAwake: () => state.keepAwake,
          getDefaults: () => ({ relayUrl: defaults.relayUrl || DEFAULT_RELAY_URL }),
          isReady: () => !!(connection && connection.isReady()),
          _internals: { state, models, pendingSends, pendingPermissions, pendingQuestions, historyReq }
        };
      }
      module.exports = { createClient: createClient2, DEFAULT_RELAY_URL, PAIR_FAIL_TEXT, ERROR_TEXT };
    }
  });

  // web/app.js
  var import_client = __toESM(require_client());
  var import_store = __toESM(require_store());
  var import_session_list = __toESM(require_session_list());
  var import_payloads = __toESM(require_payloads());
  var APP_VERSION = "0.4.0";
  var PROTOCOL_VERSION = "0.5.4";
  var $ = (selector, root = document) => root.querySelector(selector);
  var $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  function esc(value) {
    return String(value === null || value === void 0 ? "" : value).replace(/[&<>"']/g, (ch) => {
      if (ch === "&") return "&amp;";
      if (ch === "<") return "&lt;";
      if (ch === ">") return "&gt;";
      if (ch === '"') return "&quot;";
      return "&#39;";
    });
  }
  function b64Size(data) {
    if (typeof data !== "string") return 0;
    const clean = data.replace(/[^A-Za-z0-9+/=]/g, "");
    const pad = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
    return Math.max(0, Math.floor(clean.length * 3 / 4) - pad);
  }
  function fmtSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  }
  function formatInline(escaped) {
    let html = escaped;
    html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/(^|[\s(])\*([^*\n]+)\*(?=$|[\s).,!?;:])/g, "$1<em>$2</em>");
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
    );
    return html;
  }
  function formatText(text) {
    const parts = String(text || "").split(/```/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const body = part.replace(/^[a-zA-Z0-9_-]*\n/, "");
        return `<pre class="code">${esc(body)}</pre>`;
      }
      const lines = part.split("\n");
      const out = [];
      let para = [];
      let list = "";
      const flushPara = () => {
        if (!para.length) return;
        out.push(`<p>${para.join("<br>")}</p>`);
        para = [];
      };
      const closeList = () => {
        if (!list) return;
        out.push(`</${list}>`);
        list = "";
      };
      for (const raw of lines) {
        const line = raw.replace(/\s+$/, "");
        if (!line.trim()) {
          flushPara();
          closeList();
          continue;
        }
        const heading = line.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
          flushPara();
          closeList();
          const level = heading[1].length;
          out.push(`<h${level}>${formatInline(esc(heading[2]))}</h${level}>`);
          continue;
        }
        if (/^[-*]\s+/.test(line)) {
          flushPara();
          if (list !== "ul") {
            closeList();
            list = "ul";
            out.push("<ul>");
          }
          out.push(`<li>${formatInline(esc(line.replace(/^[-*]\s+/, "")))}</li>`);
          continue;
        }
        if (/^\d+\.\s+/.test(line)) {
          flushPara();
          if (list !== "ol") {
            closeList();
            list = "ol";
            out.push("<ol>");
          }
          out.push(`<li>${formatInline(esc(line.replace(/^\d+\.\s+/, "")))}</li>`);
          continue;
        }
        if (/^>\s?/.test(line)) {
          flushPara();
          closeList();
          out.push(`<blockquote>${formatInline(esc(line.replace(/^>\s?/, "")))}</blockquote>`);
          continue;
        }
        if (/^---+$/.test(line.trim())) {
          flushPara();
          closeList();
          out.push("<hr>");
          continue;
        }
        closeList();
        para.push(formatInline(esc(line)));
      }
      flushPara();
      closeList();
      return out.join("");
    }).join("");
  }
  function makeBackend() {
    try {
      const probe = "__drc_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return window.localStorage;
    } catch {
      return (0, import_store.memoryBackend)();
    }
  }
  var DEFAULTS = globalThis.DRC_DEFAULTS || {};
  var client = (0, import_client.createClient)({
    store: (0, import_store.createStore)(makeBackend()),
    defaults: { relayUrl: DEFAULTS.relayUrl || "", hostLabel: DEFAULTS.hostLabel || "" },
    softwareVersion: APP_VERSION
  });
  globalThis.__drc = client;
  function addHostFromQr(text) {
    const raw = String(text || "").trim();
    if (!raw) return false;
    let url = "";
    let label = "\u626B\u7801\u7535\u8111";
    if (/^dshremote:\/\//i.test(raw)) {
      const parsed = new URL(raw);
      url = parsed.searchParams.get("url") || "";
      label = parsed.searchParams.get("host") || label;
    } else if (/^wss?:\/\//i.test(raw)) {
      url = raw;
    } else if (/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(raw)) {
      url = raw;
    }
    if (!url) {
      toast("\u4E8C\u7EF4\u7801\u91CC\u6CA1\u6709\u53EF\u7528\u7684\u7535\u8111\u5730\u5740", "error");
      return false;
    }
    const isLan = /^ws:\/\//i.test(url) && !/^ws:\/\/(127\.|localhost)/i.test(url);
    const host = client.addHost({
      label,
      lanAddress: isLan ? url : "",
      relayUrl: isLan ? "" : url,
      mode: isLan ? "lan" : "relay"
    });
    navigate("hosts");
    toast(`\u5DF2\u6DFB\u52A0 ${host.label}\uFF0C\u70B9\u300C\u914D\u5BF9\u300D\u8F93\u5165\u7535\u8111\u4E0A\u7684 6 \u4F4D\u7801`);
    return true;
  }
  globalThis.DRCRemote = {
    onScan(text) {
      addHostFromQr(text);
    }
  };
  var ui = {
    view: "sessions",
    sessionId: "",
    mountedChat: "",
    scrollBottom: true,
    stickBottom: true,
    showArchived: false,
    showUntitled: false,
    todoOpen: true,
    expanded: /* @__PURE__ */ new Set(),
    answers: {},
    attachments: { images: [], files: [] },
    sheetOpen: false,
    renderQueued: false,
    chatQueued: false,
    hiddenAt: 0,
    lastSessionCount: 0
  };
  client.init();
  function boot() {
    bindGlobalEvents();
    routeFromHash(true);
    autoConnect();
    setInterval(() => {
      if (ui.view === "sessions") refreshRelativeTimes();
      if (ui.view === "chat") updateRunIndicator();
    }, 1e3);
    updateComposer();
  }
  function autoConnect() {
    const snapshot = client.getHosts();
    const host = snapshot.hosts.find((item) => item.id === snapshot.activeHostId);
    if (!host) return;
    const endpoint = host.endpoints[snapshot.mode];
    if (endpoint && endpoint.paired) {
      try {
        client.connect();
      } catch (error) {
        toast(String(error.message || error), "error");
      }
    }
  }
  function routeFromHash(initial) {
    const raw = String(location.hash || "").replace(/^#\/?/, "");
    const [view, id] = raw.split("/");
    if (view === "chat" && id) {
      ui.view = "chat";
      ui.sessionId = decodeURIComponent(id);
      ui.scrollBottom = true;
      ui.stickBottom = true;
      if (initial || client.getCurrentSessionId() !== ui.sessionId) {
        client.openSession(ui.sessionId);
      }
    } else if (view === "hosts" || view === "settings" || view === "pair" || view === "tutorial") {
      ui.view = view;
      ui.sessionId = "";
    } else {
      ui.view = "sessions";
      ui.sessionId = "";
    }
    render();
  }
  function navigate(view, sessionId) {
    let hash = `#/${view}`;
    if (view === "chat" && sessionId) hash += `/${encodeURIComponent(sessionId)}`;
    if (location.hash === hash) {
      if (view === "chat" && sessionId) client.openSession(sessionId);
      if (view === "chat") {
        ui.scrollBottom = true;
        ui.stickBottom = true;
      }
      render();
    } else {
      location.hash = hash;
    }
  }
  function render() {
    renderTopbar();
    renderBanner();
    const composer = $("#composer");
    const tabbar = $("#tabbar");
    const view = $("#view");
    const isChat = ui.view === "chat";
    if (isChat) {
      composer.classList.remove("hidden");
      tabbar.classList.add("hidden");
      view.classList.add("chat");
      if (ui.mountedChat !== ui.sessionId) {
        view.innerHTML = '<div class="chat-scroll" id="chatScroll"></div><div id="runIndicator" class="run-indicator hidden" data-action="refresh-run" role="button" title="\u72B6\u6001\u4E0D\u540C\u6B65\uFF1F\u70B9\u4E00\u4E0B\u5237\u65B0"></div>';
        ui.mountedChat = ui.sessionId;
        ui.scrollBottom = true;
        ui.stickBottom = true;
      }
      renderChatHeader();
      renderChatMessages();
      updateComposer();
      syncScreenOn();
      return;
    }
    composer.classList.add("hidden");
    view.classList.remove("chat");
    ui.mountedChat = "";
    tabbar.classList.toggle("hidden", ui.view === "pair" || ui.view === "tutorial");
    if (ui.view === "sessions") view.innerHTML = sessionsHtml();
    else if (ui.view === "hosts") view.innerHTML = hostsHtml();
    else if (ui.view === "settings") view.innerHTML = settingsHtml();
    else if (ui.view === "pair") view.innerHTML = pairHtml();
    else if (ui.view === "tutorial") view.innerHTML = tutorialHtml();
    updateTabbar();
    syncScreenOn();
  }
  function refreshRelativeTimes() {
    if (ui.view !== "sessions") return;
    const container = $("#sessionList");
    if (!container) return;
    container.innerHTML = sessionRowsHtml();
    updateTabbar();
  }
  function statusTone() {
    const state = client.getState();
    if (!state.paired) return "unpaired";
    if (state.phase === "ready") return state.hostOnline === false ? "host-offline" : "ready";
    if (state.phase === "connecting" || state.phase === "handshaking" || state.phase === "pairing") return "connecting";
    if (state.phase === "offline") return "offline";
    return state.phase || "unpaired";
  }
  function activeHostName() {
    const snapshot = client.getHosts();
    const host = snapshot.hosts.find((item) => item.id === snapshot.activeHostId);
    return host ? host.label : "";
  }
  function renderTopbar() {
    const topbar = $("#topbar");
    const session = (0, import_session_list.findSession)(client.getSessions(), ui.sessionId);
    let back = '<div class="logo">\u259A</div>';
    if (ui.view === "chat" || ui.view === "pair" || ui.view === "tutorial") {
      back = '<button class="icon-btn" data-action="back" aria-label="\u8FD4\u56DE">\u2039</button>';
    }
    let title = "DSH Remoto";
    let subtitle = "";
    let actions = "";
    if (ui.view === "sessions") {
      title = "\u4F1A\u8BDD";
      subtitle = `${activeHostName() || "\u672A\u6DFB\u52A0\u4E3B\u673A"} \xB7 ${client.getState().mode === "lan" ? "\u5C40\u57DF\u7F51" : "\u4E2D\u7EE7"}`;
      actions = `
      <button class="icon-btn" data-action="refresh" aria-label="\u5237\u65B0">\u21BB</button>
      <button class="icon-btn" data-action="new-session" aria-label="\u65B0\u4F1A\u8BDD">\uFF0B</button>`;
    } else if (ui.view === "chat") {
      title = session ? session.title : "\u4F1A\u8BDD";
      const model = client.getModel(ui.sessionId);
      const bits = [];
      if (model && model.model && model.model.model) bits.push(model.model.model);
      if (session) bits.push(import_session_list.STATE_META[session.state] ? import_session_list.STATE_META[session.state].label : session.state);
      if (session && session.workspace) bits.push(session.workspace.split(/[\\/]/).filter(Boolean).pop() || "");
      subtitle = bits.filter(Boolean).join(" \xB7 ") || "\u672A\u8FDE\u63A5";
      const running = model && model.runState === "running";
      actions = `
      ${running ? '<button class="icon-btn" data-action="interrupt" aria-label="\u505C\u6B62">\u25A0</button>' : ""}
      <button class="icon-btn" data-action="archive-session" aria-label="\u5F52\u6863">\u22EF</button>`;
    } else if (ui.view === "hosts") {
      title = "\u4E3B\u673A";
      subtitle = "\u4E2D\u7EE7\u4E0E\u5C40\u57DF\u7F51\u53CC\u7AEF\u70B9";
      actions = `
      <button class="icon-btn" data-action="scan-qr" aria-label="\u626B\u7801\u6DFB\u52A0" title="\u626B\u63CF\u7535\u8111\u4E8C\u7EF4\u7801">\u2317</button>
      <button class="icon-btn" data-action="add-host" aria-label="\u6DFB\u52A0\u4E3B\u673A">\uFF0B</button>`;
    } else if (ui.view === "settings") {
      title = "\u8BBE\u7F6E";
      subtitle = `v${APP_VERSION} \xB7 protocol ${PROTOCOL_VERSION}`;
    } else if (ui.view === "pair") {
      title = "\u914D\u5BF9";
      const state = client.getPairing();
      subtitle = state.url || "\u5C1A\u672A\u914D\u7F6E\u7AEF\u70B9";
    } else if (ui.view === "tutorial") {
      title = "\u5B89\u88C5\u4E0E\u4F7F\u7528\u6559\u7A0B";
      subtitle = "\u624B\u673A\u7AEF + \u7535\u8111\u7AEF";
    }
    topbar.innerHTML = `
    ${back}
    <div class="titles">
      <div class="title">${esc(title)}</div>
      <div class="sub">${esc(subtitle)}</div>
    </div>
    <div class="actions">${actions}</div>
    <span class="status-dot ${statusTone()}" title="${esc(statusText())}"></span>`;
  }
  function statusText() {
    const state = client.getState();
    if (!state.paired) return "\u672A\u914D\u5BF9";
    if (state.phase === "ready") return state.hostOnline === false ? "\u4E3B\u673A\u79BB\u7EBF" : "\u5DF2\u8FDE\u63A5";
    if (state.phase === "connecting") return "\u8FDE\u63A5\u4E2D";
    if (state.phase === "handshaking") return "\u63E1\u624B\u4E2D";
    if (state.phase === "pairing") return "\u914D\u5BF9\u4E2D";
    if (state.phase === "offline") return "\u5DF2\u65AD\u5F00";
    return state.phase;
  }
  function renderBanner() {
    const banner = $("#banner");
    const snapshot = client.getHosts();
    const state = client.getState();
    let html = "";
    if (ui.view === "pair") {
      banner.classList.add("hidden");
      banner.innerHTML = "";
      return;
    }
    if (!snapshot.hosts.length) {
      html = '<span>\u8FD8\u6CA1\u6709\u4E3B\u673A\u3002\u5148\u5728\u7535\u8111\u4E0A\u5B89\u88C5\u4E3B\u673A\u5305\uFF0C\u518D\u5230\u8FD9\u91CC\u6DFB\u52A0\u5730\u5740\u3002</span><span class="grow"></span><button class="btn small" data-action="add-host">\u6DFB\u52A0\u4E3B\u673A</button>';
      banner.className = "banner warn";
    } else if (!state.paired) {
      html = '<span>\u5F53\u524D\u7AEF\u70B9\u672A\u914D\u5BF9\u3002</span><span class="grow"></span><button class="btn small primary" data-action="go-pair">\u53BB\u914D\u5BF9</button>';
      banner.className = "banner info";
    } else if (state.phase === "offline") {
      html = '<span>\u8FDE\u63A5\u5DF2\u65AD\u5F00\u3002</span><span class="grow"></span><button class="btn small" data-action="reconnect">\u91CD\u8FDE</button>';
      banner.className = "banner error";
    } else if (state.phase === "connecting" || state.phase === "handshaking") {
      html = '<span class="spin"></span><span>\u6B63\u5728\u8FDE\u63A5\u4E3B\u673A\u2026</span>';
      banner.className = "banner info";
    } else if (state.phase === "ready" && state.hostOnline === false) {
      html = '<span>\u4E3B\u673A\u6682\u65F6\u79BB\u7EBF\uFF0C\u914D\u5BF9\u4ECD\u7136\u4FDD\u7559\u3002</span><span class="grow"></span><button class="btn small" data-action="reconnect">\u91CD\u8FDE</button>';
      banner.className = "banner warn";
    }
    if (!html) {
      banner.classList.add("hidden");
      banner.innerHTML = "";
      return;
    }
    banner.classList.remove("hidden");
    banner.className = `${banner.className.split(" ")[0]} ${banner.className.split(" ")[1] || "info"}`.trim();
    banner.innerHTML = html;
  }
  function pendingCounts() {
    const counts = /* @__PURE__ */ new Map();
    const cards = client.getPendingCards();
    for (const card of cards.permissions.concat(cards.questions)) {
      if (card.state !== "open") continue;
      const id = card.sessionId || ui.sessionId;
      counts.set(id, (counts.get(id) || 0) + 1);
    }
    return counts;
  }
  function sessionRow(session, counts) {
    const pending = counts.get(session.id) || 0;
    const meta = session.workspace || (session.state === "archived" ? "\u5DF2\u5F52\u6863" : "");
    return `
    <button class="session" data-action="open-session" data-id="${esc(session.id)}">
      <span class="dot ${session.meta.tone}"></span>
      <span class="main">
        <span class="title">${esc(session.title)}</span>
        <span class="meta">${esc(meta)}</span>
      </span>
      <span class="side">
        <span class="time">${esc((0, import_session_list.formatRelative)(session.updatedAt, Date.now()))}</span>
        ${pending ? `<span class="badge">${pending}</span>` : session.state === "awaiting-permission" || session.state === "awaiting-answer" ? '<span class="badge">1</span>' : ""}
      </span>
    </button>`;
  }
  function sessionRowsHtml() {
    const sessions = client.getSessions();
    const groups = (0, import_session_list.groupSessions)(sessions);
    const counts = pendingCounts();
    const allSessions = groups.running.concat(groups.recent, groups.archived);
    const untitledHidden = allSessions.filter((session) => !session.hasTitle && session.id !== ui.sessionId).length;
    const keep = (session) => session.id === ui.sessionId || ui.showUntitled || session.hasTitle;
    groups.running = groups.running.filter(keep);
    groups.recent = groups.recent.filter(keep);
    groups.archived = groups.archived.filter(keep);
    let html = "";
    if (groups.running.length) {
      html += `<div class="section-title">\u8FD0\u884C\u4E2D <span class="count">${groups.running.length}</span></div>`;
      html += groups.running.map((session) => sessionRow(session, counts)).join("");
    }
    if (groups.recent.length) {
      html += `<div class="section-title">\u6700\u8FD1 <span class="count">${groups.recent.length}</span></div>`;
      html += groups.recent.map((session) => sessionRow(session, counts)).join("");
    }
    if (groups.archived.length) {
      html += `<div class="section-title">\u5DF2\u5F52\u6863 <span class="count">${groups.archived.length}</span>
      <span class="spacer"></span>
      <button class="btn small ghost" data-action="toggle-archived">${ui.showArchived ? "\u6536\u8D77" : "\u5C55\u5F00"}</button></div>`;
      if (ui.showArchived) html += groups.archived.map((session) => sessionRow(session, counts)).join("");
    }
    if (untitledHidden > 0) {
      html += `<div class="section-foot"><button class="btn small ghost" data-action="toggle-untitled">${ui.showUntitled ? "\u9690\u85CF" : "\u663E\u793A"} ${untitledHidden} \u4E2A\u65E0\u6807\u9898\u4F1A\u8BDD</button></div>`;
    }
    if (!groups.running.length && !groups.recent.length && !groups.archived.length && untitledHidden === 0) {
      html = `<div class="empty">
      <div class="empty-icon"></div>
      <h3>\u8FD8\u6CA1\u6709\u4F1A\u8BDD</h3>
      <p>${client.getState().paired ? "\u70B9\u53F3\u4E0A\u89D2\u300C\uFF0B\u300D\u65B0\u5EFA\u4E00\u4E2A\u4F1A\u8BDD\uFF0C\u6216\u8005\u4E0B\u62C9\u5237\u65B0\u3002" : "\u5148\u5728\u300C\u4E3B\u673A\u300D\u9875\u6DFB\u52A0\u7535\u8111\u5E76\u5B8C\u6210\u914D\u5BF9\u3002"}</p>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn" data-action="refresh">\u5237\u65B0</button>
        <button class="btn primary" data-action="new-session">\u65B0\u5EFA\u4F1A\u8BDD</button>
        <button class="btn" data-action="open-tutorial">\u4F7F\u7528\u6559\u7A0B</button>
      </div>
    </div>`;
    }
    return html;
  }
  function sessionsHtml() {
    return `<div id="sessionList">${sessionRowsHtml()}</div>`;
  }
  function tutorialHtml() {
    return `<div class="tutorial">
    <p class="tut-lead">\u6309\u987A\u5E8F\u505A\u5B8C\u4E0B\u9762\u51E0\u6B65\uFF0C\u5C31\u80FD\u5728\u624B\u673A\u4E0A\u63A7\u5236\u8FD9\u53F0\u7535\u8111\u3002\u7B2C\u4E00\u6B21\u5EFA\u8BAE\u5148\u7528\u5C40\u57DF\u7F51\uFF0C\u6210\u529F\u540E\u518D\u8BD5\u4E2D\u7EE7\u3002</p>

    <details class="tut" open>
      <summary>1. \u7535\u8111\u7AEF\u5B89\u88C5\uFF08Windows\uFF09</summary>
      <div class="tut-body">
        <ol>
          <li>\u628A <code>DSH-remoto-host-${APP_VERSION}.zip</code> \u89E3\u538B\u5230\u4E00\u4E2A\u56FA\u5B9A\u76EE\u5F55\uFF0C\u4E0D\u8981\u53EA\u628A bat \u62D6\u51FA\u6765\u3002</li>
          <li>\u5B8C\u5168\u9000\u51FA DSH\uFF1A\u53F3\u4E0A\u89D2\u5173\u95ED\u4E0D\u591F\uFF0C\u6258\u76D8\u56FE\u6807\u4E5F\u8981\u9000\u51FA\u3002</li>
          <li>\u53CC\u51FB <code>run-install.bat</code>\uFF0C\u770B\u5230 <code>Install complete</code>\u3002</li>
          <li>\u91CD\u65B0\u6253\u5F00 DSH\uFF0C\u5E95\u90E8\u5E94\u51FA\u73B0\u300C\u8FDC\u7A0B\u63A7\u5236\u300D\u80F6\u56CA\u3002</li>
          <li>\u684C\u9762\u4E0A\u4F1A\u51FA\u73B0\u300CDSH Remoto \u8FDE\u63A5\u6A21\u5F0F\u300D\uFF0C\u4EE5\u540E\u5207\u4E2D\u7EE7/\u5C40\u57DF\u7F51\u90FD\u7528\u5B83\u3002</li>
        </ol>
        <p class="tut-note">\u65B0\u7535\u8111\u524D\u63D0\uFF1ADSH \u81F3\u5C11\u542F\u52A8\u8FC7\u4E00\u6B21\u3002\u65E7\u7248\u5347\u7EA7\uFF1A\u76F4\u63A5\u8FD0\u884C run-install.bat\uFF0C\u4F1A\u4FDD\u7559\u4E3B\u673A\u548C\u914D\u5BF9\uFF1B\u4E0D\u8981\u5220\u9664 <code>%USERPROFILE%\\.dsh\\dsh-remote-control</code>\u3002</p>
      </div>
    </details>

    <details class="tut" open>
      <summary>2. \u5C40\u57DF\u7F51\u8FDE\u63A5\uFF08\u540C\u4E00\u4E2A Wi-Fi\uFF09</summary>
      <div class="tut-body">
        <ol>
          <li>\u624B\u673A\u548C\u7535\u8111\u8FDE\u540C\u4E00\u4E2A Wi-Fi\u3002</li>
          <li>\u7535\u8111\u53CC\u51FB\u684C\u9762\u300CDSH Remoto \u8FDE\u63A5\u6A21\u5F0F\u300D\u2192\u300C\u5C40\u57DF\u7F51\u6A21\u5F0F\u300D\uFF1BDSH \u4F1A\u91CD\u542F\uFF0C\u8FD9\u662F\u6B63\u5E38\u7684\u3002</li>
          <li>\u7A97\u53E3\u4F1A\u663E\u793A\u300C\u624B\u673A\u586B\u5199\uFF1Aws://192.168.x.x:8787\uFF08\u624B\u673A\u7528\u8FD9\u4E2A\uFF09\u300D\uFF0C\u70B9\u300C\u590D\u5236\u624B\u673A\u5730\u5740\u300D\u3002</li>
          <li>\u624B\u673A App \u2192\u300C\u4E3B\u673A\u300D\u2192\u300C\u6DFB\u52A0\u4E3B\u673A\u300D\uFF1A\u540D\u79F0\u968F\u4FBF\u586B\uFF0C\u5C40\u57DF\u7F51\u5730\u5740\u7C98\u8D34\u521A\u624D\u7684\u5730\u5740\uFF1B\u4E2D\u7EE7\u5730\u5740\u53EF\u7559\u7A7A\u3002</li>
          <li>\u4FDD\u5B58\u540E\u70B9\u8BE5\u4E3B\u673A\u5C40\u57DF\u7F51\u90A3\u884C\u7684\u300C\u4F7F\u7528\u300D\uFF0C\u518D\u70B9\u300C\u914D\u5BF9\u300D\u3002</li>
          <li>\u7535\u8111 DSH \u80F6\u56CA \u2192\u300C\u5237\u65B0\u300D\u5F97\u5230 6 \u4F4D\u914D\u5BF9\u7801\uFF0C\u624B\u673A\u8F93\u5165\u3002</li>
          <li>\u4E24\u8FB9\u90FD\u4F1A\u663E\u793A 6 \u4F4D\u6838\u5BF9\u6570\u5B57\uFF1B\u4E00\u81F4\u624D\u70B9\u300C\u6570\u5B57\u4E00\u81F4\uFF0C\u7EE7\u7EED\u300D\u3002</li>
        </ol>
        <p class="tut-note">\u7535\u8111\u6709\u591A\u5757\u7F51\u5361\u65F6\uFF0C\u9009\u548C\u624B\u673A\u540C\u4E00\u7F51\u6BB5\u7684\u5730\u5740\u3002\u7B2C\u4E00\u4E2A\u5730\u5740\u6CA1\u5F39\u786E\u8BA4\u6570\u5B57\uFF0C\u901A\u5E38\u5C31\u662F\u7F51\u6BB5\u4E0D\u5BF9\uFF0C\u6362\u53E6\u4E00\u4E2A\u5730\u5740\u5373\u53EF\u3002\u9632\u706B\u5899\u8981\u5141\u8BB8 TCP 8787\u3002</p>
      </div>
    </details>

    <details class="tut">
      <summary>3. \u4E2D\u7EE7\u8FDE\u63A5\uFF08\u4E0D\u5728\u540C\u4E00 Wi-Fi\uFF09</summary>
      <div class="tut-body">
        <ol>
          <li>\u7535\u8111\u684C\u9762\u7A97\u53E3\u70B9\u300C\u4E2D\u7EE7\u6A21\u5F0F\u300D\uFF0C\u6216\u53CC\u51FB <code>switch-to-relay.bat</code>\u3002</li>
          <li>\u5730\u5740\u586B\u4F60\u81EA\u5DF1\u7684\u4E2D\u7EE7\uFF08\u4F8B\u5982 <code>wss://relay.example.com/v05</code>\uFF09\uFF1B\u7B2C\u4E00\u6B21\u4F1A\u81EA\u52A8\u9886\u53D6\u8FD9\u53F0\u7535\u8111\u7684 host token\u3002</li>
          <li>\u624B\u673A\u300C\u6DFB\u52A0\u4E3B\u673A\u300D\u65F6\u628A\u4E2D\u7EE7\u5730\u5740\u586B\u8FD9\u4E2A\u5730\u5740\uFF0Ctoken \u4E0D\u7528\u586B\u3002</li>
          <li>\u7535\u8111\u5237\u65B0\u914D\u5BF9\u7801\uFF0C\u624B\u673A\u8F93\u5165\uFF0C\u518D\u6838\u5BF9 6 \u4F4D\u6570\u5B57\u3002</li>
        </ol>
        <p class="tut-note">\u4E2D\u7EE7\u548C\u5C40\u57DF\u7F51\u662F\u4E24\u5957\u72EC\u7ACB\u914D\u5BF9\uFF0C\u5207\u6362\u6A21\u5F0F\u540E\u8981\u5404\u81EA\u914D\u4E00\u6B21\uFF1BApp \u4F1A\u5206\u522B\u4FDD\u5B58\u4E24\u7AEF PSK\u3002</p>
      </div>
    </details>

    <details class="tut">
      <summary>4. \u624B\u673A\u65E5\u5E38\u4F7F\u7528</summary>
      <div class="tut-body">
        <ul>
          <li><b>\u4F1A\u8BDD</b>\uFF1A\u70B9\u4F1A\u8BDD\u8FDB\u5165\u804A\u5929\uFF1B\u53F3\u4E0A\u89D2\u300C\uFF0B\u300D\u65B0\u5EFA\uFF1B\u300C\u22EF\u300D\u5F52\u6863\u3002</li>
          <li><b>\u6587\u5B57</b>\uFF1A\u8F93\u5165\u540E\u70B9\u300C\u2191\u300D\u53D1\u9001\uFF1B\u7535\u8111\u56DE\u590D\u4F1A\u6D41\u5F0F\u51FA\u73B0\u3002</li>
          <li><b>\u7167\u7247</b>\uFF1A\u70B9\u300C\uFF0B\u300D\u2192\u300C\u7167\u7247\u300D\uFF0C\u804A\u5929\u91CC\u4F1A\u663E\u793A\u56FE\u7247\u9884\u89C8\uFF1B0.3.8 \u4E3B\u673A\u63D2\u4EF6\u5DF2\u4FEE\u590D\u5185\u6838\u56FE\u7247\u4E8B\u4EF6\u95EE\u9898\uFF0C\u5931\u8D25\u65F6\u4F1A\u663E\u793A\u5177\u4F53\u539F\u56E0\u5E76\u81EA\u52A8\u91CD\u8BD5\u3002</li>
          <li><b>\u6587\u4EF6</b>\uFF1A\u70B9\u300C\uFF0B\u300D\u2192\u300C\u6587\u4EF6\u300D\uFF0C\u539F\u6837\u4FDD\u5B58\u5230\u7535\u8111\uFF0C\u4E0D\u663E\u793A\u56FE\u7247\u9884\u89C8\u3002</li>
          <li><b>\u5BA1\u6279/\u63D0\u95EE</b>\uFF1A\u76F4\u63A5\u70B9\u5361\u7247\u6309\u94AE\uFF1B\u300C\u59CB\u7EC8\u5141\u8BB8\u300D\u53EA\u5BF9\u5F53\u524D\u4F1A\u8BDD\u751F\u6548\u3002</li>
          <li><b>\u505C\u6B62</b>\uFF1A\u7535\u8111\u8FD0\u884C\u65F6\u53F3\u4E0A\u89D2\u51FA\u73B0\u300C\u25A0\u300D\uFF1B<b>\u9632\u4F11\u7720</b>\u5728\u8BBE\u7F6E\u91CC\u3002</li>
          <li><b>\u65AD\u7EBF</b>\uFF1A\u9876\u90E8\u663E\u793A\u79BB\u7EBF\u65F6\uFF0C\u70B9\u300C\u4E3B\u673A\u300D\u9875\u7684\u8FDE\u63A5/\u91CD\u65B0\u8FDE\u63A5\uFF1BApp \u56DE\u5230\u524D\u53F0\u4E5F\u4F1A\u81EA\u52A8\u91CD\u8FDE\u3002</li>
        </ul>
      </div>
    </details>

    <details class="tut">
      <summary>5. \u5347\u7EA7\u4E0E\u6570\u636E\u4FDD\u7559</summary>
      <div class="tut-body">
        <ul>
          <li>App\uFF1A\u65B0 APK \u76F4\u63A5\u8986\u76D6\u5B89\u88C5\uFF0C<b>\u4E0D\u8981\u5378\u8F7D</b>\uFF1BversionCode \u4F1A\u9012\u589E\uFF0C\u672C\u5730\u4E3B\u673A/\u7AEF\u70B9/PSK \u4F1A\u4FDD\u7559\u3002</li>
          <li>\u6362\u673A\u6216\u5FC5\u987B\u5378\u8F7D\u524D\uFF1A\u8BBE\u7F6E \u2192\u300C\u5BFC\u51FA\u8FDE\u63A5\u914D\u7F6E\u300D\uFF0C\u88C5\u597D\u540E\u300C\u5BFC\u5165\u8FDE\u63A5\u914D\u7F6E\u300D\u3002</li>
          <li>\u7535\u8111\u4E3B\u673A\u5305\uFF1A\u65B0\u7248\u8FD0\u884C <code>run-install.bat</code> \u4F1A\u5907\u4EFD\u65E7\u63D2\u4EF6\u5E76\u4FDD\u7559 user-config\u3001hostId\u3001token \u548C\u914D\u5BF9\uFF1B\u5C40\u57DF\u7F51 token \u4F1A\u4ECE user-config \u6062\u590D\u3002</li>
          <li>\u684C\u9762\u5FEB\u6377\u65B9\u5F0F\u4F1A\u5237\u65B0\u5230\u65B0\u89E3\u538B\u76EE\u5F55\uFF1B\u65E7\u5FEB\u6377\u65B9\u5F0F\u53EF\u5220\u3002</li>
        </ul>
      </div>
    </details>

    <details class="tut">
      <summary>6. \u5E38\u89C1\u95EE\u9898</summary>
      <div class="tut-body">
        <ul>
          <li><b>\u8F93\u7B2C\u4E00\u4E2A\u5C40\u57DF\u7F51 IP \u6CA1\u5F39\u6570\u5B57</b>\uFF1A\u7535\u8111\u6709\u591A\u5757\u7F51\u5361\uFF0C\u6362\u300C\u624B\u673A\u7528\u8FD9\u4E2A\u300D\u90A3\u4E2A\u5730\u5740\u3002</li>
          <li><b>\u56FE\u7247\u5931\u8D25</b>\uFF1A0.3.8 \u4E3B\u673A\u63D2\u4EF6\u5DF2\u4FEE\u590D\u5185\u6838\u56FE\u7247\u4E8B\u4EF6\u5E8F\u5217\u5316\u95EE\u9898\uFF1B\u91CD\u542F DSH \u540E\u4ECD\u5931\u8D25\u65F6\uFF0C\u9519\u8BEF\u4F1A\u5E26\u5177\u4F53\u539F\u56E0\uFF0C\u53EF\u4EE5\u70B9\u300C\u6539\u6210\u6587\u4EF6\u53D1\u9001\u300D\u6216\u628A\u63D0\u793A\u53D1\u6211\u3002</li>
          <li><b>\u56FE\u7247\u6CA1\u6709\u9884\u89C8</b>\uFF1A\u4F60\u8D70\u7684\u662F\u300C\u6587\u4EF6\u300D\uFF1B\u6539\u7528\u300C\uFF0B \u2192 \u7167\u7247\u300D\u3002</li>
          <li><b>\u4F1A\u8BDD\u5217\u8868\u6709\u5947\u602A\u7684\u7A7A\u4F1A\u8BDD</b>\uFF1A\u65E0\u6807\u9898\u4F1A\u8BDD\u9ED8\u8BA4\u9690\u85CF\uFF1B\u5E95\u90E8\u300C\u663E\u793A N \u4E2A\u65E0\u6807\u9898\u4F1A\u8BDD\u300D\u53EF\u5C55\u5F00\u3002</li>
          <li><b>\u5168\u5C40\u6743\u9650\u9884\u8BBE</b>\uFF1A\u534F\u8BAE 0.5.4 \u5DF2\u5220\u9664\u8BE5\u547D\u4EE4\uFF1B\u76EE\u524D\u7528\u5BA1\u6279\u5361\u7684\u300C\u59CB\u7EC8\u5141\u8BB8\uFF08\u672C\u4F1A\u8BDD\uFF09\u300D\u3002</li>
          <li><b>\u7535\u8111\u91CD\u542F\u540E\u8FDE\u4E0D\u4E0A</b>\uFF1A\u672C\u673A\u4E2D\u7EE7\u4E0D\u4F1A\u81EA\u542F\uFF1B\u70B9\u4E00\u6B21\u684C\u9762\u300C\u5C40\u57DF\u7F51\u6A21\u5F0F\u300D\uFF0C\u6216\u8FD0\u884C <code>switch-to-lan.bat</code>\u3002</li>
        </ul>
      </div>
    </details>

    
    <details class="tut" open>
      <summary>3.5 自建中继服务器（VPS）</summary>
      <div class="tut-body">
        <p>中继不是电脑上的服务，而是一台有公网 IP 的服务器（VPS）。电脑和手机都连到它，才能在不同网络下互通。</p>
        <ol>
          <li>准备一台 Linux VPS、一个域名，安装 Node.js 20，并把主机包里的 <code>relay.mjs</code> 上传到 <code>/opt/dsh-remote/</code>。</li>
          <li>先用 <code>node /opt/dsh-remote/relay.mjs</code> 在 <code>127.0.0.1:8787</code> 启动，确认 <code>http://127.0.0.1:8787/healthz</code> 返回 ok。</li>
          <li>用 Caddy/Nginx 把 <code>https://relay.example.com</code> 反代到 <code>127.0.0.1:8787</code>，开放 443。Caddy 会自动申请证书：</li>
        </ol>
        <pre>relay.example.com {
  reverse_proxy 127.0.0.1:8787
}</pre>
        <p>最终中继地址就是 <code>wss://relay.example.com/v05</code>。电脑和手机必须填同一个地址。</p>
        <div class="tut-prompt">
          <b>给电脑上的 DSH 发这条指令（复制后发送）：</b>
          <pre>请在这台电脑安装 DSH Remoto 主机服务：
1. 把 DSH-remoto-host-0.4.0.zip 解压到固定目录；
2. 完全退出 DSH（包括托盘）；
3. 运行 run-install.bat；
4. 重新打开 DSH。
不要删除 %USERPROFILE%\.dsh\dsh-remote-control 里的现有配置。</pre>
          <button class="btn small" data-action="copy-prompt" data-kind="install">复制安装指令</button>
        </div>
        <div class="tut-prompt">
          <b>让 DSH 帮你配置中继：</b>
          <pre>请帮我把 DSH Remoto 配置成使用我自己的中继服务器：
中继地址：wss://relay.example.com/v05
不要重置现有配对和 user-config。
请把中继地址写入 DSH Remoto 主机目录的 relay.txt，然后运行一次 switch-to-relay.bat。</pre>
          <button class="btn small" data-action="copy-prompt" data-kind="relay">复制中继配置指令</button>
        </div>
        <div class="tut-prompt">
          <b>让 DSH 帮你在服务器部署中继：</b>
          <pre>请帮我在 VPS 上部署 DSH Remoto 中继：
把主机包里的 host/relay.mjs 上传到 /opt/dsh-remote/relay.mjs，
用 Node 20 监听 127.0.0.1:8787，用 Caddy 反代到 wss://relay.example.com，
开放 443；不要修改 DSH 本体。</pre>
          <button class="btn small" data-action="copy-prompt" data-kind="deploy">复制部署指令</button>
        </div>
        <p class="tut-note">中继只转发密文；电脑仍需开机联网。电脑桌面窗口新增「配置中继地址」，填入同一个 wss 地址后切「中继模式」。</p>
      </div>
    </details>
<p class="tut-foot">\u5F53\u524D App ${APP_VERSION} \xB7 \u534F\u8BAE ${PROTOCOL_VERSION} \xB7 \u6559\u7A0B\u968F\u5B89\u88C5\u5305\u79BB\u7EBF\u53EF\u7528</p>
  </div>`;
  }
  function hostsHtml() {
    const snapshot = client.getHosts();
    let html = "";
    if (!snapshot.hosts.length) {
      html = `<div class="empty">
      <div class="empty-icon"></div>
      <h3>\u6DFB\u52A0\u4F60\u7684\u7535\u8111</h3>
      <p>\u7535\u8111\u4E0A\u88C5\u597D\u4E3B\u673A\u5305\u540E\uFF0C\u6309\u300C\u4E2D\u7EE7\u5730\u5740\u300D\u6216\u300C\u5C40\u57DF\u7F51 IP\u300D\u6DFB\u52A0\u4E3B\u673A\uFF0C\u518D\u7528 6 \u4F4D\u914D\u5BF9\u7801\u8FDE\u63A5\u3002</p>
      <div class="row" style="justify-content:center;margin-top:16px">
        <button class="btn primary" data-action="add-host">\u6DFB\u52A0\u4E3B\u673A</button>
        <button class="btn" data-action="open-tutorial">\u5B89\u88C5\u6559\u7A0B</button>
      </div>
    </div>`;
      return html;
    }
    for (const host of snapshot.hosts) {
      const isActive = host.id === snapshot.activeHostId;
      const rows = ["relay", "lan"].map((mode) => {
        const endpoint = host.endpoints[mode];
        const label = mode === "lan" ? "\u5C40\u57DF\u7F51" : "\u4E2D\u7EE7";
        const paired = endpoint && endpoint.paired;
        const active = isActive && snapshot.mode === mode;
        if (!endpoint) {
          return `<div class="endpoint ${active ? "active" : ""}">
            <div class="endpoint-top">
              <span class="endpoint-mode">${label}</span>
              <span class="endpoint-url">\u672A\u914D\u7F6E</span>
              <span class="pill">\u672A\u914D\u7F6E</span>
            </div>
            <div class="endpoint-actions">
              <button class="btn small" data-action="edit-endpoint" data-host="${esc(host.id)}" data-mode="${mode}">\u586B\u5199\u5730\u5740</button>
            </div>
          </div>`;
        }
        return `<div class="endpoint ${active ? "active" : ""}">
          <div class="endpoint-top">
            <span class="endpoint-mode">${label}</span>
            <span class="endpoint-url">${esc(endpoint.url)}</span>
            <span class="pill ${paired ? "ok" : ""}">${paired ? "\u5DF2\u914D\u5BF9" : "\u672A\u914D\u5BF9"}</span>
            ${active ? '<span class="pill accent">\u5F53\u524D</span>' : ""}
          </div>
          <div class="endpoint-actions">
            <button class="btn small" data-action="use-mode" data-host="${esc(host.id)}" data-mode="${mode}">${active ? "\u91CD\u8FDE" : "\u4F7F\u7528"}</button>
            <button class="btn small ${paired ? "" : "primary"}" data-action="pair-open" data-host="${esc(host.id)}" data-mode="${mode}">${paired ? "\u91CD\u65B0\u914D\u5BF9" : "\u914D\u5BF9"}</button>
            <button class="btn small ghost" data-action="edit-endpoint" data-host="${esc(host.id)}" data-mode="${mode}">\u7F16\u8F91</button>
          </div>
        </div>`;
      }).join("");
      html += `<div class="host-card ${isActive ? "active" : ""}">
      <div class="host-head">
        <span class="host-name">${esc(host.label)}</span>
        <span class="pill ${isActive ? "accent" : ""}">${isActive ? "\u5F53\u524D\u4E3B\u673A" : "\u672A\u9009\u4E2D"}</span>
      </div>
      ${rows}
      <div class="host-foot">
        <button class="btn small" data-action="select-host" data-host="${esc(host.id)}" ${isActive ? "disabled" : ""}>\u8BBE\u4E3A\u5F53\u524D</button>
        <button class="btn small ghost" data-action="edit-host" data-host="${esc(host.id)}">\u7F16\u8F91\u540D\u79F0</button>
        <span class="spacer"></span>
        <button class="btn small danger" data-action="remove-host" data-host="${esc(host.id)}">\u5220\u9664</button>
      </div>
    </div>`;
    }
    html += `<button class="btn block" data-action="add-host">\uFF0B \u6DFB\u52A0\u4E3B\u673A</button>
  <p class="small faint center" style="margin:12px 10px 0">
    \u5C40\u57DF\u7F51\u6A21\u5F0F\uFF1A\u7535\u8111\u4E0E\u624B\u673A\u8FDE\u540C\u4E00\u4E2A Wi-Fi\uFF0C\u5728\u7535\u8111\u4E3B\u673A\u5305\u91CC\u542F\u52A8\u5C40\u57DF\u7F51\u4E2D\u7EE7\uFF0C\u7136\u540E\u586B\u5199\u7535\u8111\u7684 IP\uFF08\u9ED8\u8BA4\u7AEF\u53E3 8787\uFF09\u3002
  </p>`;
    return html;
  }
  function settingsHtml() {
    const state = client.getState();
    const hostInfo = client.getHostInfo();
    const limits = client.getLimits();
    const keepAwake = client.getKeepAwake();
    const session = (0, import_session_list.findSession)(client.getSessions(), ui.sessionId);
    const pending = client.getPendingCards();
    return `
    <div class="section-title">\u8FDE\u63A5</div>
    <div class="card" style="padding:0">
      <div class="setting-row">
        <div class="label">\u72B6\u6001<div class="desc">${esc(state.detail || "")}</div></div>
        <span class="pill ${state.paired ? state.phase === "ready" ? "ok" : "warn" : ""}">${esc(statusText())}</span>
      </div>
      <div class="setting-row">
        <div class="label">\u6A21\u5F0F</div>
        <span class="value">${state.mode === "lan" ? "\u5C40\u57DF\u7F51" : "\u4E2D\u7EE7"}</span>
      </div>
      <div class="setting-row">
        <div class="label">\u7AEF\u70B9</div>
        <span class="value">${esc(state.url || "\u672A\u914D\u7F6E")}</span>
      </div>
      <div class="setting-row">
        <div class="label">\u4E3B\u673A ID</div>
        <span class="value">${esc(state.hostId || "-")}</span>
      </div>
      <div class="setting-row">
        <div class="label">\u5F85\u5904\u7406</div>
        <span class="value">${pending.permissions.filter((c) => c.state === "open").length} \u5BA1\u6279 \xB7 ${pending.questions.filter((c) => c.state === "open").length} \u63D0\u95EE</span>
      </div>
    </div>
    <div class="row" style="margin:10px 0 16px">
      <button class="btn small" data-action="reconnect">\u91CD\u65B0\u8FDE\u63A5</button>
      <button class="btn small" data-action="refresh">\u5237\u65B0\u4F1A\u8BDD</button>
      <button class="btn small" data-action="get-pending">\u62C9\u53D6\u5F85\u5904\u7406</button>
    </div>

    <div class="section-title">\u4E3B\u673A</div>
    <div class="card" style="padding:0">
      <div class="setting-row">
        <div class="label">\u9632\u4F11\u7720<div class="desc">${keepAwake.backend ? `\u540E\u7AEF\uFF1A${esc(keepAwake.backend)}` : "\u8BA9\u7535\u8111\u5728\u4EFB\u52A1\u8FD0\u884C\u671F\u95F4\u4FDD\u6301\u5524\u9192"}</div></div>
        <button class="switch ${keepAwake.enabled ? "on" : ""}" data-action="toggle-keep-awake" aria-label="\u9632\u4F11\u7720"></button>
      </div>
      ${hostInfo ? `<div class="setting-row">
              <div class="label">\u4E3B\u673A\u4FE1\u606F</div>
              <span class="value">${esc(hostInfo.host.platform)}/${esc(hostInfo.host.arch)}${hostInfo.host.dshVersion ? ` \xB7 DSH ${esc(hostInfo.host.dshVersion)}` : ""}</span>
            </div>` : ""}
      ${limits ? `<div class="setting-row">
              <div class="label">\u9650\u989D<div class="desc">\u56FE\u7247 ${limits.maxImageAttachments} \u5F20 \xB7 \u6587\u4EF6 ${limits.maxFileAttachments} \u4E2A \xB7 \u9644\u4EF6\u5408\u8BA1 ${fmtSize(limits.maxAttachmentBytes)} \xB7 \u6B63\u6587 ${limits.maxTextChars} \u5B57</div></div>
            </div>` : ""}
    </div>

    <div class="section-title">\u7535\u8111</div>
    <div class="card" style="padding:0">
      <div class="setting-row">
        <div class="label">\u7535\u8111\u6743\u9650<div class="desc">\u4FEE\u6539\u7535\u8111\u7684\u6743\u9650\u9884\u8BBE\uFF08\u6587\u4EF6\u8BBF\u95EE + \u5BA1\u6279\u7B56\u7565\uFF09</div></div>
        <button class="btn small" data-action="open-permission">\u4FEE\u6539</button>
      </div>
    </div>

    <div class="section-title">\u5E2E\u52A9</div>
    <div class="card" style="padding:0">
      <div class="setting-row">
        <div class="label">\u5B89\u88C5\u4E0E\u4F7F\u7528\u6559\u7A0B<div class="desc">\u7535\u8111\u7AEF\u5B89\u88C5\u3001\u5C40\u57DF\u7F51/\u4E2D\u7EE7\u3001\u914D\u5BF9\u3001\u5347\u7EA7\u4E0E\u5E38\u89C1\u95EE\u9898</div></div>
        <button class="btn small" data-action="open-tutorial">\u6253\u5F00</button>
      </div>
    </div>

    <div class="section-title">\u7EF4\u62A4</div>
    <div class="card" style="padding:0">
      <div class="setting-row">
        <div class="label">\u5FD8\u8BB0\u5F53\u524D\u914D\u5BF9<div class="desc">\u6E05\u9664\u672C\u7AEF\u70B9 PSK\uFF0C\u9700\u8981\u91CD\u65B0\u8F93\u5165 6 \u4F4D\u7801</div></div>
        <button class="btn small danger" data-action="forget-pairing">\u6E05\u9664</button>
      </div>
      <div class="setting-row">
        <div class="label">\u6E05\u9664\u672C\u5730\u5386\u53F2\u4E0E\u4F1A\u8BDD\u7F13\u5B58<div class="desc">\u53EA\u5F71\u54CD\u8FD9\u53F0\u624B\u673A\uFF1B\u53EF\u6E05\u6389\u672A\u8FDE\u63A5\u65F6\u663E\u793A\u7684\u65E7\u4F1A\u8BDD</div></div>
        <button class="btn small" data-action="clear-cache">\u6E05\u9664</button>
      </div>
      <div class="setting-row">
        <div class="label">\u5BFC\u51FA\u8FDE\u63A5\u914D\u7F6E<div class="desc">\u5305\u542B\u4E3B\u673A\u3001\u7AEF\u70B9\u548C PSK\uFF1B\u6362\u673A/\u5378\u8F7D\u524D\u5907\u4EFD\u7528\uFF0C\u52FF\u5916\u53D1</div></div>
        <button class="btn small" data-action="export-config">\u5BFC\u51FA</button>
      </div>
      <div class="setting-row">
        <div class="label">\u5BFC\u5165\u8FDE\u63A5\u914D\u7F6E<div class="desc">\u7C98\u8D34\u4E4B\u524D\u5BFC\u51FA\u7684 JSON\uFF0C\u6062\u590D\u4E2D\u7EE7/\u5C40\u57DF\u7F51\u914D\u5BF9</div></div>
        <button class="btn small" data-action="import-config">\u5BFC\u5165</button>
      </div>
    </div>

    <div class="section-title">\u5173\u4E8E</div>
    <div class="card" style="padding:0">
      <div class="setting-row"><div class="label">\u5BA2\u6237\u7AEF\u7248\u672C</div><span class="value">${APP_VERSION}</span></div>
      <div class="setting-row"><div class="label">\u534F\u8BAE</div><span class="value">${PROTOCOL_VERSION} \xB7 wire 1</span></div>
      
      <div class="setting-row"><div class="label">作者</div><span class="value">呆瓜的呆瓜</span></div>
      <div class="setting-row"><div class="label">联系邮箱</div><a class="value" href="mailto:3309219254@qq.com">3309219254@qq.com</a></div><div class="setting-row"><div class="label">\u72EC\u7ACB\u5B9E\u73B0</div><span class="value">\u4E0D\u5F15\u7528\u65E7 0.2.7 bundle</span></div>
    </div>
    <p class="small faint center" style="margin:14px 10px 28px">
      \u7AEF\u5230\u7AEF\u52A0\u5BC6\uFF1A\u4E2D\u7EE7\u53EA\u8F6C\u53D1\u5BC6\u6587\u3002\u66F4\u6362\u7F51\u7EDC\u65F6\uFF0C\u53EF\u5728\u300C\u4E3B\u673A\u300D\u9875\u5207\u6362\u4E2D\u7EE7 / \u5C40\u57DF\u7F51\u7AEF\u70B9\u3002
    </p>`;
  }
  function pairHtml() {
    const pair = client.getPairing();
    const snapshot = client.getHosts();
    const host = snapshot.hosts.find((item) => item.id === snapshot.activeHostId);
    const endpoint = host ? host.endpoints[snapshot.mode] : null;
    if (!endpoint) {
      return `<div class="empty">
      <div class="big">\u2301</div>
      <h3>\u5148\u914D\u7F6E\u7AEF\u70B9</h3>
      <p>\u5F53\u524D\u4E3B\u673A\u8FD8\u6CA1\u6709\u586B\u5199${snapshot.mode === "lan" ? "\u5C40\u57DF\u7F51\u5730\u5740" : "\u4E2D\u7EE7\u5730\u5740"}\u3002</p>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn primary" data-action="go-hosts">\u53BB\u4E3B\u673A\u9875</button>
      </div>
    </div>`;
    }
    const busy = pair.state === "claiming";
    const verify = pair.state === "verify" && pair.sas;
    const failed = pair.state === "failed";
    const paired = pair.state === "paired";
    return `<div class="pair-wrap">
    <div class="pair-hero">
      <div class="icon">\u2301</div>
      <h2>${paired ? "\u914D\u5BF9\u6210\u529F" : verify ? "\u6838\u5BF9\u6570\u5B57" : "\u8F93\u5165\u914D\u5BF9\u7801"}</h2>
      <p>${paired ? "\u73B0\u5728\u53EF\u4EE5\u8FDB\u5165\u4F1A\u8BDD\u4E86\u3002" : "\u5728\u7535\u8111\u4E0A\u6253\u5F00 DSH \u5E95\u90E8\u300C\u8FDC\u7A0B\u63A7\u5236\u300D\u80F6\u56CA\uFF0C\u70B9\u300C\u5237\u65B0\u300D\u751F\u6210 6 \u4F4D\u7801\u3002"}</p>
    </div>
    <div class="pair-endpoint">${snapshot.mode === "lan" ? "\u5C40\u57DF\u7F51" : "\u4E2D\u7EE7"} \xB7 ${esc(endpoint.url)}</div>
    ${verify ? `<div class="sas-box">
            <div class="label">\u4E24\u7AEF\u7684\u6838\u5BF9\u6570\u5B57</div>
            <div class="sas-digits">${esc(pair.sas)}</div>
            <p>\u8BF7\u4E0E\u7535\u8111\u5C4F\u5E55\u4E0A\u663E\u793A\u7684 6 \u4F4D\u6570\u5B57\u9010\u4F4D\u6838\u5BF9\u3002<br />\u4E00\u81F4\u624D\u7EE7\u7EED\uFF1B\u4E0D\u4E00\u81F4\u8BF4\u660E\u8FDE\u63A5\u53EF\u80FD\u88AB\u7BE1\u6539\uFF0C\u8BF7\u53D6\u6D88\u3002</p>
            <div class="pair-actions">
              <button class="btn primary block" data-action="pair-confirm">\u6570\u5B57\u4E00\u81F4\uFF0C\u7EE7\u7EED</button>
              <button class="btn block" data-action="pair-cancel">\u4E0D\u4E00\u81F4\uFF0C\u53D6\u6D88</button>
            </div>
          </div>` : paired ? `<div class="pair-actions">
              <button class="btn primary block" data-action="tab" data-view="sessions">\u8FDB\u5165\u4F1A\u8BDD</button>
            </div>` : `<input id="pairCode" class="code-input" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022" autocomplete="one-time-code" />
            <div class="pair-actions">
              <button class="btn primary block" data-action="pair-submit" ${busy ? "disabled" : ""}>${busy ? '<span class="spinner"></span>\u7B49\u5F85\u7535\u8111\u786E\u8BA4' : "\u5F00\u59CB\u914D\u5BF9"}</button>
              ${busy ? '<button class="btn block" data-action="pair-cancel">\u53D6\u6D88</button>' : ""}
            </div>`}
    <div class="pair-status ${failed ? "error" : ""}">${failed ? esc(pair.error) : busy ? "\u5DF2\u63D0\u4EA4\u914D\u5BF9\u7801\uFF0C\u7B49\u5F85\u7535\u8111\u56DE\u4F20\u5BC6\u94A5\u2026" : ""}</div>
    <div class="card" style="margin-top:22px">
      <h4>\u624B\u673A\u7AEF\u786E\u8BA4\u662F\u5FC5\u987B\u7684</h4>
      <p>\u4E3B\u673A\u4F1A\u81EA\u52A8\u653E\u884C\u914D\u5BF9\uFF0C\u4F46\u771F\u6B63\u7684\u5B89\u5168\u68C0\u67E5\u5728\u8FD9\u4E00\u6B65\uFF1A\u4F60\u5FC5\u987B\u5728\u624B\u673A\u4E0A\u6838\u5BF9 6 \u4F4D\u6570\u5B57\u3002\u4E2D\u7EE7\u5982\u679C\u66FF\u6362\u4E86\u516C\u94A5\uFF0C\u4E24\u7AEF\u6570\u5B57\u4F1A\u4E0D\u540C\u3002</p>
    </div>
  </div>`;
  }
  function renderChatHeader() {
    renderTopbar();
  }
  function chatModelOrEmpty() {
    return client.getModel(ui.sessionId);
  }
  function renderChatMessages() {
    const scroll = $("#chatScroll");
    if (!scroll) return;
    const nearBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 160;
    const shouldStick = ui.scrollBottom || ui.stickBottom || nearBottom;
    const previous = scroll.scrollTop;
    scroll.innerHTML = chatMessagesHtml();
    if (shouldStick) {
      scroll.scrollTop = scroll.scrollHeight;
      requestAnimationFrame(() => {
        scroll.scrollTop = scroll.scrollHeight;
      });
      ui.stickBottom = true;
    } else {
      scroll.scrollTop = previous;
    }
    ui.scrollBottom = false;
    scroll.onscroll = () => {
      ui.stickBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 160;
    };
    scroll.querySelectorAll("img").forEach((image) => {
      image.addEventListener("load", () => {
        if (ui.stickBottom) scroll.scrollTop = scroll.scrollHeight;
      });
    });
    updateRunIndicator();
  }
  function updateRunIndicator() {
    const node = $("#runIndicator");
    if (!node) return;
    const model = chatModelOrEmpty();
    if (!model || model.runState !== "running" || !model.runStartedAt) {
      node.classList.add("hidden");
      node.innerHTML = "";
      return;
    }
    const seconds = Math.max(0, Math.floor((Date.now() - model.runStartedAt) / 1e3));
    node.classList.remove("hidden");
    node.innerHTML = `<span class="spin"></span> \u7535\u8111\u601D\u8003\u4E2D \xB7 ${seconds}s`;
  }
  function scheduleChatRender() {
    if (ui.chatQueued) return;
    ui.chatQueued = true;
    setTimeout(() => {
      ui.chatQueued = false;
      if (ui.view === "chat") renderChatMessages();
    }, 80);
  }
  function chatMessagesHtml() {
    const model = chatModelOrEmpty();
    const status = client.getHistoryStatus(ui.sessionId);
    if (!model) return '<div class="chat-empty">\u6B63\u5728\u52A0\u8F7D\u2026</div>';
    const parts = [];
    if (model.todo && model.todo.length) {
      const done = model.todo.filter((item) => item.status === "completed").length;
      parts.push(`<div class="todo-panel">
      <button class="todo-head" data-action="toggle-todo">
        <span>\u5F85\u529E</span><span class="todo-count">${done}/${model.todo.length}</span>
        <span class="spacer"></span><span>${ui.todoOpen ? "\u6536\u8D77" : "\u5C55\u5F00"}</span>
      </button>
      ${ui.todoOpen ? `<div class="todo-list">${model.todo.map(
        (item) => `<div class="todo-item ${esc(item.status)}">
                  <span class="mark">${item.status === "completed" ? "\u2713" : item.status === "in_progress" ? "\u25B6" : "\u25CB"}</span>
                  <span>${esc(item.content)}</span>
                </div>`
      ).join("")}</div>` : ""}
    </div>`);
    }
    if (model.nextBeforeSeq) {
      parts.push(`<div class="history-hint">${status.loading ? '<span class="spin"></span> \u6B63\u5728\u8BFB\u53D6\u66F4\u65E9\u7684\u6D88\u606F\u2026' : `<button data-action="load-earlier">\u52A0\u8F7D\u66F4\u65E9\u7684\u6D88\u606F</button>`}</div>`);
    } else if (model.historyLoaded && model.blocks.length) {
      parts.push('<div class="history-hint">\u6CA1\u6709\u66F4\u65E9\u7684\u6D88\u606F\u4E86</div>');
    }
    if (status.error) parts.push(`<div class="history-hint">${esc(status.error)}</div>`);
    else if (status.loading && !model.blocks.length) parts.push('<div class="history-hint"><span class="spin"></span> \u6B63\u5728\u8BFB\u53D6\u5386\u53F2\u2026</div>');
    for (const block of model.blocks) {
      if (block.kind === "message") parts.push(messageHtml(block));
      else if (block.kind === "tool") parts.push(toolHtml(block));
      else if (block.kind === "artifact") parts.push(artifactHtml(block));
      else if (block.kind === "notice") parts.push(`<div class="notice">${esc(block.text)}</div>`);
    }
    const cards = pendingCardsFor(ui.sessionId);
    for (const card of cards) {
      if (card.kind === "permission") parts.push(permissionCardHtml(card.card));
      else parts.push(questionCardHtml(card.card));
    }
    if (!parts.length) {
      return `<div class="chat-empty">
      <div class="empty-icon"></div>
      <p>${client.getState().paired ? "\u8FD8\u6CA1\u6709\u6D88\u606F\u3002\u53D1\u4E00\u53E5\u8BDD\u5F00\u59CB\u5427\u3002" : "\u5F53\u524D\u672A\u8FDE\u63A5\u4E3B\u673A\u3002"}</p>
    </div>`;
    }
    return parts.join("");
  }
  function formatBytes(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
  }
  function artifactHtml(block) {
    const isImage = /^image\//.test(block.mediaType || "");
    const size = formatBytes(block.bytes);
    const desc = block.description ? `<div class="artifact-desc">${esc(block.description)}</div>` : "";
    if (isImage && block.data) {
      return `<div class="artifact-card image">
      <img class="artifact-image" data-action="view-artifact" data-id="${esc(block.id)}" src="data:${esc(block.mediaType)};base64,${block.data}" alt="${esc(block.name)}" />
      <div class="artifact-caption"><span>${esc(block.name)}</span><span>${size}</span></div>
      ${desc}
    </div>`;
    }
    return `<div class="artifact-card file">
    <div class="artifact-file-row">
      <span class="artifact-file-icon">\u25A4</span>
      <div class="artifact-file-main">
        <b>${esc(block.name)}</b>
        <small>${esc(block.error || size)}</small>
        ${desc}
      </div>
    </div>
    ${block.data ? `<button class="artifact-save" data-action="save-artifact" data-id="${esc(block.id)}">\u4FDD\u5B58\u5230\u624B\u673A</button>` : '<div class="artifact-missing">\u6587\u4EF6\u5185\u5BB9\u6CA1\u6709\u6536\u5230\uFF0C\u8BF7\u8BA9\u7535\u8111\u91CD\u65B0\u53D1\u9001</div>'}
  </div>`;
  }
  function saveArtifact(block) {
    if (!block || !block.data) return;
    if (window.AndroidBridge && typeof window.AndroidBridge.saveBase64 === "function") {
      try {
        window.AndroidBridge.saveBase64(block.name || "file", block.mediaType || "application/octet-stream", block.data);
        toast("\u5DF2\u4FDD\u5B58\u5230\u4E0B\u8F7D\u76EE\u5F55");
        return;
      } catch {
      }
    }
    const link = document.createElement("a");
    link.href = `data:${block.mediaType || "application/octet-stream"};base64,${block.data}`;
    link.download = block.name || "file";
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast("\u5DF2\u5F00\u59CB\u4E0B\u8F7D");
  }
  function messageHtml(block) {
    const role = block.role === "user" ? "user" : block.role === "system" ? "system" : "assistant";
    const text = block.parts.map((part) => part.text).join("\n").trim();
    const images = (block.images || []).map(
      (image, index) => `<img class="msg-image" loading="lazy" data-action="view-image" data-id="${esc(block.id)}" data-index="${index}" src="data:${esc(
        image.mediaType || "image/jpeg"
      )};base64,${image.data}" alt="${esc(image.name || "")}" />`
    ).join("");
    const files = (block.files || []).map((file) => `<span class="attach-chip"><span class="name">${esc(file.name)}</span></span>`).join("");
    const failedActions = block.fileFallbackSent ? '<span class="msg-state">\u5DF2\u6539\u7528\u6587\u4EF6\u53D1\u9001</span>' : `<button data-action="retry" data-id="${esc(block.clientMsgId)}" ${block.retryPending ? "disabled" : ""}>\u91CD\u8BD5</button>${(block.images || []).length ? ` <button data-action="resend-files" data-id="${esc(block.clientMsgId)}">\u6539\u6210\u6587\u4EF6\u53D1\u9001</button>` : ""}`;
    const status = block.state === "sending" ? '<span class="msg-state">\u53D1\u9001\u4E2D\u2026</span>' : block.state === "accepted" ? '<span class="msg-state ok">\u2713 \u5DF2\u9001\u8FBE\u7535\u8111</span>' : block.state === "uncertain" ? '<span class="msg-state">\u5DF2\u53D1\u9001\uFF0C\u7B49\u5F85\u4E3B\u673A\u786E\u8BA4</span>' : block.state === "failed" ? `<div class="msg-failed"><span class="err">${esc(block.error || "\u53D1\u9001\u5931\u8D25")}</span><span class="msg-actions">${failedActions}</span></div>` : "";
    if (role === "system") {
      return `<div class="msg system"><div class="bubble">${formatText(text)}</div></div>`;
    }
    return `<div class="msg ${role}">
    ${images || files ? `<div class="attachments">${images}${files}</div>` : ""}
    ${text ? `<div class="bubble">${formatText(text)}</div>` : ""}
    ${status ? `<div class="msg-meta">${status}</div>` : ""}
  </div>`;
  }
  function toolHtml(block) {
    const expanded = ui.expanded.has(block.callId);
    const label = block.title || block.tool || "\u5DE5\u5177\u8C03\u7528";
    const phase = { started: "\u8FD0\u884C\u4E2D", args: "\u53C2\u6570", completed: "\u5B8C\u6210", failed: "\u5931\u8D25" }[block.phase] || block.phase;
    const bodyParts = [];
    if (block.argsPreview) bodyParts.push(`<div class="label">\u53C2\u6570</div>${esc(block.argsPreview)}`);
    if (block.resultPreview) bodyParts.push(`<div class="label">\u7ED3\u679C</div>${esc(block.resultPreview)}`);
    return `<div class="tool ${esc(block.phase)}">
    <button class="tool-head" data-action="toggle-tool" data-id="${esc(block.callId)}">
      <span class="tool-icon">\u2699</span>
      <span class="tool-title">${esc(label)}</span>
      <span class="tool-phase">${esc(phase)}</span>
    </button>
    ${expanded && bodyParts.length ? `<div class="tool-body">${bodyParts.join("")}</div>` : ""}
  </div>`;
  }
  function pendingCardsFor(sessionId) {
    const cards = client.getPendingCards();
    const list = [];
    for (const card of cards.permissions) {
      if (card.state !== "open") continue;
      if (card.sessionId && card.sessionId !== sessionId) continue;
      list.push({ kind: "permission", at: card.receivedAt, card });
    }
    for (const card of cards.questions) {
      if (card.state !== "open") continue;
      if (card.sessionId && card.sessionId !== sessionId) continue;
      list.push({ kind: "question", at: card.receivedAt, card });
    }
    return list.sort((a, b) => a.at - b.at);
  }
  function permissionCardHtml(card) {
    const options = card.options && card.options.length ? card.options : [
      { id: "allow", label: "\u5141\u8BB8\u4E00\u6B21" },
      { id: "deny", label: "\u62D2\u7EDD" }
    ];
    const disabled = card.state !== "open";
    const stateText = card.state === "resolved" ? "\u5DF2\u5904\u7406" : card.state === "submitted" ? "\u5DF2\u63D0\u4EA4" : "\u7B49\u5F85\u4F60";
    const expires = card.expiresAt ? Date.parse(card.expiresAt) : 0;
    const seconds = expires ? Math.max(0, Math.round((expires - Date.now()) / 1e3)) : 0;
    return `<div class="approval-card ${esc(card.state)}">
    <div class="approval-head">
      <span class="approval-icon">!</span>
      <div class="approval-head-text">
        <div class="card-kicker">\u9700\u8981\u4F60\u7684\u6279\u51C6</div>
        <div class="card-title">${esc(card.action || "\u7535\u8111\u8BF7\u6C42\u6267\u884C\u4E00\u4E2A\u64CD\u4F5C")}</div>
      </div>
      <span class="approval-state">${esc(stateText)}</span>
    </div>
    ${card.resource ? `<div class="approval-row"><span>\u8D44\u6E90</span><code>${esc(card.resource)}</code></div>` : ""}
    ${card.reason ? `<div class="approval-row"><span>\u539F\u56E0</span><b>${esc(card.reason)}</b></div>` : ""}
    ${seconds ? `<div class="approval-hint">\u7EA6 ${seconds} \u79D2\u5185\u6709\u6548</div>` : ""}
    ${disabled ? `<div class="approval-hint">${card.state === "resolved" ? "\u5DF2\u5728\u7535\u8111\u6216\u624B\u673A\u5904\u7406" : "\u5DF2\u63D0\u4EA4\uFF0C\u7B49\u5F85\u7535\u8111\u786E\u8BA4"}</div>` : `<div class="approval-actions">${options.map((option) => {
      const id = String(option.id || "");
      const kind = /session/i.test(id) ? "session" : id === "deny" || id === "reject" ? "reject" : "allow";
      return `<button class="approval-btn ${kind}" data-action="approve" data-request="${esc(card.requestId)}" data-decision="${esc(id)}">${esc(option.label || id)}</button>`;
    }).join("")}</div>`}
    <div class="approval-foot">\u624B\u673A\u548C\u7535\u8111\u90FD\u80FD\u5904\u7406\uFF0C\u5148\u70B9\u7684\u7B97\uFF1B\u672C\u4F1A\u8BDD\u7684\u300C\u59CB\u7EC8\u5141\u8BB8\u300D\u5728\u4F1A\u8BDD\u7ED3\u675F\u540E\u5931\u6548\u3002</div>
  </div>`;
  }
  function answerDraft(requestId, questionId) {
    if (!ui.answers[requestId]) ui.answers[requestId] = {};
    if (!ui.answers[requestId][questionId]) ui.answers[requestId][questionId] = { selected: [], text: "" };
    return ui.answers[requestId][questionId];
  }
  function questionCardHtml(card) {
    const disabled = card.state !== "open";
    const blocks = (card.questions || []).map((question) => {
      const draft = answerDraft(card.requestId, question.id);
      const options = (question.options || []).map(
        (option) => `<button class="q-option ${draft.selected.includes(option.id) ? "selected" : ""}" data-action="choose-option"
            data-request="${esc(card.requestId)}" data-question="${esc(question.id)}" data-option="${esc(option.id)}"
            ${disabled ? "disabled" : ""}>${esc(option.label || option.id)}</button>`
      ).join("");
      return `<div class="question-block">
        <div class="q-title">${esc(question.question || "\u8BF7\u9009\u62E9")}${question.multi ? "\uFF08\u53EF\u591A\u9009\uFF09" : ""}</div>
        ${options ? `<div class="q-options">${options}</div>` : ""}
        ${disabled ? draft.text ? `<div class="card-detail">${esc(draft.text)}</div>` : "" : `<textarea class="q-free" rows="2" placeholder="${options ? "\u8865\u5145\u8BF4\u660E\uFF08\u53EF\u9009\uFF09" : "\u8F93\u5165\u56DE\u7B54"}" data-question-free data-request="${esc(card.requestId)}" data-question="${esc(question.id)}">${esc(draft.text)}</textarea>`}
      </div>`;
    }).join("");
    return `<div class="action-card question ${esc(card.state)}">
    <div class="card-kicker">\u63D0\u95EE</div>
    <div class="card-title">\u4E3B\u673A\u9700\u8981\u4F60\u7684\u56DE\u7B54</div>
    ${blocks}
    ${disabled ? `<div class="card-hint">${card.state === "resolved" ? "\u5DF2\u5728\u7535\u8111\u4E0A\u56DE\u7B54" : "\u5DF2\u63D0\u4EA4\uFF0C\u7B49\u5F85\u4E3B\u673A\u786E\u8BA4"}</div>` : `<div class="card-buttons"><button class="btn small primary" data-action="submit-answer" data-request="${esc(card.requestId)}">\u63D0\u4EA4\u56DE\u7B54</button></div>`}
  </div>`;
  }
  function renderAttachments() {
    const strip = $("#attachStrip");
    const items = [];
    ui.attachments.images.forEach((image, index) => {
      items.push(`<span class="attach-chip">
      <img src="data:image/jpeg;base64,${image.data}" alt="" />
      <span class="name">${esc(image.name)}</span>
      <button class="x" data-action="remove-image" data-index="${index}" aria-label="\u79FB\u9664">\xD7</button>
    </span>`);
    });
    ui.attachments.files.forEach((file, index) => {
      items.push(`<span class="attach-chip">
      <span class="name">${esc(file.name)} \xB7 ${fmtSize(b64Size(file.data))}</span>
      <button class="x" data-action="remove-file" data-index="${index}" aria-label="\u79FB\u9664">\xD7</button>
    </span>`);
    });
    strip.innerHTML = items.join("");
    strip.classList.toggle("hidden", items.length === 0);
  }
  function updateComposer() {
    const composer = $("#composer");
    if (ui.view !== "chat") {
      composer.classList.add("hidden");
      return;
    }
    composer.classList.remove("hidden");
    const input = $("#composerInput");
    const send = $("#sendBtn");
    const hasContent = input.value.trim().length > 0 || ui.attachments.images.length || ui.attachments.files.length;
    send.disabled = !hasContent;
    renderAttachments();
    autosize();
  }
  function autosize() {
    const input = $("#composerInput");
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(132, input.scrollHeight)}px`;
  }
  function bindGlobalEvents() {
    window.addEventListener("hashchange", () => routeFromHash(false));
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      handleAction(action, target, event);
    });
    document.addEventListener("input", (event) => {
      const el = event.target;
      if (el.id === "composerInput") {
        autosize();
        updateComposer();
      } else if (el.id === "pairCode") {
        el.value = el.value.replace(/\D/g, "").slice(0, 6);
      } else if (el.matches("[data-question-free]")) {
        const draft = answerDraft(el.dataset.request, el.dataset.question);
        draft.text = el.value;
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.target.id === "pairCode" && event.key === "Enter") {
        event.preventDefault();
        submitPair();
      }
    });
    $("#imageInput").addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = "";
      await addImages(files);
    });
    $("#fileInput").addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = "";
      await addFiles(files);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        ui.hiddenAt = Date.now();
        return;
      }
      if (!ui.hiddenAt) return;
      const hiddenFor = Date.now() - ui.hiddenAt;
      ui.hiddenAt = 0;
      const state = client.getState();
      if (state.paired) client.resume(hiddenFor);
      if (ui.view === "chat") client.getPending(ui.sessionId);
    });
    window.DRCApp = {
      onBack() {
        if (ui.sheetOpen) {
          closeSheet();
          return true;
        }
        if (ui.view === "chat") {
          navigate("sessions");
          return true;
        }
        if (ui.view === "pair") {
          navigate("hosts");
          return true;
        }
        if (ui.view !== "sessions") {
          navigate("sessions");
          return true;
        }
        return false;
      }
    };
    window.__drcPause = () => {
      ui.hiddenAt = Date.now();
    };
    window.__drcResume = () => {
      const hiddenFor = ui.hiddenAt ? Date.now() - ui.hiddenAt : 0;
      ui.hiddenAt = 0;
      if (client.getState().paired) client.resume(hiddenFor);
      if (ui.view === "chat") client.getPending(ui.sessionId);
    };
  }
  function syncScreenOn() {
    if (!window.AndroidBridge || typeof AndroidBridge.keepScreenOn !== "function") return;
    const model = ui.view === "chat" ? client.getModel(ui.sessionId) : null;
    const running = !!(model && model.runState === "running");
    try {
      AndroidBridge.keepScreenOn(running);
    } catch {
    }
  }
  function handleAction(action, target, event) {
    switch (action) {
      case "tab":
        navigate(target.dataset.view);
        return;
      case "back":
        navigate(ui.view === "chat" ? "sessions" : ui.view === "tutorial" ? "settings" : "hosts");
        return;
      case "go-hosts":
        navigate("hosts");
        return;
      case "go-pair": {
        const snapshot = client.getHosts();
        if (!snapshot.hosts.length) {
          addHostSheet();
          return;
        }
        const host = snapshot.hosts.find((item) => item.id === snapshot.activeHostId);
        const mode = snapshot.mode === "lan" && host.endpoints.lan ? "lan" : "relay";
        if (!host.endpoints[mode]) {
          toast("\u5F53\u524D\u7AEF\u70B9\u8FD8\u6CA1\u6709\u5730\u5740\uFF0C\u5148\u586B\u5199\u5730\u5740", "error");
          navigate("hosts");
          return;
        }
        navigate("pair");
        return;
      }
      case "refresh": {
        const ok = client.refreshSessions();
        client.getPending(ui.sessionId || void 0);
        toast(ok ? "\u5DF2\u8BF7\u6C42\u5237\u65B0" : "\u672A\u8FDE\u63A5\u4E3B\u673A\uFF0C\u663E\u793A\u672C\u5730\u7F13\u5B58", ok ? "ok" : "error");
        return;
      }
      case "reconnect":
        try {
          client.connect();
        } catch (error) {
          toast(String(error.message || error), "error");
        }
        return;
      case "new-session": {
        const ok = client.newSession();
        toast(ok ? "\u6B63\u5728\u65B0\u5EFA\u4F1A\u8BDD\u2026" : "\u672A\u8FDE\u63A5\u4E3B\u673A", ok ? "info" : "error");
        return;
      }
      case "open-session":
        navigate("chat", target.dataset.id);
        return;
      case "toggle-archived":
        ui.showArchived = !ui.showArchived;
        render();
        return;
      case "toggle-untitled":
        ui.showUntitled = !ui.showUntitled;
        if (ui.view === "sessions") {
          const container = $("#sessionList");
          if (container) container.innerHTML = sessionRowsHtml();
        } else {
          render();
        }
        return;
      case "archive-session":
        if (!ui.sessionId) return;
        confirmSheet("\u5F52\u6863\u4F1A\u8BDD", "\u5F52\u6863\u540E\u53EF\u4EE5\u5728\u300C\u5DF2\u5F52\u6863\u300D\u91CC\u627E\u56DE\u3002", "\u5F52\u6863", () => {
          client.archiveSession(ui.sessionId, true);
          navigate("sessions");
        });
        return;
      case "interrupt":
        client.interrupt(ui.sessionId);
        toast("\u5DF2\u53D1\u9001\u505C\u6B62\u8BF7\u6C42");
        return;
      case "load-earlier":
        if (!client.loadEarlier()) toast("\u6CA1\u6709\u66F4\u65E9\u7684\u6D88\u606F\u6216\u5C1A\u672A\u8FDE\u63A5", "error");
        return;
      case "toggle-todo":
        ui.todoOpen = !ui.todoOpen;
        renderChatMessages();
        return;
      case "toggle-tool": {
        const id = target.dataset.id;
        if (ui.expanded.has(id)) ui.expanded.delete(id);
        else ui.expanded.add(id);
        renderChatMessages();
        return;
      }
      case "retry":
        client.retrySend(target.dataset.id);
        return;
      case "view-artifact": {
        const model = client.getModel(ui.sessionId);
        const block = model ? model.byId.get(target.dataset.id) : null;
        if (!block || !block.data) return;
        openSheet(`<img class="full-image" src="data:${esc(block.mediaType)};base64,${block.data}" alt="${esc(
          block.name
        )}" /><div class="sheet-actions"><button class="btn" data-action="close-sheet">\u5173\u95ED</button></div>`);
        return;
      }
      case "save-artifact": {
        const model = client.getModel(ui.sessionId);
        const block = model ? model.byId.get(target.dataset.id) : null;
        saveArtifact(block);
        return;
      }
      case "view-image": {
        const model = client.getModel(ui.sessionId);
        const block = model ? model.byId.get(target.dataset.id) : null;
        const image = block && block.images ? block.images[Number(target.dataset.index)] : null;
        if (!image) return;
        openSheet(`<img class="full-image" src="data:${esc(image.mediaType || "image/jpeg")};base64,${image.data}" alt="${esc(
          image.name || ""
        )}" /><div class="sheet-actions"><button class="btn" data-action="close-sheet">\u5173\u95ED</button></div>`);
        return;
      }
      case "resend-files": {
        const model = client.getModel(ui.sessionId);
        const block = model ? model.byId.get(target.dataset.id) : null;
        if (!block || block.fileFallbackSent || !(block.images || []).length) return;
        block.fileFallbackSent = true;
        client.cancelImageRetry(block.clientMsgId);
        const files = block.images.map((image) => ({
          name: image.name || "image.jpg",
          mediaType: image.mediaType || "image/jpeg",
          data: image.data
        }));
        const text = block.parts.map((part) => part.text).join("");
        const result = client.sendPrompt(text, { images: [], files });
        if (!result.ok) {
          block.fileFallbackSent = false;
          toast(result.error || "\u53D1\u9001\u5931\u8D25", "error");
        } else {
          block.error = "\u5DF2\u6539\u7528\u6587\u4EF6\u53D1\u9001\uFF08\u5728\u4E0B\u65B9\u65B0\u6C14\u6CE1\uFF09";
          block.retryPending = false;
          renderChatMessages();
        }
        return;
      }
      case "approve":
        client.resolvePermission(target.dataset.request, target.dataset.decision);
        return;
      case "choose-option": {
        const { request, question, option } = target.dataset;
        const card = client.getPendingCards().questions.find((item) => item.requestId === request);
        const meta = card ? card.questions.find((item) => item.id === question) : null;
        const draft = answerDraft(request, question);
        if (meta && meta.multi) {
          const index = draft.selected.indexOf(option);
          if (index === -1) draft.selected.push(option);
          else draft.selected.splice(index, 1);
        } else {
          draft.selected = [option];
        }
        renderChatMessages();
        return;
      }
      case "submit-answer": {
        const request = target.dataset.request;
        const card = client.getPendingCards().questions.find((item) => item.requestId === request);
        if (!card) return;
        const answers = card.questions.map((question) => {
          const draft = answerDraft(request, question.id);
          const answer = { questionId: question.id, selected: draft.selected.slice() };
          if (draft.text.trim()) answer.freeText = draft.text.trim();
          return answer;
        });
        const result = client.answerQuestion(request, answers);
        if (!result.ok) toast(result.error, "error");
        else toast("\u5DF2\u63D0\u4EA4\u56DE\u7B54");
        return;
      }
      case "add-host":
        addHostSheet();
        return;
      case "save-host": {
        const label = ($("#hostLabel") || {}).value || "我的电脑";
        const mode = ($("#hostMode") || {}).value === "relay" ? "relay" : "lan";
        const relayUrl = mode === "relay" ? (($("#hostRelay") || {}).value || "").trim() : "";
        const lanAddress = mode === "lan" ? (($("#hostLan") || {}).value || "").trim() : "";
        if (mode === "relay" && !relayUrl) {
          toast("请填写你自己的中继服务器地址", "error");
          return;
        }
        if (mode === "lan" && !lanAddress) {
          toast("请填写电脑的局域网地址", "error");
          return;
        }
        try {
          const host = client.addHost({ label, relayUrl, lanAddress, mode });
          const preferred = mode === "lan" && host.endpoints.lan ? "lan" : mode === "relay" && host.endpoints.relay ? "relay" : null;
          if (preferred) client.setMode(preferred);
          closeSheet();
          render();
          toast("已添加主机");
        } catch (error) {
          toast(String(error.message || error), "error");
        }
        return;
      }
      case "edit-host":
        editHostSheet(target.dataset.host);
        return;
      case "save-host-edit": {
        const hostId = target.dataset.host;
        const label = (($("#editHostLabel") || {}).value || "").trim();
        try {
          client.updateHost(hostId, { label: label || "\u6211\u7684\u7535\u8111" });
          closeSheet();
          render();
          toast("\u5DF2\u4FDD\u5B58");
        } catch (error) {
          toast(String(error.message || error), "error");
        }
        return;
      }
      case "edit-endpoint":
        editEndpointSheet(target.dataset.host, target.dataset.mode);
        return;
      case "save-endpoint": {
        const hostId = target.dataset.host;
        const mode = target.dataset.mode;
        const value = (($("#endpointUrl") || {}).value || "").trim();
        try {
          const patch = mode === "lan" ? { lanAddress: value } : { relayUrl: value };
          client.updateHost(hostId, patch);
          closeSheet();
          render();
          toast("\u5730\u5740\u5DF2\u4FDD\u5B58");
        } catch (error) {
          toast(String(error.message || error), "error");
        }
        return;
      }
      case "select-host":
        client.selectHost(target.dataset.host);
        render();
        return;
      case "use-mode": {
        const hostId = target.dataset.host;
        const mode = target.dataset.mode;
        try {
          if (hostId !== client.getHosts().activeHostId) client.selectHost(hostId);
          client.setMode(mode);
          const snapshot = client.getHosts();
          const host = snapshot.hosts.find((item) => item.id === hostId);
          const endpoint = host ? host.endpoints[mode] : null;
          if (endpoint && endpoint.paired) client.connect();
          render();
        } catch (error) {
          toast(String(error.message || error), "error");
        }
        return;
      }
      case "pair-open": {
        const hostId = target.dataset.host;
        const mode = target.dataset.mode;
        try {
          if (hostId !== client.getHosts().activeHostId) client.selectHost(hostId);
          client.setMode(mode);
          navigate("pair");
        } catch (error) {
          toast(String(error.message || error), "error");
        }
        return;
      }
      case "pair-submit":
        submitPair();
        return;
      case "pair-confirm":
        client.confirmPairing();
        toast("\u5DF2\u786E\u8BA4\uFF0C\u6B63\u5728\u5EFA\u7ACB\u52A0\u5BC6\u901A\u9053");
        return;
      case "pair-cancel":
        client.cancelPair();
        navigate("hosts");
        return;
      case "remove-host":
        confirmSheet("\u5220\u9664\u4E3B\u673A", "\u4F1A\u540C\u65F6\u5220\u9664\u8FD9\u53F0\u4E3B\u673A\u4E0A\u4E24\u4E2A\u7AEF\u70B9\u7684\u914D\u5BF9\u4FE1\u606F\u3002", "\u5220\u9664", () => {
          client.removeHost(target.dataset.host);
          render();
          toast("\u5DF2\u5220\u9664");
        });
        return;
      case "open-attach":
        openAttachSheet();
        return;
      case "attach-image":
        closeSheet();
        $("#imageInput").click();
        return;
      case "attach-file":
        closeSheet();
        $("#fileInput").click();
        return;
      case "remove-image":
        ui.attachments.images.splice(Number(target.dataset.index), 1);
        updateComposer();
        return;
      case "remove-file":
        ui.attachments.files.splice(Number(target.dataset.index), 1);
        updateComposer();
        return;
      case "send":
        doSend();
        return;
      case "toggle-keep-awake":
        client.setKeepAwake(!client.getKeepAwake().enabled);
        return;
      case "get-pending":
        client.getPending(ui.sessionId || void 0);
        toast("\u5DF2\u8BF7\u6C42\u5F85\u5904\u7406\u9879");
        return;
      case "forget-pairing":
        confirmSheet("\u5FD8\u8BB0\u914D\u5BF9", "\u672C\u7AEF\u70B9\u7684 PSK \u4F1A\u88AB\u6E05\u9664\uFF0C\u9700\u8981\u91CD\u65B0\u8F93\u5165 6 \u4F4D\u7801\u3002", "\u6E05\u9664", () => {
          client.forgetPairing();
          render();
          toast("\u5DF2\u6E05\u9664\u914D\u5BF9");
        });
        return;
      case "scan-qr":
        if (window.AndroidBridge && typeof window.AndroidBridge.scanQr === "function") {
          window.AndroidBridge.scanQr();
        } else {
          toast("\u5F53\u524D\u7248\u672C\u4E0D\u652F\u6301\u626B\u7801\uFF0C\u8BF7\u624B\u52A8\u586B\u5199\u5730\u5740", "error");
        }
        return;
      case "open-permission":
        openPermissionSheet();
        return;
      case "refresh-run":
        client.refreshSessions();
        setTimeout(updateRunIndicator, 500);
        return;
      case "set-permission": {
        const preset = target.dataset.preset;
        if (!preset) return;
        target.disabled = true;
        client.setPermission(preset).then((data) => {
          ui.permission = normalizePermissionData(data);
          renderPermissionSheet();
          toast("\u7535\u8111\u6743\u9650\u5DF2\u66F4\u65B0", "ok");
        }).catch((error) => {
          target.disabled = false;
          toast(String(error.message || error), "error");
        });
        return;
      }
      case "open-tutorial":
        closeSheet();
        navigate("tutorial");
        return;
      case "export-config":
        exportConfigSheet();
        return;
      case "copy-prompt":
        copyText(tutorialPrompt(target.dataset.kind));
        toast("指令已复制");
        return;
      case "copy-config":
        copyText(ui.exportText || "");
        toast("\u914D\u7F6E\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F", "ok");
        return;
      case "import-config":
        importConfigSheet();
        return;
      case "do-import-config": {
        const area = $("#importConfigText");
        try {
          const count = client.importConfig(area ? area.value : "");
          closeSheet();
          render();
          toast(`\u5DF2\u5BFC\u5165 ${count} \u53F0\u4E3B\u673A`, "ok");
        } catch (error) {
          toast(String(error.message || error), "error");
        }
        return;
      }
      case "clear-cache":
        client.clearHistoryCaches();
        toast("\u5DF2\u6E05\u9664\u672C\u5730\u7F13\u5B58");
        return;
      case "close-sheet":
        closeSheet();
        return;
      default:
        break;
    }
  }
  function openSheet(html) {
    $("#sheet").innerHTML = `<div class="sheet-handle"></div>${html}`;
    $("#sheetWrap").classList.remove("hidden");
    ui.sheetOpen = true;
  }
  function closeSheet() {
    $("#sheetWrap").classList.add("hidden");
    ui.sheetOpen = false;
    $("#sheet").innerHTML = "";
  }
  function openAttachSheet() {
    const limits = client.getLimits();
    const maxImages = limits && typeof limits.maxImageAttachments === "number" ? limits.maxImageAttachments : import_payloads.MAX_IMAGE_ATTACHMENTS;
    openSheet(`<h3>\u6DFB\u52A0\u9644\u4EF6</h3>
    <p class="sheet-sub">\u56FE\u7247\u4F1A\u5148\u538B\u7F29\u5230 512KB \u4EE5\u5185\uFF1B\u6587\u4EF6\u4F1A\u5B58\u5230\u7535\u8111\u7684 uploads \u76EE\u5F55\u3002</p>
    <div class="attach-options">
      <button class="attach-option" data-action="attach-image" ${maxImages <= 0 ? "disabled" : ""}>
        <span class="attach-option-icon">\u25A7</span>
        <span><b>\u7167\u7247</b><small>${maxImages <= 0 ? "\u5F53\u524D\u6A21\u578B\u4E0D\u652F\u6301\u56FE\u7247\u8F93\u5165" : "\u4ECE\u76F8\u518C\u9009\u62E9\uFF0C\u53EF\u591A\u9009"}</small></span>
      </button>
      <button class="attach-option" data-action="attach-file">
        <span class="attach-option-icon">\u25A4</span>
        <span><b>\u6587\u4EF6</b><small>\u4EFB\u610F\u6587\u4EF6\uFF0C\u5408\u8BA1\u4E0D\u8D85\u8FC7 512KB</small></span>
      </button>
    </div>
    <div class="sheet-actions">
      <button class="btn" data-action="close-sheet">\u53D6\u6D88</button>
    </div>`);
  }
  function tutorialPrompt(kind) {
    if (kind === "relay") {
      return "请帮我把 DSH Remoto 配置成使用我自己的中继服务器：\n中继地址：wss://你的中继服务器/v05\n不要重置现有配对和 user-config。\n请把中继地址写入 DSH Remoto 主机目录的 relay.txt，然后运行一次 switch-to-relay.bat。";
    }
    if (kind === "deploy") {
      return "请帮我在 VPS 上部署 DSH Remoto 中继：\n把主机包里的 host/relay.mjs 上传到 /opt/dsh-remote/relay.mjs，\n用 Node 20 监听 127.0.0.1:8787，用 Caddy 反代到 wss://你的中继服务器/v05，\n开放 443；不要修改 DSH 本体。";
    }
    return "请在这台电脑安装 DSH Remoto 主机服务：\n1. 把 DSH-remoto-host-" + APP_VERSION + ".zip 解压到固定目录；\n2. 完全退出 DSH（包括托盘）；\n3. 运行 run-install.bat；\n4. 重新打开 DSH。\n不要删除 %USERPROFILE%\\.dsh\\dsh-remote-control 里的现有配置。";
  }
  function copyText(text) {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        return;
      }
    } catch {
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch {
    }
    area.remove();
  }
  function exportConfigSheet() {
    ui.exportText = client.exportConfig();
    openSheet(`<h3>\u5BFC\u51FA\u8FDE\u63A5\u914D\u7F6E</h3>
    <p class="sheet-sub">\u5305\u542B\u4E3B\u673A\u3001\u7AEF\u70B9\u548C PSK\u3002\u53EA\u7528\u4E8E\u6362\u673A/\u91CD\u88C5\u524D\u5907\u4EFD\uFF0C\u4E0D\u8981\u53D1\u7ED9\u522B\u4EBA\u3002</p>
    <div class="field"><textarea id="exportConfigText" rows="9" readonly style="font-family:var(--mono);font-size:11px">${esc(
      ui.exportText
    )}</textarea></div>
    <div class="sheet-actions">
      <button class="btn" data-action="close-sheet">\u5173\u95ED</button>
      <button class="btn primary" data-action="copy-config">\u590D\u5236</button>
    </div>`);
  }
  function importConfigSheet() {
    openSheet(`<h3>\u5BFC\u5165\u8FDE\u63A5\u914D\u7F6E</h3>
    <p class="sheet-sub">\u7C98\u8D34\u4E4B\u524D\u5BFC\u51FA\u7684 JSON\u3002\u5BFC\u5165\u4F1A\u8986\u76D6\u5F53\u524D\u4E3B\u673A\u548C\u914D\u5BF9\uFF0C\u6B63\u5728\u8FDB\u884C\u7684\u8FDE\u63A5\u4F1A\u65AD\u5F00\u3002</p>
    <div class="field"><textarea id="importConfigText" rows="9" placeholder="{ ... }" style="font-family:var(--mono);font-size:11px"></textarea></div>
    <div class="sheet-actions">
      <button class="btn" data-action="close-sheet">\u53D6\u6D88</button>
      <button class="btn primary" data-action="do-import-config">\u5BFC\u5165</button>
    </div>`);
  }
  function normalizePermissionData(data) {
    const labels = {
      "read-only": "\u4EC5\u53EF\u67E5\u770B",
      "workspace-write": "\u5DE5\u4F5C\u533A\u5185\u4FEE\u6539",
      "danger-full-access": "\u5B8C\u5168\u6743\u9650",
      ask: "\u6BCF\u6B21\u8BE2\u95EE",
      auto: "\u81EA\u52A8\u5224\u65AD"
    };
    const descriptions = {
      "read-only": "\u53EA\u80FD\u8BFB\u53D6\uFF0C\u4FEE\u6539\u6587\u4EF6\u6216\u6267\u884C\u547D\u4EE4\u9700\u8981\u5BA1\u6279",
      "workspace-write": "\u53EA\u5141\u8BB8\u4FEE\u6539\u5DE5\u4F5C\u533A\uFF0C\u5176\u4ED6\u64CD\u4F5C\u9700\u8981\u5BA1\u6279",
      "danger-full-access": "\u4E0D\u9650\u5236\u6587\u4EF6\u548C\u547D\u4EE4\uFF0C\u8BF7\u8C28\u614E\u4F7F\u7528",
      ask: "\u6BCF\u6B21\u5DE5\u5177\u64CD\u4F5C\u90FD\u8BF7\u6C42\u5BA1\u6279",
      auto: "\u7531\u6A21\u578B\u81EA\u52A8\u5224\u65AD\u662F\u5426\u9700\u8981\u5BA1\u6279"
    };
    const raw = data || {};
    const options = (Array.isArray(raw.options) ? raw.options : []).map((option) => {
      if (typeof option === "string") {
        return { id: option, label: labels[option] || option, description: descriptions[option] || "" };
      }
      const id = String(option.id || option.value || option.preset || "");
      const rawLabel = option.label || option.name || id;
      return {
        id,
        label: labels[id] || rawLabel || id,
        description: option.description || option.desc || descriptions[id] || ""
      };
    }).filter((option) => option.id);
    const current = typeof raw.current === "string" ? raw.current : raw.current && (raw.current.id || raw.current.value || raw.current.preset) ? String(raw.current.id || raw.current.value || raw.current.preset) : "";
    return { current, options };
  }
  function permissionLabel(data, id) {
    const option = data.options.find((item) => item.id === id);
    return option ? option.label : id || "\u672A\u77E5";
  }
  function renderPermissionSheet() {
    const data = ui.permission || { current: "", options: [] };
    if (!data.options.length) {
      openSheet(`<h3>\u7535\u8111\u6743\u9650</h3>
      <p class="sheet-sub">\u4E3B\u673A\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u7684\u6743\u9650\u76EE\u5F55\u3002\u8BF7\u786E\u8BA4 DSH \u7248\u672C\u652F\u6301 permissionPresets\uFF0C\u5E76\u4E14\u5DF2\u91CD\u542F DSH\u3002</p>
      <div class="sheet-actions"><button class="btn" data-action="close-sheet">\u5173\u95ED</button></div>`);
      return;
    }
    openSheet(`<h3>\u7535\u8111\u6743\u9650</h3>
    <p class="sheet-sub">\u4FEE\u6539\u7535\u8111\u6267\u884C\u5DE5\u5177\u3001\u4FEE\u6539\u6587\u4EF6\u65F6\u7684\u6388\u6743\u7EA7\u522B\u3002\u6743\u9650\u4F1A\u7ACB\u5373\u751F\u6548\uFF0C\u53EF\u80FD\u540C\u65F6\u6539\u53D8\u5BA1\u6279\u7B56\u7565\u3002</p>
    <div class="permission-list">${data.options.map(
      (option) => `<button class="permission-option ${option.id === data.current ? "active" : ""}" data-action="set-permission" data-preset="${esc(option.id)}">
          <span class="permission-check">${option.id === data.current ? "\u2713" : ""}</span>
          <span><b>${esc(option.label)}</b>${option.description ? `<small>${esc(option.description)}</small>` : ""}</span>
        </button>`
    ).join("")}</div>
    <div class="current-permission">\u5F53\u524D\uFF1A<b>${esc(permissionLabel(data, data.current))}</b></div>
    <div class="sheet-actions"><button class="btn" data-action="close-sheet">\u5173\u95ED</button></div>`);
  }
  function openPermissionSheet() {
    openSheet(`<h3>\u7535\u8111\u6743\u9650</h3><p class="sheet-sub">\u6B63\u5728\u8BFB\u53D6\u7535\u8111\u7684\u6743\u9650\u76EE\u5F55\u2026</p>`);
    client.getPermission().then((data) => {
      ui.permission = normalizePermissionData(data);
      renderPermissionSheet();
    }).catch((error) => {
      openSheet(`<h3>\u7535\u8111\u6743\u9650</h3>
        <p class="sheet-sub">\u8BFB\u53D6\u5931\u8D25\uFF1A${esc(String(error.message || error))}</p>
        <div class="sheet-actions"><button class="btn" data-action="close-sheet">\u5173\u95ED</button></div>`);
    });
  }
  function confirmSheet(title, message, confirmLabel, onConfirm) {
    openSheet(`<h3>${esc(title)}</h3>
    <p class="sheet-sub">${esc(message)}</p>
    <div class="sheet-actions">
      <button class="btn" data-action="close-sheet">\u53D6\u6D88</button>
      <button class="btn danger" id="confirmAction">${esc(confirmLabel)}</button>
    </div>`);
    $("#confirmAction").addEventListener("click", () => {
      closeSheet();
      onConfirm();
    });
  }
  function addHostSheet() {
    openSheet(`<h3>添加主机</h3>
    <p class="sheet-sub">先选连接方式。中继服务器使用你自己部署的地址；本地局域网不需要服务器。</p>
    <div class="field">
      <label>连接方式</label>
      <select id="hostMode">
        <option value="lan" selected>本地局域网</option>
        <option value="relay">中继服务器</option>
      </select>
    </div>
    <div class="field">
      <label>名称</label>
      <input id="hostLabel" value="${esc(activeHostName() || "我的电脑")}" autocomplete="off" />
    </div>
    <div class="field" id="relayField" style="display:none">
      <label>中继地址（wss://）</label>
      <input id="hostRelay" placeholder="wss://你的中继服务器/v05" autocomplete="off" spellcheck="false" />
      <div class="hint">中继地址不再内置。部署自己的中继服务器请见教程「自建中继服务器」。</div>
    </div>
    <div class="field" id="lanField">
      <label>局域网地址（IP 或 ws://）</label>
      <input id="hostLan" placeholder="192.168.1.8:8787" autocomplete="off" spellcheck="false" />
      <div class="hint">手机与电脑同一 Wi-Fi；电脑主机包启动局域网中继后使用。</div>
    </div>
    <div class="sheet-actions">
      <button class="btn" data-action="close-sheet">取消</button>
      <button class="btn primary" data-action="save-host">添加</button>
    </div>`);
    const mode = $("#hostMode");
    if (mode) {
      mode.addEventListener("change", updateHostFields);
      updateHostFields();
    }
  }
  function updateHostFields() {
    const mode = ($("#hostMode") || {}).value || "lan";
    const relayField = $("#relayField");
    const lanField = $("#lanField");
    if (relayField) relayField.style.display = mode === "relay" ? "" : "none";
    if (lanField) lanField.style.display = mode === "lan" ? "" : "none";
  }
  function editHostSheet(hostId) {
    const host = client.getHosts().hosts.find((item) => item.id === hostId);
    if (!host) return;
    openSheet(`<h3>\u7F16\u8F91\u4E3B\u673A</h3>
    <p class="sheet-sub">\u53EA\u6539\u540D\u79F0\uFF0C\u4E0D\u4F1A\u5F71\u54CD\u914D\u5BF9\u3002</p>
    <div class="field"><label>\u540D\u79F0</label><input id="editHostLabel" value="${esc(host.label)}" /></div>
    <div class="sheet-actions">
      <button class="btn" data-action="close-sheet">\u53D6\u6D88</button>
      <button class="btn primary" data-action="save-host-edit" data-host="${esc(hostId)}">\u4FDD\u5B58</button>
    </div>`);
  }
  function editEndpointSheet(hostId, mode) {
    const host = client.getHosts().hosts.find((item) => item.id === hostId);
    if (!host) return;
    const endpoint = host.endpoints[mode];
    const label = mode === "lan" ? "\u5C40\u57DF\u7F51\u5730\u5740" : "\u4E2D\u7EE7\u5730\u5740";
    openSheet(`<h3>${esc(label)}</h3>
    <p class="sheet-sub">${mode === "lan" ? "\u53EF\u4EE5\u76F4\u63A5\u586B\u7535\u8111\u7684\u5C40\u57DF\u7F51 IP\uFF08\u9ED8\u8BA4\u7AEF\u53E3 8787\uFF09\uFF0C\u4E5F\u53EF\u4EE5\u586B\u5B8C\u6574\u7684 ws:// \u5730\u5740\u3002" : "\u5B8C\u6574\u7684\u4E2D\u7EE7\u5730\u5740\uFF0C\u4EE5 wss:// \u5F00\u5934\u3002"}</p>
    <div class="field">
      <label>${esc(label)}</label>
      <input id="endpointUrl" value="${esc(endpoint ? endpoint.url : "")}" placeholder="${mode === "lan" ? "192.168.1.8:8787" : "wss://relay.example"}" autocomplete="off" spellcheck="false" />
    </div>
    <div class="sheet-actions">
      <button class="btn" data-action="close-sheet">\u53D6\u6D88</button>
      <button class="btn primary" data-action="save-endpoint" data-host="${esc(hostId)}" data-mode="${mode}">\u4FDD\u5B58</button>
    </div>`);
  }
  function submitPair() {
    const input = $("#pairCode");
    const code = input ? input.value.trim() : "";
    try {
      client.pair(code);
    } catch (error) {
      toast(String(error.message || error), "error");
    }
  }
  async function addImages(files) {
    if (!files.length) return;
    const limits = client.getLimits();
    const maxImages = limits && typeof limits.maxImageAttachments === "number" ? limits.maxImageAttachments : import_payloads.MAX_IMAGE_ATTACHMENTS;
    if (maxImages <= 0) {
      toast("\u5F53\u524D\u4E3B\u673A/\u6A21\u578B\u6CA1\u6709\u56FE\u7247\u8F93\u5165\u80FD\u529B\uFF0C\u8BF7\u6539\u7528\u300C\u6587\u300D\u4EE5\u6587\u4EF6\u53D1\u9001", "error");
      return;
    }
    const room = maxImages - ui.attachments.images.length;
    if (room <= 0) {
      toast(`\u56FE\u7247\u6700\u591A ${maxImages} \u5F20`, "error");
      return;
    }
    for (const file of files.slice(0, room)) {
      try {
        const image = await compressImage(file);
        ui.attachments.images.push(image);
        const total = totalAttachmentBytes();
        if (total > import_payloads.MAX_ATTACHMENT_TOTAL_BYTES) {
          ui.attachments.images.pop();
          toast("\u9644\u4EF6\u5408\u8BA1\u8D85\u8FC7 512KB\uFF0C\u5DF2\u4E22\u5F03\u8FD9\u5F20\u56FE\u7247", "error");
        }
      } catch (error) {
        toast(`\u56FE\u7247\u5904\u7406\u5931\u8D25\uFF1A${String(error.message || error)}`, "error");
      }
    }
    updateComposer();
  }
  async function addFiles(files) {
    if (!files.length) return;
    const room = import_payloads.MAX_FILE_ATTACHMENTS - ui.attachments.files.length;
    if (room <= 0) {
      toast(`\u6587\u4EF6\u6700\u591A ${import_payloads.MAX_FILE_ATTACHMENTS} \u4E2A`, "error");
      return;
    }
    for (const file of files.slice(0, room)) {
      if (file.size > import_payloads.MAX_ATTACHMENT_TOTAL_BYTES) {
        toast(`${file.name} \u8D85\u8FC7 512KB\uFF0C\u672A\u6DFB\u52A0`, "error");
        continue;
      }
      const data = await readBase64(file);
      ui.attachments.files.push({
        name: file.name,
        mediaType: file.type || "application/octet-stream",
        data
      });
      if (totalAttachmentBytes() > import_payloads.MAX_ATTACHMENT_TOTAL_BYTES) {
        ui.attachments.files.pop();
        toast("\u9644\u4EF6\u5408\u8BA1\u8D85\u8FC7 512KB\uFF0C\u5DF2\u4E22\u5F03\u8FD9\u4E2A\u6587\u4EF6", "error");
      }
    }
    updateComposer();
  }
  function totalAttachmentBytes() {
    let total = 0;
    for (const image of ui.attachments.images) total += b64Size(image.data);
    for (const file of ui.attachments.files) total += b64Size(file.data);
    return total;
  }
  function readBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        resolve(result.slice(result.indexOf(",") + 1));
      };
      reader.onerror = () => reject(reader.error || new Error("read failed"));
      reader.readAsDataURL(file);
    });
  }
  async function compressImage(file) {
    const bitmap = await loadBitmap(file);
    const width0 = bitmap.width || bitmap.naturalWidth;
    const height0 = bitmap.height || bitmap.naturalHeight;
    let maxSide = 1400;
    let quality = 0.72;
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const scale = Math.min(1, maxSide / Math.max(width0, height0));
      const width = Math.max(1, Math.round(width0 * scale));
      const height = Math.max(1, Math.round(height0 * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      const data = dataUrl.slice(dataUrl.indexOf(",") + 1);
      if (b64Size(data) <= 120 * 1024) {
        if (bitmap.close) bitmap.close();
        const base = String(file.name || "image").replace(/\.[^.]+$/, "");
        return { name: `${base || "image"}.jpg`, mediaType: "image/jpeg", data, width, height };
      }
      maxSide = Math.round(maxSide * 0.78);
      quality = Math.max(0.45, quality - 0.07);
    }
    if (bitmap.close) bitmap.close();
    throw new Error("\u538B\u7F29\u540E\u4ECD\u7136\u592A\u5927");
  }
  async function loadBitmap(file) {
    if (typeof createImageBitmap === "function") {
      try {
        return await createImageBitmap(file);
      } catch {
      }
    }
    const url = URL.createObjectURL(file);
    try {
      return await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("\u65E0\u6CD5\u89E3\u7801\u56FE\u7247"));
        image.src = url;
      });
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 4e3);
    }
  }
  function doSend() {
    const input = $("#composerInput");
    const text = input.value.trim();
    if (!text && !ui.attachments.images.length && !ui.attachments.files.length) return;
    const limits = client.getLimits();
    const maxImages = limits && typeof limits.maxImageAttachments === "number" ? limits.maxImageAttachments : import_payloads.MAX_IMAGE_ATTACHMENTS;
    if (ui.attachments.images.length) {
      if (maxImages <= 0) {
        toast("\u5F53\u524D\u4E3B\u673A/\u6A21\u578B\u6CA1\u6709\u56FE\u7247\u8F93\u5165\u80FD\u529B\uFF0C\u8BF7\u6539\u7528\u300C\u6587\u300D\u4EE5\u6587\u4EF6\u53D1\u9001", "error");
        return;
      }
      const model = client.getModel(ui.sessionId);
      if (model && model.runState === "running") {
        toast("\u7535\u8111\u6B63\u5728\u601D\u8003\uFF0C\u7B49\u8FD9\u4E00\u8F6E\u7ED3\u675F\u518D\u53D1\u56FE\u7247\uFF1B\u6587\u5B57\u53EF\u4EE5\u73B0\u5728\u53D1", "error");
        return;
      }
    }
    const check = (0, import_payloads.validatePrompt)({ text, images: ui.attachments.images, files: ui.attachments.files });
    if (!check.ok) {
      toast(check.error, "error");
      return;
    }
    const result = client.sendPrompt(text, {
      images: ui.attachments.images.slice(),
      files: ui.attachments.files.slice()
    });
    if (!result.ok) {
      toast(result.error || "\u53D1\u9001\u5931\u8D25", "error");
      return;
    }
    input.value = "";
    ui.attachments = { images: [], files: [] };
    ui.scrollBottom = true;
    ui.stickBottom = true;
    updateComposer();
    renderChatMessages();
  }
  function updateTabbar() {
    $$("#tabbar button").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === ui.view);
    });
  }
  function toast(message, tone) {
    const wrap = $("#toastWrap");
    if (!wrap) return;
    const node = document.createElement("div");
    node.className = `toast ${tone || ""}`;
    node.textContent = message;
    wrap.appendChild(node);
    setTimeout(() => {
      node.style.opacity = "0";
      node.style.transition = "opacity 0.2s";
      setTimeout(() => node.remove(), 220);
    }, 2400);
  }
  function scheduleFullRender() {
    if (ui.renderQueued) return;
    ui.renderQueued = true;
    requestAnimationFrame(() => {
      ui.renderQueued = false;
      render();
    });
  }
  client.on("hosts", () => {
    if (ui.view === "hosts" || ui.view === "settings" || ui.view === "sessions" || ui.view === "pair") scheduleFullRender();
  });
  client.on("state", () => {
    renderTopbar();
    renderBanner();
    if (ui.view === "settings" || ui.view === "hosts") scheduleFullRender();
  });
  client.on("sessions", (list) => {
    if (list.length !== ui.lastSessionCount) {
      ui.lastSessionCount = list.length;
      if (!ui.sessionId && list.length) {
      }
    }
    if (ui.view === "sessions") {
      const container = $("#sessionList");
      if (container) container.innerHTML = sessionRowsHtml();
    }
    renderTopbar();
  });
  client.on("session", (data) => {
    if (data.sessionId === ui.sessionId) renderTopbar();
  });
  client.on("chat", (data) => {
    if (data.sessionId === ui.sessionId) {
      scheduleChatRender();
      syncScreenOn();
    }
  });
  client.on("pending", () => {
    if (ui.view === "chat") scheduleChatRender();
    if (ui.view === "sessions") {
      const container = $("#sessionList");
      if (container) container.innerHTML = sessionRowsHtml();
    }
    if (ui.view === "settings") scheduleFullRender();
  });
  client.on("history", (data) => {
    if (data.sessionId === ui.sessionId) scheduleChatRender();
  });
  client.on("pair", (data) => {
    if (ui.view === "pair") {
      render();
      if (data.state === "paired") {
        setTimeout(() => navigate("sessions"), 500);
      }
    } else if (data.state === "paired") {
      toast("\u914D\u5BF9\u6210\u529F");
    }
  });
  client.on("toast", (data) => toast(data.message, data.tone));
  client.on("host", () => {
    if (ui.view === "settings") scheduleFullRender();
  });
  client.on("keepAwake", () => {
    if (ui.view === "settings") scheduleFullRender();
  });
  client.on("protocol-error", () => {
  });
  boot();
})();
