<?php

namespace app\components;

use yii\base\Model;

class Sequence extends Model
{
    public static function up()
    {
        $connection = \Yii::$app->getDb();
        $dbSchema = $connection->getSchema();
        $tables = $dbSchema->getTableNames();
        foreach ($tables as $tbl) {
            $table = $connection->getTableSchema($tbl);
            if (isset($table->columns['id'])) {
                $start = intval($connection->createCommand('SELECT MAX(id) from "' . $tbl . '"')->queryOne()['max']);
                $start++;
                $connection->createCommand('CREATE SEQUENCE ' . $tbl . '_id_seq START ' . $start . ' 
                    MINVALUE 1 MAXVALUE 99999999999 OWNED BY "' . $tbl . '"."id";')
                    ->execute();
                $connection->createCommand('ALTER TABLE "' . $tbl . '" ALTER id SET DEFAULT nextval(\'' . $tbl . '_id_seq\')')
                    ->execute();
            }
        }
    }

    public static function down()
    {
        $connection = \Yii::$app->getDb();
        $dbSchema = $connection->getSchema();
        $tables = $dbSchema->getTableNames();
        foreach ($tables as $tbl) {
            $table = $connection->getTableSchema($tbl);
            if (isset($table->columns['id'])) {
                $connection->createCommand('DROP SEQUENCE IF EXISTS ' . $tbl . '_id_seq CASCADE')
                    ->execute();
            }
        }
    }

    public static function refresh()
    {
        self::down();
        self::up();
    }
}
