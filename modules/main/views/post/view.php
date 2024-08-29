<main class="main">
<!--    --><?php //echo '<pre>'; var_dump($model); die;?>
    <div class="services-head-container">
        <h3 class="services-head-big-text"><?php echo $model->title?></h3>
    </div>
    <div class="services-content-container services-inner-page">
        <img src="<?php echo $model->image?>" alt="сюда картинку" class="services-content-image">
        <div class="services-content-text">
            <div class="services-content-small-text"><?php echo $model->description?></div>
        </div>
    </div>
    <div class="services-content-container services-inner-page">
        <div class="services-content-text">
            <div class="services-content-small-text"><?php echo $model->description2?></div>
        </div>
        <img src="<?php echo $model->image2?>" alt="а сюда другую картинку" class="services-content-image">
    </div>
</main>