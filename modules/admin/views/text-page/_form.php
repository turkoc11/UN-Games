<?php

use app\modules\admin\models\Lang;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use mihaildev\elfinder\InputFile;
use mihaildev\ckeditor\CKEditor;

/* @var $this yii\web\View */
/* @var $model app\models\Benefits */
/* @var $form yii\widgets\ActiveForm */
$statuses = Yii::$app->params[ 'statuses' ];
$types = Yii::$app->params['types'];
$main = Yii::$app->params['main'];
?>

<?php $form = ActiveForm::begin(['options' => ['class' => 'form']]); ?>
<?= $form->errorSummary($model, ['class' => 'alert-danger alert fade in']); ?>

<div class="box">
    <div class="box-header with-border">
        <h3 class="box-title">
            <?= $this->title; ?>
        </h3>
        <div class="box-tools pull-right">
            
        </div>
    </div>
    <!-- /.box-header -->
    <div class="box-body" style="padding: 10px 0">
        <ul class="nav nav-tabs">
            <li class="active" style="margin-left: 15px;">
                <a data-toggle="tab" href="#top"><?= Yii::$app->mv->gt('Data', [], false) ?></a>
            </li>

        </ul>

        <div class="tab-content" style="padding: 10px">
            <div id="top" class="tab-pane fade in active">
                <div class="row">
                    <div class="col-sm-6">
                        <?= $form->field($model, 'title')->textInput(['maxlength' => true]) ?>

                      <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">
                        <?= $form->field($model, 'url')
                            ->dropDownList(Yii::$app->params[ 'static_pages' ]) ?>
                    </div>

                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Block 1') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'introduction_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">

                        <?= $form->field($model, 'introduction_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>

                    <div class="col-sm-12">
                        <?= $form->field($model, 'introduction_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->introduction_description]);?>
                    </div>
                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Block 2') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'crs_faq_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">


                        <?= $form->field($model, 'crs_faq_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>

                    <div class="col-sm-12">
                        <?= $form->field($model, 'crs_faq_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->crs_faq_description]);?>
                    </div>
                </div>

                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Block 3') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'crs_footer_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>
                    <div class="col-sm-6">

                        <?= $form->field($model, 'crs_footer_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>

                    <div class="col-sm-12">
                        <?= $form->field($model, 'crs_footer_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->crs_footer_description]);?>
                    </div>
                </div>

            </div>


        </div>
    </div>
    <div class="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-6 col-xs-12 btn-mw-1">
            <div class="form-group">
                <?= Html::submitButton(\Yii::t('app_admin', 'Save changes'),
                    [ 'class' => 'btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light' ]) ?>
            </div>
        </div>
    <!-- /.box-body -->
   
</div>

<?php ActiveForm::end(); ?>
