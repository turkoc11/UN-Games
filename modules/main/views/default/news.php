<?php
use yii\helpers\Url;

$longMews = $this->params['headerContent']['newsLong'];
$shortNews = $this->params['headerContent']['newsShort'];

?>
<main class="main">
    <div class="services-head-container">
        <h3 class="services-head-big-text"><?php echo Yii::t('app', 'Новостная лента')?></h3>
        <div class="services-head-small-text"><?php echo Yii::t('app', 'Изучите что происходит внутри компании: какие проекты в разработке, интересные статьи о разработке игр. Вам понравится!')?></div>
    </div>

    <div class="news-content-container">
        <div class="news-content-left-segment">
            <?php if(!empty($longMews)) {?>
            <?php foreach ($longMews as $news) { ?>
            <div class="news-content-left-elem">
                <img src="<?php echo $news->image?>" alt="" class="left-content-image">
                <div class="left-content-info-container">
                    <div class="info-container-name"><?php echo $news->user->first_name .' '. $news->user->last_name ?></div>
                    <div class="info-container-time"><?php echo secToArray(time() - $news->created_at )?></div>
                </div>
                <h3 class="left-content-big-text"><?php echo $news->description?></h3>
                <div class="left-content-small-text"><?php echo $news->description2 ?></div>
            </div>
            <?php } ?>
            <?php } ?>
        </div>

        <div class="news-content-right-segment">
            <?php if(!empty($shortNews)) {?>
            <?php foreach ($shortNews as $news) { ?>
            <a href="<?php echo 'post/' .$news->id?>" class="news-content-right-elem">
                <img src="<?php echo $news->image ?>" alt="" class="right-elem-image">
                <div class="right-elem-text-container">
                    <div class="right-elem-info-container">
                        <div class="info-container-name"><?php echo $news->user->first_name .' '. $news->user->last_name ?></div>
                        <div class="info-container-time"><?php echo secToArray(time() - $news->created_at )?></div>
                    </div>
                    <div class="right-elem-text">
                        <?php echo $news->description?>
                    </div>
                </div>
            </a>
            <?php } ?>
            <?php } ?>
        </div>
    </div>
</main>
<?php
function secToArray($secs)
{
$res = array();

$res[Yii::t('app','d')] = floor($secs / 86400);
$secs = $secs % 86400;

$res[Yii::t('app','h')] = floor($secs / 3600);
$secs = $secs % 3600;

$res[Yii::t('app','min')] = floor($secs / 60);
//$res[Yii::t('app','secs')] = $secs % 60;
$result = '';
foreach ($res as $key => $value){
    if($value > 0) {
        $result .= ' '.$value.' '.$key;
    }
}

return $result;
}
?>
