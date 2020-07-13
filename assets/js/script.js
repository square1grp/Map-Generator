(function ($) {
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
  var groupColors = ["#fd7569", "#6996fd", "#95ea7b", "#fdeb5a", "#c699fd", "#bae1fd", "#fb8b07"];

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

  // update marker box preview
  var updateMarkerBoxPreview = function () {
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
      sampleRow: sampleRow
    };

    let $html = generateMarkerBoxPreviewContent(markerBoxPreviewArgs);

    $(".map-generator #fields .map-options-col .markerLabel .markerContent").html($html);
  };

  // update color options
  var updateColorOptions = function () {
    let groups = [];
    let rowDataList = getRowDataList(document.getElementById("sourceData"));

    let groupColumnName = $("#group_sel").val();

    if (groupColumnName == 'marker')
      return false;

    let columnIdx = getColumnIndex(columnNames, groupColumnName);
    $.each(rowDataList, function (rowIdx, rowData) {
      if (!groups.includes(rowData[columnIdx]))
        groups.push(rowData[columnIdx]);
    });

    let $table = $(".map-generator #fields .map-options-3-col .map-options-col table");

    $table.find("tbody tr").remove();

    $.each(groups, function (groupIdx, group) {
      $table.append($("<tr />").append([
        `<div style="background-color: ${groupColors[groupIdx % groupColors.length]};">&nbsp;</div>`,
        group
      ].map(function (html) {
        return $("<td />", { html })
      })))

      $table.find(`tbody tr:nth-child(${groupIdx + 1}) td:first-child`)
        .off('hover')
        .on({
          mouseenter: function () {
            $(this).addClass("col-hover");
            $(".map-generator #fields .map-options-3-col .map-options-col .color-picker-wrapper").css({
              top: `${23 * groupIdx}px`
            }).show();
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

    updateMarkerBoxPreview();
    updateColorOptions();
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

  // source Ele (textarea)
  var sourceEle = document.getElementById("sourceData");
  MapGeneratorTableize(sourceEle);
  initSourceDragDrop();

  $("#validate_button").on("click", function () {
    $("#validate_status").css({ display: "block" });
    $("#fields").slideUp().slideDown();

    $("#advanced_button").show().on("click", function () {
      $("#advancedOptions").slideUp().slideDown();
      $("#advanced_button").off('click').hide();
    });
    validateSource();
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
    });
})(jQuery)