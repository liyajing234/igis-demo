import Cesium from "./Unit.js";
class GeoUtils {
    constructor(props) {
    }

    /**
     * 判断点是否在圆内
     * @param point
     * @param circle
     * @param r
     * @returns {boolean}
     */
    static pointInsideCircle(point, circle, r) {
        if (r === 0) {
            return false
        }
        var dx = circle[0] - point[0]
        var dy = circle[1] - point[1]
        return dx * dx + dy * dy <= r * r
    }

    /**
     * 判断点是否在多边形内
     * @param point 要判断的点坐标
     * @param polygonPoints 多边形顶点坐标
     * @returns {boolean} 如果点在多边形内，则返回true，否则返回false
     */
    static pointInsidePolygon(point, polygonPoints) {
        let nCross = 0;
        for (let i = 0; i < polygonPoints.length; i++) {
            const polygonPoint1 = polygonPoints[i]; //当前节点
            const polygonPoint2 = polygonPoints[(i + 1) % polygonPoints.length]; //下一个节点
            //求解y=p.y与p1 p2的交点
            const x = point[0] || point.x || point.longitude;
            const y = point[1] || point.y || point.latitude;
            const x1 = polygonPoint1[0] || polygonPoint1.x || polygonPoint1.longitude;
            const y1 = polygonPoint1[1] || polygonPoint1.y || polygonPoint1.longitude;
            const x2 = polygonPoint2[0] || polygonPoint2.x || polygonPoint2.longitude;
            const y2 = polygonPoint2[1] || polygonPoint2.y || polygonPoint2.longitude;
            if (y1 == y2)
                continue;
            if (y < Math.min(y1, y2))
                continue;
            if (y > Math.max(y1, y2))
                continue;
            const x0 = (y - y1) * (x2 - x1) / (y2 - y1) + x1;
            if (x0 > x) {
                nCross++
            }
        }
        if (nCross % 2 == 1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *  通过两点，得到直线上的若干个点(三维点)
     * @param point1
     * @param point2
     * @param count
     * @returns {[]}
     */
    static pointToLine(point1, point2, count) {
        let x1 = point1[0];
        let y1 = point1[1];
        let z1 = point1[2] || 0;
        let x2 = point2[0];
        let y2 = point2[1];
        let z2 = point2[2] || 0;
        let points = [];
        for (let i = 0; i < count; i++) {
            let x = (x2 - x1) / count * i + x1;
            let y = (y2 - y1) / count * i + y1;
            let z = (z2 - z1) / count * i + z1;
            let point = {
                x: x,
                y: y,
                z: z
            };
            points.push(point);
        }
        return points;
    }

    /**
     *通过两点，得到抛物线上的若干个点(三维点)
     * @param options
     * @param options.pt1 {lon,lat}
     * @param options.pt2
     * @param options.height
     * @param options.num
     * @param resultOut
     * @returns {[]}
     */
    static pointToAcr(options, resultOut) {
        //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
        const h = options.height && options.height > 5000 ? options.height : 5000;
        const L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
        const num = options.num && options.num > 50 ? options.num : 50;
        const result = [];
        let dlt = L / num;
        if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {//以lon为基准
            const delLat = (options.pt2.lat - options.pt1.lat) / num;
            if (options.pt1.lon - options.pt2.lon > 0) {
                dlt = -dlt;
            }
            for (let i = 0; i < num; i++) {
                const tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                const lon = options.pt1.lon + dlt * i;
                const lat = options.pt1.lat + delLat * i;
                result.push([lon, lat, tempH]);
            }
        } else {//以lat为基准
            const delLon = (options.pt2.lon - options.pt1.lon) / num;
            if (options.pt1.lat - options.pt2.lat > 0) {
                dlt = -dlt;
            }
            for (let i = 0; i < num; i++) {
                const tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                const lon = options.pt1.lon + delLon * i;
                const lat = options.pt1.lat + dlt * i;
                result.push([lon, lat, tempH]);
            }
        }
        if (resultOut != undefined) {
            // eslint-disable-next-line no-param-reassign
            resultOut = result;
        }
        return result;
    }

    static distanceP2P(point1, point2) {
        const x1 = point1.x || point1.lon || point1[0];
        const y1 = point1.y || point1.lat || point1[1];
        const z1 = point1.z || point1.height || point1[2] || 0;
        const x2 = point2.x || point2.lon || point2[0];
        const y2 = point2.y || point2.lat || point2[1];
        const z2 = point2.z || point2.height || point2[2] || 0;
        const disx = (x2 - x1) * (x2 - x1);
        const disy = (y2 - y1) * (y2 - y1);
        const disz = (z2 - z1) * (z2 - z1);
        const distance = Math.sqrt(disx + disy + disz);
        return distance;
    }

    static getArea(points) {

        /*角度*/
        function Angle(p1, p2, p3) {
            var bearing21 = Bearing(p2, p1);
            var bearing23 = Bearing(p2, p3);
            var angle = bearing21 - bearing23;
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        }

        /*方向*/
        function Bearing(from, to) {
            var lat1 = from.lat * radiansPerDegree;
            var lon1 = from.lon * radiansPerDegree;
            var lat2 = to.lat * radiansPerDegree;
            var lon2 = to.lon * radiansPerDegree;
            var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
            if (angle < 0) {
                angle += Math.PI * 2.0;
            }
            angle = angle * degreesPerRadian;//角度
            return angle;
        }

        function distance(point1, point2) {
            var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
            var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
            /**根据经纬度计算出距离**/
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            return s;
        }
        var res = 0;
        //拆分三角曲面

        for (var i = 0; i < points.length - 2; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            var totalAngle = Angle(points[i], points[j], points[k]);


            var dis_temp1 = distance(positions[i], positions[j]);
            var dis_temp2 = distance(positions[j], positions[k]);
            res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
            console.log(res);
        }


        return (res / 1000000.0).toFixed(4);
    }
    static getRotateCenterPoint(center, point, angle) {
        //平面上一点x1, y1, 绕平面上另一点x2, y2顺时针旋转θ角度 ，怎么求旋转后的x1, y1对应的坐标x，y
        var x2 = center.x;
        var y2 = center.y;
        var x1 = point.x;
        var y1 = point.y;
        // var x = (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2;
        // var y = (y1 - y2) * Math.cos(angle) + (x1 - x2) * Math.sin(angle) + y2;
        var x=(x1-x2)*Math.cos(angle)+(y1 - y2) * Math.sin(angle) + x2;
        var y=(y1 - y2) * Math.sin(angle)-(x1-x2)*Math.cos(angle)+y2;
        return { x: x, y: y };
    }
    static getRotateAxis(point,angle){
        //坐标轴顺时针旋转得到点在新坐标系中的坐标
        return{
            x:(point.x*Math.cos(angle)-point.y*Math.sin(angle)).toFixed(2),
            y:(point.y*Math.cos(angle)+point.x*Math.sin(angle)).toFixed(2)
        }
    }
    //获取点point1绕点center的地面法向量旋转顺时针angle角度后新坐标
    static getRotateCenterPoint2(center, point1, angle) {
        // 计算center的地面法向量
        var chicB = Cesium.Cartographic.fromCartesian(center);
        chicB.height = 0;
        var dB = Cesium.Cartographic.toCartesian(chicB);
        var normaB = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(dB, center, new Cesium.Cartesian3()), new Cesium.Cartesian3());

        // 构造基于center的法向量旋转90度的矩阵
        var Q = Cesium.Quaternion.fromAxisAngle(normaB, Cesium.Math.toRadians(angle));
        var m3 = Cesium.Matrix3.fromQuaternion(Q);
        var m4 = Cesium.Matrix4.fromRotationTranslation(m3);

        // 计算point1点相对center点的坐标A1
        var A1 = Cesium.Cartesian3.subtract(point1, center, new Cesium.Cartesian3());

        //对A1应用旋转矩阵
        var p = Cesium.Matrix4.multiplyByPoint(m4, A1, new Cesium.Cartesian3());
        // 新点的坐标
        var pointNew = Cesium.Cartesian3.add(p, center, new Cesium.Cartesian3());

        return pointNew;
    }
   
}

export { GeoUtils }