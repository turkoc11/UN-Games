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
class BenefitsLang extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'benefits_lang';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'required'],
            [['id', 'original_id'], 'integer'],            
            [['title', 'expertise_title', 'structuring_title', 'ongoing_title',
                'what_we_do_title', 'strategic_title', 'faq_title'], 'string', 'max' => 120],
            [['description', 'expertise_description', 'strategic_description', 'text_block_description',
                'structuring_description', 'ongoing_description', 'what_we_do_description'], 'string', 'max' => 2000],
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
            'expertise_description' => Yii::t('app', 'Expertise Description'),
            'expertise_title' => Yii::t('app', 'Expertise Title'),
            'ongoing_description' => Yii::t('app', 'Ongoing Description'),
            'ongoing_title' => Yii::t('app', 'Ongoing Title'),
            'what_we_do_description' => Yii::t('app', 'What we do Description'),
            'what_we_do_title' => Yii::t('app', 'What we do Title'),
            'structuring_description' => Yii::t('app', 'Structuring Description'),
            'structuring_title' => Yii::t('app', 'Structuring Title'),
            'strategic_description' => Yii::t('app', 'Structuring Description'),
            'text_block_description' => Yii::t('app', 'Text Block Description'),
            'strategic_title' => Yii::t('app', 'Structuring Title'),
            'faq_title' => Yii::t('app', 'FAQs Title'),
            'language' => Yii::t('app', 'Language'),
            'original_id' => Yii::t('app', 'Original ID'),
        ];
    }
}
