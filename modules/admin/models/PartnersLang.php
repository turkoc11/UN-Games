<?php

namespace app\modules\admin\models;

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
class PartnersLang extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'partners_lang';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'required'],
            [['id', 'original_id'], 'integer'],            
            [['title'], 'string', 'max' => 120],
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
            'language' => Yii::t('app', 'Language'),
            'original_id' => Yii::t('app', 'Original ID'),
        ];
    }
}
