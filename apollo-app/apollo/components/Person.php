<?php
/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2016
 * @license http://opensource.org/licenses/mit-license.php MIT License
 */


namespace Apollo\Components;


/**
 * Class Person
 *
 * @package Apollo\Components
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @version 0.0.1
 */
class Person extends DBComponent
{
    /**
     * Namespace of entity class
     * @var string
     */
    protected static $entityNamespace = 'Apollo\\Entities\\PersonEntity';
}