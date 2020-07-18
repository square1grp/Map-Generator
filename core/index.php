<?php
require_once MAP_GENERATOR_PLUGIN_PATH . 'vendor/autoload.php';

require_once 'spreadsheet.php';

require_once 'map.php';

function generateSpreadsheetView( $sheetData=[], $classname='' ) {
  $is_parsingStarted = false;
  $is_setHeader = false;

  $html = "<table class=\"$classname\">";

  foreach( $sheetData as $rowData ) {
    if ( strpos( $rowData[0], '#' ) === 0 && $is_parsingStarted === false ) {
      continue;
    }

    $is_parsingStarted = true;

    $html .= '<tr>';

    foreach( $rowData as $cellData ) {
      $cell_tag = $is_setHeader ? 'td' : 'th';

      $html .= "<$cell_tag>$cellData</$cell_tag>";
    }

    $html .= '</tr>';

    $is_setHeader = true;
  }

  $html .= '</table>';

  return $html;
}

function parseSpreadsheetToTxt( $sheetData = [] ) {
  $lines = [];

  foreach( $sheetData as $rowData ) {
    if ( strpos( $rowData[0], '#' ) === 0) {
      continue;
    }

    $lines[] = implode( "\t", $rowData );
  }

  return implode( "\n", $lines );
}

function getRegions() {
  $regions = [
    "inter" => "International",
    "ar" => "Argentina",
    "at" => "Austria",
    "au" => "Australia",
    "be" => "Belgium",
    "br" => "Brazil",
    "ca" => "Canada",
    "cn" => "China",
    "hr" => "Croatia",
    "cz" => "Czech Republic",
    "dk" => "Denmark",
    "fi" => "Finland",
    "fr" => "France",
    "de" => "Germany",
    "gr" => "Greece",
    "hu" => "Hungary",
    "id" => "Indonesia",
    "in" => "India",
    "ie" => "Ireland",
    "il" => "Israel",
    "it" => "Italy",
    "jp" => "Japan",
    "kr" => "South Korea",
    "lv" => "Latvia",
    "my" => "Malaysia",
    "mx" => "Mexico",
    "ma" => "Morocco",
    "nl" => "Netherlands",
    "no" => "Norway",
    "nz" => "New Zealand",
    "pl" => "Poland",
    "pt" => "Portugal",
    "ph" => "Philippines",
    "ro" => "Romania",
    "sa" => "Saudi Arabia",
    "sg" => "Singapore",
    "za" => "South Africa",
    "es" => "Spain",
    "se" => "Sweden",
    "ch" => "Switzerland",
    "tw" => "Taiwan",
    "ua" => "Ukraine",
    "uk" => "United Kingdom",
    "ae" => "United Arab Emirates",
    "us" => "United States"
  ];

  return $regions;
}

function getFields() {
  return [
    [
      'label' => 'Location / Address',
      'type'  => 'address',
      'default' => [
        'value' => '',
        'label' => 'none'
      ]
    ],
    [
      'label' => 'City / County',
      'type'  => 'city',
      'default' => [
        'value' => '',
        'label' => 'none'
      ]
    ],
    [
      'label' => 'State / Province / Postcode',
      'type'  => 'state',
      'default' => [
        'value' => '',
        'label' => 'none'
      ]
    ],
    [
      'label' => 'Zip / Postcode / Country',
      'type'  => 'zip',
      'default' => [
        'value' => '',
        'label' => 'none'
      ]
    ],
    [
      'label' => 'Group By / Thematic Value',
      'type'  => 'group',
      'default' => [
        'value' => 'marker',
        'label' => 'Single Color'
      ]
    ],
  ];
}

function getAdvancedFields() {
  return [
    [
      'label' => 'Title',
      'type'  => 'title',
      'default' => [
        'value' => '',
        'label' => '&nbsp;'
      ]
    ], [
      'label' => 'Marker Description',
      'type'  => 'desc',
      'default' => [
        'value' => 'All Columns',
        'label' => 'All Columns'
      ]
    ], [
      'label' => 'Country Field',
      'type'  => 'country',
      'default' => [
        'value' => '',
        'label' => '&nbsp;'
      ]
    ], [
      'label' => 'URL',
      'type'  => 'descURL',
      'default' => [
        'value' => '',
        'label' => 'Use Google Maps'
      ]
    ], [
      'label' => 'Image URL',
      'type'  => 'descIMG',
      'default' => [
        'value' => '',
        'label' => '&nbsp;'
      ]
    ], [
      'label' => 'E-mail',
      'type'  => 'email',
      'default' => [
        'value' => '',
        'label' => '&nbsp;'
      ]
    ], [
      'label' => 'Phone Number',
      'type'  => 'phonenumber',
      'default' => [
        'value' => '',
        'label' => '&nbsp;'
      ]
    ], [
      'label' => 'Latitude',
      'type'  => 'lat',
      'default' => [
        'value' => '',
        'label' => 'none'
      ]
    ], [
      'label' => 'Longitude',
      'type'  => 'lon',
      'default' => [
        'value' => '',
        'label' => 'none'
      ]
    ]
  ];
}