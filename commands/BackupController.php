<?php

namespace app\commands;

use app\components\ConsoleController;
use yii\console\ExitCode;

class BackupController extends ConsoleController
{
    public function actionBackup()
    {
        $backup = \Yii::$app->backup;
        $databases = ['db'];
        foreach ($databases as $k => $db) {
            $index = (string)$k;
            $backup->fileName = 'myapp-part';
            $backup->fileName .= str_pad($index, 3, '0', STR_PAD_LEFT);
            $backup->directories = [];
            $backup->databases = [$db];
            $file = $backup->create();
            $this->stdout('Backup file created: ' . $file . PHP_EOL, \yii\helpers\Console::FG_GREEN);
        }
    }

    public function actionRestore($file)
    {
        $restore = \Yii::$app->backup;
        $databases = ['db'];
        foreach ($databases as $k => $db) {            
            $file = $restore->restore($file);
            $this->stdout('Backup file restored: ' . $file . PHP_EOL, \yii\helpers\Console::FG_GREEN);
        }
    }
}