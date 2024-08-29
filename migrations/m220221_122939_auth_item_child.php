<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122939_auth_item_child extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%auth_item_child}}',
            [
                'parent' => $this->string(64)->notNull(),
                'child'  => $this->string(64)->notNull(),
            ]
        );
        $this->addPrimaryKey('pk_on_auth_item_child', '{{%auth_item_child}}', ['parent', 'child']);

    }

    public function safeDown()
    {
        $this->dropPrimaryKey('pk_on_auth_item_child', '{{%auth_item_child}}');
        $this->dropTable('{{%auth_item_child}}');
    }
}
