<?php

namespace app\models;

use Yii;
/**
* This is the model class for table "meta_tags_lang".
*
    * @property integer $id
    * @property string $title
    * @property string $keywords
    * @property string $description
    * @property string $og__image
*/
class MetaTagsLang extends \yii\db\ActiveRecord
{
    /**
    * @inheritdoc
    */
    public static function tableName()
    {
        return 'meta_tags_lang';
    }

    
    /**
    * @inheritdoc
    */
    public function rules()
    {
        return [
            [['keywords'], 'string'],
            [['title', 'description', 'og__image'], 'string', 'max' => 255],
            [['original_id'], 'integer'],
            [['language'], 'string', 'max' => 12]
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
                    'keywords' => Yii::t('app', 'Keywords'),
                    'description' => Yii::t('app', 'Description'),
                    'og__image' => Yii::t('app', 'Og  Image'),
                    'original_id' => Yii::t('app', 'Original ID'),
        'language' => Yii::t('app', 'Language'),
        ];
    }
    }
