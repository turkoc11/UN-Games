<?php
ini_set('memory_limit', '-1');
ini_set('xdebug.var_display_max_length', '-1');
ini_set('xdebug.var_display_max_depth', '-1');
ini_set('xdebug.var_display_max_children', '-1');
ini_set('xdebug.var_display_max_data', '-1');
ini_set('display_errors', 1);
error_reporting(E_ALL);

ini_set('memory_limit', 1024 * 1024 * 1024 * 3);
ini_set('max_execution_time', '-1');

// comment out the following two lines when deployed to production
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');

defined('LOCAL_DEBUG') or define('LOCAL_DEBUG', true);
defined('LOCAL_DEV') or define('LOCAL_DEV', true);

defined('SYQOR_ENV') or define('SYQOR_ENV', 3); // 1 = PROD; 2 = STAGE; 3 = DEV; 4 = LOCAL
//defined('SYQOR_ENV') or define('SYQOR_ENV', 2); // 1 = PROD; 2 = STAGE; 3 = DEV; 4 = LOCAL

require __DIR__ . '/../vendor/autoload.php';
// require __DIR__ . '/../components/Application.php';
require __DIR__ . '/../vendor/yiisoft/yii2/Yii.php';

$config = yii\helpers\ArrayHelper::merge(
    require(__DIR__ . '/../config/common.php'),
    require(__DIR__ . '/../config/common-local.php')
);

// (new \app\components\Application($config))->run();
(new yii\web\Application($config))->run();
