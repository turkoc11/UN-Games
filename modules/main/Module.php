<?php

namespace app\modules\main;

class Module extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\main\controllers';

    public function init()
    {
      
        \Yii::$app->assetManager->appendTimestamp = true;

        \Yii::$app->assetManager->bundles[ 'yii\web\JqueryAsset' ] = [
            'sourcePath' => '@app/assets',
            'baseUrl'    => '@web',
            'js'         => [
                'modules/jquery.min.js',
            ],
        ];
        \Yii::$app->assetManager->bundles[ 'yii\bootstrap\BootstrapAsset' ] = [
            'sourcePath' => '@app/assets',
            'baseUrl'    => '@web',
            'css'        => [
                //'css/bootstrap.min.css',
            ],
            'js'         => [
                //'js/bootstrap.min.js',
            ],
        ];

        parent::init();
    }
}
