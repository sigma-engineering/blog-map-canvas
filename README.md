# drawing 10000000000 roads on the javascript canvas

OUTLINE

# finding the data

https://opendata.dc.gov/datasets/56907f9cbad545a8bf2cdcd96365f7a2_9

# simplifying the KML format

it's too big and full of stuff we don't care about

raw
28,734,827 (106,583,660)

just coords
25,476,466 (71,851,733)
suprisingly, post gzip, we almost gained nothing here, because the xml input was mostly coordinates wrapped by very repetitive xml tags that compress very efficiently.

rounded coords to 5 decimal places
5,586,960 (43,006,830)
now we're getting somewhere. we don't need double precision flats for our purposes here. to get ~1m precision we'll just truncate to 5 decimal places. https://gis.stackexchange.com/a/8674

discarding duplicate points
5,382,769 (34,709,454)
since we've rounded, we've created some duplicate points. we don't gain much after gzip, because the repeated values compress well, but it's low hanging fruit and it will reduce the amount of drawing work to be done.

I tried using `msgpack` but wasn't able to get it to use single point precision, resulting in a larger file size than the truncated text: 8,963,047 (31,769,029 uncompressed), 60% larger. A custom binary format with the exact float precision we need would be ideal, but outside the scope of this project. Another problem is that [msgpack is 3x slower to deserialize than `JSON.parse`](https://github.com/msgpack/msgpack-node#performance).

overall, a ~5x reduction in gzipped size... not bad. (~20x if you want to take credit for gzip)

# drawing it to the canvas

todo

# future optimizations

- batch drawing calls across multiple frames

- batching the parsing and drawing
- using bson format for data
