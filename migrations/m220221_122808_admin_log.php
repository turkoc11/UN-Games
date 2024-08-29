<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_admin_log extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%logs}}',
            [
                'id'            => $this->primaryKey(),
                'email'         => $this->string(255)->null()->defaultValue(''),
                'model_name'    => $this->string(100)->null()->defaultValue(''),
                'model_title'   => $this->string(100)->null()->defaultValue(''),
                'model_id'      => $this->integer(32)->null()->defaultValue('0'),
                'action'        => $this->string(160)->null()->defaultValue(''),
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
               
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%logs}}');
    }
}
