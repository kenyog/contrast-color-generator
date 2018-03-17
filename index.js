
// Nodes.js modules.
const assert = require('assert');



function string2srgb(str) {
}


class Color {
  constructor(obj) {
    this.hsl = null;
    this.srgb = null;
    if (typeof obj === 'string') {
    } else if (obj instanceof Color) {
      this.hsl = obj.hsl;
      this.srgb = obj.srgb;
    } else if (typeof obj === 'object') {
      if (obj.hasOwnProperty('l')) {
        this.hsl = { 
          h: obj.h,
          s: obj.s || 0,
          l: obj.l,
        };
      } else if (obj.hasOwnProperty('R')) {
        assert(obj.hasOwnProperty('G')&&obj.hasOwnProperty('B'));
        this.srgb = { r: obj.R/255, g: obj.G/255, b: obj.B/255, };
      } else if (obj.hasOwnProperty('r')) {
        assert(obj.hasOwnProperty('g')&&obj.hasOwnProperty('b'));
        this.srgb = { r: obj.r, g: obj.g, b: obj.b, };
      } else {
        this.srgb = { r: 1.0, g: 1.0, b: 1.0, };
      }
    }
  }

  ensureSrgb() {
    if (!this.srgb) {
      this.srgb = Color.hsl2srgb(this.hsl);
    }
  }
  ensureHsl() {
    if (!this.hsl) {
      this.hsl = Color.srgb2hsl(this.srgb);
    }
  }
  checkComponentRange(c, lower, upper) {
    if (c < lower || upper < c) {
      throw new Exception('srgb component must be in range 0.0~1.0.');
    }
  }

  get red() {
    this.ensureSrgb();
    return this.srgb.r;
  }
  get green() {
    this.ensureSrgb();
    return this.srgb.g;
  }
  get blue() {
    this.ensureSrgb();
    return this.srgb.b;
  }

  set red(r) {
    this.checkComponentRange(r, 0.0, 1.0);
    this.ensureSrgb();
    this.srgb.r = r;
    this.hue = null;
  }
  set green(g) {
    this.checkComponentRange(g, 0.0, 1.0);
    this.ensureSrgb();
    this.srgb.g = g;
    this.hue = null;
  }
  set blue(b) {
    this.checkComponentRange(b, 0.0, 1.0);
    this.ensureSrgb();
    this.srgb.b = b;
    this.hue = null;
  }

  get hue() {
    this.ensureHsl();
    return this.hsl.h;
  }
  get saturation() {
    this.ensureHsl();
    return this.hsl.s;
  }
  get lightness() {
    this.ensureHsl();
    return this.hsl.l;
  }

  set hue(h) {
    this.checkComponentRange(h, 0, 360);
    this.ensureHsl();
    this.hsl.h = h;
    this.srgb = null;
  }
  set saturation(s) {
    this.checkComponentRange(s, 0.0, 1.0);
    this.ensureHsl();
    this.hsl.s = s;
    this.srgb = null;
  }
  set lightness(l) {
    this.checkComponentRange(l, 0.0, 1.0);
    this.ensureHsl();
    this.hsl.l = l;
    this.srgb = null;
  }

  get luminance() {
    this.ensureSrgb();
    // The definition of contrast ratio is from
    //   https://www.w3.org/TR/WCAG21/  
    //   'relative luminance'
    let R = Color.getLuminanceComponent(this.srgb.r);
    let G = Color.getLuminanceComponent(this.srgb.g);
    let B = Color.getLuminanceComponent(this.srgb.b);
    return (0.2126*R)+(0.7152*G)+(0.0722*B);
  }

  contrastRatio(target) {
    if (target instanceof Color) {
      return Color.contrastRatio(this.luminance, target.luminance);
    } else if (typeof target === 'number') {
      return Color.contrastRatio(this.luminance, target);
    } else {
      return Color.contrastRatio(this.luminance, (new Color(target)).luminance);
    }
  }

  static getLuminanceComponent(c) {
    // The definition of contrast ratio is from
    //   https://www.w3.org/TR/WCAG21/  
    //   'relative luminance'
    if (c <= 0.03928) {
      return c/12.92;
    } else {
      return ((c+0.055)/1.055)**2.4;
    }
  }

  static contrastRatio(l1, l2) {
    // The definition of contrast ratio is from
    //   https://www.w3.org/TR/WCAG21/  
    //   'contrast ratio'
    return (l1+0.05) / (l2+0.05)
  }

  static limit(c, lower, upper) {
    // 'c' may be a 'undefined'.
    if (c < lower) return lower;
    else if (upper < c) return upper;
    else return c;
  }

  static srgb2hsl(srgb) {
    // Refer to the convertiong method of site below.
    //   https://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma
    let R = srgb.r;
    let G = srgb.g;
    let B = srgb.b;
    let max = Math.max(R, G, B);
    let min = Math.min(R, G, B);
    
    let chroma = max - min;
    let lightness = (max+min)/2;

    let hue = undefined;
    if (chroma!==0) {
      let _hue;
      if (max===R) {
        _hue = (G - B)/chroma;
        if (_hue < 0) _hue += 6.0;
      } else if (max===G) {
        _hue = ((B - R)/chroma) + 2.0;
      } else {
        _hue = ((R - G)/chroma) + 4.0;
      }
      hue = _hue * 60;
    }

    let saturation = (lightness===1 || lightness===0)
      ? 0
      : chroma/(1-Math.abs(2*lightness-1));

    return {
      h: Color.limit(hue, 0, 360),
      s: Color.limit(saturation, 0, 1),
      l: Color.limit(lightness, 0, 1),
    };
  }

  static hsl2srgb(hsl) {
    // Refer to the convertiong method of site below.
    //   https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL
    let H = hsl.h;
    let S = hsl.s;
    let L = hsl.l;

    let chroma;

    let r1,g1,b1;
    if (H===undefined) {
      chroma = 0;
      [r1,g1,b1] = [0,0,0];
    } else {
      chroma = (1-Math.abs(2*L-1)) * S;
      let _hue = H/60;
      let X = chroma * (1-Math.abs(_hue%2-1));
      if (_hue < 1) {
        [r1,g1,b1] = [chroma,X,0];
      } else if (_hue < 2) {
        [r1,g1,b1] = [X,chroma,0];
      } else if (_hue < 3) {
        [r1,g1,b1] = [0,chroma,X];
      } else if (_hue < 4) {
        [r1,g1,b1] = [0,X,chroma];
      } else if (_hue < 5) {
        [r1,g1,b1] = [X,0,chroma];
      } else {
        [r1,g1,b1] = [chroma,0,X];
      }
    }

    let min = L - chroma/2;
    return {
      r: Color.limit(r1+min, 0, 1),
      g: Color.limit(g1+min, 0, 1),
      b: Color.limit(b1+min, 0, 1),
    };
  }

}


class ContrastColorGenerator {
  constructor(targetHue) {
    this.targetHue = targetHue;
    this.searchToBrighterFirst = true;
    this.minRatio = 4.5;
  }

  generate(_baseColor) {
    if (_baseColor instanceof Color) {
      var baseColor = _baseColor;
    } else {
      var baseColor = new Color(baseColor);
    }
    let luminance = baseColor.luminance;

    if ( Color.contrastRatio(1.0, luminance) > this.minRatio ) {
      // Brighter color searching.

      let initialTarget = new Color(baseColor);
      initialTarget.hue = this.targetHue;

      var target = searchBrighterColor(luminance, initialTarget, this.minRatio);

    } else if ( Color.contrastRatio(luminance, 0.0) > this.minRatio ) {
      // Darker color searching.

      let initialTarget = new Color(baseColor);
      initialTarget.hue = this.targetHue;

      var target = searchDarkerColor(luminance, initialTarget, this.minRatio);

    } else {
      throw new Exception('No color exist which satisfies a requirement.');
    }

    return target;
  }
}


function binarySearch_recursive(func, lower, upper, requirement) {
  assert(!requirement(func(lower)));
  assert(requirement(func(upper)));
  if (threshold(lower,upper)) return upper;

  let middle = (lower + upper)/2;
  if (requirement(func(middle))) {
    return binarySearch_recursive(func, lower, middle, requirement);
  } else {
    return binarySearch_recursive(func, middle, upper, requirement);
  }
}

function binarySearch(lower, upper, requirement, threshold) {
  assert(!requirement(lower));
  assert(requirement(upper));

  while (!threshold(lower,upper)) {
    let middle = (lower + upper)/2;
    if (requirement(middle)) {
      upper = middle;
    } else {
      lower = middle;
    }
  }

  return upper;
}


function searchBrighterColor(baseLuminance, initialTarget, targetRatio) {
  let target = initialTarget;

  function satisfyTargetRatio(l) {
    target.lightness = l;
    let luminance = target.luminance;
    return Color.contrastRatio(target.luminance, baseLuminance) > targetRatio;
  }

  let lightness = binarySearch(0.0, 1.0,
    satisfyTargetRatio,
    (l, u) => u-l < 1.0/512 );

  target.lightness = lightness;
  return target;
}

function searchDarkerColor(baseLuminance, initialTarget, targetRatio) {
  let target = initialTarget;

  function satisfyTargetRatio(l) {
    target.lightness = l;
    let luminance = target.luminance;
    return Color.contrastRatio(baseLuminance, target.luminance) > targetRatio;
  }

  let lightness = binarySearch(1.0, 0.0,
    satisfyTargetRatio,
    (l, u) => l-u < 1.0/512);

  target.lightness = lightness;
  return target;
}


module.exports = {
  ContrastColorGenerator: ContrastColorGenerator,
  Color: Color,
};

