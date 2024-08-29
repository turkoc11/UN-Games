<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_meta_tags extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%meta_tags}}',
            [
                'id'            => $this->primaryKey(),
                'title'         => $this->string(255)->null()->defaultValue(''),
                'keywords'      => $this->string(255)->null()->defaultValue(''),
                'description'   => $this->string(160)->null()->defaultValue(''),                
                'og__image'     => $this->string(20)->null()->defaultValue(''),
                'model_id'      => $this->integer(3)->null()->defaultValue('0'),                
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
                'model'         => $this->string(255)->null()->defaultValue(''),               
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%meta_tags}}');
    }
}
