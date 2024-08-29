<?php
use app\models\Access;
use yii\helpers\Url;
use yii\widgets\Menu;
use yii\helpers\Html;


$url = explode('/',Yii::$app->request->getUrl());

?>


<!--<nav class="nav">-->
<!--    <div class="nav__overlay"></div>-->
<!--    <div class="nav__inner">-->
<!--        <ul class="nav__list nav-accordion">-->
<!--            --><?php //if(!empty($this->params['menu'])) { ?>
<!--                    --><?php ////echo'<pre>'; var_dump($this->params['headerContent']['services']); die;?>
<!--                --><?php //foreach ($this->params['menu'] as $keyMenu => $menu) { ?>
<!---->
<!--                    --><?php //if ($menu->url === 'services') {
//
//                        ?>
<!--                    <li class="nav__item nav__item--dropdown nav-ac">-->
<!--                        <span class="nav-ac-trigger">--><?php //echo $menu->title?><!--</span>-->

<!--                        --><?php //if (!empty($this->params['headerContent']['services'])) {?>
<!--                        <div class="dropdown nav-ac-panel">-->
<!--                            <ul class="dropdown__list">-->
<!--                             --><?php //foreach ($this->params['headerContent']['services'] as $keyService => $service) {?>
<!--                                     --><?php ////if(count($url) > 2) {?>
<!--                                <li class="dropdown__item"><a href="/services/--><?php //echo $service->link ?><!--">--><?php //echo $service->title ?><!--</a></li>-->
<!---->
<!--                            --><?php //}?>
<!--                            </ul>-->
<!--                        </div>-->
<!--                        --><?php //}?>
<!--                    </li>-->
<!--                    --><?php //} else {?>
<!--                        <li class="nav__item"><a href="/--><?php //echo $menu->url ?><!--">--><?php //echo $menu->title ?><!--</a></li>-->
<!--                    --><?php //}?>
<!--                --><?php //}?>
<!--            --><?php //}?>
<!--        </ul>-->
<!--    </div>-->
<!--</nav>-->
<!---->



<?php /*

 <div class="rd-navbar-inner">
    <div class="rd-navbar-nav-wrap">
        <!-- RD Navbar Nav-->
        <?
        $m = Yii::$app->controller->menu[0];
        $marr = [];
        foreach ($m as $item){
            if(isset($item['submenu'])){
                $smarr = [];
                foreach ($item['submenu'] as $sm){
                    array_push($smarr,['label' => $sm['title'], 'url' => [Url::to('/').($sm['url'])]]);
                }
                $mi = [
                    'label' => $item['title'],
                    'url' => [Url::to('/').($item['url'])],
                    'options'=>['class'=>'menu-item-has-children'],
                    'template' => '<a href="{url}">{label}</a>',
                    'items' => $smarr,
                    'submenuTemplate' => "\n<ul class='rd-navbar-dropdown' role='menu'>\n{items}\n</ul>\n",
                ];
                array_push($marr,$mi);
            }else{
                array_push($marr,['label' => $item['title'], 'url' => [Url::to('/').($item['url'])]]);
            }
        }
        $menu['items'] = $marr;
        $menu['options'] = [
            'id'=>'main-menu',
            'class'=>'rd-navbar-nav',
            'data'=>'menu',
        ];

        echo Menu::widget($menu);
        ?>
    </div>
</div>



<ul class="rd-navbar-nav">
    <li class="active"><a href="index.html">Home</a></li>
    <li><a href="about.html">About Us</a>
        <!-- RD Navbar Dropdown-->
        <ul class="rd-navbar-dropdown">
            <li><a href="testimonials.html">Testimonials</a></li>
            <li><a href="our-team.html">Our team</a></li>
            <li><a href="careers.html">Careers</a></li>
            <li><a href="history.html">History</a></li>
            <li><a href="press-about-us.html">Press</a></li>
            <li><a href="faq.html">FAQ</a></li>
        </ul>
    </li>
    <li><a href="services.html">Services</a>
        <ul class="rd-navbar-dropdown">
            <li><a href="single-service.html">Single service</a></li>
        </ul>
    </li>
    <li><a href="products.html">Products</a>
        <ul class="rd-navbar-dropdown">
            <li><a href="single-product.html">Single product</a></li>
        </ul>
    </li>
    <li><a href="blog.html">Blog</a>
        <!-- RD Navbar Dropdown-->
        <ul class="rd-navbar-dropdown">
            <li><a href="blog-post.html">Post page</a></li>
        </ul>
    </li>
    <li><a href="contacts.html">Contact us</a></li>
    <li><a href="#">Pages</a>
        <ul class="rd-navbar-dropdown">
            <li><a href="typography.html">Typography</a></li>
            <li><a href="tabs.html">Tabs</a></li>
            <li><a href="buttons.html">Buttons</a></li>
            <li><a href="grid.html">Grid</a></li>
            <li><a href="table.html">Tables</a></li>
            <li><a href="forms.html">Forms</a></li>
            <li><a href="icons.html">Icons</a></li>
            <li><a href="site-map.html">Site Map</a></li>
            <li><a href="404-page.html">404 Page</a></li>
            <li><a href="503-page.html">503 Page</a></li>
            <li><a href="maintenance.html">Maintenance</a></li>
            <li><a href="coming-soon.html">Coming Soon</a></li>
        </ul>
    </li>
    <li><a href="#">Request a Quote</a></li>
</ul>


*/?>