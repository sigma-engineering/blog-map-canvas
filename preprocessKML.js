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

  const rounded = paths.map((path) =>
    path
      .toString()
      .split(" ")
      .map((coord) =>
        coord.split(",").map((v) => parseFloat(parseFloat(v).toFixed(5)))
      )
  );

  // strip duplicate points
  let strippedPointCount = 0;
  let totalPoints = 0;
  const deduped = rounded.map((path) => {
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

  console.log(`stripped ${strippedPointCount} of original ${totalPoints} total points`);

  fs.writeFileSync("./public/data.json", JSON.stringify(deduped));
});
