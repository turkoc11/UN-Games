<?php
require(__DIR__ . '/../vendor/yiisoft/yii2/BaseYii.php');

/**
 * Class Yii
 */
class Yii extends \yii\BaseYii
{
    /**
     * @var WebApplication
     */
    public static $app;
}

/**
 * Class WebApplication
 *
 * @property  app\components\Controller $controller
 * @property  app\components\LangRequest $request
 * @property  app\components\LangUrlManager $urlManager
 * @property  \app\models\Users $user
 * @property \bitcko\mailer\BitckoMailer $BitckoMailer
 * @property  yii\caching\FileCache $cache
 * @property  yii\swiftmailer\Mailer $mailer
 *
 */
class WebApplication extends \yii\web\Application
{
}

/**
 * Class User
 *
 * @property app\models\Users $identity
 */
class User extends app\models\Users
{
}

spl_autoload_register(['Yii', 'autoload'], true, true);
Yii::$classMap = require(__DIR__ . '/../vendor/yiisoft/yii2/classes.php');
Yii::$container = new yii\di\Container();
