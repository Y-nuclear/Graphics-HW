//读取OBJ文件并解析
class OBJLoader 
{
    constructor() {    
        this.vertices = [];
        this.vertexNormals = [];
        this.faces = [];
        this.faceNormals = [];
        this.uvs = [];
        this.materials = {};
        this.meshes = [];
        this.meshesByName = {};
        this.meshNames = [];
        this.meshesByMaterial = {};
        this.meshMaterials = [];
        this.meshesByGroup = {};
        this.meshGroups = [];
        this.object = null;
        this.objects = [];
        this.objectNames = [];
        this.objectsByMaterial = {};
        this.objectMaterials = [];
        this.objectsByGroup = {};
        this.objectGroups = [];
        this.materialLibraries = [];
        this.materialsByName = {};
        this.materialNames = [];
        this.materialsByMesh = {};
        this.materialMeshes = [];
        this.materialsByObject = {};
        this.materialObjects = [];
        this.materialsByGroup = {};
        this.materialGroups = [];
        this.groupNames = [];
        this.groupMeshes = [];
        this.groupObjects = [];
        this.groupMaterials = [];
        this.groupVertices = [];
        this.groupNormals = [];
        this.groupUVs = [];
        this.groupCount = 0;
        this.doubleSidedCount = 0;
        this.doubleSidedMaterials = {};
        this.doubleSidedMeshes = {};
        this.doubleSidedObjects = {};
        this.doubleSidedGroups = {};
        this.doubleSidedVertices = {};
        this.doubleSidedNormals = {};
        this.doubleSidedUVs = {};
        this.doubleSided = false;
        this.doubleWarning = false;
        this.doubleMaterials = [];
        this.doubleMeshes = [];
        this.doubleObjects = [];
        this.doubleGroups = [];
        this.doubleVertices = [];
        this.doubleNormals = [];
        this.doubleUVs = [];
        this.doubleCount = 0;
        this.doubleMaterialsCount = 0;
        this.doubleMeshesCount = 0;
        this.doubleObjectsCount = 0;
        this.doubleGroupsCount = 0;
        this.doubleVerticesCount = 0;
        this.doubleNormalsCount = 0;
        this.doubleUVsCount = 0;
        this.doubleWarned = false;
        this.doubleMaterialWarned = false;
        this.doubleMeshWarned = false;
        this.doubleObjectWarned = false;
        this.doubleGroupWarned = false;
        this.doubleVertexWarned = false;
        this.doubleNormalWarned = false;

        this.verticesCount = 0;
        this.vertexNormalsCount = 0;
        this.facesCount = 0;
    }

    parseVertexIndex(value, len) {
        var index = parseInt(value, 10);
        return (index >= 0 ? index - 1 : index + len / 3) * 3;
    }

    read(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsText(file);
    }

    parseVertex(value) {
        value = value.split(' ')
        for (var i = 0, len = value.length; i < len; i++) {
            this.vertices.push(parseFloat(value[i]));
        }
    }

    parseVertexNormal(value) {
        this.vertexNormals.push(parseFloat(value));
    }

    parseUV(value) {
        this.uvs.push(parseFloat(value));
    }
    parseFace(value) {
        var parts = value.split(' ');
        var len = parts.length;
        var face = [];
        var uv = [];
        var normal = [];
        for (var i = 0; i < len; i++) {
            var part = parts[i];
            if (part) {
                var indices = part.split('/');
                if (indices.length > 0) {
                    face.push(this.parseVertexIndex(indices[0], this.vertices.length));
                }
                if (indices.length > 1) {
                    if (indices[1] !== '') {
                        uv.push(this.parseUVIndex(indices[1], this.uvs.length));
                    }
                }
                if (indices.length > 2) {
                    normal.push(this.parseNormalIndex(indices[2], this.vertexNormals.length));
                }
            }
        }
        var numTriangles = face.length - 2;
        for (var i = 0; i < numTriangles; i++) {
            this.faces.push(face[0], face[i + 1], face[i + 2]);
            if (uv.length > 0) {
                this.faceUVs.push(uv[0], uv[i + 1], uv[i + 2]);
            }
            if (normal.length > 0) {
                this.faceNormals.push(normal[0], normal[i + 1], normal[i + 2]);
            }
        }
    }
    parseFaceIndex(value, len) {
        var index = parseInt(value, 10);
        return (index >= 0 ? index - 1 : index + len / 2) * 2;
    }

    parse_data(data) {
        var lines = data.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].split(' ');
            var firstWord = line.shift();
            if (firstWord === 'v') {
                this.parseVertex(line.join(' '));
            } else if (firstWord === 'vn') {
                this.parseVertexNormal(line.join(' '));
            } else if (firstWord === 'vt') {
                this.parseUV(line.join(' '));
            } else if (firstWord === 'f') {
                this.parseFace(line.join(' '));
            } else if (firstWord === 'mtllib') {
                this.materialLibraries.push(line.join(' '));
            } else if (firstWord === 'usemtl') {
                this.meshMaterials.push(line.join(' '));
            } else if (firstWord === 'o') {
                this.objectNames.push(line.join(' '));
            } else if (firstWord === 'g') {
                this.groupNames.push(line.join(' '));
            } else if (firstWord === 's') {
                var name = line.join(' ');
                this.doubleSidedCount++;
                this.doubleSidedMaterials[name] = true;
                this.doubleSidedMeshes[name] = true;
                this.doubleSidedObjects[name] = true;
                this.doubleSidedGroups[name] = true;
                this.doubleSidedVertices[name] = true;
                this.doubleSidedNormals[name] = true;
                this.doubleSidedUVs[name] = true;
                this.doubleSided = true;
            }
        }
    }
}
// LoaderList = [];
// //从uploadFile中读取文件
// function uploadFile(){
//     let file = document.getElementById('file').files[0];
//     let objLoader = new OBJLoader();
//     objLoader.read(file,function(data){
//         objLoader.parse_data(data);
//         console.log(objLoader.vertices);
//         console.log(objLoader.vertexNormals);
//         console.log(objLoader.uvs);
//     });
//     LoaderList.push(objLoader);
// }
