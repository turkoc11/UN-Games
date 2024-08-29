<?php
/**
 * Created by PhpStorm.
 * User: Misha
 * Date: 16.02.2016
 * Time: 17:36
 */

namespace app\components;
use app\modules\admin\models\Block;
use app\modules\admin\models\Message;
use app\modules\admin\models\MetaTags;
use app\modules\admin\models\SourceMessage;
use app\modules\admin\models\Translations;
use app\modules\admin\models\TranslationsLang;
use Yii;
use yii\base\Component;
use yii\base\InvalidConfigException;
use \yii\base\View;
use yii\helpers\Html;
use yii\helpers\Url;
use app\models\Mailtpl;
use yii\validators\EmailValidator;

/**
 * Class Mv
 * @package app\components
 */
class Mv extends Component {


	public $gts = [];
	
	public function ic($preset, $path, $class = ''){
		return Yii::$app->imageCache->imgSrc($_SERVER['DOCUMENT_ROOT'].'/web'.$path, $preset, ['class'=>$class]);
	}
	
	public function ae($model, $id){
		if(Yii::$app->user->can('admin')){
			return '<a class="editbutton" href="/admin/' . $model . '/update/' . $id . '" target="_blank"><i class="fa fa-pencil"></i></a>';
		}
	}
    /**
     * @param $key
     * @param array $ph
     * @param int $is_edit
     * @return string
     */
    public function curPageGt(){
        if(Yii::$app->user->can('admin') || isset($_GET['gt'])){
            $out = '';
            foreach($this->gts as $gt){
                $out.='<div><a href="/admin/translations/update/'.$gt['link'].'">'.$gt['title'].'</a></div>';
            }

            //return '<div class="curPageGt deftrans">'.$out.'</div>';

            $ret =<<<FRE
            <button id="page-gt" type="button" class="btn btn-default btn-lg trans_gt" data-toggle="modal" data-target="#gtmod"><i class="fa fa-file-text"></i></button>
              <div class="modal fade" id="gtmod" role="dialog">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Translation phrases</h4>
                    </div>
                    <div class="modal-body">
                      $out
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
FRE;
            return $ret;
        }
    }

    /**
     * @param $key
     * @param array $ph
     * @param int $is_edit
     * @return string
     */
    public function gt($key, $ph = array(), $is_edit = 1) {

        $model = array();

        $trace = debug_backtrace();
        $file = current($trace);
        $file = $file['file'];
        if(strpos($file, 'views')===false){
            $nkey = Yii::$app->controller->id . '_' . Yii::$app->controller->action->id . '_' . strtolower(basename(__FILE__)) . '_' . $key;
        }else{
            if(strpos($file, '\\views\\')){
                $uurl = explode('\\views\\', $file);
            }else{
                $uurl = explode('/views/', $file);
            }
            $nkey =  $uurl[1] . '_' . $key;
        }

        if (!isset(Yii::$app->controller->gt[$nkey])) {
            $orlang = Yii::$app->language;
            Yii::$app->language = Yii::$app->params['sourceLanguage'];
            $ortrans = Yii::t('app', $key);
            $basetranse = Yii::t('app', $key);
            $trans = Translations::find()->where('trans_key=:tk AND val=:val', array(':tk'=>$nkey, ':val'=>$ortrans))->one();

            if(!$trans){
                $trans = new Translations;
				$trans->trans_key = $nkey;
				$trans->val = $ortrans;
            }

            $trans->descr = Yii::$app->controller->id . '_' . Yii::$app->controller->action->id . '_' . strtolower(basename(__FILE__));
            $link_dirty = explode('?', $_SERVER['REQUEST_URI']);
            $link = preg_replace('/[0-9]+/', '', $link_dirty[0]);
            $trans->url = $link;
            if ($trans->save()) {
                $model[] = $trans;
                $tid = $trans->id;

                foreach(Yii::$app->controller->coreSettings->languages as $k=>$v){

                    $xtrans = TranslationsLang::find()->where('translations_id=:tid AND language=:lid', array(':tid'=>$tid, ':lid'=>$v))->one();
                    if(!$xtrans){
                        $xtrans = new TranslationsLang();
						
						Yii::$app->language = self::getOldLangAssoc($v);
						$ortrans = Yii::t('app', $key);
						$xtrans->val = $ortrans;
                    }
                    $xtrans->translations_id = $tid;
                    $xtrans->language = $v;
                    
                    $xtrans->save(false);
                }
            }

            Yii::$app->language = $orlang;
        } else {
            $model[0] = Yii::$app->controller->gt[$nkey];
        }

        if (count($ph)) {
            $model[0]['val'] = Yii::t('app', $model[0]['val'], $ph);
        }

        if ($is_edit && (Yii::$app->user->can('admin') || isset($_GET['gt']))) {
            if(!isset($model[0])){
                var_dump($model,$key);die();
            }

            $edit = '<a class="context-edit" href="/admin/translations/update/' . $model[0]['id'] . '"><i class="fa fa-pencil"></i></a>';
        } else {
            $edit = '';
        }
		
		if((Yii::$app->user->can('admin') || isset($_GET['gt'])) && count($model)){
			if(!isset($this->gts[$model[0]['id']])){
				$this->gts[$model[0]['id']] = ['link' => $model[0]['id'], 'title' => $model[0]['val']];			
			}
		}

        return (!count($model)) ? $key : nl2br($model[0]['val']) . $edit;
    }

    /**
     * @param $lang
     * @return string
     */
    public static function getOldLangAssoc($lang)
    {
        $languages = ['en-US' => 'en', 'ru-RU' => 'ru', 'uk-UA' => 'uk'];
        return isset($languages[$lang]) ? $languages[$lang] : 'en';
    }

    /**
     * @param $lang
     * @return string
     */
    public static function getNewLangAssoc($lang)
    {
        $languages = ['en' => 'en-US', 'ru' => 'ru-RU',  'uk' =>'uk-UA'];
        return isset($languages[$lang]) ? $languages[$lang] : 'en';
    }

    /**
     * @param $st
     * @return mixed
     */
    public static function transliterate($st) {
        $rus = array('А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я', 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я');
        $lat = array('A', 'B', 'V', 'G', 'D', 'E', 'E', 'Gh', 'Z', 'I', 'Y', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'C', 'Ch', 'Sh', 'Sch', 'Y', 'Y', 'Y', 'E', 'Yu', 'Ya', 'a', 'b', 'v', 'g', 'd', 'e', 'e', 'gh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', 'y', 'y', 'y', 'e', 'yu', 'ya');
        $st =  str_replace($rus, $lat, $st);
        return $st;
    }

    public static function transliterateUrl($st) {
        $st = Yii::$app->mv->transliterate($st);
        $st = mb_strtolower($st);
        $st = str_replace(['\'','"','!','@','#','$','%','^','&','*','(',')', '.',','], '', $st);
        $st = str_replace([' '], '-', $st);
        return $st;
    }

    /**
     * set meta tags
     */
    public function metaSetter($title = null,$description = null)
    {
        $currentUrl=Url::current();
        foreach(Yii::$app->controller->coreSettings->languages as $k=>$v){
            $currentUrl = str_replace('/'.$v.'/','',$currentUrl);
        }
        $currentUrl = ($currentUrl=='/')?$currentUrl:ltrim($currentUrl, '/');
        $meta = MetaTags::find()->where(['url'=>$currentUrl])->one();
        if(!empty($meta)){
            Yii::$app->params['defTitle']=$meta->title;
            Yii::$app->params['defDescription']=$meta->description;
        }
        if(!empty($title)){
            Yii::$app->params['defTitle']=$title;
        }
        if(!empty($description)){
            Yii::$app->params['defDescription']=$description;
        }
        Yii::$app->view->registerMetaTag([
            'name' => 'title',
            'content' => Yii::$app->params['defTitle'] ,
        ],"main_title");
        Yii::$app->view->registerMetaTag([
            'name' => 'description',
            'content' =>  Yii::$app->params['defDescription'],
        ],'main_description');



    }

    /**
     * @param $id
     * @return array|null|\yii\db\ActiveRecord
     */
    public function getBlock($id)
    {
        $block = Block::find()->where('id = '.$id)->multilingual()->one();
        if($block){
            if(Yii::$app->user->can('admin')){
                $block->editLink=Html::a('','/admin/block/update/'.$block->id,['class'=>'context-edit']);
            }
            return $block;
        }
    }
	
	public function mailTo($email, $params, $lang = ''){
	
		if(!$lang && Yii::$app->params['sourceLanguage']!=Yii::$app->language){
			$lang = self::getOldLangAssoc(Yii::$app->language);
		}
		if($lang==self::getOldLangAssoc(Yii::$app->language)){
			$lang = '';
		}
		
		$data = Yii::$app->mv->buildMail($params, $lang);
		
		if($data['title'] && $data['descr']){		
			
			$uip = $_SERVER['DOCUMENT_ROOT'];
			$subject = $data['title'];			
			
			$message = $data['descr'];
			
			Yii::$app->mv->sendMail($email, $subject, $message);
			
		}
	}
	
	public function sendMail($email, $subject, $message){
		$message = Yii::$app->controller->renderPartial('//layouts/_mailtpl', ['subject' => $subject,'message' => $message]);
		
		$subject = '=?utf-8?B?'.base64_encode($subject).'?=';
		$headers  = 'MIME-Version: 1.0'."\r\n";
		$headers .= 'Content-type: text/html; charset=utf-8'."\r\n";
		$headers .= 'To: '.$email.'<'.$email.'>'."\r\n";
		$headers .= 'From: Wex<info@wex.is>'."\r\n";
		#echo $message;die();
		mail($email, $subject, $message, $headers);
	}
	
	public function buildMail($params, $lang=''){
		$data = ['title' => '', 'descr' => ''];

		$rep = [];
		
		if(isset($params['rep'])){
			$rep = $params['rep'];
		}
		
		/*switch($params['type']){
			case 'type':
			break;
		}*/

		foreach($rep as $k=>$r){
			$rep['{'.$k.'}'] = $r;
			unset($rep[$k]);
		}

		if(isset($params['type'])){
			$mailtpl = Mailtpl::find()->where(['type' => $params['type']])->multilingual()->one();
			if($mailtpl){
			
				$title = 'title';
				$descr = 'descr';
				
				if($lang){
					$title = 'title_'.$lang;
					$descr = 'descr_'.$lang;
				}
				
				$data['title'] = $mailtpl->$title;
				$data['descr'] = str_replace(array_keys($rep), array_values($rep), $mailtpl->$descr);
				
			}
		}
		
		$data['descr'] = str_replace('/admin/mailtpl/update/', '', $data['descr']);
		
		return $data;
	}

}