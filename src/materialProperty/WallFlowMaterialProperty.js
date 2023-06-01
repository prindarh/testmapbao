function WallFlowMaterialProperty(options) {
    // 默认参数设置
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = options.color;
    this.duration = options.duration;
    this.trailImage = options.trailImage;
    this._time = (new Date()).getTime();
}
Object.defineProperties(WallFlowMaterialProperty.prototype, {
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
WallFlowMaterialProperty.prototype.getType = function (time) {
    return 'WallFlow';
};
WallFlowMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    if (this.trailImage) {
        result.image = this.trailImage;
    } else {
        result.image = Cesium.Material.WallFlowImage
    }

    if (this.duration) {
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    }
    viewer.scene.requestRender();
    return result;
};
WallFlowMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof DynamicWallMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
};

let img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAAAYCAYAAACY7WRwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADeGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQwZDFjZTg4LWM2NmUtNDhjOS04ZWJkLTIyMDc0MDkyOGMwZiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpERkY1OTlGQkM0RDgxMUVDOUFCOUEyNDY5NDY2QkYwNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpERkY1OTlGQUM0RDgxMUVDOUFCOUEyNDY5NDY2QkYwNSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQwZDFjZTg4LWM2NmUtNDhjOS04ZWJkLTIyMDc0MDkyOGMwZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MGQxY2U4OC1jNjZlLTQ4YzktOGViZC0yMjA3NDA5MjhjMGYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5/gipcAAAIVklEQVR4Xu2dPYheVRCGk/hTqCBIsFOjlWCh2NqJpWgZKxsLS0sRLG0s7WxsLEQrUSyFVDZWCmpjIdFOgyCo4G+cN+y7vHkzM+fc++3G79P7wHDPzJm/c+/k8u0u2T179erVMxVX3rr7bFxuPZJbQs6FwAap1pnuMvKHDnDluvN1HWR7auMVqJ/HQAeZXfXMzjXAGgJ8X2NU6J/FQvBMAH11jzrg2n1Usr0qp+qAdtdHvtwDage6r+tMdxn5UwdcVznVjjXIfNW2sb/8EfJ9yJchl0LeCfk2JCV9QdqLkcBRB4Br1Xn1teqAg1btZ/YZHWR7QGsC1xnjOsj2eFV7lRNwndkAr6N7cxrn8JpAr25fo4NsvVQHvO569qU6r253fWN/wczcEXJPyH0hD4V8EPJyyA0vSg7YMfFyhO32EFz/OpK/Q4i+Uav1EmbiOHQjXx1O9c2GlvuzOd3Pc2Y1aMv2Zun6Q97qHKNzKeq7JG7mHhDd6/xm6+vZHdpZp6unZPnUluWZzb2xH+Bd9nMIXoafhLwX8nDI5yHPhFzHdS/Io5cjPjUiCV+KPgCqY10NaTU4mX00hFWNzq55Kr8lMB+vWQ2vQ51XjVU8t+I2jcW6i1W6fd3Dusrpup+DemZXm+8rrNH5kKo/t4/QuK7PbM+vG4fF7yGfhnwc8nbISyHHHL8gj76sxve0qk+LINPXDiXxOM3peK3OT3vN/KpYx89MZuMBfatcHaNznARao+vR906jH9YY3bOuT4D4kQ+hH656Jqw7XansG4fBjyEfhbwW8hwMQD9B6suxGqwlQ1DlyOxLh8tzUK9qZtB37WAjvquHvMzttbym5vG1+roO1L+j89OcWFe+s7Xd72agfeM6e15l5ny0/Rtn3DhdfgnBJ8k3Q+6H4doL8uhL62qg1I515ef4AFEfDdaSweuGVW0zPc/WrXIh3mt6f0v78J5c7zjJ2JNgbc41fY9i+Byy5zF6RlXumWe7sf/gJ9zfhLwOhZ8g8dCzBwy7D4Tr1WC4XfVumDK/aigruzPjx1pdbwpyal7EaazvnwRdb75X6W73HrHvPhXV+TxHdx9Gtar9rG8yG+MgDj7q53nX5t44HD4LeTbkAl+Q1UOv7GTJUKhvNYDOKP+oPwI/92Xuyl4xG9f11u0pWY3Z2IrR+ZzOv+oli5n1HelKl5Oi0J92vxL1872KqpeNwwM/uPku5OK5ox/OONXguI6hqAYo850hy7fr8CFn1c/SPqu4jF3OnIF8s75Lcmqf2f2gbXSequZM31WNqmZmV1u1zuB+dvaN/yeXQ56sPkF2g7HEdw2eL/uHRVv1j8pZ0mNWbwbU0Ni1edbi9boz695MXJVrbc2MpfvZ/V3Sz67M9LNxuOCn2o/o9yArdBCygWMs91wnave9LC/BnvdHf16r/TV4rOcm8HNf1bGuYh3PQzxedc9f5ciY7cvxONbMaqsv1mtrkqp2B2NGsV1vVZ1dz7Ox3/wacp4vSMJh0Ifv62owaM9yALXrnuvAh7Ia0grPB91zuM8asjqAtUZ9c7/qxeOha4zu73IejdX1qD/i+1nfCvwZ43ukyqG1qvVJclp5N/Yb/A/C459i+/BRx1UHVddLqQbNc2Z+VazbK7+M6iyzOeDnOaiPcnCf166XmfvTMdNTVx+M9peCfN5XdSXQNS6j2+vwuKoHZW2tjcMA/1/7in+CdDAgPiSzgzHrN5N/lGumVjfsHV1uzZndK+qj/qreEFftOVWNUQ9eY9SrMqqp0LfrY4Tn1Risu/0M7vs98rwZS2ttHBbnQ744d/6Fn/Bgs4EG/tDhp75ZHG1VzoysTob7UXf/yu800Rpeb3QvZvvr8vhe56v1Rr2tITsP6+Ca1VzTh8csve+EcTP56JOdceO/w4WQSzOfIHUQfCig05btKa4T2EeDSdzPYdzIbwmeq8oN+6j+rnbk93tDnyVnn/HZBc8/U4/9+/kqshpLz0V/jevqY6+6z0trb+wv+G1m+FVo7+r3IKsHrHasdYB8D3QDluF1oWe2jMoOqj4rZnxAdb7M7rYlsRlZj7M1qvN1tbk3e28UzetriOekvqYWYF6CPKorrMF9j+vwWNc3Dp/HQt4PuXztBTn4Mrtjl6GoBgv6KG/Vq9qXnoc1s34qfG+2ZlXLyXqZOTsY5Z6BOZfmmukzO5teR7hfd/6qVtaj+mK/Ogfpcm0cHveGPBjyChT9Ehs/1s6+5PZB00HQtfqBamDop4OlsVmc53adVHbQ7SlV34T7ns/PAapctK/dX4P2puusxmxd9+v6nr03zqxfxtJY9Kgx3jOgbZe+NvaTO0OeCnkx5NpvFz9+IR59iuRLUh9+Nwg6QLsMjMeOco320Zf2pmsy22/np3uoMZsz60fh/shvtp7jfY/qEPfr9FHOat/PRL9RPlDFup36TM5ZTjLXxs0Hf4Lh6ZBXQ/Bbxq9x3SfGeEni90H+GeIvyY7KrxqYmbwe6wPtV6K5qzWY6YF0Nb2+686SuiDzr+qPalegxmxfS/p335FOeI6Z87hPFVP5LTkPqc6xJtfGv89tIY+H4JPj8yFvhBxzw5fURy9J/DYLDBH+/AIePF+YkGoInbUDg/weu3SgMz+1IZ+fY5Tb96FnthlGcaprn7BXvl0O4Drx+wCqe5P5gsrewZgqNuu/6gus6cGp7pHifZ9E3Y2bB95ld4U8EPJEyMWQr0MeDfkw5DrW/NlXfVlSMhvF96AD2rN91V08DoxydDkzX6B2XwOP457b1M5YtblPpat4Pr12vr5HO+hiVQe46ppXiPpnUvmo3X1GukrlC7jGFVS+lU8Vp/u4buwvv4X8EPJVyODPvp458w+y7REQjJOZSAAAAABJRU5ErkJggg==';

Cesium.WallFlowMaterialProperty = WallFlowMaterialProperty;
Cesium.Material.WallFlowType = 'WallFlow';
Cesium.Material.WallFlowImage = img; //从下到上流光效果
Cesium.Material.WallFlowSource = `czm_material czm_getMaterial(czm_materialInput materialInput)
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
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallFlowType, {
    fabric: {
        type: Cesium.Material.WallFlowType,
        uniforms: {
            color: new Cesium.Color(1.0, 1.0, 1.0, 1),
            image: Cesium.Material.WallFlowImage,
            time: 0
        },
        source: Cesium.Material.WallFlowSource
    },
    translucent: function (material) {
        return true;
    }
});