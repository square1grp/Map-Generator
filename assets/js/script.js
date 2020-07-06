(function ($) {
  function readDragFileTxt(a, b) {
    readDragFile(a, b, "readAsText")
  }

  function readDragFileUrl(a, b) {
    readDragFile(a, b, "readAsDataURL")
  }

  function readDragFile(a, b, d) {
    var e = new FileReader

    e.onload = function (a) {
      b(a.target.result)
    }
    e.onerror = function () {
      dragFileReset(null, "Unable to read file data.")
    }
    e[d](a)
  }

  function dragFileReadyCSV(a) {
    var b = MapGenerator.csvToArray(a)
    b.length > 1 && b[0].length > 1 && (a = MapGenerator.arrayToCsv(b, "\t"))
    dragFileReady(a)
  }

  function dragFileReady(a) {
    if (a.length) {
      var b = $("#sourceData")
      b.val(a)
      MapGeneratorTableize(b.get(0))
      $("div.tableize").addClass("tableize-unhover")
      $(window).focus(function () {
        $("div.tableize").mouseover(function () {
          $(this).removeClass("tableize-unhover")
          $(this).off("mouseover")
          $(window).off("focus")
        })
      })
    }
    dragFileReset()
  }

  function MapGeneratorTableize(a) {
    var d = MapGenerator.csvToArray(a.value, String.fromCharCode(9))
      , e = $("<div />", {
        "class": "tableize tableize-wrapper"
      })
      , f = $("<table />", {
        "class": "tableize tableize-table"
      });
    a.$table && a.$table.remove();
    a.$table = e;
    for (var g = 0; d[g][0].substring(0, 1) === "#";)
      g++;
    if (d.length === 1) {
      var h = Array(d[0].length - 1).fill("")
      d.unshift(["Location"].concat(h))
    }
    var k = $("<tr />");
    d[g].forEach(function (a) {
      $("<th />", {
        html: a
      }).appendTo(k)
    });
    f.append(k);
    d.slice(g + 1, d.length).forEach(function (a) {
      f.append($("<tr />").append(a.map(function (a) {
        return $("<td />", {
          html: a.length ? a : " "
        })
      })))
    });
    e.append(f);
    e[0].el = a;
    var l = $("<em />", {
      "class": "tableize tableize-overlay",
      html: a.title || "click to copy/paste"
    });
    e.append(l);
    l[0].tbl = f;
    $(a).hide().before(e);
    $("#deleteMe").remove();
    MapGenerator.msie && (f.css("filter", ""),
      l.css("filter", ""));
    $(e).on("click contextmenu focus", function (c) {
      a = c.currentTarget.el;
      a.tbl = null;
      $(a).show();
      a.select();
      $(this).remove()
    });
    $(e).on("scroll", function () {
      $(l).css("top", $(this).scrollTop())
    });
    // $("input,textarea").on("click", function () {
    //   BatchGeoStore.dispatch({
    //     type: "GENERATOR_FOCUSED_ELSEWHERE"
    //   })
    // });
    $(document).on("paste", function (d) {
      try {
        var e = d.originalEvent.clipboardData.getData("Text");
        // if (BatchGeoStore.getState().Generator.focusedElsewhere)
        //   return !0;
        // BatchGeoStore.dispatch({
        //   type: "GENERATOR_DATA_CHANGED"
        // });
        if (a.value != e)
          return a.value = e,
            c(a),
            unValidateSource(),
            !1
      } catch (f) {
        // BatchGeoStore.dispatch({
        //   type: "GENERATOR_DATA_RESET"
        // }),
        //   console.log("clipboard access failed")
      }
      return !0
    });
    a.charCount = a.value.length;
    typeof document.getElementById("sourceData").addEventListener == "undefined" && ($(a).off("keyup mouseup"),
      $(a).on("keyup mouseup", function (a) {
        Math.abs(a.target.charCount - a.target.value.length) > 10 && (MapGeneratorTableize(a.target),
          unValidateSource());
        a.target.charCount = a.target.value.length
      }));
    $(a).off("blur");
    $(a).on("blur", function (a) {
      MapGeneratorTableize(a.target)
    });
    $(e).toggleClass("tableize-example", d[0][0] === "Example Address")
  }

  function dragFileCancelEvent(a) {
    a.stopPropagation()
    a.preventDefault()
  }

  function dragFileStart(a) {
    dragFileCancelEvent(a)

    $("#sourceWrap div.tableize").addClass("tableize-drag")
    $("#sourceWrap em.tableize").text("drop your file here")
  }

  function dragFileReset(a, b) {
    a && dragFileCancelEvent(a)
    var d = $("#sourceWrap")
      , e = d.find("div.tableize")
      , f = d.find("em.tableize")
    d.next(".drag-drop-error").remove()
    if (b) {
      BatchGeo.timer(b)
      var h = $('<p class="drag-drop-error">').html("&#9888 Sorry, there was a problem loading your file. Try copy & pasting your location data instead.")
      d.after(h)
    }
    e.removeClass("tableize-drag")
    e.removeClass("tableize-drop")
    f.text($("#sourceData").attr("title"))
  }

  function dragFileLoading(a) {
    dragFileCancelEvent(a)

    $("#sourceWrap div.tableize").addClass("tableize-drop");
    $("#sourceWrap em.tableize").html("&hellip;loading&hellip;");

    try {
      var file = a.originalEvent.dataTransfer.files[0], file_type = file.type
      file_type ? file_type == "text/tab-separated-values" || /\.(csv|tsv|tab)$/i.test(file.name) && (file_type = "text/csv") : /\.xls$/i.test(file.name) && (file_type = "application/vnd.ms-excel")

      if (file_type == "text/csv") {
        readDragFileTxt(file, function (a) {
          dragFileReadyCSV(a)
        })
      } else {

      }

    } catch (error) {

    }
  }

  $("#sourceWrap")
    .on('dragover', dragFileStart)
    .on('dragleave', dragFileReset)
    .on('drop dragdrop', dragFileLoading)

  MapGeneratorTableize(document.getElementById("sourceData"))
})(jQuery)