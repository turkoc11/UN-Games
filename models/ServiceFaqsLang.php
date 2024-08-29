<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "News_lang".
 *
 * @property integer $id
 * @property string $title
 * @property string $description
 * @property string $language
 * @property integer $original_id
 */
class ServiceFaqsLang extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'service_faqs_lang';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'required'],
            [['id', 'original_id'], 'integer'],
            [['description', 'description2'], 'string'],
            [['title'], 'string', 'max' => 255],
            [['language'], 'string', 'max' => 6]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'title' => Yii::t('app', 'Title'),
            'description' => Yii::t('app', 'Description'),
            'description2' => Yii::t('app', 'Description2'),
            'language' => Yii::t('app', 'Language'),
            'original_id' => Yii::t('app', 'Original ID'),
        ];
    }
}
