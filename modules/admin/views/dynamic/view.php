<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Dynamic */

$this->title = Yii::t('app_admin', 'Static');
$this->params[ 'breadcrumbs' ][] = [ 'label' => Yii::t('app_admin', 'Dynamics'), 'url' => [ 'index' ] ];
$this->params[ 'breadcrumbs' ][] = $this->title;
?>


<div class="container-fluid ps-ptb-30">
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">

                <div class="tb-hd-wp">
                    <div class="ttl-wp">
                        <h3 class="box-title"> <?= $model->title ?> </h3>
                    </div>
                    <div class="navs-wp">

                        <?php if (\app\models\Access::checkAccess('index')) { ?>
                            <?= Html::a('<i class="ti-back-left"></i>' . Yii::t('app_admin', 'Назад к списку'), [ 'index' ],
                                [ 'class' => 'btn btn-success btn-rounded' ]) ?>
                        <?php } ?>

                        <?php if (\app\models\Access::checkAccess('update')) { ?>
                            <?= Html::a('<i class="ti-pencil"></i>' . Yii::t('app_admin', 'Edit info'),
                                [ 'update', 'id' => $model->id ], [ 'class' => 'ns-button ns-button-white' ]) ?>
                        <?php } ?>

                        <?php if (\app\models\Access::checkAccess('delete')) { ?>
                            <?= Html::a('<i class="ti-trash"></i>' . Yii::t('app_admin',
                                    'Delete') . ' ' . Yii::t('app_admin', rtrim(strtolower($this->title)), 's'),
                                [ 'delete', 'id' => $model->id ], [
                                    'class' => 'btn btn-danger btn-rounded confirm-alert',
                                    'type'  => 'button',
                                    'data'  => [
                                        'question_text' => Yii::t('app_admin', 'Are you sure?'),
                                        'cancel_text'   => Yii::t('app_admin', 'No, stop it!'),
                                        'confirm_text'  => Yii::t('app_admin', 'Yes, delete it!'),
                                        'success_text'  => Yii::t('app_admin', "Successful!"),
                                    ],
                                ]) ?>
                        <?php } ?>

                    </div>
                </div>


                <div class="scrollable">
                    <div class="table-responsive w-100 ps-mb-30 brd-1-g">
                        <table class="table m-b-0 t-col-50">
                            <thead>
                            <tr>
                                <th class="bg-ob"><?= Yii::t('app_admin',
                                        rtrim($this->title, 's')) ?> <?= Yii::t('app_admin', 'info') ?></th>
                            </tr>
                            </thead>
                        </table>

                        <?= DetailView::widget([
                            'model'      => $model,
                            'options'    => [
                                'class' => 'table m-b-0 t-col-50',
                            ],
                            'attributes' => [
                                [
                                    'attribute' => 'id',
                                ],
                                [
                                    'attribute' => 'title',
                                    'format'    => 'raw',
                                    'value'     => function ($model) {
                                        if (!\app\models\Access::checkAccess('view')) {
                                            return Html::img(\yii\helpers\Url::to('/images/default.jpeg'), [
                                                    'class' => 'img-circle',
                                                    'style' => 'width:30px;'
                                                ]) . $model->title;
                                        }

                                        return Html::a(Html::img(\yii\helpers\Url::to('/images/default.jpeg'),
                                                [ 'class' => 'img-circle', 'style' => 'width:30px;' ]) . $model->title,
                                            [ 'update', 'id' => $model->id ], [ 'class' => 'link-toggler' ]);
                                    },
                                ],
                                [
                                    'attribute' => 'sub_title',
                                    'format'    => 'text',
                                ],
                                [
                                    'attribute' => 'url',
                                    'format'    => 'url',
                                ],
                                [
                                    'attribute' => 'image',
                                    'format'    => 'text',
                                ],
                                [
                                    'attribute' => 'short_description',
                                    'format'    => 'ntext',
                                ],
                                [
                                    'attribute' => 'description',
                                    'format'    => 'ntext',
                                ],
                                [
                                    'attribute' => 'status',
                                    'format'    => 'text',
                                ],
                                [
                                    'attribute' => 'meta_title',
                                    'format'    => 'text',
                                ],
                                [
                                    'attribute' => 'meta_description',
                                    'format'    => 'text',
                                ],
                                [
                                    'attribute' => 'meta_keyword',
                                    'format'    => 'text',
                                ],
                            ],
                        ]) ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
