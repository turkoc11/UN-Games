<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use app\models\Lang;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Feedback */
/* @var $form yii\widgets\ActiveForm */
?>


<?php $form = ActiveForm::begin(['class' => 'form-horizontal no-mlr']); ?>

<ul class="nav nav-tabs">
    <li class="active" style="margin-left: 15px;">
        <a data-toggle="tab" href="#top">
            <?=  Html::img(\yii\helpers\Url::to(Yii::$app->controller->defaultLang->flag), ['class' =>
            'img-square', 'style' => 'width:30px;']) ?>
        </a>
    </li>
    </ul>

<?= $form->errorSummary($model, ['class' => 'alert-danger alert fade in form_error_summary']); ?>

<div id="top" class="tab-pane fade in active form_tab">
    <div class="row">
          <div class="col-md-4 col-sm-6 col-xs-12"> 
  <?= $form->field($model, 'name')->textInput(['maxlength' => true]) ?>
</div>
  <div class="col-md-4 col-sm-6 col-xs-12"> 
  <?= $form->field($model, 'contact')->textInput(['maxlength' => true]) ?>
</div>
  <div class="col-md-4 col-sm-6 col-xs-12"> 
  <?= $form->field($model, 'text')->textarea([
                'rows' => 6,
                'class' => 'redactor_text_area',
                'data' => [
                    'plugins' => [
                        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                        "searchreplace visualblocks visualchars code fullscreen",
                        "insertdatetime media nonbreaking save table contextmenu directionality",
                        "template paste textcolor emoticons",
                    ],
                    'selector' => '.redactor_text_area',
//                    'language' => str_replace('-', '_', Yii::$app->language),
                ],
            ]) ?>
</div>
  <div class="col-md-4 col-sm-6 col-xs-12"> 
  <?= $form->field($model, 'ip')->textInput(['maxlength' => true]) ?>
</div>
  <div class="col-md-4 col-sm-6 col-xs-12"> 
  <?= $form->field($model, 'created_at')->textInput(['data' => ['format' => 'dd.mm.yyyy'], 'class' => 'form-control datepicker', 'value' => date('d.m.Y', $model->created_at)]) ?>
</div>
  <div class="col-md-4 col-sm-6 col-xs-12"> 
  <?= $form->field($model, 'updated_at')->textInput(['data' => ['format' => 'dd.mm.yyyy'], 'class' => 'form-control datepicker', 'value' => date('d.m.Y', $model->updated_at)]) ?>
</div>
        <div class="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-6 col-xs-12 btn-mw-1">
            <div class="form-group">
                <?= Html::submitButton(\Yii::t('app_admin', 'Save changes'), ['class' => 'btn btn-info btn-lg
                btn-block text-uppercase waves-effect waves-light']) ?>
            </div>
        </div>
    </div>
</div>


<?php ActiveForm::end(); ?>
