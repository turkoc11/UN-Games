<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use app\models\Lang;
use mihaildev\elfinder\InputFile;
use mihaildev\ckeditor\CKEditor;
use mihaildev\elfinder\ElFinder;
use yii\web\JsExpression;

?>
<?php
$settings = $this->params['headerContent']['settings'];

?>

<section class="subscribe-form">
    <div class="container">
        <div class="section-in">
            <?php $model = $this->params['headerContent']['subscribe']; ?>
            <div class="section-body">
                <?php $form = ActiveForm::begin([ 'id' => 'contact-form-subscribe', 'method' => 'POST', 'options' => [
                    'class' => 'form-subscribe'
                ], 'action' => '/subscribe/create',
                    'enableClientScript' => false,
                    'enableAjaxValidation' => true,
                ]); ?>
                <div class="form-field">
                    <?= $form->field($model, 'email', [ 'template' => '<label for="email"  data-wow-duration="1s" data-wow-delay="0.1s">Email *</label> {hint}{error}
                                                 <input type="text" id="email" placeholder="Email" name="Subscribe[email]" aria-required="true"  data-constraints="@Required @JustLetters"/>
                                                 '])
                        ->textInput();
                    ?>
                    <?= $form->field($model, 'locale')->dropDownList(\app\models\Lang::getLangsList(), ['data-toggle' => 'tooltip','class' => ' select2'])->label(Yii::t('app','Выберите язык для почтовых тэмплейтов')) ?>
                    <span class="form-field__line"></span>
                    <span class='error-email form-span' style="display:none"></span>

                    <div class="form-submit-subscribe">
                        <?= Html::submitButton(\Yii::t('app', 'Send'),
                            [ 'class' => 'btn-big' ]) ?>
                    </div>
                    <?= $form->field($model, 'locale')->dropDownList(\app\models\Lang::getLangsList(), ['data-toggle' => 'tooltip','class' => 'select2'])->label(Yii::t('app','Выберите язык для почтовых тэмплейтов')) ?>
                    <?php ActiveForm::end(); ?>
                </div>
            </div>
        </div>
</section>
<script>
    $( document ).ready(function() {

    });

    $('#contact-form-subscribe').on('submit', function (event) {
        const form = document.querySelector('.subscribe-form .form-subscribe');
        const span = document.createElement('span');
        span.classList.add('error-accept', 'form-span');
        span.textContent = 'This field is required!';

        function validateForm(e) {
            $('.form-checkbox-in').append(span);
        }

        form.addEventListener('submit', validateForm);
        event.preventDefault();
        // if(form.accept.checked) {
        var $yiiform = $(this);
        $.ajax({
                type: $yiiform.attr('method'),
                url: $yiiform.attr('action'),
                data: $yiiform.serializeArray()
            }
        )
            .done(function (data) {
                if (data.success) {

                    setTimeout(function (){
                        $('#contact-form-subscribe')[0].reset();
                    }, 100)

                    $('.form-span').hide();

                } else {
                    $('.form-span').hide();
                    if (Object.keys(data).length) {
                        $.each(data, function (k, v) {

                            $('.error-' + k).show();
                            $('.error-' + k).html(v[0]);

                        });
                    }
                }
            })
            .fail(function () {

            })
        return false;
        // }
    })
</script>