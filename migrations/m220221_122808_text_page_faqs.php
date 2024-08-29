<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_text_page_faqs extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%text_page_faqs}}',
            [
                'id'            => $this->primaryKey(),
                'title'         => $this->string(255)->null()->defaultValue(''),                
                'description'   => $this->string(1600)->null()->defaultValue(''),
                'status'        => $this->string(255)->null()->defaultValue(''),
                'image'         => $this->string(200)->null()->defaultValue(''),
                'position'      => $this->integer(32)->null()->defaultValue('0'),
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
                
               
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%text_page_faqs}}');
    }
}
