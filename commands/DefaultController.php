<?php

namespace app\commands;

use app\components\ConsoleController;
use yii\console\ExitCode;

/**
 * Class DefaultController
 * @package app\commands
 */
class DefaultController extends ConsoleController
{
    /**
     * @return int
     */
    public function actionIndex()
    {
        return ExitCode::OK;
    }
}
