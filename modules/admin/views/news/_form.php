<?php

use app\modules\admin\models\Lang;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use mihaildev\elfinder\InputFile;
use mihaildev\ckeditor\CKEditor;

/* @var $this yii\web\View */
/* @var $model app\models\Differences */
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
            <?php foreach (Lang::getBehaviorsList() as $k => $v) { ?>
                <li>
                    <a data-toggle="tab" href="#top-<?= $k ?>" style="max-height: 42px;"><?= $v ?></a>
                </li>
            <?php } ?>

        </ul>

        <div class="tab-content" style="padding: 10px">
            <div id="top" class="tab-pane fade in active">
                <div class="row">
                    <div class="col-sm-6">
                        <?= $form->field($model, 'title')->textInput(['maxlength' => true]) ?>
                    </div>
                    <div class="col-sm-6">
                        <?=  $form->field($model, 'image')->widget(InputFile::className(), [
                            'language'      => 'ru',
                            'controller'    => 'elfinder', // вставляем название контроллера, по умолчанию равен elfinder
                            'filter'        => ['image', 'application'],    // фильтр файлов, можно задать массив фильтров https://github.com/Studio-42/elFinder/wiki/Client-configuration-options#wiki-onlyMimes
                            'template'      => '<div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                            'options'       => ['class' => 'form-control file_input'],
                            'buttonOptions' => ['class' => 'btn btn-default'],
                            'multiple'      => false       // возможность выбора нескольких файлов
                        ]);?>

                    </div>

                    <div class="col-sm-6">
                        <?=  $form->field($model, 'image2')->widget(InputFile::className(), [
                            'language'      => 'ru',
                            'controller'    => 'elfinder', // вставляем название контроллера, по умолчанию равен elfinder
                            'filter'        => ['image', 'application'],    // фильтр файлов, можно задать массив фильтров https://github.com/Studio-42/elFinder/wiki/Client-configuration-options#wiki-onlyMimes
                            'template'      => '<div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                            'options'       => ['class' => 'form-control file_input'],
                            'buttonOptions' => ['class' => 'btn btn-default'],
                            'multiple'      => false       // возможность выбора нескольких файлов
                        ]);?>

                    </div>

                    <div class="col-sm-6">
                        <?= $form->field($model, 'status')->dropDownList($statuses, [ 'class' => 'form-control select2' ]) ?>
                    </div>
                    <div class="col-sm-6">
                        <?= $form->field($model, 'type')->dropDownList($types, [ 'class' => 'form-control select2' ]) ?>
                    </div>

                    <div class="col-sm-12">                        

                        <?= $form->field($model, 'description')->widget(CKEditor::className(), [
                            'editorOptions' => 
                            [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->description]); ?>

                    </div>
                    <div class="col-sm-12">

                        <?= $form->field($model, 'description2')->widget(CKEditor::className(), [
                            'editorOptions' =>
                                [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['value' => $model->description2]); ?>

                    </div>
                </div>
            </div>

            <?php foreach (Lang::getBehaviorsList() as $k => $v) { ?>
                <div class="tab-pane fade" id="top-<?= $k ?>">
                    <div class="row">
                        <div class="col-sm-6">
                            <?= $form->field($model, 'title_' . $k)->label($model->getAttributeLabel('title') . ' ' . $v); ?>
                        </div>
                        <div class="col-sm-6"></div>
                        <div class="col-sm-12">
                        <?= $form->field($model, 'description_'. $k)->widget(CKEditor::className(), [
                            'editorOptions' => 
                            [
                                    'preset' => 'full',
                                    'inline' => false
                                ],
                        ])->textarea(['language' => str_replace('-', '_', Yii::$app->language),]); ?>

                        </div>
                        <div class="col-sm-12">
                            <?= $form->field($model, 'description2_'. $k)->widget(CKEditor::className(), [
                                'editorOptions' =>
                                    [
                                        'preset' => 'full',
                                        'inline' => false
                                    ],
                            ])->textarea(['language' => str_replace('-', '_', Yii::$app->language),]); ?>

                        </div>

                    </div>

                </div>

            <?php } ?>
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
