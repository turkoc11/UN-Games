<section class="section section-info section-who" id="who">
<!--    --><?php //echo '<pre>'; var_dump($content); die;?>
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

                    <div class="styled-btn ">
                        <a href="/about">
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
        </div>
    </div>
</section>