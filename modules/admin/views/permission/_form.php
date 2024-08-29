<?php

use app\models\Lang;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\AuthItem */
/* @var $form yii\widgets\ActiveForm */
?>


<?php $form = ActiveForm::begin([ 'class' => 'form-horizontal no-mlr' ]); ?>

<ul class="nav nav-tabs">
    <li class="active" style="margin-left: 15px;">
        <a data-toggle="tab" href="#top">
            <?= Html::img(\yii\helpers\Url::to(Yii::$app->controller->defaultLang->flag), [ 'class' => 'img-square', 'style' => 'width:30px;' ]) ?>
        </a>
    </li>
    <?php foreach (Lang::getBehaviorsList('lang.default = 0') as $k => $v) { ?>
        <li>
            <a data-toggle="tab" href="#top-<?= $k ?>"><?= $v ?></a>
        </li>
    <?php } ?>
</ul>

<?= $form->errorSummary($model, [ 'class' => 'alert-danger alert fade in form_error_summary' ]); ?>

<div id="top" class="tab-pane fade in active form_tab">
    <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">

            <?= $form->field($model, 'name')->textInput([ 'maxlength' => true ])
                ->label($model->attributeLabels()[ 'name' ] . ' <span class="alert-danger custom_badge">' .
                    Yii::t('app_admin', 'ROUTE TO ACTION!' . '</span>'))
            ?>

            <?= $form->field($model, 'level')
                ->dropDownList(\app\models\Users::levels(), [ 'class' => 'form-control select2', 'value' => 3 ]) ?>

        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">

            <?= $form->field($model, 'area')->textInput([ 'maxlength' => true ]) ?>

            <?= $form->field($model, 'section')->textInput([ 'maxlength' => true ]) ?>

            <?= $form->field($model, 'description')->textarea([ 'rows' => 6 ]) ?>

        </div>
        <div class="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-6 col-xs-12 btn-mw-1">
            <div class="form-group">
                <?= Html::submitButton(\Yii::t('app_admin', 'Save changes'), [ 'class' => 'btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light' ]) ?>
            </div>
        </div>
    </div>
</div>

<?php foreach (Lang::getBehaviorsList() as $k => $v) { ?>

    <div class="tab-pane fade form_tab" id="top-<?= $k ?>">
        <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">

                <?= $form->field($model, 'area_' . $k)->textInput([ 'maxlength' => true ]) ?>

                <?= $form->field($model, 'section_' . $k)->textInput([ 'maxlength' => true ]) ?>

            </div>
            <div class="col-md-6 col-sm-6 col-xs-12">

                <?= $form->field($model, 'description_' . $k)->textarea([ 'rows' => 6 ]) ?>

            </div>
            <div class="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-6 col-xs-12 btn-mw-1">
                <div class="form-group">
                    <?= Html::submitButton(\Yii::t('app_admin', 'Save changes'), [ 'class' => 'btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light' ]) ?>
                </div>
            </div>
        </div>
    </div>

<?php } ?>

<?php ActiveForm::end(); ?>
