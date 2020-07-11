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
var getSampleRowField = function (sampleRow, columnNames, columnName) {
  let colIdx = getColumnIndex(columnNames, columnName);

  if (colIdx !== -1) {
    return sampleRow[colIdx];
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
    sampleRow: [{}, {}, ...]
  }
 */
var generateMarkerBoxPreviewContent = function (markerBoxPreviewArgs, options = {}) {
  $html = ``;

  console.log(markerBoxPreviewArgs);

  if (markerBoxPreviewArgs.title?.length)
    $html += TEMPLATE_TITLE
      .replace(/MARKER_TITLE/g,
        getSampleRowField(
          markerBoxPreviewArgs.sampleRow,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.title
        )
      )
      .replace(/MARKER_URL/g,
        getSampleRowField(
          markerBoxPreviewArgs.sampleRow,
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
        getSampleRowField(
          markerBoxPreviewArgs.sampleRow,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.address
        )
      )
      .replace(/MARKER_CITY/g,
        getSampleRowField(
          markerBoxPreviewArgs.sampleRow,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.city
        )
      )
      .replace(/MARKER_STATE/g,
        getSampleRowField(
          markerBoxPreviewArgs.sampleRow,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.state
        )
      )
      .replace(/MARKER_ZIP/g,
        getSampleRowField(
          markerBoxPreviewArgs.sampleRow,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.zip
        )
      )
      .replace(/MARKER_COUNTRY/g,
        getSampleRowField(
          markerBoxPreviewArgs.sampleRow,
          markerBoxPreviewArgs.columnNames,
          markerBoxPreviewArgs.country
        )
      )
  }

  if (markerBoxPreviewArgs.email.length)
    $html += TEMPLATE_EMAIL.replace(/MARKER_EMAIL/g,
      getSampleRowField(
        markerBoxPreviewArgs.sampleRow,
        markerBoxPreviewArgs.columnNames,
        markerBoxPreviewArgs.email
      )
    )

  if (markerBoxPreviewArgs.phonenumber.length)
    $html += TEMPLATE_PHONENUMBER.replace(/MARKER_PHONENUMBER/g,
      getSampleRowField(
        markerBoxPreviewArgs.sampleRow,
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
              getSampleRowField(
                markerBoxPreviewArgs.sampleRow,
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
          getSampleRowField(
            markerBoxPreviewArgs.sampleRow,
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