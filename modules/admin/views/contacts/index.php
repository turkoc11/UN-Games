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

$this->title = Yii::$app->mv->gt('Contacts', [], false);
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
                        'attribute' => 'description',
                        // 'filter' => ArrayHelper::map(\app\models\NewsCategories::find()->all(), 'id', 'title'),
                        'content' => function($model){
                            return !empty($model->title) ? $model->description : null;
                        }
                    ],
                    // 'url:url',
                  'phone',
                    'fax',


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
                        'template' => '{update}',
                        'buttons' => [

                            'update' => function ($url, $model) {
                                return Html::a('<button type="button" class="btn btn-success btn-sm"><i class="fa fa-pencil"></i></button>', $url);
                            },

                        ]
                    ],
                ],
            ]); ?>
             <?php Pjax::end(); ?>
        </div>
    </section>
</div>
