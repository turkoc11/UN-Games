<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Lang */
/* @var $form yii\widgets\ActiveForm */
?>


<?php $form = ActiveForm::begin([ 'class' => 'form-horizontal no-mlr' ]); ?>

<ul class="nav nav-tabs">
    <li class="active" style="margin-left: 15px;">
        <a data-toggle="tab" href="#top">
            <?= Html::img(\yii\helpers\Url::to(Yii::$app->controller->defaultLang->flag), [ 'class' => 'img-square', 'style' => 'width:30px;' ]) ?>
        </a>
    </li>
</ul>

<?= $form->errorSummary($model, [ 'class' => 'alert-danger alert fade in form_error_summary' ]); ?>

<div id="top" class="tab-pane fade in active form_tab">
    <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">
            <?= $form->field($model, 'url')->textInput([ 'maxlength' => true ]) ?>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
            <?= $form->field($model, 'name')->textInput([ 'maxlength' => true ])
                ->label($model->attributeLabels()[ 'name' ] . ' <span class="alert-danger custom_badge">' . Yii::t('app_admin', 'AFFECTS ICON!' . '</span>')) ?>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
            <?= $form->field($model, 'local')->textInput([ 'maxlength' => true ]) ?>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
            <?= $form->field($model, 'default')->dropDownList($model::defaults(), [ 'class' => 'form-control select2' ]) ?>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
            <?= $form->field($model, 'code')->textInput([ 'maxlength' => true ]) ?>
        </div>
        <div class="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-6 col-xs-12 btn-mw-1">
            <div class="form-group">
                <?= Html::submitButton(\Yii::t('app_admin', 'Save changes'), [ 'class' => 'btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light' ]) ?>
            </div>
        </div>
    </div>
</div>


<?php ActiveForm::end(); ?>
