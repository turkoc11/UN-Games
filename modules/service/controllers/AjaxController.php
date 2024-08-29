<?php

namespace app\modules\service\controllers;

use app\components\Controller;
use app\models\Posts;
use Yii;

class AjaxController extends Controller
{

    public $layout = '@app/views/layouts/empty';

    /**
     * Returning Countries by query
     * @param null $q
     * @return array
     * @throws \yii\base\InvalidConfigException
     */
    public function actionSimilar($q = null)
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $lang                       = Yii::$app->controller->currentLang->url;

        $out = ['results' => ['id' => '', 'text' => '']];

        if (!is_null($q)) {
            $out[ 'results' ] = Posts::find()
                ->select('id, title as text')
                ->andWhere(['like', 'LOWER(title)', mb_strtolower($q)])
                ->limit(10)
                ->asArray();

            $out[ 'results' ] = $out[ 'results' ]->all();
        }

        return $out;
    }



}
