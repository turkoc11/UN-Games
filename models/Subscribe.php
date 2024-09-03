<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * This is the model class for table "dynamic".
 *
 * @property int $id
 * @property string $email_User email
 * @property integer $created_at
 * @property integer $updated_at 
 */

class Subscribe extends \yii\db\ActiveRecord
{

    /**
     * @return string
     */
    public static function tableName()
    {
        return 'subscribe';
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
            [[ 'email' ], 'required'],
	    [['email'], 'unique'],	
            [['id', 'created_at', 'updated_at'], 'integer'],
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
            'email' =>  Yii::t('app_model', 'Email'),
        ];
    }


}
