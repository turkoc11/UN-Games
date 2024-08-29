<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;
use yii\widgets\Breadcrumbs;

/* @var $this yii\web\View */
/* @var $searchModel app\modules\main\models\UsersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = $this->title ?: Yii::t('app', 'Patients');
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
                ]); ?>


            </div>

        </div>

        <div class="section-body">

            <div class="row">
                <div class="col-md-8">
                    <h2 class="section-title mt-0"><?= Html::encode($this->title) ?> <?= Yii::t('app',
                            'list') ?></h2>
                    <p class="section-lead"><?= Yii::t('app',
                            'Available patients') ?></p>
                </div>
                <div class="col-md-4 text-right">
                    <?php if (\app\models\Access::checkRoleAccess('create')) { ?>
                        <?= Html::a('<i class="ti-plus"></i>' . Yii::t('app',
                                'Add New') . ' ' . Yii::t('app', rtrim($this->title, 's')), ['create'],
                            ['class' => 'btn btn-primary text-right']) ?>
                    <?php } ?>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h4><?= Html::encode($this->title) ?> <?= Yii::t('app',
                                    'list') ?></h4>
                            <div class="card-header-form">

                                <form action="<?= \yii\helpers\Url::toRoute('/customers/index') ?>">
                                    <div class="input-group">
                                        <input type="text" name="CustomersSearch[title]" class="form-control"
                                               placeholder="<?= Yii::t('app', 'Search') ?>">
                                        <div class="input-group-btn">
                                            <button type="submit" class="btn btn-primary"><i class="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>


                            </div>

                        </div>

                        <div class="card-body p-0">
                            <?php Pjax::begin(); ?>
                            <?=
                            GridView::widget([
                                'dataProvider' => $dataProvider,
                                'class' => 'table-responsive w-100',
                                'layout' => "{summary}\n{items}\n
                        <div class='text-center'>{pager}</div>",
                                'summary' => false,
                                'tableOptions' => [
                                    'class' => 'table table-hover contact-list',
                                ],
                                'filterModel' => $searchModel,
                                'columns' => [

                                    [
                                        'attribute' => 'id',
                                        'class' => 'app\components\widgets\DataColumn',
                                        'headerOptions' => ['width' => 100],
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                    ],
                                    [
                                        'attribute' => 'full_name',
                                        'format' => 'raw',
                                        'content' => function ($model) {
                                            return $model->full_name;
                                        },
                                        'class' => 'app\components\widgets\DataColumn',
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                    ],
                                    [
                                        'attribute' => 'dateofbirth',
                                        'format' => 'raw',
                                        'content' => function ($model) {
                                            return ($model->dateofbirth)?date("d/m/Y", strtotime($model->dateofbirth)):'';
                                        },
                                        'class' => 'app\components\widgets\DataColumn',
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                    ],
                                    [
                                        'attribute'       => 'gender',
                                        'filter'          => Yii::$app->params[ 'gender' ],
                                        'class'           => 'app\components\widgets\DataColumn',
                                        'content'         => function ($model) {
                                            return (isset(Yii::$app->params[ 'gender' ][ $model->gender ])) ? Yii::t('app',Yii::$app->params[ 'gender' ][ $model->gender ]) : Yii::t('app','N/A');
                                        },
                                        'sortLinkOptions' => [ 'class' => 'sort-label' ],
                                        'sortLinkAddOn'   => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel'     => false,
                                    ],
                                    [
                                        'attribute'       => 'is_doctor',
                                        'filter'          => Yii::$app->params[ 'yesno' ],
                                        'class'           => 'app\components\widgets\DataColumn',
                                        'content'         => function ($model) {
                                            return ($model->is_doctor ) ? Yii::t('app','Yes') : Yii::t('app','No') ;
                                        },
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
                                        'class' => 'yii\grid\ActionColumn',
                                        'template' => '{delete} {update} {view}',
                                        'headerOptions' => ['style' => 'width: 160px;'],
                                        'buttons' => [

                                            'view' => function ($url, $model) {
                                                if (!\app\models\Access::checkRoleAccess('view')) {
                                                    return '';
                                                }

                                                return Html::a('<button style="margin-bottom: 5px" type="button" class="btn btn-info btn-sm"><i class="fas fa-search"></i></button>',
                                                    $url, [
                                                        'data' => [
                                                            'pjax' => '0',
                                                        ],
                                                    ]);
                                            },

                                            'update' => function ($url, $model) {
                                                if (!\app\models\Access::checkRoleAccess('update')) {
                                                    return '';
                                                }

                                                return Html::a('<button style="margin-bottom: 5px" type="button" class="btn btn-success btn-sm"><i class="fas fa-pen"></i></button>',
                                                    $url, [
                                                        'data' => [
                                                            'pjax' => '0',
                                                        ],
                                                    ]);
                                            },

                                            'delete' => function ($url, $model) {
                                                if (!\app\models\Access::checkRoleAccess('delete')) {
                                                    return '';
                                                }

                                                return Html::a('<button style="margin-bottom: 5px" type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>',
                                                    $url, [
                                                        'class' => 'confirm-alert',
                                                        'data' => [
                                                            'question_text' => Yii::t('app', 'Are you sure?'),
                                                            'full_text' => Yii::t('app', 'This action can`t be undone'),
                                                            'cancel_text' => Yii::t('app', 'No, stop it!'),
                                                            'confirm_text' => Yii::t('app', 'Yes, delete it!'),
                                                            'success_text' => Yii::t('app', "Successful!"),
                                                            'ok_text' => Yii::t('app', "Cancelled!"),
                                                            'pjax' => '0',
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
    </section>
</div>
