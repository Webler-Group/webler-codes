import {z} from "zod";
/**
 * @description bigint schema that is used in common cases where a bigint needed, likely as id to database.
 *  It has an upper and lower bound set, but if you need to restrict more set another bound, in other cases rather than id to database  
 * @todo set an uper and lower bound to pevent very lenghty request.
 */
export const bigintSchema = z.bigint();