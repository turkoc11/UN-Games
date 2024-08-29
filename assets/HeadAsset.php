<?php

namespace app\assets;

use yii\web\AssetBundle;

/**
 * Head scripts asset bundle.
 *
 */
class HeadAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $jsOptions = ['position' => \yii\web\View::POS_HEAD];
    public $css = [
    ];
    public $js = [
        //'https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js',
        //'https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js'
    ];
    public $depends = [
    ];
}
