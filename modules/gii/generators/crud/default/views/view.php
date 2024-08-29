<?php

use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\crud\Generator */

$urlParams = $generator->generateUrlParams();

echo "<?php\n";
?>

use yii\helpers\Html;
use app\components\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model <?= ltrim($generator->modelClass, '\\') ?> */

$this->title = $this->title ?: <?= $generator->generateString(Inflector::pluralize(Inflector::camel2words(StringHelper::basename($generator->modelClass)))) ?>;

?>


<div class="ns-container-outer">
    <div class="ns-container-inner">

        <div class="row ns-mb-15">
            <div class="col-xs-4 col-xxs-12">
                <div class="ns-title">
                    <?= "<?= " ?> Yii::t('app_admin', $model-><?= $generator->getNameAttribute() ?>) ?>
                    <?= "<?= " ?> Yii::t('app_admin', 'information') ?>
                </div>
            </div>
            <div class="col-xs-8 col-xxs-12">
                <div class="ns-actions text-right xxs-left">

                <?= "<?php " ?> if (\app\models\Access::checkAccess('index')) { ?>
                <?= "<?= " ?>Html::a(Yii::t('app_admin', 'Back to list'), ['index'], ['class' => 'ns-button ns-button-white']) ?>
                <?= "<?php " ?> } ?>

                <?= "<?php " ?> if (\app\models\Access::checkAccess('update')) { ?>
                <?= "<?= " ?>Html::a(Yii::t('app_admin', 'Edit info'), ['update', 'id' => $model->id], ['class' => 'ns-button']) ?>
                <?= "<?php " ?> } ?>

                <?= "<?php " ?> if (\app\models\Access::checkAccess('delete')) { ?>
                <?= "<?= " ?>Html::a(Yii::t('app_admin', 'Delete'), ['delete', 'id' => $model->id], ['class' => 'ns-button ns-button-red confirm-alert',
                    'data' => [
                        'question_text' => Yii::t('app_admin', 'Are you sure?'),
                        'cancel_text' => Yii::t('app_admin', 'No, stop it!'),
                        'confirm_text' => Yii::t('app_admin', 'Yes, delete it!'),
                        'success_text' => Yii::t('app_admin', "Successful!"),
                    ],
                ]) ?>
                <?= "<?php " ?> } ?>

                </div>
            </div>
        </div>


        <div class="row ns-mb-15">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="scrollable">

    <?= "<?= " ?>DetailView::widget([
        'model' => $model,
        'header' => $this->title,
        'options' => [
            'class' => 'ns-table ns-tcol-2',
        ],
        'attributes' => [
<?php
if (($tableSchema = $generator->getTableSchema()) === false) {
    foreach ($generator->getColumnNames() as $name) {
        if ($name == 'id') { ?>
            [
                'attribute' => '<?= $name ?>',
            ],
        <?php } elseif ($name =='title' || $name == 'name') { ?>
            [
            'attribute' => '<?= $name ?>',
            'format' => 'raw',
            'value' => function ($model) {
                if (!\app\models\Access::checkAccess('view')) {
                    return Html::img(\yii\helpers\Url::to('/images/default.jpeg'), ['class' => 'img-circle', 'style' => 'width:30px;']) . $model->title;
                }
                return Html::a(
                    Html::img(\yii\helpers\Url::to('/images/default.jpeg'), ['class' => 'img-circle', 'style' => 'width:30px;']) . $model->title,
                    ['update', 'id' => $model->id],
                    ['class' => 'link-toggler']
                );
            },
            ],
        <?php } elseif ($name == 'status') { ?>
            [
                'attribute' => '<?= $name ?>',
                'value' => function ($model) {
                    $data = @Yii::$app->params['status'];
                    return isset($data[$model->status]) ? $data[$model->status] : '';
                },
            ],
        <?php } elseif (stripos($name, '_by') || stripos($name, '_id')) { ?>
            [
                'attribute' => '<?= $name ?>',
                'value' => function ($model) {
                    $relation = '<?= explode('_', $name)[0] ?>';
                    $title = 'title';
                    return !empty($model->$relation) && isset($model->$relation->$title) ? $model->$relation->$title : '';
                },
            ],
        <?php } elseif (stripos($name, '_at') || stripos($name, 'time')) { ?>
            [
                'attribute' => '<?= $name ?>',
                'value' => function ($model) {
                    return date('m/d/Y', $model-><?= $name ?>);
                },
            ],
        <?php } else { ?>
            [
                'attribute' => '<?= $name ?>',
            ],
        <?php }
    }
} else {
    foreach ($generator->getTableSchema()->columns as $column) {
        $format = $generator->generateColumnFormat($column);
        if ($column->name == 'id') { ?>
            [
                'attribute' => '<?= $column->name ?>',
            ],
        <?php } elseif ($column->name == 'title' || $column->name == 'name') { ?>
            [
            'attribute' => '<?= $column->name ?>',
            'format' => 'raw',
            'value' => function ($model) {
                if (!\app\models\Access::checkAccess('view')) {
                    return Html::img(\yii\helpers\Url::to('/images/default.jpeg'), ['class' => 'img-circle', 'style' => 'width:30px;']) . $model->title;
                }
                return Html::a(
                    Html::img(\yii\helpers\Url::to('/images/default.jpeg'), ['class' => 'img-circle', 'style' => 'width:30px;']) . $model->title,
                    ['update', 'id' => $model->id],
                    ['class' => 'link-toggler']
                );
            },
            ],
        <?php } elseif ($column->name == 'status') { ?>
            [
                'attribute' => '<?= $column->name ?>',
                'value' => function ($model) {
                    $data = @Yii::$app->params['status'];
                    return isset($data[$model->status]) ? $data[$model->status] : '';
                },
            ],
        <?php } elseif (stripos($column->name, '_by') || stripos($column->name, '_id')) { ?>
            [
                'attribute' => '<?= $column->name ?>',
                'value' => function ($model) {
                    $relation = '<?= explode('_', $column->name)[0] ?>';
                    $title = 'title';
                    return !empty($model->$relation) && isset($model->$relation->$title) ? $model->$relation->$title : '';
                },
            ],
        <?php } elseif (stripos($column->name, '_at') || stripos($column->name, '_time')) { ?>
            [
                'attribute' => '<?= $column->name ?>',
                'value' => function ($model) {
                    return date('m/d/Y', $model-><?= $column->name ?>);
                },
            ],
        <?php } else { ?>
            [
                'attribute' => '<?= $column->name ?>',
                'format' => '<?= $format ?>',
            ],
        <?php }
    }
}
?>
        ],
    ]) ?>
                </div>
            </div>
        </div>

    </div>
</div>
