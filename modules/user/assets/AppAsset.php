<?php

namespace app\modules\user\assets;

use yii\web\AssetBundle;

class AppAsset extends AssetBundle
{
    public $sourcePath = '@app/assets';

    public $css = [
        'modules/bootstrap/css/bootstrap.min.css',
        'modules/fontawesome/css/all.min.css',
        'modules/bootstrap-social/bootstrap-social.css',
        'css/style.css',
        'css/style-min.css',
        'css/components.css'
    ];

    public $js = [
        //'modules/jquery.min.js',
        'modules/popper.js',
        'modules/tooltip.js',
        'modules/bootstrap/js/bootstrap.min.js',
        'modules/nicescroll/jquery.nicescroll.min.js',
        'modules/moment.min.js',
        'js/stisla.js',
        'js/scripts.js',
        'js/custom.js',
        'js/html5shiv.js',
//        'js/main.js'
    ];

    public $depends = [
        'app\assets\AppAsset',
        'app\assets\HeadAsset',
    ];

}
