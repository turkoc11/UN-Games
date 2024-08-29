<?php

namespace app\modules\admin\models;

use Yii;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use app\components\MultilingualBehavior;
use app\components\MultilingualQuery;
use app\modules\admin\models\Lang;

/**
 * This is the model class for table "translations".
 *
 * @property integer $id
 * @property string $trans_key
 * @property string $val
 * @property string $descr
 * @property string $url
 */
class Translations extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'translations';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['trans_key', 'val', 'descr'], 'required'],
            [['val'], 'string'],
            [['trans_key', 'descr', 'url'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'trans_key' => Yii::t('app', 'Trans Key'),
            'val' => Yii::t('app', 'Текст'),
            'descr' => Yii::t('app', 'Descr'),
            'url' => Yii::t('app', 'Url'),
        ];
    }
    public function behaviors()
    {
        return [
           // TimestampBehavior::className(),
            'ml' => [
                'class' => MultilingualBehavior::className(),
                'languages' => Lang::getBehaviorsList(),
                //'languageField' => 'language',
                //'localizedPrefix' => '',
                //'requireTranslations' => false',
                //'dynamicLangClass' => true',
                'defaultLanguage' => Lang::getCurrent()->local,
                'langForeignKey' => 'translations_id',
                'tableName' => "{{%translations_lang}}",
                'attributes' => [
                    'val'
                ]
            ],
        ];
    }

    public static function find()
    {
        $q = new MultilingualQuery(get_called_class());
        $q->localized();
        return $q;
    }
	
	public function afterSave($insert, $changedAttributes){
		parent::afterSave($insert, $changedAttributes);
		$langs = Lang::find()->all();
		foreach($langs as $l){
			Yii::$app->cache->set('gt_'.$l->local, false);
		}
	}
}
