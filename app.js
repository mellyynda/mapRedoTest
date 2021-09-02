"use strict";
// / <reference path="./node_modules/@types/jquery/index.d.ts" />
/// <reference path="./node_modules/@types/googlemaps/index.d.ts" />
var Mapping;
(function (Mapping) {
    var PositionShapeType;
    (function (PositionShapeType) {
        PositionShapeType[PositionShapeType["Circle"] = 0] = "Circle";
        PositionShapeType[PositionShapeType["Path"] = 1] = "Path";
    })(PositionShapeType = Mapping.PositionShapeType || (Mapping.PositionShapeType = {}));
    var GoogleMaps = /** @class */ (function () {
        function GoogleMaps(div) {
            var options = {
                center: { lat: 59, lng: 18 },
                zoom: 5
            };
            this.map = new google.maps.Map(div, options);
            this.bounds = new google.maps.LatLngBounds();
            this.mapObjects = {};
        }
        GoogleMaps.prototype.drawGroupedPath = function (segments, name, callback, pathColor) {
            if (pathColor === void 0) { pathColor = ""; }
            var addedObjects = new Array();
            for (var i = 0; i < segments.length; i++) {
                var path = [];
                var color = "#f032e6";
                for (var k = 0; k < segments[i].positions.length; k++) {
                    var p = segments[i].positions[k];
                    path.push(new google.maps.LatLng(p.latitude, p.longitude));
                    if (pathColor !== "")
                        color = pathColor;
                    else
                        color = p.positionType.strokeColor;
                }
                var mapPath = new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: color,
                    strokeOpacity: 0.9,
                    strokeWeight: 5,
                    map: this.map
                });
                addedObjects.push(mapPath);
            }
            this.mapObjects[name] = addedObjects;
            if (callback != null) {
                callback(name, segments.length > 0 ? segments[0].positions[0].positionType.strokeColor : "#000");
            }
        };
        GoogleMaps.prototype.drawPath = function (positions, name, callback, pathColor) {
            if (pathColor === void 0) { pathColor = ""; }
            var addedObjects = new Array();
            var path = [];
            var color = "#f032e6";
            for (var i = 0; i < positions.length; i++) {
                var p = positions[i];
                path.push(new google.maps.LatLng(p.latitude, p.longitude));
                if (pathColor !== "")
                    color = pathColor;
                else
                    color = p.positionType.strokeColor;
            }
            var mapPath = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 0.9,
                strokeWeight: 5,
                map: this.map
            });
            addedObjects.push(mapPath);
            this.mapObjects[name] = addedObjects;
            if (callback != null) {
                if (pathColor !== "") {
                    callback(name, pathColor);
                }
                else {
                    callback(name, positions.length > 0 ? positions[0].positionType.strokeColor : "#000");
                }
            }
        };
        GoogleMaps.prototype.drawSpeedViolations = function (speedingViolationsGrouped, name, callback, pathColor) {
            if (pathColor === void 0) { pathColor = ""; }
            var addedObjects = new Array();
            for (var k = 0; k < speedingViolationsGrouped.length; k++) {
                var positions = speedingViolationsGrouped[k].positions;
                var path = [];
                var color = "#f032e6";
                for (var i = 0; i < positions.length; i++) {
                    var p = positions[i];
                    path.push(new google.maps.LatLng(p.latitude, p.longitude));
                    if (pathColor !== "")
                        color = pathColor;
                    else
                        color = p.positionType.strokeColor;
                }
                var mapPath = new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: color,
                    strokeOpacity: 0.9,
                    strokeWeight: 5,
                    map: this.map
                });
                addedObjects.push(mapPath);
            }
            this.mapObjects[name] = addedObjects;
            if (callback != null) {
                if (pathColor !== "") {
                    callback(name, pathColor);
                }
                else {
                    callback(name, speedingViolationsGrouped.length > 0 ? speedingViolationsGrouped[0].positions[0].positionType.strokeColor : "#000");
                }
            }
        };
        GoogleMaps.prototype.drawPositions = function (positions, name, callback, clickCallback) {
            var addedObjects = new Array();
            for (var i = 0; i < positions.length; i++) {
                var p = positions[i];
                var latLng = new google.maps.LatLng(p.latitude, p.longitude);
                var circle = new google.maps.Circle({
                    center: latLng,
                    fillColor: p.positionType.fillColor,
                    fillOpacity: p.positionType.fillOpacity,
                    radius: p.positionType.size,
                    strokeColor: p.positionType.strokeColor,
                    strokeWeight: p.positionType.strokeWeight,
                    map: this.map
                });
                this.addClick(circle, p, clickCallback);
                addedObjects.push(circle);
                this.bounds.extend(latLng);
            }
            this.mapObjects[name] = addedObjects;
            if (positions.length > 1)
                this.map.fitBounds(this.bounds);
            if (callback != null) {
                callback(name, positions.length > 0 ? positions[0].positionType.strokeColor : "#000");
            }
        };
        GoogleMaps.prototype.addClick = function (circle, position, clickCallback) {
            google.maps.event.addListener(circle, "click", function () {
                console.log(position);
                if (clickCallback != null)
                    clickCallback(position);
            });
        };
        GoogleMaps.prototype.toggleObjects = function (name, show) {
            var objects = this.mapObjects[name];
            for (var i = 0; i < objects.length; i++) {
                var o = objects[i];
                if (show)
                    o.setMap(this.map);
                else
                    o.setMap(null);
            }
        };
        return GoogleMaps;
    }());
    Mapping.GoogleMaps = GoogleMaps;
})(Mapping || (Mapping = {}));
// let map: google.maps.Map;
// function initMap(): void {
//   map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// }
var initMap = function () {
    var elementById = document.getElementById("map");
    var map = new Mapping.GoogleMaps(elementById);
    map.drawPath([
        {
            latitude: 59.283877467729994,
            longitude: 17.932924859756948,
            timestamp: 0,
            positionType: {
                fillColor: "#",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Path,
                size: 16,
                strokeColor: "#fff",
                strokeWeight: 10
            }
        },
        {
            latitude: 59.28295679395333,
            longitude: 17.928461663956167,
            timestamp: 0,
            positionType: {
                fillColor: "#",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Path,
                size: 16,
                strokeColor: "#fff",
                strokeWeight: 10
            }
        },
        {
            latitude: 59.28168534637403,
            longitude: 17.924255960220815,
            timestamp: 0,
            positionType: {
                fillColor: "#",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Path,
                size: 16,
                strokeColor: "#fff",
                strokeWeight: 10
            }
        },
        {
            latitude: 59.2808523032471,
            longitude: 17.922453515762808,
            timestamp: 0,
            positionType: {
                fillColor: "#",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Path,
                size: 16,
                strokeColor: "#fff",
                strokeWeight: 10
            }
        },
        {
            latitude: 59.276730632097355,
            longitude: 17.916016214127065,
            timestamp: 0,
            positionType: {
                fillColor: "#",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Path,
                size: 16,
                strokeColor: "#fff",
                strokeWeight: 10
            }
        }
    ], 'test');
    map.drawPositions([
        {
            latitude: 59.283877467729994,
            longitude: 17.932924859756948,
            timestamp: 0,
            positionType: {
                fillColor: "transparent",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Circle,
                size: 16,
                strokeColor: "blue",
                strokeWeight: 10
            }
        },
        {
            latitude: 59.28295679395333,
            longitude: 17.928461663956167,
            timestamp: 0,
            positionType: {
                fillColor: "transparent",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Circle,
                size: 16,
                strokeColor: "red",
                strokeWeight: 10
            }
        },
        {
            latitude: 59.28168534637403,
            longitude: 17.924255960220815,
            timestamp: 0,
            positionType: {
                fillColor: "transparent",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Circle,
                size: 16,
                strokeColor: "green",
                strokeWeight: 10
            }
        },
        {
            latitude: 59.2808523032471,
            longitude: 17.922453515762808,
            timestamp: 0,
            positionType: {
                fillColor: "transparent",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Circle,
                size: 16,
                strokeColor: "lime",
                strokeWeight: 10
            }
        },
        {
            latitude: 59.276730632097355,
            longitude: 17.916016214127065,
            timestamp: 0,
            positionType: {
                fillColor: "transparent",
                fillOpacity: 1,
                shapeType: Mapping.PositionShapeType.Circle,
                size: 16,
                strokeColor: "pink",
                strokeWeight: 10
            }
        }
    ], 'test');
    // map.draw(
    //    [
    //        {
    //            latitude: 59,
    //            longitude: 18,
    //            timestamp: 0,
    //            positionType: {
    //                fillColor: "#",
    //                fillOpacity: 1,
    //                shapeType: Mapping.PositionShapeType.Circle,
    //                size: 16,
    //                strokeColor: "#000",
    //                strokeWeight: 10
    //            }
    //        }, {
    //            latitude: 60,
    //            longitude: 17,
    //            timestamp: 0,
    //            positionType: {
    //                fillColor: "#",
    //                fillOpacity: 1,
    //                shapeType: Mapping.PositionShapeType.Circle,
    //                size: 16,
    //                strokeColor: "#000",
    //                strokeWeight: 10
    //            }
    //        }
    //    ],
    //    "test");
};
window.initMap = initMap();
