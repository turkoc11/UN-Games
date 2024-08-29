<?php

use yii\grid\GridView;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\jui\DatePicker;
use yii\widgets\Breadcrumbs;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel app\modules\admin\models\NewsSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */
// echo'<pre>';
// var_dump($searchModel); die();

$this->title = Yii::$app->mv->gt('Отличия', [], false);
$this->params['breadcrumbs'][] = $this->title;

// echo'<pre>';
// var_dump($searchModel);
// die;

$created_at = (!empty(Yii::$app->request->get('DifferencesSearch')['created_at'])) ?Yii::$app->request->get('DifferencesSearch')['created_at'] : null;
$updated_at = (!empty(Yii::$app->request->get('DifferencesSearch')['updated_at'])) ?Yii::$app->request->get('DifferencesSearch')['updated_at'] : null;
?>

<div class="content-wrapper">
    <section class="content-header">
        <h2></h2>
        <?= Breadcrumbs::widget([
            'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
        ]) ?>
       
    </section>
    <section class="content">
        <div class="box box-primary">
        <div class="tb-hd-wp">
                    <div class="ttl-wp">
                        <h3 class="box-title"><?= Html::encode($this->title) ?> <?= Yii::t('app_admin',
                                'listing') ?></h3>
                    </div>
                    <div class="navs-wp">
                        <?php if (\app\models\Access::checkAccess('create')) { ?>
                            <?= Html::a('<i class="ti-plus"></i>' . Yii::t('app_admin',
                                    'Add New'), [ 'create' ],
                                [ 'class' => 'ns-button ns-button-white' ]) ?>
                        <?php } ?>
                    </div>
                </div>
            
            <!-- /.box-header -->
            <?php Pjax::begin(); ?>
            <?= GridView::widget([
                'dataProvider' => $dataProvider,
                'id' => 'grid',
                'layout' => "
                    <div class='box-body' style='display: block;'><div class='col-sm-12 right-text'>{summary}</div><div class='col-sm-12'>{items}</div></div>
                    <div class='box-footer' style='display: block;'>{pager}</div>
                ",
                'tableOptions' => [
                    'class' => 'table table-bordered table-hover dataTable',
                ],
                'filterModel' => $searchModel,
                'columns' => [
                    //['class' => 'yii\grid\SerialColumn'],
                    ['class' => 'yii\grid\CheckboxColumn'],

                    'id',
                    [
                        'attribute' => 'image',
                        'headerOptions' => ['style' => 'width: 150px;'],
                        'content' => function($model){
                            return Html::img($model->image,['style'=>'width: 150px;']);
                        }
                    ],
                    'title',
                    [
                        'attribute' => 'title',
                        // 'filter' => ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title'),
                        'content' => function($model){
                            return !empty($model->title) ? $model->title : null;
                        }
                    ],
                    // 'url:url',
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
                    'created_at' => [
                        'attribute' => 'created_at',
                        'filter' => DatePicker::widget([
                            'name' => 'NewsSearch[created_at]',
                            'value' => $created_at,
                            'options' => [
                                'class' => "form-control",
                                'placeholder' => ''
                            ]
                        ]),
                        'format' => 'datetime'
                    ],
                    [
                        'class' => 'yii\grid\ActionColumn',
                        'headerOptions' => ['style' => 'width: 125px;'],
                        'template' => '{view} {update} {delete}',
                        'buttons' => [
                            'view' => function ($url, $model) {
                                return Html::a('<button type="button" class="btn btn-info btn-sm"><i class="fa fa-search"></i></button>', $url);
                            },
                            'update' => function ($url, $model) {
                                return Html::a('<button type="button" class="btn btn-success btn-sm"><i class="fa fa-pencil"></i></button>', $url);
                            },
                            'delete' => function ($url, $model) {
                                return Html::a('<button type="button" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button>', $url, [
                                        'data' => [
                                            'confirm' => Yii::$app->mv->gt('Вы уверены, что хотите удалить?', [], false),
                                            'method' => 'post',
                                            'pjax' => '0'
                                        ]
                                    ]);
                            },
                        ]
                    ],
                ],
            ]); ?>
             <?php Pjax::end(); ?>
        </div>
    </section>
</div>
