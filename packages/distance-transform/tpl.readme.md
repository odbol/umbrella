# ${pkg.banner}

[![npm version](https://img.shields.io/npm/v/${pkg.name}.svg)](https://www.npmjs.com/package/${pkg.name})
![npm downloads](https://img.shields.io/npm/dm/${pkg.name}.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

<!-- TOC -->

## About

${pkg.description}

![example distance field comparison for three different
metrics](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/distance-transform/dt.png)

This package provides a function to transform a binary(-like) input grid/image
into a distance field using a provided distance metric (default: Eucledian). Any
non-zero values in the input grid are used as seed locations for the distance
field. The function returns a plain `Float32Array` of distance values. If
`normalize` is > 0 (default: 1). The result values will be normalized to the
`[0,normalize]` interval.

Based on: ["A general algorithm for computing Distance Transforms in linear
time"](http://www.cs.rug.nl/~roe/publications/dt.pdf), A. Meijster, J.B.T.M.
Roerdink and W.H. Hesselink

${status}

${supportPackages}

${relatedPackages}

${blogPosts}

## Installation

${pkg.install}

${pkg.size}

## Dependencies

${pkg.deps}

${examples}

## API

${docLink}

This small example uses functionality from the
[@thi.ng/pixel](https://github.com/thi-ng/umbrella/tree/develop/packages/pixel)
and
[@thi.ng/random](https://github.com/thi-ng/umbrella/tree/develop/packages/random)
packages...

```ts
import { distanceTransform } from "@thi.ng/distance-transform";
import { floatBuffer, intBuffer, canvas2d, GRAY8, FLOAT_GRAY } from "@thi.ng/pixel";
import { SYSTEM } from "@thi.ng/random";

// create image with 100 random pixels set
const img = intBuffer(256, 256, GRAY8);
for(let i = 0; i < 100; i++) {
  img.setAt(SYSTEM.int() % img.width, SYSTEM.int() % img.height, 255);
}

// compute distance field (aka voronoi)
const dt = distanceTransform(img, EUCLEDIAN);

// wrap as float pixel buffer
const dtImg = floatBuffer(img.width, img.height, FLOAT_GRAY, dt);

// ...and display (browser only)
const { canvas } = canvas2d(img.width, img.height, document.body);
dtImg.blitCanvas(canvas);
```

## Authors

${authors}

${pkg.cite}

## License

&copy; ${copyright} // ${license}
