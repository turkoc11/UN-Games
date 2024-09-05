<?php

use app\modules\user\assets\AppAsset;
use yii\helpers\Html;

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
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" name="viewport">
    <link rel="apple-touch-icon" sizes="57x57" href="/favicon/Favicon.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/favicon/Favicon.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/favicon/Favicon.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/favicon/Favicon.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/favicon/Favicon.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/favicon/Favicon.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/favicon/Favicon.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/favicon/Favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/Favicon.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="/favicon/Favicon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/Favicon.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon/Favicon.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/Favicon.png">
    <link rel="manifest" href="/favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/favicon/Favicon.png">
    <meta name="theme-color" content="#ffffff">
    <title><?= ($this->title)?Html::encode($this->title):Yii::$app->controller->coreSettings->title ?></title>
    <?= Html::csrfMetaTags() ?>
    

    <?php $this->head() ?>

</head>

<body>

<?php $this->beginBody() ?>

<?= $content; ?>

<?php $this->endBody() ?>

</body>
</html>

<?php $this->endPage() ?>
