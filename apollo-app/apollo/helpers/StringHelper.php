<?php
/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2016
 * @license http://opensource.org/licenses/gpl-license.php MIT License
 * @version 0.0.1
 */


namespace Apollo\Helpers;


/**
 * Class StringHelper
 *
 * @package Apollo\Helpers
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @since 0.0.1
 */
class StringHelper
{

    /**
     * Checks if the supplied $string begins with a certain substring $replace, if yes removes said
     * substring from the original string. Case-insensitive unless $case is set to true.
     *
     * @param string $string
     * @param string $replace
     * @param bool $case
     * @return string
     * @since 0.0.1
     */
    public static function replaceBeginning($string, $replace, $case = false) {

        $pattern = '/^' . preg_quote($replace, '/') . '/' . ($case ? '' : 'i');

        return preg_replace($pattern, '', $string);

    }

}