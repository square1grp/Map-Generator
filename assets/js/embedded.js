(function ($) {
  var colorPallets = ["red", "blue", "green", "yellow", "purple", "paleblue", "orange"]
  var groupColorsHex = ["#fd7569", "#6996fd", "#95ea7b", "#fdeb5a", "#c699fd", "#bae1fd", "#fb8b07"];

  // get map marker Icon
  var getMapMarkerIcon = function (colorPallet, text = null, pinType) {
    return text ? `https://staticnode.batchgeo.com/marker/svg?type=${pinType}Text&size=20&fill=${colorPallet}&text=${text}` : `https://staticnode.batchgeo.com/marker/svg?type=${pinType}Plain&size=20&fill=${colorPallet}`
  };

  window.markers = [];

  var markerBoxPreviewDefaultArgs = {
    address: '',
    city: '',
    state: '',
    zip: '',
    group: '',
    title: '',
    description: '',
    country: '',
    url: 'javascript:void(0)',
    imageURL: '',
    email: '',
    phonenumber: '',
    latitude: '',
    longitude: ''
  };

  // get marker box content
  var getMarkerBoxContent = function (rowData, distance) {
    let markerBoxPreviewArgs = {
      ...markerBoxPreviewDefaultArgs,
      address: col_address,
      city: col_city,
      state: col_state,
      zip: col_zip,
      country: col_country,
      // group: $("#group_sel").val(),
      title: col_title,
      description: col_description,
      url: col_url,
      imageURL: col_imageURL,
      email: col_email,
      phonenumber: col_phonenumber,
      latitude: col_latitude,
      longitude: col_longitude,
      showDistance: showDistance,
      distance: distance,
      hideMapAddresses: hideMapAddresses,
      newWindowLink: newWindowLink,
      columnNames: columnNames,
      rowData: rowData
    };

    return generateMarkerBoxPreviewContent(markerBoxPreviewArgs);
  };

  // add markers
  var addMarkers = function () {
    let groupList = rowDataList.map(function (rowData) {
      return `${getCellValuefromRow(rowData, columnNames, col_group)}`.trim();
    });

    geoList.forEach(function (geo, geoIdx) {
      let groupName = groupList[geoIdx];

      let labelText = '';
      if (labelType == "letters")
        labelText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[geoIdx % 26];
      else if (labelType == "numbers")
        labelText = geoIdx + 1;

      let mapObj = !isClustering ? { map } : {}

      let marker = new google.maps.Marker({
        position: geo.geometry.location,
        ...mapObj,
        icon: {
          url: getMapMarkerIcon(groupColors[groupName], labelText),
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      let markerAddress = geoAddressList[geoIdx];
      let markerTitle = '';
      let markerRowData = {};

      rowDataList.forEach(function (rowData) {

        let address = getCellValuefromRow(rowData, columnNames, col_address);
        let city = getCellValuefromRow(rowData, columnNames, col_city);
        let state = getCellValuefromRow(rowData, columnNames, col_state);
        let zip = getCellValuefromRow(rowData, columnNames, col_zip);
        let country = getCellValuefromRow(rowData, columnNames, col_country);
        let title = getCellValuefromRow(rowData, columnNames, col_title);

        rowAddress = `${address}, ${city}, ${state} ${zip} ${country}`.trim();

        if (rowAddress == markerAddress) {
          markerRowData = rowData;
          markerTitle = title;
        }
      });

      marker.hoverInfoWindow = new google.maps.InfoWindow({
        disableAutoPan: true,
        content: `
          <div class="map-marker-info hover-info">
            <p style="margin: 0;"><b>${markerTitle}</b><br/>${!hideMapAddresses ? markerAddress : ''}</p>
          </div>
        `
      });

      let distance = getDistance(dist_sel, geoList[0].geometry.location, geoList[geoIdx].geometry.location)

      marker.clickInfoWindow = new google.maps.InfoWindow({
        disableAutoPan: true,
        content: `
          <div class="map-marker-info click-info">
            <a class="close" onClick="closeMarkerInfoWindow(${geoIdx})">&times;</a>
            <div class="content">${getMarkerBoxContent(markerRowData, distance)}</div>
          </div>
        `
      });

      marker.addListener("mouseover", function () {
        marker.hoverInfoWindow.open(marker.get("map"), marker);
      });

      marker.addListener("mouseout", function () {
        marker.hoverInfoWindow.close();
      });

      marker.addListener("click", function () {
        marker.setIcon({
          url: marker.icon.url,
          scaledSize: new google.maps.Size(50, 50)
        });

        marker.clickInfoWindow.open(marker.get("map"), marker);
      });

      window.markers.push({ group: groupName, marker: marker });
    });

    if (isClustering) {
      new MarkerClusterer(map, window.markers.map(marker => marker.marker), { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' })
    }
  };


  // update map legends
  var updateMapLegends = function () {
    $("#legDiv div.columnName").text(col_group);
    $("#legDiv ul.groupList li").remove();

    Object.keys(groupColors).forEach(function (groupName) {
      $("#legDiv ul.groupList").append(
        TEMPLATE_GROUP_LEGEND.replace(/GROUP_IMAGE_URL/g, getMapMarkerIcon(groupColors[groupName])).replace(/GROUP_NAME/g, groupName)
      );
    });

    $("#legDiv ul.groupList li")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();

        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
        } else {
          $(this).addClass("active").removeClass("inactive");
        }

        if ($("#legDiv ul.groupList li.active").length) {
          $("#legDiv ul.groupList li:not(.active)").addClass("inactive");
        } else {
          $("#legDiv ul.groupList li:not(.active)").removeClass("inactive");
        }

        let activeGroupNames = [];
        $.each($("#legDiv ul.groupList li.active"), function () {
          activeGroupNames.push($(this).text())
        });

        window.markers.forEach(function (marker) {
          if (!activeGroupNames.length || activeGroupNames.includes(marker.group)) {
            marker.marker.setMap(map);
          } else {
            marker.marker.setMap(null);
          }
        });
      });

    $("#legWrap").show();
  };

  var initMap = function (center) {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: center,
      mapTypeId: mapTypeId,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      styles: mapThemeOptions[mapType]
    });

    isMapAvaialble = true;

    addMarkers();

    $("#map").show();
  };

  initMap(getCenter(geoList));
  updateMapLegends();
})(jQuery);