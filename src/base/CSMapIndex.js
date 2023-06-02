let cesiumConfig = {
    domId: '',
    key: '',
    center: [],
    sourcePath: '',
    cssPath: ''
}
let p = Symbol('p')

const floorHeight = 3;
const dsNameKey = '-DS'

import * as jstool from '../utils/utility.js'
import {
    CircleWave
} from '../materialProperty/CircleWave.js';

export class GisCesiumMap {
    constructor(cesiumConfig) {
        this._domId = cesiumConfig.domId;
        this._center = cesiumConfig.center;
        this._isOnline = cesiumConfig.isOnline;
        this._Cesium = null;
        this._viewer = null;
        this._PolygonDataSource = null;
        this._imageryLayers = [];
        this._imgPoints = [];
        this._labels = [];
        this._PointPrimitiveCollection = null;

        let sourcePath = "./Cesium/Cesium.js";
        let cssPath = "./Cesium/Widgets/widgets.css";
        if (this._isOnline) {
            sourcePath = cesiumConfig.sourcePath;
            cssPath = cesiumConfig.cssPath;
        }
        let mapPromise = loadCSMap(cesiumConfig.key, sourcePath, cssPath);
        mapPromise.then((Cesium) => {
            this._Cesium = Cesium;
            let v = new Cesium.Viewer(cesiumConfig.domId, {
                animation: false,
                requestRenderMode: false,
                baseLayerPicker: false,
                maximumRenderTimeChange: Infinity,
                homeButton: false,
                geocoder: false,
                timeline: true,
                animation: false,
                baseLayerPicker: false,
                sceneModePicker: false,
                navigationHelpButton: false,
                fullscreenButton: false,
                infoBox: false,
                shouldAnimate: true,
                terrainProvider: Cesium.createWorldTerrain({ //开启在线地形
                    requestWaterMask: true, //指示客户端是否应从服务器请求额外的照明信息
                    requestVertexNormals: true //指示客户端是否应从服务器请求每个瓷砖水面具
                }),
                // imageryProvider: false
            });
            window.viewer = this._viewer = v;

            this[p]();
            this._viewer._cesiumWidget._creditContainer.style.display = "none";
            // let helper = new Cesium.EventHelper();
            // helper.add(viewer.scene.globe.tileLoadProgressEvent, (e) => {
            //     console.log('viewer:', viewer);
            // });

        })
    }

    [p]() {
        console.log('地图加载完成!')
        let imageryLayer = this._viewer.imageryLayers.get(0);
        this._imageryLayers.push({
            name: '默认图层',
            index: 0
        });
        // console.log('ggggggg', this._imageryLayers);

        let handler = new this._Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
        handler.setInputAction((e) => {
            let position = this._viewer.scene.pickPosition(e.position);
            console.log('position', position);
            console.log('e', e);
            let pick = this._viewer.scene.pick(e.position);
            console.log('pick', pick);
            // let curEntity = this._viewer.entities.getById(curPickId);
        }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK)

        this.loadMaterial();
        this.mapLoaded();

    }
    loadMaterial() {
        console.log('Cesium', Cesium);
        //波纹材质
        import('../materialProperty/CircleWaveMaterialProperty.js');
        //道路流光材质
        import('../materialProperty/RoadMaterialProperty.js');
        //垂直线流光材质
        import('../materialProperty/VerticalLineMaterialPoperty.js');
        //墙体流光材质
        import('../materialProperty/WallFlowMaterialProperty.js');
        //墙体渐变材质
        import('../materialProperty/WallGradientMaterialProperty.js');
    }

    mapLoaded() {
        console.log('Cesium', Cesium);
    }

    cameraFlyTo(cameraParmas) {
        this.cesiumObj._viewer.camera.flyTo({
            destination: this.cesiumObj._Cesium.Cartesian3.fromDegrees(cameraParmas.long, cameraParmas.lat, 2000000),
            orientation: {
                heading: this.cesiumObj._Cesium.Math.toRadians(0),
                pitch: this.cesiumObj._Cesium.Math.toRadians(-45),
                roll: this.cesiumObj._Cesium.Math.toRadians(0)
            },
            duration: duration
            // orientation: {
            //   heading: Cesium.Math.toRadians(0.0),
            //   pitch: Cesium.Math.toRadians(-15.0),
            // }
        });
    }

    getBuildHeight(height) {
        if (height > 0 && height < 4) {
            return 10

        }
        if (height >= 4 && height <= 10) {
            return 7
        }
        return floorHeight
    }

    getCesiumColor(rgbaColor) {
        if (rgbaColor) {
            return this._Cesium.Color.fromCssColorString(rgbaColor);
        }
        return this._Cesium.Color.fromCssColorString('rgba(255,255,0,0.4)');
    }

    addPolygonForGeo(geoJSON, styleObj, isCustomColor = false, showText = false) {
        this.removeAllDS();
        let tempStyleObj = {
            stroke: this.getCesiumColor('rgba(46,145,229,1)'),
            fill: this.getCesiumColor('rgba(46,145,229,0.3)'),
            strokeWidth: 4,
            markerSize: 5,
            markerColor: this._Cesium.Color.CYAN
        }
        if (styleObj) {
            tempStyleObj = {
                stroke: this.getCesiumColor(styleObj.stroke),
                fill: this.getCesiumColor(styleObj.fill),
                strokeWidth: styleObj.strokeWidth,
                markerSize: 5,
                markerColor: this._Cesium.Color.CYAN
            }
        }
        let dataPromise = this._Cesium.GeoJsonDataSource.load(geoJSON, tempStyleObj)
        dataPromise.then((dataSource) => {
            this._viewer.dataSources.add(dataSource);
            this._PolygonDataSource = dataSource
            if (isCustomColor) {
                let entities = dataSource.entities.values;
                for (let item of entities) {
                    if (item.properties.hasOwnProperty('color')) {
                        let tempColor = item.properties.color.getValue();
                        item.polygon.material = this.getCesiumColor(tempColor);
                    }
                }
            }
            if (showText) {
                let entities = dataSource.entities.values;
                let labels = []
                for (let item of entities) {
                    if (item.properties.hasOwnProperty('center')) {
                        let position = item.properties.center.getValue();
                        let label = {
                            position: position,
                            text: item.name,
                            font: '18px',
                            color: 'rgba(255,255,255,1)',
                        }
                        labels.push(label);
                    }
                }
                console.log('labels', labels);
                this.addLabel(labels);
            }
        })
    }

    removePolygonForGeo() {
        this._viewer.dataSources.remove(this._PolygonDataSource);
        if (this._labels && this._labels.length > 0) {
            this.removeLabel();
        }
    }

    addLabel(labels) {
        for (let item of labels) {
            let lng = item.position[0];
            let lat = item.position[1];
            if (typeof lng != 'number') {
                lng = lng - 0
            }
            if (typeof lat != 'number') {
                lat = lat - 0
            }
            let labelObj = {
                position: this._Cesium.Cartesian3.fromDegrees(lng, lat, 1000),
                label: {
                    text: item.text,
                    font: item.font,
                    fillColor: this.getCesiumColor(item.color),
                    style: this._Cesium.LabelStyle.FILL
                }
            }
            if (item.hasOutline) {
                labelObj.label.style = this._Cesium.LabelStyle.FILL_AND_OUTLINE;
                labelObj.label.outlineColor = this.getCesiumColor(item.outlineColor);
                labelObj.label.outlineWidth = item.outlineWidth;
            }
            let entity = this._viewer.entities.add(labelObj)
            this._labels.push(entity.id);
        }
        console.log('this._labels', this._labels);
    }

    removeLabel() {
        for (let item of this._labels) {
            this._viewer.entities.removeById(item);
        }
        this._labels = [];
    }

    removeDS(dataSource) {
        this._viewer.dataSources.remove(dataSource);
        this._dataSource = null;
    }

    removeAllDS() {
        this._viewer.dataSources.removeAll();
        this._dataSource = null;
    }

    /**
     * 通过名称获取图层对象
     * @param {*} name 图层名称
     * @returns 
     */
    getImgLayerByName(name) {
        let layer = null;
        for (let item of this._imageryLayers) {
            if (item.name == name) {
                layer = this._viewer.imageryLayers.get(item.index);
                break;
            }
        }
        return layer;
    }

    addImageryLayer(name, imageryLayer) {
        let layer = this.getImgLayerByName(name);
        if (layer) {
            layer.show = true;
            return;
        }

        let layerCount = this._viewer.imageryLayers.length;
        this._viewer.imageryLayers.addImageryProvider(imageryLayer, layerCount);
        this._imageryLayers.push({
            name: name,
            index: layerCount
        });
    }

    removeImageryLayer(name, isDel = false) {
        let index = -1;
        console.log('dddddd', this._viewer.imageryLayers);
        console.log('kkkkkk', this._imageryLayers);
        console.log('qqqqqqq', name);
        for (let i = 0; i < this._imageryLayers.length; i++) {
            console.log('mmmmm', this._imageryLayers[i].name);
            if (this._imageryLayers[i].name == name) {
                let mapLayer = this._viewer.imageryLayers.get(this._imageryLayers[i].index);
                console.log('tttttt', mapLayer);
                if (isDel) {
                    index = i;
                    this._viewer.imageryLayers.remove(mapLayer)
                } else {
                    mapLayer.show = false
                }
                break;
            }
        }
        if (index > -1) {
            this._imageryLayers.splice(index);
            console.log('dddddd', this._imageryLayers);
        }
    }

    /**
     * 添加高德矢量图层
     */
    addAMapVecLayer() {
        let layer = new this._Cesium.UrlTemplateImageryProvider({
            url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            minimumLevel: 3,
            maximumLevel: 18,
        })
        this.addImageryLayer('高德矢量', layer)
    }

    /**
     * 移除高德矢量图层
     * @param {*} isDel 移除-true;隐藏-false or null(默认)
     */
    removeAMapVecLayer(isDel) {
        this.removeImageryLayer('高德矢量', isDel)
    }

    /**
     * 添加高德影像图层
     */
    addAMapImgLayer() {
        let layer = new this._Cesium.UrlTemplateImageryProvider({
            url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
            minimumLevel: 3,
            maximumLevel: 18,
        })
        this.addImageryLayer('高德影像', layer)
    }

    /**
     * 移除高德影像图层
     * @param {*} isDel 移除-true;隐藏-false or null(默认)
     */
    removeAMapImgLayer(isDel) {
        this.removeImageryLayer('高德影像', isDel)
    }

    /**
     * 添加高德路网图层
     */
    addAMapRoadLayer() {
        let layer = new this._Cesium.UrlTemplateImageryProvider({
            url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            minimumLevel: 3,
            maximumLevel: 18,
        })
        this.addImageryLayer('高德路网', layer)
    }

    /**
     * 移除高德路网
     * @param {*} isDel 移除-true;隐藏-false or null(默认)
     */
    removeAMapRoadLayer(isDel) {
        this.removeImageryLayer('高德路网', isDel)
    }

    addArcGisImgLayer() {
        let arcgisProvider = new this._Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'

        })
        this.addImageryLayer('ArcGis影像', arcgisProvider)
    }

    removeArcGisImgLayer(isDel) {
        this.removeImageryLayer('ArcGis影像', isDel)
    }

    addMapPoint(positions, billboard) {
        for (let position of positions) {
            let lng = position[0];
            let lat = position[1];
            if (typeof lng != 'number') {
                lng = lng - 0
            }
            if (typeof lat != 'number') {
                lat = lat - 0
            }
            let point = {
                position: this._Cesium.Cartesian3.fromDegrees(lng, lat),
                billboard: billboard
            }
            let entity = this._viewer.entities.add(point)
            this._imgPoints.push(entity.id);
            console.log('entity', entity);
        }

    }

    removeMapPoint() {
        for (let item of this._imgPoints) {
            this._viewer.entities.removeById(item);
        }
        this._imgPoints = [];

    }

    addPrimitivePoint(positions, pointPrimitive) {
        if (!this._PointPrimitiveCollection) {
            this._PointPrimitiveCollection = this._viewer.scene.primitives.add(new this._Cesium.PointPrimitiveCollection());
        }
        for (let position of positions) {
            let lng = position[0];
            let lat = position[1];
            if (typeof lng != 'number') {
                lng = lng - 0
            }
            if (typeof lat != 'number') {
                lat = lat - 0
            }
            let point = {
                position: Cesium.Cartesian3.fromDegrees(lng, lat),
                color: this._Cesium.Color.CYAN
            }
            if (pointPrimitive && pointPrimitive.color) {
                point.color = this.getCesiumColor(pointPrimitive.color);
            }

            if (pointPrimitive && pointPrimitive.outlineColor) {
                point.outlineColor = this.getCesiumColor(pointPrimitive.outlineColor);
            }
            if (pointPrimitive && pointPrimitive.outlineWidth) {
                point.outlineWidth = pointPrimitive.outlineWidth;
            }
            if (pointPrimitive && pointPrimitive.pixelSize) {
                point.pixelSize = pointPrimitive.pixelSize;
            }
            this._PointPrimitiveCollection.add(point)
        }
    }

    removePrimitivePoint() {
        this._PointPrimitiveCollection && this._PointPrimitiveCollection.removeAll();
    }

    addRoadFlow(roadJson, img, duration) {
        let dsArr = this._viewer.dataSources.getByName('roadflowDS');
        if (dsArr && dsArr.length > 0) {
            console.log('数据源已经存在');
            return
        }

        this._Cesium.GeoJsonDataSource.load(roadJson).then((dataSource) => {
            dataSource.name = 'roadflowDS';
            let entities = dataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                entity.polyline.width = 2;
                entity.polyline.material = new this._Cesium.RoadMaterialProperty(
                    duration,
                    img
                );
            }
            this._viewer.dataSources.add(dataSource);
        });
    }

    removeDSByName(dsName) {
        let dsArr = this._viewer.dataSources.getByName(dsName);
        if (dsArr && dsArr.length > 0) {
            for (let ds of dsArr) {
                this._viewer.dataSources.remove(ds);
            }
        }
    }

    deleteRoadFlow() {
        this.removeDSByName('roadflowDS')
    }

    addBuildsByGeoJson(geojson, polygon) {
        let isAdd = this.showBuilds();
        if (isAdd) {
            return
        }
        let promise = new this._Cesium.GeoJsonDataSource.load(geojson);
        promise.then((datasource) => {
            datasource.name = 'buildingsDS';
            this._viewer.dataSources.add(datasource); // 加载这个geojson资源
            let entities = datasource.entities.values;
            for (let entity of entities) {
                let height = 0;
                entity.polygon.heightReference = this._Cesium.HeightReference.RELATIVE_TO_GROUND; // 贴地
                entity.polygon.height = 0; // 距地高度0米
                entity.polygon.extrudedHeightReference = this._Cesium.HeightReference.RELATIVE_TO_GROUND; //拉伸
                if (polygon.isRandomHeight) {
                    height = jstool.randomNum(1, 1, 120)[0]
                } else {
                    if (entity.properties.hasOwnProperty('height')) {
                        let val = entity.properties['height'].getValue();
                        if (!isNaN(val)) {
                            height = val;
                        }
                    }
                }
                entity.polygon.extrudedHeight = height * floorHeight; //entity.properties[exHeightFieldName]; // 拉伸高度
                entity.polygon.outline = polygon.isOutline;
                if (polygon.material) {
                    entity.polygon.material = polygon.material
                } else {
                    entity.polygon.material = this.getCesiumColor(polygon.fillColor)
                }
                if (polygon.isOutline) {
                    entity.polygon.outlineColor = this.getCesiumColor(polygon.outlineColor); // Cesium.Color.YELLOW;
                }
            }
        })
    }

    showBuilds() {
        let dsArr = this._viewer.dataSources.getByName('buildingsDS');
        if (dsArr && dsArr.length > 0) {
            let entities = dsArr[0].entities.values;
            for (let entity of entities) {
                entity.show = true
            }
            return true;
        }
        return false
    }

    deleteBuildsDS(name, isDel = false) {
        if (!isDel) {
            let dsArr = this._viewer.dataSources.getByName(name);
            if (dsArr && dsArr.length > 0) {
                let entities = dsArr[0].entities.values;
                for (let entity of entities) {
                    entity.show = false
                }
                return;
            }
        }
        this.removeDSByName(name);
    }

    addWall(positions, entity) {
        let hasEntity = this.showWall(entity.name);
        if (hasEntity) {
            return;
        }
        for (let cor of positions) {
            let postion = this.handleCoordinates(cor.coordinates);
            let wallObj = {
                name: entity.name,
                wall: {
                    positions: this._Cesium.Cartesian3.fromDegreesArray(postion),
                    maximumHeights: new Array(cor.coordinates.length).fill(cor.height),
                    minimumHeights: new Array(cor.coordinates.length).fill(0),
                }
            }
            if (entity.isCustomMaterial && entity.material) {
                wallObj.wall.material = entity.material;
            } else if (!entity.isGradient) {
                wallObj.wall.material = this.getCesiumColor(entity.color)
            } else {
                wallObj.wall.material = new this._Cesium.WallGradientMaterialProperty({
                    color: this.getCesiumColor(entity.color), //Cesium.Color.fromBytes(55, 96, 56).withAlpha(0.7),
                    duration: 2500
                })
            }
            this._viewer.entities.add(wallObj);
        }
    }

    showWall(name) {
        let entityList = this._viewer.entities.values
        let hasEntity = false;
        for (let entity of entityList) {
            if (entity.name == name) {
                entity.show = true;
                hasEntity = true;
            }
        }
        return hasEntity
    }

    deleteWall(name, isDel = false) {
        let entityList = this._viewer.entities.values
        if (isDel) {
            let ids = [];
            for (let entity of entityList) {
                if (entity.name == name) {
                    ids.push(entity.id);
                }
            }
            for (let id of ids) {
                this._viewer.entities.removeById(id)
            }
            console.log('entities', this._viewer.entities);
            return;
        }
        for (let entity of entityList) {
            if (entity.name == name) {
                entity.show = false;
            }
        }
        console.log('entities', this._viewer.entities);
    }

    addBuildsByWall(geojson, buildObj) {
        let positions = [];
        for (let i = 0; i < geojson.features.length; i++) {
            let height = geojson.features[i].properties['height'] - 0
            positions.push({
                height: height * this.getBuildHeight(height),
                coordinates: geojson.features[i].geometry.coordinates[0][0]
            })
        }
        this.addWall(positions, buildObj)
        let promise = new this._Cesium.GeoJsonDataSource.load(geojson);
        promise.then((datasource) => {
            datasource.name = buildObj.name + dsNameKey;
            this._viewer.dataSources.add(datasource); // 加载这个geojson资源
            let entities = datasource.entities.values;
            for (let entity of entities) {
                entity.name = buildObj.name;
                let height = entity.properties['height'].getValue() - 0
                entity.polygon.height = height * this.getBuildHeight(height); // 距地高度0米
                entity.polygon.material = this.getCesiumColor(buildObj.color);
                entity.polygon.outline = buildObj.isOutline;
                if (buildObj.isOutline) {
                    entity.polygon.outlineColor = this.getCesiumColor(buildObj.outlineColor); // Cesium.Color.YELLOW;
                }
                //extrudedHeight 不能设置高度设置反而有问题
                // entity.polygon.extrudedHeight = 1; //(entity.properties['height'].getValue() - 0) * 5 - 1;
            }
        })
    }

    deleteBuildsByWall(name, isDel = false) {
        this.deleteWall(name, isDel)
        if (isDel) {
            this.removeDSByName(name + dsNameKey)
        } else {
            this.deleteBuildsDS(name + dsNameKey, isDel);
        }
    }

    handleCoordinates(positions) {
        let coor = Array.prototype.concat.apply(
            [],
            positions
        );
        return coor;
    }

    getBuildFlowMaterial(material) {
        let flowBuildMaterial = new this._Cesium.WallFlowMaterialProperty({
            color: this.getCesiumColor(material.color), //Cesium.Color.fromBytes(55, 96, 56).withAlpha(0.7),
            duration: material.duration
        });
        return flowBuildMaterial;
    }

    addBuildsByFlowWall(geojson, buildObj) {
        this.addBuildsByWall(geojson, buildObj)
    }

    deleteBuildsByFlowWall(name, isDel = false) {
        this.deleteBuildsByWall(name, isDel)
    }

    addCircleWave(waveInfo) {
        let cirleWave = new CircleWave(this._viewer, waveInfo.name)
        cirleWave.add(waveInfo.position, waveInfo.color, waveInfo.maxRadius, waveInfo.duration, waveInfo.isEdit, waveInfo.count);
        return cirleWave;
    }
    deleletCircleWave(cirleWaveObj) {
        cirleWaveObj.del();
    }

}

export function loadCSMap(key, sourcePath, cssPath) {
    return new Promise(function (resolve, reject) {
        clearElDom();
        let link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = cssPath;
        link.id = "cesiummaplink"
        document.head.appendChild(link)
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'cesiummapscriptid';
        script.src = sourcePath;
        document.head.appendChild(script)
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'complete' || script.readyState == 'loaded') {
                    Cesium.Ion.defaultAccessToken = key
                    resolve(Cesium);
                }
            }
        } else {
            script.onload = function () {
                Cesium.Ion.defaultAccessToken = key
                resolve(Cesium);
            }
        }
    })
}

function clearElDom() {
    let link = document.getElementById('cesiummaplink')
    let script = document.getElementById('cesiummapscriptid')
    if (link) {
        document.head.removeChild(link);
    }
    if (script) {
        document.head.removeChild(script);
    }
}