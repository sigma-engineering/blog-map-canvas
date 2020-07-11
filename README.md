# Drawing 2,066,055 points on the javascript canvas

There's tons of cool city data out there on the internet. It would be fun to get our hands on some and render it, but there's a number of challenges in our way.

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

## Removing everything but the polygons

**25.5mb** (25,476,466 gzip / 71,851,733 raw)

Suprisingly, post gzip, we almost gained nothing here, because the xml input was mostly coordinates wrapped by very repetitive XML tags that compress very efficiently.

## Rounded to 5 decimal places:

**5.6mb** (5,586,960 gzip / 43,006,830 raw)

Now we're getting somewhere. We don't need double precision flats for our purposes here. To get ~1m precision we'll truncate to 5 decimal places. https://gis.stackexchange.com/a/8674

## Discarding duplicate points:

5.3mb (5,382,769 gzip / 34,709,454 raw)

Since we're rounding, we've created some duplicate points. we don't gain much after gzip, because the repeated values compress well, but it's low hanging fruit and it will reduce the amount of drawing work to be done.

## Future work:

I tried using `msgpack` but wasn't able to get it to use single point precision, resulting in a larger file size than the truncated text: 8,963,047 (31,769,029 uncompressed), 60% larger. A custom binary format with the exact float precision we need would be ideal, but outside the scope of this project. Another problem is that [msgpack is 3x slower to deserialize than `JSON.parse`](https://github.com/msgpack/msgpack-node#performance).

Overall, a ~5.4x reduction in gzipped size. (~20x if you want to take credit for gzip)

# Drawing it to the canvas

TODO

# Future optimizations

- batch drawing calls across multiple frames
- batching the parsing and drawing
- using bson format for data
