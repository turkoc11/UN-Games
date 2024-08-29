<?php

use app\modules\service\assets\AppAsset;
use yii\helpers\Html;

\Yii::$app->assetManager->appendTimestamp = true;

\Yii::$app->assetManager->bundles['yii\web\JqueryAsset'] = [
    'sourcePath' => '@app/assets',
    'baseUrl' => '@web',
    'js' => [
        'modules/jquery.min.js',
    ],
];
\Yii::$app->assetManager->bundles['yii\bootstrap\BootstrapAsset'] = [
    'sourcePath' => '@app/assets',
    'baseUrl' => '@web',
    'css' => [
        //'css/bootstrap.min.css',
    ],
    'js' => [
        //'js/bootstrap.min.js',
    ],
];

/**
 * @var $content mixed
 */

AppAsset::register($this);

?>
<?php $this->beginPage() ?>

<!DOCTYPE html>

<html lang="<?= Yii::$app->language ?>">

<head>

    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title><?= Yii::$app->controller->coreSettings->title ?></title>

    <?= Html::csrfMetaTags() ?>

    <?php $this->head() ?>

</head>

<body>

<?php $this->beginBody() ?>


<div id="app">
    <section class="section">
        <div class="container mt-5">
            <div class="page-error">
                <div class="page-inner">
                    <h1><?= Yii::t('app_admin', "Sorry! We are under maintenance") ?></h1>
                    <div class="page-description">
                        <?= Yii::t('app_admin', "Not available...") ?>
                    </div>
                    <div class="page-search">
                        <div class="mt-3">
                            <a href="<?= \yii\helpers\Url::toRoute('/') ?>"><?= Yii::t('app','Home Page');?></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="simple-footer mt-5">
                <?php echo Yii::$app->controller->coreSettings->copy;?>
            </div>
        </div>
    </section>
</div>





<?php $this->endBody() ?>

</body>

</html>

<?php $this->endPage() ?>
