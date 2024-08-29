<?php

namespace app\modules\admin\assets;

use yii\web\AssetBundle;

class AppAsset extends AssetBundle
{

    public $sourcePath = '@app/modules/admin/assets/resources';

    public $css = [
        'css/fileinput.min.css',
        'css/footable.core.css',
        'css/bootstrap-select.min.css',
        'css/sidebar-nav.min.css',
        'css/custom-select.css',
        'css/sweetalert.css',
        'css/jquery.toast.css',
        'css/morris.css',
//        'css/chartist.min.css',
//        'css/chartist-plugin-tooltip.css',
        'css/fullcalendar.css',
        'css/bootstrap-datepicker.min.css',
        'css/animate.css',
        'css/style.css',
        'css/default.css',
        'css/icheck_min.css',
        'css/add.css',
        'css/vitarr.css',
        'css/evgeniy.css',
        'css/hv.css?v=1',
        'css/hv-media.css?v=1',
        'css/sem.css?v=1',
    ];
    public $js = [
        'js/jquery.checktree.js',
        'js/redactor/tinymce.min.js',
        'js/fileinput.min.js',
        'js/sidebar-nav.min.js',
        'js/jquery.slimscroll.js',
        'js/waves.js',
        'js/jquery.waypoints.min.js',
        'js/jquery.counterup.min.js',
        'js/chartist.min.js',
        'js/chartist-plugin-tooltip.min.js',
        'js/jquery.sparkline.min.js',
        'js/custom.min.js',
        'js/footable.all.min.js',
        'js/bootstrap-select.min.js',
        'js/footable-init.js',
        'js/dashboard1.js',
        'js/jquery.toast.js',
        'js/jQuery.style.switcher.js',
        'js/custom-select.min.js',
        'js/sweetalert.min.js',
        'js/bootstrap-datepicker.min.js',
        'js/icheck.min.js',
        'js/add.js',
        'js/vitarr.js'
    ];
    public $depends = [
        'app\assets\AppAsset',
        'app\assets\HeadAsset',
    ];
}
