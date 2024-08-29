<main class="main main_text-page">
    <section class="text-page">
        <div class="text-page__heading">
            <div class="container">
                <div class="section-in">
                    <!-- breadcumbs - start -->
                    <div class="breadcrumbs">
                        <ul class="breadcrumbs__list">
                            <li class="breadcrumbs__item">
                                <a class="breadcrumbs__link" href="/">Home</a>
                            </li>

                            <li class="breadcrumbs__item">
                                <span class="breadcrumbs__current"><?php echo $model->title?></span>
                            </li>
                        </ul>
                    </div>
                    <!-- breadcumbs - end -->

                    <div class="back-btn">
                        <span onclick="history.back()">Back</span>
                    </div>

                    <h1 class="section-title section-title--h1">
                <span
                ><?php echo $model->title?>
                </span>
                    </h1>
                </div>
            </div>
        </div>
        <?php //echo'<pre>';var_dump($model); die;?>
        <div class="text-page__body">
            <div class="container">
                <div class="section-in">
                    <aside class="sidebar sidebar-accordion">
                        <h4 class="sidebar__title">Content</h4>
                        <ul class="sidebar__list scrollspy-nav sidebar-ac">
                            <?php if($model->introduction_status == 1){?>
                                <li class="sidebar__item">
                                    <a class="sidebar__anchor scrollspy-link active" href="#">
                                        <?php echo $model->introduction_title?>
                                    </a>
                                </li>
                            <?php }?>
                            <?php if($model->crs_faq_status == 1){?>
                                <li
                                        class="sidebar__item sidebar__item--accordion sidebar-ac-trigger"
                                >
                                    <a class="sidebar__anchor scrollspy-link" href="#">
                                        <?php echo $model->crs_faq_title?>
                                    </a>
                                    <ul class="sidebar__sublist sidebar-ac-panel">
                                        <?php foreach ($this->params['headerContent']['pageContent']['textPageFaqs'] as $key => $value) {?>
                                            <li class="sidebar__sub-item">
                                                <a class="sidebar__sub-anchor scrollspy-link" href="#">
                                                    <?php if($key <= 8){?>
                                                        <?php $number = $key + 1;?>
                                                        <?php $item = '0'.$number; ?>
                                                    <?php }else{?>
                                                        <?php $item = $key + 1; ?>
                                                    <?php }?>
                                                    <span><?php echo $item;?>.</span>
                                                    <?php echo $value->title?>
                                                </a>
                                            </li>
                                        <?php }?>


                                    </ul>
                                </li>
                            <?php }?>
                            <?php if($model->crs_footer_status == 1){?>
                                <li class="sidebar__item">
                                    <a class="sidebar__anchor scrollspy-link" href="#"
                                    ><?php echo $model->crs_footer_title?></a
                                    >
                                </li>
                            <?php }?>
                        </ul>
                    </aside>
                    <div class="content">
                        <div class="content-in">
                            <div class="block">
                                <div class="block-in">
                                    <h3 class="block__title scrollspy-block"><?php echo $model->introduction_title?></h3>
                                    <div class="block__text text">
                                        <div class="text-in">
                                            <?php echo $model->introduction_description?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php if($model->crs_faq_status == 1){?>
                                <div class="block">

                                    <div class="block-in">
                                        <h3 class="block__title scrollspy-block">
                                            <?php echo $model->crs_faq_title?>
                                        </h3>

                                        <div class="qa">
                                            <?php foreach ($this->params['headerContent']['pageContent']['textPageFaqs'] as $key => $value) {?>
                                                <?php if($key <= 8){?>
                                                    <?php $number = $key + 1;?>
                                                    <?php $item = '0'.$number; ?>
                                                <?php }else{?>
                                                    <?php $item = $key + 1; ?>
                                                <?php }?>
                                                <div class="qa-block">
                                                    <div class="qa-block__in scrollspy-block">
                                                        <div class="qa-block__title">
                                                            <span><?php echo $item?>.</span> <?php echo $value->title?>
                                                        </div>

                                                        <div class="qa-block__text text-qa">
                                                            <div class="text-qa__in">
                                                                <?php echo $value->description?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <?php }?>

                                        </div>
                                    </div>

                                </div>
                            <?php }?>
                            <?php if($model->crs_faq_status == 1){?>
                            <div class="block">
                                <div class="block-in">
                                    <h3 class="block__title scrollspy-block">
                                        CRS further information and guidance
                                    </h3>
                                    <div class="block__text text">
                                        <div class="text-in">
                                            <?php echo $model->crs_footer_description?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php }?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="section section-make-remarkable">
        <div class="container">
            <div class="section-in">
                <div class="block-text">
                    <p><?php echo $slogan?></p>
                </div>
                <div class="block-link">
                    <a href="/contacts">Contact Us</a>
                </div>
            </div>
        </div>
    </section>