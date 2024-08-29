<?php

namespace app\commands;

use app\components\ConsoleController;
use app\models\ParserExcel;
use yii\console\ExitCode;

/**
 * Class DefaultController
 * @package app\commands
 */
class ParserController extends ConsoleController
{
    /**
     * @return int
     */
    public function actionCreateProducts()
    {
        $file = 'web/uploads/products.xlsx';
        try
        {
            $fileType = \PHPExcel_IOFactory::identify($file);
            $object = \PHPExcel_IOFactory::createReader($fileType);
            $objectExcel = $object->load($file);           
        }
        catch(\Exception $e)
        {
            throw new \Exception($e->getMessage());
        }
        $sheet = $objectExcel->getSheet(0);
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();
        $transaction = \Yii::$app->db->beginTransaction();
        try
        {
            for($row = 1; $row <= $highestRow; $row++ )
            {
                $rowData = $sheet->rangeToArray('A'.$row.':'.$highestColumn.$row, NULL, TRUE, FALSE);
                if($row <= 14)
                {
                    continue;
                }
                else
                {
                    $parser = new ParserExcel();
                    $parser->saveData($rowData);                
                }
            }
            $transaction->commit();
        }
        catch(\Exception $e)
        {
            $transaction->rollBack();
            throw new \Exception($e->getMessage());
        }       
    }
}
