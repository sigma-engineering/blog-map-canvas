#!/usr/bin/env node

const fs = require("fs");
const { isEqual } = require("lodash");
const parseString = require("xml2js").parseString;

const xml = fs.readFileSync("./Roads_2015.kml");

parseString(xml, function (err, result) {
  const placemarks = result.kml.Document[0].Folder[0].Placemark;
  let paths = placemarks
    .map((p) => {
      try {
        return p.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates;
      } catch (e) {
        return null;
      }
    })
    .filter((p) => p !== null);

  const scale = 10000;
  const asIntPairs = paths.map((path) =>
    path
      .toString()
      .split(" ")
      .map((coord) =>
        coord.split(",").map((v) => Math.round(parseFloat(v) * scale))
      )
  );

  // strip duplicate points
  let strippedPointCount = 0;
  let totalPoints = 0;
  const deduped = asIntPairs.map((path) => {
    let lastPoint = null;
    return path.filter((p) => {
      totalPoints++;
      if (!isEqual(lastPoint, p)) {
        lastPoint = p;
        strippedPointCount++;
        return true;
      } else {
        return false;
      }
    });
  });

  console.log(
    `stripped ${strippedPointCount} of original ${totalPoints} total points`
  );

  // binary format is (LENGTH OF NEXT PATH IN NUMBER OF PAIRS, PAIRS...)*
  const packedDoubles = [];
  deduped.forEach((path) => {
    packedDoubles.push(path.length);
    path.forEach((pair) => {
      packedDoubles.push(pair[0], pair[1]);
    });
  });

  const asBinary = new Int32Array(packedDoubles);

  // fs.writeFileSync("./public/data.json", JSON.stringify(deduped));

  console.log(`binary size: ${asBinary.length * 4} bytes`);
  fs.writeFileSync("./public/data.bin", asBinary);
});
