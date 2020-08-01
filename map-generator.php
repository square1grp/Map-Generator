<?php
/**
* Plugin Name: Map Generator
* Description: This is a Map Generator
* Version: 1.0
* Author: Emmanuel Lao
* Author URI: https://square1grp.github.io/
**/

define( 'MAP_GENERATOR_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

define( 'MAP_GENERATOR_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once 'config.php';

require_once 'core/index.php';

require_once 'views/index.php';

add_action( 'wp_enqueue_scripts', function() {
	wp_register_script( 'map-generator-core', MAP_GENERATOR_PLUGIN_URL . 'assets/js/core.js', [], '1.0.0', true );
	wp_register_script( 'xls-min', MAP_GENERATOR_PLUGIN_URL . 'assets/js/xls.min.js', [], '1.0.0', true );
	wp_register_script( 'xlsx-and-jszip', MAP_GENERATOR_PLUGIN_URL . 'assets/js/xlsx-and-jszip.min.js', [], '1.0.0', true );
	
	wp_register_script( 'embedded-map', MAP_GENERATOR_PLUGIN_URL . 'assets/js/embedded.js', ['jquery', 'map-generator-core'], '1.0.0', true );
	wp_register_style( 'embedded-map', MAP_GENERATOR_PLUGIN_URL . 'assets/css/embedded.css', [], '1.0.0' );

	wp_register_script( 'map-generator', MAP_GENERATOR_PLUGIN_URL . 'assets/js/script.js', ['jquery', 'map-generator-core', 'xls-min', 'xlsx-and-jszip'], '1.0.0', true );
	wp_register_style( 'map-generator', MAP_GENERATOR_PLUGIN_URL . 'assets/css/style.css', [], '1.0.0' );
} );

// add single property page in front end
add_filter( 'generate_rewrite_rules', function ( $wp_rewrite ) {
	$wp_rewrite->rules = array_merge(
		[ 'embedded-map/([a-zA-Z0-9 ,_]+)/?$' => 'index.php?pageType=embeddedMap&mapID=$matches[1]' ],
		$wp_rewrite->rules
	);

	return $wp_rewrite->rules;
} );

// add queries to the url
add_filter( 'query_vars', function( $query_vars ) {
	array_push( $query_vars, 'pageType', 'mapID');

	return $query_vars;
} );

// template redirect hook
add_action( 'template_redirect', function() {
	$pageType = get_query_var('pageType');
	$mapID = get_query_var('mapID');

	if ( $pageType == 'embeddedMap' && isset( $mapID ) ) {
		get_header();

		include 'views/embedded-map.php';

		get_footer();
		die;
		}
} );