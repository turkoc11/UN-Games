<?php 
?>
 <section id="content" class="common our-products">
      <div class="wrapper3">
        <div class="container">
          <div class="row">
            <div class="grid_12">
              <div class="heading2">
                <h2
                  class="wow fadeInDown"
                  data-wow-duration="1s"
                  data-wow-delay="0.1s"
                >
                  <?php echo $model->title ?>
                </h2>
                <h4
                  class="wow fadeInDown"
                  data-wow-duration="1s"
                  data-wow-delay="0.2s"
                >
                  <?php echo $model->short_description?>
                </h4>
                <p
                  class="wow fadeInDown"
                  data-wow-duration="1s"
                  data-wow-delay="0.3s"
                >
                <?php echo $model->description?>
                </p>
              </div>
            </div>
          </div>
          <div class="row">
          <?php foreach ($this->params['headerContent']['products'] as $key => $value): ?>
            <div class="grid_4">
              <div
                class="box8 wow fadeInUp"
                data-wow-duration="1s"
                data-wow-delay="0.1s"
              >
                <div class="gallery_image">
                  <a href="#">
                    <img src="<?php echo $value->image?>" alt="" />
                    <div class="gallery_icon">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </a>
                </div>
                <div class="content maxheight">
                  <h3>
                    <a href="#"><?php echo $value->title ?></a>
                  </h3>
                  <p>
                  <?php echo $value->description ?>
                  </p>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
</section>