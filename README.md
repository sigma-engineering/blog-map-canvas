# Drawing 2,066,055 Points on the HTML5 Canvas

TODO IMAGE GOES HERE

There's tons of cool city data out there on the internet. It would be fun to get our hands on some and render it in interesting ways, but there's a number of challenges in our way.

# Finding the data

The internet is full of open data sources of varying quality. On [data.world](https://data.world/datasets/road), I was able to find [this nice dataset of Washington DC's roads](https://opendata.dc.gov/datasets/56907f9cbad545a8bf2cdcd96365f7a2_9), as polygons.

It's just what we want, but it's quite large, a 106mb XML file.

# Simplifying the KML format

To get this into the browser efficiently we're going to need to shrink it down.

## Original dataset:

**106.6mb** (106,583,660)

This is the original .kml format, with all kinds of XML tags we don't care about for our purposes.

## Gzip

**28mb** (28,734,827 gzip / 106,583,660 raw)

The first step is to use gzip, which immediately gives us 3.7x size reduction. A well configured webserver will send things gzipped anyways, so it's best to only compare the gzipped size going forward. 28mb will be our baseline.

```
TODO code snippet
```

## Removing everything but the polygons

**25.5mb** (25,476,466 gzip / 71,851,733 raw)

Surprisingly, after gzip, we almost gained nothing here, because the xml input was mostly coordinates wrapped by very repetitive XML tags that compress very efficiently.

```
TODO code snippet
```

## Int32Array:

**1.83mb** (1,834,058 gzip / 16,686,512 raw)

For our purposes, ~1m precision should be enough, which corresponds to ~5 decimal places of lat/lon (https://gis.stackexchange.com/a/8674). So we'll multiply by 10000 and round. Then we'll pack the points into an Int32Array with a compact format: We'll write out the number of coordinate pairs to expect in the current polygon, then the list of pairs, and repeat that for all polygons.

```
TODO code snippet
```

## Discarding duplicate points:

**1.50mb** (1,503,808 gzip / 5,657,704 raw)

Since we're rounding, we've created quite a few duplicate points. No reason to keep those, as they contribute nothing to the image. It's not a huge savings after gzip because its repetitive data, but it's definitely worth doing.

```
TODO code snippet
```

Overall, these steps give us a **~19x** reduction in gzipped size. (~70x if you want to take credit for gzip, which I won't)

# Drawing it to the screen

An obvious choice polygon data is SVG, but we have too much geometry for that. Rather than have a giant SVG on the DOM, I'd prefer to draw it to a canvas once. That will also allow us to do some other tricks in the future like batching the drawing process.

The drawing code itself isn't that fancy, and should be familiar to anyone who's drawn vectors with the canvas before.

```
TODO code snippet
```

In the above code, we:
- Bootstrap the page with a boilerplate React app. React itself is unnecessary but I chose to build this on `create-react-app` for convenience.
- Load the dataset as json
- Calculate the bounding box and fit it to the canvas using `transform` and `scale`
- Draw all the polygons (TODO batching)

TODO IMAGE GOES HERE

# Future optimizations

- Batch drawing calls across multiple frames: we could do the drawing in batches to avoid taking longer than a frame at a time.
- Use an even more clever binary format that takes advantage of the fact that most numbers are in a limited range. This image should happily fit within 16 integer bits of precision, since screens are 2-4k pixels wide, and 16 bits of integer precision is 65k.
