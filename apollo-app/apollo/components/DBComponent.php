<?php
/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2016
 * @license http://opensource.org/licenses/mit-license.php MIT License
 */


namespace Apollo\Components;

use Doctrine\ORM\EntityRepository;


/**
 * Class Field
 *
 * @package Apollo\Components
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @version 0.0.2
 */
abstract class DBComponent
{
    /**
     * @return EntityRepository
     */
    public static function getRepository()
    {
        return DB::getEntityManager()->getRepository(self::getEntityNamespace());
    }

    /**
     * Finds a user by ID
     *
     * @param int $id
     * @return mixed
     * @since 0.0.2
     */
    public static function find($id)
    {
        return self::getRepository()->find($id);
    }

    /**
     * @return string
     */
    public static function getEntityNamespace()
    {
        return static::$entityNamespace;
    }
}