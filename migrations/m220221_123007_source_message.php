<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123007_source_message extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%source_message}}',
            [
                'id'       => $this->primaryKey(),
                'category' => $this->string(255),
                'message'  => $this->text(),
            ]
        );

        $this->createIndex('idx_source_message_category', '{{%source_message}}', ['category'], false);
        $this->createIndex('idx_source_message_message', '{{%source_message}}', ['message'], false);
    }

    public function safeDown()
    {
        $this->dropIndex('idx_source_message_category', '{{%source_message}}');
        $this->dropIndex('idx_source_message_message', '{{%source_message}}');
        $this->dropTable('{{%source_message}}');
    }
}
