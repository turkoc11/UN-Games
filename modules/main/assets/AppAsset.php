<?php

namespace app\modules\main\assets;

use yii\web\AssetBundle;

class AppAsset extends AssetBundle
{

    public $sourcePath = '@app/assets';

    public $css = [
//        'css/main.css',
        'css/game-styles.css'
    ];


    public $js = [
//        'js/vendor.js',
//        'js/pages.js',

//        'js/main.js',
        'js/game-scripts.js'
    ];
    // public $depends = [
    //     'app\assets\AppAsset',
    //     'app\assets\HeadAsset',
    // ];

}
