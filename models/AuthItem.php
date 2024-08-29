<?php

namespace app\models;

use app\components\MultilingualBehavior;
use app\components\MultilingualQuery;
use app\components\TimeZoneBehavior;
use app\components\UserBehavior;
use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveQuery;

/**
 * This is the model class for table "auth_item".
 *
 * @property string $name
 *
 * @property int $type
 * @property int $level
 * @property int $scope
 *
 * @property string $rule_name
 *
 * @property string $description
 * @property string $area
 * @property string $section
 *
 * @property int $created_at
 * @property int $updated_at
 * @property int $created_by
 * @property int $updated_by
 *
 * @property AuthAssignment[] $authAssignments
 * @property AuthItemChild[] $authItemChildren
 * @property AuthItemChild[] $authItemChildren0
 * @property AuthItem[] $children
 * @property AuthItem[] $parents
 *
 */
class AuthItem extends \yii\db\ActiveRecord
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'auth_item';
    }

    public function behaviors()
    {
        return [
            TimestampBehavior::class,
            [
                'class' => TimeZoneBehavior::class,
                'timezone' => ['created_at', 'updated_at'],
            ],
            UserBehavior::class,
            'ml' => [
                'class' => MultilingualBehavior::class,
                'languages' => Lang::getBehaviorsList(),
                //'languageField' => 'language',
                //'localizedPrefix' => '',
                //'requireTranslations' => false',
                //'dynamicLangClass' => true',
                'defaultLanguage' => Lang::getCurrent() ? Lang::getCurrent()->local : 'EN',
                'langForeignKey' => 'original_name',
                'tableName' => "{{%auth_item_lang}}",
                'attributes' => ['area', 'section', 'description'],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['type'], 'required'],
            [['type', 'created_at', 'updated_at', 'created_by', 'updated_by', 'level'], 'default', 'value' => 0],
            [['type', 'created_at', 'updated_at', 'created_by', 'updated_by', 'level'], 'integer'],
            [['description'], 'string'],
            [['name', 'area', 'section', 'rule_name'], 'string', 'max' => 64],
            [['name'], 'unique'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [

            'name' => Yii::t('app_model', 'Key'),
            'type' => Yii::t('app_model', 'Type'),
            'level' => Yii::t('app_model', 'Level'),
            'rule_name' => Yii::t('app_model', 'Rule'),
            'description' => Yii::t('app_model', 'Description'),
            'area' => Yii::t('app_model', 'Area (module)'),
            'section' => Yii::t('app_model', 'Section (controller)'),
            'created_at' => Yii::t('app_model', 'Created At'),
            'updated_at' => Yii::t('app_model', 'Updated At'),
            'created_by' => Yii::t('app_model', 'Created By'),
            'updated_by' => Yii::t('app_model', 'Updated By'),

        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAuthAssignments()
    {
        return $this->hasMany(AuthAssignment::class, ['item_name' => 'name']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAuthItemChildren()
    {
        return $this->hasMany(AuthItemChild::class, ['parent' => 'name']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAuthItemParent()
    {
        return $this->hasMany(AuthItemChild::class, ['child' => 'name']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getChildren()
    {
        return $this->hasMany(AuthItem::class, ['name' => 'child'])
            ->viaTable('auth_item_child', ['parent' => 'name']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getParents()
    {
        return $this->hasMany(AuthItem::class, ['name' => 'parent'])
            ->viaTable('auth_item_child', ['child' => 'name']);
    }

    /**
     * @inheritdoc
     * @return ActiveQuery|MultilingualQuery the active query used by this AR class.
     */
    public static function find()
    {
        $q = new MultilingualQuery(get_called_class());
        $q->localized();

        return $q;
    }

}
