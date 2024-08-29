<?php
use yii\helpers\Html;
?>


<main class="page-content">
    <? if($sections):?>
    <section class="breadcrumb-classic">
        <div class="rd-parallax">
            <div data-speed="0.25" data-type="media" data-url="<?= $sections->image ?>" class="rd-parallax-layer"></div>
            <div data-speed="0" data-type="html" class="rd-parallax-layer section-top-75 section-md-top-150 section-lg-top-260">
                <div class="shell">
                    <ul class="list-breadcrumb">
                        <li><a href="<?= \yii\helpers\Url::toRoute('/') ?>"><?=Yii::t('app', 'Main')?></a></li>

                        <li><a href="<?= \yii\helpers\Url::toRoute('/catalog') ?>"><?=Yii::t('app', 'Catalog')?></a></li>

                        <li><a href="<?= \yii\helpers\Url::toRoute('/'.$sections->url) ?>"><?=$sections->title?></a></li>

                        <li><?= $model->title ?>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    <? endif;?>


    <section class="section-50 section-sm-top-80 section-md-top-100 section-lg-top-150 bg-white">

        <div class="shell">
            <h1 class="text-center text-lg-left"><?= $model->title ?></h1>
            <div class="range range-lg range-xs-center">
                <div class="cell-lg-12 cell-md-8">
                    <div class="range">
                        <div class="cell-lg-6 cell-xl-6">
                            <div class="inset-lg-right-45">

                                <?= $model->description ?>

                                <? /*<a href="#" class="btn btn-primary offset-top-30 offset-lg-top-70">Buy now</a>*/?>
                            </div>
                        </div>
                        <div class="cell-lg-6 text-lg-right cell-xl-6"><img src="<?= $model->image ?>" alt="" width="750" class="img-responsive">
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="margin-top: 50px;">
                    <div class="row" >
                        <? if($model->gallery):?><? $ims = explode(",",$model->gallery); $i=0; ?>

                            <h2><?=Yii::t('app', 'Gallery')?></h2>
                            <div class="owl-carousel-wrap text-center wrap-fluid">
                                <div data-items="1" data-sm-items="1" data-md-items="2" data-lg-items="3" data-xl-items="4" data-stage-padding="0" data-loop="true" data-margin="15" data-mouse-drag="true" data-autoplay="false" data-dots="true" data-nav-custom=".owl-custom-navigation" class="owl-carousel">
                                    <? foreach ($ims as $img):?>
                                        <div class="owl-item" style="display: flex;align-items: center;justify-content: center;">
                                            <div class="product product-custom"><img src="<?=trim($img)?>" alt="" class="img-responsive"></div>
                                        </div>
                                    <? endforeach;?>
                                </div>
                                <div class="owl-custom-navigation">
                                    <div class="owl-nav">
                                        <div style="color: #0d0d0d" data-owl-prev class="owl-prev"><?=Yii::t('app', 'Prev')?></div>
                                        <div style="color: #0d0d0d" data-owl-next class="owl-next"><?=Yii::t('app', 'Next')?></div>
                                    </div>
                                </div>
                            </div>


                        <? /*
                            <div class="section-lg-top-150 isotope-item col-xs-12 col-sm-4"><img src="<?=trim($img)?>" alt="" width="485" class="img-responsive"></div>
                        */?>

                      <? endif;?>
                    </div>
                </div>

                <div class="col-lg-12" style="margin-top: 50px;">
                <? if($model->video):?><? $vi = explode(",",$model->video); $i=0; ?>
                    <div class="row">
                        <h2><?=Yii::t('app', 'Video')?></h2>
                        <div class="owl-carousel-wrap">
                            <div data-items="1" data-sm-items="1" data-md-items="2" data-lg-items="3" data-xl-items="4" data-stage-padding="0" data-loop="true" data-margin="15" data-mouse-drag="true" data-autoplay="false" data-dots="false" data-nav-custom=".owl-custom-navigation2" class="owl-carousel">

                                    <? foreach ($vi as $videoitem):?>
                                    <div class="item-video" data-merge="1">
                                        <a class="owl-video" href="<?=$videoitem?>"></a>
                                    </div>
                                    <? endforeach;?>
                                </div>
<!--                            <div class="owl-custom-navigation2">-->
<!--                                <div class="owl-nav">-->
<!--                                    <div style="color: #0d0d0d" data-owl-prev class="owl-prev">--><?//=Yii::t('app', 'Prev')?><!--</div>-->
<!--                                    <div style="color: #0d0d0d" data-owl-next class="owl-next">--><?//=Yii::t('app', 'Next')?><!--</div>-->
<!--                                </div>-->
<!--                            </div>-->
                        </div>

                    </div>

                </div>
                <style>
                    .owl-carousel .owl-video-tn {
                        background-size: cover;
                        padding-bottom: 56.25%; /* 16:9 */
                        padding-top: 25px;
                    }

                    .owl-video-frame {
                        position: relative;
                        padding-bottom: 56.25%; /* 16:9 */
                        padding-top: 25px;
                        height: 0;
                    }
                    .owl-video-frame iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }

                    .owl-dots {
                        text-align: center;
                        margin-top: 20px;
                    }

                    .owl-dot {
                        display: inline-block;
                    }

                    .owl-dot span {
                        width: 11px;
                        height: 11px;
                        background-color: #ccc;
                        border-radius: 50%;
                        display: block;
                        margin: 5px 3px;
                    }

                    .owl-dot.active span {
                        background-color: #000;
                    }
                </style>
                <? endif;?>

            </div>



        </div>


    </section>


</main>


