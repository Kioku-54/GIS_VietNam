const mapTilerKey = 'amGuErbOC2ms5tB5mW8e';

var mapView = new ol.View ({
    center: ol.proj.fromLonLat([108.0788141,15.8233579]),
    zoom: 6.3
});

var map = new ol.Map ({
    target: 'map',
    view: mapView
});

var osmTile = new ol.layer.Tile ({
    title: 'Open Street Map',
    source: new ol.source.OSM(),
    visible: true
});

var satelliteTile = new ol.layer.Tile({
    title: 'Satellite Map',
    source: new ol.source.XYZ({
        url: `https://api.maptiler.com/tiles/satellite-mediumres/{z}/{x}/{y}.jpg?key=${mapTilerKey}`,
    }),
    visible: false,
});

map.addLayer(osmTile);
map.addLayer(satelliteTile);

// Add Province Layer
var provinceTile = new ol.layer.Tile({
    title: "VietNam Province",
    source: new ol.source.TileWMS({
        url: "http://localhost:8080/geoserver/gis/wms",
        params: {'LAYERS':'gis:Provinces', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});

map.addLayer(provinceTile);

// Add District Layer
var districtsTile = new ol.layer.Tile({
    title: "VietNam District",
    source: new ol.source.TileWMS({
        url: "http://localhost:8080/geoserver/gis/wms",
        params: {'LAYERS':'gis:Districts', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});

map.addLayer(districtsTile);

// Add Ward Layer
var wardsTile = new ol.layer.Tile({
    title: "VietNam Wards",
    source: new ol.source.TileWMS({
        url: "http://localhost:8080/geoserver/gis/wms",
        params: {'LAYERS':'gis:Wards', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});

// map.addLayer(wardsTile);
// Basemap Controller
var toggleTilemap = (e) => {
    var tileList = ['Open Street Map', 'Satellite Map']
    var tileSelected = e.target.value;
    
    tileList.forEach(name => {
        var tilemap = map.getLayers().getArray().find(tile => tile.get('title') === name);
        if (name === tileSelected) {
            tilemap.setVisible(true);
        }
        else {
            tilemap.setVisible(false);
        }
    });
}

// Layer Controller
var toggleLayer = (e) => {
    var layrName = e.target.value;
    var currentStatus = e.target.checked;
    var lyrList = map.getLayers();

    lyrList.forEach(lyr => {
        if (layrName === lyr.get('title')) {
            lyr.setVisible(currentStatus);
        }
    });
}