<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OperationScene extends Model
{
    protected $table = 'operationScene';
    protected $primaryKey = 'idoperationScene';
    protected $fillable = ['name', 'description'];
    public $timestamps = true;
}
