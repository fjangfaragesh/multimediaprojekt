// code geklaut von https://www.youtube.com/playlist?list=PLjcVFFANLS5zH_PeKC6I8p0Pt1hzph_rt
const SPEED = 0.05;
const R_SPEED = 0.2;
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
const KEY_ZOOM = 67;

const TEXTURE = new Image();
TEXTURE.src = "landschaft.png";


class Cam {
    constructor() {
        this.pos = new Float32Array([0,0,5,1]);
        this.base = new Float32Array(16);
        glMatrix.mat4.identity(this.base);
        this.ang1 = 0;
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
        glMatrix.mat4.copy(this.matInternal,this.base);
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

const TRI_VTX = MSH.buildArray(Mesh.PUSH_X_Y_Z_TX_TY_TZ);

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
    let posAttribTexCoord = gl.getAttribLocation(program, 'vertTexCoord');
    
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, gl.FALSE, 5*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(posAttribTexCoord, 2, gl.FLOAT, gl.FALSE, 5*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);
    
    gl.enableVertexAttribArray(posAttribLocation);
    gl.enableVertexAttribArray(posAttribTexCoord);

    let mWorldUniformLocation = gl.getUniformLocation(program,"mWorld");
    let mViewUniformLocation = gl.getUniformLocation(program,"mView");
    let mProjUniformLocation = gl.getUniformLocation(program,"mProj");

    let boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, TEXTURE);
                  
    let loop = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0,0,window.innerWidth,window.innerHeight);
        glMatrix.mat4.perspective(mProj, isKeyPressed(KEY_ZOOM) ? 5/180*Math.PI : 60/180*Math.PI, window.innerWidth/window.innerHeight, 0.01, 1000);

        
        gl.clearColor(0.5,0.6,0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.useProgram(program);
        
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        
        gl.uniformMatrix4fv(mWorldUniformLocation, gl.FALSE, mWorld);
        gl.uniformMatrix4fv(mViewUniformLocation, gl.FALSE, mView);
        gl.uniformMatrix4fv(mProjUniformLocation, gl.FALSE, mProj);
        
        gl.drawArrays(gl.TRIANGLES, 0, TRI_VTX.length/5);// 0 skip
        
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
    cam.ctrlRot1(-RM_SPEED*e.movementX* (isKeyPressed(KEY_ZOOM) ? 0.1 : 1));
    cam.ctrlRot2(-RM_SPEED*e.movementY* (isKeyPressed(KEY_ZOOM) ? 0.1 : 1));  
}
