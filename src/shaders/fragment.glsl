uniform vec3 uColor;
uniform sampler2D uTexture;


varying vec2 vUv;
varying float vElevation;

void main()
{

    vec4 textureColor = texture2D(uTexture, vUv);
    gl_FragColor = textureColor;

}