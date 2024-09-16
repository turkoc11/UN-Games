<?php 

$url = explode('/',Yii::$app->request->getUrl());

$serviceLink = null;
$lang = null;
if($url[1] == 'en' || $url[1] == 'ru'){
    $lang = '/'.$url[1].'/';
}else{
    $lang = '/';
}

?>
<main class="main main_service">
    <!-- Banner - start -->
    <section
        class="section section-banner"
        style="background-image: url(<?php echo $model->image?>)"
    >
        <div class="container">
            <div class="section-in">
                <!-- breadcumbs - start -->
                <div class="breadcrumbs">
                    <ul class="breadcrumbs__list">
                        <li class="breadcrumbs__item">
                            <a class="breadcrumbs__link" href="/">Home</a>
                        </li>
                        <li class="breadcrumbs__item">
                            <a class="breadcrumbs__link" href="#">Services</a>
                        </li>
                        <li class="breadcrumbs__item">
                  <span class="breadcrumbs__current"
                  ><?php echo $model->title?></span
                  >
                        </li>
                    </ul>
                </div>
                <!-- breadcumbs - end -->

                <h1 class="section-title section-title--h1">
                    <span><?php echo $model->title?></span>
                </h1>
            </div>
        </div>
    </section>
    <!-- Banner - end -->

    <!-- Expertise - start -->
    <?php if($model->expertise_status == 1) {?>
    <section class="section section-structuring">
        <div class="container">
            <div class="section-in">
                <h4 class="section-title section-title--h4"><?php echo $model->expertise_title ?></h4>
                <div class="block-text">
                    <?php echo $model->expertise_description ?>
                </div>

            </div>
        </div>
    </section>
    <?php } ?>
    <!-- Expertise - end -->

    <!-- Ongoing support - start -->
    <?php if($model->ongoing_status == 1) {?>
    <section class="section section-img-text">
        <div class="container">
            <div class="section-in">
                <div class="img-text">
                    <div class="img-text__img">
                        <img
                            src="<?php echo $model->ongoing_image ?>"
                            alt="Ongoing support"
                        />
                    </div>
                    <div class="img-text__text img-text__text--black">
                        <div class="text">
                            <h4 class="section-title section-title--h4">
                                <?php echo $model->ongoing_title ?>
                            </h4>
                            <?php echo $model->ongoing_description ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Ongoing support - end -->
    <?php } ?>

    <?php if($model->structuring_status == 1) {?>
    <!-- Structuring Approach - start -->
    <section class="section section-offers">
        <div class="container">
            <div class="section-in">
                <div class="section-heading">
                    <h2 class="section-title section-title--h2">
                        <?php echo $model->structuring_title ?>
                    </h2>
                    <?php echo $model->structuring_description ?>
                </div>
                <?php //echo '<pre>'; var_dump($this->params['headerContent']['serviceContent']); die;?>
                <?php if(!empty($this->params['headerContent']['serviceContent']['servicesValues'])){?>
                <div class="section-body">
                    <div class="offers">
                        <?php foreach ($this->params['headerContent']['serviceContent']['servicesValues'] as $value) {?>
                        <div class="offers__item">
                            <div class="offer">
                                <div class="offer__img">
                                    <img src="<?php echo $value->image ?>" alt="<?php echo $value->title ?>">
                                </div>
                                <div class="offer__title">
                                    <?php echo $value->title ?>
                                </div>
                                <div class="offer__text">
                                    <?php echo $value->description ?>
                                </div>
                            </div>
                        </div>
                        <?php }?>

                    </div>
                </div>
                <?php }?>
            </div>
        </div>
    </section>
    <!-- Structuring Approach - end -->
    <?php } ?>

    <?php if($model->what_we_do_status == 1) {?>
    <!-- What we do within structuring - start -->
    <section class="section section-structuring section-structuring--v2">
        <div class="container">
            <div class="section-in">
                <h4 class="section-title section-title--h4">
                    <?php echo $model->what_we_do_title ?>
                </h4>
                <div class="block-text">
                    <?php echo $model->what_we_do_description ?>
                </div>
                <?php if(!empty($this->params['headerContent']['serviceContent']['serviceAdvantages'])){?>
                <div class="block-cards">
                    <div class="block-cards__cards">
                        <?php foreach ($this->params['headerContent']['serviceContent']['serviceAdvantages'] as $value) {?>
                            <div class="card">
                                <div class="card__title"><?php echo $value->title?></div>
                            </div>
                        <?php }?>
                    </div>
                    <div class="block-cards__notice">
                        <p>
                            We also help with other corporate amendment implementations,
                            including liquidation of organisations of any type of
                            structural complexity.
                        </p>
                    </div>
                </div>
            </div>
            <?php }?>
        </div>
    </section>
    <?php } ?>
    <!-- What we do within structuring - end -->

    <!-- Strategic advising - start -->
    <?php if($model->strategic_status == 1) {?>
    <section class="section section-strategic-adv section-img-text">
        <div class="container">
            <div class="section-in">
                <div class="img-text">
                    <div class="img-text__img">
                        <img
                            src="<?php echo $model->strategic_image ?>"
                            alt="Strategic advising"
                        />
                    </div>
                    <div class="img-text__text img-text__text">
                        <div class="text">
                            <h4 class="section-title section-title--h4">
                                <?php echo $model->strategic_title ?>
                            </h4>
                            <?php echo $model->strategic_description ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php }?>
    <!-- Strategic advising - end -->
    <?php if($model->text_block_status == 1) {?>
    <section class="section section-text-on-center">
        <div class="container">
            <div class="section-in">
                <div class="block">
                    <?php echo $model->text_block_description ?>
                </div>
            </div>
        </div>
    </section>
    <?php }?>

    <!-- FAQ - start -->
    <?php if($model->faq_status == 1) {?>
    <section class="section section-faq">
        <div class="container">
            <div class="section-in">
                <div class="section-heading">
                    <h2 class="section-title section-title--h2">Related FAQs</h2>
                </div>
                <?php if(!empty($this->params['headerContent']['serviceContent']['serviceFaqs'])){?>
                <div class="section-body">
                    <div class="faq">
                        <ul class="faq__list accordion-container">
                            <?php foreach ($this->params['headerContent']['serviceContent']['serviceFaqs'] as $key => $value) {?>
                                    <?php $item = $key+1; ?>
                            <li class="faq-item ac">
                                <div class="faq-item__line faq-item__line--top"></div>
                                <div class="faq-item__line faq-item__line--bottom"></div>
                                <div class="faq-item__num"><?= '0'. $item?></div>
                                <div class="faq-item__q ac-trigger">
                                    <?php echo $value->title?>
                                </div>
                                <div class="faq-item__a ac-panel">
                                    <div class="faq-item__a-in">
                                        <?php echo $value->description?>
                                    </div>
                                </div>
                            </li>
                        <?php }?>
                        </ul>
                        <?php //if(count($this->params['headerContent']['serviceContent']['serviceFaqs']) > 5){?>
                        <div class="faq__button">
                            <span>Show more</span>
                        </div>
                        <?php //}?>
                    </div>
                </div>
                <?php }?>
            </div>
        </div>
    </section>
    <?php }?>
    <!-- FAQ - end -->

    <!-- Next service - start -->
    <div class="next-service">
        <div class="container">
            <p>Next: <a href="<?php echo "/services/".$nextLink['link']?>"><?php echo $nextLink['title'] ?></a></p>
        </div>
    </div>
    <!-- Next service - end -->
</main>
