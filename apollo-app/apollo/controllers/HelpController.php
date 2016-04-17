<?php
/**
 * @author Desislava Koleva <desy.koleva96@gmail.com>
 * @copyright 2016
 * @license http://opensource.org/licenses/mit-license.php MIT License
 */

namespace Apollo\Controllers;

use Apollo\Components\View;
use Apollo\Helpers\URLHelper;

class HelpController extends GenericController
{

    /**
     * Default function that is called if no action is specified
     *
     * @since 0.0.2 Changed to function since GenericController is no longer an interface
     * @since 0.0.1
     */
    public function index()
    {
        View::render('help.index', 'Help', [['Help', URLHelper::url('help'), true]]);
    }

}