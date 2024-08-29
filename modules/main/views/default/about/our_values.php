<section class="section section-our-values" id="our-values">
    <div class="container">
        <div class="section-in">
            <div class="section-heading">
                <h2 class="section-title section-title--h2">Our values</h2>
            </div>
            <div class="section-body">
                <div class="values">
                    <?php
//                    echo'<pre>'; var_dump($content); die;
                        foreach ($content as $key => $value) {
                     ?>
                    <div class="value">
                        <div class="value__name"><?php echo $value->title?></div>
                        <div class="value__text">
                            <p>
                                <?php echo $value->description?>
                            </p>
                        </div>
                        <div class="value__img">
                            <span class="cover"></span>
                            <lottie-player
                                class="player player--solutions-driven"
                                src="<?php echo $value->image?>"
                                background="transparent"
                                loop
                            ></lottie-player>
                        </div>
                    </div>
                    <?php
                        }
                    ?>

                </div>

                <div class="styled-btn styled-btn--v2">
                    <button>
                        <span class="styled-btn__text">Show more</span>
                        <span class="styled-btn__arrow">
                    <svg>
                      <use xlink:href="img/sprite.svg#chevron"></use>
                    </svg>
                  </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>