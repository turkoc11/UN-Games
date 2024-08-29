<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_transactions extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%transactions}}',
            [
                'id'            => $this->primaryKey(),
                'email'         => $this->string(255)->null()->defaultValue(''),
                'amount'        => $this->integer(32),
                'transaction'   => $this->json()->notNull(),
                'status'        => $this->string(255)->null()->defaultValue(''),
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%transactions}}');
    }
}
