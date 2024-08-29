<?php

namespace app\modules\admin\models;

use Yii;
use yii\helpers\ArrayHelper;
use yii\helpers\FileHelper;
use yii\web\UploadedFile;

/**
 * Class Users
 * @package app\modules\admin\models
 * @property string $backup_email [varchar(255)]  Backup Email (optional)
 * @property string $city_id [integer]  City
 * @property string $country_id [integer]  Country
 *
 * @property array $roles
 * @property string $fullName
 *
 */
class Users extends \app\models\Users
{
    public $roles = [];

    public $timeArray = [
        'created_at',
        'updated_at',
     
    ];
    public $tempImage;

    public function upload()
    {
        if ($this->validate()) {

            if ($this->tempImage instanceof UploadedFile) {
                @FileHelper::unlink(\Yii::getAlias('@webroot') . $this->image);
                $file_name = \Yii::$app->controller::sanitizeFileName($this->tempImage->baseName) . '.' . $this->tempImage->extension;
                if (!is_dir(\Yii::getAlias('@webroot/images/user/'))) {
                    mkdir(\Yii::getAlias('@webroot/images/user/'));
                }
                if ($this->tempImage->saveAs(\Yii::getAlias('@webroot/images/user/') . $file_name)) {
                    return '/images/user/' . $file_name;
                };
            } else {
                return $this->image;
            }
        }

        return false;
    }

    public function rules()
    {
        $rules = parent::rules();
        $rules = array_merge($rules, [
            [ 'roles', 'safe' ],
        ]);

        return $rules;
    }

    public function afterFind()
    {
        $auth = Yii::$app->authManager;
        $roles = ArrayHelper::getColumn($auth->getRolesByUser($this->id), 'name');
        $this->roles = $roles;
        parent::afterFind();
    }

    public function beforeSave($insert)
    {
        foreach ($this->timeArray as $time) if (!empty(!$this->$time)) $this->$time = strtotime($this->$time);

        return parent::beforeSave($insert);
    }

    public function afterSave($insert, $changedAttributes)
    {
        $auth = Yii::$app->authManager;
        $roles = $auth->getRolesByUser($this->id);

        foreach ($roles as $role) {
            if (!in_array($role->name, $this->roles)) $auth->revoke($role, $this->id);
        }

        if (!empty($this->roles)) foreach ($this->roles as $role) {
            if (!$auth->getAssignment($role, $this->id)) $auth->assign($auth->getRole($role), $this->id);
        }

        Users::updatePermissions($this->id);
        Users::updateAssignments($this->id);

        parent::afterSave($insert, $changedAttributes);
    }

    public static function updatePermissions($id)
    {

        $cache = Yii::$app->cache;
        $auth = Yii::$app->authManager;

        $permissions = $cache->get('permissions_' . $id);
        if ($permissions) $cache->delete('permissions_' . $id);
        $permissions = ArrayHelper::getColumn($auth->getPermissionsByUser($id), 'name');
        $cache->set('permissions_' . $id, $permissions);
    }

    public static function updateAssignments($id)
    {

        $cache = Yii::$app->cache;
        $auth = Yii::$app->authManager;

        $assignments = $cache->get('assignments_' . $id);
        if ($assignments) $cache->delete('assignments_' . $id);
        $assignments = ArrayHelper::getColumn($auth->getRolesByUser($id), 'name');
        $cache->set('assignments_' . $id, $assignments);

    }

    public static function getAll()
    {
        $data = self::findAll([ 'status' => 1 ]);
        $result = [];
        array_map(function ($item) use (&$result) {
            /** @var $item self */
            $result += [ $item->id => $item->first_name . ' ' . $item->last_name ];
        }, $data);

        return $result;
    }

    public function getFullName(): string
    {
        if (!empty($this->first_name)) {
            $first_name = $this->first_name . ' ';
        } else {
            $first_name = $this->first_name;
        }

        $last_name = $this->last_name;

        $name = $first_name . $last_name;

        return $name;
    }

}
