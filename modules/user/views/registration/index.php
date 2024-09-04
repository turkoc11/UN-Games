<?php

use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\users\RegisterForm */
/* @var $form ActiveForm */

$this->title = Yii::t('app', 'Зареєструватися');
?>

<div class="container">
    <div class="row d-flex">
        <div class="col-12 py-5">
            <div class="users-users-register">

                <h2 class="registration-big-text"><?= Html::encode($this->title) ?></h2>

                <p class="registration-top-text"><?= Yii::t('app', 'Поля з * обов\'язкові для заповнення') ?></p>

                <?php $form = ActiveForm::begin([
                    'id' => 'registration-form',
                    'action' => 'registration-save',
                    'enableAjaxValidation' => true,
                    'validationUrl' => 'registration-validate',
                ]); ?>
                <div class="row">
                    <div class="col-md-6 form-registration-container">                       

                        <?= $form->field($model, 'email')->textInput(['autofocus' => true]) ?>

<!--                        --><?php //= $form->field($model, 'phone')->textInput(['type' => 'tel', 'autofocus' => true]) ?>

                        <?= $form->field($model, 'password')->passwordInput() ?>

                        <?= $form->field($model, 'passwordConfirm')->passwordInput() ?>  
                        
<!--                        --><?php //= $form->field($model, 'sms_code')->textInput(['autofocus' => true]) ?><!--                      -->
                       

                      
<?= Html::submitButton(Yii::t('app', 'Зареєструватися'), [
                                'class' => 'btn btn-primary',
                                'id' => 'btn-submit'
                            ]) ?>

                    </div>
                </div>
                <div class="row registration-check">
                    <div class="col-md-6">
                        <div class="form-group">
                            
                            <div>
                                <span class="registration-check-text"><?= Yii::t('app', 'Вже є акаунт?') ?></span>
                                <span><a href="/login" class="registration-check-link"><?= Yii::t('app', 'Увійти') ?></a></span>
                            </div>
                        </div>
                    </div>
                </div>

                <?php ActiveForm::end(); ?>

            </div>
        </div>
    </div>
</div>


<!-- Modal -->
<!--<div class="modal fade" id="message-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">-->
<!--    <div class="modal-dialog">-->
<!--        <div class="modal-content">-->
<!--            <div class="modal-body">-->
<!--                --><?php //= Yii::t('app', 'Заявка на реєстрацію успішно створена. Після активації вашого акаунту на вказаний email прийде лист з підтвердженням.') ?>
<!--            </div>-->
<!--            <div class="modal-footer">-->
<!--                <button type="button" class="btn btn-default" id="close" data-dismiss="modal">--><?php //= Yii::t('app', 'Закрити') ?><!--</button>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->