// var fs_src = `
//     precision highp float;

//     const vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
//     const vec3 specColor = vec3(1.0, 1.0, 1.0);

//     uniform vec3 lightPos;
//     uniform sampler2D texSampler;
//     uniform int textureLighting;
//     uniform float lightIntensity;

//     varying vec3 fPos;
//     varying vec3 fNormal;
//     varying vec2 texCoords;

//     vec3 normal;

//     vec3 calculate_lighting() {
//         // vec3 lightDir = fPos - lightPos;
//         vec3 lightDir = lightPos - fPos;
//         float distance = length(lightDir);
//         if (distance >= 1.0) {
//             distance = distance * distance;
//         } else {
//             distance = pow(distance, 0.5);
//         }
//         lightDir = normalize(lightDir);
    
//         float lambertian = max(dot(lightDir, normal), 0.0);
//         vec3 diffuse = diffuseColor * lambertian / distance;

//         // float specularCoeff = 0.0;
//         // if (lambertian > 0.0) {
//         //     vec3 viewDir = normalize(fPos);
//         //     vec3 halfDir = normalize(lightDir + viewDir);
            
//         //     float specAngle = max(dot(halfDir, normal), 0.0);
//         //     specularCoeff = pow(specAngle, 1.0);
//         // }
//         // vec3 specular = specularCoeff * specColor / distance;

//         vec3 color = diffuse; // + specular;
//         return color;
//     }

//     void main() {
//         normal = normalize(fNormal);
//         vec3 color = calculate_lighting();
//         vec4 texColor = texture2D(texSampler, texCoords);
        
//         if (textureLighting == 1) {
//             gl_FragColor = texColor;
//         } else if (textureLighting == 2) {
//             gl_FragColor = vec4(lightIntensity * color, 1.0);
//         } else if (textureLighting == 3) {
//             gl_FragColor = texColor + vec4(lightIntensity * texColor.xyz * color, 0.0);
//         }
//     }
// `;

var fs_src = `
    precision highp float;

    const vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
    const vec3 specColor = vec3(1.0, 1.0, 1.0);

    uniform vec3 lightPos;
    uniform sampler2D texSampler;
    uniform int textureLighting;
    uniform float lightIntensity;

    varying vec3 fPos;
    varying vec3 fNormal;
    varying vec2 texCoords;

    vec3 normal;

    vec3 calculate_lighting() {
        // 计算从光源到片段的光照方向
        vec3 lightDir = normalize(lightPos - fPos); // 从光源指向片段的方向
        float distance = max(length(lightPos - fPos), 0.1); // 确保距离大于0
        float attenuation = 1.0 / (distance * distance); // 光照衰减

        // 漫反射（Lambertian）计算
        float lambertian = max(dot(lightDir, normalize(fNormal)), 0.0);
        vec3 diffuse = diffuseColor * lambertian * attenuation; // 漫反射颜色

        // 镜面反射计算
        float specularCoeff = 0.0;
        if (lambertian > 0.0) {
            vec3 viewDir = normalize(fPos); // 观察方向
            vec3 halfDir = normalize(lightDir + viewDir); // 半程向量
            float specAngle = max(dot(halfDir, normalize(fNormal)), 0.0); // 镜面反射角度
            specularCoeff = pow(specAngle, 1.0); // 镜面反射系数
        }
        vec3 specular = specularCoeff * specColor * attenuation; // 镜面反射颜色

        vec3 color = diffuse + specular; // 合并漫反射和镜面反射
        return color;
    }

    void main() {
        normal = normalize(fNormal); // 法线向量
        vec3 color = calculate_lighting(); // 计算光照

        vec4 texColor = texture2D(texSampler, texCoords); // 获取纹理颜色
        
        // 根据 textureLighting 选择渲染方式
        if (textureLighting == 1) {
            gl_FragColor = texColor; // 仅使用纹理
        } else if (textureLighting == 2) {
            gl_FragColor = vec4(lightIntensity * color, 1.0); // 使用光照颜色
        } else if (textureLighting == 3) {
            gl_FragColor = texColor + vec4(lightIntensity * texColor.xyz * color, 0.0); // 纹理与光照混合
        }
    }
`;

