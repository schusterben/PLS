<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Repräsentiert eine Einsatzszene mit einem Namen und einer Beschreibung.
 */
class OperationScene extends Model
{
    // Set the table name
    protected $table = 'operationScene';

    // Set the primary key field
    protected $primaryKey = 'idoperationScene';

    // Define the fields that are fillable
    protected $fillable = ['name', 'description'];

    // Enable timestamps for created_at and updated_at
    public $timestamps = true;
}
