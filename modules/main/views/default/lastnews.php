<?
use yii\helpers\Html;
use yii\helpers\Url;
use app\models\Posts;
use yii\data\Pagination;
use yii\widgets\LinkPager;
use app\modules\main\models\Sections;


$query = Posts::find()->where(['status' => 1]);

$countQuery = clone $query;
$pages = new Pagination(['totalCount' => $countQuery->count(), 'pageSize'=>10,'forcePageParam' => false, 'pageSizeParam' => false]);

$models = $query->offset($pages->offset)
    ->limit($pages->limit)
    ->orderBy('created_at DESC')
    ->all();
?>



<div class="container-fluid">
    <div class="container animate-box">
        <div class="row">
            <div class="archive-header">
                <div class="archive-title"><h1><?=Yii::t('app','Last news');?></h1></div>
            </div>
        </div>
    </div>
</div>

<div class="container-fluid">
    <div class="container">
        <div class="primary margin-15">
            <div class="row">
                <div class="col-md-12">

<div class="post_list post_list_style_1">
    <?
    foreach ($models as $post) :

        ?>
        <article class="row section_margin animate-box">
            <div class="col-md-2 animate-box">
                <figure class="alith_news_img"><a href="<?=Url::toRoute("/").$post->url?>"><img src="<?= \Yii::$app->controller->imgcache->url($post->image, '500x400');?>" alt="<?=Yii::$app->controller->fixAlt($post->title)?>"/></a></figure>
            </div>
            <div class="col-md-10 animate-box">
                <h3 class="alith_post_title"><a href="<?=Url::toRoute("/").$post->url?>"><?=$post->title?></a></h3>
                <div class="post_meta">
                    <a href="<?=Url::toRoute("/").$post->url?>" class="meta_author_avatar"><img src="<?= \Yii::$app->controller->imgcache->url($post->user->image, '50x50');?>" alt="author"/></a>
                    <span class="meta_author_name"><a href="<?=Url::toRoute("/").$post->url?>" class="author"><?=$post->user->getFullName()?></a></span>
                    <span class="meta_categories"><?=Sections::catsView($post,'','')?></span>
                    <span class="meta_date"><?=date("d.m.Y",$post->created_at)?></span>
                </div>
                <p class="alith_post_except"><?=$post->short_description?></p>
                <a href="<?=Url::toRoute("/").$post->url?>" class="read_more"><?=Yii::t('app','Read More')?></a>
            </div>
        </article>
        <?
    endforeach;
    $pager =  LinkPager::widget([
        'pagination' => $pages,
        'options' => ['class' => 'page-numbers'],
    ]);
    $pager = str_replace(["main/default/index?link=","&amp;page"],["","?page"],$pager);
    ?>
    <div class="site-pagination animate-box"><?=$pager?></div>




</div>


</div>
</div>
</div>
</div>
</div>
