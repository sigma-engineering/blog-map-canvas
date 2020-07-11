# Drawing 2,066,055 points on the javascript canvas

INTRO GOES HERE

# Finding the data

https://data.world/datasets/road
https://opendata.dc.gov/datasets/56907f9cbad545a8bf2cdcd96365f7a2_9

# Simplifying the KML format

TLDR; It's too big and full of stuff we don't care about.

Original dataset:
28,734,827 gzip (106,583,660 raw)
This is the original .kml format, with all kinds of XML tags we don't care about for our purposes.

Just the paths, please:
25,476,466 gzip (71,851,733 raw)
Suprisingly, post gzip, we almost gained nothing here, because the xml input was mostly coordinates wrapped by very repetitive XML tags that compress very efficiently.

Rounded lat-lon coordinates to 5 decimal places:
5,586,960 gzip (43,006,830 raw)
Now we're getting somewhere. We don't need double precision flats for our purposes here. To get ~1m precision we'll truncate to 5 decimal places. https://gis.stackexchange.com/a/8674

Discarding duplicate points:
5,382,769 gzip (34,709,454 raw)
Since we're rounding, we've created some duplicate points. we don't gain much after gzip, because the repeated values compress well, but it's low hanging fruit and it will reduce the amount of drawing work to be done.

Future work:
I tried using `msgpack` but wasn't able to get it to use single point precision, resulting in a larger file size than the truncated text: 8,963,047 (31,769,029 uncompressed), 60% larger. A custom binary format with the exact float precision we need would be ideal, but outside the scope of this project. Another problem is that [msgpack is 3x slower to deserialize than `JSON.parse`](https://github.com/msgpack/msgpack-node#performance).

Overall, a ~5.4x reduction in gzipped size. (~20x if you want to take credit for gzip)

# Drawing it to the canvas

TODO

# Future optimizations

- batch drawing calls across multiple frames
- batching the parsing and drawing
- using bson format for data
