<?
use yii\helpers\Url;
use yii\widgets\Menu;
?>
<div class="sidebar-inner">
    <div class="off-canvas-close"><span><?=Yii::t('app', "CLOSE");?></span></div>
    <div class="sidebar-widget">
        <div class="widget-title-cover">
            <h4 class="widget-title"><span>&nbsp;</span></h4>
        </div>


        <?
        $m = Yii::$app->controller->menu[1];
        $marr = [];
        foreach ($m as $item){
                $mi = [
                    'label' => $item['title'],
                    'url' => [Url::to('/').$item['url']],
                    'options'=>['class'=>'menu-item'],
                ];
                array_push($marr,$mi);
        }
        $menu['items'] = $marr;
        $menu['options'] = [
            'id'=>'sidebar-menu',
            'class'=>'menu',
        ];

        echo Menu::widget($menu);
        ?>



    </div>
    
    <? if(is_array($a=Yii::$app->controller->adv) && isset($a[1])):?>
    <div class="sidebar-widget">
        <div class="widget-title-cover"><h4 class="widget-title"><span><?=Yii::t('app', "Advertise");?></span></h4></div>
        <div class="banner-adv">
            <div class="adv-thumb">
                <?
                $adv = $a[1];
                echo ($adv->type==0)?$adv->description:'G';
                ?>
            </div>
        </div>
    </div> <!--.sidebar-widget-->
    <? endif;?>


</div>
