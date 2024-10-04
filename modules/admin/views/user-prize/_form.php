<?php

use app\modules\admin\models\Lang;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use mihaildev\elfinder\InputFile;
use mihaildev\ckeditor\CKEditor;
use kartik\select2\Select2;

/* @var $this yii\web\View */
/* @var $model app\models\UserPrize */
/* @var $form yii\widgets\ActiveForm */
$statuses = Yii::$app->params[ 'statuses' ];
$types = Yii::$app->params['newsTypes'];
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
<!--            --><?php //foreach (Lang::getBehaviorsList() as $k => $v) { ?>
<!--                <li>-->
<!--                    <a data-toggle="tab" href="#top---><?php //= $k ?><!--" style="max-height: 42px;">--><?php //= $v ?><!--</a>-->
<!--                </li>-->
<!--            --><?php //} ?>

        </ul>

        <div class="tab-content" style="padding: 10px">
            <div id="top" class="tab-pane fade in active">
                <div class="row">

<!--                    <div class="col-md-12 col-sm-12 col-xs-12 col-lg-12">-->
                    <div class="col-sm-4">
                        <?= $form->field($model, 'user_id')
                            ->widget(Select2::classname(), [
                                'data' => $users,
                                'name' => 'user_id',

//                        'language' => 'de',
                                'options' => ['multiple' => false, 'value' =>  $model->user_id],
                                'maintainOrder' => true,
//                                'disabled' => $hidden,
                                'pluginOptions' => [
//                            'maintainOrder' => true,
//                            'tags' => true,
                                ],
                            ]); ?>
                    </div>
                    <div class="col-sm-4">
                        <?= $form->field($model, 'prize_id')
                            ->widget(Select2::classname(), [
                                'data' => $prizes,
                                'name' => 'prize_id',

//                        'language' => 'de',
                                'options' => ['multiple' => false, 'value' =>  $model->prize_id],
                                'maintainOrder' => true,
//                                'disabled' => $hidden,
                                'pluginOptions' => [
//                            'maintainOrder' => true,
//                            'tags' => true,
                                ],
                            ]); ?>
                    </div>


                </div>
            </div>

<!--            --><?php //foreach (Lang::getBehaviorsList() as $k => $v) { ?>
<!--                <div class="tab-pane fade" id="top---><?php //= $k ?><!--">-->
<!--                    <div class="row">-->
<!--                        <div class="col-sm-6">-->
<!--                            --><?php //= $form->field($model, 'name_' . $k)->label($model->getAttributeLabel('name') . ' ' . $v); ?>
<!--                        </div>-->
<!--                        <div class="col-sm-6"></div>-->
<!--                        <div class="col-sm-12">-->
<!--                        --><?php //= $form->field($model, 'description_'. $k)->widget(CKEditor::className(), [
//                            'editorOptions' =>
//                            [
//                                    'preset' => 'full',
//                                    'inline' => false
//                                ],
//                        ])->textarea(['language' => str_replace('-', '_', Yii::$app->language),]); ?>
<!---->
<!--                        </div>-->
<!---->
<!---->
<!--                    </div>-->
<!---->
<!--                </div>-->
<!---->
<!--            --><?php //} ?>
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
