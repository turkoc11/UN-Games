<?php
use yii\helpers\Html;
use yii\helpers\Url;

?>

<div class="sidebar-widget animate-box">
    <div class="widget-title-cover"><h4 class="widget-title"><span><?=Yii::t('app', "Search");?></span></h4></div>
    <form action="<?=Url::toRoute('/').'search'?>" class="search-form" method="get" role="search">
        <label>
            <input type="search" name="s" value="" placeholder="<?=Yii::t('app', "Search");?> …" class="search-field">
        </label>
        <input type="submit" value="<?=Yii::t('app', "Search");?>" class="search-submit">
    </form>
</div> <!--.sidebar-widget-->