<?php
/**
 * This is the template for generating the model class of a specified table.
 */

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\model\Generator */
/* @var $tableName string full table name */
/* @var $className string class name */
/* @var $queryClassName string query class name */
/* @var $tableSchema yii\db\TableSchema */
/* @var $properties array list of properties (property => [type, name. comment]) */
/* @var $labels string[] list of attribute labels (name => label) */
/* @var $rules string[] list of validation rules */
/* @var $relations array list of relations (name => relation declaration) */

echo "<?php\n";
?>

namespace <?= $generator->ns ?>;

use Yii;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use yii\db\ActiveQuery;
use app\models\Lang;
use app\components\UserBehavior;
use app\components\MultilingualBehavior;
use app\components\MultilingualQuery;

/**
 * This is the model class for table "<?= $generator->generateTableName($tableName) ?>".
 *
<?php foreach ($properties as $property => $data): ?>
 * @property <?= "{$data['type']} \${$property}"  . ($data['comment'] ? ' ' . strtr($data['comment'], ["\n" => ' ']) : '') . "\n" ?>
<?php endforeach; ?>
 *
<?php if (!empty($relations)): ?>
 *
<?php foreach ($relations as $name => $relation): ?>
 * @property <?= $relation[1] . ($relation[2] ? '[]' : '') . ' $' . lcfirst($name) . "\n" ?>
<?php endforeach; ?>
 *
<?php endif; ?>
 */
class <?= $className ?> extends <?= '\\' . ltrim($generator->baseClass, '\\') . "\n" ?>
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '<?= $generator->generateTableName($tableName) ?>';
    }

    public function behaviors()
    {
        return [
<?php if(key_exists('created_at', $properties) && key_exists('updated_at', $properties)){ ?>
            TimestampBehavior::class,
<?php } ?>
<?php if(key_exists('created_by', $properties) && key_exists('updated_by', $properties)){ ?>
            UserBehavior::class,
<?php } ?>
<?php if ($generator->multiLang){ ?>
            'ml' => [
                'class' => MultilingualBehavior::class,
                'languages' => Lang::getBehaviorsList(),
                'recordClass' => 'FactoryActiveRecord',
                //'languageField' => 'language',
                //'localizedPrefix' => '',
                //'requireTranslations' => false',
                //'dynamicLangClass' => true',
                'defaultLanguage' => Lang::getCurrent()?Lang::getCurrent()->local:'EN',
                'langForeignKey' => 'original_id',
                'tableName' => "{{%<?=$generator->generateTableName($tableName) ?>_lang}}",
                'attributes' => [<?=$generator->generateMultiLangTableField($tableName,$generator->multiLangArray) ?>]
            ],
<?php } ?>
        ];
    }
<?php if ($generator->db !== 'db'): ?>

    /**
     * @return \yii\db\Connection the database connection used by this AR class.
     */
    public static function getDb()
    {
        return Yii::$app->get('<?= $generator->db ?>');
    }
<?php endif; ?>

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [<?= empty($rules) ? '' : ("\n            " . implode(",\n            ", $rules) . ",\n        ") ?>];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
<?php foreach ($labels as $name => $label): ?>
            <?= "'$name' => " . $generator->generateString($label) . ",\n" ?>
<?php endforeach; ?>
        ];
    }
<?php foreach ($relations as $name => $relation): ?>

    /**
     * @return \yii\db\ActiveQuery
     */
    public function get<?= $name ?>()
    {
        <?= $relation[0] . "\n" ?>
    }
<?php endforeach; ?>

<?php if(key_exists('created_by', $properties)){ ?>
    /**
    * @return \yii\db\ActiveQuery
    */
    public function getCreated()
    {
        return $this->hasOne(<?= \yii\helpers\StringHelper::basename(Yii::$app->user->identityClass) ?>::class , ['id' => 'created_by']);
    }
<?php } ?>

<?php if(key_exists('updated_by', $properties)){ ?>
    /**
    * @return \yii\db\ActiveQuery
    */
    public function getUpdated()
    {
        return $this->hasOne(<?= \yii\helpers\StringHelper::basename(Yii::$app->user->identityClass) ?>::class, ['id' => 'updated_by']);
    }
<?php } ?>


    /**
    * @param bool $key
    * @return array|mixed|null
    */
    public static function getStatuses( $key = false ) {

        $data = @Yii::$app->params['status'];
        if( $key ) return isset( $data[ $key ] ) ? $data[ $key ] : null;

        return $data;
    }

    /**
    * @return array|mixed|null
    */
    public function getStatusTitle() {

        $data = self::getStatuses();
        if( $this->status ) return isset( $data[ $this->status ] ) ? $data[ $this->status ] : null;

        return $data;
    }

<?php if ($queryClassName||$generator->multiLang): ?>
    <?php
    $queryClassFullName = ($generator->ns === $generator->queryNs) ? $queryClassName : '\\' . $generator->queryNs . '\\' . $queryClassName;
    echo "\n";
    ?>
    /**
    * @inheritdoc
    * @return ActiveQuery|MultilingualQuery the active query used by this AR class.
    */
    public static function find()
    {<?php if ($generator->multiLang): ?>

        $q = new MultilingualQuery(get_called_class());
        $q->localized();
        return $q;
    <?php else: ?>
        return new <?= $queryClassFullName ?>(get_called_class());
    <?php endif; ?>}
<?php endif; ?>

}
