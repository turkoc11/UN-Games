<?php

use app\modules\main\models\Users;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\Url;


/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Users */
/* @var $form yii\widgets\ActiveForm */
// echo '<pre>';
// var_dump(Url::home(true));
// die();
$yesno = Yii::$app->params[ 'yesno' ];
$statuses = Yii::$app->params[ 'statuses' ];
$gender = Yii::$app->params[ 'gender' ];

$users = \yii\helpers\ArrayHelper::map(Users::find()
    ->asArray()
    ->all(), 'id', 'first_name');
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

        <div class="col-md-5 col-sm-6 col-xs-12">

            <?= $form->field($model, 'first_name')->textInput([ 'maxlength' => true ]) ?>

            <?= $form->field($model, 'last_name')->textInput([ 'maxlength' => true ]) ?>

            <?= $form->field($model, 'gender')->dropDownList($gender, [ 'class' => 'form-control select2' ]) ?>

            <?= $form->field($model, 'email')->textInput([ 'maxlength' => true ]) ?>

            <?= $form->field($model, 'phone')->textInput([ 'maxlength' => true ]) ?>

        </div>

        <div class="col-md-7 col-sm-12 col-xs-12">

            <div class="row">

                <div class="col-md-6 col-sm-12 col-xs-12">

                    <?= $form->field($model, 'status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    <?= $form->field($model, 'email_verified')->dropDownList($yesno, [ 'class' => 'form-control select2' ]) ?>
                    <?= $form->field($model, 'password_hash')->passwordInput([ 'maxlength' => true, 'value' => '']) ?>
                    <?= $form->field($model, 'password_repeat')->passwordInput([ 'maxlength' => true]) ?>

                    <?php
//                    if (\app\models\Access::can('super_admin')) $levels = \app\models\Users::levels(); else {
//                        $levels = array_slice(\app\models\Users::levels(), Yii::$app->user->identity->level, null, true);
//                    }
//                    echo $form->field($model, 'level')->dropDownList($levels, [ 'class' => 'form-control select2' ])
                    ?>
                    <?= $form->field($model, 'balance')->textInput([ 'maxlength' => true ]) ?>
                    <?= $form->field($model, 'roles')->dropDownList(
                        \yii\helpers\ArrayHelper::map(
                            \app\models\AuthItem::find()->where([ 'type' => 1 ])
                                ->andWhere([ '>', 'level', \app\models\Access::can('super_admin') ? 0 : Yii::$app->user->identity->level ])
                                ->all(),
                            'name', 'description'
                        ),
                        [ 'class' => 'select2', 'multiple' => true ])
                    ?>

                </div>

                 <div class="col-md-6 col-sm-12 col-xs-12">
                   
                    <?= $form->field($model, 'tempImage')
                        ->fileInput([
                            'value' => Url::home(true).substr(Url::to($model->image), 1),
                            'class' => 'form-control file_input',
                            'data'  => [
                                'show-upload'             => false,
                                // 'initial-preview-as-data' => true,
                                // 'initial-preview'         => Url::home(true).substr(Url::to($model->image), 1),
                                // 'overwrite-initial'       => true,
                            ],
                        ])->label($model->getAttributeLabel('image')) ?>

                </div>

            </div>

        </div>

    </div>

    <?php if (!$model->isNewRecord) : ?>
        <h3><?= \Yii::t('app_admin', 'Additional Information') ?></h3>
        <div class="row">
            <div class="col-sm-6" style="padding: 0">

                <div class="col-md-6 col-sm-12">
                    <?= $form->field($model, 'created_at')->textInput([
                        'disabled' => 'disabled',
                        'value'    => !empty($model->created_at) ? date('d.m.Y', $model->created_at) : null,
                    ]) ?>
                </div>

                <div class="col-md-6 col-sm-12">
                    <?= $form->field($model, 'updated_at')->textInput([
                        'disabled' => 'disabled',
                        'value'    => !empty($model->updated_at) ? date('d.m.Y', $model->updated_at) : null,
                    ]) ?>
                </div>

               

            </div>
            <div class="col-sm-6" style="padding: 0">

                <div class="col-md-6 col-sm-12">
                    <?= $form->field($model, 'created_by')
                        ->dropDownList($users, [
                            'disabled' => 'disabled',
                            'class'    => 'form-control select2',
                        ]) ?>
                </div>
                <div class="col-md-6 col-sm-12">
                    <?= $form->field($model, 'updated_by')
                        ->dropDownList($users, [
                            'disabled' => 'disabled',
                            'class'    => 'form-control select2',
                        ]) ?>
                </div>            

            </div>
        </div>
    <?php endif; ?>

    <div class="row">
        <div class="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-6 col-xs-12 btn-mw-1">
            <div class="form-group">
                <?= Html::submitButton(\Yii::t('app_admin', 'Save changes'),
                    [ 'class' => 'btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light' ]) ?>
            </div>
        </div>
    </div>

</div>


<?php ActiveForm::end(); ?>
