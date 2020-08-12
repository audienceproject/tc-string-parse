# TCStringParse

Simple JavaScript parser for transparency and consent strings compatible with TCF 2.0.

## Installation

Parser is available as [NPM package](https://www.npmjs.com/package/tc-string-parse):

`npm install tc-string-parse`

## Usage

### NodeJS (>=5.10.0)

```js
const tcStringParse = require('tc-string-parse');

const consentString = ''; // your consent string
const consentModel = tcStringParse(consentString);
```

### Browser (IE 9+ with [atob polyfill](https://caniuse.com/#feat=atob-btoa))

```html
<script src="path/to/tc-string-parse.min.js"></script>

<script>
  var consentString = ''; // your consent string
  var consentModel = TCStringParse(consentString);
</script>
```

### Command line

```shell
tc-string-parse <your consent string>
```
