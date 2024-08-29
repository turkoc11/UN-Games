<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122938_auth_item extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%auth_item}}',
            [
                'name'        => $this->string(64)->notNull(),
                'type'        => $this->smallInteger(16)->notNull(),
                'level'       => $this->smallInteger(16)->null()->defaultValue('0'),
                'description' => $this->text(),
                'area'        => $this->string(64),
                'section'     => $this->string(64),
                'data'        => $this->binary(),
                'rule_name'   => $this->string(64),
                'created_at'  => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'  => $this->integer(32)->null()->defaultValue('0'),
                'created_by'  => $this->integer(32)->null()->defaultValue('0'),
                'updated_by'  => $this->integer(32)->null()->defaultValue('0'),
            ]
        );
        $this->createIndex('idx-auth_item-type', '{{%auth_item}}', ['type'], false);
        $this->addPrimaryKey('pk_on_auth_item', '{{%auth_item}}', ['name']);

    }

    public function safeDown()
    {
        $this->dropPrimaryKey('pk_on_auth_item', '{{%auth_item}}');
        $this->dropIndex('idx-auth_item-type', '{{%auth_item}}');
        $this->dropTable('{{%auth_item}}');
    }
}
