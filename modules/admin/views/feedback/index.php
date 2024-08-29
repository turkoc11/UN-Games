<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel app\modules\admin\models\FeedbackSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = $this->title ?: Yii::t('app_admin', 'Feedbacks');
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="container-fluid ps-ptb-30">
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">

                <div class="tb-hd-wp">
                    <div class="ttl-wp">
                        <h3 class="box-title"><?= Html::encode($this->title) ?> <?=                             Yii::t('app_admin', 'listing') ?></h3>
                    </div>
                </div>

                
                <div class="scrollable">
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
                                        'headerOptions' => ['width' => 50],
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                        ],
                                        [
                                        'attribute' => 'first_name',
                                        'format' => 'raw',
                                        'class' => 'app\components\widgets\DataColumn',
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                        ],
                                        [
                                         'attribute' => 'last_name',
                                        'format' => 'raw',
                                        'class' => 'app\components\widgets\DataColumn',
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                        ],
                                                                            [
                                        'attribute' => 'email',
                                        'format' => 'text',
                                        'class' => 'app\components\widgets\DataColumn',
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                        ],
                                                                            [
                                        'attribute' => 'description',
                                        'format' => 'ntext',
                                        'class' => 'app\components\widgets\DataColumn',
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                        ],

                                                                            [
                                        'attribute' => 'ip',
                                        'format' => 'text',
                                        'class' => 'app\components\widgets\DataColumn',
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                        ],
                            [
                                        'attribute' => 'created_at',
                                        'class' => 'app\components\widgets\DataColumn',
                                        'headerOptions' => ['width' => 225],
                                        'sortLinkOptions' => ['class' => 'sort-label'],
                                        'sortLinkAddOn' => '<i class="ti-arrows-vertical"></i>',
                                        'encodeLabel' => false,
                                        'value' => function ($model) {
                                        return date('d.m.Y', $model->created_at);
                                        },
                                        'filterInputOptions' => [
                                        'class' => 'form-control datepicker',
                                        'data' => [
                                        'autoclose' => true,
                                        'format' => 'dd.mm.yyyy',
                                        ],
                                        ],
                                        ],
                                       
//                                       
                                    
                        [
                        'class' => 'yii\grid\ActionColumn',
                        'template' => '{delete} {view}',
                        'headerOptions' => ['style' => 'width: 120px;'],
                        'buttons' => [
                        'view' => function ($url, $model) {
                        if (!\app\models\Access::checkAccess('view')) {
                        return '';
                        }
                        return Html::a(
                        '
                        <button style="margin-bottom: 5px" type="button" class="btn btn-info btn-sm"><i
                                    class="fa fa-search"></i></button>',
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
                                                                      '
                        <button style="margin-bottom: 5px" type="button" class="btn btn-success btn-sm"><i
                                    class="fa fa-pencil"></i></button>',
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
                                                                      '
                        <button style="margin-bottom: 5px" type="button" class="btn btn-danger btn-sm"><i
                                    class="fa fa-trash-o"></i></button>',
                        $url,
                        [
                        'class' => 'confirm-alert',
                        'data' => [
                        'question_text' => Yii::t('app_admin', 'Are you sure?'),
                        'cancel_text' => Yii::t('app_admin', 'No, stop it!'),
                        'confirm_text' => Yii::t('app_admin', 'Yes, delete it!'),
                        'success_text' => Yii::t('app_admin', "Successful!"),
                        'pjax' => '0',
                        ],
                        ]
                        );
                        },

                        ],
                        ],

                        ],
                        ]); ?>
                                                        </div>
            </div>
        </div>
    </div>
</div>
