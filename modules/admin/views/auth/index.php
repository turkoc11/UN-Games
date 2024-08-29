<?php

use app\modules\admin\models\Users;
use yii\grid\GridView;
use yii\helpers\Html;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel app\modules\admin\models\AuthItemSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = $this->title ?: Yii::t('app_admin', 'Roles');
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
                                'attribute'       => 'name',
                                'format'          => 'raw',
                                'content'         => function ($model) {
                                    if (!\app\models\Access::checkAccess('view')) return $model->name;
                                    return Html::a(
                                        $model->name,
                                        [ 'view', 'name' => $model->name ],
                                        [ 'class' => 'link-toggler' ]
                                    );
                                },
                                'class'           => 'app\components\widgets\DataColumn',
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                            ],
                            [
                                'attribute'       => 'description',
                                'format'          => 'ntext',
                                'class'           => 'app\components\widgets\DataColumn',
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                            ],

                            //[
                            //    'attribute' => 'created_at',
                            //    'class' => 'app\components\widgets\DataColumn',
                            //    'headerOptions' => ['width' => 225],
                            //    'sortLinkOptions' => ['class' => 'sort-label'],
                            //    'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                            //    'encodeLabel' => false,
                            //    'value' => function ($model) {
                            //        return date('d.m.Y', $model->created_at);
                            //    },
                            //    'filterInputOptions' => [
                            //        'class' => 'form-control datepicker',
                            //        'data' => [
                            //            'autoclose' => true,
                            //            'format' => 'dd.mm.yyyy',
                            //        ],
                            //    ],
                            //],

                            //[
                            //    'attribute' => 'updated_at',
                            //    'class' => 'app\components\widgets\DataColumn',
                            //    'headerOptions' => ['width' => 225],
                            //    'sortLinkOptions' => ['class' => 'sort-label'],
                            //    'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                            //    'encodeLabel' => false,
                            //    'value' => function ($model) {
                            //        return date('d.m.Y', $model->updated_at);
                            //    },
                            //    'filterInputOptions' => [
                            //        'class' => 'form-control datepicker',
                            //        'data' => [
                            //            'autoclose' => true,
                            //            'format' => 'dd.mm.yyyy',
                            //        ],
                            //    ],
                            //],

                            [
                                'attribute'          => 'created_by',
                                'headerOptions'      => [ 'style' => 'min-width: 200px' ],
                                'class'              => 'app\components\widgets\DataColumn',
                                'sortLinkOptions'    => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'      => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'        => false,
                                'filterInputOptions' => [ 'class' => 'form-control select2' ],
                                'filter'             => [ null => Yii::t('app_admin', 'All') ] + Users::getAll(),
                                'value'              => function ($model) {
                                    return !empty($model->created) ? $model->created->fullName : null;
                                },
                            ],

                            [
                                'attribute'          => 'updated_by',
                                'headerOptions'      => [ 'style' => 'min-width: 200px' ],
                                'class'              => 'app\components\widgets\DataColumn',
                                'sortLinkOptions'    => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'      => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'        => false,
                                'filterInputOptions' => [ 'class' => 'form-control select2' ],
                                'filter'             => [ null => Yii::t('app_admin', 'All') ] + Users::getAll(),
                                'value'              => function ($model) {
                                    return !empty($model->created) ? $model->created->fullName : null;
                                },
                            ],

                            [
                                'attribute'       => 'permissions',
                                'class'           => 'app\components\widgets\DataColumn',
                                'contentOptions'  => [ 'style' => 'min-width: 250px; max-width: 500px; white-space: normal;' ],
                                'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                'encodeLabel'     => false,
                                'format'          => 'raw',
                                'value'           => function ($model, $index, $widget) {
                                    $result = '';
                                    foreach ($model->children as $child) {
                                        $result .= '<b><span style="color: #414141">' . $child->description . '</span></b>; ';
                                    }

                                    return $result;
                                },
                            ],

                            [
                                'class'         => 'yii\grid\ActionColumn',
                                'template'      => '{delete} {update} {view}',
                                'headerOptions' => [ 'style' => 'width: 120px;' ],
                                'buttons'       => [

                                    'view' => function ($url, $model) {
                                        $url = str_replace('id', 'name', $url);

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

                                        $url = str_replace('id', 'name', $url);

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
                                        $url = str_replace('id', 'name', $url);

                                        if (!\app\models\Access::checkAccess('delete') || $model->rule_name != 'dynamic') {
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
