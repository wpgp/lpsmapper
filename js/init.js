import * as _utils from './utils.js'

export function load_data() {

    var result = "";
    $.ajax({
        url: './data/LPS_sites.geojson',
        async: false,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            result = data;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        },
        complete: function () {
            //_utils.progressMenuOff();
        }
    });
    return result;
}


export function get_listRegionsNetworkLPS(d) {

    var RegionsArray = [];
    for (var i = 0; i < d.features.length; i++) {
        RegionsArray.push(d.features[i].properties.Country);
    }

    var Regions = RegionsArray.filter(_utils.onlyUnique);

    var result = {};

    for (var i = 0; i < Regions.length; i++) {
        var Region = Regions[i];
        var NetworkArray = [];
        for (var k = 0; k < d.features.length; k++) {
            if (d.features[k].properties.Country === Region) {
                NetworkArray.push(d.features[k].properties.Network);
            }
        }

        result[Region] = NetworkArray.filter(_utils.onlyUnique);
    }



    for (var i = 0; i < Regions.length; i++) {
        var Region = Regions[i];
        var objRegionsNetwork = result[Region];

        for (var k = 0; k < objRegionsNetwork.length; k++) {

            var Network = objRegionsNetwork[k];
            var LPSArray = [];
            for (var c = 0; c < d.features.length; c++) {
                if (d.features[c].properties.Country === Region && d.features[c].properties.Network === Network) {
                    LPSArray.push(d.features[c].properties.LPS);
                }
            }
            result[Region][Network] = LPSArray.filter(_utils.onlyUnique);
        }

    }
    return result;
}


export function load_Regions_to_menu(m) {


    var s = document.getElementById('idSelectRegion');

    for (var k in m) {
        s.innerHTML = s.innerHTML +
                '<option value="' + k + '">' + k + '</option>';
    }

}