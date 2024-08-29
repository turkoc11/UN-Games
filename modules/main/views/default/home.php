<?php
use yii\helpers\Html;
?>
<?php
//$this->params['breadcrumbs'][] = ['label' => Yii::$app->mv->gt('Home',[],false), 'url' => [$model->url]];
//$this->params['breadcrumbs'][] = $model->url;


?>

<main class="main">
    <div class="home-presentation-screen">
        <img src="" alt="" class="presentation-image">
        <div class="presentation-text-container">
            <h1 class="presentation-header">
                <?php echo Yii::t('app', 'Work that we produce for our clients')?>

            </h1>
            <div class="presentation-text">
                <?php echo Yii::t('app', 'Откройте для себя мир безграничных возможностей, где каждое ваше желание становится реальностью. В UN games  мы создаем игры, которые вдохновляют, увлекают и дарят незабываемые эмоции.')?>

            </div>
            <a href="/about" class="presentation-link">
                <button class="presentation-button"><?php echo Yii::t('app', 'Больше о нас')?></button>
            </a>
        </div>
    </div>

    <div class="home-game-screen">
        <div class="game-screen-top-part">
            <div class="game-screen-text"><?php echo Yii::t('app', 'Наши игры')?></div>
        </div>
        <div class="game-screen-gallery">
            <a href="/" class="game-gallery-image">
                <img src="/image-gallery/home-image-1.png" alt="Game Image 1" class="game-image">
            </a>
            <a href="/" class="game-gallery-image">
                <img src="/image-gallery/home-image-2.png" alt="" class="game-image">
            </a>
            <a href="/" class="game-gallery-image">
                <img src="/image-gallery/home-image-3.png" alt="" class="game-image">
            </a>
            <a href="/" class="game-gallery-image">
                <img src="/image-gallery/home-image-4.png" alt="" class="game-image">
            </a>
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

        <iframe width="100%" height="462" src="https://www.youtube.com/embed/1bYFoFej0bg?si=zAeJAFeh9o8I_C0c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>

    <div class="home-job-section">
        <div class="job-section-text">
            <h3 class="job-section-big-text"><?php echo Yii::t('app', 'Наши Платформы')?></h3>
            <div class="job-section-small-text">
                <?php echo Yii::t('app', 'В мире игр важно не только качество самих проектов, но и те платформы, на которых они доступны. Компания UN games предлагает своим пользователям широкий выбор игровых платформ, обеспечивающих максимальный комфорт и удовольствие от процесса. Мы делаем все возможное, чтобы каждый игрок нашел для себя идеальное решение.')?>
                </div>
        </div>
        <div class="job-section-main-content">
            <a href="/about" class="job-section-elem about-us-link">
                <div class="job-section-elem">
                    <div class="job-section-image">
                        <img src="/image-gallery/Group.svg" alt="">
                    </div>
                    <div class="job-section-elem-text">
                        Мобильные
                    </div>

                    <svg class="job-section-arrow" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1_143)">
                            <path d="M1.26222 11.974C1.34814 11.988 1.4351 11.9944 1.52211 11.9933L16.3372 11.9933L16.0141 12.1435C15.6984 12.293 15.4111 12.4964 15.1652 12.7446L11.0107 16.8991C10.4635 17.4214 10.3716 18.2616 10.7928 18.8899C11.2831 19.5595 12.2232 19.7048 12.8928 19.2146C12.9469 19.1749 12.9983 19.1317 13.0466 19.0853L20.5593 11.5726C21.1464 10.9861 21.147 10.0348 20.5605 9.44765C20.5601 9.44728 20.5597 9.44685 20.5593 9.44648L13.0466 1.93378C12.459 1.34784 11.5077 1.34916 10.9217 1.93674C10.8756 1.98299 10.8325 2.0322 10.7928 2.08404C10.3716 2.71233 10.4635 3.55258 11.0107 4.0749L15.1577 8.23693C15.3781 8.45762 15.6316 8.64267 15.909 8.78536L16.3597 8.9882L1.6048 8.9882C0.837233 8.9597 0.163813 9.49587 0.0196152 10.2503C-0.113218 11.0695 0.443098 11.8411 1.26222 11.974Z" fill="#DC7000"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1_143">
                                <rect width="21" height="21" fill="white" transform="matrix(-1 0 0 -1 21 21)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </a>
            <a href="/about" class="job-section-elem about-us-link">
                <div class="job-section-elem">
                    <div class="job-section-image">
                        <img src="/image-gallery/Vector.svg" alt="">
                    </div>
                    <div class="job-section-elem-text">
                        VR
                    </div>

                    <svg class="job-section-arrow" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1_143)">
                            <path d="M1.26222 11.974C1.34814 11.988 1.4351 11.9944 1.52211 11.9933L16.3372 11.9933L16.0141 12.1435C15.6984 12.293 15.4111 12.4964 15.1652 12.7446L11.0107 16.8991C10.4635 17.4214 10.3716 18.2616 10.7928 18.8899C11.2831 19.5595 12.2232 19.7048 12.8928 19.2146C12.9469 19.1749 12.9983 19.1317 13.0466 19.0853L20.5593 11.5726C21.1464 10.9861 21.147 10.0348 20.5605 9.44765C20.5601 9.44728 20.5597 9.44685 20.5593 9.44648L13.0466 1.93378C12.459 1.34784 11.5077 1.34916 10.9217 1.93674C10.8756 1.98299 10.8325 2.0322 10.7928 2.08404C10.3716 2.71233 10.4635 3.55258 11.0107 4.0749L15.1577 8.23693C15.3781 8.45762 15.6316 8.64267 15.909 8.78536L16.3597 8.9882L1.6048 8.9882C0.837233 8.9597 0.163813 9.49587 0.0196152 10.2503C-0.113218 11.0695 0.443098 11.8411 1.26222 11.974Z" fill="#DC7000"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1_143">
                                <rect width="21" height="21" fill="white" transform="matrix(-1 0 0 -1 21 21)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </a>
            <a href="/about" class="job-section-elem about-us-link">
                <div class="job-section-elem">
                    <div class="job-section-image">
                        <img src="/image-gallery/Shape.svg" alt="">
                    </div>
                    <div class="job-section-elem-text">
                        ПК
                    </div>

                    <svg class="job-section-arrow" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1_143)">
                            <path d="M1.26222 11.974C1.34814 11.988 1.4351 11.9944 1.52211 11.9933L16.3372 11.9933L16.0141 12.1435C15.6984 12.293 15.4111 12.4964 15.1652 12.7446L11.0107 16.8991C10.4635 17.4214 10.3716 18.2616 10.7928 18.8899C11.2831 19.5595 12.2232 19.7048 12.8928 19.2146C12.9469 19.1749 12.9983 19.1317 13.0466 19.0853L20.5593 11.5726C21.1464 10.9861 21.147 10.0348 20.5605 9.44765C20.5601 9.44728 20.5597 9.44685 20.5593 9.44648L13.0466 1.93378C12.459 1.34784 11.5077 1.34916 10.9217 1.93674C10.8756 1.98299 10.8325 2.0322 10.7928 2.08404C10.3716 2.71233 10.4635 3.55258 11.0107 4.0749L15.1577 8.23693C15.3781 8.45762 15.6316 8.64267 15.909 8.78536L16.3597 8.9882L1.6048 8.9882C0.837233 8.9597 0.163813 9.49587 0.0196152 10.2503C-0.113218 11.0695 0.443098 11.8411 1.26222 11.974Z" fill="#DC7000"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1_143">
                                <rect width="21" height="21" fill="white" transform="matrix(-1 0 0 -1 21 21)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </a>
            <a href="/about" class="job-section-elem about-us-link">
                <div class="job-section-elem">
                    <div class="job-section-image">
                        <img src="/image-gallery/ps4.svg" alt="">
                    </div>
                    <div class="job-section-elem-text">
                        Консоли
                    </div>

                    <svg class="job-section-arrow" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1_143)">
                            <path d="M1.26222 11.974C1.34814 11.988 1.4351 11.9944 1.52211 11.9933L16.3372 11.9933L16.0141 12.1435C15.6984 12.293 15.4111 12.4964 15.1652 12.7446L11.0107 16.8991C10.4635 17.4214 10.3716 18.2616 10.7928 18.8899C11.2831 19.5595 12.2232 19.7048 12.8928 19.2146C12.9469 19.1749 12.9983 19.1317 13.0466 19.0853L20.5593 11.5726C21.1464 10.9861 21.147 10.0348 20.5605 9.44765C20.5601 9.44728 20.5597 9.44685 20.5593 9.44648L13.0466 1.93378C12.459 1.34784 11.5077 1.34916 10.9217 1.93674C10.8756 1.98299 10.8325 2.0322 10.7928 2.08404C10.3716 2.71233 10.4635 3.55258 11.0107 4.0749L15.1577 8.23693C15.3781 8.45762 15.6316 8.64267 15.909 8.78536L16.3597 8.9882L1.6048 8.9882C0.837233 8.9597 0.163813 9.49587 0.0196152 10.2503C-0.113218 11.0695 0.443098 11.8411 1.26222 11.974Z" fill="#DC7000"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1_143">
                                <rect width="21" height="21" fill="white" transform="matrix(-1 0 0 -1 21 21)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </a>

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
            <img src="/image-gallery/image-project-section-5.png" alt="" class="portfolio-image">
            <img src="/image-gallery/image-project-section-5.png" alt="" class="portfolio-image">
        </div>

        <a href="/services" class="portfolio-link">
            <button class="portfolio-button">
                <?php echo Yii::t('app', 'Больше')?>

            </button>
        </a>
    </div>
</main>
