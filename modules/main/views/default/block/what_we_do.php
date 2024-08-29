<section class="section section-what-we-do">
    <div class="container">
        <div class="section-in">
            <div class="section-heading">
                <h2 class="section-title section-title--h2"><?php echo $content->title ?></h2>
            </div>
            <?php if(!empty($services)){ ?>
            <div class="section-body">
                <div class="section-body-in">
                    <div class="block-nav">
                        <ul>
                            <?php foreach ($services as $service){ ?>
                               <li><a href="#"><?php echo $service->title?></a></li>
                            <?php } ?>
                        </ul>
                    </div>

                    <div class="block-cards">
                        <?php foreach ($services as $service){ ?>
                            <div class="card">
                                <a class="card__link" href="/services/<?php echo $service->link?>"></a>
                                <div class="card__title"><?php echo $service->title?></div>
                                <?php if(!empty($service->image)){ ?>
                                    <div class="card__img">
                                        <img alt="Structuring" src="<?php echo $service->preview_image?>"/>
                                    </div>
                                <?php } ?>
                                <div class="card__text">
                                    <p><?php echo $service->preview_text?></p>
                                </div>
                                <div class="card__button">
                                    <div class="styled-btn styled-btn--white">
                                        <a href="/services/<?php echo $service->link?>">
                                            <span class="styled-btn__text">Learn more</span>
                                            <span class="styled-btn__arrow">
                                                  <svg>
                                                    <use xlink:href="img/sprite.svg#chevron"></use>
                                                  </svg>
                                            </span>
                                        </a>
                                    </div>

                                </div>
                            </div>
                        <?php }?>
                        </div>
                    </div>
                </div>
            </div>
            <?php } ?>
        </div>
    </div>
</section>