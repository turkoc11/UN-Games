<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_user_prize extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%user_prize}}',
            [
                'id'            => $this->primaryKey(),
                'prize_name'    => $this->string(255)->null()->defaultValue(''),
                'email'         => $this->string(255)->null()->defaultValue(''),
                'prize_id'      => $this->integer(32),
                'user_id'       => $this->integer(32),
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%user_prize}}');
    }
}
