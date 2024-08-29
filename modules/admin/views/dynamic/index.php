<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel app\modules\admin\models\DynamicSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('app_admin', 'Static');
$this->params[ 'breadcrumbs' ][] = $this->title;
?>

<div class="container-fluid ps-ptb-30">
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">

                <div class="tb-hd-wp">
                    <div class="ttl-wp">
                        <h3 class="box-title"><?= Html::encode($this->title) ?> <?= Yii::t('app_admin',
                                'listing') ?></h3>
                    </div>
                    <div class="navs-wp">
                        <?php if (\app\models\Access::checkAccess('create')) { ?>
                            <?= Html::a('<i class="ti-plus"></i>' . Yii::t('app_admin',
                                    'Add New') . ' ' . Yii::t('app_admin', rtrim($this->title, 's')), [ 'create' ],
                                [ 'class' => 'ns-button ns-button-white' ]) ?>
                        <?php } ?>
                    </div>
                </div>
                <?php //var_dump(55555555); die; ?>
                <?php Pjax::begin(); ?>

                <div class="scrollable">
                    <?= GridView::widget([
                        'dataProvider' => $dataProvider,
                        'class'        => 'table-responsive w-100',
                        'summary'      => false,
                        'tableOptions' => [
                            'class' => 'table table-hover contact-list',
                        ],
                        'filterModel'  => $searchModel,
                        'columns'      => [

                            [
                                'attribute'       => 'id',
                                'class'           => 'app\components\widgets\DataColumn',
                                'headerOptions'   => [ 'width' => 50 ],
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                            ],
                            [
                                'attribute'       => 'title',
                                'format'          => 'raw',
//                                'content'         => function ($model) {
//                                    if (!\app\models\Access::checkAccess('view')) {
//                                        return Html::img(\yii\helpers\Url::to('/images/default.jpeg'),
//                                                [ 'class' => 'img-circle' ]) . $model->title;
//                                    }
//
//                                    return Html::a(Html::img(\yii\helpers\Url::to('/images/default.jpeg'),
//                                            [ 'class' => 'img-circle' ]) . $model->title, [ 'view', 'id' => $model->id ],
//                                        [ 'class' => 'link-toggler' ]);
//                                },
                                'class'           => 'app\components\widgets\DataColumn',
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                            ],
//                            [
//                                'attribute'       => 'image',
//                                'format'          => 'text',
//                                'class'           => 'app\components\widgets\DataColumn',
//                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
//                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
//                                'encodeLabel'     => false,
//                            ],
                            [
                                'attribute'       => 'url',
                                'format'          => 'url',
                                'class'           => 'app\components\widgets\DataColumn',
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                            ],
                            [
                                'attribute'       => 'status',
                                'filter'          => Yii::$app->params[ 'statuses' ],
                                'class'           => 'app\components\widgets\DataColumn',
                                'content'         => function ($model) {
                                    return (isset(Yii::$app->params[ 'statuses' ][ $model->status ])) ? Yii::$app->params[ 'statuses' ][ $model->status ] : '';
                                },
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                            ],
                            [
                                'attribute'       => 'template',
                                'filter'          => Yii::$app->params[ 'dynamic_template' ],
                                'class'           => 'app\components\widgets\DataColumn',
                                'content'         => function ($model) {
                                    return (isset(Yii::$app->params[ 'dynamic_template' ][ $model->template ])) ? Yii::$app->params[ 'dynamic_template' ][ $model->template ] : '';
                                },
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                            ],
                            //'meta_title',
                            //'meta_description',
                            //'meta_keyword',
                            [
                                'class'         => 'yii\grid\ActionColumn',
                                'template'      => '{update} {view} {delete}',
                                'headerOptions' => [ 'style' => 'width: 120px;' ],
                                'buttons'       => [

                                    'view' => function ($url, $model) {
                                        if (!\app\models\Access::checkAccess('view')) {
                                            return '';
                                        }

                                        return Html::a('<button style="margin-bottom: 5px" type="button" class="btn btn-info btn-sm"><i class="fa fa-search"></i></button>',
                                            $url, [
                                                'data' => [
                                                    'pjax' => '0',
                                                ],
                                            ]);
                                    },

                                    'update' => function ($url, $model) {
                                        if (!\app\models\Access::checkAccess('update')) {
                                            return '';
                                        }

                                        return Html::a('<button style="margin-bottom: 5px" type="button" class="btn btn-success btn-sm"><i class="fa fa-pencil"></i></button>',
                                            $url, [
                                                'data' => [
                                                    'pjax' => '0',
                                                ],
                                            ]);
                                    },

                                     'delete' => function ($url, $model) {
                                         if (!\app\models\Access::checkAccess('delete')) {
                                             return '';
                                         }

                                         return Html::a('<button style="margin-bottom: 5px" type="button" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button>',
                                             $url, [
                                                 'class' => 'confirm-alert',
                                                 'data'  => [
                                                     'question_text' => Yii::t('app_admin', 'Are you sure?'),
                                                     'cancel_text'   => Yii::t('app_admin', 'No, stop it!'),
                                                     'confirm_text'  => Yii::t('app_admin', 'Yes, delete it!'),
                                                     'success_text'  => Yii::t('app_admin', "Successful!"),
                                                     'pjax'          => '0',
                                                 ],
                                             ]);
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
