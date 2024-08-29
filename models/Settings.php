<?php

namespace app\models;

use app\components\FilterBehavior;
use app\components\MultilingualBehavior;
use app\components\MultilingualQuery;
use app\components\TimeZoneBehavior;
use app\components\UserBehavior;
use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveQuery;

/**
 * This is the model class for table "settings".
 *
 * @property int $id
 * @property string $title
 * @property string $logo
 * @property string $copy
 * @property string $description
 * @property string $keywords
 * @property int $maintenance
 * @property int $cache
 * @property string $head_scripts
 * @property string $body_scripts
 * @property string $end_scripts
 * @property string $ips
 * @property integer $updated_at
 * @property int $updated_by
 *
 */
class Settings extends \yii\db\ActiveRecord
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'settings';
    }

    public function behaviors()
    {
        return [
            [
                'class' => FilterBehavior::class,
                'notFilterAttributes' => [
                    'head_scripts', 'body_scripts', 'end_scripts','social','underpage_txt'
                ]
            ],

            TimestampBehavior::class,
//            [
//                'class' => TimeZoneBehavior::class,
//                'timezone' => ['updated_at'],
//            ],
            UserBehavior::class,
            'ml' => [
                'class' => MultilingualBehavior::class,
                'languages' => Lang::getBehaviorsList(),
                //'languageField' => 'language',
                //'localizedPrefix' => '',
                //'requireTranslations' => false',
                //'dynamicLangClass' => true',
                'defaultLanguage' => Lang::getCurrent() ? Lang::getCurrent()->local : 'EN',
                'langForeignKey' => 'original_id',
                'tableName' => "{{%settings_lang}}",
                'attributes' => ['title', 'copy', 'description', 'keywords','logo_txt','slogan','underpage_txt','address'],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['cache', 'updated_at', 'updated_by'], 'default', 'value' => 0],
            [['maintenance'], 'default', 'value' => 1],
            [['maintenance', 'cache', 'updated_at', 'updated_by'], 'integer'],
            [['head_scripts', 'body_scripts', 'end_scripts', 'ips'], 'safe'],
            [['title', 'logo', 'copy','slogan','logo_txt','email','phones', 'address'], 'string', 'max' => 255],
            [['description', 'keywords'], 'string', 'max' => 2000],
            [['social','underpage_txt'], 'string'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app_model', 'ID'),
            'title' => Yii::t('app_model', 'Title'),
            'logo' => Yii::t('app_model', 'Logo'),
            'copy' => Yii::t('app_model', 'Copy'),
            'description' => Yii::t('app_model', 'Description'),
            'address' => Yii::t('app_model', 'Address'),
//            'map_lat' => Yii::t('app_model', 'Map latitude'),
//            'map_lng' => Yii::t('app_model', 'Map longitude'),
            'keywords' => Yii::t('app_model', 'Keywords'),
            'maintenance' => Yii::t('app_model', 'Maintenance'),
            'cache' => Yii::t('app_model', 'Cache'),
            'head_scripts' => Yii::t('app_model', 'Head Scripts'),
            'body_scripts' => Yii::t('app_model', 'Body Scripts'),
            'end_scripts' => Yii::t('app_model', 'End Scripts'),
            'ips' => Yii::t('app_model', 'Allowed Ips'),
            'updated_at' => Yii::t('app_model', "Updated"),
            'updated_by' => Yii::t('app_model', "Updated By"),
            'social' => Yii::t('app_model', "Social"),
            'slogan' => Yii::t('app_model', "Slogan"),
            'logo_txt' => Yii::t('app_model', "Logo text"),
            'underpage_txt' => Yii::t('app_model', "Bottom line text"),
            'email' => Yii::t('app_model', "Email"),
            'phones' => Yii::t('app_model', "Phones, comma separated")
        ];
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
