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
 * This is the model class for table "UserPrize".
 *
 * @property integer $id
 * @property string $prize_name
 * @property string $email
 * @property integer $user_id
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $prize_id

 */
class UserPrize extends \yii\db\ActiveRecord
{
//    public $alias=[];
//
//    public $categories;
//    public $categories_all;
//    public $hashtags;
//    public $inMain;
    public $_users;
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user_prize';
    }    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'prize_id'], 'required'],
            [['prize_name'], 'string','max' => 255],
            [['created_at', 'updated_at'], 'integer'],
            [['email'], 'email']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', '#'),
            'email' => Yii::t('app', 'Email'),
            'user_id' => Yii::t('app', 'User ID'),
            'prize_id' => Yii::t('app', 'Prize ID'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'prize_name' => Yii::t('app', 'Prize Name'),

        ];
    }
    public function behaviors()
    {
        return [
//            TimestampBehavior::className(),
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

    public function getUser()
    {
        return $this->hasOne(Users::className(), ['id' => 'user_id']);
    }

    public function getPrize()
    {
        return $this->hasOne(Prize::className(), ['id' => 'prize_id']);
    }

    public function beforeSave($insert){
        $user = $this->getUser()->one();
        $prize = $this->getPrize()->one();
        $this->email = $user->email;
        $this->prize_name = $prize->name;
        return parent::beforeSave($insert);
    }

}
