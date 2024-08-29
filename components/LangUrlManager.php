<?php

namespace app\components;

use app\models\Lang;
use yii\web\UrlManager;

class LangUrlManager extends UrlManager
{
    public function createUrl($params)
    {
        $default_lang = isset(\Yii::$app->controller->defaultLang) ?
            \Yii::$app->controller->defaultLang :
            Lang::getDefaultLang();
        $current_lang = isset(\Yii::$app->controller->currentLang) ?
            \Yii::$app->controller->currentLang :
            Lang::getCurrent();

        if (isset($params['lang_id'])) {
            $lang = Lang::findOne($params['lang_id']);
            if ($lang === null) {
                $lang = $default_lang;
            }
            unset($params['lang_id']);
        } else {
            $lang = $current_lang;
        }
        
        $url = parent::createUrl($params);

        if ($default_lang && $default_lang->url !== $lang->url) {
            if ($url == '/') {
                return '/' . $lang->url . "/";
            } else {
                return '/' . $lang->url . $url;
            }
        } else {
            return $url;
        }
    }
}
