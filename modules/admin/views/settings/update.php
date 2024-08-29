<?php

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Settings */

$this->title = $this->title ?: Yii::t('app_admin', 'Settings');
?>

<div class="container-fluid ps-ptb-30">
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">
                <div class="tb-hd-wp">
                    <div class="ttl-wp">
                        <h3 class="box-title"><?= $this->title ?></h3>
                    </div>
                </div>
                <?= $this->render('_form', [ 'model' => $model, ]) ?>
            </div>
        </div>
    </div>
</div>
