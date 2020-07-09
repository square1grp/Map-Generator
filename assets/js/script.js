(function ($) {
  // generate table from textarea
  var MapGeneratorTableize = function (sourceEle) {
    let csvArray = csvToArray(sourceEle.value, String.fromCharCode(9));
    let $tableWrapper = $("<div />", {
      "class": "tableize tableize-wrapper"
    });
    let $table = $("<table />", {
      "class": "tableize tableize-table"
    });

    if (sourceEle.$tableWrapper)
      sourceEle.$tableWrapper.remove();

    sourceEle.$tableWrapper = $tableWrapper;

    let commentLineCount = 0;
    while (csvArray[commentLineCount][0].substring(0, 1) === "#")
      commentLineCount++;

    // if csvArray length is 1, all are location data
    if (csvArray.length === 1) {
      let headerArray = Array(csvArray[0].length - 1).fill("")
      csvArray.unshift(["Location"].concat(headerArray))
    }

    // Add Header
    let $tr = $("<tr />");
    csvArray[commentLineCount].forEach(function (a) {
      $("<th />", {
        html: a
      }).appendTo($tr)
    });
    $table.append($tr)

    // Add content
    csvArray.slice(commentLineCount + 1, csvArray.length).forEach(function (lineArray) {
      $table.append($("<tr />").append(lineArray.map(function (a) {
        return $("<td />", {
          html: a.length ? a : " "
        })
      })))
    });

    $tableWrapper.append($table)

    $tableWrapper[0].el = sourceEle;

    // overlay text
    let overlayTxt = $("<em />", {
      "class": "tableize tableize-overlay",
      html: sourceEle.title || "click to copy/paste"
    });

    $tableWrapper.append(overlayTxt);

    overlayTxt[0].tbl = $table;

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
        $(overlayTxt).css("top", $(this).scrollTop())
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
      } catch (f) {
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

  var unValidateSource = function () {

  };

  // source Ele (textarea)
  var sourceEle = document.getElementById("sourceData");
  MapGeneratorTableize(sourceEle);
})(jQuery)