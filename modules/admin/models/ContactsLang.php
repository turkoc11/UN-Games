<?php

namespace app\modules\admin\models;

use Yii;

/**
 * This is the model class for table "News_lang".
 *
 * @property integer $id
 * @property string $title
 * @property string $description
 * @property string $address
 * @property string $language
 * @property integer $original_id
 */
class ContactsLang extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'contacts_lang';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'required'],
            [['id', 'original_id'], 'integer'],
            [['description', 'address', 'moving_to'], 'string'],
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
            'address' => Yii::t('app', 'Address'),
            'language' => Yii::t('app', 'Language'),
            'original_id' => Yii::t('app', 'Original ID'),
            'moving_to' => Yii::t('app', 'Moving To'),
        ];
    }
}
