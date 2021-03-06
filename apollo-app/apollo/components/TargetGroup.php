<?php
/**
 * @author Christoph Ulshoefer <christophsulshoefer@gmail.com>
 * @copyright 2016
 * @license http://opensource.org/licenses/gpl-license.php MIT License
 */

namespace Apollo\Components;
use Apollo\Apollo;
use Apollo\Entities\TargetGroupEntity;


/**
 * Class TargetGroup
 *
 * @package Apollo\Components
 * @author Christoph Ulshoefer <christophsulshoefer@gmail.com>
 * @version 0.0.2
 */
class TargetGroup extends DBComponent
{
    /**
     * Namespace of entity class
     * @var string
     */
    protected static $entityNamespace = 'Apollo\\Entities\\TargetGroupEntity';

    public static function getMin()
    {
        $em = DB::getEntityManager();
        $repo = $em->getRepository(TargetGroup::getEntityNamespace());
        $qb = $repo->createQueryBuilder('t');
        $organisation_id = Apollo::getInstance()->getUser()->getOrganisationId();
        $notHidden = $qb->expr()->eq('t' . '.is_hidden', '0');
        $sameOrgId = $qb->expr()->eq('t' . '.organisation', $organisation_id);
        $cond = $qb->expr()->andX($notHidden, $sameOrgId);
        $qb->where($cond);
        $query = $qb->getQuery()
            ->setFirstResult(0)
            ->setMaxResults(1);
        $result = $query->getResult();
        $item = $result[0];
        return $item;
    }

    /**
     * Returns all valid target groups
     * @return TargetGroupEntity[]
     */
    public static function getValidTargetGroups()
    {
        $org_id = Apollo::getInstance()->getUser()->getOrganisationId();
        return TargetGroup::getRepository()->findBy(['organisation' => $org_id, 'is_hidden' => false]);
    }

    /**
     * Given an id, returns a target group (hopefully)
     * @param $id
     * @return TargetGroupEntity
     */
    public static function getValidTargetGroupWithId($id)
    {
        $org_id = Apollo::getInstance()->getUser()->getOrganisationId();
        return TargetGroup::getRepository()->findBy(['organisation' => $org_id, 'is_hidden' => false, 'id' => $id])[0];
    }

    /**
     * Formats one TargetGroup correctly
     * @param TargetGroupEntity $targetGroup
     * @return array
     */
    private function getFormattedTargetGroup($targetGroup)
    {
        if(!empty($targetGroup)) {
            $tg = [
                'id' => $targetGroup->getId(),
                'name' => $targetGroup->getName()
            ];
        } else {
            return null;
        }
        return $tg;
    }

    /**
     * Formats all of the target groups correctly
     * @param TargetGroupEntity $activeTarget
     * @return array
     */
    public static function getFormattedTargetGroups($activeTarget)
    {
        $targetGroups = self::getValidTargetGroups();
        $arr = [];
        foreach ($targetGroups as $targetGroup) {
            $tg = self::getFormattedTargetGroup($targetGroup);
            if(!empty($tg))
                $arr[] = $tg;
        }
        $ret['data'] = $arr;
        $ret['active'] = self::getFormattedTargetGroup($activeTarget);
        return $ret;
    }
}