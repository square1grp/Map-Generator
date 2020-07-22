(function ($) {
  var map = null;
  // source Ele (textarea)
  var sourceEle = document.getElementById("sourceData");
  // column names
  var columnNames = [];
  var sampleRow = [];
  var $selectEleList = [{
    selector: "#address_sel",
    default: "Address"
  }, {
    selector: "#city_sel",
    default: "City"
  }, {
    selector: "#state_sel",
    default: "State"
  }, {
    selector: "#zip_sel",
    default: "Zipcode"
  }, {
    selector: "#group_sel",
    default: "Group"
  }, {
    selector: "#title_sel",
    default: "Name"
  }, {
    selector: "#desc_sel",
    default: ""
  }, {
    selector: "#country_sel",
    default: "Country"
  }, {
    selector: "#descURL_sel",
    default: "URL"
  }, {
    selector: "#descIMG_sel",
    default: "Image URL"
  }, {
    selector: "#email_sel",
    default: "Email"
  }, {
    selector: "#phonenumber_sel",
    default: "Phone Number"
  }, {
    selector: "#lat_sel",
    default: "Latitude"
  }, {
    selector: "#lon_sel",
    default: "Longitude"
  }];
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
  var columnCount = 0, rowCount = 0;
  var groupColors = {};
  var colorPallets = ["red", "blue", "green", "yellow", "purple", "paleblue", "orange"]
  var groupColorsHex = ["#fd7569", "#6996fd", "#95ea7b", "#fdeb5a", "#c699fd", "#bae1fd", "#fb8b07"];
  var geoAddressList = [];
  var geoList = [];
  window.markers = [];
  var isMapAvaialble = false;

  // get lines of csv
  var getRowDataList = function (sourceEle, updateGlobalVars = true) {
    let csvArray = csvToArray(sourceEle.value, String.fromCharCode(9));

    let commentLineCount = 0;
    while (csvArray[commentLineCount][0].substring(0, 1) === "#")
      commentLineCount++;

    // if csvArray length is 1, all are location data
    if (csvArray.length === 1) {
      let headerArray = Array(csvArray[0].length - 1).fill("")
      csvArray.unshift(["Location"].concat(headerArray))
    }

    if (updateGlobalVars) {
      // populate column names and sample row
      columnNames = csvArray[commentLineCount];
      sampleRow = csvArray[commentLineCount + 1];
    }

    return csvArray.slice(commentLineCount + 1, csvArray.length);
  };

  // generate table from textarea
  var MapGeneratorTableize = function (sourceEle) {
    let csvArray = csvToArray(sourceEle.value, String.fromCharCode(9));
    let rowDataList = getRowDataList(sourceEle);

    let $tableWrapper = $("<div />", {
      "class": "tableize tableize-wrapper"
    });
    let $table = $("<table />", {
      "class": "tableize tableize-table"
    });

    if (sourceEle.$tableWrapper)
      sourceEle.$tableWrapper.remove();

    sourceEle.$tableWrapper = $tableWrapper;

    // Add Header
    let $tr = $("<tr />");
    columnNames.forEach(function (a) {
      $("<th />", {
        html: a
      }).appendTo($tr)
    });
    $table.append($tr)

    // Add content
    columnCount = columnNames.length;
    rowCount = rowDataList.length;

    rowDataList.forEach(function (lineArray) {
      $table.append($("<tr />").append(lineArray.map(function (a) {
        return $("<td />", {
          html: a.length ? a : " "
        })
      })))
    });

    $tableWrapper.append($table)

    $tableWrapper[0].el = sourceEle;

    // overlay text
    let $overlayTxt = $("<em />", {
      "class": "tableize tableize-overlay",
      html: sourceEle.title || "click to copy/paste"
    });

    $tableWrapper.append($overlayTxt);

    $overlayTxt[0].tbl = $table;

    // add table before text area
    $(sourceEle).hide().before($tableWrapper);
    $("#deleteMe").remove();

    // events for table wrapper
    $($tableWrapper)
      .on("click contextmenu focus", function (e) {
        _sourceEle = e.currentTarget.el;
        _sourceEle.tbl = null;
        $(_sourceEle).show();
        _sourceEle.select();
        $(this).remove()
      })
      .on("scroll", function () {
        $($overlayTxt).css("top", $(this).scrollTop())
      });

    // paste event
    $(document).on("paste", function (e) {
      try {
        let sourceData = e.originalEvent.clipboardData.getData("Text");
        if (sourceEle.value != sourceData)
          return sourceEle.value = sourceData,
            c(sourceEle),
            unValidateSource(),
            !1
      } catch (err) {
        console.log("clipboard access failed")
      }
      return !0
    });

    sourceEle.charCount = sourceEle.value.length;
    if (typeof $(sourceEle).addEventListener == "undefined") {
      $(sourceEle)
        .off("keyup mouseup")
        .on("keyup mouseup", function (e) {
          if (Math.abs(e.target.charCount - e.target.value.length) > 10) {
            MapGeneratorTableize(e.target);
            unValidateSource();
          }
          e.target.charCount = e.target.value.length
        })
        .off("blur")
        .on("blur", function (e) {
          MapGeneratorTableize(e.target)
        })
        .toggleClass("tableize-example", csvArray[0][0] === "Example Address")
    }
  };

  // init source data
  var unValidateSource = function () {
    $("#validate_status, #fields, #advancedOptions").slideUp();

    $.each([{ selector: "#clustering_icon_sel", default: null }].concat($selectEleList), function (sel_idx, $selectEle) {
      $($selectEle.selector).find("option:not(:first-child)").remove()
    });

    $(".map-generator #fields .map-options-col .markerLabel .markerContent > *").remove();
  };

  // get marker box content
  var getMarkerBoxContent = function (rowData) {
    let markerBoxPreviewArgs = {
      ...markerBoxPreviewDefaultArgs,
      address: $("#address_sel").val(),
      city: $("#city_sel").val(),
      state: $("#state_sel").val(),
      zip: $("#zip_sel").val(),
      country: $("#country_sel").val(),
      // group: $("#group_sel").val(),
      title: $("#title_sel").val(),
      description: $("#desc_sel").val(),
      url: $("#descURL_sel").val(),
      imageURL: $("#descIMG_sel").val(),
      email: $("#email_sel").val(),
      phonenumber: $("#phonenumber_sel").val(),
      latitude: $("#lat_sel").val(),
      longitude: $("#lon_sel").val(),
      columnNames: columnNames,
      rowData: rowData
    };

    return generateMarkerBoxPreviewContent(markerBoxPreviewArgs);
  };

  // update marker box preview
  var updateMarkerBoxPreview = function () {
    let $html = getMarkerBoxContent(sampleRow);

    $(".map-generator #fields .map-options-col .markerLabel .markerContent").html($html);
  };

  // get groups
  var getAllGroups = function () {
    let groups = [];
    let groupColumnName = $("#group_sel").val();
    let columnIdx = getColumnIndex(columnNames, groupColumnName);
    let rowDataList = getRowDataList(document.getElementById("sourceData"));

    $.each(rowDataList, function (rowIdx, rowData) {
      if (!groups.includes(rowData[columnIdx]))
        groups.push(rowData[columnIdx]);
    });

    return groups;
  };

  // update color options
  var updateColorOptions = function () {
    groupColors = {};

    let groupColumnName = $("#group_sel").val();

    if (groupColumnName == 'marker')
      return false;

    let groups = getAllGroups();

    let $table = $(".map-generator #fields .map-options-3-col .map-options-col table");

    $table.find("tbody tr").remove();

    $.each(groups, function (groupIdx, group) {
      $table.append($("<tr />").append([
        `<div style="background-color: ${groupColorsHex[groupIdx % groupColorsHex.length]};">&nbsp;</div>`,
        group
      ].map(function (html) {
        return $("<td />", { html })
      })))

      groupColors[group] = colorPallets[groupIdx % groupColorsHex.length];

      $table.find(`tbody tr:nth-child(${groupIdx + 1}) td:first-child`)
        .off('hover')
        .on({
          mouseenter: function () {
            $(".map-generator #fields .map-options-3-col .map-options-col .col-hover").removeClass("col-hover");
            $(this).addClass("col-hover");
            $(".map-generator #fields .map-options-3-col .map-options-col .color-picker-wrapper").css({
              top: `${23 * groupIdx}px`
            }).show();
          }
        });
    });
  };

  // get map marker Icon
  var getMapMarkerIcon = function (colorPallet, text = null) {
    let pinType = $(".map-generator #fields .map-options-col.marker-shapes .option-images .option-image-selected").attr("pin-type");
    return text ? `https://staticnode.batchgeo.com/marker/svg?type=${pinType}Text&size=20&fill=${colorPallet}&text=${text}` : `https://staticnode.batchgeo.com/marker/svg?type=${pinType}Plain&size=20&fill=${colorPallet}`
  };

  // get map type
  var getMapThemeOptions = function () {
    let mapType = $(".map-generator #fields .map-options-col.map-styles .option-images .option-image-selected").attr("map-type");

    return mapThemeOptions[mapType];
  };

  // update map legends
  var updateMapLegends = function () {
    let groupColumnName = $("#group_sel").val();

    $("#legDiv div.columnName").text(groupColumnName);
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
  };

  // validate source data
  var validateSource = function () {
    $("#num_of_columns").text(columnCount);
    $("#num_of_rows").text(rowCount);

    $.each([{ selector: "#clustering_icon_sel", default: null }].concat($selectEleList), function (sel_idx, $selectEle) {
      $.each(columnNames, function (col_idx, columnName) {
        let selected = "";

        if (columnName == $selectEle.default)
          selected = "selected";

        $($selectEle.selector).append(`<option value="${columnName}" ${selected}>${columnName}</option>`);
      });
    });

    $("#group_sel")
      .off("change")
      .on("change", function () {
        updateColorOptions();
        updateMapLegends();

        window.markers.forEach(function (marker) {
          marker.marker.setMap(null);
        });
        window.markers = [];
        addMarkers();
      });

    updateMarkerBoxPreview();
    updateColorOptions();
    updateMapLegends();
  };

  var dragFileCancelEvent = function (e) {
    e.stopPropagation();
    e.preventDefault()
  }

  var dragFileStart = function (e) {
    dragFileCancelEvent(e);
    let $tableWrapper = $("#sourceWrap div.tableize");
    let $overlayTxt = $("#sourceWrap em.tableize");
    $tableWrapper.addClass("tableize-drag");
    $overlayTxt.text("drop your file here");
  };

  var dragFileReset = function (e, is_error = false) {
    if (e) dragFileCancelEvent(e);

    let $sourceWrap = $("#sourceWrap");
    let $tableWrapper = $sourceWrap.find("div.tableize");
    let $overlayTxt = $sourceWrap.find("em.tableize");

    $sourceWrap.next(".drag-drop-error").remove();
    if (is_error) {
      var $error = $("<p class=\"drag-drop-error\">").html("&#9888; Sorry, there was a problem loading your file. Try copy & pasting your location data instead.");
      $sourceWrap.after($error)
    }
    $tableWrapper.removeClass("tableize-drag");
    $tableWrapper.removeClass("tableize-drop");
    $overlayTxt.text($("#sourceData").attr("title"))
  };

  var readDragFileTxt = function (file, callback) {
    readDragFile(file, callback, "readAsText")
  };

  var readDragFileUrl = function (file, callback) {
    readDragFile(file, callback, "readAsDataURL")
  };

  var readDragFile = function (file, callback, read_type) {
    let fr = new FileReader;
    fr.onload = function (file) {
      callback(file.target.result)
    };
    fr.onerror = function () {
      dragFileReset(null, "Unable to read file data.")
    };
    fr[read_type](file)
  };

  var dragFileReadyCSV = function (csvData) {
    let csvArray = csvToArray(csvData);

    csvArray.length > 1 && csvArray[0].length > 1 && (csvData = arrayToCsv(csvArray, "\t"));

    dragFileReady(csvData);
  }

  var dragFileReadyXLS = function (xlsFile) {
    if (!(typeof xlsFile.ext == "undefined" || typeof xlsFile.file_content == "undefined"))
      try {
        let xlsLibrary = window[xlsFile.ext];
        let workbook = xlsLibrary.read(xlsFile.file_content.split(";base64,")[1], {
          type: "base64"
        });
        let file_content = xlsLibrary.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]], {
          FS: "\t"
        });

        dragFileReady(file_content)
      } catch (err) {
        dragFileReset(null, "Unable to convert file data into CSV format: " + err.message)
      }
  };

  var dragFileReady = function (csvData) {
    if (csvData.length) {
      var $sourceData = $("#sourceData");
      $sourceData.val(csvData);

      MapGeneratorTableize($sourceData.get(0));

      unValidateSource();
      $("div.tableize").addClass("tableize-unhover");

      $(window).focus(function () {
        $("div.tableize").mouseover(function () {
          $(this).removeClass("tableize-unhover");
          $(this).off("mouseover");
          $(window).off("focus")
        })
      })
    }

    dragFileReset();
  };

  var dragFileLoading = function (e) {
    dragFileCancelEvent(e);

    let $tableWrapper = $("#sourceWrap div.tableize");
    let $overlayTxt = $("#sourceWrap em.tableize");

    $tableWrapper.addClass("tableize-drop");
    $overlayTxt.html("&hellip;loading&hellip;");

    try {
      let file = e.originalEvent.dataTransfer.files[0];
      let file_type = file.type;

      if (file_type) {
        if (file_type == "text/tab-separated-values" || /\.(csv|tsv|tab)$/i.test(file.name)) {
          file_type = "text/csv";
        } else if (/\.xls$/i.test(file.name)) {
          file_type = "application/vnd.ms-excel";
        }
      }

      if (file_type == "text/csv")
        readDragFileTxt(file, function (file_content) {
          dragFileReadyCSV(file_content)
        });
      else {
        let xlsFile = {
          ext: file_type == "application/vnd.ms-excel" ? "XLS" : "XLSX"
        };

        readDragFileUrl(file, function (file_content) {
          xlsFile.file_content = file_content;
          dragFileReadyXLS(xlsFile)
        })
      }
    } catch (err) {
      dragFileReset(null, "Unable to load file data: " + err.message);
    }
  };

  // source text area drag & drop events
  var initSourceDragDrop = function () {
    let $sourceWrap = $("#sourceWrap");
    let $sourceData = $("#sourceData");

    if ($sourceWrap.length) {
      $sourceWrap.prev("h1").text("Paste your location data below to map it:");
      $sourceWrap.parent().find(".edit-method").text("paste or drag it");
      $sourceData.attr("title", "click to copy/paste, or drop your file here");
      $sourceWrap.find("em.tableize").text($sourceData.attr("title"));

      $sourceWrap
        .on("dragover", dragFileStart)
        .on("dragleave", dragFileReset)
        .on("drop", dragFileLoading);
    }
  };

  // get center
  var getCenter = function (geoList) {
    let bound = null;

    geoList.forEach(function (geo) {
      console.log(geo)
      if (bound == null) {
        bound = {
          min_lat: geo.geometry.location.lat,
          min_lng: geo.geometry.location.lng,
          max_lat: geo.geometry.location.lat,
          max_lng: geo.geometry.location.lng,
        };
      } else {
        if (geo.geometry.location.lat < bound.min_lat) {
          bound.min_lat = geo.geometry.location.lat;
        }

        if (geo.geometry.location.lng < bound.min_lng) {
          bound.min_lng = geo.geometry.location.lng;
        }

        if (geo.geometry.location.lat > bound.max_lat) {
          bound.max_lat = geo.geometry.location.lat;
        }

        if (geo.geometry.location.lng > bound.max_lng) {
          bound.max_lng = geo.geometry.location.lng;
        }
      }
    });

    return {
      lat: (bound.max_lat + bound.min_lat) / 2,
      lng: (bound.max_lng + bound.min_lng) / 2,
    };
  };

  // add markers
  var addMarkers = function () {
    let rowDataList = getRowDataList(sourceEle, false);
    let col_group = $("#group_sel").val();

    let groupList = rowDataList.map(function (rowData) {
      return `${getCellValuefromRow(rowData, columnNames, col_group)}`.trim();
    });

    // labeltype
    let labelType = $("#labeltype_sel").val();

    geoList.forEach(function (geo, geoIdx) {
      let groupName = groupList[geoIdx];

      let labelText = '';
      if (labelType == "letters")
        labelText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[geoIdx % 26];
      else if (labelType == "numbers")
        labelText = geoIdx + 1;

      let marker = new google.maps.Marker({
        position: geo.geometry.location,
        map: map,
        icon: getMapMarkerIcon(groupColors[groupName], labelText)
      });

      let markerAddress = geoAddressList[geoIdx];
      let markerTitle = '';
      let markerRowData = {};
      rowDataList.forEach(function (rowData) {
        if (getRowAddress(rowData) == markerAddress) {
          markerRowData = rowData;
          markerTitle = getRowTitle(rowData);
        }
      });

      marker.hoverInfoWindow = new google.maps.InfoWindow({
        disableAutoPan: true,
        content: `
          <div class="map-marker-info">
            <p style="margin: 0;"><b>${markerTitle}</b><br/>${markerAddress}</p>
          </div>
        `
      });

      marker.clickInfoWindow = new google.maps.InfoWindow({
        disableAutoPan: true,
        content: `
          <div class="map-marker-info">
            <a class="close" onClick="markers[${geoIdx}].marker.clickInfoWindow.close();">&times;</a>
            <div class="content">${getMarkerBoxContent(markerRowData)}</div>
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
        marker.clickInfoWindow.open(marker.get("map"), marker);
      });

      window.markers.push({ group: groupName, marker: marker });
    });
  };

  // get row title
  var getRowTitle = function (rowData) {
    let col_title = $("#title_sel").val();

    return getCellValuefromRow(rowData, columnNames, col_title);
  };

  // get address
  var getRowAddress = function (rowData) {
    let col_address = $("#address_sel").val();
    let col_city = $("#city_sel").val();
    let col_state = $("#state_sel").val();
    let col_zip = $("#zip_sel").val();
    let col_country = $("#country_sel").val();

    let address = getCellValuefromRow(rowData, columnNames, col_address);
    let city = getCellValuefromRow(rowData, columnNames, col_city);
    let state = getCellValuefromRow(rowData, columnNames, col_state);
    let zip = getCellValuefromRow(rowData, columnNames, col_zip);
    let country = getCellValuefromRow(rowData, columnNames, col_country);

    return `${address}, ${city}, ${state} ${zip} ${country}`.trim();
  };

  // geo-code
  var doGeocode = function () {
    let rowDataList = getRowDataList(sourceEle, false);

    let addressList = rowDataList.map(function (rowData) {
      return getRowAddress(rowData);
    });

    geoAddressList = [];
    geoList = [];
    window.markers = [];
    $.post('/wp-json/map-generator/v1/geocoding', { addresses: addressList }, function (response) {
      if (response.success) {
        geoList = response.data.map(function (data) {
          if (data.geo.status == google.maps.GeocoderStatus.OK) {
            geoAddressList.push(data.address);
            return data.geo.results[0];
          }
        });

        if (!geoList.length) {
          console.log("geocoding error");
          return false;
        }

        let center = getCenter(geoList);

        initMap(center);

        addMarkers();

        $("#map").slideDown();
        $("#legWrap").slideDown();
      } else {
        console.log("geocoding error.");
      }
    });
  };

  MapGeneratorTableize(sourceEle);
  initSourceDragDrop();

  $("#validate_button").on("click", function (e) {
    e.preventDefault();

    $("#validate_status").css({ display: "block" });
    $("#fields").slideDown();
    $("#advancedOptions").hide();
    isMapAvaialble = false;
    $("#map").hide();
    $("#legWrap").hide();

    $("#advanced_button").show().on("click", function () {
      $("#advancedOptions").slideDown();
      $("#advanced_button").off('click').hide();
    });

    validateSource();
  });

  $("#geocode_button").on("click", function (e) {
    e.preventDefault();

    doGeocode();
    updateMapLegends();
  });

  $("#mapnow_button").on("click", function (e) {
    e.preventDefault();

    $("#geocode_button").show();
    $("#validate_button").trigger("click");
    $("#geocode_button").trigger("click");
  });

  $.each($selectEleList, function (selIdx, $selectEle) {
    $($selectEle.selector).on('change', function () {
      updateMarkerBoxPreview()
    });
  });

  $("#clustering_cb").change(function () {
    $("#clusteroptions").toggle();
  });

  $(".map-generator #fields .map-options-col .option-images .option-image").click(function () {
    $(this).siblings().removeClass("option-image-selected");
    $(this).addClass("option-image-selected");
  });

  $(".map-generator #fields .map-options-3-col .map-options-col.marker-colors")
    .off('mouseleave')
    .on('mouseleave', function () {
      $(".map-generator #fields .map-options-3-col .map-options-col .color-picker-wrapper").hide();
      $(".map-generator #fields .map-options-3-col .map-options-col .col-hover").removeClass("col-hover");
    });

  $(".map-generator #fields .map-options-3-col .map-options-col .color-picker-wrapper .color-choice")
    .off("click")
    .on("click", function () {
      let style = $(this).attr("style");
      $(".map-generator #fields .map-options-3-col .map-options-col .col-hover div").attr("style", style);

      let colorHex = $(this).attr("color-hex");
      let colorIndex = null;
      $.each(groupColorsHex, function (hexIndex) {
        if (groupColorsHex[hexIndex] == colorHex)
          colorIndex = hexIndex;
      });
      let selectedGroup = $(".map-generator #fields .map-options-3-col .map-options-col .col-hover+td").text();
      getAllGroups().forEach(function (group) {
        if (selectedGroup == group && colorIndex)
          groupColors[group] = colorPallets[colorIndex];
      });
    });

  $("#mapnow_button").trigger("click");
  // $("#validate_button").trigger("click");
  $("#advanced_button").trigger("click");

  var initMap = function (center) {
    let mapTypeId = $("#view_sel").val();

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: center,
      mapTypeId: mapTypeId,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      styles: getMapThemeOptions()
    });

    isMapAvaialble = true;
  };
})(jQuery)