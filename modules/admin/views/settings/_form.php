<?php

use app\models\Lang;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Settings */
/* @var $form yii\widgets\ActiveForm */
?>


<?php $form = ActiveForm::begin([ 'class' => 'form-horizontal no-mlr' ]); ?>

<ul class="nav nav-tabs">
    <li class="active" style="margin-left: 15px;">
        <a data-toggle="tab" href="#top">
            <?= Html::img(\yii\helpers\Url::to(Yii::$app->controller->defaultLang->flag), [ 'class' => 'img-square', 'style' => 'width:30px;' ]) ?>
        </a>
    </li>

    <li>
        <a data-toggle="tab" href="#top-mt" style="color: black; font-weight: bolder;">
            <?= \Yii::t('app_admin', 'Maintenance access') ?>
        </a>
    </li>
</ul>

<?= $form->errorSummary($model, [ 'class' => 'alert-danger alert fade in form_error_summary' ]); ?>

<div id="top" class="tab-pane fade in active form_tab">
    <div class="row">
        <h5><?= \Yii::t('app_admin', 'Main') ?></h5>
                    <div class="col-md-6 col-sm-12 col-xs-12">
                        <?= $form->field($model, 'logo_txt')->textInput([ 'maxlength' => true ]) ?>
                    </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
            <?= $form->field($model, 'slogan')->textInput([ 'maxlength' => true ]) ?>
        </div>
                    <div class="col-md-6 col-sm-12 col-xs-12">
                        <?= $form->field($model, 'copy')->textInput([ 'maxlength' => true ]) ?>
                    </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
            <?= $form->field($model, 'phones')->textInput([ 'maxlength' => true ]) ?>
        </div>        
        <div class="col-md-6 col-sm-12 col-xs-12">
            <?= $form->field($model, 'email')->textInput([ 'maxlength' => true ]) ?>
        </div>

        <div class="col-md-12 col-sm-12 col-xs-12">
            <?= $form->field($model, 'underpage_txt')->textarea([ 'maxlength' => true, 'rows' => 5 ]) ?>
        </div>

    </div>
    <div class="row">
        <h5><?= \Yii::t('app_admin', 'About') ?></h5>
              
        <div class="col-md-6 col-sm-12 col-xs-12">
            <?= $form->field($model, 'address')->textInput([ 'maxlength' => true ]) ?>
        </div>        
<!--        <div class="col-md-6 col-sm-12 col-xs-12">-->
<!--            --><?php //= $form->field($model, 'map_lat')->textInput([ 'maxlength' => true ]) ?>
<!--        </div>-->
<!---->
<!--        <div class="col-md-12 col-sm-12 col-xs-12">-->
<!--            --><?php //= $form->field($model, 'map_lng')->textInput([ 'maxlength' => true]) ?>
<!--        </div>-->

    </div>
    <div class="row">
        <h5><?= \Yii::t('app_admin', 'System') ?></h5>
        <div class="col-md-6 col-sm-12 col-xs-12">
            <?= $form->field($model, 'maintenance')->dropDownList($model::defaults(), [ 'class' => 'form-control select2' ]) ?>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
            <?= $form->field($model, 'cache')->dropDownList($model::defaults(), [ 'class' => 'form-control select2' ]) ?>
        </div>
        <div class="col-md-12 col-sm-12 col-xs-12">
            <?= $form->field($model, 'social')->textarea([ 'maxlength' => true, 'rows' => 6 ]) ?>
        </div>
    </div>
    <div class="row">
        <h5><?= \Yii::t('app_admin', 'SEO') ?></h5>
        <div class="col-md-12 col-sm-12 col-xs-12">
            <?= $form->field($model, 'title')->textarea([ 'maxlength' => true ]) ?>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
            <?= $form->field($model, 'keywords')->textarea([ 'maxlength' => true, 'rows' => 5 ]) ?>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
            <?= $form->field($model, 'description')->textarea([ 'maxlength' => true, 'rows' => 5 ]) ?>
        </div>
    </div>
    <hr>
    <br>
    <div class="row">
        <h5><?= \Yii::t('app_admin', 'Scripts') ?></h5>
        <div class="col-md-4 col-sm-6 col-xs-12">
            <?= $form->field($model, 'head_scripts')->textarea([ 'rows' => 6 ]) ?>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-12">
            <?= $form->field($model, 'body_scripts')->textarea([ 'rows' => 6 ]) ?>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-12">
            <?= $form->field($model, 'end_scripts')->textarea([ 'rows' => 6 ]) ?>
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
            <h5><?= \Yii::t('app_admin', 'Main') ?></h5>
            <div class="col-md-6 col-sm-6 col-xs-12">
                <?= $form->field($model, 'logo_txt_' . $k)->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12">
                <?= $form->field($model, 'slogan_' . $k)->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12">
                <?= $form->field($model, 'copy_' . $k)->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12">
                <?= $form->field($model, 'underpage_txt_' . $k)->textarea([ 'maxlength' => true, 'rows' => 5 ]) ?>
            </div>            
        </div>

        <div class="row">
            <h5><?= \Yii::t('app_admin', 'About') ?></h5>
            <div class="col-md-6 col-sm-6 col-xs-12">
                <?= $form->field($model, 'address_' . $k)->textInput([ 'maxlength' => true ]) ?>
            </div>
             
        </div>
        <div class="row">
            <h5><?= \Yii::t('app_admin', 'SEO') ?></h5>
            <div class="col-md-12 col-sm-12 col-xs-12">
                <?= $form->field($model, 'title_' . $k)->textInput([ 'maxlength' => true ]) ?>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12">
                <?= $form->field($model, 'description_' . $k)->textarea([ 'maxlength' => true, 'rows' => 5 ]) ?>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12">
                <?= $form->field($model, 'keywords_' . $k)->textarea([ 'maxlength' => true, 'rows' => 5 ]) ?>
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
<?php } ?>

<div class="tab-pane fade form_tab" id="top-mt">
    <div class="row">
        <div class="col-sm-12">
            <?= $form->field($model, 'ips')->textarea([ 'rows' => 8 ]) ?>
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

<?php ActiveForm::end(); ?>
