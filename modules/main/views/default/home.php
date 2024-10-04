<?php
use yii\helpers\Html;
?>
<?php
//$this->params['breadcrumbs'][] = ['label' => Yii::$app->mv->gt('Home',[],false), 'url' => [$model->url]];
//$this->params['breadcrumbs'][] = $model->url;
$url = explode('/',Yii::$app->request->getUrl());

$serviceLink = null;
$lang = null;
if($url[1] == 'en' || $url[1] == 'ru'){
    $lang = '/'.$url[1].'/';
}else{
    $lang = '/';
}

?>

<main class="main">
    <div class="home-presentation-screen">
        <img src="/image-gallery/home-top-image.png" alt="" class="presentation-image">
        <div class="presentation-text-container">
            <h1 class="presentation-header">
                <?php echo Yii::t('app', 'Work that we produce for our clients')?>

            </h1>
            <div class="presentation-text">
                <?php echo Yii::t('app', 'Откройте для себя мир безграничных возможностей, где каждое ваше желание становится реальностью. В UN games  мы создаем игры, которые вдохновляют, увлекают и дарят незабываемые эмоции.')?>

            </div>
            <a href="<?php echo $lang ?>about" class="presentation-link">
                <button class="presentation-button"><?php echo Yii::t('app', 'Больше о нас')?></button>
            </a>
        </div>
    </div>

    <div class="home-game-screen">
        <div class="game-screen-top-part">
            <div class="game-screen-text"><?php echo Yii::t('app', 'Наши игры')?></div>
        </div>
        <div class="game-screen-gallery">
            <div class="game-gallery-image">
                <img src="/image-gallery/home-image-1.png" alt="Game Image 1" class="game-image">
            </div>
            <div  class="game-gallery-image">
                <img src="/image-gallery/home-image-2.png" alt="" class="game-image">
            </div>
            <div  class="game-gallery-image">
                <img src="/image-gallery/home-image-3.png" alt="" class="game-image">
            </div>
        </div>
    </div>

    <div class="home-sectional-text">
        <h1><?php echo Yii::t('app', 'Каждая игра от UN games – это уникальное приключение, разработанное с любовью и вниманием к деталям. Наши проекты – это не просто игры, это захватывающие истории, которые вы проживаете вместе с нашими героями.')?>
            </h1>
    </div>

    <div class="home-video-section">
        <div class="home-video-text">
            <h3 class="home-video-big-text">
                <?php echo Yii::t('app', 'Окунитесь в процесс!')?>

            </h3>
            <div class="home-video-small-text">
                <?php echo Yii::t('app', 'Для тех, кто хочет быть в числе первых, наши трейлеры раннего доступа предлагают уникальную возможность заглянуть за кулисы разработки. Узнайте, что ждет вас в ближайшем будущем и какие нововведения мы готовим для наших пользователей.')?>

            </div>
        </div>

        <iframe width="100%" height="462" src="https://www.youtube.com/embed/Zdb2rsA3wU0?si=6nApxwBJnvN-kfuM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>

    <div class="home-job-section">
        <div class="job-section-text">
            <h3 class="job-section-big-text"><?php echo Yii::t('app', 'Наши Платформы')?></h3>
            <div class="job-section-small-text">
                <?php echo Yii::t('app', 'В мире игр важно не только качество самих проектов, но и те платформы, на которых они доступны. Компания UN games предлагает своим пользователям широкий выбор игровых платформ, обеспечивающих максимальный комфорт и удовольствие от процесса. Мы делаем все возможное, чтобы каждый игрок нашел для себя идеальное решение.')?>
                </div>
        </div>
        <div class="job-section-main-content">
            <div  class="job-section-elem about-us-link">
                <div class="job-section-elem">
                    <div class="job-section-image">
                        <img src="/image-gallery/Group.svg" alt="">
                    </div>
                    <div class="job-section-elem-text">
                       <?php echo Yii::t('app', 'Мобильные')?> 
                    </div>
                </div>
            </div>
            <div  class="job-section-elem about-us-link">
                <div class="job-section-elem">
                    <div class="job-section-image">
                        <img src="/image-gallery/Vector.svg" alt="">
                    </div>
                    <div class="job-section-elem-text">
                        <?php echo Yii::t('app', 'VR')?>
                    </div>
                </div>
            </div>
            <div  class="job-section-elem about-us-link">
                <div class="job-section-elem">
                    <div class="job-section-image">
                        <img src="/image-gallery/Shape.svg" alt="">
                    </div>
                    <div class="job-section-elem-text">
                        <?php echo Yii::t('app', 'ПК')?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="home-section-portfolio">
        <div class="section-portfolio-text">
            <h3 class="section-portfolio-big-text">
                <?php echo Yii::t('app', 'Наши последние проекты')?>

            </h3>
            <div class="section-portfolio-small-text">
                <?php echo Yii::t('app', 'В игровом мире важна каждая деталь. Наша компания стремится создавать уникальные, захватывающие и незабываемые игровые впечатления для всех пользователей. Мы гордимся нашими проектами и рады поделиться ими с вами.')?>

            </div>
        </div>
        <div class="section-portfolio-gallery">
            <img src="/image-gallery/image-project-section-1.png" alt="" class="portfolio-image">
            <img src="/image-gallery/image-project-section-2.png" alt="" class="portfolio-image">
            <img src="/image-gallery/image-project-section-3.png" alt="" class="portfolio-image">
            <img src="/image-gallery/image-project-section-4.png" alt="" class="portfolio-image">
          |<!--  <img src="/image-gallery/image-project-section-5.png" alt="" class="portfolio-image"> -->
           <!-- <img src="/image-gallery/image-project-section-6.png" alt="" class="portfolio-image"> -->
        </div>

        <a href="<?php echo $lang ?>/services" class="portfolio-link">
            <button class="portfolio-button">
                <?php echo Yii::t('app', 'Больше')?>

            </button>
        </a>
    </div>
</main>


<script>
    let 
    </script>
