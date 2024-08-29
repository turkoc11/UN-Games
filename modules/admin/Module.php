<?php

namespace app\modules\admin;
use Yii;

class Module extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\admin\controllers';

    public function init()
    {
        \Yii::$app->assetManager->appendTimestamp = true;

        \Yii::$app->assetManager->bundles[ 'yii\web\JqueryAsset' ] = [
            'sourcePath' => '@app/modules/admin/assets/resources',
            'baseUrl'    => '@web',
            'js'         => [
                'js/jquery.min.js',
            ],
        ];
        \Yii::$app->assetManager->bundles[ 'yii\bootstrap\BootstrapAsset' ] = [
            'sourcePath' => '@app/modules/admin/assets/resources',
            'baseUrl'    => '@web',
            'css'        => [
                'css/bootstrap.min.css',
            ],
            'js'         => [
                'js/bootstrap.min.js',
            ],
        ];
        Yii::setAlias('@common/db/', __DIR__ . '../../../common/db');
        parent::init();
    }
}
