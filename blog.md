# drawing 10000000000 roads on the javascript canvas

OUTLINE

# finding the data

https://opendata.dc.gov/datasets/56907f9cbad545a8bf2cdcd96365f7a2_9

# simplifying the KML format

it's too big and full of stuff we don't care about

- raw 106,583,660
- just coords 71,851,733
- bson 8,697,864
- gzip 370,818

overall a 287x decrease in file size... not bad

# drawing it to the canvas

todo

# future optimizations

- batch drawing calls across multiple frames

- batching the parsing and drawing
- using bson format for data
