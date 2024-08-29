<?php

namespace app\modules\admin\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
 * This is the extended class class of model [[\app\models\AuthItem]].
 *
 * @see \app\models\AuthItem
 *
 * @property string $module
 * @property string $controller
 * @property string $action
 *
 * @property array $permissions
 * @property array $attached
 *
 */
class AuthItem extends \app\models\AuthItem
{

    public $module;
    public $controller;
    public $action;

    public $permissions = [];

    public function rules()
    {
        $rules = parent::rules();
        $rules = array_merge($rules, [
            [ [ 'name' ], 'required', 'when' => function ($model) {
                return $model->type == 2;
            } ],
            [ [ 'name' ],
              'match',
              'pattern' => '/^([a-z-\-]+)(\/)([a-z-\-]+)(\/)([a-z-\-]+)$/',
              'message' => \Yii::t(
                  'app_model',
                  'Route can only contain three words witch contain underscores latin characters and "-", which delimited by "/".
                             For example - "module/controller/action-name"'
              ),
              'when'    => function ($model) {
                  return $model->type == 2;
              } ],
            [ [ 'rule_name' ], 'default', 'value' => 'dynamic', 'when' => function ($model) {
                return $model->type == 1;
            } ],
            [ 'permissions', 'safe' ],
            [ 'description', 'required' ],
            [ [ 'area', 'section' ], 'required', 'when' => function ($model) {
                return $model->type == 2;
            } ],
        ]);

        return $rules;
    }

    static function types()
    {
        return [
            1 => \Yii::t('app_model', 'Role'),
            2 => \Yii::t('app_model', 'Permission'),
        ];
    }

    public function beforeSave($insert)
    {
        switch ($this->type) {
            case 1:
                if ($this->isNewRecord) {
                    $this->name = 'role_' . Yii::$app->security->generateRandomString();
                }
                break;
            case 2:
                break;
        }

        return parent::beforeSave($insert);
    }

    public function afterSave($insert, $changedAttributes)
    {
        $auth = Yii::$app->authManager;
        switch ($this->type) {

            case 1:

                $role = $auth->getRole($this->name);
                $auth->removeChildren($role);
                foreach ($this->permissions as $permission) {
                    $permission = $auth->getPermission($permission);
                    $auth->addChild($role, $permission);
                }

                $users = $auth->getUserIdsByRole($this->name);
                foreach ($users as $user_id) {
                    $user_id = intval($user_id);
                    Users::updatePermissions($user_id);
                    Users::updateAssignments($user_id);
                }

                break;

            case 2:

                $roles = $this->parents;
                foreach ($roles as $role) {
                    $users = $auth->getUserIdsByRole($role->name);
                    foreach ($users as $user_id) {
                        $user_id = intval($user_id);
                        Users::updatePermissions($user_id);
                    }
                }

                break;
        }

        parent::afterSave($insert, $changedAttributes);
    }

    public function afterDelete()
    {
        $auth = Yii::$app->authManager;

        switch ($this->type) {

            case 1:

                $users = $auth->getUserIdsByRole($this->name);
                foreach ($users as $user_id) {
                    $user_id = intval($user_id);
                    Users::updatePermissions($user_id);
                    Users::updateAssignments($user_id);
                }
                break;

            case 2:

                $roles = $this->parents;
                foreach ($roles as $role) {
                    $users = $auth->getUserIdsByRole($role->name);
                    foreach ($users as $user_id) {
                        $user_id = intval($user_id);
                        Users::updatePermissions($user_id);
                    }
                }

                break;
        }

        parent::afterDelete();
    }

    /** Get children of role */
    public function getAttached()
    {

        $auth = Yii::$app->authManager;
        $role = $auth->getRole($this->name);
        $children = ArrayHelper::map($auth->getChildren($role->name), 'name', 'name');

        return $children;
    }

    public function getCreated()
    {
        return $this->hasOne(Users::class, [ 'id' => 'created_by' ]);
    }

    public function getUpdated()
    {
        return $this->hasOne(Users::class, [ 'id' => 'updated_by' ]);
    }

}
