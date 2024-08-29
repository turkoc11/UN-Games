<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * Class DynamicLang
 * @package app\models
 *
 * @property string $id [integer]
 * @property string $title [varchar(255)]  Page Title
 * @property string $sub_title [varchar(255)]  Page Sub Title
 * @property string $short_description Page Preview Description
 * @property string $description Page Description
 * @property string $meta_title [varchar(255)]  Meta Title
 * @property string $meta_description [varchar(1000)]  Meta Description
 * @property string $meta_keyword [varchar(255)]  Meta Keyword
 * @property string $language [varchar(512)]  Language
 * @property string $original_id [integer]  Original ID
 */
class DynamicLang extends \yii\db\ActiveRecord
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'dynamic_lang';
    }

    /**
     * @return array
     */
    public function behaviors()
    {
        return [
            FilterBehavior::class
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [

            [['short_description', 'description'], 'string'],
            [['title', 'sub_title', 'meta_title'], 'string', 'max' => 255],
            [['meta_description'], 'string', 'max' => 1000],
            [['meta_keyword'], 'string', 'max' => 512],
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
            'id'                => Yii::t('app_model', 'ID'),
            'title'             => Yii::t('app_model', 'Page Title'),
            'sub_title'         => Yii::t('app_model', 'Page Sub Title'),
            'short_description' => Yii::t('app_model', 'Page Preview Description'),
            'description'       => Yii::t('app_model', 'Page Description'),
            'meta_title'        => Yii::t('app_model', 'Meta Title'),
            'meta_description'  => Yii::t('app_model', 'Meta Description'),
            'meta_keyword'      => Yii::t('app_model', 'Meta Keyword'),
            'original_id'       => Yii::t('app', 'Original ID'),
            'language'          => Yii::t('app', 'Language'),
        ];
    }

}
