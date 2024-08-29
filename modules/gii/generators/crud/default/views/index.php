<?php

use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\crud\Generator */

$urlParams = $generator->generateUrlParams();
$nameAttribute = $generator->getNameAttribute();

echo "<?php\n";
?>

use yii\helpers\Html;
use <?= $generator->indexWidgetType === 'grid' ? "yii\\grid\\GridView" : "yii\\widgets\\ListView" ?>;
<?= $generator->enablePjax ? 'use yii\widgets\Pjax;' : '' ?>

/* @var $this yii\web\View */
<?= !empty($generator->searchModelClass) ? "/* @var \$searchModel " . ltrim($generator->searchModelClass, '\\') . " */\n" : '' ?>
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = $this->title ?: <?= $generator->generateString(Inflector::pluralize(Inflector::camel2words(StringHelper::basename($generator->modelClass)))) ?>;

?>

<div class="ns-container-outer">
    <div class="ns-container-inner">

        <div class="row ns-mb-15">
            <div class="col-xs-6">
                <div class="ns-actions text-left xxs-left">
                    <h3 class="box-title"><?= "<?= " ?>Html::encode($this->title) ?></h3>
                </div>
            </div>
            <div class="col-xs-6">
                <div class="ns-actions text-right xxs-left">
                    <?php $i = '+ '; ?>
                    <?= "<?php " ?> if (\app\models\Access::checkAccess('create')) { ?>
                        <?= "<?= " ?>Html::a('<?= $i ?>'.Yii::t('app_admin', 'Add New').' '.Yii::t('app_admin', $this->title), ['create'], ['class' => 'ns-button']) ?>
                    <?= "<?php " ?> } ?>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12">

                <?= $generator->enablePjax ? "    <?php Pjax::begin(); ?>\n" : '' ?>

                <div class="scrollable">
                    <?php if ($generator->indexWidgetType === 'grid'): ?>
                        <?= "<?= \n" ?>
                        GridView::widget([
                        'dataProvider' => $dataProvider,
                        'class' => 'table-responsive w-100',
                        'id' => 'grid',
                        'layout' => "{summary}\n{items}\n<div class='text-center'>{pager}</div>",
                        'summary' => false,
                        'tableOptions' => [
                            'class' => 'ns-table ns-grid',
                        ],
                        <?= !empty($generator->searchModelClass) ? "'filterModel' => \$searchModel,\n                        'columns' => [\n" : "'columns' => [\n"; ?>

                        <?php
                        $count = 0;
                        if (($tableSchema = $generator->getTableSchema()) === false) {
                            foreach ($generator->getColumnNames() as $name) {
                                if (++$count < 8) {

                                    if ($name == 'id') { ?>
                                        [
                                            'attribute' => '<?= $name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control',
                                            ]
                                        ],
                                    <?php } elseif ($name =='title' || $name == 'name') { ?>
                                        [
                                            'attribute' => '<?= $name ?>',
                                            'format' => 'raw',
                                            'content' => function ($model) {
                                            if (!\app\models\Access::checkAccess('view')) {
                                                return Html::img(\yii\helpers\Url::to('/images/default.jpeg'), ['class' => 'img-circle']) . $model->title;
                                            }
                                            return Html::a(
                                                Html::img(\yii\helpers\Url::to('/images/default.jpeg'), ['class' => 'img-circle']) . $model->title,
                                                    ['view', 'id' => $model->id],
                                                    ['class' => 'link-toggler']
                                                );
                                            },
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control',
                                            ]
                                        ],
                                    <?php } elseif ($name == 'status') { ?>
                                        [
                                            'attribute' => '<?= $name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control select2',
                                                'data' => [
                                                    'allow-clear' => true,
                                                    'placeholder' => Yii::t('app_admin', 'Any'),
                                                ]
                                            ],
                                            'filter' => @Yii::$app->params['status'],
                                            'value' => function ($model) {
                                                $data = @Yii::$app->params['status'];
                                                return isset($data[$model->status]) ? $data[$model->status] : '';
                                            },
                                        ],
                                    <?php } elseif (stripos($name, '_by') || stripos($name, '_id')) { ?>
                                        [
                                            'attribute' => '<?= $name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control select2',
                                                'data' => [
                                                    'allow-clear' => true,
                                                    'placeholder' => Yii::t('app_admin', 'Any'),
                                                ]
                                            ],
                                            'filter' => [],
                                            'value' => function ($model) {
                                                $relation = '<?= explode('_', $name)[0] ?>';
                                                $title = 'title';
                                                return !empty($model->$relation) && isset($model->$relation->$title) ? $model->$relation->$title : '';
                                            },
                                        ],
                                    <?php } elseif (stripos($name, '_at') || stripos($name, '_time')) { ?>
                                        [
                                            'attribute' => '<?= $name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'headerOptions' => ['width' => 225],
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'value' => function ($model) {
                                                return date('m/d/Y', $model-><?= $name ?>);
                                            },
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control datepicker',
                                                'data' => [
                                                    'autoclose' => 'on',
                                                    'format'    => 'mm/dd/yyyy',//'mm-dd-yyyy',
                                                    'clear-btn' => true
                                                ],
                                            ],
                                        ],
                                    <?php } else { ?>
                                        [
                                            'attribute' => '<?= $name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control',
                                            ]
                                        ],
                                    <?php }
                                } else {
                                    echo "            //'" . $name . "',\n";
                                }
                            }
                        } else {
                            foreach ($tableSchema->columns as $column) {
                                $format = $generator->generateColumnFormat($column);
                                if (++$count < 8) {

                                    if ($column->name == 'id') { ?>
             [
                                            'attribute' => '<?= $column->name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control',
                                            ]
                                        ],
                                    <?php } elseif ($column->name == 'title' || $column->name == 'name') { ?>
                                        [
                                            'attribute' => '<?= $column->name ?>',
                                            'format' => 'raw',
                                            'content' => function ($model) {
                                                if (!\app\models\Access::checkAccess('view')) {
                                                    return Html::img(\yii\helpers\Url::to('/images/default.jpeg'), ['class' => 'img-circle']) . $model->title;
                                                }
                                                return Html::a(
                                                    Html::img(\yii\helpers\Url::to('/images/default.jpeg'), ['class' => 'img-circle']) . $model->title,
                                                    ['view', 'id' => $model->id],
                                                    ['class' => 'link-toggler']
                                                );
                                            },
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control',
                                            ]
                                        ],
                                    <?php } elseif ($column->name == 'status') { ?>
                                        [
                                            'attribute' => '<?= $column->name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control select2',
                                                'data' => [
                                                    'allow-clear' => true,
                                                    'placeholder' => Yii::t('app_admin', 'Any'),
                                                ]
                                            ],
                                            'filter' => @Yii::$app->params['status'],
                                            'value' => function ($model) {
                                                $data = @Yii::$app->params['status'];
                                                return isset($data[$model->status]) ? $data[$model->status] : '';
                                            },
                                        ],
                                    <?php } elseif (stripos($column->name, '_by') || stripos($column->name, '_id')) { ?>
                                        [
                                            'attribute' => '<?= $column->name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control select2',
                                                'data' => [
                                                    'allow-clear' => true,
                                                    'placeholder' => Yii::t('app_admin', 'Any'),
                                                ]
                                            ],
                                            'filter' => [],
                                            'value' => function ($model) {
                                                $relation = '<?= explode('_', $column->name)[0] ?>';
                                                $title = 'title';
                                                return !empty($model->$relation) && isset($model->$relation->$title) ? $model->$relation->$title : '';
                                            },
                                        ],
                                    <?php } elseif (stripos($column->name, '_at') || stripos($column->name, '_time')) { ?>
                                        [
                                            'attribute' => '<?= $column->name ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'headerOptions' => ['width' => 225],
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'value' => function ($model) {
                                                return date('m/d/Y', $model-><?= $column->name ?>);
                                            },
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control datepicker',
                                                'data' => [
                                                    'autoclose' => 'on',
                                                    'format' => 'mm/dd/yyyy',
                                                    'clear-btn' => true
                                                ],
                                            ],
                                        ],
                                    <?php } else { ?>
                                        [
                                            'attribute' => '<?= $column->name ?>',
                                            'format' => '<?= $format ?>',
                                            'class' => 'app\components\widgets\DataColumn',
                                            'sortLinkOptions' => ['class' => 'sort-label'],
                                            'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                            'encodeLabel' => false,
                                            'filterWrapTag' => 'div',
                                            'filterWrapAttributes' => ['class' => 'form-group ns-field'],
                                            'filterInputOptions' => [
                                                'class' => 'form-control',
                                            ]
                                        ],
                                    <?php }
                                } else {
                                    echo "//'" . $column->name . ($format === 'text' ? "" : ":" . $format) . "',\n";
                                }
                            }
                        }
                        ?>

                                        [
                                            'class' => 'yii\grid\ActionColumn',
                                            'template' => '{delete} {update} {view}',
                                            'headerOptions' => ['style' => 'width: 120px;'],
                                            'buttons' => [
                                               'view' => function ($url, $model) {
                                                    if (!\app\models\Access::checkAccess('view')) return '';
                                                    $message = Yii::t('app_admin', 'View');
                                                    return Html::a(
                                                        '<button style="margin-bottom: 5px" type="button" data-toggle="tooltip" data-placement="top" title="'.$message.'" class="btn btn-info btn-sm"><i class="fa fa-search"></i></button>',
                                                        $url,
                                                        [
                                                            'data' => [
                                                                'pjax' => '0',
                                                            ],
                                                        ]
                                                    );
                                                },

                                               'update' => function ($url, $model) {
                                                   if (!\app\models\Access::checkAccess('update')) return '';
                                                   $message = Yii::t('app_admin', 'Update');
                                                   return Html::a(
                                                        '<button style="margin-bottom: 5px" type="button" data-toggle="tooltip" data-placement="top" title="'.$message.'" class="btn btn-success btn-sm"><i class="fa fa-pencil"></i></button>',
                                                        $url,
                                                        [
                                                            'data' => [
                                                                'pjax' => '0',
                                                            ],
                                                        ]
                                                    );
                                                },

                                               'delete' => function ($url, $model) {
                                                     if (!\app\models\Access::checkAccess('delete')) return '';
                                                        $message = Yii::t('app_admin', 'Delete');
                                                     return Html::a(
                                                         '<button style="margin-bottom: 5px" type="button" data-toggle="tooltip" data-placement="top" title="'.$message.'" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button>',
                                                        $url,
                                                        [
                                                            'class' => 'confirm-alert',
                                                            'data' => [
                                                                'question_text' => Yii::t('app_admin', 'Are you sure?'),
                                                                'cancel_text' => Yii::t('app_admin', 'No, stop it!'),
                                                                'confirm_text' => Yii::t('app_admin', 'Yes, delete it!'),
                                                                'success_text' => Yii::t('app_admin', "Successful!"),
                                                                'pjax' => '0',
                                                                'url' => $url
                                                            ],
                                                        ]
                                                    );
                                                },

                                            ],
                                        ],

                        ],
                        ]); ?>
                    <?php else: ?>
                        <?= "<?= " ?>ListView::widget([
                            'dataProvider' => $dataProvider,
                            'itemOptions' => ['class' => 'item'],
                            'itemView' => function ($model, $key, $index, $widget) {
                                 return Html::a(Html::encode($model-><?= $nameAttribute ?>), ['view', <?= $urlParams ?>]);
                        },
                        ]) ?>
                    <?php endif; ?>
                </div>

                <?= $generator->enablePjax ? "<?php Pjax::end(); ?>\n" : '' ?>

                <div class="form-preload"></div>

            </div>
        </div>
    </div>
</div>

