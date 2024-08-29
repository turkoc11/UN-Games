<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use app\modules\admin\models\Message;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\SourceMessage */
/* @var $form yii\widgets\ActiveForm */

?>


<?php $form = ActiveForm::begin([ 'class' => 'form-horizontal no-mlr' ]); ?>

<ul class="nav nav-tabs">
    <li class="active" style="margin-left: 15px;">
        <a data-toggle="tab" href="#top"> <?= \Yii::t('app_admin', 'Data') ?></a>
    </li>
</ul>

<?= $form->errorSummary($model, [ 'class' => 'alert-danger alert fade in form_error_summary' ]); ?>

<div id="top" class="tab-pane fade in active form_tab">
    <div class="row">

        <div class="row">

            <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <?= $form->field($model, 'category')->dropDownList(
                            \yii\helpers\ArrayHelper::map($model::getCategories(), 'category', 'category'),
                            [ 'class' => 'form-control select2', 'disabled' => $model->isNewRecord ? false : true ]
                        ) ?>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <?= $form->field($model, 'message')->textarea([ 'rows' => 6, 'disabled' => $model->isNewRecord ? false : true ]) ?>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="row">
                    <?php if (!$model->isNewRecord) { ?>
                        <?php foreach ($model->messages as $language => $message) : ?>

                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <?= $form->field($model->messages[ $language ], '[' . $language . ']translation')
                                    ->textarea([ 'rows' => 4 ])
                                    ->label($language) ?>
                            </div>

                        <?php endforeach; ?>
                    <?php } else { ?>
                        <?php foreach (Yii::$app->controller->langs as $language) {
                            $language = $language->local;
                            $message = new Message([ 'language' => $language, 'translation' => '' ]);
                            $model->newMessages += [ $language => $message ];
                            ?>

                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <?= $form->field($model->newMessages[ $language ], '[' . $language . ']language')
                                    ->hiddenInput()->label(false) ?>
                                <?= $form->field($model->newMessages[ $language ], '[' . $language . ']translation')
                                    ->textarea([ 'rows' => 4 ])->label($language) ?>
                            </div>

                        <?php }; ?>
                    <?php } ?>
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
</div>


<?php ActiveForm::end(); ?>
