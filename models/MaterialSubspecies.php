<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * This is the model class for table "material_subspecies".
 *
 * @property int $id 
 * @property string $title
 *
 
 */
class MaterialSubspecies extends \yii\db\ActiveRecord
{

    /**
     * @return string
     */
    public static function tableName()
    {
        return 'material_subspecies';
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
            [['title_en', 'title_uk'], 'required'],           
            [['title_en', 'title_uk'], 'string', 'max' => 64],            
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
            'title_en' => Yii::t('app_model', 'Title EN'),
            'title_uk' => Yii::t('app_model', 'Title UK'),
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
