<?php

use yii\grid\GridView;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel app\modules\admin\models\SourceMessageSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = $this->title ?: Yii::t('app_admin', 'Translations');
$this->params[ 'breadcrumbs' ][] = $this->title;
?>

<div class="container-fluid ps-ptb-30">
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">

                <div class="tb-hd-wp">
                    <div class="ttl-wp">
                        <h3 class="box-title"><?= Html::encode($this->title) ?> <?= Yii::t('app_admin', 'listing') ?></h3>
                    </div>
                    <div class="navs-wp">
                        <?php if (\app\models\Access::checkAccess('create')) { ?>
                            <?= Html::a('<i class="ti-plus"></i>' . Yii::t('app_admin', 'Add New') . ' ' . Yii::t('app_admin', rtrim($this->title, 's')), [ 'create' ], [ 'class' => 'ns-button ns-button-white' ]) ?>
                        <?php } ?>
                    </div>
                </div>

                <?php Pjax::begin(); ?>

                <div class="scrollable">
                    <?=
                    GridView::widget([
                        'dataProvider' => $dataProvider,
                        'class'        => 'table-responsive w-100',
                        'layout'       => "{summary}\n{items}\n<div class='text-center'>{pager}</div>",
                        'summary'      => false,
                        'tableOptions' => [
                            'class' => 'table table-hover contact-list',
                        ],
                        'filterModel'  => $searchModel,
                        'columns'      => [

                            [
                                'attribute'       => 'id',
                                'class'           => 'app\components\widgets\DataColumn',
                                'headerOptions'   => [ 'width' => 100 ],
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                            ],

                            [
                                'attribute'          => 'category',
                                'headerOptions'      => [ 'width' => 150 ],
                                'class'              => 'app\components\widgets\DataColumn',
                                'sortLinkOptions'    => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'      => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'        => false,
                                'filterInputOptions' => [ 'class' => 'form-control select2' ],
                                'filter'             => [ null => \Yii::t('app_model', 'All') ] + ArrayHelper::map($searchModel::getCategories(), 'category', 'category'),
                                'value'              => function ($model, $index, $dataColumn) {
                                    return $model->category;
                                },
                            ],

                            [
                                'attribute'       => 'message',
                                'class'           => 'app\components\widgets\DataColumn',
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                                'format'          => 'raw',
                                'value'           => function ($model, $index, $widget) {
                                    return Html::a($model->message, [ 'update', 'id' => $model->id ], [ 'data' => [ 'pjax' => 0 ] ]);
                                },
                            ],

                            [
                                'attribute'       => 'translations',
                                'class'           => 'app\components\widgets\DataColumn',
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                                'format'          => 'raw',
                                'value'           => function ($model, $index, $widget) {
                                    $result = '';
                                    foreach ($model->messages as $message) {
                                        $result .= '<b><span style="color: #1e6abc">' . $message->language . '</span>: ' .
                                            (!empty($message->translation) ?
                                                $message->translation :
                                                Yii::t('app_admin', 'Not translated')) . ';</b><br>';
                                    }

                                    return $result;
                                },
                            ],

                            [
                                'attribute'          => 'status',
                                'class'              => 'app\components\widgets\DataColumn',
                                'headerOptions'      => [ 'width' => 150 ],
                                'sortLinkOptions'    => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'      => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'        => false,
                                'filterInputOptions' => [ 'class' => 'form-control select2' ],
                                'filter'             => $searchModel->getStatus(),
                                'value'              => function ($model, $index, $widget) {
                                    /** @var \app\modules\admin\models\SourceMessage $model */
                                    return $model->isTranslated() ?
                                        Yii::t('app_admin', 'Translated') :
                                        Yii::t('app_admin', 'Not translated');
                                },
                            ],

                            [
                                'class'         => 'yii\grid\ActionColumn',
                                'template'      => '{delete} {update} {view}',
                                'headerOptions' => [ 'style' => 'width: 120px;' ],
                                'buttons'       => [
                                    'view' => function ($url, $model) {
                                        if (!\app\models\Access::checkAccess('view')) {
                                            return '';
                                        }

                                        return Html::a(
                                            '<button style="margin-bottom: 5px" type="button" class="btn btn-info btn-sm"><i class="fa fa-search"></i></button>',
                                            $url,
                                            [
                                                'data' => [
                                                    'pjax' => '0',
                                                ],
                                            ]
                                        );
                                    },

                                    'update' => function ($url, $model) {
                                        if (!\app\models\Access::checkAccess('update')) {
                                            return '';
                                        }

                                        return Html::a(
                                            '<button style="margin-bottom: 5px" type="button" class="btn btn-success btn-sm"><i class="fa fa-pencil"></i></button>',
                                            $url,
                                            [
                                                'data' => [
                                                    'pjax' => '0',
                                                ],
                                            ]
                                        );
                                    },

                                    'delete' => function ($url, $model) {
                                        if (!\app\models\Access::checkAccess('delete')) {
                                            return '';
                                        }

                                        return Html::a(
                                            '<button style="margin-bottom: 5px" type="button" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button>',
                                            $url,
                                            [
                                                'class' => 'confirm-alert',
                                                'data'  => [
                                                    'question_text' => Yii::t('app_admin', 'Are you sure?'),
                                                    'cancel_text'   => Yii::t('app_admin', 'No, stop it!'),
                                                    'confirm_text'  => Yii::t('app_admin', 'Yes, delete it!'),
                                                    'success_text'  => Yii::t('app_admin', "Successful!"),
                                                    'pjax'          => '0',
                                                ],
                                            ]
                                        );
                                    },
                                ],
                            ],

                        ],
                    ]); ?>
                    <?php Pjax::end(); ?>
                </div>
            </div>
        </div>
    </div>
</div>
