<?php
 
use yii\helpers\Html;
use yii\grid\GridView;
 
$this->title = \Yii::t('app_admin', 'Data base');
$this->params['breadcrumbs'][] = $this->title;
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
                                    'Create DB dump') . ' ' . Yii::t('app_admin', rtrim($this->title, 's')), [ 'export' ],
                                [ 'class' => 'ns-button ns-button-white' ]) ?>
                        <?php } ?>
                    </div>
                </div>
    
 
            <?= GridView::widget([
                    'dataProvider' => $dataProvider,
                    'class'        => 'table-responsive w-100',
                    'summary'      => false,
                    'columns' => [
                        ['class' => 'yii\grid\SerialColumn'],
                        [
                            'attribute' => 'dump',
                            'format' => 'text',
                            'label' => Yii::t('app_admin', 'path to the dump'),
                        ],
                        [
                            'format'=>'raw',
                            'value' => function($data,$id){
                                return Html::a(
                                    '<button style="margin-bottom: 5px" type="button" class="btn btn-info btn-sm"><i class="fa fa-search">'.Yii::t('app_admin', ' import').'</i></button>',
                                    \yii\helpers\Url::to(['db/import','path'=>$data['dump']]),
                                    [
                                        'data' => [
                                            'pjax' => '0',
                                        ],
                                    ]
                                );
                                
                            }
                        ],
                        [
                            'format'=>'raw',
                            //кнопку удаления выводим только если >1 дампа БД
                            'value' => function($data,$id){
                                if(Yii::$app->params['count_db'] > 1){
                                    return Html::a('<button style="margin-bottom: 5px" type="button" class="btn btn-danger btn-sm"><i
                                        class="fa fa-trash-o"></i></button>',
                                                                    \yii\helpers\Url::to(['db/delete','path'=> $data['dump']]),
                                            [
                                            'class' => 'confirm-alert',
                                            'data' => [
                                            'question_text' => Yii::t('app_admin', 'Are you sure?'),
                                            'cancel_text' => Yii::t('app_admin', 'No, stop it!'),
                                            'confirm_text' => Yii::t('app_admin', 'Yes, delete it!'),
                                            'success_text' => Yii::t('app_admin', "Successful!"),
                                            'pjax' => '0',
                                            ],
                                    ]);                        
                                } else return false;
                            }
                        ],
                    ],
                ]); ?>
            </div>
        </div>
    </div>
</div>