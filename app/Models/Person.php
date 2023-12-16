<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


/**
 * The Person class represents the person model.
 */
class Person extends Model
{
    // Indicates that automatic timestamp assignment should be used
    public $timestamps = true;

    // Specifies the table associated with this model
    protected $table = 'persons';

    // Defines the attributes that are mass assignable
    protected $fillable = [
        'Triagefarbe',
        'position', // Assuming it's a string in the format 'latitude,longitude'
    ];


    /**
     * Mutator to set the position attribute.
     * @param array $value An array containing 'lat' and 'lng'.
     */
    public function setPositionAttribute($value)
    {
        // Check if 'lat' and 'lng' keys exist in the $value array.
        if (isset($value['lat']) && isset($value['lng'])) {
            $lat = $value['lat'];
            $lng = $value['lng'];

            // Ensure $lat and $lng are numeric before inserting them into the database query.
            if (is_numeric($lat) && is_numeric($lng)) {
                $this->attributes['position'] = DB::raw("ST_PointFromText('POINT($lng $lat)')");
            } else {

                throw new \InvalidArgumentException("Invalid latitude or longitude. Lat: $lat, Lng: $lng");
            }
        } else {
            //throw an exception if 'lat' or 'lng' is not set            
            throw new \InvalidArgumentException("Missing latitude or longitude.");
        }
    }


    /**
     * Accessor to get the position attribute.
     * @param string $value The stored position value.
     * @return array|null An array with 'lat' and 'lng' or null if no position is present.
     */
    public function getPositionAttribute($value)
    {


        // Only attempt to retrieve the position if the value is set.
        if (!empty($this->attributes['position'])) {

            // Using Eloquent's Accessor to convert the geometric data.
            // Conversion is done without raw data query to prevent SQL injection.
            $point = $this->attributes['position'];


            // We use the DB::raw function within a safe context since we're not inserting external data,
            // only executing an SQL function. Note that this is still a raw query and carries certain risks.
            $coords = DB::select(DB::raw("SELECT ST_X(ST_GeomFromText(?)) AS lng, ST_Y(ST_GeomFromText(?)) AS lat", [$point, $point]));

            // Check if coordinates were retrieved and log the result.
            if (!empty($coords)) {

                // Convert the results into an array with 'lat' and 'lng' as keys and log the return.
                $result = ['lat' => $coords[0]->lat, 'lng' => $coords[0]->lng];

                return $result;
            } else {
                // Log if no coordinates were found.
                Log::info('No coordinates found for given position.');
            }
        } else {
            // Log if the 'position' attribute is empty.
            Log::info('No position attribute set.');
        }

        // Return null if no position is present and log this case.
        return null;
    }
}
