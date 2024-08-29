<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * Class SettingsLang
 * @package app\models
 *
 * @property string $id [integer]  ID
 * @property string $title [varchar(255)]  Title
 * @property string $copy [varchar(255)]
 * @property string $description [varchar(2000)]
 * @property string $keywords [varchar(2000)]
 * @property string $language [varchar(255)]  Language
 * @property string $original_id [integer]  Original ID
 */
class SettingsLang extends \yii\db\ActiveRecord
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'settings_lang';
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

            [['title', 'copy','slogan','logo_txt'], 'string', 'max' => 255],
            [['description', 'keywords'], 'string', 'max' => 2000],
            [['original_id'], 'integer'],
            [['underpage_txt','address','working_hours'], 'string'],
            [['language'], 'string', 'max' => 12],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app_model', 'ID'),
            'title' => Yii::t('app_model', 'Title'),
            'copy' => Yii::t('app_model', 'Copy'),
            'description' => Yii::t('app_model', 'Description'),
            'keywords' => Yii::t('app_model', 'Keywords'),
            'original_id' => Yii::t('app', 'Original ID'),
            'language' => Yii::t('app', 'Language'),
            'slogan' => Yii::t('app', 'Slogan'),
            'logo_txt' => Yii::t('app', 'Logo text'),
            'underpage_txt' => Yii::t('app', 'Bottom line text'),
            'working_hours' => Yii::t('app_model', "Working hours"),
            'address' => Yii::t('app_model', "Address"),
        ];
    }

}
