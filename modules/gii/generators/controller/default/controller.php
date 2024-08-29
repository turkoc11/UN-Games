<?php
/**
 * This is the template for generating a controller class file.
 */

use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\controller\Generator */

echo "<?php\n";
?>

namespace <?= $generator->getControllerNamespace() ?>;

class <?= StringHelper::basename($generator->controllerClass) ?> extends <?= '\\' . trim($generator->baseClass, '\\') . "\n" ?>
{

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
    'actions' => parent::getActions($this->module->id, $this->id),
    'allow' => true,
    'matchCallback' => function ($rule, $action) {
    if (!Yii::$app->user->isGuest || !Access::checkAccess($action->id)) {
    throw new ForbiddenHttpException(
    \Yii::t('app', 'You are not allowed to access this page.')
    );
    }
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
<?php foreach ($generator->getActionIDs() as $action): ?>
    public function action<?= Inflector::id2camel($action) ?>()
    {
        return $this->render('<?= $action ?>');
    }

<?php endforeach; ?>
}
