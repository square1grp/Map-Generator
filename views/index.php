<?php
add_shortcode( 'map-generator', 'map_generator_view' );

function map_generator_view() {
  ob_start();
?>

  <div id="map-generator" class="map-generator">
    <h1 class="text-center">Paste your location data below to map it:</h1>

    <div id="source-map" class="source-map">
      <div class="table-wrapper">
        <table>
        </table>

        <em>click to copy/paste, or drop your file here</em>
      </div>
    </div>

    <p class="text-center">
      ( Don't forget to include some header columns - You can also try our 
      <a href="<?php _e( MAP_GENERATOR_PLUGIN_URL . 'assets/example/' ) ?>excel_example.xls" target="_blank">
      Spreadsheet Template (Excel)</a>, or hit "Map Now" and try it out with our example data. )
    </p>

    <div id="button-group" class="button-group d-flex">
      <button class="ml-auto mr-2">Validate & Set Options</button>
      <button class="mr-auto ml-2">Map Now</button>
    </div>
  </div>

<?php
  wp_enqueue_style( 'map-generator' );

  $html = ob_get_contents();
  ob_get_clean();

  return $html;
}