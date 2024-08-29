<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_text_page extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%text_page}}',
            [
                'id'                        => $this->primaryKey(),
                'title'                     => $this->string(255)->null()->defaultValue(''),
                'introduction_title'           => $this->string(255)->null()->defaultValue(''),
                'introduction_description'           => $this->string(255)->null()->defaultValue(''),
                'crs_faq_title'           => $this->string(255)->null()->defaultValue(''),
                'crs_faq_description'           => $this->string(255)->null()->defaultValue(''),
                'crs_footer_title'           => $this->string(255)->null()->defaultValue(''),
                'crs_footer_description'           => $this->string(255)->null()->defaultValue(''),
                'introduction_status'                    => $this->string(255)->null()->defaultValue(''),
                'crs_faq_status'          => $this->string(255)->null()->defaultValue(''),
                'crs_footer_status'          => $this->string(255)->null()->defaultValue(''),
                'created_at'                => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'                => $this->integer(32)->null()->defaultValue('0'),
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%text_page}}');
    }
}
