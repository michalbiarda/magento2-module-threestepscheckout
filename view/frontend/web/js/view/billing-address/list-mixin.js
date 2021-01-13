/**
 * Copyright © Michał Biarda. All rights reserved.
 * See LICENSE.txt for license details.
 */

define([
    'Magento_Checkout/js/checkout-data',
    'uiRegistry'
],
function (checkoutData, registry) {
    'use strict';

    function getBillingAddressComponent() {
        return registry.get('checkout.steps.billing-step.payment.beforeMethods.billing-address-form');
    }

    function isUndefinedAddress(address) {
        return !address.hasOwnProperty('getKey');
    }

    return function (Component) {
        return Component.extend({
            initObservable: function() {
                this._super();
                this.selectedAddress(this.getSelectedAddress());
                return this;
            },
            getSelectedAddress: function() {
                var key = checkoutData.getSelectedBillingAddress();
                return this.addressOptions.find(function (address) {
                    if (isUndefinedAddress(address)) {
                        if (key === 'new-customer-billing-address') {
                            return true;
                        }
                    } else {
                        return address.getKey() === key;
                    }
                    return false;
                });
            },
            onAddressChange: function (address) {
                this._super(address);
                if (!isUndefinedAddress(address) && address !== this.getSelectedAddress()) {
                    getBillingAddressComponent().updateAddress();
                }
            }
        });
    };
});