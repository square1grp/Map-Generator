<?php
function geocode() {
  if ( !isset( $_POST['addresses'] ) || empty( $_POST['addresses'] ) ) {
    wp_send_json_error();
  }

  $addresses = $_POST['addresses'];

  $geocode_addresses = [];

  foreach ( $addresses as $address) {
    $response = wp_remote_get( 'https://maps.googleapis.com/maps/api/geocode/json?address=' . $address. '&key=' . GOOGLE_API_KEY );

    $responseBody = wp_remote_retrieve_body( $response );

    $result = json_decode( $responseBody, true );

    if ( is_array( $result ) && !is_wp_error( $result ) )
      array_push( $geocode_addresses, [
        'address' => $address,
        'geo'     => $result
      ] );
  }

  wp_send_json_success( $geocode_addresses );
}

function geocode_test() {
  $testJSON = file_get_contents( MAP_GENERATOR_PLUGIN_PATH . '/core/test.json' );
  wp_send_json_success( json_decode( $testJSON, true ) );
}

function save_map() {
  $hash_key = md5(time());

  if ( set_transient( $hash_key, $_POST ) ) {
    wp_send_json_success( $hash_key );
  } else {
    wp_send_json_error();
  }
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'map-generator/v1', '/geocoding', array(
    'methods' => 'POST',
    'callback' => 'geocode_test',
  ) );

  register_rest_route( 'map-generator/v1', '/save-map', array(
    'methods' => 'POST',
    'callback' => 'save_map',
  ) );
} );