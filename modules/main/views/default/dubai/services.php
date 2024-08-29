<section class="section section-structuring section-structuring--v2">
    <div class="container">
        <div class="section-in">
            <h4 class="section-title section-title--h4"><?php echo $content->title?></h4>
            <div class="block-text">
                <p class="highlight">
                    <?php echo $content->description?>
                </p>
            </div>
            <?php //var_dump($this->params['headerContent']['services']); die();?>
            <?php if(!empty($this->params['headerContent']['services'])){ ?>
            <div class="block-cards">
                <div class="block-cards__cards">
                    <?php foreach ($this->params['headerContent']['services'] as $value){?>
                    <div class="card">
                        <div class="card__in">
                            <div class="card__title"><?php echo $value->title?></div>
                        </div>
                    </div>

                    <?php }?>
                </div>
            </div>
            <?php }?>
        </div>
    </div>
</section>