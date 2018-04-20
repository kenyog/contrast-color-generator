contrast-color-generator
========================

Javascript module for automatically generating well contrasted color with a color you specified.


## Description

This module generating well contrasted color which satisfy W3C guideline.
You can set minimum contrast ratio and source color as a parameter.


## Install

You can install the module in your project.
```console
$ npm install contrast-color-generator
```

## Usage


### in Node.js

This is an example is generating contrast color whose 'hue' is 180°.
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

## Contribution

Welcome.


## Licence

[MIT](https://github.com/kenyog/contrast-color-generator/blob/master/LICENSE)


## Author

[kenyog](https://github.com/kenyog)


