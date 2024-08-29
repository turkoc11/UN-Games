<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * This is the model class for table "dynamic".
 *
 * @property int $id 
 * @property string $model_name Model name
 * @property string $model_title Model title
 * @property string $email email
 * @property string $action Action
 * @property integer $model_id Model ID
 * @property integer $created_at
 * @property integer $updated_at 
 */

class Log extends \yii\db\ActiveRecord
{

    /**
     * @return string
     */
    public static function tableName()
    {
        return 'logs';
    }

    public function behaviors()
    {
        return [
            FilterBehavior::class,
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['email', 'model_name',  'model_title', 'model_id', 'action' ], 'required'],
            [['model_id', 'created_at', 'updated_at'], 'integer'],
            [['action', 'model_name', 'model_title'], 'string'],
            [['email'], 'email'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app_model', 'ID'),            
            'model_name' => Yii::t('app_model', "Model name"),
            'model_title' => Yii::t('app_model', 'Model Title'),
            'action' => Yii::t('app_model', 'Action'),
            'model_id' => Yii::t('app_model', 'Model ID'),
            'email' =>  Yii::t('app_model', 'Email'),
            'created_at' => Yii::t('app_model', 'Created At'),
        ];
    }
    
     public static function createRow($modelName, $modelTitle, $action, $modelID)
     {
         $model = new Log();
         $model->model_name = $modelName;
         $model->model_title = $modelTitle;
         $model->action = $action;
         $model->model_id = $modelID;
         $model->email = Yii::$app->user->identity->email;
         $model->created_at = time();
         $model->save();

     }

}
