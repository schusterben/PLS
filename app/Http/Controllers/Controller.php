<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * The base controller class for the application.
 *
 * This controller provides the foundational functionality for other controllers
 * in the application. It includes traits for authorizing requests and validating requests.
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
