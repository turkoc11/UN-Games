<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\modules\gii;

use yii\web\AssetBundle;

/**
 * Declares the asset files for jQuery 'typeahead' plugin.
 *
 * @see http://twitter.github.io/typeahead.js/
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class TypeAheadAsset extends AssetBundle
{
    public $sourcePath = '@bower/typeahead.js/dist';
    public $js = [
        'typeahead.bundle.js',
    ];
    public $depends = [
        'yii\bootstrap\BootstrapAsset',
        'yii\bootstrap\BootstrapPluginAsset',
    ];
}
