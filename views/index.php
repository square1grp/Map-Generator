<?php
add_shortcode( 'map-generator', 'map_generator_view' );

function map_generator_view() {
	ob_start();

	// print_r( get_transient( '1cabf8fc61ef4d3f669f67c1ec352d36' ) );

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
										<option>roadmap</option>
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
									<input id="linkopwin_cb" type="checkbox" checked> Links open a new Window
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
										<tbody></tbody>
									</table>
								</div>

								<div class="color-picker-wrapper" style="">
									<div class="color-picker">
										<?php foreach (["#fd7569", "#6996fd", "#95ea7b", "#fdeb5a", "#c699fd", "#bae1fd", "#fb8b07"] as $color): ?>
											<div class="color-choice" color-hex="<?php _e( $color ) ?>" style="background-color: <?php _e($color) ?>;"></div>
										<?php endforeach; ?>
										<div class="color-picker-arrow"></div>
									</div>
								</div>
							</div>
			
							<div class="map-options-col marker-shapes">
								<h3>Marker shape</h3>
			
								<div class="option-images">
									<?php foreach( ['pushpin', 'circle', 'square'] as $index => $pinType ): ?>
										<div class="option-image <?php _e( $index == 0 ? 'option-image-selected' : '') ?>" pin-type="<?php _e( $pinType ) ?>" style="background-image: url(<?php _e( MAP_GENERATOR_PLUGIN_URL . 'assets/images/' . $pinType . '.png') ?>)"></div>
									<?php endforeach; ?>
								</div>
							</div>
			
							<div class="map-options-col map-styles">
								<h3>Map style</h3>
			
								<div class="option-images">
									<?php foreach( ['simple', 'midnight', 'grayscale', 'subtle', 'paledawn', 'bluewater'] as $index => $mapType ): ?>
										<div class="option-image <?php _e( $index == 0 ? 'option-image-selected' : '') ?>" map-type="<?php _e( $mapType ) ?>" style="background-image: url(<?php _e( MAP_GENERATOR_PLUGIN_URL . 'assets/images/' . $mapType . '.png') ?>)"></div>
									<?php endforeach; ?>
								</div>
							</div>
			
						</div><!--/stylingOptions-->
			
					</div><!--/advancedOptions-->
			
					<div class="button-group d-flex">
						<input type="submit" id="geocode_button" value="Make Map" class="mx-auto geocode_button">
					</div>
					
				</div>
			</div>
		</form>
		
		<div id="map"></div>
		<div id="legWrap">
			<div id="legDiv">
				<div class="columnWrap no-menu">
					<div class="columnName"></div>
				</div>
				<ul class="groupList"></ul>
			</div>
		</div>

		<div id="save_map_wrapper">
			<input type="submit" id="save_map" value="Save Map" class="mx-auto save_map_button">
		</div>

		<div id="save_map_modal_wrapper">
			<div class="overlay"></div>
			<div class="modal-content">
				<button type="button" class="close">&times;</button>
				<form>
					<div class="form-row">
						<label for="map_title">Title</label>
						<input id="map_title" size="50" maxlength="50">
						<p><small>Enter a short title for your map, what is it?</small></p>
					</div>

					<div class="form-row">
						<label for="map_description">Description</label>
						<textarea id="map_description" cols="40" rows="5" spellcheck="false"></textarea>
					</div>

					<div class="form-row">
						<label for="map_email">Email</label>
						<input id="map_email" name="email" type="email" size="50" maxlength="50" placeholder="example@example.com" required>
						<p><small>Enter this in case you want to EDIT your map later.</small></p>
					</div>

					<div class="form-row">
						<label for="map_email">Privacy</label>
						<div class="input_desc">
							<label class="share" for="share_public">
								<a title="Your map may be listed on the site under the featured maps section.">
									<input id="share_public" type="radio" name="private" value="0">Public
								</a>
							</label>

							<label class="share" for="share_unlisted">
								<a title="Your map URL will be kept private.">
									<input id="share_unlisted" type="radio" name="private" value="1" checked="checked">Unlisted
								</a>
							</label>

							<label class="share" for="share_me" style="color:#999">
								<a title="Your map URL will only be accessible from your account.">
									<input id="share_me" type="radio" name="private" value="1" disabled="">Password Protect
								</a> (<a href="/pricing/" target="_blank">Pro Only</a>)
							</label>

							<p><small>If you select "Unlisted" your map will be saved to a unique URL that will be kept private to you, it will not be listed anywhere on the site. You can read up on <a href="/features/security/" target="_blank">map privacy</a> in our <a href="/features/" target="_blank">features section</a>.</small></p>
						</div>
					</div>

					<div class="form-row">
						<label for="map_email">Map Mode</label>
						<div class="ui-map-mode-toggle">
							<label class="ui-map-mode-toggle-label">
								<div class="ui-map-mode-toggle-header">
									<input type="radio" name="map_mode" value="data_view" checked="checked">
									<p>Data View</p>
								</div>
								
								<span class="ui-map-mode-toggle-image-wrap">
									<img src="<?php _e( MAP_GENERATOR_PLUGIN_URL ) ?>/assets/images/data-view.svg">
								</span>
								
								<p><small>Displays data below your map with filtering tools</small></p>
							</label>
							
							<label class="ui-map-mode-toggle-label">
								<div class="ui-map-mode-toggle-header">
									<input type="radio" name="map_mode" value="store_locator">
									<p>Store Locator</p>
								</div
								>
								<span class="ui-map-mode-toggle-image-wrap">
									<img src="<?php _e( MAP_GENERATOR_PLUGIN_URL ) ?>/assets/images/store-locator.svg">
								</span>
								<p><small>Displays locations in a list next to your map for easy scanning</small></p>
							</label>
						</div>
					</div>

					<div class="form-row">
						<label></label>
						<div class="input_desc">
							<span class="small">
								<input type="checkbox" name="agree_terms" id="agree_terms" value="1" checked="">
								<label for="agree_terms" class="share">I have read and agree to the BatchGeo <a href="/features/terms/" target="_blank">Terms of Service</a>.</label>
							</span>
						</div>
					</div>

					
					<div class="form-row">
						<input type="submit" value="Save Map" class="mx-auto save_map_button">
					</div>
				</form>
			</div>
		</div>
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

		var TEMPLATE_GROUP_LEGEND = `
			<li title="Toggle filtering for this grouping" style="background-image: url(GROUP_IMAGE_URL);">GROUP_NAME</li>
		`;
	</script>

	<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
	<script src="https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key=<?php _e( GOOGLE_API_KEY ) ?>"></script>
	
<?php
	wp_enqueue_style( 'map-generator' );
	wp_enqueue_script( 'map-generator' );

	$html = ob_get_contents();
	ob_get_clean();

	return $html;
}