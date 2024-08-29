<?php
namespace app\modules\admin\controllers;
use Yii;
use app\components\Controller;
use yii\helpers\FileHelper;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use app\models\Access;
use app\modules\admin\models\Db;

class DbController extends Controller
{
    public $layout = '@app/modules/admin/layouts/sidebar';
    
    //Путь к файлам БД по-умолчанию
    public $dumpPath = '@common/db/';

    public function behaviors()
    {
    return [
        'access' => [
        'class' => AccessControl::class,
        //'except' => [''],
        //'only' => [''],
            'rules' => [
                [
                    'actions' => parent::getActions($this->module->id, $this->id),
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                    if (!Access::checkAccess($action->id)) {
                        throw new ForbiddenHttpException(
                        \Yii::t('app', 'You are not allowed to access this page.')
                    );
                    }
                        return true;
                    },
                ],
            ],
        ],
        'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                'delete' => ['POST'],
                ],
            ],
        ];
    }
    public function actionIndex($path = null){             
        $path = FileHelper::normalizePath(Yii::getAlias($this->dumpPath));
        $files = FileHelper::findFiles($path, ['only' => ['*.tar'], 'recursive' => FALSE]);
        $model = new Db();       
        $dataProvider = $model->getFiles($files); 
        return $this->render('index', [
            'dataProvider' => $dataProvider,
        ]);
    }
    public function actionImport($path) {
        $model = new Db();       
        $model->import($path);
    }
    public function actionExport($path = null) {;
        $path = $path ? : $this->dumpPath;
        $model = new Db();
               
        $model->export($path);
    }
    public function actionDelete($path) {
        $model = new Db();
        
        $model->delete($path);
    }
}