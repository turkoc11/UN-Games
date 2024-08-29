<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123006_text_page_faqs_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%text_page_faqs_lang}}',
            [
                'id'            => $this->primaryKey()->comment('ID'),
                'title'         => $this->string(255)->comment('Title'),               
                'description'   => $this->string(2000)->null()->defaultValue(''),
                'language'      => $this->string(255)->comment('Language'),
                'original_id'   => $this->integer(32)->null()->defaultValue('0')->comment('Original ID'),              

            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%text_page_faqs_lang}}');
    }
}
