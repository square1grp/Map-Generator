<?php 

$data = get_transient( $mapID );

if ( $data === false )
	return;

if ( !isset( $data['mapData'] ) || empty( $data['mapData'] ) )
	return;
?>


<div id="map-generator" class="map-generator">
	<div id="map"></div>
	<div id="legWrap">
		<div id="legDiv">
			<div class="columnWrap no-menu">
				<div class="columnName"></div>
			</div>
			<ul class="groupList"></ul>
		</div>
	</div>
</div>

<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
<script src="https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=<?php _e( GOOGLE_API_KEY ) ?>"></script>


<script>
	var mapTypeId = '<?php _e( $data['mapData']['mapTypeId'] ) ?>';
	var mapType = '<?php _e( $data['mapData']['mapType'] ) ?>';
	var geoList = <?php _e( json_encode( $data['mapData']['geoList'] ) ) ?>;
	geoList.map( function( geo ) {
		geo.geometry.location.lat = parseFloat( geo.geometry.location.lat );
		geo.geometry.location.lng = parseFloat( geo.geometry.location.lng );
	} );
	var rowDataList = <?php _e( json_encode( $data['mapData']['rowDataList'] ) ) ?>;
	var columnNames = <?php _e( json_encode( $data['mapData']['columnNames'] ) )  ?>;
	
	var col_title = '<?php _e( $data['mapData']['title'] ) ?>';
	var col_group = '<?php _e( $data['mapData']['group'] ) ?>';
	var col_address = '<?php _e( $data['mapData']['address'] ) ?>';
	var col_city = '<?php _e( $data['mapData']['city'] ) ?>';
	var col_state = '<?php _e( $data['mapData']['state'] ) ?>';
	var col_zip = '<?php _e( $data['mapData']['zip'] ) ?>';
	var col_country = '<?php _e( $data['mapData']['country'] ) ?>';
	var col_description = '<?php _e( $data['mapData']['description'] ) ?>';
	var col_url = '<?php _e( $data['mapData']['url'] ) ?>';
	var col_imageURL = '<?php _e( $data['mapData']['imageURL'] ) ?>';
	var col_email = '<?php _e( $data['mapData']['email'] ) ?>';
	var col_phonenumber = '<?php _e( $data['mapData']['phonenumber'] ) ?>';
	var col_latitude = '<?php _e( $data['mapData']['latitude'] ) ?>';
	var col_longitude = '<?php _e( $data['mapData']['longitude'] ) ?>';

	var dist_sel = '<?php _e( $data['mapData']['dist_sel'] ) ?>'
	var labelType = '<?php _e( $data['mapData']['labelType'] ) ?>';
	var isClustering = <?php _e( $data['mapData']['isClustering'] ) ?>;
	var hideMapAddresses = <?php _e( $data['mapData']['hideMapAddresses'] ) ?>;
	var showDistance = <?php _e( $data['mapData']['showDistance'] ) ?>;
	var newWindowLink = <?php _e( $data['mapData']['newWindowLink'] ) ?>;

	var groupColors = <?php _e( json_encode( $data['mapData']['groupColors'] )) ?>;
	var geoAddressList = <?php _e( json_encode( $data['mapData']['geoAddressList'] )) ?>;

	var MEMBERSHIP = 'lite'; //free, pro

	var TEMPLATE_TITLE = `
		<h1 class="cardTitle">
			<a href="MARKER_URL" target="_blank" class="marker " rel="nofollow">MARKER_TITLE</a>
		</h1>
	`;

	var TEMPLATE_LOCATION = `
		<div class="address">
			<a href="https://www.google.com/maps/search/?api=1&amp;query=MARKER_ADDRESS MARKER_CITY, MARKER_STATE MARKER_ZIP MARKER_COUNTRY"
				target="_blank" class="directions-link" title="Open in Google Maps" rel="nofollow" id="markerAddress">
				MARKER_ADDRESS<br>MARKER_CITY, MARKER_STATE MARKER_ZIP MARKER_COUNTRY</a>
		</div>
	`;

	var TEMPLATE_PHONENUMBER = `
		<div><span class="l">Phone Number:</span>&nbsp;<a href="tel:MARKER_PHONENUMBER">MARKER_PHONENUMBER</a></div>
	`;

	var TEMPLATE_EMAIL = `
		<div><span class="l">Email:</span>&nbsp;<a href="mailto:MARKER_EMAIL">MARKER_EMAIL</a></div>
	`;

	var TEMPLATE_DESCRIPTION = `
		<div><span class="l">MARKER_DESCRIPTION_NAME:</span>&nbsp;MARKER_DESCRIPTION_VALUE</div>
	`;

	var TEMPLATE_GROUP_LEGEND = `
		<li title="Toggle filtering for this grouping" style="background-image: url(GROUP_IMAGE_URL);">GROUP_NAME</li>
	`;
</script>

<?php
	wp_enqueue_style( 'embedded-map' );
	wp_enqueue_script( 'embedded-map' );
?>