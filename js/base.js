import * as _init from './init.js'
import * as _utils from './utils.js'
import * as _utilsLayer from './utilsLayer.js'

        var basemaps = {
            "OpenStreetMaps": L.tileLayer(
                    "https://cartodb-basemaps-b.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png", {
                        attribution: "<a href='http://www.esri.com/'>Esri</a>, HERE, Garmin, (c) OpenStreetMap",
                        minZoom: 1,
                        maxZoom: 14,
                        id: "osm.streets"
                    }
            )
        };

var mapOptions = {
    zoomControl: false,
    attributionControl: false,
    center: [6.465422, 3.406448],
    zoom: 3,
    maxZoom: 11,
    layers: [basemaps.OpenStreetMaps]
};


var map = L.map("map", mapOptions);
map.invalidateSize();


var CopyrightLayer = L.control({position: 'bottomleft'});

CopyrightLayer.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'Copyright_data');
    div.innerHTML += '<div id="Copyright_info"><p class="pt-2"><small>&nbsp;&copy; 2023 LPS Mapper - <a href="https://sdi.worldpop.org/" style="text-decoration: none;"> Website built by WorldPop SDI</a></small></p></div>';
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
};

CopyrightLayer.addTo(map);

var scaleLayer = L.control.scale({position: 'bottomleft'});
scaleLayer.addTo(map);


L.control.zoom({
    position: 'bottomleft'
}).addTo(map);

var LPSMapperLayer = L.geoJson(null, {
    style: function (feature) {
        _utilsLayer.restyleLayer(LPSMapperLayer);
    },
    onEachFeature: function (feature, layer) {

        layer.on({
            mouseover: _utils.highlightFeature,
            mouseout: function (e) {
                _utils.resetHighlight(e.target, LPSMapperLayer);
            },
            click: function (e) {
                _utilsLayer.gstDescriptiongLPS(e);
                _utils.display("show", "controlPanelLeftID");
            }
        });
    }.bind(this)
}).addTo(map);


var wmsLayerOSMLanduse = L.tileLayer.wms('https://services.terrascope.be/wms/v2', {
    layers: 'WORLDCOVER_2021_MAP',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


var wmsLayerCIESINLanduse = L.tileLayer.wms('https://sedac.ciesin.columbia.edu/geoserver/wms', {
    layers: 'lulc:lulc-global-grid-prob-urban-expansion-2030'
});


var legendLayer = L.control({position: 'bottomright'});

legendLayer.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend_data');
    div.innerHTML += '<div id="legend_data_info"></div>';
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
};

legendLayer.addTo(map);

let jsonLPSMapper = _init.load_data();

console.log(jsonLPSMapper);

LPSMapperLayer.addData(jsonLPSMapper);

var RegionsNetworkLPS = _init.get_listRegionsNetworkLPS(jsonLPSMapper);




_init.load_Regions_to_menu(RegionsNetworkLPS);


// create the control
var controlPanelRight = L.control({position: 'topright'});

controlPanelRight.onAdd = function (map) {
    this._div = L.DomUtil.get('controlPanelRightID');
    return this._div;
};
controlPanelRight.addTo(map);

// create the control
var controlPanelLeft = L.control({position: 'topleft'});

controlPanelLeft.onAdd = function (map) {
    this._div = L.DomUtil.get('controlPanelLeftID');
    return this._div;
};
controlPanelLeft.addTo(map);


map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';
var cartocdn = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    pane: 'labels'
}).addTo(map);



$('#idSelectRegion').change(function () {
    _utils.removeOptionsNetworkLPS();
    _utils.update_Network_menu($(this).val(), RegionsNetworkLPS);
    _utilsLayer.zoomToSelectedLPS(map, LPSMapperLayer);
    _utils.display("hide", "controlPanelLeftID");
});


$('#idSelectNetwork').change(function () {
    _utils.update_LPS_menu($(this).val(), RegionsNetworkLPS);
    _utilsLayer.zoomToSelectedLPS(map, LPSMapperLayer);
    _utils.display("hide", "controlPanelLeftID");
});


$('#idSelectLPS').change(function () {
    _utilsLayer.zoomToSelectedLPS(map, LPSMapperLayer);
});


$('#btnReset').click(function () {
    _utilsLayer.Reset(map, LPSMapperLayer, RegionsNetworkLPS);
    _utils.display("hide", "controlPanelLeftID");

});

$('#btnCloseLeftPanel').click(function () {
    _utils.display("hide", "controlPanelLeftID");
});


$('#chCountryLabels').change(function () {
    if ($(this).is(":checked")) {
        map.addLayer(cartocdn);
    } else {
        map.removeLayer(cartocdn);
    }
});


$('#DownloadFileCSV').click(function (e) {
    var fname_download = "download_DSS.csv";
    var dlAnchorElem = document.getElementById('DownloadFileCSV');
    dlAnchorElem.setAttribute("download", fname_download);
});


$('#SwitchCheckOSMLand').click(function () {

    document.getElementById('SwitchCheckUrbanExpansion').checked = false;
    map.removeLayer(wmsLayerCIESINLanduse);
    if ($(this).is(":checked")) {
        let url_link = "https://services.terrascope.be/wms/v2?service=WMS&version=1.3.0&request=GetLegendGraphic&format=image%2Fpng&width=200&height=400&layer=osmlanduse:osm_lulc&legend_options=fontAntiAliasing:true;dpi:300;bgColor:0xFF0000";
        _utils.showLegend("esa-worldcover");
        wmsLayerOSMLanduse.addTo(map);
    } else {
        _utils.hideLegend();
        map.removeLayer(wmsLayerOSMLanduse);
    }
});

$('#SwitchCheckUrbanExpansion').change(function () {

    document.getElementById('SwitchCheckOSMLand').checked = false;
    map.removeLayer(wmsLayerOSMLanduse);
    if ($(this).is(":checked")) {
        let url_link = "https://sedac.ciesin.columbia.edu/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=lulc-global-grid-prob-urban-expansion-2030";
        _utils.showLegend("expansion-2030");
        wmsLayerCIESINLanduse.addTo(map);
    } else {
        _utils.hideLegend();
        map.removeLayer(wmsLayerCIESINLanduse);
    }
});



$('#customRangeOpacity').change(function () {

    _utilsLayer.restyleLayer(LPSMapperLayer);
});

$('#idSelectColorePl').change(function () {

    _utilsLayer.restyleLayer(LPSMapperLayer);
});

L.DomEvent.disableClickPropagation(controlPanelLeftID);
L.DomEvent.disableClickPropagation(controlPanelRightID);
L.DomEvent.disableScrollPropagation(controlPanelLeftID);
L.DomEvent.disableScrollPropagation(controlPanelRightID);

