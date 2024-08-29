
<section class="section section-info section-truly-transparent">
    <div class="container">
        <div class="section-in">
            <div class="section-heading">
                <h2 class="section-title section-title--h2 underline">
                    <?php echo $content->title ?>
                </h2>
            </div>
            <div class="section-body">
                <div class="info-container">
                    <div class="info-text">
                        <?php echo $content->description ?>
                    </div>

                    <div class="styled-btn styled-btn--v2">
                        <a href="/about#our-values">
                            Our values
                            <span class="styled-btn__arrow">
                                  <svg>
                                    <use xlink:href="img/sprite.svg#chevron"></use>
                                  </svg>
                            </span>
                        </a>
                    </div>
                    <?php if(!empty($content->image)) { ?>
                    <div class="info-img">
                        <img
                            alt="Truly Transparent Img"
                            src="<?php echo $content->image ?>"
                        />
                    </div>
                    <?php } ?>
                </div>
            </div>
        </div>
    </div>
</section>