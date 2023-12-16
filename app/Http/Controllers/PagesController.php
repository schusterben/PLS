<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * The PagesController class handles requests related to static pages.
 */
class PagesController extends Controller
{
    /**
     * Display the index page.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Return the 'welcome' view, typically used as the homepage
        return view('welcome');
    }
}
