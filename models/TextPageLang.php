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
class TextPageLang extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'text_page_lang';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'required'],
            [['id', 'original_id'], 'integer'],
            [['title'], 'string'],
            [[
                'introduction_title', 'introduction_description', 'crs_faq_title', 'crs_faq_description', 'crs_footer_title', 'crs_footer_description'], 'string'],
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
            'introduction_title' => Yii::t('app', 'Introduction Title'),
            'introduction_description' => Yii::t('app', 'Introduction Description'),
            'crs_faq_title' => Yii::t('app', 'CRS Faq Title'),
            'crs_faq_description' => Yii::t('app', 'CRS Faq Description'),
            'crs_footer_title' => Yii::t('app', 'CRS Footer title'),
            'crs_footer_description' => Yii::t('app', 'CRS Footer description'),
            'introduction_status' => Yii::t('app', 'Introduction status'),
            'crs_faq_status' => Yii::t('app', 'CRS Faq status'),
            'crs_footer_status' => Yii::t('app', 'CRS Footer status'),
            'language' => Yii::t('app', 'Language'),
            'original_id' => Yii::t('app', 'Original ID'),
        ];
    }
}
