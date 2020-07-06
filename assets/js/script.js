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

    try {
      var file = a.originalEvent.dataTransfer.files[0], file_type = file.type
      file_type ? file_type == "text/tab-separated-values" || /\.(csv|tsv|tab)$/i.test(file.name) && (file_type = "text/csv") : /\.xls$/i.test(file.name) && (file_type = "application/vnd.ms-excel")

      if (file_type == "text/csv") {
        readDragFileTxt(file, function (e) {
          dragFileReadyCSV(e)
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

})(jQuery)