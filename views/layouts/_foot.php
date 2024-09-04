<?php
use yii\helpers\Url;
use yii\widgets\Menu;
$content = $this->params['headerContent']['settings'];
$contacts = $this->params['headerContent']['contacts'];
?>

<?php if(isset(\Yii::$app->user->identity->assignments)) {
    $uroles = \Yii::$app->user->identity->assignments;
}else {
    $uroles = [];

}

$url = explode('/',Yii::$app->request->getUrl());
//var_dump($url); die;
$serviceLink = null;
$lang = null;
if($url[1] == 'en' || $url[1] == 'ru'){
    $lang = '/'.$url[1].'/';
}else{
    $lang = '/';
}
//var_dump($lang); die;
if($lang == '/' || $lang == '/en/'){
  $about = 'About';
  $home = 'Home';
  $services = 'Services';
  $contacts = 'Contacts';
  $gameString = 'Games';
  $news = 'News';
} else {
  $about = 'О Нас';
  $home = 'Главная';
  $services = 'Услуги';
  $contacts = 'Контакты';
  $gameString = 'Игры';
  $news = 'Новости';

}

?>
<div class="newsletter-container">
    <div class="newsletter-text-container">
        <h3 class="newsletter-text-big"><?php echo Yii::t('app', 'Присоединяйтесь к нам')?></h3>
        <div class="newsletter-text-small">
            <?php echo Yii::t('app', 'Следите за новостями и обновлениями, участвуйте в наших мероприятиях и конкурсах, делитесь своими впечатлениями и идеями. В UN games мы всегда рады вашему мнению и поддержке!')?>
            </div>
    </div>
    <div class="newsletter-form-container">
        <div class="newsletter-form-text-container">
            <h3 class="newsletter-form-big-text"><?php echo Yii::t('app', 'Оставайтесь на связи')?></h3>
            <div class="newsletter-form-small-text"><?php echo Yii::t('app', 'Укажите ваш email, чтобы могли держать вас в курсе обновлений. Обещаем не спамить!')?></div>
        </div>

        <?php
        echo Yii::$app->controller->renderPartial("subscribe",
            ['content' => $this->params['headerContent']['feedback']]);
        ?>
    </div>

</div>
<footer class="global-footer">
    <div class="footer-top-part">
        <div class="top-part-info">
            <img src="/image-gallery/logo.png" alt="Сюда лого вставить" class="footer-logo">
        </div>
        <div class="top-part-pages">
            <a href="/" class="pages-big-text"><?php echo $home ?></a>
            <div class="pages-footer-section">
                <a href="/about" class="pages-footer"><?php echo $about ?></a>
                <a href="/services" class="pages-footer"><?php echo $services ?></a>
                <?php if(in_array('super_admin', $uroles) || in_array('donator', $uroles)) { ?>
                <a href="/news" class="pages-footer"><?php echo $news ?></a>
                <?php }?>
            </div>
        </div>
        <div class="top-part-contact">
            <a href="/contacts" class="contact-us-link"><?php echo $contacts ?></a>
            <a href="mailto: ungames.eu@gmail.com" class="footer-contact-text">ungames.eu@gmail.com</a>
        </div>
        <div class="top-part-socials socials-desktop">
            <a href="https://www.facebook.com/profile.php?id=61562975393263" class="socials">
                <img src="/image-gallery/facebook.png" alt="" class="socials-image">
            </a>
            <a href="https://www.instagram.com/ungames.company/" class="socials">
                <img src="/image-gallery/instagram.png" alt="" class="socials-image">
            </a>
            <a href="X.com/UNgames" class="socials">
                <img src="/image-gallery/x-logo.webp" alt="" class="socials-image">
            </a>
            <a href="" class="socials">
                <img src="/image-gallery/tik-tok.webp" alt="" class="socials-image">
            </a>
        </div>
    </div>
    <div class="mobile-footer-part">
        <div class="top-part-socials">
            <a href="https://www.facebook.com/profile.php?id=61562975393263" class="socials">
                <img src="/image-gallery/facebook.png" alt="" class="socials-image">
            </a>
            <a href="https://www.instagram.com/ungames.company/" class="socials">
                <img src="/image-gallery/instagram.png" alt="" class="socials-image">
            </a>
            <a href="X.com/UNgames" class="socials">
                <img src="/image-gallery/x-logo.webp" alt="" class="socials-image">
            </a>
            <a href="" class="socials">
                <img src="/image-gallery/tik-tok.webp" alt="" class="socials-image">
            </a>
        </div>
    </div>
    <div class="footer-bottom-part">
        <div class="footer-bottom-text">
            Copyright ® 2024 UNgames all rights reserved
        </div>
    </div>
</footer>

