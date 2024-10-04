<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_prize extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%prize}}',
            [
                'id'            => $this->primaryKey(),
                'name'         => $this->string(255)->null()->defaultValue(''),
                'description'   => $this->string(1600)->null()->defaultValue(''),
                'status'        => $this->string(255)->null()->defaultValue(''),
                'amount'         => $this->string(20)->null(),
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%prize}}');
    }
}
