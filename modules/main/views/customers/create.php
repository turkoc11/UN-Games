<?php

use yii\helpers\Html;
use yii\widgets\Breadcrumbs;


/* @var $this yii\web\View */
/* @var $model app\models\Users */

$this->title = $this->title ?: Yii::t('app', 'Patients');
$this->params['breadcrumbs'][] = ['label' => $this->title, 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="main-content">
    <section class="section">
        <div class="section-header">
            <h1><?= Html::encode($this->title) ?></h1>

            <div class="section-header-breadcrumb">

                <?php echo Breadcrumbs::widget([
                    'itemTemplate' => "<li class=\"breadcrumb-item\">{link}</li>",
                    'activeItemTemplate' => "<li class=\"breadcrumb-item active\">{link}</li>",
                    'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
                ]);?>


            </div>

        </div>

        <div class="section-body">


            <?= $this->render('_form', [ 'model' => $model, 'doctors' => $doctors]) ?>


        </div>
    </section>
</div>
