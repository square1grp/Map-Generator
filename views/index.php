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

			<div id="fields" class="fieldset extra-options">
				<br>
				<h2 class="text-center">Validate &amp; Set Options</h2>
				<p class="text-center">We have made our best guess at your data, but check below that everything is ok.</p>
					
				<div class="map-options">
					<div class="map-options-row">
						<div class="map-options-col">
							<h3>Basic options</h3>
			
							<div class="option-field">
								<label for="region_sel">Region</label>
								<select id="region_sel">
									<?php foreach( getRegions() as $r_abbr => $region ): ?>
										<option value="<?php _e( $r_abbr ); ?>" <?php _e( $r_abbr == "us" ? "selected" : ""); ?>><?php _e( $region ); ?></option>
									<?php endforeach; ?>
								</select>
							</div>
			
							<?php foreach( getFields() as $field ): ?>
								<div class="option-field">
									<label id="<?php _e( $field['type'] ) ?>_label" for="<?php _e( $field['type'] ) ?>_sel"><?php _e( $field['label'] ) ?></label>
									<select id="<?php _e( $field['type'] ) ?>_sel">
										<option value="<?php _e( $field['default']['value'] ) ?>"><?php _e( $field['default']['label'] ) ?></option>
									</select>
								</div>
							<?php endforeach; ?>

						</div>
			
						<div class="map-options-col">
							<h3>Marker box preview</h3>
							<div id="preview">
								<div id="markerBoxPreview">
									<div class="markerLabel">
										<div class="markerContent">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
			
					<p class="map-options-adv-btn"><button id="advanced_button" class="button white buttonsmall">Show Advanced Options</button></p>
			
					<div id="advancedOptions" class="">
						<h3>Advanced options</h3>
			
						<div class="map-options-row">
							<div class="map-options-col">
								<?php foreach( getAdvancedFields() as $field ): ?>
									<div class="option-field">
										<label id="<?php _e( $field['type'] ) ?>_label" for="<?php _e( $field['type'] ) ?>_sel"><?php _e( $field['label'] ) ?></label>
										<select id="<?php _e( $field['type'] ) ?>_sel">
											<option value="<?php _e( $field['default']['value'] ) ?>"><?php _e( $field['default']['label'] ) ?></option>
										</select>
									</div>
								<?php endforeach; ?>
							</div>
			
							<div class="map-options-col">
								<label class="option-toggle" for="labeltype_sel">
									Label each marker&nbsp;
									<select id="labeltype_sel">
										<option>none</option>
										<option selected>letters</option>
										<option>numbers</option>
									</select>
								</label>
			
								<label class="option-toggle" for="view_sel">
									Select a default map view to show&nbsp;
									<select id="view_sel">
										<option>street</option>
										<option>satellite</option>
										<option>hybrid</option>
										<option>terrain</option>
									</select>
								</label>
			
								<label class="option-toggle" for="clustering_cb">
									<input id="clustering_cb" type="checkbox">
									Enable clustering for high density markers
								</label>

								<label class="option-toggle" for="clustering_icon_cb" id="clusteroptions" style="display: none">
									<input id="clustering_icon_cb" type="checkbox">
									When clustering show the 
									<select id="clustering_icon_mode_sel" style="width:85px;">
										<option>sum</option>
										<option>average</option>
									</select> of <select id="clustering_icon_sel" style="width:85px;"><option value="">&nbsp;</option></select>
								</label>
			
								<label class="option-toggle" for="dist_cb">
									<input id="dist_cb" type="checkbox">
									Calculate (straight line) distance from first address in&nbsp;
									<select id="dist_sel">
										<option value="0">miles</option>
										<option value="1">kilometers</option>
									</select>
								</label>
			
								<label class="option-toggle" for="hideaddr_cb">
									<input id="hideaddr_cb" type="checkbox">
									Hide map addresses / Limit zoom in
								</label>

					
								<label class="option-toggle" for="disable_exports">
									<input id="disable_exports" type="checkbox">
									Disable KML export
								</label>

								<label class="option-toggle" for="linkopwin_cb">
									<input id="linkopwin_cb" type="checkbox"> Links open a new Window
								</label>
				
								<label class="option-toggle" for="disablethematic_cb" id="disablethematic">
									<input id="disablethematic_cb" type="checkbox">
									Don't combine groups into ranges
								</label>
								
								<h3>Troubleshooting</h3>

								<label class="option-toggle" for="disableroadtypes_cb" id="disableroadtypes">
									<input id="disableroadtypes_cb" type="checkbox" title="Can be used to fix problem addresses, only use if Geocoding is inaccurate">
									Filter road types before geocoding
								</label>
							</div>
						</div>
			
						<div id="stylingOptions" class="map-options-row map-options-3-col">
							<div class="map-options-col marker-colors">
								<h3>Marker colors</h3>
			
								<div class="option-scrollable">
									<table>
										<thead>
											<tr>
												<th class="color">Color</th>
												<th class="group">Group name</th>
											</tr>
										</thead>
										<tbody>
											<tr class="hide">
												<td class="color"><div>&nbsp;</div></td>
												<td class="group">Template group</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
			
							<div class="map-options-col marker-shapes">
								<h3>Marker shape</h3>
			
								<div class="option-images">
									<?php foreach( ['pushpin', 'circle', 'square'] as $index => $pinType ): ?>
										<div class="option-image <?php _e( $index == 0 ? 'option-image-selected' : '') ?>" style="background-image: url(<?php _e( MAP_GENERATOR_PLUGIN_URL . 'assets/images/' . $pinType . '.png') ?>)"></div>
									<?php endforeach; ?>
								</div>
							</div>
			
							<div class="map-options-col map-styles">
								<h3>Map style</h3>
			
								<div class="option-images">
									<?php foreach( ['simple', 'midnight', 'grayscale', 'subtle', 'paledawn', 'bluewater'] as $index => $mapType ): ?>
										<div class="option-image <?php _e( $index == 0 ? 'option-image-selected' : '') ?>" style="background-image: url(<?php _e( MAP_GENERATOR_PLUGIN_URL . 'assets/images/' . $mapType . '.png') ?>)"></div>
									<?php endforeach; ?>
								</div>
							</div>
			
						</div><!--/stylingOptions-->
			
					</div><!--/advancedOptions-->
			
				</div>
			</div>
		</form>
	</div>

	<script>
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
	</script>

<?php
	wp_enqueue_style( 'map-generator' );
	wp_enqueue_script( 'map-generator' );

	$html = ob_get_contents();
	ob_get_clean();

	return $html;
}