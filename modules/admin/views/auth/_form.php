<?php

use app\models\Lang;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\AuthItem */
/* @var $form yii\widgets\ActiveForm */
/* @var $permissions array */

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

        <div class="col-md-4 col-sm-6 col-xs-12">

            <?php
            if ($model->rule_name == 'dynamic') {

                if (\app\models\Access::can('developer')) $levels = \app\models\Users::levels(); else {
                    $levels = array_slice(\app\models\Users::levels(), Yii::$app->user->identity->level, null, true);
                }
                echo $form->field($model, 'level')->dropDownList($levels, [ 'class' => 'form-control select2' ]);

            }
            ?>

            <?= $form->field($model, 'description')->textarea([ 'rows' => 6 ]) ?>
        </div>

        <div class="col-md-4 col-sm-6 col-xs-12">
            <?= $this->render('_permissions', [ 'model' => $model, 'permissions' => $permissions ]) ?>
        </div>

        <div class="col-md-4 col-sm-12 col-xs-12">

            <?= Html::label(Yii::t('app_admin', \Yii::t('app_admin', 'Additional Information'))) ?>

            <div class="row additional_row">

                <div class="col-md-6 col-sm-12 col-xs-12">
                    <?= $form->field($model, 'created_at')
                        ->textInput([
                            'disabled' => 'disabled',
                            'value'    => (!empty($model->created_at)) ? date('d.m.Y', $model->created_at) : null,
                        ])
                    ?>
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                    <?= $form->field($model, 'updated_at')
                        ->textInput([
                            'disabled' => 'disabled',
                            'value'    => (!empty($model->updated_at)) ? date('d.m.Y', $model->updated_at) : null,
                        ])
                    ?>
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                    <?= $form->field($model, 'created_by')
                        ->dropDownList([ null => null ] + \app\modules\admin\models\Users::getAll(), [
                            'disabled' => 'disabled',
                            'class'    => 'form-control select2',
                        ])
                    ?>
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                    <?= $form->field($model, 'updated_by')
                        ->dropDownList([ null => null ] + \app\modules\admin\models\Users::getAll(), [
                            'disabled' => 'disabled',
                            'class'    => 'form-control select2',
                        ])
                    ?>
                </div>

            </div>

        </div>

    </div>
    <div class="row">
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
