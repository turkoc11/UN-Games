<?php

$params = \yii\helpers\ArrayHelper::merge(
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
    // require(__DIR__ . '/aliases.php')
);
$db = require __DIR__ . '/db.php';

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => [
        'log',
        //'gii',
    ],
    'modules' => [
//        'gii' => ['class' => 'app\modules\gii\Module'],
        'main' => ['class' => 'app\modules\main\Module'],
        'admin' => [
            'class' => 'app\modules\admin\Module',
            'controllerMap' => [
                'elfinder' => [
                    'class' => 'mihaildev\elfinder\Controller',
                    'access' => ['@'],
                    'disabledCommands' => ['netmount'],
                    'roots' => [
                        [
                            'baseUrl' => '@web',
                            'basePath' => '@webroot',
                            'path' => 'files/u',
                            'name' => 'Files'
                        ]
                    ]
                ]
            ],

        ],
        'user' => ['class' => 'app\modules\user\Module'],
        // 'site' => ['class' => 'app\modules\site\Module'],
        'service' => ['class' => 'app\modules\service\Module'],
    ],
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm' => '@vendor/npm-asset',
    ],
    'components' => [
        'request' => [
            'cookieValidationKey' => 'eE544gZZ0dfg442',
            'class' => 'app\components\LangRequest',
            'baseUrl' => '',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
        ],
        'redis' => [
            'class' => 'yii\redis\Connection',
            'hostname' => 'localhost',
            'port' => 6379,
            'database' => 9,
//            'password' => 'Xjey8cuC73fwtGBE',
        ],
        'cache' => [
            'class' => 'app\components\Redis',
        ],
        'mailer' => [
            'class' => 'yii\sendinblue\transactional\Mailer',
            'apikey' => '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',
        ],
        'stripe' => [
            'class' => 'ruskid\stripe\Stripe',
            'publicKey' => "pk_test_51Ploc5BXDmYtXMwttNzTHLRqLaoUd085xv2RYpP8a5ijuDOQat907zdvaoy416qvuFZZkCsX1WodTnhL95W1eKEo00YMHWXCxZ",
            'privateKey' => "sk_test_51Ploc5BXDmYtXMwtyTU4w8xaErOll0oPB6pefnMPVfMuNnREmIDWoD7IaeFxnfI9QH041OsjfiYkYmN3kCif2GL000UUPMVHRJ",
        ],
        'sms' => [
            'class' => '\kop\y2ts\TurboSMS',
            'username' => 'denver231976',
            'password' => 'Nhy67ujm',
            'alphaName' => 'MyWebsite',
        ],
        'mv' => [
            'class' => 'app\components\Mv',
        ],
        'session' => [
            'class' => 'yii\redis\Session',
            'cookieParams' => ['lifetime' => 3600 * 24 * 3],
            'timeout' => 3600 * 24 * 3
        ],
        'cookies' => [
            'class' => 'yii\web\Cookie',
            'secure' => true
        ],
        'i18n' => [
            'translations' => [
                'app*' => [
                    'class' => 'yii\i18n\DbMessageSource',
                    'sourceMessageTable' => '{{%source_message}}',
                    'messageTable' => '{{%message}}',
                   'enableCaching' => true,
                   'cachingDuration' => 3600,
                    'on missingTranslation' => ['app\components\TranslationEventHandler', 'handleMissingTranslation'],
                    'sourceLanguage' => 'en-En',
                    //'forceTranslation' => true,
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'service/default/error',
        ],
        'BitckoMailer'=>[
            'class'=>'bitcko\mailer\BitckoMailer',
            'SMTPDebug'=> 0, // 0 to disable, optional
            'isSMTP'=>true, // default true
            'Host'=>'', //optional
            'SMTPAuth'=>true, //optional
            'Username'=>'', //optional
            'Password'=>'', //optional
            'SMTPSecure'=>'tls', //optional, tls or ssl
            'Port'=>587, //optional, smtp server port
            'isHTML'=>true, // default true
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => $db,
        'urlManager' => require(__DIR__ . '/url.php'),
        'authManager' => [
            'class' => 'yii\rbac\DbManager',
        ],
        'user' => [
            'identityClass' => 'app\models\Users',
            'enableAutoLogin' => true,
            'loginUrl' => ['/user/default/login'],          
            'identityCookie' => [
                'name' => '_identity',
                'secure' => true,
            ],
            'authTimeout' => 3600 * 24 * 3, // auth expire
        ],
//        'imageCache'   => [
//            'class'     => '\corpsepk\yii2imagecache\ImageCache',
//            'cachePath' => '@app/web/files/cache',
//            'cacheUrl'  => '/files/cache',
//        ],
        //'assetManager' => [
        //    'class' => 'app\components\AssetManager'
        //],
        'imageCache' => [
            'class' => 'letyii\imagecache\imageCache',
            'cachePath' => '@app/web/files/u2',
            'cacheUrl' => '/files/u2',
        ],
    ],
    /*
    'controllerMap' => [
        'elfinder' => [
            'class' => 'mihaildev\elfinder\PathController',
            'access' => ['@'],
            'root' => [
                'path' => '@app/web/files/u',
                'name' => 'Files'
            ],
        ]
    ],
    */
    'container' => [
        'singletons'  => [
            LireinCore\Yii2ImgCache\ImgCache::class => [
                ['class' => LireinCore\Yii2ImgCache\ImgCache::class],
                [
                    require(__DIR__ . '/imgcache.php'),
                ]
            ],
        ]
    ],
    'params' => $params,
];

if (YII_ENV_DEV && false) {
    //$config['components']['assetManager']['forceCopy'] = true;
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];
    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'app\modules\gii\Module',
        'allowedIPs' => ['*'],
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
