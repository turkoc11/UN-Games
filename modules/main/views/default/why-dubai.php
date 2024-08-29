<main class="main main_why-dubai">
    <!-- Banner - start -->
    <section
        class="section section-banner"
        style="background-image: url(<?php echo $model->image?>)"
    >
        <div class="container">
            <div class="section-in">
                <!-- breadcumbs - start -->
                <div class="breadcrumbs">
                    <ul class="breadcrumbs__list">
                        <li class="breadcrumbs__item">
                            <a class="breadcrumbs__link" href="/">Home</a>
                        </li>
                        <li class="breadcrumbs__item">
                            <span class="breadcrumbs__current"><?php echo $model->title?></span>
                        </li>
                    </ul>
                </div>
                <!-- breadcumbs - end -->

                <h1 class="section-title section-title--h1">
                    <span><?php echo $model->title?></span>
                </h1>
            </div>
        </div>
    </section>
    <!-- Banner - end -->

    <!-- Introduction - start -->
    <?php
    if(!empty($this->params['headerContent']['dubaiSections'])){
        foreach ($this->params['headerContent']['dubaiSections'] as $key => $value){
//           echo '<pre>'; var_dump($value); die;
            echo Yii::$app->controller->renderPartial("dubai/".$value['template'],
                ['content' => $value, 'values' => $this->params['headerContent']['dubaiValues']]);
        }

    }
    ?>

    <!-- Our services - end -->
</main>