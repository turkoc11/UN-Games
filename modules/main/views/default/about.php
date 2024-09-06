<?php
//echo '<pre>';var_dump($model); die;
$url = explode('/',Yii::$app->request->getUrl());
//var_dump($url); die;
$serviceLink = null;
$lang = null;
if($url[1] == 'en' || $url[1] == 'ru'){
    $lang = '/'.$url[1].'/';
}else{
    $lang = '/';
}

if($lang == '/' || $lang == '/en/'){
  $about = 'Stay in touch';
  
} else {
  $about = 'Будьте на связи';

}


?>

  <main class="main">
        <div class="about-presentation-screen">
            <div class="about-presentation-text-container">
                <h3 class="about-presentation-big-text"><?php echo Yii::t('app', 'О нас')?></h3>
                <div class="about-presentation-small-text"><?php echo Yii::t('app', 'Добро пожаловать в UN games, где ваши игровые мечты оживают! Мы — команда энтузиастов, объединенная страстью к созданию захватывающих и инновационных игр, которые завоевывают сердца игроков по всему миру.')?>
</div>
                <a href="/contact" class="about-presentation-link">
                    <div class="about-presentation-link-text"><?php echo $about ?></div>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.721267 5.98509C0.770368 5.99306 0.820059 5.99673 0.869777 5.99609L9.33554 5.99609L9.15094 6.08195C8.9705 6.16735 8.80635 6.28359 8.66583 6.42539L6.29182 8.7994C5.97916 9.09787 5.92662 9.57801 6.16733 9.93704C6.44747 10.3196 6.98471 10.4027 7.36732 10.1225C7.39823 10.0999 7.42761 10.0752 7.45522 10.0487L11.7482 5.75568C12.0837 5.42056 12.084 4.87694 11.7489 4.54145C11.7486 4.54123 11.7484 4.54099 11.7482 4.54077L7.45522 0.247807C7.11945 -0.087018 6.57583 -0.0862675 6.24098 0.249496C6.21463 0.275925 6.19002 0.304044 6.16733 0.333666C5.92662 0.692692 5.97916 1.17283 6.29182 1.4713L8.66154 3.84961C8.78751 3.97571 8.93235 4.08145 9.09084 4.16299L9.34841 4.2789L0.917026 4.2789C0.478418 4.26262 0.0936079 4.569 0.0112095 5.00012C-0.0646954 5.46819 0.2532 5.90916 0.721267 5.98509Z" fill="white"/>
                    </svg>
                </a>
            </div>
            <img src="/image-gallery/about-screen.png" alt="" class="about-presentation-image">
        </div>

        <div class="about-benefits">
            <h3 class="about-benefits-big-text"><?php echo Yii::t('app', 'Наши Ценности')?></h3>
            <div class="about-benefits-content-container">
                <div class="about-benefits-element">
                    <div class="benefits-elem-color-text"><?php echo Yii::t('app', 'Наши Ценности')?></div>
                    <h4 class="benefits-elem-big-text"><?php echo Yii::t('app', 'Качество')?></h4>
                    <div class="benefits-elem-small-text"><?php echo Yii::t('app', 'Мы ставим качество на первое место и стремимся к совершенству в каждой детали наших игр.')?></div>
                </div>
                <div class="about-benefits-element">
                    <div class="benefits-elem-color-text"><?php echo Yii::t('app', 'Наши Ценности')?></div>
                    <h4 class="benefits-elem-big-text"><?php echo Yii::t('app', 'Инновации')?></h4>
                    <div class="benefits-elem-small-text"><?php echo Yii::t('app', 'Постоянно исследуем новые технологии и тенденции,чтобы предлагать вам самые современные и захватывающие игровые решения.')?></div>
                </div>
                <div class="about-benefits-element">
                    <div class="benefits-elem-color-text"><?php echo Yii::t('app', 'Наши Ценности')?></div>
                    <h4 class="benefits-elem-big-text"><?php echo Yii::t('app', 'Креативность')?></h4>
                    <div class="benefits-elem-small-text"><?php echo Yii::t('app', 'Вдохновляемся всем вокруг и не боимсяэкспериментировать, чтобы создавать уникальные игровые вселенные.')?></div>
                </div>
                <div class="about-benefits-element">
                    <div class="benefits-elem-color-text"><?php echo Yii::t('app', 'Наши Ценности')?></div>
                    <h4 class="benefits-elem-big-text"><?php echo Yii::t('app', 'Сообщество')?></h4>
                    <div class="benefits-elem-small-text"><?php echo Yii::t('app', 'Ценим наших игроков и всегда прислушиваемся к вашему мнению, чтобы делать наши игры еще лучше.')?></div>
                </div>
            </div>
        </div>

        <div class="about-head-project">
            <img src="/image-gallery/head-project-image.png" alt="" class="head-project-image">
            <div class="head-project-text-container">
                <h3 class="head-project-big-text"><?php echo Yii::t('app', 'Наша Миссия')?></h3>
                <div class="head-project-small-text"><?php echo Yii::t('app', 'Наша миссия — приносить радость и вдохновение каждому геймеру, создавая уникальные игровые миры, полные приключений, загадок и эмоций. Мы стремимся к тому, чтобы каждая наша игра оставила неизгладимое впечатление и стала любимой частью вашей игровой коллекции.')?></div>
            </div>
        </div>

        
    </main>
