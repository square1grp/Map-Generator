(function (a) {
  a.MapGenerator = {
    csvToArray: function (a, b) {
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
    },
    arrayToCsv: function (a, b) {
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
    }
  }
}
)(window);