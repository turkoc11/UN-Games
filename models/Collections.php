<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * This is the model class for table "collections".
 *
 * @property int $id 
 * @property string $title
 *
 
 */
class Collections extends \yii\db\ActiveRecord
{

    /**
     * @return string
     */
    public static function tableName()
    {
        return 'collections';
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
            [['title'], 'required'],           
            [['title'], 'string', 'max' => 64],                   
            [['code'], 'integer'],
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
            'title' => Yii::t('app_model', 'Title'),
            'code' => Yii::t('app_model', 'Code'),            
        ];
    }

    public static function findByProductId($id, $code = null)
    {
        return static::find()->where(['product_id' => $id])->one();
    }
    // public function getSourceMessage()
    // {
    //     return $this->hasOne(SourceMessage::class, ['id' => 'id']);
    // } 

}
