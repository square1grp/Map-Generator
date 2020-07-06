<?php
require_once MAP_GENERATOR_PLUGIN_PATH . 'vendor/autoload.php';

require_once 'spreadsheet.php';

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