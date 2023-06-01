class RoadMaterialProperty {
  constructor(duration, image) {
    this._definitionChanged = new Cesium.Event();
    this.duration = duration;
    this.image = image;
    this._time = performance.now();
  }
  get isConstant() {
    return false;
  }
  get definitionChanged() {
    return this._definitionChanged;
  }
  getType() {
    return Cesium.Material.RoadMaterialType;
  }
  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.image = this.image;
    result.time =
      ((performance.now() - this._time) % this.duration) / this.duration;
    return result;
  }
  equals(other) {
    return (
      this === other ||
      (other instanceof RoadMaterialProperty &&
        this.duration === other.duration)
    );
  };
}

Object.defineProperties(RoadMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor("color"),
  duration: Cesium.createPropertyDescriptor("duration"),
});

Cesium.RoadMaterialProperty = RoadMaterialProperty;
Cesium.Material.RoadMaterialType = "roadMaterial";
Cesium.Material.RoadMaterialSource = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
czm_material material = czm_getDefaultMaterial(materialInput);
vec2 st = materialInput.st;
vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
material.alpha = colorImage.a;
material.diffuse = colorImage.rgb * 1.5 ;
return material;
}`;

Cesium.Material._materialCache.addMaterial(Cesium.Material.RoadMaterialType, {
  fabric: {
    type: Cesium.Material.RoadMaterialType,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      image: "",
      transparent: true,
      time: 20,
    },
    source: Cesium.Material.RoadMaterialSource,
  },
  translucent: function () {
    return true;
  },
});