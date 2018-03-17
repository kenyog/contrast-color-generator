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




test( async function luminance_01(t) {

  let white = new Color({r:1, g:1, b:1});
  let black = new Color({r:0, g:0, b:0});

  t.nearlyEqual(white.luminance, 1.0);
  t.nearlyEqual(black.luminance, 0.0);
});

test( async function luminance_02(t) {

  let grey1 = new Color({r:0.03928, g:0.03928, b:0.03928});
  let grey2 = new Color({r:0.03928/2, g:0.03928/2, b:0.03928/2});

  t.nearlyEqual(grey1.luminance, 0.03928/12.92);
  t.nearlyEqual(grey2.luminance, 0.03928/12.92/2);
});

test( async function luminance_03(t) {
  let D=32;
  for (let i=0; i<D; i++) {
    let v = 0.03928 + (1-0.03928)*i/D;
    let grey1 = new Color({r:v, g:v, b:v});

    t.nearlyEqual(grey1.luminance, ((v+0.055)/1.055)**2.4 );
  }
});

test( async function luminance_04(t) {
  let D=32;
  for (let i=0; i<D; i++) {
    let v = 0.03928 + (1-0.03928)*i/D;
    let grey1 = new Color({r:v, g:0, b:0});

    t.nearlyEqual(grey1.luminance, 0.2126*(((v+0.055)/1.055)**2.4) );
  }
});

test( async function luminance_05(t) {
  let D=32;
  for (let i=0; i<D; i++) {
    let v = 0.03928 + (1-0.03928)*i/D;
    let grey1 = new Color({r:0, g:v, b:0});

    t.nearlyEqual(grey1.luminance, 0.7152*(((v+0.055)/1.055)**2.4) );
  }
});

test( async function luminance_06(t) {
  let D=32;
  for (let i=0; i<D; i++) {
    let v = 0.03928 + (1-0.03928)*i/D;
    let grey1 = new Color({r:0, g:0, b:v});

    t.nearlyEqual(grey1.luminance, 0.0722*(((v+0.055)/1.055)**2.4) );
  }
});

