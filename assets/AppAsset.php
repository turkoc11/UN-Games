<?php


namespace app\assets;

use yii\web\AssetBundle;


class AppAsset extends AssetBundle
{
    public $basePath = '@app/assets';
    public $baseUrl = '@web';
    public $css = [
        // 'css/style-min.css'
    ];
    public $js = [
        // 'js/html5shiv.js',
        // 'js/main.js'
    ];
    public $depends = [
        'yii\web\JqueryAsset',
        'yii\bootstrap\BootstrapAsset',
        'yii\web\YiiAsset',
    ];
}
