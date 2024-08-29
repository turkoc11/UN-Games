<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "auth_item_lang".
 *
 * @property integer $id
 * @property string $language
 * @property string $original_name
 * @property string $area
 * @property string $section
 * @property string $description
 *
 */
class AuthItemLang extends \yii\db\ActiveRecord
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'auth_item_lang';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['description'], 'string'],
            [['original_name', 'area', 'section'], 'string', 'max' => 64],
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
            'description' => Yii::t('app_model', 'Description'),
            'area' => Yii::t('app_model', 'Area (module)'),
            'section' => Yii::t('app_model', 'Section (controller)'),
            'original_name' => Yii::t('app', 'Original NAME'),
            'language' => Yii::t('app', 'Language'),
        ];
    }

}
