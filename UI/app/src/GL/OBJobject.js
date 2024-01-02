import Object3D from "../database/Object3D";

class OBJobject{
    constructor(){
        this.geometries = [];
        this.materialLibs = [];
        this.name = "";
        function hash(str) {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            hash = (((hash << 5) - hash) + str.charCodeAt(i)) & 0xFFFFFFFF;
          }
          return hash;
        };
        this.id = hash(this.constructor.name + Math.random());

    }
    loadOBJ(objPath){
      function loadTextFileAJAX(filePath){
          //读取本地文件，跨域
          var xmlhttp;
          if(window.XMLHttpRequest){
              xmlhttp = new XMLHttpRequest();
              }
          xmlhttp.open("GET",filePath,false);
          xmlhttp.send();
          return xmlhttp.responseText;

      }
      var objText = loadTextFileAJAX(objPath);

      // console.log(objText);
      var currentGeometry = new Object3D();
      var materialLibs = [];
      var name = "";
      const keywords = {
          v(parts,geometry) {
            // if there are more than 3 values here they are vertex colors
            if (parts.length > 3) {
              geometry.vertices.push(parts.slice(0, 3).map(parseFloat));
              geometry.colors.push(parts.slice(3).map(parseFloat));
            } else {
              geometry.vertices.push(parts.map(parseFloat));
            }
          },
          vn(parts,geometry) {
            geometry.normals.push(parts.map(parseFloat));
          },
          vt(parts,geometry) {
            geometry.uvs.push(parts.map(parseFloat));
          },
          f(parts,geometry) {
            const numTriangles = parts.length - 2;
            for (let tri = 0; tri < numTriangles; ++tri) {
              geometry.indices.push(...[0, tri + 1, tri + 2].map(i => {
                const indices = parts[i].split('/');
                // OBJ indices are 1-indexed so we subtract one below
                const position = indices[0] ? parseInt(indices[0]) - 1 : undefined;
                const uv = indices[1] ? parseInt(indices[1]) - 1 : undefined;
                const normal = indices[2] ? parseInt(indices[2]) - 1 : undefined;
                return {position, uv, normal};
              }));
            }
          },
          s: () => {},
          mtllib(parts,geometry, unparsedArgs) {
            // the spec says there can be multiple filenames here
            // but many exist with spaces in a single filename
            materialLibs.push(unparsedArgs);
          },
          usemtl(parts,geometry, unparsedArgs) {
            // geometry.materials.push(unparsedArgs);
          },
          g(parts,geometry) {

          },
          o(parts,geometry, unparsedArgs) {
            name = unparsedArgs;
          },
        };
      
      const keywordRE = /(\w*)(?: )*(.*)/;
      const lines = objText.split('\n');
      currentGeometry.indices = [];
      for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
        const line = lines[lineNo].trim();
        if (line === '' || line.startsWith('#')) {
          continue;
        }
        const m = keywordRE.exec(line);
        if (!m) {
          continue;
        }
        const [, keyword, unparsedArgs] = m;
        const parts = line.split(/\s+/).slice(1);
        const handler = keywords[keyword];
        if (!handler) {
          console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
          continue;
        }

        let new_geo = handler(parts, currentGeometry, unparsedArgs);
        if(new_geo){
            {
              // 处理索引
              if (currentGeometry.indices.length > 0) {
                let vertices = currentGeometry.vertices;
                let colors = currentGeometry.colors;
                let uvs = currentGeometry.uvs;
                let normals = currentGeometry.normals;
                let indices = currentGeometry.indices;
                currentGeometry.vertices = [];
                currentGeometry.colors = [];
                currentGeometry.uvs = [];
                currentGeometry.normals = [];
                currentGeometry.indices = [];
                for(let j = 0;j < indices.length;j++){
                    let index = indices[j];
                    if (index.position !== undefined) {
                        currentGeometry.vertices.push(...vertices[index.position]);
                        currentGeometry.colors.push(...colors[index.position]);
                    }
                    if (index.uv !== undefined) {
                        currentGeometry.uvs.push(...uvs[index.uv]);
                    }
                    if (index.normal !== undefined) {
                        currentGeometry.normals.push(...normals[index.normal]);
                    }
                }
              }
            }
            this.geometries.push(currentGeometry);
            currentGeometry = new Object3D();
            currentGeometry.indices = [];
        }
      }
      console.log(currentGeometry);
      if (currentGeometry.indices.length > 0) {
        let vertices = currentGeometry.vertices;
        let colors = currentGeometry.colors;
        let uvs = currentGeometry.uvs;
        let normals = currentGeometry.normals;
        let indices = currentGeometry.indices;
        currentGeometry.vertices = [];
        currentGeometry.colors = [];
        currentGeometry.uvs = [];
        currentGeometry.normals = [];
        for(let j = 0;j < indices.length;j++){
            let index = indices[j];
            if (index.position !== undefined) {
                currentGeometry.vertices.push(...vertices[index.position]);
                if (currentGeometry.colors.length > 0)
                currentGeometry.colors.push(...colors[index.position]);
            }
            if (index.uv !== undefined) {
                currentGeometry.uvs.push(...uvs[index.uv]);
            }
            if (index.normal !== undefined) {
                currentGeometry.normals.push(...normals[index.normal]);
            }
        }
      }
      if (currentGeometry.vertices.length > 0) {
        this.geometries.push(currentGeometry);
      }
      this.materialLibs = materialLibs;
      this.name = name;
      // 获取范围

      let minX = 0;
      let minY = 0;
      let minZ = 0;
      let maxX = 0;
      let maxY = 0;
      let maxZ = 0;

      for(let i=0;i<this.geometries.length;i++){
        for(let j=0;j<this.geometries[i].vertices.length;j+=3){
            let x = this.geometries[i].vertices[j];
            let y = this.geometries[i].vertices[j+1];
            let z = this.geometries[i].vertices[j+2];
            if(x < minX){
                minX = x;
            }
            if(x > maxX){
                maxX = x;
            }
            if(y < minY){
                minY = y;
            }
            if(y > maxY){
                maxY = y;
            }
            if(z < minZ){
                minZ = z;
            }
            if(z > maxZ){
                maxZ = z;
            }
        }
      }
      let centerX = (minX + maxX) / 2;
      let centerY = (minY + maxY) / 2;
      let centerZ = (minZ + maxZ) / 2;
      let width = maxX - minX;
      let height = maxY - minY;
      let depth = maxZ - minZ;
      let max = Math.max(width,height,depth);
      let scale = 1/max;
      for(let i=0;i<this.geometries.length;i++){

          this.geometries[i].glScale(scale,scale,scale);
          this.geometries[i].glTranslate(-centerX,-centerY,-centerZ);
          this.geometries[i].vertices = this.geometries[i].updateVertices();
      }
      for(let i=0;i<this.geometries.length;i++){
        if(this.geometries[i].colors.length <= 0){
          for(let j=0;j<this.geometries[i].vertices.length;j++){
            this.geometries[i].colors.push(0.5);
          }
        }
      }
      for(let i=0;i<this.geometries.length;i++){
        this.geometries[i].name = objPath.split("/")[objPath.split("/").length - 1].split(".")[0]+"_"+i;
        this.geometries[i].type = "OBJ";
        for(let j=1;j<this.geometries[i].uvs.length;j+=2){
          this.geometries[i].uvs[j] = 1 - this.geometries[i].uvs[j];
        }
      }
    }
    getGeometries(){
        return this.geometries;
    }
    getMaterials(){
        return this.materialLibs;
    }
    
}


export default OBJobject;