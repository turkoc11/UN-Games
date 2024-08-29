<?php

namespace app\modules\user\models;

use app\components\FilterBehavior;
use Yii;

/**
 * This is the model class for table "collections".
 *
 * @property int $id 
 * @property string $title
 *
 
 */
class SmsCode extends \yii\db\ActiveRecord
{

    /**
     * @return string
     */
    public static function tableName()
    {
        return 'sms_codes';
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
            [['nick_name', 'code'], 'required'],           
            [['nick_name'], 'string', 'max' => 100],                   
            [['code'], 'integer'],
            [['user_id'], 'integer'],
            //[['id'], 'exist', 'skipOnError' => true, 'targetClass' => SourceMessage::class, 'targetAttribute' => ['id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app_model', 'ID'),
            'user_id' => Yii::t('app_model', 'User ID'),
            'nick_name' => Yii::t('app_model', 'Nick name'),
            'code' => Yii::t('app_model', 'Code'),            
        ];
    }

    public static function findByNickNameAndCode($nickName, $code)
    {
        return static::find()->where(['nick_name' => $nickName])->andWhere(['code' => $code])->one();
    }
    
    public function getRandomCode()
    {
        return rand(1000,9999);
    }
    
    public static function findByNickName($nickName)
    {
        return static::find()->where(['nick_name' => $nickName])->one();
    }

}
