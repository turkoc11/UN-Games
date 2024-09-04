<?php


use yii\widgets\ActiveForm;
use yii\helpers\Html;

/** @var \app\modules\user\models\LoginForm $loginForm */
?>
<?php $formLogin = ActiveForm::begin([
    'enableAjaxValidation' => true,
    'id'                   => 'loginform',
    'action'               => Yii::$app->urlManager->createUrl('/login'),
    'options'              => [
        'class' => 'form-horizontal new-lg-form no-mlr login-form'
    ]
]); ?>

<div id="app">
    <section class="section">
        <div class="container mt-5">
            <div class="row">
                <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
<!--                    <div class="login-brand">-->
<!--                        <img src="--><?php //= Yii::$app->controller->coreSettings->logo;?><!--" alt="logo" width="100" class="shadow-light rounded-circle">-->
<!--                    </div>-->

                    <div class="card card-primary">
<!--                        <div class="card-header"><h4>--><?php //= Yii::t('app', 'Sign in') ?><!--</h4></div>-->

                        <div class="card-body">
<!--                            <p>--><?php //= Yii::t('app', 'The health care and automatization') ?><!--</p>-->
                            <?= $formLogin->field($loginForm, 'email', [ 'template' => '{label}{input}{error}' ])
                                        ->textInput([ 'class' => 'form-control', 'placeholder' => Yii::t('app', 'Email') ])
                                        ->label(Yii::t('app', 'Email'), [ 'class' => '' ]) ?>

                            <?= $formLogin->field($loginForm, 'password', [ 'template' => '{label}{input}{error}' ])
                                ->passwordInput([ 'class' => 'form-control', 'placeholder' => Yii::t('app', 'Password') ])
                                ->label(Yii::t('app', 'Password'), [ 'class' => '' ]) ?>



                                <div class="form-group">
                                    <button type="submit" class="btn btn-primary btn-lg btn-block" tabindex="4">
                                        <?= Yii::t('app', 'Login') ?>
                                    </button>
                                </div>
                            </form>

                            <?php /*
                            <div class="text-center mt-4 mb-3">
                                <div class="text-job text-muted">Login With Social</div>
                            </div>
                            <div class="row sm-gutters">
                                <div class="col-6">
                                    <a class="btn btn-block btn-social btn-facebook">
                                        <span class="fab fa-facebook"></span> Facebook
                                    </a>
                                </div>
                                <div class="col-6">
                                    <a class="btn btn-block btn-social btn-twitter">
                                        <span class="fab fa-twitter"></span> Twitter
                                    </a>
                                </div>
                            </div>
                            */ ?>
                        </div>
                    </div>

                
                </div>
            </div>
        </div>
    </section>
</div>

<?php ActiveForm::end(); ?>


<?php /*

<section id="wrapper" class="new-login-register">
    <div class="new-login-box">
        <div class="white-box">
            <?php $formLogin = ActiveForm::begin([
                'enableAjaxValidation' => true,
                'id'                   => 'loginform',
                'action'               => Yii::$app->urlManager->createUrl('/login'),
                'options'              => [
                    'class' => 'form-horizontal new-lg-form no-mlr'
                ]
            ]); ?>
            <form class="form-horizontal new-lg-form no-mlr" id="loginform" action="#">
                <div class="text-center">
                    <h3 class="box-title m-b-0"><?= Yii::t('app', 'Sign In To Admin panel') ?></h3>
                    <small class="text-center"><?= Yii::t('app', 'Enter your details below') ?></small>
                </div>
                <div class="m-t-20">
                    <?= $formLogin->field($loginForm, 'email', [ 'template' => '{label}{input}{error}' ])
                        ->textInput([ 'class' => 'form-control', 'placeholder' => Yii::t('app', 'Username') ])
                        ->label(Yii::t('app', 'Email Address'), [ 'class' => '' ]) ?>
                </div>
                <?= $formLogin->field($loginForm, 'password', [ 'template' => '{label}{input}{error}' ])
                    ->passwordInput([ 'class' => 'form-control', 'placeholder' => Yii::t('app', 'Password') ])
                    ->label(Yii::t('app', 'Password'), [ 'class' => '' ]) ?>

                <div class="form-group text-center m-t-20">
                    <?= Html::submitButton(Yii::t('app', 'Log In'),
                        [ 'class' => 'btn btn-info btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light' ]) ?>
                </div>
                <div class="form-group">
                    <?= Html::a(Yii::t('app', '<i
                            class="fa fa-lock m-r-5"></i> ' . Yii::t('app', 'Forgot pwd?')), 'javascript:void(0)',
                        [ 'class' => 'text-dark pull-right', 'id' => 'to-recover' ]) ?>
                </div>

            </form>
            <?php ActiveForm::end(); ?>
            <?php $formRecover = ActiveForm::begin([
                'enableAjaxValidation' => true,
                'id'                   => 'recoverform',
                'action'               => Yii::$app->urlManager->createUrl('/login'),
                'options'              => [
                    'class' => 'form-horizontal new-lg-form no-mlr'
                ]
            ]); ?>
            <div class="text-center">
                <h3 class="box-title m-b-0"><?= Yii::t('app', 'Restore Password') ?></h3>
                <small class="text-center"><?= Yii::t('app', 'Please enter your email address and we will send you new password') ?></small>
            </div>
            <div class="form-group m-t-20">
                <?= $formRecover->field($recoverForm, 'email', [ 'template' => '{label}{input}{error}' ])
                    ->textInput([ 'class' => 'form-control', 'placeholder' => Yii::t('app', 'Username') ])
                    ->label(Yii::t('app', 'Email Address')) ?>
            </div>
            <div class="form-group text-center m-t-20">
                <?= Html::submitButton(Yii::t('app', 'Restore password'),
                    [ 'class' => 'btn btn-info btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light' ]) ?>
            </div>
            <div class="form-group m-b-0">
                <div class="text-center">
                    <p>
                        <?= Html::a(Yii::t('app', '<b>I remember my password</b>'), 'javascript:void(0)',
                            [ 'class' => 'm-l-5', 'id' => 'to-login' ]) ?>
                    </p>
                </div>
            </div>
            <?php ActiveForm::end(); ?>

        </div>
    </div>
</section>
*/?>