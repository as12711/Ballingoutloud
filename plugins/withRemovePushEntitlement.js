const { withEntitlementsPlist } = require("expo/config-plugins");

/**
 * Config plugin that removes the aps-environment entitlement from the iOS build.
 *
 * Expo SDK 50 automatically adds aps-environment to the entitlements plist,
 * but our Apple provisioning profile does not have Push Notifications enabled.
 * This plugin strips it to avoid the Xcode build error:
 *   "Provisioning profile doesn't include the aps-environment entitlement."
 */
const withRemovePushEntitlement = (config) => {
  return withEntitlementsPlist(config, (mod) => {
    delete mod.modResults["aps-environment"];
    return mod;
  });
};

module.exports = withRemovePushEntitlement;
