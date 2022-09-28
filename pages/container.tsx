import { THREE } from "../utils/three";

var getContentFromMyOBJ = function (fileName, callback) {
  var myObjs = _.filter(ctx().scene.files.assets(), function (file) {
    return file.getName() === fileName && file.getFileType() === ".myobj";
  });
  myObjs[0].fetchContent(callback);
};

var continueImport = function (err, content) {
  // Split lines on newline or backslash
  var lines = content.split(/[\n\\]/);

  // Create empty containers
  var verts = [];
  var faces = [];
  var uvs = [];
  var uvIndices = [];
  var normals = [];
  var normalIndices = [];

  // Parse each line
  _.each(lines, function (line) {
    line = line.trim();
    // Split on whitespace
    var lineArr = line.split(/\s+/g);

    // Parse vertex positions
    if (lineArr[0] === "v") {
      verts.push(
        new THREE.Vector3(
          parseFloat(lineArr[1]),
          parseFloat(lineArr[2]),
          parseFloat(lineArr[3])
        )
      );
    }

    // Parse UVs
    else if (lineArr[0] === "vt") {
      uvs.push(
        new THREE.Vector2(parseFloat(lineArr[1]), parseFloat(lineArr[2]))
      );
    }

    // Parse normals
    else if (lineArr[0] === "vn") {
      normals.push(
        new THREE.Vector3(
          parseFloat(lineArr[1]),
          parseFloat(lineArr[2]),
          parseFloat(lineArr[3])
        )
      );
    }

    // Parse faces
    else if (lineArr[0] === "f") {
      var face = [];
      var uvIndex = [];
      var normalIndex = [];
      // Parse each attribute set
      _.each(_.rest(lineArr), function (point) {
        var pointAttrs = point.split("/");

        // Attributes (off-by-one adjustment)
        // Position indices
        face.push(parseInt(pointAttrs[0]) - 1);

        // UV indices
        if (pointAttrs.length >= 2 && pointAttrs[1] !== "") {
          uvIndex.push(parseInt(pointAttrs[1]) - 1);
        }

        // Normal indices
        if (pointAttrs.length >= 3 && pointAttrs[2] !== "") {
          normalIndex.push(parseInt(pointAttrs[2]) - 1);
        }
      });
      // Add face to collection
      faces.push(face);

      // Add UVs and normals to collection, if they exist
      if (uvIndex.length > 0) {
        uvIndices.push(uvIndex);
      }
      if (normalIndex.length > 0) {
        normalIndices.push(normalIndex);
      }
    }
  });

  // Create polyMesh object
  var polyMesh = new exo.geometry.PolyMesh(faces, verts);

  // If there are UVs or normals, create a map to store them and apply to the polyMesh object
  if (uvs.length > 0 && uvIndices.length > 0) {
    polyMesh.setUVMap(new exo.geometry.PolyMap(uvIndices, uvs));
  }
  if (normals.length > 0 && normalIndices.length > 0) {
    polyMesh.setNormalMap(new exo.geometry.PolyMap(normalIndices, normals));
  }

  ctx()
    .addFile({
      name: "MyMesh.json",
      content: polyMesh,
      type: "application/json",
      sourceType: "import",
      internal: false,
    })
    .then(function (myMesh) {
      ctx("%Objects").addNode("MyMesh", "PolyMesh", {
        PolyMesh: { Mesh: { geometry: myMesh } },
      });
    });
};

getContentFromMyOBJ("Sphere", continueImport);
function ctx() {
  throw new Error("Function not implemented.");
}

