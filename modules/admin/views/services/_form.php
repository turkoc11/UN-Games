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
                        <?= $form->field($model, 'position')->textInput(['maxlength' => true]) ?>
                    </div>
                    <div class="col-sm-6">
                        <?=  $form->field($model, 'image')->widget(InputFile::className(), [
                            'language'      => 'ru',
                            'controller'    => 'elfinder', // вставляем название контроллера, по умолчанию равен elfinder
                            'filter'        => 'image',    // фильтр файлов, можно задать массив фильтров https://github.com/Studio-42/elFinder/wiki/Client-configuration-options#wiki-onlyMimes
                            'template'      => '<div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                            'options'       => ['class' => 'form-control file_input'],
                            'buttonOptions' => ['class' => 'btn btn-default'],
                            'multiple'      => false       // возможность выбора нескольких файлов
                        ]);?>


                       <?php  /* <?//= $form->field($model, 'status')->dropDownList($model->statuses) ?> */ ?>
                       <?= $form->field($model, 'status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>
                       
                    </div>

                    <div class="col-sm-6">
                        <?=  $form->field($model, 'preview_image')->widget(InputFile::className(), [
                            'language'      => 'ru',
                            'controller'    => 'elfinder', // вставляем название контроллера, по умолчанию равен elfinder
                            'filter'        => 'image',    // фильтр файлов, можно задать массив фильтров https://github.com/Studio-42/elFinder/wiki/Client-configuration-options#wiki-onlyMimes
                            'template'      => '<div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                            'options'       => ['class' => 'form-control file_input'],
                            'buttonOptions' => ['class' => 'btn btn-default'],
                            'multiple'      => false       // возможность выбора нескольких файлов
                        ]);?>

                    </div>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'preview_text')->textInput(['maxlength' => true]) ?>
                    </div>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'link')->textInput(['maxlength' => true]) ?>
                    </div>

                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Block 1') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'expertise_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">

                        <?= $form->field($model, 'expertise_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>

                    <div class="col-sm-12">
                        <?= $form->field($model, 'expertise_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->expertise_description]);?>
                    </div>
                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Block 2') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'ongoing_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">
                        <?=  $form->field($model, 'ongoing_image')->widget(InputFile::className(), [
                            'language'      => 'ru',
                            'controller'    => 'elfinder', // вставляем название контроллера, по умолчанию равен elfinder
                            'filter'        => 'image',    // фильтр файлов, можно задать массив фильтров https://github.com/Studio-42/elFinder/wiki/Client-configuration-options#wiki-onlyMimes
                            'template'      => '<div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                            'options'       => ['class' => 'form-control file_input'],
                            'buttonOptions' => ['class' => 'btn btn-default'],
                            'multiple'      => false       // возможность выбора нескольких файлов
                        ]);?>

                        <?= $form->field($model, 'ongoing_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>

                    <div class="col-sm-12">
                        <?= $form->field($model, 'ongoing_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->ongoing_description]);?>
                    </div>
                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Values') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'structuring_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">

                        <?= $form->field($model, 'structuring_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>

                    <div class="col-sm-12">
                        <?= $form->field($model, 'structuring_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->structuring_description]);?>
                    </div>
                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Advantages') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'what_we_do_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">

                        <?= $form->field($model, 'what_we_do_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>

                    <div class="col-sm-12">
                        <?= $form->field($model, 'what_we_do_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->what_we_do_description]);?>
                    </div>
                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Block 3') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'strategic_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">
                        <?=  $form->field($model, 'strategic_image')->widget(InputFile::className(), [
                            'language'      => 'ru',
                            'controller'    => 'elfinder', // вставляем название контроллера, по умолчанию равен elfinder
                            'filter'        => 'image',    // фильтр файлов, можно задать массив фильтров https://github.com/Studio-42/elFinder/wiki/Client-configuration-options#wiki-onlyMimes
                            'template'      => '<div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                            'options'       => ['class' => 'form-control file_input'],
                            'buttonOptions' => ['class' => 'btn btn-default'],
                            'multiple'      => false       // возможность выбора нескольких файлов
                        ]);?>

                        <?= $form->field($model, 'strategic_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>

                    <div class="col-sm-12">
                        <?= $form->field($model, 'strategic_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->strategic_description]);?>
                    </div>
                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'Block 4') ?></h5>

                    <div class="col-sm-6">

                        <?= $form->field($model, 'text_block_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

                    </div>
                    <div class="col-sm-12">
                        <?= $form->field($model, 'text_block_description')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->text_block_description]);?>
                    </div>
                </div>
                <div class="row">
                    <h5><?= \Yii::t('app_admin', 'FAQs') ?></h5>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'faq_title')->textInput(['maxlength' => true]) ?>

                        <?php /*  <?//= $form->field($model, 'category_id')->dropDownList(ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title')) ?> */?>
                    </div>

                    <div class="col-sm-6">

                        <?= $form->field($model, 'faq_status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>

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
