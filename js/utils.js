export function indexOf2dArray(array2d, itemtofind, rindex) {

    let index = [].concat.apply([], ([].concat.apply([], array2d))).indexOf(itemtofind);

    if (index === -1) {
        return false;
    }

    let numColumns = array2d[0].length;

    let row = parseInt(index / numColumns);

    let col = index % numColumns;

    if (rindex) {
        return [row, col];
    } else {
        return(array2d[row][1]);
    }
}


export function display(s, k) {
    var x = document.getElementById(k);

    if (s === "show") {
        x.style.display = "block";
    } else if (s === "hide") {
        x.style.display = "none";
    } else {
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }
}

export function style(feature) {

    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: confirmedStyle(feature)
    };
}


export function highlightFeature(e) {

    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

}

export function resetHighlight(e, _layer) {
    _layer.resetStyle(e.target);
}

export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


export function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

export function removeOptionsNetworkLPS() {

    var Network = document.getElementById("idSelectNetwork");
    var LPS = document.getElementById('idSelectLPS');

    removeOptions(Network);
    removeOptions(LPS);

    Network.disabled = true;
    LPS.disabled = true;

}


export function update_Network_menu(r, d) {

    var s = document.getElementById('idSelectNetwork');

    removeOptions(s);

    s.disabled = false;

    s.innerHTML = s.innerHTML +
            '<option value="null" selected disabled>Select Network</option>';

    var Network = d[r];

    for (var i = 0; i < Network.length; i++) {
        s.innerHTML = s.innerHTML +
                '<option value="' + Network[i] + '">' + Network[i] + '</option>';
    }

}

export function update_LPS_menu(r, d) {

    var Region = document.getElementById("idSelectRegion").value;

    var s = document.getElementById('idSelectLPS');

    removeOptions(s);

    s.disabled = false;

    s.innerHTML = s.innerHTML +
            '<option value="null" selected disabled>Select LPS</option>';

    var LPSs = d[Region][r];

    for (var i = 0; i < LPSs.length; i++) {
        s.innerHTML = s.innerHTML +
                '<option value="' + LPSs[i] + '">' + LPSs[i] + '</option>';
    }

}


export function showLegend(tp) {
    console.log(tp);
    let title = "";
    let img_url = "";
    var html = "";

    if (tp === "esa-worldcover") {
        title = "Worldcover V2 2021";
        html = '<div style="width:200px">' + title + '</div>';
        html += '<table class="tableLegend discrete"><tr><td style="background: rgb(0, 100, 0);width:20px"></td><td class="legendLabel"><span class="legendText">Tree cover</span></td></tr><tr><td style="background: rgb(255, 187, 34);"></td><td class="legendLabel"><span class="legendText">Shrubland</span></td></tr><tr><td style="background: rgb(255, 255, 76);"></td><td class="legendLabel"><span class="legendText">Grassland</span></td></tr><tr><td style="background: rgb(240, 150, 255);"></td><td class="legendLabel"><span class="legendText">Cropland</span></td></tr><tr><td style="background: rgb(250, 0, 0);"></td><td class="legendLabel"><span class="legendText">Built-up</span></td></tr><tr><td style="background: rgb(180, 180, 180);"></td><td class="legendLabel"><span class="legendText">Bare / sparse vegetation</span></td></tr><tr><td style="background: rgb(240, 240, 240);"></td><td class="legendLabel"><span class="legendText">Snow and ice</span></td></tr><tr><td style="background: rgb(0, 100, 200);"></td><td class="legendLabel"><span class="legendText">Permanent water bodies</span></td></tr><tr><td style="background: rgb(0, 150, 160);"></td><td class="legendLabel"><span class="legendText">Herbaceous wetland</span></td></tr><tr><td style="background: rgb(0, 207, 117);"></td><td class="legendLabel"><span class="legendText">Mangroves</span></td></tr><tr><td style="background: rgb(250, 230, 160);"></td><td class="legendLabel"><span class="legendText">Moss and lichen</span></td></tr></table>';

    } else if (tp === "expansion-2030") {

        img_url = "https://sedac.ciesin.columbia.edu/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=lulc-global-grid-prob-urban-expansion-2030";
        title = "Urban Expansion to 2030";
        let w = 160;
        let h = 200;
        html = '<div style="width:200px">' + title + '</div>';

        html += '<img width="' + w + 'px" height="' + h + 'px" src="' + img_url + '">';
    }

    document.getElementById('legend_data_info').innerHTML = html;

    var x = document.getElementById("legend_data_info");
    x.style.display = "block";
}

export function hideLegend() {
    var x = document.getElementById("legend_data_info");
    x.style.display = "none";
}


export function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

export function number_decimal(n)
{
    var result = (n - Math.floor(n)) !== 0;

    if (result)
        return true;
    else
        return false;
}