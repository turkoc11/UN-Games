<?php
use yii\helpers\Html;
use yii\helpers\Url;
?>


<div class="container-fluid">
    <div class="container animate-box">
        <div class="row">
            <div class="owl-carousel owl-theme js carausel_slider section_margin" id="slider-small">
                <?
                    $counter = 1;
                    foreach ($model as $post){
                        if($counter<5):
                            ?>
                            <div class="item px-2">
                                <div class="alith_latest_trading_img_position_relative">
                                    <figure class="alith_post_thumb">
                                        <a href="<?=Url::toRoute("/").$post->url?>"><img src="<?= \Yii::$app->controller->imgcache->url($post->image, '80x80');?>" alt="<?=Yii::$app->controller->fixAlt($post->title)?>"/></a>
                                    </figure>
                                    <div class="alith_post_title_small">
                                        <a href="<?=Url::toRoute("/").$post->url?>"><strong><?=$post->title?> </strong></a>
                                       
                                        <p class="meta">
                                            <span><?=date("d.m.Y",$post->created_at)?></span>  
                                            <? if(!Yii::$app->user->isGuest):?>
                                            <span class="text-right"><?=Yii::$app->controller->viewsCnt($post->views);?></span>
                                            <? endif;?>
                                        </p>
                                        
                                    </div>
                                </div>
                            </div>
                            <?
                        else:
                            continue;
                        endif;
                        $counter++;
                    }
                ?>
            </div>
        </div>
    </div>
</div>