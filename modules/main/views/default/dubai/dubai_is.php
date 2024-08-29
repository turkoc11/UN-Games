<section class="section section-offers">
    <div class="container">
        <div class="section-in">
            <div class="section-heading">
                <h2 class="section-title section-title--h2">
                    <?php echo $content->title?>
                </h2>
                <p><?php echo $content->description?></p>
            </div>
            <?php if(!empty($this->params['headerContent']['dubaiValues'])){ ?>
            <div class="section-body">
                <div class="offers">
                    <?php foreach ($this->params['headerContent']['dubaiValues'] as $value) {?>
                    <div class="offers__item">
                        <div class="offer">
                            <div class="offer__img">
                                <img src="<?php echo $value->image?>" alt="Lorem ipsum dolor sit amet"/>
                            </div>
                            <div class="offer__title"><?php echo $value->title?></div>
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