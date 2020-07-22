/**
 * Convert CSV text to array.
 */
var csvToArray = function (a, b) {
  if (a) {
    for (var b = b || ",", d = RegExp("(\\" + b + '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\' + b + "\\r\\n]*)([^\\" + b + "\\r\\n]*))", "gi"), e = [[]], f = null, f = a.split("\n"), g = 0; g < f.length; g++) {
      if (g === 0)
        var h = (f[g].match(RegExp(b, "g")) || []).length;

      var k = (f[g].match(/"/g) || []).length
        , l = (f[g].match(RegExp(b, "g")) || []).length
        , n = 0
        , p = 0;
      if (g < f.length - 1 && g > 0)
        p = (f[g - 1].match(RegExp(b, "g")) || []).length,
          n = (f[g + 1].match(RegExp(b, "g")) || []).length;
      k > 0 && k % 2 != 0 && h === l && h === n && h === p && (k = f[g].replace(/"/g, ""),
        console.log("replaced " + f[g] + " with " + k),
        f[g] = k)
    }
    for (a = f.join("\n"); f = d.exec(a);)
      h = f[1],
        h.length && h != b && e.push([]),
        f[2] ? h = f[2].replace(RegExp('""', "g"), '"') : (h = f[3],
          f[4] && (f = RegExp("(\\" + b + '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\\' + b + "\\r\\n]*))", "gi").exec(f[0]),
            f[3] && (console.log("replaced " + h + " with " + f[3]),
              h = f[3]))),
        e[e.length - 1].push(h);
    return e
  }
};

/**
 * Convert Array to CSV Text
 */
var arrayToCsv = function (a, b) {
  for (var b = b || ",", d = "", e = 0; e < a.length; e++) {
    e && (d += "\n");
    for (var f = a[e], g = 0; g < f.length; g++) {
      g && (d += b);
      var h = "" + f[g];
      h.indexOf(b) > -1 && (h = '"' + h + '"');
      d += h
    }
  }
  return d
};

// get column idx
var getColumnIndex = function (columnNames, columnName) {
  for (let colIdx = 0; colIdx < columnNames.length; colIdx++) {
    if (columnName == columnNames[colIdx])
      return colIdx;
  }

  return -1;
};

// get sample row field
var getCellValuefromRow = function (rowData, columnNames, columnName) {
  let colIdx = getColumnIndex(columnNames, columnName);

  if (colIdx !== -1) {
    return rowData[colIdx];
  }

  return '';
};

/**
 * Generate MarkerBoxPreview Content
 * @param markerBoxPreviewArgs = {
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
    longitude: '',
    columnNames: [],
    rowData: [{}, {}, ...]
  }
 */
var generateMarkerBoxPreviewContent = function (markerBoxPreviewArgs, options = {}) {
  $html = ``;

  if (markerBoxPreviewArgs.title?.length)
    $html += TEMPLATE_TITLE
      .replace(/MARKER_TITLE/g,
        getCellValuefromRow(
          markerBoxPreviewArgs.rowData,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.title
        )
      )
      .replace(/MARKER_URL/g,
        getCellValuefromRow(
          markerBoxPreviewArgs.rowData,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.url
        )
      )

  $html += `
    <div class="markerSub">
      <div class="markerDetails">`;

  if (
    markerBoxPreviewArgs.address.length ||
    markerBoxPreviewArgs.city.length ||
    markerBoxPreviewArgs.zip.length ||
    markerBoxPreviewArgs.state.length ||
    markerBoxPreviewArgs.country.length
  ) {
    $html += TEMPLATE_LOCATION
      .replace(/MARKER_ADDRESS/g,
        getCellValuefromRow(
          markerBoxPreviewArgs.rowData,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.address
        )
      )
      .replace(/MARKER_CITY/g,
        getCellValuefromRow(
          markerBoxPreviewArgs.rowData,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.city
        )
      )
      .replace(/MARKER_STATE/g,
        getCellValuefromRow(
          markerBoxPreviewArgs.rowData,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.state
        )
      )
      .replace(/MARKER_ZIP/g,
        getCellValuefromRow(
          markerBoxPreviewArgs.rowData,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.zip
        )
      )
      .replace(/MARKER_COUNTRY/g,
        getCellValuefromRow(
          markerBoxPreviewArgs.rowData,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.country
        )
      )
  }

  if (markerBoxPreviewArgs.email.length)
    $html += TEMPLATE_EMAIL.replace(/MARKER_EMAIL/g,
      getCellValuefromRow(
        markerBoxPreviewArgs.rowData,
        markerBoxPreviewArgs.columnNames,
        markerBoxPreviewArgs.email
      )
    )

  if (markerBoxPreviewArgs.phonenumber.length)
    $html += TEMPLATE_PHONENUMBER.replace(/MARKER_PHONENUMBER/g,
      getCellValuefromRow(
        markerBoxPreviewArgs.rowData,
        markerBoxPreviewArgs.columnNames,
        markerBoxPreviewArgs.phonenumber
      )
    )

  if (markerBoxPreviewArgs.description.length) {
    if (markerBoxPreviewArgs.description == 'All Columns') {
      for (let colIdx = 0; colIdx < markerBoxPreviewArgs.columnNames.length; colIdx++) {
        let columnName = markerBoxPreviewArgs.columnNames[colIdx];

        switch (columnName) {
          case markerBoxPreviewArgs.address:
          case markerBoxPreviewArgs.city:
          case markerBoxPreviewArgs.state:
          case markerBoxPreviewArgs.zip:
          // case markerBoxPreviewArgs.group:
          case markerBoxPreviewArgs.title:
          case markerBoxPreviewArgs.description:
          case markerBoxPreviewArgs.country:
          case markerBoxPreviewArgs.url:
          case markerBoxPreviewArgs.imageURL:
          case markerBoxPreviewArgs.email:
          case markerBoxPreviewArgs.phonenumber:
            columnName = '';
            break;
        }

        if (columnName.length) {
          $html += TEMPLATE_DESCRIPTION
            .replace(/MARKER_DESCRIPTION_NAME/g, columnName)
            .replace(
              /MARKER_DESCRIPTION_VALUE/g,
              getCellValuefromRow(
                markerBoxPreviewArgs.rowData,
                markerBoxPreviewArgs.columnNames,
                columnName
              )
            )
        }
      }
    } else {
      $html += TEMPLATE_DESCRIPTION
        .replace(/MARKER_DESCRIPTION_NAME/g, markerBoxPreviewArgs.description)
        .replace(
          /MARKER_DESCRIPTION_VALUE/g,
          getCellValuefromRow(
            markerBoxPreviewArgs.rowData,
            markerBoxPreviewArgs.columnNames,
            markerBoxPreviewArgs.description
          )
        )
    }
  }

  $html += `
      </div>
    </div>`;

  return $html;
};

var mapThemeOptions = {
  simple: [{
    featureType: "road",
    elementType: "geometry",
    stylers: [{
      visibility: "simplified"
    }, {
      saturation: -50
    }]
  }, {
    featureType: "all",
    elementType: "all",
    stylers: [{
      saturation: -20
    }]
  }],
  midnight: [{
    featureType: "water",
    stylers: [{
      color: "#021019"
    }]
  }, {
    featureType: "landscape",
    stylers: [{
      color: "#08304b"
    }]
  }, {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{
      color: "#0c4152"
    }, {
      lightness: 5
    }]
  }, {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{
      color: "#000000"
    }]
  }, {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{
      color: "#0b434f"
    }, {
      lightness: 25
    }]
  }, {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{
      color: "#000000"
    }]
  }, {
    featureType: "road.arterial",
    elementType: "geometry.stroke",
    stylers: [{
      color: "#0b3d51"
    }, {
      lightness: 16
    }]
  }, {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{
      color: "#000000"
    }]
  }, {
    elementType: "labels.text.fill",
    stylers: [{
      color: "#ffffff"
    }]
  }, {
    elementType: "labels.text.stroke",
    stylers: [{
      color: "#000000"
    }, {
      lightness: 13
    }]
  }, {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{
      color: "#146474"
    }]
  }, {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{
      color: "#ffffff"
    }]
  }, {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [{
      color: "#000000"
    }]
  }, {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{
      color: "#144b53"
    }, {
      lightness: 14
    }, {
      weight: 1.4
    }]
  }],
  grayscale: [{
    featureType: "landscape",
    stylers: [{
      saturation: -100
    }, {
      lightness: 65
    }, {
      visibility: "on"
    }]
  }, {
    featureType: "poi",
    stylers: [{
      saturation: -100
    }, {
      lightness: 51
    }, {
      visibility: "simplified"
    }]
  }, {
    featureType: "road.highway",
    stylers: [{
      saturation: -100
    }, {
      visibility: "simplified"
    }]
  }, {
    featureType: "road.arterial",
    stylers: [{
      saturation: -100
    }, {
      lightness: 30
    }, {
      visibility: "on"
    }]
  }, {
    featureType: "road.local",
    stylers: [{
      saturation: -100
    }, {
      lightness: 40
    }, {
      visibility: "on"
    }]
  }, {
    featureType: "transit",
    stylers: [{
      saturation: -100
    }, {
      visibility: "simplified"
    }]
  }, {
    featureType: "administrative.province",
    stylers: [{
      visibility: "on"
    }]
  }, {
    featureType: "water",
    elementType: "labels",
    stylers: [{
      visibility: "on"
    }, {
      lightness: -25
    }, {
      saturation: -100
    }]
  }, {
    featureType: "water",
    elementType: "geometry",
    stylers: [{
      hue: "#ffff00"
    }, {
      lightness: -25
    }, {
      saturation: -97
    }]
  }],
  subtle: [{
    featureType: "poi",
    stylers: [{
      visibility: "off"
    }]
  }, {
    stylers: [{
      saturation: -70
    }, {
      lightness: 37
    }, {
      gamma: 1.15
    }]
  }, {
    elementType: "labels",
    stylers: [{
      gamma: 0.26
    }, {
      visibility: "off"
    }]
  }, {
    featureType: "road",
    stylers: [{
      lightness: 0
    }, {
      saturation: 0
    }, {
      hue: "#ffffff"
    }, {
      gamma: 0
    }]
  }, {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{
      visibility: "off"
    }]
  }, {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{
      lightness: 20
    }]
  }, {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{
      lightness: 50
    }, {
      saturation: 0
    }, {
      hue: "#ffffff"
    }]
  }, {
    featureType: "administrative.province",
    stylers: [{
      visibility: "on"
    }, {
      lightness: -50
    }]
  }, {
    featureType: "administrative.province",
    elementType: "labels.text.stroke",
    stylers: [{
      visibility: "off"
    }]
  }, {
    featureType: "administrative.province",
    elementType: "labels.text",
    stylers: [{
      lightness: 20
    }]
  }],
  paledawn: [{
    featureType: "water",
    stylers: [{
      visibility: "on"
    }, {
      color: "#acbcc9"
    }]
  }, {
    featureType: "landscape",
    stylers: [{
      color: "#f2e5d4"
    }]
  }, {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{
      color: "#c5c6c6"
    }]
  }, {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{
      color: "#e4d7c6"
    }]
  }, {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{
      color: "#fbfaf7"
    }]
  }, {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{
      color: "#c5dac6"
    }]
  }, {
    featureType: "administrative",
    stylers: [{
      visibility: "on"
    }, {
      lightness: 33
    }]
  }, {
    featureType: "road"
  }, {
    featureType: "poi.park",
    elementType: "labels",
    stylers: [{
      visibility: "on"
    }, {
      lightness: 20
    }]
  }, {}, {
    featureType: "road",
    stylers: [{
      lightness: 20
    }]
  }],
  bluewater: [{
    featureType: "water",
    stylers: [{
      color: "#46bcec"
    }, {
      visibility: "on"
    }]
  }, {
    featureType: "landscape",
    stylers: [{
      color: "#f2f2f2"
    }]
  }, {
    featureType: "road",
    stylers: [{
      saturation: -100
    }, {
      lightness: 45
    }]
  }, {
    featureType: "road.highway",
    stylers: [{
      visibility: "simplified"
    }]
  }, {
    featureType: "road.arterial",
    elementType: "labels.icon",
    stylers: [{
      visibility: "off"
    }]
  }, {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{
      color: "#444444"
    }]
  }, {
    featureType: "transit",
    stylers: [{
      visibility: "off"
    }]
  }, {
    featureType: "poi",
    stylers: [{
      visibility: "off"
    }]
  }],
  printfriendly: [{
    featureType: "administrative",
    elementType: "all",
    stylers: [{
      visibility: "simplified"
    }]
  }, {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{
      visibility: "simplified"
    }, {
      color: "#fcfcfc"
    }]
  }, {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{
      visibility: "simplified"
    }, {
      color: "#ffffff"
    }]
  }, {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{
      visibility: "simplified"
    }, {
      color: "#fcfcfc"
    }]
  }, {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{
      visibility: "simplified"
    }, {
      color: "#dddddd"
    }]
  }, {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{
      visibility: "simplified"
    }, {
      color: "#dddddd"
    }]
  }, {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{
      visibility: "simplified"
    }, {
      color: "#eeeeee"
    }]
  }, {
    featureType: "water",
    elementType: "geometry",
    stylers: [{
      visibility: "simplified"
    }, {
      color: "#dddddd"
    }]
  }]
};