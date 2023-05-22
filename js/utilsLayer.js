import * as _init from './init.js'
import * as _utils from './utils.js'

export function style(feature) {

    return {
        weight: 2,
        opacity: 1,
        color: '#ff0000',
        dashArray: '3',
        fillOpacity: 0.9,
        fillColor: '#ff0000'
    };
}


export function Reset(_map, _AfriMapRLayer, RegionsNetworkDSS) {

    _utils.removeOptionsNetworkLPS();
    _init.load_Regions_to_menu(RegionsNetworkDSS);

    var _jsonAfriMap = _init.load_data();

    var visibleLayerGroup = new L.FeatureGroup();
    for (var i = 0; i < _jsonAfriMap.features.length; i++) {

        var marker = new L.geoJson(_jsonAfriMap.features[i]);
        visibleLayerGroup.addLayer(marker);

    }

    _AfriMapRLayer.clearLayers();
    _map.removeLayer(_AfriMapRLayer);
    _AfriMapRLayer.addTo(_map);
    _AfriMapRLayer.addData(_jsonAfriMap);

    const bounds = visibleLayerGroup.getBounds();
    _map.fitBounds(bounds, {padding: [100, 100]});

}

export function zoomToSelectedLPS(_map, _LPSMapperLayer) {

    var _jsonAfriMap = _init.load_data();

    let SelectCountry = true;
    let SelectNetwork = true;
    let SelectLPS = true;

    let vSelectCountry;
    let vSelectNetwork;
    let vSelectLPS;

    if (document.getElementById("idSelectRegion").disabled) {
        SelectCountry = false;
    } else {
        SelectCountry = true;
        vSelectCountry = document.getElementById("idSelectRegion").value;
    }

    if (document.getElementById("idSelectNetwork").disabled || document.getElementById("idSelectNetwork").value === "null") {
        SelectNetwork = false;
    } else {
        SelectNetwork = true;
        vSelectNetwork = document.getElementById("idSelectNetwork").value;
    }

    if (document.getElementById("idSelectLPS").disabled || document.getElementById("idSelectLPS").value === "null") {
        SelectLPS = false;
    } else {
        SelectLPS = true;
        vSelectLPS = document.getElementById("idSelectLPS").value;
    }

    //console.log(SelectCountry + " " + SelectNetwork + " " + SelectLPS);

    var visibleLayerGroup = new L.FeatureGroup();

    for (var i = 0; i < _jsonAfriMap.features.length; i++) {

        var region = _jsonAfriMap.features[i].properties.Country;
        var Network = _jsonAfriMap.features[i].properties.Network;
        var LPS = _jsonAfriMap.features[i].properties.LPS;

        if (SelectCountry && SelectNetwork === false && SelectLPS === false) {

            if (region !== vSelectCountry) {
                delete _jsonAfriMap.features[i].geometry;
                delete _jsonAfriMap.features[i].properties;
            } else {

                var marker = new L.geoJson(_jsonAfriMap.features[i]);
                visibleLayerGroup.addLayer(marker);
            }
        }

        if (SelectCountry && SelectNetwork && SelectLPS === false) {

            if (region === vSelectCountry && Network === vSelectNetwork) {
                var marker = new L.geoJson(_jsonAfriMap.features[i]);
                visibleLayerGroup.addLayer(marker);
            } else {
                delete _jsonAfriMap.features[i].geometry;
                delete _jsonAfriMap.features[i].properties;
            }
        }

        if (SelectCountry && SelectNetwork && SelectLPS) {

            if (region === vSelectCountry && Network === vSelectNetwork && LPS === vSelectLPS) {
                var marker = new L.geoJson(_jsonAfriMap.features[i]);
                visibleLayerGroup.addLayer(marker);
            } else {
                delete _jsonAfriMap.features[i].geometry;
                delete _jsonAfriMap.features[i].properties;
            }
        }



    }


    _LPSMapperLayer.clearLayers();

    _map.removeLayer(_LPSMapperLayer);
    _LPSMapperLayer.addTo(_map);

    _LPSMapperLayer.addData(_jsonAfriMap);


    const bounds = visibleLayerGroup.getBounds();
    _map.fitBounds(bounds, {padding: [200, 200]});

    restyleLayer(_LPSMapperLayer);

}



export function gstDescriptiongLPS(evt) {

    let items_display = [
        ["Area", "Area (Km&sup2)"],
        ["Temp", "Average temperature (&#186;C)"],
        ["Country", "Country"],
        ["End", "When site surveillance ended"],
        ["Start", "When site surveillance began"],
        ["GADM_Name", "Administrative boundary name (GADM)"],
        ["GADM_level", "GADM level"],
        ["IMR", "Infant Mortality Rate/1000"],
        ["LPS", "LPS site name"],
        ["MMR", "Maternal Mortality Rate/100000"],
        ["Outcomes", "Main outcomes"],
        ["NNMR", "Neonatal Mortality Rate/1000"],
        ["Network", "Network"],
        ["Households", "Number of households under surveillance"],
        ["Villages", "Number of villages under surveillance"],
        ["Population", "People under surveillance"],
        ["Link_1", "Site-related publication 1"],
        ["Link_2", "Site-related publication 2"],
        ["SBR", "Still Birth Rate/1000"],
        ["Spatial", "Geographic level"],
        ["Temporal", "Frequency of visits (months)"],
        ["Theme", "Surveillance theme "],
        ["Total_potential_evapotranspiration", "Potential evapotranspiration (mm)"],
        ["Pre", "Precipitation (mm)"],
        ["Type", "Type"],
        ["Under_5_MR", "Under-5 Mortality rate/1000"],
        ["Website", "Website"]
    ];

    var tb_container = document.getElementById('tb_container');
    var tb_container_title = document.getElementById('tb_container_title');

    var csv = "feature, properties " + '\r\n';
    var tb_updated = `<table class="table table-sm table-hover mt-3" style="width:100%">`;

    var feature = evt.target.feature,
            props = feature.properties,
            attrs = Object.keys(props),
            attribute, value;

    tb_container_title.innerHTML = evt.target.feature.properties.LPS;

    for (var i = 0; i < attrs.length; i += 1) {

        attribute = attrs[i];

        let attribute_found = _utils.indexOf2dArray(items_display, attribute);

        //if (attribute === "OBJECTID") { continue; }

        if (attribute_found === false) {
            continue;
        }


        value = props[attribute];

        csv = csv + '' + attribute + ', ' + value;
        csv = csv + '\r\n';

        if (attribute === "Link_1" || attribute === "Link_2" || attribute === "Website") {
            if (value !== null) {
                value = '<a href="' + value + '" target="_blank">Link</a>';
            }
        }

//        if (attribute === "Area") {
//                value = parseFloat(value).toFixed(2);
//        }        

        if (_utils.isNumber(value) === true && _utils.number_decimal(value) === true) {
            value = parseFloat(value).toFixed(2);
        }

        if (value === null || value === 0) {
            continue;
        }

        tb_updated = tb_updated + `<tr>`;
        tb_updated = tb_updated + `<td style="width:60%"><strong>`;
        tb_updated = tb_updated + attribute_found;
        tb_updated = tb_updated + `</strong></td>`;
        tb_updated = tb_updated + `<td style="width:40%">`;
        tb_updated = tb_updated + value;
        tb_updated = tb_updated + `</td>`;

        tb_updated = tb_updated + `</tr>`;

    }

    tb_updated = tb_updated + `</table>`;
    tb_container.innerHTML = tb_updated;


    var dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent((csv));
    var dlAnchorElem = document.getElementById('DownloadFileCSV');
    dlAnchorElem.setAttribute("href", dataStr);

}


export function controlEnter(e, _map) {
    _map.dragging.disable();
}
export function controlLeave(_map) {
    _map.dragging.enable();
}


export function restyleLayer(_layer) {

    _layer.eachLayer(function (featureInstanceLayer) {

        var Opacity = document.getElementById("customRangeOpacity").value;
        var mFillColor = document.getElementById("idSelectColorePl").value;
        featureInstanceLayer.setStyle({
            fillColor: mFillColor,
            fillOpacity: Opacity,
            color: mFillColor,
            weight: 2,
            dashArray: '3'
        });
    });
}

