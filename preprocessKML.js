const fs = require("fs");
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

  const final = paths.map((path) =>
    path
      .toString()
      .split(" ")
      .map((coord) => coord.split(",").map(parseFloat))
  );

  fs.writeFileSync("./public/data.json", JSON.stringify(final));
});
