<!DOCTYPE html>
<html >
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="profile-styles.css">
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
            <?php echo Yii::t('app', 'Приватность')?>
        </h1>
        <div class="profile-elems">
            <h3 class="profile-elem-name"><?php echo Yii::t('app', 'Прозрачность')?></h3>

            <div class="privacy-text-container">
                <p class="privacy-paragraph"><?php echo Yii::t('app', 'Добро пожаловать в раздел "Приватность')?></p>
                <p class="privacy-paragraph">
                    <?php echo Yii::t('app', 'Для компании UNgames конфиденциальность — не игрушка.
                    Мы стремимся защищать персональные данные пользователей своих игр и сайтов.
                    Загляните на страницу')?>
                     <a href="" class="privacy-link"><?php echo Yii::t('app', '"Политика конфиденциальности"')?></a>,
                    <?php echo Yii::t('app', 'чтобы узнать подробности об
                    обработке ваших персональных данных.')?>

                </p>
                <p class="privacy-paragraph">
                    <?php echo Yii::t('app', 'Вы можете воспользоваться своими правами в отношении ваших персональных данных (правом на доступ к информации, ее исправление или удаление, а также на ограничение ее обработки) в любое время."')?>

                </p>
            </div>
        </div>
    </div>
</div>
</body>
</html>