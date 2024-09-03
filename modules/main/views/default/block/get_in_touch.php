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
$first_name = 'Имя';
?>

<section class="section section-get-in-touch">
    <div class="container">
        <div class="section-in">
            <div class="section-heading">
                <span class="section-heading__line"></span>
<!--                <h2 class="section-title section-title--h2">--><?php //echo $content->title ?><!--</h2>-->
                        <h3 class="contact-form-big-text"><?php echo Yii::t('app', 'Поздоровайтесь :)')?> </h3>
                        <div class="contact-form-small-text"><?php echo Yii::t('app', 'Заполните небольшую форму обратной связи снизу, и мы обязательно вам ответим!')?></div>
            </div>
            <?php $model = $this->params['headerContent']['feedback']; ?>
            <div class="section-body">
                <?php $form = ActiveForm::begin([ 'id' => 'contact-form', 'method' => 'POST', 'options' => [
                'class' => 'form'
                ], 'action' => 'feedback/create',
                    'enableClientScript' => false,
                    'enableAjaxValidation' => true,
                ]); ?>

                <div class="form-field">
		<?php echo Yii::t('app', 'First name *')?> 
                    <?= $form->field($model, 'first_name', [ 'template' => '<label for="first-name"  data-wow-duration="1s" data-wow-delay="0.1s">   </label> {hint}{error} 
                                                 <input id="first-name" type="text" name="Feedback[first_name]" aria-required="true"  data-constraints="@Required @JustLetters"/>
                                                '])
                        ->textInput()->label(Yii::t('app', 'First name *'));
                    ?>

                    <span class="form-field__line"></span>
                    <span class='error-first_name form-span' style="display:none"></span>
                    
		   </div>
                    <div class="form-field">
			<?php echo Yii::t('app', 'Last name *')?> 
                        <?= $form->field($model, 'last_name', [ 'template' => '<label for="last-name"  data-wow-duration="1s" data-wow-delay="0.1s"></label> {hint}{error}
                                                 <input type="text" name="Feedback[last_name]" id="last-name" aria-required="true"  data-constraints="@Required @JustLetters"/>
                                                 '])
                            ->textInput();
                        ?>

                        <span class="form-field__line"></span>
                        <span class='error-last_name form-span' style="display:none"></span>
                    </div>
                    <div class="form-field form-field-big">
			<?php echo Yii::t('app', 'Email *')?> 
                        <?= $form->field($model, 'email', [ 'template' => '<label for="email"  data-wow-duration="1s" data-wow-delay="0.1s"></label> {hint}{error}
                                                 <input type="text" id="email" name="Feedback[email]" aria-required="true"  data-constraints="@Required @JustLetters"/>
                                                 '])
                            ->textInput();
                        ?>
<!--                        <label for="email"></label>-->
<!--                        <input id="email" name="email" required type="text"/>-->
                        <span class="form-field__line"></span>
                        <span class='error-email form-span' style="display:none"></span>
                    </div>
                    <div class="form-field form-field-big">
			<?php echo Yii::t('app', 'I\'m interested in *')?> 
                        <?= $form->field($model, 'description', [ 'template' => '<label for="interested" data-wow-duration="1s" data-wow-delay="0.1s"></label> {hint}{error}
                                                 <textarea id="interested" name="Feedback[description]"  aria-required="true"
                                                 data-constraints="@Required @Length(min=10,max=160)"></textarea>
                                                 '])
                            ->textInput();
                        ?>
<!--                        <label>I'm interested in *</label>-->
<!--                        <textarea></textarea>-->
                        <span class="form-field__line"></span>
                        <span class='error-description form-span' style="display:none"></span>
                    </div>
                    <div class="form-checkbox">
                        <div class="form-checkbox-in">
                            <input
                                    class="checkbox"
                                    type="checkbox"
                                    id="accept"
                                    name="accept"
                            />
                            <label class="checkbox-label" for="accept">
                    <span
                    ><?php echo Yii::t('app','I consent to the use of my data in accordance with')?>
                      <a href="/privacy-policy"><?php echo Yii::t('app','Privacy Policy')?></a>.</span
                    ></label>
                        </div>
                    </div>
                    <div class="form-submit">
                        <?= Html::submitButton(\Yii::t('app', 'Send'),
                            [ 'class' => 'btn-big' ]) ?>
                    </div>
                <?php ActiveForm::end(); ?>
            </div>
        </div>
    </div>
</section>
<script>
    $( document ).ready(function() {

    });

    $('#contact-form').on('submit', function (event) {
        const form = document.querySelector('.section-get-in-touch .form');
        const span = document.createElement('span');
        span.classList.add('error-accept', 'form-span');
        span.textContent = 'This field is required!';

        function validateForm(e) {
            $('.form-checkbox-in').append(span);

            if (!form.accept.checked) {

                span.style.visibility = 'visible';
                return false;
            } else {
                span.style.visibility = 'hidden';
                return true;
            }
        }

        form.addEventListener('submit', validateForm);
        event.preventDefault();
        if(form.accept.checked) {
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
                            $('#contact-form')[0].reset();
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
        }
    })
</script>
