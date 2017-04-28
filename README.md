# poly-rating

**A polygon based user rating component built using React**

Demo: [https://ajaymore.github.io/poly-rating](https://ajaymore.github.io/poly-rating)

## Installation

Install `poly-rating` with [npm](https://www.npmjs.com/):

```
$ npm install poly-rating --save
```

For [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) users:

```javascript
import { SinglePolygon, SummaryPolygon } from 'poly-rating';
```
Please use context_blender.js from [https://github.com/Phrogz/context-blender](https://raw.githubusercontent.com/Phrogz/context-blender/master/context_blender.js) for SummaryPolygon to work.

Include the file in <head> section of the index.html like

```
<script src="./context_blender.js"></script>
```

## Usage:

```
const ratingArray = [{ name: 'AB', rating: 2 }, { name: 'CD', rating: 2 }, { name: 'EF', rating: 3 },
    { name: 'GH', rating: 4 }, { name: 'HI', rating: 5 }];
const polygonStyles = {
    polygonSides: 5,
    width: 500
}


<SinglePolygon
    ratingArray={ratingArray} // required
    polygonStyles={polygonStyles} // required
    canvasId="single-polygon" // required
    colorOverlay="#2ECC71" // optional
    colorStroke="#E8E5DF" // optional
    ratingLimit={5} // Rating Scale - optional
/>


<SummaryPolygon
    polygonStyles={polygonStyles} //required
    ratingDimensions={['AB', 'CD', 'EF', 'GH', 'HI']} // required
    canvasId="single-polygon" // required
    colorOverlay="#2ECC71" // optional
    colorStroke="#E8E5DF" // optional
    ratingLimit={5} // Rating Scale - optional
/>
```