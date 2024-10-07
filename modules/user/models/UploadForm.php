<?php
namespace app\modules\user\models;

use yii\base\Model;
use yii\web\UploadedFile;
use Yii;

/**
* UploadForm is the model behind the upload form.
*/
class UploadForm extends Model
{
/**
* @var UploadedFile file attribute
*/
public $image;

/**
* @return array the validation rules.
*/
    public function rules()
    {
        return [
            [['image'], 'file', 'extensions' => 'gif, jpg, png'],
        ];
    }

    public function attributeLabels()
    {
        $label = [


            'image' => Yii::t('app_model', 'Выберите файл для загрузки'),

        ];
        return $label;
    }
}