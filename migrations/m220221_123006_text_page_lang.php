<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123006_text_page_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%text_page_lang}}',
            [
                'id'            => $this->primaryKey()->comment('ID'),
                'title'         => $this->string(255)->comment('Title'),

                'introduction_title'           => $this->string(255)->null()->defaultValue(''),
                'introduction_description'           => $this->string(255)->null()->defaultValue(''),
                'crs_faq_title'           => $this->string(255)->null()->defaultValue(''),
                'crs_faq_description'           => $this->string(255)->null()->defaultValue(''),
                'crs_footer_title'           => $this->string(255)->null()->defaultValue(''),
                'crs_footer_description'           => $this->string(255)->null()->defaultValue(''),
                'language'      => $this->string(255)->comment('Language'),
                'original_id'   => $this->integer(32)->null()->defaultValue('0')->comment('Original ID'),              

            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%text_page_lang}}');
    }
}
