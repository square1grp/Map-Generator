<?php
add_shortcode( 'map-generator', 'map_generator_view' );

function map_generator_view() {
  ob_start();

  $sample_data = Spreadsheet::getSampleData();
?>

  <div id="map-generator" class="map-generator">
    <form onsubmit="return false;">
      <div class="fieldset">
        <h1 class="text-center">Paste your location data below to map it:</h1>

        <div id="sourceWrap" class="sourceWarp">
          <div id="deleteMe" class="tableize tableize-wrapper">
            <?php echo generateSpreadsheetView( $sample_data, 'tableize tableize-table' ); ?>

            <em class="tableize tableize-overlay">click to copy/paste, or drop your file here</em>
          </div>

          <textarea id="sourceData" wrap="off" rows="5" cols="80" title="click to copy/paste, or drop your file here" spellcheck="false" autocomplete="off"><?php _e( parseSpreadsheetToTxt( $sample_data ) ) ?></textarea>
        </div>

        <p class="text-center">
          ( Don't forget to include some header columns - You can also try our 
          <a href="<?php _e( MAP_GENERATOR_PLUGIN_URL . 'assets/example/' ) ?>excel_example.xls" target="_blank">
          Spreadsheet Template (Excel)</a>, or hit "Map Now" and try it out with our example data. )
        </p>

        <div class="button-group d-flex">
          <input type="submit" id="validate_button" value="Validate & Set Options" class="ml-auto mr-2 validate_button">
          <input type="submit" id="mapnow_button" value="Map Now" class="mr-auto ml-2 mapnow_button">
        </div>

        <span id="validate_status" class="status">
          Done: <span id="num_of_columns">9</span> columns, <span id="num_of_rows">11</span> rows - scroll down to Validate &amp; Set Options
        </span>
      </div>
    </form>
  </div>

  <script>
    var MEMBERSHIP = 'lite'; //free, pro
  </script>

<?php
  wp_enqueue_style( 'map-generator' );
  wp_enqueue_script( 'map-generator' );

  $html = ob_get_contents();
  ob_get_clean();

  return $html;
}