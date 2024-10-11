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
<?php $formUpdatePassword = ActiveForm::begin([
    'enableAjaxValidation' => true,
    'id'                   => 'updatepasswordform',
    'action'               => Yii::$app->urlManager->createUrl('/update-password'),
    'options'              => [
        'class' => 'form-change-password',
        'id' => 'form-update-password'
    ]
]); ?>
<h1 class="profile-head-text"><?php echo Yii::t('app', 'Change password')?> </h1>

<!--            <input type="text" placeholder="type new username" class="change-nickname-input" name="change-nickname">-->
<?= $formUpdatePassword->field($passwordForm, 'password')->passwordInput(['autofocus' => true]) ?>
<!--            <input type="button" class="change-nickname-accept" value="submit">-->
<?= $formUpdatePassword->field($passwordForm, 'confirm_password')->passwordInput(['autofocus' => true]) ?>
<input type="submit" value="<?php echo Yii::t('app', 'Submit')?>" class="change-nickname-accept">
<!--        </form>-->
<?php ActiveForm::end(); ?>
</body>
</html>