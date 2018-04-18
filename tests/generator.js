'use strict';

const THRESHOLD = 1.0/128;
{
  const avaAssert = require('ava/lib/assert');
  let original = avaAssert.wrapAssertions;
  avaAssert.wrapAssertions = function(callbacks) {
    const pass = callbacks.pass;
    const fail = callbacks.fail;
    let as = original.call(this, callbacks);
    as.nearlyEqual = function nearlyEqual(a, b, message) {
      if (Math.abs(a-b) < THRESHOLD) {
        pass(this);
      } else {
        let msg = `arg1: ${a}, arg2: ${b}`;
        if (message) msg +=`, message:${message}`;
        let e = new Error(msg);
        Error.captureStackTrace(e, nearlyEqual);
        fail(this, e);
      }
    };
    return as;
  };
}

const test = require('ava');
const { Generator, Color } = require('../index');



test( async function gen_test_01(t) {
  
  let generator = new Generator(90);

  let base = new Color({r:0.5, g:0.0, b:0.0});
  let ccolor = generator.generate(base);
  let cratio = ccolor.contrastRatio(base);

  t.nearlyEqual(ccolor.hue, 90);
  t.nearlyEqual(ccolor.saturation, base.saturation);
  t.true(ccolor.luminance > base.luminance);
  t.nearlyEqual(cratio, 4.5);
  
});

test( async function gen_test_02(t) {
  
  let generator = new Generator(270);

  let base = new Color({r:0.0, g:0.2, b:0.5});
  let ccolor = generator.generate(base);
  let cratio = ccolor.contrastRatio(base);

  t.nearlyEqual(ccolor.hue, 270);
  t.nearlyEqual(ccolor.saturation, base.saturation);
  t.true(ccolor.luminance > base.luminance);
  t.nearlyEqual(cratio, 4.5);
  
});

test( async function gen_test_03(t) {
  
  let generator = new Generator(270);

  let base = new Color({r:0.3, g:0.5, b:0.5});
  let ccolor = generator.generate(base);
  let cratio = base.contrastRatio(ccolor);
  t.true(base.luminance > 0.18333);

  t.nearlyEqual(ccolor.hue, 270);
  t.nearlyEqual(ccolor.saturation, base.saturation);
  t.true(ccolor.luminance < base.luminance);
  t.nearlyEqual(cratio, 4.5);
  
});


// (L1+0.05)/(L2+0.05) > 4.5

// (1.05)/(L2+0.05) > 4.5
// 1.05 > 4.5(L2+0.05) = 4.5*L2 + 0.225
// 1.05 - 0.225 > 4.5*L2
// 0.18333 > L2

// (L1+0.05)/(0.05) > 4.5
// L1+0.05 > 4.5 * 0.05 = 0.225
// L1 > 0.225 - 0.05
// L1 > 0.175

