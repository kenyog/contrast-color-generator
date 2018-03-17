'use strict';

const THRESHOLD = 1.0/256;
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
const { Color } = require('../index');




test( async function rgb2hsl_pure_01(t) {

  let colorR = new Color({r:1.0, g:0.0, b:0.0});
  let colorG = new Color({r:0.0, g:1.0, b:0.0});
  let colorB = new Color({r:0.0, g:0.0, b:1.0});
  let colorY = new Color({r:1.0, g:1.0, b:0.0});
  let colorC = new Color({r:0.0, g:1.0, b:1.0});
  let colorM = new Color({r:1.0, g:0.0, b:1.0});

  t.nearlyEqual(colorR.hue, 0);
  t.nearlyEqual(colorY.hue, 60);
  t.nearlyEqual(colorG.hue, 120);
  t.nearlyEqual(colorC.hue, 180);
  t.nearlyEqual(colorB.hue, 240);
  t.nearlyEqual(colorM.hue, 300);
  [ colorR, colorG, colorB, colorY, colorC, colorM ]
    .forEach( c => {
      t.nearlyEqual(c.saturation, 1.0);
      t.nearlyEqual(c.lightness, 0.5);
    });
});

test( async function rgb2hsl_pure_02(t) {

  for (let i=1; i<=10; i++) {
    let colorY = new Color({r:i/10, g:i/10, b:0});

    t.is(colorY.hue, 60, `i=${i}`);
    t.nearlyEqual(colorY.saturation, 1.0, `i=${i}`);
    t.nearlyEqual(colorY.lightness, i/20, `i=${i}`);
  }
});

test( async function rgb2hsl_pure_03(t) {

  for (let i=1; i<=10; i++) {
    let colorB = new Color({r:0, g:0, b:i/10});

    t.is(colorB.hue, 240, `i=${i}`);
    t.nearlyEqual(colorB.saturation, 1.0, `i=${i}`);
    t.nearlyEqual(colorB.lightness, i/20, `i=${i}`);
  }
});

test( async function rgb2hsl_pure_04(t) {

  for (let i=0; i<10; i++) {
    let colorC = new Color({r:1, g:1, b:i/10});

    t.is(colorC.hue, 60, `i=${i}`);
    t.nearlyEqual(colorC.saturation, 1.0, `i=${i}`);
    t.nearlyEqual(colorC.lightness, i/20+0.5, `i=${i}`);
  }
});

test( async function rgb2hsl_pure_05(t) {

  for (let i=1; i<10; i++) {
    let colorG = new Color({r:i/10, g:1, b:i/10});

    t.is(colorG.hue, 120, `i=${i}`);
    t.nearlyEqual(colorG.saturation, 1.0, `i=${i}`);
    t.nearlyEqual(colorG.lightness, i/20+0.5, `i=${i}`);
  }
});

test( async function rgb2hsl_grey_01(t) {

  for (let i=0; i<=10; i++ ) {
    let grey = new Color({r:i/10, g:i/10, b:i/10});

    t.is(grey.hue, undefined, `i=${i}`);
    t.nearlyEqual(grey.saturation, 0.0, `i=${i}`);
    t.nearlyEqual(grey.lightness, i/10, `i=${i}`);
  }
  t.pass();

});


test( async function hsl2rgb_pure_01(t) {

  let color0 = new Color({h:0, s:1, l:0.5});
  let color60= new Color({h:60, s:1, l:0.5});
  let color120= new Color({h:120, s:1, l:0.5});
  let color180= new Color({h:180, s:1, l:0.5});
  let color240= new Color({h:240, s:1, l:0.5});
  let color300= new Color({h:300, s:1, l:0.5});

  t.is(color0.red,1);
  t.is(color0.green,0);
  t.is(color0.blue,0);

  t.is(color60.red, 1);
  t.is(color60.green, 1);
  t.is(color60.blue, 0);

  t.is(color120.red, 0);
  t.is(color120.green, 1);
  t.is(color120.blue, 0);

  t.is(color180.red, 0);
  t.is(color180.green, 1);
  t.is(color180.blue, 1);

  t.is(color240.red, 0);
  t.is(color240.green, 0);
  t.is(color240.blue, 1);

  t.is(color300.red, 1);
  t.is(color300.green, 0);
  t.is(color300.blue, 1);

});

test( async function hsl2rgb_pure_02(t) {

  const D = 36;
  for (let i=0; i<=D; i++ ) {
    let color = new Color({h:i/D, s:1, l:0.5});

    t.true(color.red===0||color.green===0||color.blue===0, `i=${i}`);
    t.true(color.red===1||color.green===1||color.blue===1, `i=${i}`);
  }

});

test( async function hsl2rgb_grey_01(t) {

  const D = 10;
  for (let i=0; i<=D; i++ ) {
    let grey = new Color({l:i/D});

    t.is(grey.hue, undefined);
    t.true(grey.saturation === 0);
    t.true(grey.lightness === i/D);
    t.true(grey.red=== i/D, `i=${i}`);
    t.true(grey.green=== i/D, `i=${i}`);
    t.true(grey.blue=== i/D, `i=${i}`);
  }

});


