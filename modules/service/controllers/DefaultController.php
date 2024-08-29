<?php

namespace app\modules\service\controllers;

use app\components\Controller;
use app\modules\service\models\Dynamic;
use Yii;

class DefaultController extends Controller
{
    public $layout = '@app/views/layouts/empty';

    public function actions(): array
    {
        return [
            'error'    => [
                'class' => 'yii\web\ErrorAction',
            ],
            'timezone' => [
                'class' => 'yii2mod\timezone\TimezoneAction',
            ],
        ];
    }

    /**
     * @param string $link
     * @return string
     * @throws \yii\web\NotFoundHttpException
     */
    public function actionIndex($link = '')
    {
        $pkeywords = Yii::$app->controller->coreSettings->keywords;
        $pdescription = Yii::$app->controller->coreSettings->description;
        $ptitle = Yii::$app->controller->coreSettings->title;

        if ($link) {
            /** @var Dynamic $model */
            $model = Dynamic::find()
                ->where('url = :url and status = 1', [ ':url' => $link ])
                ->multilingual()
                ->one();

        } else {
            /** @var Dynamic $model */
            $model = Dynamic::find()
                ->where('url = :url and status = 1', [ ':url' => 'service' ])
                ->multilingual()
                ->one();

        }

        if ($model === null) {
            Yii::$app->controller->throw404();
        }

        if ($model->meta_title) {
            $ptitle = $model->meta_title;
        }
        if ($model->meta_description) {
            $pdescription = $model->meta_description;
        }
        if ($model->meta_keyword) {
            $pkeywords = $model->meta_keyword;
        }

        //SETMETA
        $this->view->title = $ptitle;
        $this->view->registerMetaTag(
            [
                'name'    => 'description',
                'content' => $pdescription
            ]
        );
        $this->view->registerMetaTag(
            [
                'name'    => 'keywords',
                'content' => $pkeywords
            ]
        );

        //EOF_SETMETA
        return $this->render(
            'page', [
                'model' => $model
            ]
        );
    }


}
