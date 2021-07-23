class Mesh {
    constructor() {
        this.materialLibs = [];
        this.texCoords = [];
        this.normales = [];
        this.points = [];
        this.triangles = [];
    }
    getV(id) {
        for (let x of this.points) {
            if (x.id == id) return x;
        }
        throw new Error("v " + id + " net gefunden :(");
    }
    getF(id) {
        for (let x of this.triangles) {
            if (x.id == id) return x;
        }
        throw new Error("f " + id + " net gefunden :(");
    }
    getVN(id) {
        for (let x of this.normales) {
            if (x.id == id) return x;
        }
        MeshNormale.DEFAULT;
    }
    getVT(id) {
        for (let x of this.texCoords) {
            if (x.id == id) return x;
        }
        MeshTextureCoord.DEFAULT;
    }
    buidLalalalalaArray() {
        return this.buildArray(Mesh.PUSH_X_Y_Z_R_G_B);
    }
    buildArray(pushTriangleFunction) {
        let arr = [];
        for (let t of this.triangles) {
            pushTriangleFunction(this, arr, t);
        }
        return new Float32Array(arr);
    }
    static loadObj(objStr) {
        let ret = new Mesh();
        let lines = objStr.split("\n");
        let pId = 1;
        let fId = 1;
        let tId = 1;
        let currentMat = undefined;
        let currentGroup = undefined;
        let currentS = 0;
        for (let l of lines) {
            if (l == "" || l.startsWith("#")) continue;
            let wds = l.split(" ");
            switch (wds[0]) {
                case "mtllib":
                    ret.materialLibs.push(wds[1]);
                    break;
                case "v":
                    ret.points.push(new MeshPoint(pId++,wds[1]*1,wds[2]*1,wds[3]*1, Math.random()/3,Math.random()/3,Math.random()/3));
                    break;
                case "vt":
                    ret.texCoords.push(new MeshTextureCoord(tId++, wds[1]*1, wds[2]*1));
                    break;
                case "vn":
                    ret.normales.push(new MeshNormale(tId++, wds[1]*1, wds[2]*1, wds[3]*1));
                    break;
                case "g":
                    currentGroup = wds[1];
                    break;
                case "s":
                    currentS = wds[1] == "off" ? 0 : wds[1]*1;
                    break;
                case "f":
                    ret.triangles.push(Mesh._parseTriangle(wds,fId++,currentMat,currentGroup));
                    break;
                case "default":
 //                   console.log("ignored: " + l);
            }
        }
        return ret;
    }
    static _parseTriangle(wds,fId,currentMat,currentGroup) {
        let p1d = Mesh._parseTriangleVtx(wds[1].split("/"));
        let p2d = Mesh._parseTriangleVtx(wds[2].split("/"));
        let p3d = Mesh._parseTriangleVtx(wds[3].split("/"));
        
        return new MeshTriangle(fId++,  
                p1d.vertex,p2d.vertex,p3d.vertex, 
                p1d.normale,p2d.normale,p3d.normale, 
                p1d.texture,p2d.texture,p3d.texture,
                currentMat,currentGroup);   
    }
    static _parseTriangleVtx(pwds) {
        if (pwds.length == 3) return {"vertex":pwds[0], "texture":pwds[1] == "" ? undefined : pwds[1], "normale":pwds[2]};
        if (pwds.length == 2) return {"vertex":pwds[0], "texture":pwds[1], "normale":undefined};
        return {"vertex":pwds[0], "texture":pwds[0], "texture":undefined, "normale":undefined};
    }
}


Mesh.PUSH_X_Y_Z_R_G_B = function(msh, arr, t) {
    Mesh._PSH_VTX_X_Y_Z_R_G_B(arr,msh.getV(t.p1));
    Mesh._PSH_VTX_X_Y_Z_R_G_B(arr,msh.getV(t.p2));
    Mesh._PSH_VTX_X_Y_Z_R_G_B(arr,msh.getV(t.p3));
}

Mesh._PSH_VTX_X_Y_Z_R_G_B = function(arr,p) {
    arr.push(p.x);
    arr.push(p.y);
    arr.push(p.z);
        
    arr.push(p.r);
    arr.push(p.g);
    arr.push(p.b);
}

Mesh.PUSH_X_Y_Z_TX_TY_TZ = function(msh, arr, t) {
    Mesh._PSH_VTX_X_Y_Z_TX_TY(arr,msh.getV(t.p1),msh.getVT(t.t1));
    Mesh._PSH_VTX_X_Y_Z_TX_TY(arr,msh.getV(t.p2),msh.getVT(t.t2));
    Mesh._PSH_VTX_X_Y_Z_TX_TY(arr,msh.getV(t.p3),msh.getVT(t.t3));
}

Mesh._PSH_VTX_X_Y_Z_TX_TY = function(arr, p, vt) {
    arr.push(p.x);
    arr.push(p.y);
    arr.push(p.z);
        
    arr.push(vt.x);
    arr.push(vt.y);
}

class MeshPoint {
    constructor(id, x,y,z , r,g,b) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class MeshTextureCoord {
    constructor(id,x,y)   {
        this.id = id;
        this.x = x;
        this.y = y;
    }
    
}
MeshTextureCoord.DEFAULT = new MeshTextureCoord("",0,0);

class MeshNormale {
    constructor(id,x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
}
MeshNormale.DEFAULT = new MeshNormale("",0,0,0);


class MeshTriangle {
    constructor(id, p1,p2,p3, n1,n2,n3, t1,t2,t3, s, material, group) {
        this.id = id;
        
        this.p1 = p1;//id of point1
        this.p2 = p2;//id of point2
        this.p3 = p3;//id of point3
        
        this.n1 = t1;//normale
        this.n2 = t2;//normale
        this.n3 = t3;//normale
        
        this.t1 = t1;//texture coordinate
        this.t2 = t2;//texture coordinate
        this.t3 = t3;//texture coordinate

        this.s = s;// glättung (0: aus, sonst 1 bis 32)
        this.material = material;
        this.group = group;
    }
}
