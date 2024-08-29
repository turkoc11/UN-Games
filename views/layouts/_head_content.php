
<style>
  .grid_3_image {
    height: 220px !important;
    width: 220px !important;
  }

  @media screen and (max-width: 767px) {
    .grid_3_image {
      height: 420px !important;
      width: 220px !important;
    }
  }

  @media screen and (max-width: 979px) {
    .grid_3_image {
      height: 150px !important;
      width: 150px !important;
    }
  }
</style>


<section id="content" class="main">
  <div class="color-wrapper">
      <div class="container">
      <div class="row">
          <div class="grid_8 preffix_2">
          <div
              class="heading1 wow fadeInDown"
              data-wow-duration="1s"
              data-wow-delay="0.1s"
          >
              <h2><?php echo Yii::t('app', 'Лозунг компании')?></h2>
          </div>
          </div>
      </div>
      <div class="row">
          <?php foreach ($this->params['headerContent']['benefits'] as $key => $value): ?>
          <div class="grid_3">
              <div
                class="box1 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.1s"
              >
                <div class="wrapper">
                    <div>
                      <img src="<?php echo $value->image2?>" 
                              style="height: 220px" 
                              
                              alt="" />
                      <div class="icon">
                          <img src="<?php echo $value->image?>" style="max-width: 64px; max-height: 64px" alt="" />
                      </div>
                      <div class="text">
                          <span><?php echo $value->title?></span>
                      </div>
                    </div>
                </div>
              </div>
          </div>

          <?php endforeach; ?>
      </div>
      <div class="row">
          <div class="grid_8 preffix_2">
          <div
              class="heading1 wow fadeInDown"
              data-wow-duration="1s"
              data-wow-delay="0.1s"
          >
              <h2><?php echo Yii::t('app', 'Our products') ?></h2>
          </div>
          </div>
      </div>
      <div class="row">
          <div class="grid_12">
          <div id="tabs" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
              <div class="row">
              <div class="grid_6">
              <?php $i = 1; ?>
              <?php foreach ($this->params['headerContent']['productsInMain'] as $key => $value): ?>
                <div id="tabs-<?= $i ?>" > 
                    <div class="gallery_image">
                    <img src="<?= $value->image ?>" alt="Image 1">
                        <a href="#">
                        <div class="gallery_icon">
                            <!-- <i class="fa fa-info-circle"></i> -->
                        </div>
                        </a>
                    </div>
                  </div>
                <?php 
                  $i++;
                  endforeach; ?>                  
              </div>
              <div class="grid_6">
                  <ul class="tabs-list row">
                  <?php $i = 1; ?>
                  <?php foreach ($this->params['headerContent']['productsInMain'] as $key => $value): ?>
                  <li class="grid_3">
                    <a href="#tabs-<?= $i ?>">
                    <div
                        class="tab maxheight wow fadeIn"
                        data-wow-duration="1s"
                        data-wow-delay="0.1s"
                    >
                        <h3>
                        <?php echo $value->title?>
                        </h3>
                        <p>
                        <?php echo $value->description?>
                        </p>
                    </div>
                    </a>
                  </li>
                  <?php 
                  $i++;
                  endforeach; ?>
                  </ul>
              </div>
              </div>
          </div>
          </div>
      </div>
      <!-- <div class="row">
          <div class="grid_10 preffix_1">
          <div class="box2">
              <ul>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.1s"
              >
                  <a href="#">Consulting</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.15s"
              >
                  <a href="#">Drilling</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.2s"
              >
                  <a href="#">Engineering</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.25s"
              >
                  <a href="#">Environment & Safety</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.3s"
              >
                  <a href="#">Inspection & Testing</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.35s"
              >
                  <a href="#">Personnel</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.4s"
              >
                  <a href="#">Professional Services</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.45s"
              >
                  <a href="#">Safety</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.5s"
              >
                  <a href="#">Support Service</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.55s"
              >
                  <a href="#">Training</a>
              </li>
              <li
                  class="divider wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="1.6s"
              >
                  -
              </li>
              <li
                  class="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.6s"
              >
                  <a href="#">Transportation</a>
              </li>
              </ul>
          </div>
          </div>
      </div> -->
      </div>
  </div>
</section>