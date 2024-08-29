<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122949_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%lang}}',
            [
                'id'         => $this->primaryKey(),
                'flag'       => $this->string(255)->null()->defaultValue(''),
                'url'        => $this->string(6)->null()->defaultValue(''),
                'local'      => $this->string(12)->null()->defaultValue(''),
                'name'       => $this->string(255)->null()->defaultValue(''),
                'default'    => $this->smallInteger(16)->null()->defaultValue(1),
                'created_at' => $this->integer(32)->null()->defaultValue('0'),
                'updated_at' => $this->integer(32)->null()->defaultValue('0'),
                'created_by' => $this->integer(32)->null()->defaultValue('0'),
                'updated_by' => $this->integer(32)->null()->defaultValue('0'),
                'code'       => $this->string(12)->null()->defaultValue(''),
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%lang}}');
    }
}
