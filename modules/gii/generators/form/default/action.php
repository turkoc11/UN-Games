<?php
/**
 * This is the template for generating an action view file.
 */

use yii\helpers\Inflector;

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\form\Generator */

echo "<?php\n";
?>

public function action<?= Inflector::id2camel(trim(basename($generator->viewName), '_')) ?>()
{
    $model = new \<?= ltrim($generator->modelClass, '\\') ?><?= empty($generator->scenarioName) ? "()" : "(['scenario' => '{$generator->scenarioName}'])" ?>;

    if ($model->load(Yii::$app->request->post())) {
        if ($model->validate()) {
            // form inputs are valid, do something here
            return;
        }
    }

    return $this->render('<?= basename($generator->viewName) ?>', [
        'model' => $model,
    ]);
}
