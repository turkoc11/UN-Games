<?php

use app\models\Access;

$url = explode('/',Yii::$app->request->getUrl());
//var_dump( Yii::$app->controller->currentLang->url); die;
$serviceLink = null;
$lang = null;
if($url[1] == 'en' || $url[1] == 'ru'){
    $lang = '/'.$url[1].'/';
}else{
    $lang = '/';
}
//var_dump(Yii::$app->language); die;
if($lang == '/' || $lang == '/en/'){
  $about = 'About';
  $homeString = 'Home';
  $services = 'Services';
  $contacts = 'Contacts';
  $gameString = 'Games';
  $news = 'News';
} else {
  $about = 'О Нас';
  $homeString = 'Главная';
  $services = 'Услуги';
  $contacts = 'Контакты';
  $gameString = 'Игры';
  $news = 'Новости';
	
}
if($url[1] == 'home' || $url[1] == ""){
    $home = true;
}else{
    $home = false;
}
$games = $this->params['headerContent']['games'];
?>

<!DOCTYPE html>

<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Game Studio</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css">



    <!-- SEO -->
    <meta content="" name="description"/>
    <meta content="" name="keywords"/>
    <meta content="" name="author"/>
    <meta content="width=device-width, initial-scale=1" name="viewport"/>

    <!-- Use latest version of IE -->
    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--    <link href="css/main.css" rel="stylesheet"/>-->
</head>


<body>
<script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
        crossorigin="anonymous"></script>
<!--[if IE]>
<p>This text you can see only in Internet Explorer</p>
<![endif]-->
<!--[if lt IE 10]>
<p>You will see this text only in IE9 and more later version</p>
<![endif]-->

<?php if(isset(\Yii::$app->user->identity->assignments)) {
    $uroles = \Yii::$app->user->identity->assignments;
//    var_dump($uroles); die;
    }else {
        $uroles = [];

}
?>
<div class="hamburger-dropdown">
    <ul class="hamburger-list">
        <li class="navbar-elem">
            <a href="/about" class="navbar-link navbar-link-dropdown"><?php echo $about ?></a>
        </li>
        <?php if(in_array('super_admin', $uroles) || in_array('donator', $uroles)) {

            ?>
        <li class="navbar-elem">
            <a href="/news" class="navbar-link navbar-link-dropdown"><?php echo $news ?></a>
        </li>
        <?php }?>
        <li class="navbar-elem">
            <a href="/services" class="navbar-link navbar-link-dropdown"><?php echo $services ?></a>
        </li>
        <li class="navbar-elem">
            <a href="/contact" class="navbar-link navbar-link-dropdown"><?php echo $contacts ?></a>
        </li>
    </ul>
</div>

<nav class="navbar-global">
    <ul class="navbar-dropdown-menu">
        <h1 class="dropdown-title">
            <?php echo Yii::t('app', 'Избранные игры:')?>
        </h1>
        <ul class="dropdown-list-container">
            <?php if (!empty($games)) {?>
            <?php foreach ($games as $game) {?>
            <li class="dropdown-menu-game">
                <a href="https://ungames.company<?php echo $lang ?>game/<?php echo $game->id?>" class="dropdown-game-link">
                    <img src="<?php echo $game->image?>" alt="<?php echo $game->title?> Cover" class="dropdown-game-image">
                    <div class="game-title">
                        <?php echo $game->title?>
                    </div>

                </a>
            </li>
            <?php }?>
            <?php }?>
        </ul>

    </ul>
    <a href="/" class="navbar-logo-link">
    <img src="/image-gallery/logo.png" alt="" class="navbar-logo">
    </a>
    
    <ul class="navbar-navigation">
        <li class="navbar-elem">
            <a href="<?php echo $lang?>" class="navbar-link"><?php echo $homeString ?></a>
        </li>
        <li class="navbar-elem navbar-dropdown">
            <?php echo $gameString ?>
        </li>
        <li class="navbar-elem navbar-switch">
            <a href="<?php echo $lang?>about" class="navbar-link"><?php echo $about ?></a>
        </li>
        <?php if(in_array('super_admin', $uroles) || in_array('donator', $uroles)) { ?>
        <li class="navbar-elem navbar-switch">
            <a href="<?php echo $lang?>news" class="navbar-link"><?php echo $news ?></a>
        </li>
        <?php }?>
        <li class="navbar-elem navbar-switch">
            <a href="<?php echo $lang?>services" class="navbar-link"><?php echo $services ?></a>
        </li>
        <li class="navbar-elem navbar-switch">
            <a href="<?php echo $lang?>contact" class="navbar-link"><?php echo $contacts ?></a>
        </li>
    </ul>
    <ul class="navbar-misc">
    <div class="languages-header" style="display:none">
    </div>
    <?php $languages = \yii\helpers\ArrayHelper::map(\app\models\Lang::find()->all(),'url','name'); //var_dump($languages); die();?>
    <?php unset($languages[Yii::$app->controller->currentLang->url]); ?>
    <div class="languages-header-accordeon">
        <!--                        <select name="language" id="language">-->
        <ul name="language" id="language">
            <?php  foreach ($languages as $key => $elem): ?>
                <?php if(Yii::$app->controller->currentLang->url != $key): ?>
                    <li style="color:#4B4A49"><a href="<?= '/' .  $key . Yii::$app->controller->getLink() ?>"><?= $elem ?> </a></li>
                <?php else: ?>
                    <li style="color:#4B4A49"><a href="<?= Yii::$app->controller->getLink() ?>"><?= $elem ?> </a></li>
                <?php endif; ?>
            <?php endforeach;?>

        </ul>
    </div>
        <div class="hamburger-menu">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <li class="navbar-elem navbar-user-dropdown">
            <img src="/image-gallery/user-profile.png" alt="" class="user-image">
            <ul class="user-dropdown-menu">
                <?php if (Yii::$app->user->isGuest) {?>
                <li class="user-menu-elem">
                    <a href="<?php echo $lang?>login" class="navbar-link user-dropdown-link"><?php echo Yii::t('app', 'войти')?></a>
                </li>
                <li class="user-menu-elem">
                    <a href="<?php echo $lang?>registration" class="navbar-link user-dropdown-link"><?php echo Yii::t('app', 'Регистрация')?></a>
                </li>
                <?php } else {?>
                <li class="user-menu-elem">
                    <a href="<?php echo $lang?>logout" class="navbar-link user-dropdown-link"><?php echo Yii::t('app', 'Выход')?></a>
                </li>
                <?php }?>
                <?php if (!Yii::$app->user->isGuest) {?>
                <li class="user-menu-elem">
                    <a href="<?php echo $lang?>profile" class="navbar-link user-dropdown-link"><?php echo Yii::t('app', 'Профиль')?></a>
                </li>
                <?php }?>
            </ul>
        </li>
    </ul>
</nav>
<script>
    let gameDropdown = document.querySelector('.navbar-dropdown')
    let gameDropdownMenu = document.querySelector('.navbar-dropdown-menu')
    let userDropdown = document.querySelector('.user-image')
    let userDropdownMenu = document.querySelector('.user-dropdown-menu')
    let hamburgerButton=document.querySelector('.hamburger-menu')
    let hamburgerDropdown=document.querySelector('.hamburger-dropdown')
    let body=document.querySelector('body')
    hamburgerButton.addEventListener('click', () => {
        hamburgerDropdown.classList.toggle('active');
        body.classList.toggle('active');
    })
    gameDropdown.addEventListener('click', () => {
        gameDropdownMenu.classList.toggle('active')
        if (userDropdownMenu.classList.contains('active') == true){
            userDropdownMenu.classList.remove('active')
        }
    })
    userDropdown.addEventListener('click', () => {
        userDropdownMenu.classList.toggle('active');
        if (gameDropdownMenu.classList.contains('active') == true){
            gameDropdownMenu.classList.remove('active')
        }
    })
</script>
