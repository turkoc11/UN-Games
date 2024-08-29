<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122955_message extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%message}}',
            [
                'id'          => $this->integer(32)->notNull(),
                'language'    => $this->string(16)->notNull(),
                'translation' => $this->text(),
            ]
        );

        $this->createIndex('idx_message_language', '{{%message}}', ['language'], false);
        $this->addPrimaryKey('pk_on_message', '{{%message}}', ['id', 'language']);
    }

    public function safeDown()
    {
        $this->dropPrimaryKey('pk_on_message', '{{%message}}');
        $this->dropIndex('idx_message_language', '{{%message}}');
        $this->dropTable('{{%message}}');
    }
}
