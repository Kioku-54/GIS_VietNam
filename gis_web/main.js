const mapTilerKey = 'amGuErbOC2ms5tB5mW8e';

var mapView = new ol.View ({
    center: ol.proj.fromLonLat([108.0788141,15.8233579]),
    zoom: 6.3
});

var map = new ol.Map ({
    target: 'map',
    view: mapView,
    controls: []
});

// Add Tiles Map
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

// Add Layers
var provinceTile = new ol.layer.Tile({
    title: "VietNam Province",
    source: new ol.source.TileWMS({
        url: "http://localhost:8080/geoserver/gis/wms",
        params: {'LAYERS':'gis:Provinces', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});

var districtsTile = new ol.layer.Tile({
    title: "VietNam District",
    source: new ol.source.TileWMS({
        url: "http://localhost:8080/geoserver/gis/wms",
        params: {'LAYERS':'gis:Districts', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});

var wardsTile = new ol.layer.Tile({
    title: "VietNam Wards",
    source: new ol.source.TileWMS({
        url: "http://localhost:8080/geoserver/gis/wms",
        params: {'LAYERS':'gis:Wards', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});

map.addLayer(provinceTile);
map.addLayer(districtsTile);
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

// Popup Controller
var container = document.getElementById('popup');
var closer = document.getElementById('popup-closer');
var content = document.getElementById('popup-content');

var getStatusTile = (tile) => {
    return tile.getVisible();
};

var createUrlGetFeatureInfo = (currentTile, resolution, evt) => {
    return currentTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution, 'EPSG:3857', {
        'INFO_FORMAT': 'application/json',
        "property_name": 'Provinces'
    });
};

var handleContentPopup = (type, props) => {
    var content;
    if (type === 'districts') {
        content = `
            <div class='popup-title'>
                <h3>District Information</h3> 
            </div>
            <div class='popup-info'>
                <div class='popup-info-key'> Province Name: </div> 
                <div class='popup-info-value'>${props.name_1}</div>
            </div>
            <div class='popup-info'>
                <div class='popup-info-key'> District Name: </div>
                <div class='popup-info-value'>${props.name_2}</div>
            </div>
        `
    } else if (type === 'provinces') {
        content = `
            <div class='popup-title'>
                <h3>District Information</h3> 
            </div>
            <div class='popup-info'>
                <div class='popup-info-key'> Province Name: </div> 
                <div class='popup-info-value'>${props.name_1}</div>
            </div>
        `
    }
    return content
};

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    }
});

closer.onclick = () => {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

map.addOverlay(popup);

map.on('singleclick', (evt) => {
    content.innerHTML = '';
    popup.setPosition(undefined);
    var url = '';
    var resolution = map.getView().getResolution();
    var provTileStatus = getStatusTile(provinceTile);
    var distTileStatus = getStatusTile(districtsTile);

    if (distTileStatus) {
        url = createUrlGetFeatureInfo(districtsTile, resolution, evt);
    } else if (provTileStatus) {
        url = createUrlGetFeatureInfo(provinceTile, resolution, evt);
    }

    if (url !== '') {
        $.getJSON(url, (data) => {
            var feature = data.features[0];
            var props = feature?.properties;
            content.innerHTML = distTileStatus ? handleContentPopup('districts', props) : handleContentPopup('provinces', props);
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
});
// Home Control
var homeBtn = document.createElement('button');
homeBtn.innerHTML = '<img src="resources/image/home-icon.svg" alt=" " style="width:25px;height:25px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
homeBtn.className = 'my-btn';

var homeElement = document.createElement('div');
homeElement.className = 'home-btn-el';
homeElement.appendChild(homeBtn);

var homeControl = new ol.control.Control({
    element: homeElement
})

homeBtn.addEventListener('click', () => {
    location.href = "index.html"
});

map.addControl(homeControl)
// Mouse Position
var mousePosition = new ol.control.MousePosition({
    className: 'mouse-position',
    projection: 'EPSG:4326',
    coordinateFormat: (coordinate) => {
        return ol.coordinate.format(coordinate, '{y}, {x}', 6);
    }
})
map.addControl(mousePosition);

// Scale control
var scaleControl = new ol.control.ScaleLine({
    className: 'scale-line',
    bar: true,
    text:true
});
map.addControl(scaleControl);