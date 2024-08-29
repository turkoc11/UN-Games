<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122941_auth_rule extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%auth_rule}}',
            [
                'name'       => $this->string(64)->notNull(),
                'data'       => $this->binary(),
                'created_at' => $this->integer(32),
                'updated_at' => $this->integer(32),
            ]
        );

        $this->addPrimaryKey('pk_on_auth_rule', '{{%auth_rule}}', ['name']);
    }

    public function safeDown()
    {
        $this->dropPrimaryKey('pk_on_auth_rule', '{{%auth_rule}}');
        $this->dropTable('{{%auth_rule}}');
    }
}
