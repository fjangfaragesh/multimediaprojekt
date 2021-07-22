// code geklaut von https://www.youtube.com/playlist?list=PLjcVFFANLS5zH_PeKC6I8p0Pt1hzph_rt
const SPEED = 1;
const R_SPEED = 0.01;
const RM_SPEED = 0.002;

const KEY_FWD = 87;
const KEY_LEFT = 65;
const KEY_BKWD = 83;
const KEY_RIGHT = 68;
const KEY_UP = 32;
const KEY_DOWN = 16;
const KEY_R_UP = 38;
const KEY_R_LEFT = 37;
const KEY_R_DOWN = 40;
const KEY_R_RIGHT = 39;



class Mesh {
    constructor() {
        this.points = [];
        this.triangles = [];
    }
    _getP(id) {
        for (let p of this.points) {
            if (p.id == id) return p;
        }
        throw new Error("p " + id + " net gefunden :(");
    }
    buidLalalalalaArray() {
        let arr = [];
        for (let t of this.triangles) {
            let p1 = this._getP(t.p1);
            let p2 = this._getP(t.p2);
            let p3 = this._getP(t.p3);
            this._pushVertex(arr,t,p1);
            this._pushVertex(arr,t,p2);
            this._pushVertex(arr,t,p3);
        }
        return new Float32Array(arr);
    }
    _pushVertex(arr, t, p) {
        arr.push(p.pos[0]);//jaaaaa
        arr.push(p.pos[1]);
        arr.push(p.pos[2]);
        if (t.color === undefined) {
            arr.push(p.color[0]);
            arr.push(p.color[1]);
            arr.push(p.color[2]);
        } else {
            arr.push(t.color[0]);
            arr.push(t.color[1]);
            arr.push(t.color[2]);
        }
    }
    static loadObj(objStr) {
        let ret = new Mesh();
        let lines = objStr.split("\n");
        let pId = 1;
        let fId = 1;
        for (let l of lines) {
            if (l == "" || l.startsWith("#")) continue;
            let wds = l.split(" ");
            switch (wds[0]) {
                case "v":
                    ret.points.push(new MeshPoint(pId++,[wds[1]*1,wds[2]*1,wds[3]*1],[Math.random(),Math.random(),Math.random()]));
                    break;
                case "f":
                    ret.triangles.push(new MeshTriangle(fId++, wds[1].split("/")[0] ,wds[2].split("/")[0] ,wds[3].split("/")[0] ,undefined));
                    break;
                case "default":
 //                   console.log("ignored: " + l);
            }
        }
        return ret;
    }
}


class MeshPoint {
    constructor(id, pos, color) {
        this.pos = pos;
        this.color = color;
        this.id = id;
    }
}


class MeshTriangle {
    constructor(id, p1, p2 ,p3, color) {
        this.p1 = p1;//id of point1
        this.p2 = p2;//id of point2
        this.p3 = p3;//id of point3
        this.color = color;// undefined: use vertex colors
    }
}


class Cam {
    constructor() {
        this.pos = new Float32Array([0,0,5,1]);
        this.ang1 = Math.PI;
        this.ang2 = 0;
        this.ang3 = 0;
        this.matrix = new Float32Array(16);
        this.matInternal = new Float32Array(16);
    }
    updateMatrix() {
        glMatrix.mat4.identity(this.matrix);
        glMatrix.mat4.translate(this.matrix,this.matrix, this.pos);
        glMatrix.mat4.rotateY(this.matrix,this.matrix, this.ang1);
        glMatrix.mat4.rotateX(this.matrix,this.matrix, this.ang2);
        glMatrix.mat4.rotateZ(this.matrix,this.matrix, this.ang3);
        glMatrix.mat4.invert(this.matrix, this.matrix)
        return this.matrix;
    }
    
    ctrlMove(distanceRight,distanceUp,distanceFwd) {
        glMatrix.mat4.identity(this.matInternal);
        glMatrix.mat4.rotateY(this.matInternal,this.matInternal, this.ang1);
        let iiii = new Float32Array(4);
        glMatrix.vec4.transformMat4(iiii, [distanceRight,distanceUp,distanceFwd,1.0], this.matInternal);
        glMatrix.vec4.add(this.pos, this.pos, iiii);
    }
    ctrlRot1(angle) {
        this.ang1 += angle;
        this.ang1 = (Math.PI*2 + this.ang1)%(Math.PI*2);
    }
    ctrlRot2(angle) {
        this.ang2 += angle;
        this.ang2 = Math.min(Math.PI/2,Math.max(-Math.PI/2,this.ang2));
    }
    ctrlRot3(angle) {
        this.ang3 += angle;
        this.ang3 = (Math.PI*2 + this.ang3)%(Math.PI*2);
    }
}




const VALIDATE_ENABLE = true;

const MSH = Mesh.loadObj(TEEEEESSSSSTTT);
/*
MSH.points.push(new MeshPoint("A",[0,0,1],[1,0,0]));
MSH.points.push(new MeshPoint("B",[1,1,0],[0,1,0]));
MSH.points.push(new MeshPoint("C",[-1,1,0],[0,0,1]));
MSH.points.push(new MeshPoint("D",[-1,-1,0],[1,1,0]));
MSH.points.push(new MeshPoint("E",[1,-1,0],[0,0,0]));
MSH.points.push(new MeshPoint("F",[0,0,-1],[1,1,1]));

MSH.triangles.push(new MeshTriangle("1", "A","B","C",undefined));
MSH.triangles.push(new MeshTriangle("2", "A","C","D",undefined));
MSH.triangles.push(new MeshTriangle("3", "A","D","E",undefined));
MSH.triangles.push(new MeshTriangle("4", "A","E","B",undefined));
MSH.triangles.push(new MeshTriangle("5", "B","C","F",undefined));
MSH.triangles.push(new MeshTriangle("6", "C","D","F",undefined));
MSH.triangles.push(new MeshTriangle("7", "D","E","F",undefined));
MSH.triangles.push(new MeshTriangle("8", "E","B","F",undefined));*/

const TRI_VTX = MSH.buidLalalalalaArray();

/*const TRI_VTX = [
        0.0, 0.0, 1.0,     0.0,0.0,1.0,//
        1.0, 0.0, 0.0,     0.0,0.0,1.0,
        0.0, 1.0, 0.0,     0.0,0.0,1.0,
        0.0, 0.0, 1.0,     1.0,0.0,0.0,//
        -1.0, 0.0, 0.0,    1.0,0.0,0.0,
        0.0, 1.0, 0.0,     1.0,0.0,0.0,
        0.0, 0.0, 1.0,     1.0,0.0,1.0,//
        1.0, 0.0, 0.0,     1.0,0.0,1.0,
        0.0, -1.0, 0.0,    1.0,0.0,1.0,
        0.0, 0.0, 1.0,     0.0,0.0,0.0,//
        -1.0, 0.0, 0.0,    0.0,0.0,0.0,
        0.0, -1.0, 0.0,    0.0,0.0,0.0,
        0.0, 0.0, -1.0,    0.0,1.0,0.0,//
        1.0, 0.0, 0.0,     0.0,1.0,0.0,
        0.0, 1.0, 0.0,     0.0,1.0,0.0,
        0.0, 0.0, -1.0,    1.0,1.0,0.0,//
        -1.0, 0.0, 0.0,    1.0,1.0,0.0,
        0.0, 1.0, 0.0,     1.0,1.0,0.0,
        0.0, 0.0, -1.0,    0.0,1.0,1.0,//
        1.0, 0.0, 0.0,     0.0,1.0,1.0,
        0.0, -1.0, 0.0,    0.0,1.0,1.0,
        0.0, 0.0, -1.0,    1.0,1.0,1.0,//
        -1.0, 0.0, 0.0,    1.0,1.0,1.0,
        0.0, -1.0, 0.0,    1.0,1.0,1.0
];*/

let mWorld = new Float32Array(16);
glMatrix.mat4.identity(mWorld);

let mView = new Float32Array(16);
glMatrix.mat4.lookAt(mView,[0,0,-5], [0,0,0], [0,1,0]);
console.log(mView);

let mProj = new Float32Array(16);
//glMatrix.mat4.perspective(mProj, 45, 1, 10, 1000);

let cam = new Cam();

const V_SHADER = `
precision mediump float;\n
attribute vec3 vertPosition;\n
attribute vec3 vertColor;\n
uniform mat4 mWorld;\n
uniform mat4 mView;\n
uniform mat4 mProj;\n

varying vec3 fragColor;\n
void main() {\n
    fragColor = vertColor;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);\n
}\n


`;

const F_SHADER = `
precision mediump float;\n
varying vec3 fragColor;\n
void main() {\n
    gl_FragColor = vec4(fragColor, 1.0);\n
}\n

`;

onload = function() {
    let canvas = document.getElementById("canv");
    console.log('canvas.getContext("webgl") ...');
    let gl = canvas.getContext("webgl");
    if (!gl) {
    console.log('canvas.getContext("experimental-webgl") ...');
        gl = canvas.getContext("experimental-webgl");
    }
    if (!gl) {
        alert("es wird leider kein webgl auf deinem Brauser unterstützt. Vielleicht muss man es anschalten? Oder einfach die neuste firefox version nehmen, dann müsste es gehen theoretisch.");
        return;
    }
    console.log("webgl da :)",gl);
    
    
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, V_SHADER);
    gl.shaderSource(fragmentShader, F_SHADER);
    
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)) {
        alert("vertexShader compilierungs fehler :(");
        console.error(gl.getShaderInfoLog(vertexShader));
        return;
    }
    
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)) {
        alert("fragmentShader compilierungs fehler :(");
        console.error(gl.getShaderInfoLog(fragmentShader));
        return;
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) {
        alert("linkungs fehler :(");
        console.error(gl.getProgramInfoLog(program));
        return;
    }
    
    
    if (VALIDATE_ENABLE) {
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program,gl.VALIDATE_STATUS)) {
            alert("validierungs fehler :(");
            console.error(gl.getProgramInfoLog(program));
            return;
        }
    }
    
    
    
    let triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TRI_VTX), gl.STATIC_DRAW);
    
    let posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let posAttribColor = gl.getAttribLocation(program, 'vertColor');
    
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, gl.FALSE, 6*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(posAttribColor, 3, gl.FLOAT, gl.FALSE, 6*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);
    
    gl.enableVertexAttribArray(posAttribLocation);
    gl.enableVertexAttribArray(posAttribColor);

    let mWorldUniformLocation = gl.getUniformLocation(program,"mWorld");
    let mViewUniformLocation = gl.getUniformLocation(program,"mView");
    let mProjUniformLocation = gl.getUniformLocation(program,"mProj");


    
    let loop = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0,0,window.innerWidth,window.innerHeight);
        glMatrix.mat4.perspective(mProj, 45, window.innerWidth/window.innerHeight, 0.01, 1000);

        
        gl.clearColor(0.5,0.6,0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.useProgram(program);
        
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        
        gl.uniformMatrix4fv(mWorldUniformLocation, gl.FALSE, mWorld);
        gl.uniformMatrix4fv(mViewUniformLocation, gl.FALSE, mView);
        gl.uniformMatrix4fv(mProjUniformLocation, gl.FALSE, mProj);
        gl.drawArrays(gl.TRIANGLES, 0, TRI_VTX.length/6);// 0 skip, 3*8 vertexes
        
        requestAnimationFrame(loop);
    };

    
    
    
    
    requestAnimationFrame(loop);
}

setInterval(physikLoop,10);

function physikLoop() {

    
    mView = cam.updateMatrix();
    
    //glMatrix.mat4.rotateY(mWorld,mWorld, 0.01);
    //glMatrix.mat4.rotateX(mWorld,mWorld, 0.005314);
    //glMatrix.mat4.rotateZ(mWorld,mWorld, 0.00313);
    
    if (isKeyPressed(KEY_FWD)) console.log("fwd");
    if (isKeyPressed(KEY_FWD)) cam.ctrlMove(0,0,-SPEED);
    if (isKeyPressed(KEY_LEFT)) cam.ctrlMove(-SPEED,0,0);
    if (isKeyPressed(KEY_BKWD)) cam.ctrlMove(0,0,SPEED);
    if (isKeyPressed(KEY_RIGHT)) cam.ctrlMove(SPEED,0,0);
    if (isKeyPressed(KEY_UP)) cam.ctrlMove(0,SPEED,0);
    if (isKeyPressed(KEY_DOWN)) cam.ctrlMove(0,-SPEED,0);
    if (isKeyPressed(KEY_R_UP)) cam.ctrlRot2(-R_SPEED);
    if (isKeyPressed(KEY_R_LEFT)) cam.ctrlRot1(-R_SPEED);
    if (isKeyPressed(KEY_R_DOWN)) cam.ctrlRot2(R_SPEED);
    if (isKeyPressed(KEY_R_RIGHT)) cam.ctrlRot1(R_SPEED);

}

onmousemove = function(e) {
    cam.ctrlRot1(-RM_SPEED*e.movementX);
    cam.ctrlRot2(-RM_SPEED*e.movementY);  
}
