const V_SHADER = `
precision mediump float;\n
attribute vec3 vertPosition;\n
// attribute vec3 vertNormale;\n
attribute vec2 vertTexCoord;\n
// attribute vec3 vertColor;\n
uniform mat4 mWorld;\n
uniform mat4 mView;\n
uniform mat4 mProj;\n

// varying vec3 fragColor;\n
// varying vec3 fragNormale;\n
varying vec2 fragTexCoord;\n

void main() {\n
//    fragColor = vertColor;\n
//    fragNormale = vertNormale;\n
    fragTexCoord = vertTexCoord;\n
    fragTexCoord.y = 1.0 - fragTexCoord.y;\n
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);\n
}\n


`;




const F_SHADER = `
precision mediump float;\n
// varying vec3 fragColor;\n
// varying vec3 fragNormale;\n
varying vec2 fragTexCoord;\n

uniform sampler2D sampler;\n
void main() {\n
    // gl_FragColor = vec4(fragColor, 1.0);\n
    gl_FragColor = texture2D(sampler, fragTexCoord);\n
}\n

`;
