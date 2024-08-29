<?php

namespace app\modules\admin\models;

use yii\helpers\FileHelper;
use yii\web\UploadedFile;

/**
 *
 * This is the extended class class of model [[\app\models\Settings]].
 *
 * @see \app\models\Settings
 */
class Settings extends \app\models\Settings
{

    /**
     * @var UploadedFile
     */
    public $logoFile;

    public function rules()
    {
        $rules = parent::rules();
        $rules = array_merge($rules, [ [ [ 'logoFile' ], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, jpg, jpeg', 'maxSize' => 10485760 ] ]);

        return $rules;
    }

    static function defaults()
    {
        return [
            null => \Yii::t('app_model', 'All'),
            0    => \Yii::t('app_model', 'No'),
            1    => \Yii::t('app_model', 'Yes'),
        ];
    }

    public function upload()
    {
        if ($this->validate()) {

            if ($this->logoFile instanceof UploadedFile) {
                @FileHelper::unlink(\Yii::getAlias('@webroot') . $this->logo);
                $file_name = \Yii::$app->controller::sanitizeFileName($this->logoFile->baseName) . '.' . $this->logoFile->extension;
                if ($this->logoFile->saveAs(\Yii::getAlias('@webroot/images/logo/') . $file_name)) {
                    return '/images/logo/' . $file_name;
                };
            } else {
                return $this->logo;
            }
        }

        return false;
    }

    public function beforeSave($insert)
    {
        $this->ips = preg_replace('/((\s\s+;\s\s+)|(\s\s+,\s\s+)|(\s\s+\/\s\s+)|(\s\s+\\\\{1}\s\s+))/', ' ', $this->ips);
        return parent::beforeSave($insert);
    }

}
