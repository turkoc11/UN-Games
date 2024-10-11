<?php
use yii\widgets\ActiveForm;
?>
<!DOCTYPE html>
<html >
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<?php $formTwoFactorCode = ActiveForm::begin([
    'enableAjaxValidation' => true,
    'id'                   => 'formtwofactorcode',
    'action'               => Yii::$app->urlManager->createUrl('/send-auth-code'),
    'options'              => [
        'class' => 'form-two-factor-code',
        'id' => 'form-two-factor-verify-code'
    ]
]); ?>
<!--                <input type="password" name="email-password" class="email-password" id="">-->
<?= $formTwoFactorCode->field($model, 'two_factor_code')->textInput(['autofocus' => true, 'class' => 'email-password'])?>
<div class="code-button-container">
    <input type="submit" value="<?php echo Yii::t('app', 'Подтвердить')?>" class="email-password-button">
</div>
<?php ActiveForm::end() ?>
</body>
</html>