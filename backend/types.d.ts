/**
 * @file types.d.ts
 * @data  13th june, 2024
 *
 * This source file contains all global types defined by the webler group.
 * Naming Convention:
 *  =====================
 *  The name of a type should be in a "camelCase" followed by a _t if the
 *  definition is an actual type aliasing. for example, a nullable string could be
 *  defined as
 *
 *  type nullableString_t = string | null;
 *
 *  As opposed to type aliasing, interface, should be prefix or suffix by a lowercase "i"
 *
 *  interface hotGirl_i
 *  interface iHotty
 *  interface i_ForkIsNotF&ck
 *
 *  Honestly, i would have prefer the "iHotty" syntax. why not just make that the standard bro.
 */

type undefined_t<T> = T | undefined;