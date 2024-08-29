<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * This is the model class for table "dynamic".
 *
 * @property int $id 
 * @property string $name User name
 * @property string $email_User email
 * @property string $description Feedback description
 * @property string $ip User ip
 * @property string $file User file 
 * @property integer $created_at
 * @property integer $updated_at 
 */

class Feedback extends \yii\db\ActiveRecord
{

    /**
     * @return string
     */
    public static function tableName()
    {
        return 'feedback';
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
            [['first_name', 'last_name',  'description', 'email' ], 'required'],
            [['id', 'created_at', 'updated_at'], 'integer'],
            [['first_name', 'last_name', 'description', 'ip'], 'string'],
            [['email'], 'email'],
            [['description', ], 'string', 'max' => 160],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app_model', 'ID'),            
            'description' => Yii::t('app_model', "I'm interested in"),
            'first_name' => Yii::t('app_model', 'First Name'),
            'last_name' => Yii::t('app_model', 'Last Name'),
            'ip' => Yii::t('app_model', 'Ip'),            
            'email' =>  Yii::t('app_model', 'Email'),           
        ];
    }
    
    // public function actionValidate()
    // {
    //     $model = $this->model;
    //     $request = \Yii::$app->getRequest();
    //     if ($request->isPost && $model->load($request->post())) {
    //         \Yii::$app->response->format = Response::FORMAT_JSON;
    //         return ActiveForm::validate($model);
    //     }
    // }

}
