<?php
/**
 * This is the template for generating the extended class.
 */

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\model\Generator */
/* @var $tableName string full table name */
/* @var $className string class name */
/* @var $tableSchema yii\db\TableSchema */
/* @var $labels string[] list of attribute labels (name => label) */
/* @var $rules string[] list of validation rules */
/* @var $relations array list of relations (name => relation declaration) */
/* @var $className string class name */
/* @var $module string module namespace */
/* @var $modelClassName string related model class name */

$modelFullClassName = $modelClassName;
$modelFullClassName = '\\' . $generator->ns . '\\' . $modelFullClassName;

echo "<?php\n";
?>

namespace <?= $module ?>;

/**
 * This is the extended class class of model [[<?= $modelFullClassName ?>]].
 *
 * @see <?= $modelFullClassName . "\n" ?>
 */
class <?= $modelClassName ?> extends <?= $modelFullClassName . "\n" ?>
{

}
