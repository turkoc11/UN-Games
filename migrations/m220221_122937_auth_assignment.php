<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122937_auth_assignment extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%auth_assignment}}',
            [
                'item_name'  => $this->string(64)->notNull(),
                'user_id'    => $this->string(64)->notNull(),
                'created_at' => $this->integer(32)->null()->defaultValue('0'),
                'updated_at' => $this->integer(32)->null()->defaultValue('0'),
                'created_by' => $this->integer(32)->null()->defaultValue('0'),
                'updated_by' => $this->integer(32)->null()->defaultValue('0'),
            ]
        );
        $this->createIndex('auth_assignment_user_id_idx', '{{%auth_assignment}}', ['user_id'], false);
        $this->addPrimaryKey('pk_on_auth_assignment', '{{%auth_assignment}}', ['item_name', 'user_id']);
    }

    public function safeDown()
    {
        $this->dropPrimaryKey('pk_on_auth_assignment', '{{%auth_assignment}}');
        $this->dropIndex('auth_assignment_user_id_idx', '{{%auth_assignment}}');
        $this->dropTable('{{%auth_assignment}}');
    }
}
