<?php
use yii\widgets\ActiveForm;
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
<!--    <link rel="stylesheet" href="profile-styles.css">-->
</head>
<body>
<div class="profile-wrapper">
    <div class="sidebar-profile">
        <div class="sidebar-navigation">
            <a href="" class="sidebar-link">
                <img src="" alt="" class="company-logo-sidebar">
            </a>
            <a href="profile" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Profile information')?></div>
            </a>
            <a href="security" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Security')?></div>
            </a>
            <a href="privacy" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Privacy')?></div>
            </a>
            <a href="transactions" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Transactions history')?></div>
            </a>
        </div>
    </div>
    <div class="profile-main-wrapper">
        <h1 class="profile-head-text">
            <?php echo Yii::t('app', 'Security')?>
        </h1>
        <?php if(!$user->personal_code ) {?>
        <div class="profile-elems">
            <div class="personal-data-head-container">
                <h3 class="profile-elem-name">
                    <?php echo Yii::t('app', 'Password')?>
                </h3>
                <button class="change-personal-data"><?php echo Yii::t('app', 'Change')?></button>
            </div>
        </div>
        <div class="profile-elems">
            <h3 class="profile-elem-name"><?php echo Yii::t('app', 'Смена пароля')?></h3>
            <div class="password-change-text"><?php echo Yii::t('app', 'Письмо с ссылкой для изменения пароля будет отправлено на следующий адрес')?></div>
            <div class="password-change-email"><?php echo $user->email?></div>
            <div class="password-change-button-container">
                <?php $formSendChangePasswordCode = ActiveForm::begin([
                    'enableAjaxValidation' => true,
                    'id'                   => 'formsendchangepasswordcode',
                    'action'               => Yii::$app->urlManager->createUrl('/send-password-link'),
                    'options'              => [
                        'class' => 'form-change-password-send',
                        'id' => 'form-change-password-send-code'
                    ]
                ]); ?>
<!--                --><?php //= $formSendChangePasswordCode->field($sendChangePasswordCode, 'email')->textInput(['autofocus' => true, 'class' => 'personal-data-form-input', 'placeholder' => Yii::t('app', 'New nick name')])->label('') ?>
                <div class="password-change-decline"><?php echo Yii::t('app', 'Decline')?></div>
                <button type="submit" class="password-change-send"><?php echo Yii::t('app', 'Send')?></button>
                <?php ActiveForm::end() ?>
            </div>
        </div>
        <?php }?>
        <div class="profile-elems">
            <div class="personal-data-head-container">
                <h3 class="profile-elem-name">
                    <?php echo Yii::t('app', '2-step authentication')?>
                </h3>
                <button class="change-personal-data"><?php echo Yii::t('app', 'Change')?></button>
            </div>
            <div class="two-step-text">
                <?php echo Yii::t('app', 'Добавьте дополнительный уровень защиты вашей учетной записи. Каждый раз при авторизации с нового устройства вам будет необходимо вводить код безопасности.')?>

            </div>
        </div>

        <div class="profile-elems">
            <h3 class="profile-elem-name"><?php echo Yii::t('app', 'Подключение двухфакторкой авторизации')?></h3>
            <div class="two-step-container">

                <h2 class="two-step-text-small"><?php echo Yii::t('app', 'Предпочитаемый способ связи')?></h2>
                <div class="two-step-button-container">
                    <div class="two-step-button email-two-step"><?php echo Yii::t('app', 'Email')?></div>
<!--                    <div class="two-step-button phone-two-step">--><?php //echo Yii::t('app', 'Phone')?><!--</div>-->
                </div>

                <div class="two-step-email-container active">
                    <?php if(!$user->is_email) {?>
                    <div class="email-verification-not-verified">
                        <h3 class="two-step-text"><?php echo Yii::t('app', 'Ваш код безопасности будет отправлен на следующий электронный адрес:')?></h3>
                        <div class="password-change-email"><?php echo $user->email ?></div>
                        <?php $formSendEmailCode = ActiveForm::begin([
                            'enableAjaxValidation' => true,
                            'id'                   => 'formsendemailcode',
                            'action'               => Yii::$app->urlManager->createUrl('/send-email'),
                            'options'              => [
                                'class' => 'form-send-email-code',
                                'id' => 'form-email-code'
                            ]
                        ]); ?>
                        <div class="password-change-button-container">
                            <button type="submit" class="password-change-send send-email-verification"><?php echo Yii::t('app', 'Send')?></button>
                        </div>
                        <?php ActiveForm::end() ?>
                    </div>
                    <?php }?>

<!--                    <div class="email-verification-verified">-->
<!--                        <h3 class="two-step-text">Вы уже активировали двухфакторную верификацию по данному email адресу, хотите изменить?</h3>-->
<!--                        <div class="password-change-email">test@email.com</div>-->
<!--                        <div class="password-change-button-container">-->
<!--                            <button class="password-change-send send-email-verification">Send</button>-->
<!--                        </div>-->
<!--                    </div>-->
                    <?php if($user->is_phone && $user->is_two_factor) {?>
                    <div class="email-verification-if-phone">
                        <h3 class="two-step-text"><?php echo Yii::t('app', 'Вы уже активировали двухфакторную верификацию по номеру телефона')?></h3>
                    </div>
                    <?php }?>
                    <?php if($user->is_email && $user->is_two_factor) {?>
                    <div class="phone-verification-if-email">
                        <h3 class="two-step-text"><?php echo Yii::t('app', 'Вы уже активировали двухфакторную авторизацию по email')?></h3>
                    </div>
                    <?php }?>
                </div>
<!--                <div class="two-step-phone-container">-->
<!--                    --><?php //if(!$user->is_phone) {?>
<!--                    <div class="phone-verification-not-verified">-->
<!--                        <h3 class="two-step-text">--><?php //echo Yii::t('app', 'Ваш код безопасности будет отправлен на следующий номер телефона:')?><!--</h3>-->
<!--                        <div class="password-change-email">--><?php //echo $user->phone?><!--</div>-->
<!--                        --><?php //$formSendPhoneCode = ActiveForm::begin([
//                            'enableAjaxValidation' => true,
//                            'id'                   => 'formsendphonecode',
//                            'action'               => Yii::$app->urlManager->createUrl('/send-phone'),
//                            'options'              => [
//                                'class' => 'form-send-phone-code',
//                                'id' => 'form-phone-code'
//                            ]
//                        ]); ?>
<!--                        <div class="password-change-button-container">-->
<!--                            <button type="submit" class="password-change-send send-phone-verification">--><?php //echo Yii::t('app', 'Send')?><!--</button>-->
<!--                        </div>-->
<!--                        --><?php //ActiveForm::end() ?>
<!--                    </div>-->
<!--                    --><?php //}?>
<!---->
<!--                    --><?php //if($user->is_email && $user->is_two_factor) {?>
<!--                    <div class="phone-verification-if-email">-->
<!--                        <h3 class="two-step-text">--><?php //echo Yii::t('app', 'Вы уже активировали двухфакторную верификацию по email')?><!--</h3>-->
<!--                    </div>-->
<!--                    --><?php //}?>
<!--                </div>-->
            </div>
        </div>
        <?php if($user->two_factor_code) {?>
        <div class="profile-elems">

            <h3 class="profile-elem-name"><?php echo Yii::t('app', 'Подтверждение двухфакторной авторизации')?></h3>

<!--            <form action="" class="email-form-autorization">-->
                <h3 class="email-form-text"><?php echo Yii::t('app', 'Пожалуйста, введите код, который вы получили')?></h3>
                <?php $formTwoFactorCode = ActiveForm::begin([
                    'enableAjaxValidation' => true,
                    'id'                   => 'formtwofactorcode',
                    'action'               => Yii::$app->urlManager->createUrl('/send-verify-code'),
                    'options'              => [
                        'class' => 'form-two-factor-code',
                        'id' => 'form-two-factor-verify-code'
                    ]
                ]); ?>
<!--                <input type="password" name="email-password" class="email-password" id="">-->
                <?= $formTwoFactorCode->field($twoFactorForm, 'two_factor_code')->textInput(['autofocus' => true, 'class' => 'email-password'])?>
                <div class="email-password-button-container">
                    <div class="email-password-decline"><?php echo Yii::t('app', 'Отменить')?></div>
                    <input type="submit" value="<?php echo Yii::t('app', 'Подтвердить')?>" class="email-password-button">
                </div>
                <?php ActiveForm::end() ?>
            </form>
        </div>
    <?php }?>
        <?php if($user->is_two_factor) {?>
            <div class="email-verification-not-verified">
                <h3 class="two-step-text"><?php echo Yii::t('app', 'Хотите отключить двухфакторнуюю авторизацию ? Нажмите на кнопку')?></h3>

                <?php $unSetFormTwoFactor = ActiveForm::begin([
                    'enableAjaxValidation' => true,
                    'id'                   => 'unsetFormTwoFactor',
                    'action'               => Yii::$app->urlManager->createUrl('/unset-two-factor'),
                    'options'              => [
                        'class' => 'unset-form-two-factor',
                        'id' => 'unset-form-two-factor-id'
                    ]
                ]); ?>
                <div class="password-change-button-container">
                    <button type="submit" class="password-change-send send-email-verification"><?php echo Yii::t('app', 'Send')?></button>
                </div>
                <?php ActiveForm::end() ?>
            </div>
        <?php }?>
<!--        <div class="profile-elems">-->
<!--            <h3 class="profile-elem-name">Подключение двухфакторки телефона (попап)</h3>-->
<!---->
<!--            <form action="" class="phone-form-autorization">-->
<!--                <h3 class="phone-form-text">Пожалуйста, введите пароль, который вы получили на свой телефон</h3>-->
<!--                <input type="password" name="phone-password" class="phone-password" id="">-->
<!--                <div class="phone-password-button-container">-->
<!--                    <div class="phone-password-decline">Отменить</div>-->
<!--                    <input type="submit" value="Подтвердить" class="phone-password-button">-->
<!--                </div>-->
<!--            </form>-->
<!--        </div>-->
    </div>
</div>
</body>
</html>

<script>
    let buttonEmail = document.querySelector('.email-two-step')
    let buttonPhone = document.querySelector('.phone-two-step')
    let emailDataContainer= document.querySelector('.two-step-email-container')
    let phoneDataContainer = document.querySelector('.two-step-phone-container')

    buttonEmail.addEventListener('click',function(){
        emailDataContainer.classList.add('active');
        phoneDataContainer.classList.remove('active')
    })
    buttonPhone.addEventListener('click',function(){
        emailDataContainer.classList.remove('active');
        phoneDataContainer.classList.add('active')
    })
</script>