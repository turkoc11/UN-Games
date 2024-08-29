<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use app\models\Lang;
use mihaildev\elfinder\InputFile;
use mihaildev\ckeditor\CKEditor;
use mihaildev\elfinder\ElFinder;
use yii\web\JsExpression;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Dynamic */
/* @var $form yii\widgets\ActiveForm */
if($model->isNewRecord){ $model->status=1;}
$view_c = (!$model->isNewRecord && $model->columns==1)?1:0;
$cols = Yii::$app->params['columns'];

?>


<?php $form = ActiveForm::begin([ 'class' => 'form-horizontal no-mlr' ]); ?>

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

<?= $form->errorSummary($model, [ 'class' => 'alert-danger alert fade in form_error_summary' ]); ?>

<div id="top" class="tab-pane fade in active form_tab">
    <div class="row">
        <h5><?=\Yii::t('app_admin', 'Main data');?></h5>
        <div class="col-sm-6">
            <?= $form->field($model, 'title')
                ->textInput([ 'maxlength' => true ]) ?>
        </div>
        <div class="col-sm-6">
            <?= $form->field($model, 'sub_title')
                ->textInput([ 'maxlength' => true ]) ?>
        </div>




    </div>
    <div class="row">
        <?php /*
        <div class="col-md-12 col-sm-12 col-xs-12">
            <?= $form->field($model, 'short_description')->widget(CKEditor::className(), [
                'editorOptions' =>
                    ElFinder::ckeditorOptions('elfinder',[
                        'preset' => 'full',
                        'inline' => false
                    ]),
            ]);?>
        </div>
        */ ?>

        <div class="col-md-6">
            <?= $form->field($model, 'columns')->dropDownList($cols, ['class' => 'form-control select2','onchange'=>'cmapdata(this)']) ?>
        </div>

        <div class="col-md-6">
            <?=  $form->field($model, 'image')->widget(InputFile::className(), [
                'language'      => 'ru',
                'controller'    => 'elfinder', // вставляем название контроллера, по умолчанию равен elfinder
//                'filter'        => ['image', 'application'],    // фильтр файлов, можно задать массив фильтров https://github.com/Studio-42/elFinder/wiki/Client-configuration-options#wiki-onlyMimes
                'template'      => '<div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                'options'       => ['class' => 'form-control file_input'],
                'buttonOptions' => ['class' => 'btn btn-default'],
                'multiple'      => true       // возможность выбора нескольких файлов
            ]);

            ?>
        </div>
        <div id="contacts_adds" class="col-md-6 <?=($view_c)?'':'hidden';?>">
            <div class="col-sm-6">
                <?=  $form->field($model, 'content_image')->widget(InputFile::className(), [
                    'language'      => 'ru',
                    'controller'    => 'elfinder', // вставляем название контроллера, по умолчанию равен elfinder
                    'filter'        => 'image',    // фильтр файлов, можно задать массив фильтров https://github.com/Studio-42/elFinder/wiki/Client-configuration-options#wiki-onlyMimes
                    'template'      => '<div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                    'options'       => ['class' => 'form-control file_input'],
                    'buttonOptions' => ['class' => 'btn btn-default'],
                    'multiple'      => true      // возможность выбора нескольких файлов
                ]);

                ?>
            </div>
        </div>
        <div class="col-sm-6">
            <?= $form->field($model, 'slogan')->textInput(['maxlength' => true]) ?>
        </div>
        <div class="col-md-12 col-sm-12 col-xs-12">
            <?= $form->field($model, 'description')->widget(CKEditor::className(), [
                'editorOptions' => 
                   [
                        'preset' => 'full',
                        'inline' => false
                    ],
            ])->textarea(['value' => $model->description]);?>

        <?= $form->field($model, 'short_description')->widget(CKEditor::className(), [
                'editorOptions' => 
                   [
                        'preset' => 'full',
                        'inline' => false
                    ],
            ])->textarea(['value' => $model->short_description]);?>
        </div>


    </div>





    <div class="row">
        <h5><?=\Yii::t('app_admin', 'System');?></h5>
        <div class="col-sm-12">

            <div class="col-md-4">
                <?= $form->field($model, 'status')
                    ->dropDownList(Yii::$app->params[ 'statuses' ]) ?>
            </div>
            <div class="col-md-4">
                <?= $form->field($model, 'position_in_menu')
                    ->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-md-4">
                <?= $form->field($model, 'in_menu')
                    ->dropDownList(Yii::$app->params[ 'menu' ]) ?>
            </div>
            <div class="col-md-4">
                <?= $form->field($model, 'template')
                    ->dropDownList(Yii::$app->params[ 'dynamic_template' ]) ?>
            </div>
            <div class="col-md-4">
                <?= $form->field($model, 'url')
                    ->textInput([ 'maxlength' => true ]) ?>
            </div>


        </div>

    </div>

    <div class="row">

        <h5><?= \Yii::t('app_admin', 'Meta Information') ?></h5>

            <div class="col-sm-6">
                <?= $form->field($model, 'meta_title')
                    ->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-sm-6">
                <?= $form->field($model, 'meta_keyword')
                    ->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-sm-12">
                <?= $form->field($model, 'meta_description')
                    ->textarea([ 'rows' => 4, 'maxlength' => true ]) ?>
            </div>
            <div class="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-6 col-xs-12 btn-mw-1">
                <div class="form-group">
                    <?= Html::submitButton(\Yii::t('app_admin', 'Save changes'),
                        [ 'class' => 'btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light' ]) ?>
                </div>
            </div>

    </div>
</div>

<?php foreach (Lang::getBehaviorsList() as $k => $v) { ?>
    <div class="tab-pane fade form_tab" id="top-<?= $k ?>">
        <div class="row">
            <h5><?=\Yii::t('app_admin', 'Настройки');?></h5>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <?= $form->field($model, 'title_' . $k)
                    ->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <?= $form->field($model, 'sub_title_' . $k)
                    ->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-sm-12">
<!--                --><?= $form->field($model, 'short_description_' . $k)
                   ->textarea([
                       'rows'  => 6,
                       'class' => 'redactor_text_area',
                       'data'  => [
                           'plugins'  => [
                               "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                               "searchreplace visualblocks visualchars code fullscreen",
                               "insertdatetime media nonbreaking save table contextmenu directionality",
                               "template paste textcolor emoticons",
                           ],
                           'selector' => '.redactor_text_area',
//                           'language' => str_replace('-', '_', Yii::$app->language),
                       ],
                   ]); ?>
            </div>
            <div class="col-sm-12">
                <?= $form->field($model, 'description_'. $k)->widget(CKEditor::className(), [
                    'editorOptions' =>
                        ElFinder::ckeditorOptions('elfinder',[
                            'preset' => 'full',
                            'inline' => false
                        ]),
                ]);?>

            </div>
        </div>


        <div class="row">
            <h5><?= \Yii::t('app_admin', 'Meta Information') ?></h5>
            <div class="col-sm-6">
                <?= $form->field($model, 'meta_title_' . $k)
                    ->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-sm-6">
                <?= $form->field($model, 'meta_keyword_' . $k)
                    ->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-sm-12">
                <?= $form->field($model, 'meta_description_' . $k)
                    ->textarea([ 'rows' => 4, 'maxlength' => true ]) ?>
            </div>
        </div>
        <div class="col-lg-3 col-lg-offset-9 col-md-4 col-md-offset-8 col-sm-6 col-xs-12 btn-mw-1">
            <div class="form-group">
                <?= Html::submitButton(\Yii::t('app_admin', 'Save changes'),
                    [ 'class' => 'btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light' ]) ?>
            </div>
        </div>

    </div>

<?php } ?>
<?php ActiveForm::end(); ?>

<script>function cmapdata(e) {
        if($(e).val()=='1'){
            $('#contacts_adds').removeClass('hidden');
        }else{
            $('#contacts_adds').addClass('hidden');
        }
    }</script>
