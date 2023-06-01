function WallGradientMaterialProperty(options) {
    // 默认参数设置
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = options.color;
    this.duration = options.duration;
    this.trailImage = options.trailImage;
    this._time = (new Date()).getTime();
}
Object.defineProperties(WallGradientMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});
WallGradientMaterialProperty.prototype.getType = function (time) {
    return 'WallGradient';
};
WallGradientMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    if (this.trailImage) {
        result.image = this.trailImage;
    } else {
        result.image = Cesium.Material.WallGradientImage
    }

    if (this.duration) {
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    }
    viewer.scene.requestRender();
    return result;
};
WallGradientMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof WallGradientMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
};
let img = 'data:image/png;base64,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';

Cesium.WallGradientMaterialProperty = WallGradientMaterialProperty;
Cesium.Material.WallGradientType = 'WallGradient';
Cesium.Material.WallGradientImage = img;
Cesium.Material.WallGradientSource = `czm_material czm_getMaterial(czm_materialInput materialInput)
                                            {
                                            czm_material material = czm_getDefaultMaterial(materialInput);
                                            vec2 st = materialInput.st;
                                            vec4 colorImage = texture(image, vec2(fract(st.t - time), st.t));
                                            vec4 fragColor;
                                            fragColor.rgb = color.rgb / 1.0;
                                            fragColor = czm_gammaCorrect(fragColor);
                                            material.alpha = colorImage.a * color.a;
                                            material.diffuse = color.rgb;
                                            material.emission = fragColor.rgb;
                                            return material;
                                            }`;

// Cesium.Material.WallGradientSource = `uniform vec4 color;
// czm_material czm_getMaterial(czm_materialInput materialInput){
// czm_material material = czm_getDefaultMaterial(materialInput);
// vec2 st = materialInput.st;
// material.diffuse = color.rgb * 1.5;
// material.alpha = color.a * (1.0 - fract(st.t)) * 2.0;
// return material;
// }`;


Cesium.Material._materialCache.addMaterial(Cesium.Material.WallGradientType, {
    fabric: {
        type: Cesium.Material.WallGradientType,
        uniforms: {
            color: new Cesium.Color(1.0, 1.0, 1.0, 1),
            image: Cesium.Material.WallGradientImage,
            time: 0
        },
        source: Cesium.Material.WallGradientSource
    },
    translucent: function (material) {
        return true;
    }
});