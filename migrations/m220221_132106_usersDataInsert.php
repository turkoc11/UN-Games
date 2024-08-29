<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_132106_usersDataInsert extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->batchInsert('{{%users}}',
            ["id", "email",  "first_name", "nick_name","last_name", "image", "auth_key", "email_confirm_token", "password_hash", "password_reset_token", "phone", "email_verified", "status", "level", "city_id", "country_id", "gender", "created_at", "updated_at", "created_by", "updated_by", "dateofbirth",  "personal_code", "hidden_user",  "full_name", "notes", "doctor_discount_limit", "telegram_id", "age"],
            [
                
//                [
//                    'id'                    => 120778,
//                    'email'                 => 'alx@test.test',
//                    'nick_name'             => 'alx',
//                    'backup_email'          => '',
//                    'first_name'            => 'Alex',
//                    'last_name'             => 'Rachovsky',
//                    'image'                 => '',
//                    'auth_key'              => '',
//                    'email_confirm_token'   => '',
//                    'password_hash'         => '$2y$13$k1sDUxd2dazP676fPtP/WOjd7FzcfDTnKBFhmiNd3XXsZJLziPAya',
//                    'password_reset_token'  => '',
//                    'phone'                 => '555 223 3322',
//                    'email_verified'        => 0,
//                    'status'                => 1,
//                    'level'                 => 0,
//                    'city_id'               => null,
//                    'country_id'            => null,
//                    'gender'                => 2,
//                    'created_at'            => 1637852181,
//                    'updated_at'            => 1637853942,
//                    'created_by'            => 120776,
//                    'updated_by'            => 120776,
//                    'dateofbirth'           => '1991-11-26',
//                    'doctor_id'             => 120777,
//                    'fixed_discount'        => null,
//                    'personal_code'         => '1AP4ZLF60VU5UPV9',
//                    'hidden_user'           => false,
//                    'is_doctor'             => false,
//                    'full_name'             => 'Alex Rachovsky',
//                    'notes'                 => '',
//                    'doctor_discount_limit' => null,
//                    'telegram_id'           => '',
//                    'age'                   => 29,
//                ],
                [
                    'id'                    => 1,
                    'email'                 => 'admin@test.com',
//                    'backup_email'          => 'admin@test.com',
                    'first_name'            => 'Admin',
                    'nick_name'             => 'admin',
                    'last_name'             => 'A',
                    'image'                 => '/images/user/_1560152740.png',
                    'auth_key'              => 'administrator',
                    'email_confirm_token'   => '',
                    'password_hash'         => '$2y$13$aiqozvvctCQ2P6beYJEgXejbTDFDi1NPyzmp.0/6CYnkB9suHhq2i',
                    'password_reset_token'  => '',
                    'phone'                 => '0',
                    'email_verified'        => 1,
                    'status'                => 1,
                    'level'                 => 1,
                    'city_id'               => 0,
                    'country_id'            => 0,
                    'gender'                => 2,
                    'created_at'            => 1556626614,
                    'updated_at'            => 1560145540,
                    'created_by'            => 0,
                    'updated_by'            => 1,
                    'dateofbirth'           => null,
//                    'doctor_id'             => null,
//                    'fixed_discount'        => '0',
                    'personal_code'         => null,
                    'hidden_user'           => true,
//                    'is_doctor'             => false,
                    'full_name'             => 'Vlad Chubuk',
                    'notes'                 => null,
                    'doctor_discount_limit' => '25',
                    'telegram_id'           => null,
                    'age'                   => null,                   
                ],
//                [
//                    'id'                    => 120776,
//                    'email'                 => 'manager@test.com',
//                    'backup_email'          => 'manager@test.com',
//                    'first_name'            => 'Manager',
//                    'nick_name'             => 'manager',
//                    'last_name'             => 'A',
//                    'image'                 => '',
//                    'auth_key'              => '',
//                    'email_confirm_token'   => '',
//                    'password_hash'         => '$2y$13$aiqozvvctCQ2P6beYJEgXejbTDFDi1NPyzmp.0/6CYnkB9suHhq2i',
//                    'password_reset_token'  => '',
//                    'phone'                 => '050 000 0001',
//                    'email_verified'        => 1,
//                    'status'                => 1,
//                    'level'                 => 0,
//                    'city_id'               => 0,
//                    'country_id'            => 0,
//                    'gender'                => 1,
//                    'created_at'            => 1556626614,
//                    'updated_at'            => 1637861911,
//                    'created_by'            => 1,
//                    'updated_by'            => 120776,
//                    'dateofbirth'           => '1980-11-07',
//                    'doctor_id'             => 120777,
//                    'fixed_discount'        => '0',
//                    'personal_code'         => '62RPI9WQW48MK48R',
//                    'hidden_user'           => false,
//                    'is_doctor'             => false,
//                    'full_name'             => 'Manager A',
//                    'notes'                 => '',
//                    'doctor_discount_limit' => '25',
//                    'telegram_id'           => '',
//                    'age'                   => 41,
//                ],
            ]
        );
    }

    public function safeDown()
    {
        $this->truncateTable('{{%users}} CASCADE');
    }
}
