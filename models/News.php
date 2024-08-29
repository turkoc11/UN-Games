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
 * @property string $description
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $status
 * @property string $image
 */
class News extends \yii\db\ActiveRecord
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
        return 'news';
    }    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['categories','hashtags'], 'safe'],
            [['description', 'title', 'image', 'image2', 'description2'], 'required'],
            [['description', 'description2'], 'string','max' => 1600],
            [['created_at', 'updated_at', 'status', 'type', 'in_main'], 'integer'],
            [['image','url', 'image2'], 'string', 'max' => 255],
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
            'type' => Yii::t('app', 'News Type'),
            'in_main' => Yii::t('app', 'Show in main'),
            'description' => Yii::t('app', 'Description'),
            'description2' => Yii::t('app', 'Short Description'),
            'created_at' => Yii::t('app', 'Created At'),
            'date' => Yii::t('app', 'Date'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'created_by' => Yii::t('app', 'Created By'),
            'status' => Yii::t('app', 'Status'),
            'image' => Yii::t('app', 'Image'),
            'image2' => Yii::t('app', 'Small Image'),
            'url' => Yii::t('app', 'News Link'),
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
                'tableName' => "{{%news_lang}}",
                'attributes' => [
                    'title', 'description', 'description2'
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

    public function getUser()
    {
        return $this->hasOne(Users::className(), ['id' => 'created_by']);
    }

}
