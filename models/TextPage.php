<?php

namespace app\models;

use app\components\AliasBehavior;
use app\components\MetaBehavior;
use Yii;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use app\components\MultilingualBehavior;
use app\components\MultilingualQuery;

/**
 * This is the model class for table "News".
 *
 * @property integer $id
 * @property string $title 
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $status

 */
class TextPage extends \yii\db\ActiveRecord
{
    public $alias=[];

    public $categories;
    public $categories_all;
    public $hashtags;
    public $inMain;
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'text_page';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title', 'url'], 'required'],
            [[
                'introduction_title', 'introduction_description', 'crs_faq_title', 'crs_faq_description', 'crs_footer_title', 'crs_footer_description'], 'string'],
            [['created_at', 'updated_at', 'introduction_status', 'crs_faq_status', 'crs_footer_status'
               ], 'integer'],

            [['title'], 'string', 'max' => 120]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', '#'),
            'title' => Yii::t('app', 'Title'),
            'created_at' => Yii::t('app', 'Created Date'),
            'updated_at' => Yii::t('app', 'Updated Date'),
            'introduction_title' => Yii::t('app', 'Introduction Title'),
            'introduction_description' => Yii::t('app', 'Introduction Description'),
            'crs_faq_title' => Yii::t('app', 'CRS Faq Title'),
            'crs_faq_description' => Yii::t('app', 'CRS Faq Description'),
            'crs_footer_title' => Yii::t('app', 'CRS Footer title'),
            'crs_footer_description' => Yii::t('app', 'CRS Footer description'),
            'introduction_status' => Yii::t('app', 'Introduction status'),
            'crs_faq_status' => Yii::t('app', 'CRS Faq status'),
            'url' => Yii::t('app', 'Url'),
            'crs_footer_status' => Yii::t('app', 'CRS Footer status'),


            ];
    }
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
            'ml' => [
                'class' => MultilingualBehavior::className(),
                'languages' => Lang::getBehaviorsList(),
                //'languageField' => 'language',
                //'localizedPrefix' => '',
                //'requireTranslations' => false',
                //'dynamicLangClass' => true',
                'defaultLanguage' => Lang::getCurrent()->local,
                'langForeignKey' => 'original_id',
                'tableName' => "{{%text_page_lang}}",
                'attributes' => [
                    'title', 'introduction_title', 'introduction_description', 'crs_faq_title', 'crs_faq_description', 'crs_footer_title', 'crs_footer_description'
                ]
            ],
            // 'slug' => [
            //     'class' => 'Zelenin\yii\behaviors\Slug',
            //     'slugAttribute' => 'url',
            //     'attribute' => 'title',
            //     // optional params
            //     'ensureUnique' => true,
            //     'replacement' => '-',
            //     'lowercase' => true,
            //     'immutable' => false,
            //     // If intl extension is enabled, see http://userguide.icu-project.org/transforms/general.
            //     'transliterateOptions' => 'Russian-Latin/BGN; Any-Latin; Latin-ASCII; NFD; [:Nonspacing Mark:] Remove; NFC;'
            // ],
            'meta' => [
                'class' => MetaBehavior::className(),

            ],
        ];
    }

//    public function init(){
//        $module = Yii::$app->controller->module->id;
//        if($module=='admin' && isset($_GET['id'])){
//            $url = [];
//            $url[]= $this->behaviors()['alias']['module'];
//            $url[]= $this->behaviors()['alias']['controller'];
//            $url[]= $this->behaviors()['alias']['action'];
//            $url = implode('/', $url);
//            $furl = $url.'/'.$_GET['id'];
//            $this->alias['furl'] = $furl;
//            if(!$this->behaviors()['alias']['multilingual']){
//                $this->alias['alias'] = Alias::getAlias($furl, '*');
//                if($this->behaviors()['alias']['prefix']){
//                    $this->alias['alias'] = str_replace($this->behaviors()['alias']['prefix'] . '/','',$this->alias['alias']);
//                }
//            }else{
//                $langs = $this->behaviors()['alias']['languages'];
//                $langs[current(explode('-',$this->behaviors()['alias']['defaultLanguage']))] = '';
//                foreach($langs as $l=>$val){
//                    $this->alias['alias_'.$l] = Alias::getAlias($furl, $l);
//                    $this->alias['alias_'.$l] = str_replace($this->behaviors()['alias']['prefix'] . '/','',$this->alias['alias_'.$l]);
//                }
//            }
//        }
//    }

    public static function find()
    {
        $q = new MultilingualQuery(get_called_class());
        $q->localized();
        return $q;
    }

    public static function getStatuses(){

    }

}
