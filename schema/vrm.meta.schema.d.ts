/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface VrmMeta {
  /**
   * Title of VRM model
   */
  title?: string;
  /**
   * Version of VRM model
   */
  version?: string;
  /**
   * Author of VRM model
   */
  author?: string;
  /**
   * Contact Information of VRM model author
   */
  contactInformation?: string;
  /**
   * Reference of VRM model
   */
  reference?: string;
  /**
   * Thumbnail of VRM model
   */
  texture?: number;
  /**
   * A person who can perform with this avatar
   */
  allowedUserName?: "OnlyAuthor" | "ExplicitlyLicensedPerson" | "Everyone";
  /**
   * Permission to perform violent acts with this avatar
   */
  violentUssageName?: "Disallow" | "Allow";
  /**
   * Permission to perform sexual acts with this avatar
   */
  sexualUssageName?: "Disallow" | "Allow";
  /**
   * For commercial use
   */
  commercialUssageName?: "Disallow" | "Allow";
  /**
   * If there are any conditions not mentioned above, put the URL link of the license document here.
   */
  otherPermissionUrl?: string;
  /**
   * License type
   */
  licenseName?:
    | "Redistribution_Prohibited"
    | "CC0"
    | "CC_BY"
    | "CC_BY_NC"
    | "CC_BY_SA"
    | "CC_BY_NC_SA"
    | "CC_BY_ND"
    | "CC_BY_NC_ND"
    | "Other";
  /**
   * If “Other” is selected, put the URL link of the license document here.
   */
  otherLicenseUrl?: string;
  [k: string]: any;
}
