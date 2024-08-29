<?php

namespace app\modules\admin\controllers;

use Yii;
use app\modules\admin\models\AuthItem;
use app\modules\admin\models\AuthItemSearch;
use app\components\Controller;
use yii\web\NotFoundHttpException;
use yii\web\ForbiddenHttpException;
use yii\filters\AccessControl;
use app\models\Access;

/**
 * AuthItemController implements the CRUD actions for AuthItem model.
 */
class AuthController extends Controller
{

    public $layout = '@app/modules/admin/layouts/sidebar';

    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                //'except' => [''],
                //'only' => [''],
                'rules' => [
                    [
                        'actions'       => parent::getActions($this->module->id, $this->id),
                        'allow'         => true,
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
        ];
    }

    /**
     * Lists all AuthItem models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new AuthItemSearch();

        $params = [ 'auth_item.type' => 1 ];
        $and = [];

        if (!Access::can('developer')) {
            $params += [ 'auth_item.rule_name' => [ 'dynamic' ] ];
            $and = [ '>', 'auth_item.level', Yii::$app->user->identity->level ];
            if (Access::can('super_admin')) $params[ 'auth_item.rule_name' ] += [ 'admin', 'manager' ];
        }

        $dataProvider = $searchModel->search(Yii::$app->request->queryParams, $params, $and);

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single AuthItem model.
     * @param string $name
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($name)
    {
        return $this->render('view', [
            'model' => $this->findModel($name),
        ]);
    }

    /**
     * Creates a new AuthItem model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $params = [ 'type' => 1, 'rule_name' => 'dynamic' ];

        $model = new AuthItem($params);
        $permissions = $this->prepareTree();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect([ 'view', 'name' => $model->name ]);
        }

        return $this->render('create', [
            'model'       => $model,
            'permissions' => $permissions
        ]);
    }

    /**
     * Updates an existing AuthItem model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param string $name
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($name)
    {
        $model = $this->findModel($name);
        $permissions = $this->prepareTree();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect([ 'view', 'name' => $model->name ]);
        }

        return $this->render('update', [
            'model'       => $model,
            'permissions' => $permissions
        ]);
    }

    /**
     * Deletes an existing AuthItem model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param string $name
     *
     * @return \yii\web\Response
     * @throws NotFoundHttpException
     * @throws \Throwable
     * @throws \yii\db\StaleObjectException
     */
    public function actionDelete($name)
    {
        $model = $this->findModel($name);
        if ($model && $model->rule_name == 'dynamic') $model->delete();

        return $this->redirect([ 'index' ]);
    }

    /**
     * Finds the AuthItem model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param string $name
     * @param bool $ml
     *
     * @return AuthItem|array|null|\yii\db\ActiveRecord the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($name, $ml = true)
    {
        $params = [ 'name' => $name, 'type' => 1 ];
        $and = [];

        if (!Access::can('developer')) {
            $params += [ 'rule_name' => [ 'dynamic' ] ];
            $and = [ '>', 'auth_item.level', Yii::$app->user->identity->level ];
            if (Access::can('super_admin')) $params[ 'rule_name' ] += [ 'admin', 'manager' ];
        }
        if ($ml) $model = AuthItem::find()->where($params)->andWhere($and)->multilingual()->one();
        else $model = AuthItem::find()->where($params)->andWhere($and)->one();

        if (!empty($model)) return $model;
        else throw new NotFoundHttpException(\Yii::t('app', 'The requested page does not exist.'));
    }

    /**
     * Prepare data for build checkboxes tree of permissions in role view
     * @return array|string
     */
    protected function prepareTree()
    {

        $params = [ 'type' => 2 ];

        $permissions = AuthItem::find()
            ->where($params)
            ->andWhere([ '>=', 'level', Yii::$app->user->identity->level ])
            ->multilingual()->select('*')
            ->addSelect(new \yii\db\Expression("split_part(name::TEXT, '/', 1) as module"))
            ->addSelect(new \yii\db\Expression("split_part(name::TEXT, '/', 2) as controller"))
            ->addSelect(new \yii\db\Expression("split_part(name::TEXT, '/', 3) as action"))
            ->all();

        $result = [];
        array_map(function ($item) use (&$result) {
            /** @var $item AuthItem */
            if (!isset($result[ $item->module ])) {
                $result += [ $item->module => [ 'title' => $item->area, 'items' => [] ] ];
            }
            if (!isset($result[ $item->module ][ 'items' ][ $item->controller ])) {
                $result[ $item->module ][ 'items' ] += [ $item->controller => [ 'title' => $item->section, 'items' => [] ] ];
            }
            $result[ $item->module ][ 'items' ][ $item->controller ][ 'items' ] += [ $item->name => $item->description ];
        }, $permissions);
        $result = json_encode($result);

        return $result;

    }
}
