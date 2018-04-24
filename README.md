contrast-color-generator
========================

Javascript module for automatically generating well contrasted color with a color you specified.


## Description

This module generating well contrasted color which satisfy W3C guideline.
You can set minimum contrast ratio and source color as a parameter.

[Demo](https://kenyog.github.io/contrast-color-generator/docs/example/index.html)


## Install

You can install the module in your project.
```console
$ npm install contrast-color-generator
```

## Usage


### in Node.js

This is an example is generating contrast color whose 'hue' is 180°
```javascript
const { Generator } = require('contrast-color-generator');
let generator = new Generator(180);

let backgoundColor = '#800000';
let foregroundColor = generator.generate(inputColor).hexStr;
```

### in a browser

in the case of loading from browser, this module define global variable 'contrastColor'
This is an example is generating contrast color whose 'hue' is 180°.
```html
<script src="contrast-color-generator.js"></script>
<script>
  let gen = new contrastColor.Generator(180);
  
  let backgoundColor = '#800000';
  let foregroundColor = gen.generate(inputColor).hexStr;
</script>
```

## Principle

This module searches a color which has high contrast ratio against a input
color from HSL color space.
To calculate contrast ratios, it uses the definition of contrast ratio in [W3C Guideline](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef)

In searching, H(specified by parameter) and S(of input color) are fixed,
and it searches L which satisfies condition of contrast ratio using binary search.

By default, the first searching direction towards a brighter, And the second one towards darker.
these behavior can be changed by a parameter.


## Demo

This is the demo page of this module.

https://kenyog.github.io/contrast-color-generator/docs/example/index.html

## Contribution

Welcome.


## Licence

[MIT](https://github.com/kenyog/contrast-color-generator/blob/master/LICENSE)


## Author

[kenyog](https://github.com/kenyog)


