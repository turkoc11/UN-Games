<?php

namespace app\models;

//use app\components\AliasBehavior;
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
 * @property string $name
 * @property string $description
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $status
 * @property string $amount
 */
class Prize extends \yii\db\ActiveRecord
{
//    public $alias=[];
//
//    public $categories;
//    public $categories_all;
//    public $hashtags;
//    public $inMain;
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'prize';
    }    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['description', 'name', 'amount'], 'required'],
            [['description'], 'string','max' => 1600],
            [['created_at', 'updated_at', 'status'], 'integer'],
            [['name'], 'string', 'max' => 120]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', '#'),
            'name' => Yii::t('app', 'Name'),
            'description' => Yii::t('app', 'Description'),
            'amount' => Yii::t('app', 'Amount'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'status' => Yii::t('app', 'Status'),

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
                'tableName' => "{{%prize_lang}}",
                'attributes' => [
                    'name', 'description'
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

//    public function getUser()
//    {
//        return $this->hasOne(Users::className(), ['id' => 'created_by']);
//    }

}
