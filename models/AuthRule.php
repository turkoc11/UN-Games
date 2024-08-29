<?php

namespace app\models;

use Yii;
use yii\behaviors\TimestampBehavior;
use app\components\TimeZoneBehavior;

/**
 * This is the model class for table "auth_rule".
 *
 * @property string $name
 * @property resource $data
 * @property int $created_at
 * @property int $updated_at
 *
 * @property AuthItem[] $authItems
 */
class AuthRule extends \yii\db\ActiveRecord
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'auth_rule';
    }

    public function behaviors()
    {
        return [
            TimestampBehavior::class,
            [
                'class' => TimeZoneBehavior::class,
                'timezone' => ['created_at', 'updated_at']
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['data'], 'string'],
            [['created_at', 'updated_at'], 'default', 'value' => null],
            [['created_at', 'updated_at'], 'integer'],
            [['name'], 'string', 'max' => 64],
            [['name'], 'unique'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'name' => Yii::t('app_model', 'Name'),
            'data' => Yii::t('app_model', 'Data'),
            'created_at' => Yii::t('app_model', 'Created At'),
            'updated_at' => Yii::t('app_model', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAuthItems()
    {
        return $this->hasMany(AuthItem::class, ['rule_name' => 'name']);
    }

}
