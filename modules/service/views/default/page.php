<?php
/**
 * Created by PhpStorm.
 * User: bodun
 * Date: 15.11.2018
 * Time: 14:16
 */

/** @var \app\modules\service\models\Dynamic $model */

?>

<div class="container">
    <h1><?= $model->title ?></h1>
    <h2><?= $model->sub_title ?></h2>


    <div class="row">
        <?= $model->short_description ?>
    </div>

    <div class="row">
        <?= $model->description ?>
    </div>

    <div class="row">
        <h3>Meta</h3>
        <ul class="list-group">
            <li class="list-group-item">Title: <?= $model->meta_title ?></li>
            <li class="list-group-item">KeyWord: <?= $model->meta_keyword ?></li>
            <li class="list-group-item">Description: <?= $model->meta_description ?></li>
        </ul>
    </div>
    <div class="row">
        <img src="<?= $model->image ?>">
    </div>


</div>

