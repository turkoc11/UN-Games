<?php

use yii\widgets\ActiveForm;
use yii\helpers\Html;

$user = $this->params['headerContent']['user'];
$transactions = $this->params['headerContent']['transactions'];
if(isset(\Yii::$app->user->identity->assignments)) {
    $uroles = \Yii::$app->user->identity->assignments;
} else {
    $uroles = [];
}
$roles = '';
if(!empty($uroles)) {
    foreach ($uroles as $urole) {
        $roles .= " ".$urole;
    }
}
//var_dump($user); die;

?>
<!--<main class="main">-->
<!--    <h3 class="profile-big-text">--><?php //echo Yii::t('app', 'С возвращением!')?><!--</h3>-->
<!--    <div class="profile-container">-->
<!--        <div class="rank-field">-->
<!--            <span>--><?php //echo Yii::t('app', 'Ваш ранг:')?><!--</span> <span class="dynamic-field">--><?php //echo $roles?><!--</span>-->
<!--        </div>-->
<!---->
<!--        <div class="balance-field">-->
<!--            <span>--><?php //echo Yii::t('app', 'Ваш баланс составляет: ')?><!-- </span> <span class="dynamic-field">--><?php //echo $user->balance ?><!--</span>-->
<!--        </div>-->
<!---->
<!--        <div class="donation-field">-->
<!--            <h3 class="donation-big-text">--><?php //echo Yii::t('app', 'История транзакций: ')?><!--</h3>-->
<!--            --><?php //if(!empty($transactions)) {?>
<!--            <table class="donation-table">-->
<!--                <tr>-->
<!--                    <th>--><?php //echo Yii::t('app', 'Дата')?><!--</th>-->
<!--                    <th>--><?php //echo Yii::t('app', 'Сумма')?><!--</th>-->
<!--                </tr>-->
<!--                --><?php //foreach ($transactions as $transaction) {?>
<!--                <tr>-->
<!--                    <td>--><?php //echo date('d.m.Y',$transaction->created_at) ?><!--</td>-->
<!--                    <td>--><?php //echo $transaction->amount ?><!--</td>-->
<!--                </tr>-->
<!--                --><?php //}?>
<!--            </table>-->
<!--            --><?php //}?>
<!--        </div>-->
<!--    </div>-->
<!--</main>-->

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
            <a href="" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Privacy')?></div>
            </a>
            <a href="" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Transactions history')?></div>
            </a>
        </div>
    </div>

    <div class="profile-main-wrapper">
        <h1 class="profile-head-text">
            <?php echo Yii::t('app', 'Profile information')?>
        </h1>

        <div class="profile-elems">
            <h3 class="profile-elem-name">
                <?php echo Yii::t('app', 'Your profile')?>
            </h3>
            <div class="profile-head-container">
                <?php $uploadImageForm = ActiveForm::begin(
                        [
//                            'enableAjaxValidation' => true,
//                            'id'                   => 'uploadimageform',
                            'action'               => Yii::$app->urlManager->createUrl('/upload-image'),
                                'options' => [
//                                        'class' => 'form-image-upload',
//                                        'id' => 'form-upload-image',
                                        'enctype' => 'multipart/form-data'
                                ]

                        ]) ?>

                <?= $uploadImageForm->field($uploadImage, 'image')->fileInput()->label(Yii::t('app', 'Выберите файл')) ?>

                <input type="submit" value="<?php echo Yii::t('app', 'Submit')?>" class="change-nickname-accept">

                <?php ActiveForm::end() ?>
                <img src="/<?php echo $user->image?>" alt="" class="profile-head-avatar">
                <div class="profile-head-text">
                    <div class="profile-head-static-text"><?php echo Yii::t('app', 'User nickname')?></div>
                    <div class="profile-head-nickname-container">
                        <div class="profile-head-nickname">
                            <?php echo $user->nick_name?>
                        </div>
                        <button class="change-nickname">
                            <svg fill="#000000" height="18px" width="18px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                 viewBox="0 0 306.637 306.637" xml:space="preserve">
                                 <g>
                                     <g>
                                         <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896
                                          l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z"/>
                                         <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095
                                          L265.13,75.602L231.035,41.507z"/>
                                     </g>
                                 </g>
                              </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Форма для смены ника-->
<!--        <form action="" class="form-change-nickname">-->
        <?php $formUpdateNickName = ActiveForm::begin([
            'enableAjaxValidation' => true,
            'id'                   => 'updatenicknameform',
            'action'               => Yii::$app->urlManager->createUrl('/update-nick-name'),
            'options'              => [
                'class' => 'form-change-nickname',
                'id' => 'form-update-nick-name'
            ]
        ]); ?>
            <h1 class="profile-head-text"><?php echo Yii::t('app', 'Change user nickname')?> (попап)</h1>
            <label for="change-nickname" class="change-nickname-label">New username</label>
<!--            <input type="text" placeholder="type new username" class="change-nickname-input" name="change-nickname">-->
        <?= $formUpdateNickName->field($updateNickName, 'nick_name')->textInput(['autofocus' => true, 'class' => 'personal-data-form-input', 'placeholder' => Yii::t('app', 'New nick name')])->label('') ?>
<!--            <input type="button" class="change-nickname-accept" value="submit">-->
        <input type="submit" value="<?php echo Yii::t('app', 'Submit')?>" class="change-nickname-accept">
<!--        </form>-->
        <?php ActiveForm::end(); ?>
        <div class="profile-elems">
            <div class="personal-data-head-container">
                <h3 class="profile-elem-name">
                    <?php echo Yii::t('app', 'Personal data')?>
                </h3>
                <button class="change-personal-data"><?php echo Yii::t('app', 'Change')?></button>
            </div>

            <div class="personal-data-container">
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'User email')?></span>
                    <span class="personal-data-dynamic-text" id="data-email"><?php echo $user->email?></span>
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Name')?></span>
                    <span class="personal-data-dynamic-text" id="data-name"><?php echo $user->first_name.' '.$user->last_name?></span>
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Gender')?></span>
                    <span class="personal-data-dynamic-text" id="data-gender"><?php echo \app\models\Users::genderList()[$user->gender]?></span>
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Language')?></span>
                    <?php if(!empty($user->language_id)) {?>
                    <span class="personal-data-dynamic-text" id="data-language"><?php echo \app\models\Lang::getLangsList()[$user->language_id]?></span>
                    <?php }?>
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Date of birth')?></span>
                    <span class="personal-data-dynamic-text" id="data-birth"><?php echo $user->dateofbirth?></span>
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Phone number')?></span>
                    <span class="personal-data-dynamic-text" id="data-phone"><?php echo $user->phone?></span>
                </div>
            </div>
            <!--Форма для смены данных-->
            <?php $formUpdateProfile = ActiveForm::begin([
                'enableAjaxValidation' => true,
                'id'                   => 'updateprofileform',
                'action'               => Yii::$app->urlManager->createUrl('/update-profile'),
                'options'              => [
                    'class' => 'personal-data-form',
                    'id' => 'form-update-profile'
                ]
            ]); ?>
<!--            <form action="" class="personal-data-form">-->
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Email')?></span>
<!--                    <input type="email" placeholder="email" class="personal-data-form-input">-->
                    <?= $formUpdateProfile->field($updateProfile, 'email')->textInput(['autofocus' => true, 'class' => 'personal-data-form-input', 'placeholder' => Yii::t('app', 'Email')])->label('') ?>
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Name')?></span>
                    <?= $formUpdateProfile->field($updateProfile, 'first_name')->textInput(['autofocus' => true, 'class' => 'personal-data-form-input', 'placeholder' => Yii::t('app', 'Name')])->label('')?>
                    <?= $formUpdateProfile->field($updateProfile, 'last_name')->textInput(['autofocus' => true, 'class' => 'personal-data-form-input', 'placeholder' =>  Yii::t('app', 'Surname')])->label('')?>
<!--                    <input type="text" placeholder="Name" class="personal-data-form-input">-->
<!--                    <input type="text" placeholder="Surname" class="personal-data-form-input">-->
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Gender')?></span>
                    <?= $formUpdateProfile->field($updateProfile, 'gender')->dropDownList(\app\models\Users::genderList(), ['class' => 'select2'])->label('') ?>
<!--                    <input type="text" placeholder="Gender" class="personal-data-form-input">-->
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Language')?></span>
<!--                    <select name="" id="">-->
<!--                        <option>English</option>-->
<!--                        <option>Russian</option>-->
<!--                    </select>-->
                    <?= $formUpdateProfile->field($updateProfile, 'language_id')->dropDownList(\app\models\Lang::getLangsList(), ['class' => 'select2'])->label('') ?>
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Date of birth')?></span>
<!--                    <input type="date" placeholder="Date" name="dateofbirth" class="personal-data-form-input">-->
                    <?= $formUpdateProfile->field($updateProfile, 'dateofbirth')->widget(\yii\jui\DatePicker::className(),
                        [ 'dateFormat' => 'php:m/d/Y',
                            'clientOptions' => [

                                'changeYear' => true,
                                'changeMonth' => true,
                                'yearRange' => '-90:-0',
                                'altFormat' => 'yy-mm-dd',
                                'language'  => 'en',
                            ]],['placeholder' => 'mm/dd/yyyy'])
                        ->textInput(['class' => 'personal-data-form-input', 'placeholder' => \Yii::t('app', 'mm/dd/yyyy')]) ;?>
                </div>
                <div class="personal-data-elem">
                    <span class="personal-data-static-text"><?php echo Yii::t('app', 'Phone number')?></span>
<!--                    <input type="text" placeholder="Phone number" class="personal-data-form-input">-->
                    <?= $formUpdateProfile->field($updateProfile, 'phone')->textInput(['type' => 'tel', 'autofocus' => true, 'class' => 'personal-data-form-input']) ?>
                </div>
                <div class="button-form-container">
                    <div class="decline-changes"><?php echo Yii::t('app', 'Decline')?></div>
<!--                    --><?php //= Html::submitButton(Yii::t('app', 'Submit'), [
//                        'class' => 'send-personal-data',
////                        'id' => 'btn-submit'
//                    ]) ?>

                    <input type="submit" value="<?php echo Yii::t('app', 'Submit')?>" class="send-personal-data">
                </div>
            <?php ActiveForm::end(); ?>
<!--            </form>-->
        </div>
        <?php if(empty($user->deleted_at)) {?>
        <div class="profile-elems">
            <div class="personal-data-head-container">
                <h3 class="profile-elem-name">
                    <?php echo Yii::t('app', 'Delete account')?>
                </h3>
                <button class="delete-account-button"><?php echo Yii::t('app', 'Delete')?></button>
            </div>
        </div>

<!--        <form action="--><?php //Yii::$app->urlManager->createUrl('/delete-account')?><!--" class="delete-account-form" method="POST">-->

        <?php $formUserDeleted = ActiveForm::begin([
            'enableAjaxValidation' => true,
            'id'                   => 'userdeletedform',
            'action'               => Yii::$app->urlManager->createUrl('/delete-account'),
            'options'              => [
                'class' => 'delete-account-form',
                'id' => 'form-delete-user'
            ]
        ]); ?>
            <h1 class="profile-head-text">(попап)</h1>
            <p class="delete-account-text">
                <?php echo Yii::t('app', 'Закрыв учетную запись UNgames, вы сможете отменить свое решение в течение 30 дней.
                После этого действие вашей учетной записи UNgames будет прекращено, и вы окончательно потеряете все настройки, контент и данные.')?>

            </p>
            <div class="checkbox-container">
<!--                <input type="checkbox" name="accept-delete" id="delete-account">-->
                <?= $formUserDeleted->field($userDeleted, 'deleted_at')->checkbox([
                    'label' => Yii::t('app', ''),
//                    'checked' => false,
//                    'uncheck' => null,
                ]); ?>
                <span class="delete-account-text"><?php echo Yii::t('app', 'Я подтверждаю удаление аккаунта')?> </span>
            </div>
            <input type="submit" class='form-button-delete-account' value="<?php echo Yii::t('app', 'Delete my account')?>">
<!--        </form>-->
        <?php ActiveForm::end(); ?>
        <?php } else {?>
        <?php echo 'Форма восстановления аккаунта'?>
        <?php }?>
    </div>
</div>
</body>
</html>



<script>
    let buttonDecline = document.querySelector('.decline-changes')
    let buttonChange = document.querySelector('.change-personal-data')
    let personalDataContainer= document.querySelector('.personal-data-container')
    let personalDataSend= document.querySelector('.send-personal-data')
    let personalDataForm = document.querySelector('.personal-data-form')

    buttonChange.addEventListener('click',function(){
        buttonChange.classList.toggle('active')
        personalDataContainer.classList.toggle('active');
        personalDataForm.classList.toggle('active')
    })
    buttonDecline.addEventListener('click',function(){
        buttonChange.classList.toggle('active')
        personalDataContainer.classList.toggle('active');
        personalDataForm.classList.toggle('active')
    })
</script>
<script>

</script>