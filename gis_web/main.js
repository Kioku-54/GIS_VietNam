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
    visible: true,
    source: new ol.source.OSM()
});

map.addLayer(osmTile);

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

// LayerSwitcher

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