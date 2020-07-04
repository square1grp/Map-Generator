<?php
use \PhpOffice\PhpSpreadsheet\Reader\Xls;

class Spreadsheet {
  static function getSampleData() {
    $reader = new Xls();

    $spreadsheet = $reader->load( MAP_GENERATOR_PLUGIN_PATH . 'assets/example/excel_example.xls' );

    return $spreadsheet->getActiveSheet()->toArray();
  }
}