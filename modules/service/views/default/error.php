<?php

/* @var $this yii\web\View */
/* @var $name string */
/* @var $message string */

/* @var $exception Exception */


use yii\helpers\Html;

$this->title = $this->title ?: $name;
// var_dump(222222222);
// die();
?>

    <div id="app">
        <section class="section">
            <div class="container mt-5">
                <div class="page-error">
                    <div class="page-inner">
                        <h1><?= $exception->statusCode ?></h1>
                        <div class="page-description">
                            <?= Yii::t('app', nl2br(Html::encode($message))); ?>
                        </div>
                        <div class="page-search">
                            <div class="mt-3">
                                <a href="<?= \yii\helpers\Url::toRoute('/') ?>"><?= Yii::t('app','Home Page');?></a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>



<?php /*
<div class="spinner-cover">
    <div class="spinner-inner">
        <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
    </div>
</div>


<section id="wrapper" class="error-page">
    <div class="container-fluid">
        <div class="container">
            <div class="primary margin-15">
                <div class="row">
                    <div class="col-md-12">
                        <article class="section_margin">
                            <div class="post-content">
                                <div class="single-content animate-box">
                                    <div class="page_404 animate-box">
                                        <h1><?= $exception->statusCode ?></h1>
                                        <h2><?= Html::encode($this->title) ?></h2>
                                        <p><?= nl2br(Html::encode($message)) ?> </p>
                                        <p><a href="<?= \yii\helpers\Url::toRoute('/') ?>" class="alith_button"><?= Yii::t('app','Home Page');?></a></p>
                                    </div>
                                </div> <!--single content-->
                        </article>
                    </div>
                </div>
            </div> <!--.primary-->

        </div>
    </div>
</section>
*/?>