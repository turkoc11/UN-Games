<?php

use app\models\Access;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use app\models\Lang;
use mihaildev\elfinder\InputFile;
use mihaildev\ckeditor\CKEditor;
use mihaildev\elfinder\ElFinder;
use yii\web\JsExpression;

use yii\helpers\ArrayHelper;


/* @var $this yii\web\View */
/* @var $model app\modules\main\models\Users */
/* @var $form yii\widgets\ActiveForm */


if ($model->isNewRecord) {
    $model->status = 1;
}else{
    $model->dateofbirth = ($model->dateofbirth)?date("d/m/Y", strtotime($model->dateofbirth)):'';
}

// $model->doctor_id = ($model->doctor_id)?:0;
// $model->is_doctor = ($model->is_doctor)?:0;

$doctors[0] = Yii::t('app', 'N/A');

?>


<?php $form = ActiveForm::begin(['class' => 'form-horizontal no-mlr']); ?>

<?= $form->errorSummary($model, ['class' => 'alert-danger alert fade in form_error_summary']); ?>


<div class="tab-content">

    <div id="top" class="tab-pane fade show active">


        <div class="row">
            <div class="col-md-6 col-sm-12 col-xs-12">
                <?= $form->field($model, 'first_name')
                    ->textInput(['maxlength' => true]) ?>
                <?= $form->field($model, 'last_name')
                    ->textInput(['maxlength' => true]) ?>
                <?= $form->field($model, 'notes')->widget(CKEditor::className(), [
                    'editorOptions' =>
                        ElFinder::ckeditorOptions('elfinder', [
                            'preset' => 'basic',
                            'inline' => false
                        ]),
                ]); ?>
            </div>

            <div class="col-md-6 col-sm-12 col-xs-12">
                <?= $form->field($model, 'gender')->dropDownList(Yii::$app->params['gender'], ['class' => ' select2']) ?>
                <?= $form->field($model, 'dateofbirth')
                    ->textInput(['maxlength' => true, 'class'=>'form-control datemask', 'placeholder' => 'DD/MM/YYYY']) ?>
                <?= $form->field($model, 'email')
                    ->textInput(['maxlength' => true, 'type' => 'email']) ?>
                <?= $form->field($model, 'phone')
                    ->textInput(['maxlength' => true, 'class'=>'form-control phone-number', 'placeholder' => '050 000 0000']) ?>
            </div>


            <div class="col-md-6 col-sm-12 col-xs-12">

            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 col-lg-12">

            </div>


            <div class="col-md-6 col-sm-12 col-xs-12">

            </div>

        </div>


        <h2 class="section-title"><?= Yii::t('app', 'Attributes') ?></h2>
        <p><?= Yii::t('app', 'Details') ?></p>

        <div class="row">

            <div class="col-md-4 col-sm-12 col-xs-12">
                <?= $form->field($model, 'doctor_id')->dropDownList($doctors, ['class' => ' select2']) ?>
            </div>          

        </div>
        <div class="row">

            <div class="col-md-4 col-sm-12 col-xs-12">
                <?= $form->field($model, 'status')
                    ->dropDownList(Yii::$app->params['statuses']) ?>
            </div>

           



            <div class="col-md-4 col-sm-12 col-xs-12">
                <?= $form->field($model, 'personal_code')
                    ->textInput(['maxlength' => true, 'readonly' => true]) ?>
            </div>


        </div>


        <div class="row">

            <div class="col-md-12 text-right">
                <div class="form-group">
                    <?= Html::submitButton(\Yii::t('app', 'Save changes'),
                        ['class' => 'btn btn-primary ']) ?>
                </div>
            </div>

        </div>


    </div>


</div>


<?php ActiveForm::end(); ?>
