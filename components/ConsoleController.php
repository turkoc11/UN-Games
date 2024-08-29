<?php

namespace app\components;

use Yii;

class ConsoleController extends \yii\console\Controller
{
    public function init()
    {
        Yii::setAlias('@webroot', __DIR__ . '/../web');        
        parent::init();
    }

}
