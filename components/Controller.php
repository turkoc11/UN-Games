<?php

namespace app\components;

use app\models\Advertising;
use app\models\Lang;
use app\models\Mailtpl;
use app\models\Menu;
use app\models\Sections;
use app\models\Settings;
use app\models\Tune;
use app\models\Users;
use Yii;
use yii\helpers\BaseInflector;
use yii\helpers\Inflector;
use yii\web\NotFoundHttpException;
use LireinCore\Yii2ImgCache\ImgCache;

/**
 * Class Controller
 * @package app\components
 */
class Controller extends \yii\web\Controller
{

    /** @var Settings $coreSettings */
    public $coreSettings;

    /** @var $langs array|Lang[] */
    public $langs = [];

    /** @var null|Lang */
    public $defaultLang = null;

    /** @var null|Lang */
    public $currentLang = null;

    /** @var null|Users */
    public $user = null;

    /** @var string */
    public $uip = '';

    /** @var array|Tune[] */
    public $tunes = [];
    public $menu = [];
    public $uroles = [];

    public $imgcache = [];
    public $currentdate = '';

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();

        $this->coreSettings = self::getCoreSettings();
        $this->user = Yii::$app->user->identity;
        $this->uip = Yii::$app->request->userIP;

        $this->currentLang = Lang::getCurrent();

        $this->getCurrentdate();
        $this->getDefaultLang();
        $this->getLangs();

        $this->imgcache = Yii::$container->get(ImgCache::class);

        //if(!Yii::$app->user->isGuest) Yii::$app->language = $this->user->locale;

        if ((!$this->coreSettings || $this->coreSettings->maintenance)) {
            if ($this->coreSettings && !empty($this->coreSettings->ips)) {
                $ips = explode(' ', $this->coreSettings->ips);
                if (!in_array($this->uip, $ips)) {
                    $this->layout = '/maintenance';
                }
            } else {
                if (!in_array($this->uip, Yii::$app->params['allowedIps'])) {
                    $this->layout = '/maintenance';
                }
            }
        }
    }




    /**
     * @return Settings|bool|mixed|null
     */
    public static function getCoreSettings()
    {

        $cache = Yii::$app->cache;
        $global_cache = Yii::$app->params['cache'];

        if (!$global_cache) {
            $data = false;
        } else {
            $data = $cache->get('settings_' . Yii::$app->language);
        }

        if ($data === false) {
            $data = Settings::findOne(1);
            if ($global_cache) {
                $cache->set('settings_' . Yii::$app->language, $data);
            }
        }

        return $data;
    }
    
    public function getTunes()
    {
        $cache = Yii::$app->cache;
        $sys_cache = $this->coreSettings->cache;

        if (!$sys_cache) {
            $this->tunes = false;
        } else {
            $this->tunes = $cache->get('tunes_' . Yii::$app->language);
        }

        if (($this->tunes === false) || !is_array($this->tunes) || (is_array($this->tunes) && !count($this->tunes))) {
            $this->tunes = Tune::find()->indexBy('id')->all();
            $cache->set('tunes_' . Yii::$app->language, $this->tunes);
        }
    }
    public function getTune($type)
    {
        foreach ($this->tunes as $tune){
            if(isset($tune->type) && ($tune->type==$type)){ return $tune->val;}
        }
    }

    public function fillMenu()
    {
        $cache = Yii::$app->cache;
        $sys_cache = $this->coreSettings->cache;

        if (!$sys_cache) {
            $this->menu = false;
        } else {
            $this->menu = $cache->get('menu_' . Yii::$app->language);
        }

        if (($this->menu === false) || !is_array($this->menu) || (is_array($this->menu) && !count($this->menu))) {
            //$m = Menu::find()->where(['visible_type'=>1])->orderBy(['sort_order'=>'ASC'])->asArray()->all();
            $m = Menu::find()->where(['visible_type'=>1])->orderBy(['sort_order'=>'ASC'])->all();
            
            //$groups = array_keys(Yii::$app->params['menugroups']);
            $ind = 0;
            foreach ($m as $items){
                $item = [];
                $item['id'] = $items->id;
                $item['parent_id'] = $items->parent_id;
                $item['group'] = $items->group;
                $item['title'] = $items->title;
                $item['url'] = $items->url;
                if($item['parent_id']==0){
                    $this->menu[$item['group']][$ind] = $item;
                    foreach ($m as $items_sub){
                        $item_sub = [];
                        $item_sub['id'] = $items_sub->id;
                        $item_sub['parent_id'] = $items_sub->parent_id;
                        $item_sub['group'] = $items_sub->group;
                        $item_sub['title'] = $items_sub->title;
                        $item_sub['url'] = $items_sub->url;
                        if($items_sub->parent_id == $items->id){
                            $this->menu[$item['group']][$ind]['submenu'][] = $item_sub;
                        }
                    }
                }
                $ind++;
            }
            $cache->set('menu_' . Yii::$app->language, $this->menu);
        }
    }

    public function fillSections()
    {
        $cache = Yii::$app->cache;
        $sys_cache = $this->coreSettings->cache;

        if (!$sys_cache) {
            $this->sections = false;
        } else {
            $this->sections = $cache->get('sections_' . Yii::$app->language);
        }

        if (($this->sections === false) || !is_array($this->sections) || (is_array($this->sections) && !count($this->sections))) {
            $m = Sections::find()->where(['status'=>1])->orderBy(['sort_order'=>'ASC'])->all();
            $view_subcategories = [];
            $has_subsections = [];
            $sect_select = [];
            $sect_titles = [];
            $sections = [];
            $urls = [];
            foreach ($m as $item){$urls[$item->id] = $item->url; $sections[$item->id] = $item; $sect_titles[$item->id] = $item->title;}
            foreach ($m as $item){
                if($item->parent_id==0){
                    if($item->view_categories==1){
                        $view_subcategories[] = $item->id;
                    }
                    foreach ($m as $item_sub){
                        if($item_sub->parent_id == $item->id){
                            $has_subsections[] = $item->id;
                            break;
                        }
                    }
                }
            }
            foreach ($m as $item){
                if($item->parent_id==0){
                    if(!in_array($item->id,$has_subsections)){
                        $sect_select[$item->id] = $item->title;
                    }
                    foreach ($m as $item_sub){
                        if($item_sub->parent_id == $item->id){
                            $sect_select[$item->title][$item_sub->id] = $item_sub->title;
                        }
                    }
                }
            }

            $this->sections['view_subcategories'] = $view_subcategories;
            $this->sections['has_subsections'] = $has_subsections;
            $this->sections['sect_select'] = $sect_select;
            $this->sections['sect_titles'] = $sect_titles;
            $this->sections['sections'] = $sections;
            $this->sections['urls'] = $urls;

            $cache->set('sections_' . Yii::$app->language, $this->sections);
        }
    }

    public function getLangs()
    {

        $cache = Yii::$app->cache;
        $sys_cache = $this->coreSettings->cache;

        if (!$sys_cache) {
            $this->langs = false;
        } else {
            $this->langs = $cache->get('langs' . Yii::$app->language);
        }

        if ($this->langs === false) {
            $this->langs = Lang::find()->indexBy('url')->all();
            $cache->set('langs' . Yii::$app->language, $this->langs);
        }
    }

    public function getDefaultLang()
    {

        $cache = Yii::$app->cache;
        $sys_cache = $this->coreSettings->cache;
        
        if (!$sys_cache) {
            $this->defaultLang = false;
        } else {
            $this->defaultLang = $cache->get('defaultLang');
        }

        if ($this->defaultLang === false) {
            $this->defaultLang = Lang::getDefaultLang();
            $cache->set('defaultLang', $this->defaultLang);
        }
    }

    /**
     * @throws NotFoundHttpException
     */
    public function throw404()
    {
        throw new NotFoundHttpException(Yii::t('app', 'Page not found.'));
    }

    /**
     * @param $module
     * @param $controller
     *
     * @return array
     */
    public static function getActions($module, $controller)
    {
        $actions = [];
        $controller_file_name = Inflector::id2camel($controller) . 'Controller.php';
        $controller_file_name = Yii::getAlias("@app/modules/{$module}/controllers/{$controller_file_name}");
        if (file_exists($controller_file_name)) {
            $controller_file = file_get_contents($controller_file_name);
            preg_match_all('/public function action(\w+?)\(/', $controller_file, $result);
            if(!empty($result) && isset($result[1])) foreach ($result[1] as $action) {
                $actionId = Inflector::camel2id($action);
                $actions[] = $actionId;
            }
        }

        return $actions;
    }

    /**
     * @param $file_name
     *
     * @return string
     */
    public static function sanitizeFileName($file_name)
    {
        $file_name = BaseInflector::transliterate($file_name);
        $file_name = mb_ereg_replace('([+^\w\s\d\-_~,;\[\]\(\).])', '', $file_name);
        $file_name = mb_ereg_replace('([\.]{2,})', '', $file_name);
        $file_name = mb_ereg_replace('!\s+!', '_', $file_name);

        return strtolower($file_name . '_' . time());
    }

    public static function translit($s) {
        $s = (string) $s; // преобразуем в строковое значение
        $s = strip_tags($s); // убираем HTML-теги
        $s = str_replace(array("\n", "\r"), " ", $s); // убираем перевод каретки
        $s = preg_replace("/\s+/", ' ', $s); // удаляем повторяющие пробелы
        $s = trim($s); // убираем пробелы в начале и конце строки
        $s = function_exists('mb_strtolower') ? mb_strtolower($s) : strtolower($s); // переводим строку в нижний регистр (иногда надо задать локаль)
        $s = strtr($s, array('а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'j','з'=>'z','и'=>'i','і'=>'i','ї'=>'i','й'=>'y','к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f','х'=>'h','ц'=>'c','ч'=>'ch','ш'=>'sh','щ'=>'shch','ы'=>'y','э'=>'e','ю'=>'yu','я'=>'ya','ъ'=>'','ь'=>''));
        $s = preg_replace("/[^0-9a-z-_ ]/i", "", $s); // очищаем строку от недопустимых символов
        $s = str_replace(" ", "-", $s); // заменяем пробелы знаком минус
        return $s; // возвращаем результат
    }
    
    /**
     * @param string $from
     * @param string $name
     * @param string $to
     * @param string $subject
     * @param array $replace_array
     * @param bool $tpl
     * @param bool $local
     * @return bool|string
     */
    public function sendEmail($from='',$name='',$to='',$subject='',$replace_array= array(),$tpl=false,$local=false)
    {
        if(!$tpl){ return false;}

        $cache = Yii::$app->cache;

        $from = ($from) ? $from : (Yii::$app->params['default_email']['from']);
        $name = ($name) ? $name : (Yii::$app->params['default_email']['name']);

        $tpl_model = false;
        if(!$local){
            $local = Yii::$app->language;
        }
        if (!($tpl_model = $cache->get('mailtpl_' . $local.'_'.$tpl))) {
            $tpl_model = Mailtpl::find()->where(['tpl'=>$tpl])->one();
            if($tpl_model && isset($tpl_model->tpl)){
                $cache->set('mailtpl_' . $local.'_'.$tpl, $tpl_model);
            }
        }

        if(!$tpl_model && !isset($tpl_model->tpl)){ return false;}

        $body = ''; $f = array(); $t = array(); $i=0;
        if(is_array($replace_array)){
            foreach ($replace_array as $ke=>$va){
                $f[$i] = '{'.$ke.'}';
                $t[$i] = $va;
                $i++;
            }
            $body = str_replace($f,$t,$tpl_model->text);
        }

        $params = [
            'from'=>['address'=>$from,'name'=>$name],
            'body'=>$body,
            //optional
            'subject'=>$subject,
            //optional
            'altBody'=>'',
            //optional
            //'addReplyTo'=>[
            //    ['address'=>'','information'=>'']
            //],
            //optional
            //'cc'=>[
            //    ''
            //],
            //optional
            //'bcc'=>[
            //    ''
            //],
            //optional
            'attachments'=>[
                // ['path'=>'','name'=>'']
            ],
        ];
        $addresses = array();
        if(is_array($to)){
            foreach ($to as $toitem){
                $ins = array();
                if(isset($toitem['address'])){
                    $ins['address'] = $toitem['address'];
                    if(isset($toitem['name'])){
                        $ins['name'] = $toitem['name'];
                    }
                    array_push($addresses,$ins);
                }
            }
        }else{

            $addresses = [
                ['address'=>$to,'name'=>'']
            ];
        }
        $params['addresses'] = $addresses;
        return Yii::$app->BitckoMailer->mail($params); // return true if mail sent successfully
    }

    public function getCurrentdate(){
        $month = [];
        $day = [];
        $month['ru'] = array(0,'Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря');
        $day['ru'] = array('Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота');
        $month['uk'] = array(0,'Січня','Лютого','Березня','Квітня','Травня','Червня','Липня','Серпня','Вересня','Жовтня','Листопада','Грудня');
        $day['uk'] = array('Неділя','Понеділок','Вівторок','Середа','Четвер',"П'ятница",'Субота');

        if(($this->currentLang->code == 'ru') || ($this->currentLang->code == 'uk')){
            $dw = date('w', time());
            $d = date('d', time());
            $m = date('m', time());
            $Y = date('Y', time());
            $this->currentdate = $day[$this->currentLang->code][intval($dw)].", ".$d." ". $month[$this->currentLang->code][intval($m)]." ".$Y;
        }
        else{
            $this->currentdate = strftime("%A, %e %B %Y");
        }

    }
    public function viewsCnt($n){
        $a['uk'] = array('Перегляд','Перегляда','Переглядів');
        $a['ru'] = array('Просмотр','Просмотра','Просмотров');

        return $this->plural_form_simple($n,$a[$this->currentLang->code]);

    }

    public function plural_form($number,$before,$after) {
        $cases = array(2,0,1,1,1,2);
        echo $before[($number%100>4 && $number%100<20)? 2: $cases[min($number%10, 5)]].' '.$number.' '.$after[($number%100>4 && $number%100<20)? 2: $cases[min($number%10, 5)]];
    }
    public function plural_form_simple($number, $after) {
        $cases = array (2, 0, 1, 1, 1, 2);
        echo $number.' '.$after[ ($number%100>4 && $number%100<20)? 2: $cases[min($number%10, 5)] ];
    }
    public function fixAlt($str){
        return str_replace('"',"'",$str);
    }

    public function generateRandomString($length = 10) {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function getLink(){
		$link = Yii::$app->request->url;
        
		$link = explode('/', $link);
        // echo"<pre>";var_dump(Yii::$app->request); die();
		if(isset($link[1]) && $link[1] == $this->currentLang->url){
			unset($link[0]);
			$link[1] = '';
            // echo"<pre>";var_dump($link); die();
		}
		$link = implode('/', $link);
		if(!$link){
			$link = '/';
		}
		return $link;
	}
    

}
