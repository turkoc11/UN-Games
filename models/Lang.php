<?php

namespace app\models;

use app\components\TimeZoneBehavior;
use app\components\UserBehavior;
use Yii;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Url;

/**
 * This is the model class for table "lang".
 *
 * @property integer $id
 * @property string $flag
 * @property string $url
 * @property string $local
 * @property string $name
 * @property integer $default
 * @property integer $created_at
 * @property integer $updated_at
 * @property int $created_by
 * @property int $updated_by
 * @property string $code
 * @property string $full_name
 */
class Lang extends \yii\db\ActiveRecord
{

    static $current = null;
    static $_default = null;
    static $behaviors_list = null;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lang';
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
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'url', 'local', 'code'], 'required'],
            [['default', 'created_at', 'updated_at', 'created_by', 'updated_by'], 'integer'],
            [['default', 'created_at', 'updated_at', 'created_by', 'updated_by'], 'default', 'value' => 0],
            [['flag', 'name'], 'string', 'max' => 255],
            [['url'], 'string', 'max' => 6],
            [['local'], 'string', 'max' => 12],
            [['code'], 'string', 'max' => 32],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app_model', "ID"),
            'flag' => Yii::t('app_model', "Icon"),
            'url' => Yii::t('app_model', "URL"),
            'local' => Yii::t('app_model', "Locale"),
            'name' => Yii::t('app_model', "Name"),
            'default' => Yii::t('app_model', "Default"),
            'code' => Yii::t('app_model', "ISO 639-1"),
            'created_at' => Yii::t('app_model', "Created"),
            'updated_at' => Yii::t('app_model', "Updated"),
            'created_by' => Yii::t('app_model', "Created By"),
            'updated_by' => Yii::t('app_model', "Updated By"),
        ];
    }

    static function getCurrent()
    {
        if (self::$current === null) {
            self::$current = self::getDefaultLang();
        }

        return self::$current;
    }

    static function setCurrent($url = null)
    {

        $language = self::getLangByUrl($url);
        self::$current = ($language === null) ? self::getDefaultLang() : $language;
        Yii::$app->language = !empty(self::$current) ? self::$current->local : 'EN';
        
    }

    static function getLangs()
    {
        if (Yii::$app->cache->exists('langs-array')){
            $list = ArrayHelper::map(Yii::$app->cache->get('langs'), 'local', 'flag');
        } else {
            $list = self::find()->all();
        }
        return $list;
    }

    /**
     * @return array|null|\yii\db\ActiveRecord|Lang
     */
    static function getDefaultLang()
    {
        if (self::$_default === null) {
            self::$_default = Lang::find()->where(['default' => 1])->one();
        }

        return self::$_default;
    }

    static function getLangByUrl($url = null)
    {
        if ($url === null) {
            return null;
        } else {
            if(Yii::$app->cache->exists('lang-'.$url)){
                $language = Yii::$app->cache->get('lang-'.$url);
            } else {
                $language = Lang::find()->where('url = :url', [':url' => $url])->one();
            }
            if ($language === null) {
                return null;
            } else {
                return $language;
            }
        }
    }

    static function getBehaviorsList($where = '')
    {
        if (Yii::$app->cache->exists('langs-where'.$where) && 0){
            $list = ArrayHelper::map(Yii::$app->cache->get('langs-where'.$where), 'local', 'flag');
        } else {
            $l = self::find()->where($where)->all();
            Yii::$app->cache->set('langs-where'.$where, $l);
            $list = ArrayHelper::map($l, 'local', 'flag');
        }
        $result = [];
        foreach ($list as $k => $v) {
            $parts = explode('-', $k);
            $result[$parts[0]] = Html::img(Url::to($v), ['class' => 'img-square', 'style' => 'width:30px;']);
        }
        self::$behaviors_list = (count($result)) ? $result : $list;

        return self::$behaviors_list;
    }

}
