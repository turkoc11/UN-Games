<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\SourceMessage */

$this->title = $this->title ?: Yii::t('app_admin', 'Translations');
$this->params[ 'breadcrumbs' ][] = [ 'label' => $this->title, 'url' => [ 'index' ] ];
$this->params[ 'breadcrumbs' ][] = $this->title;
?>

<div class="container-fluid ps-ptb-30">
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">

                <div class="tb-hd-wp">
                    <div class="ttl-wp">
                        <h3 class="box-title"><?= Yii::t('app_admin', rtrim($this->title, 's')) ?> <?= Yii::t('app_admin', 'info') ?></h3>
                    </div>
                    <div class="navs-wp">
                        <?= Html::a('<i class="ti-back-left"></i>' . Yii::t('app_admin', 'Back to list'), [ 'index' ], [ 'class' => 'btn btn-success btn-rounded' ]) ?>
                    </div>
                </div>

                <?= $this->render('_form', [ 'model' => $model, ]) ?>

            </div>
        </div>
    </div>
</div>
