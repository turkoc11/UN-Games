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
 * @property string $image
 */
class Benefits extends \yii\db\ActiveRecord
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
        return 'benefits';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['categories','hashtags'], 'safe'],
            [['title', 'position', 'link'], 'required'],
            [['expertise_title', 'expertise_description', 'text_block_description',
                'structuring_title', 'structuring_description', 'ongoing_title','preview_text', 'faq_title', 'ongoing_description',
                'strategic_title', 'strategic_description',
                'what_we_do_title', 'what_we_do_description', 'link'], 'string'],
            [['created_at', 'updated_at', 'status', 'expertise_status', 'ongoing_status', 'text_block_status'
                , 'structuring_status', 'what_we_do_status', 'strategic_status', 'faq_status', 'position'], 'integer'],
            [['image', 'image'], 'string', 'max' => 1000],
            [['ongoing_image', 'strategic_image', 'preview_image'], 'string', 'max' => 1000],
            [['link'], 'string', 'max' => 50, 'min' => 3],
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
            'status' => Yii::t('app', 'Status'),
            'image' => Yii::t('app', 'Image'),
            'ongoing_image' => Yii::t('app', 'Image'),
            'position'  => Yii::t('app', 'Position'),
            'description' => Yii::t('app', 'Description'),
            'expertise_description' => Yii::t('app', 'Description'),
            'expertise_title' => Yii::t('app', 'Title'),
            'faq_title' => Yii::t('app', 'Title'),
            'ongoing_description' => Yii::t('app', 'Description'),
            'ongoing_title' => Yii::t('app', 'Title'),
            'ongoing_status' => Yii::t('app', 'Status'),
            'strategic_description' => Yii::t('app', 'Description'),
            'strategic_title' => Yii::t('app', 'Title'),
            'strategic_status' => Yii::t('app', 'Status'),
            'text_block_status' => Yii::t('app', 'Status'),
            'what_we_do_description' => Yii::t('app', 'Description'),
            'what_we_do_title' => Yii::t('app', 'Title'),
            'what_we_do_status' => Yii::t('app', 'Status'),
            'structuring_description' => Yii::t('app', 'Description'),
            'structuring_title' => Yii::t('app', 'Title'),
            'expertise_status' => Yii::t('app', 'Status'),
            'faq_status' => Yii::t('app', 'Status'),
            'structuring_status' => Yii::t('app', 'Status'),
            'link' => Yii::t('app', 'link'),
            'strategic_image'=> Yii::t('app', 'Image'),
            'text_block_description' => Yii::t('app', 'Text Block'),
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
                'tableName' => "{{%benefits_lang}}",
                'attributes' => [
                    'title', 'description', 'expertise_description', 'expertise_title',
                    'structuring_description', 'structuring_title',
                    'ongoing_description', 'ongoing_title',
                    'what_we_do_description', 'what_we_do_title',
                    'strategic_description', 'strategic_title',
                    'text_block_description', 'faq_title',
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
