/**
 * Copyright © Michał Biarda. All rights reserved.
 * See LICENSE.txt for license details.
 */

define([
    'uiComponent',
    'ko',
    'jquery',
    'uiRegistry',
    'Magento_Checkout/js/action/set-payment-information',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Customer/js/model/customer',
    'Magento_Ui/js/model/messageList',
    'mage/translate'
],function (
    Component,
    ko,
    $,
    registry,
    setPaymentInformation,
    quote,
    stepNavigator,
    customer,
    globalMessageList,
    $t
) {
    'use strict';

    function getBillingAddressComponent() {
        return registry.get('checkout.steps.billing-step.payment.beforeMethods.billing-address-form');
    }

    function getSelectedPaymentMethodComponent() {
        if (quote.paymentMethod()) {
            return registry.get('checkout.steps.billing-step.payment.payments-list.' + quote.paymentMethod().method);
        } else {
            return null;
        }
    }

    function afterBillingAddressSet() {
        var selectedPaymentMethodComponent = getSelectedPaymentMethodComponent();
        if (selectedPaymentMethodComponent) {
            setPaymentInformation(globalMessageList, selectedPaymentMethodComponent.getData()).done(function() {
                stepNavigator.next();
            });
        }
    }

    return Component.extend({
        initialize: function () {
            var self = this;
            this._super();
            quote.paymentMethod.subscribe(function () {
                self.errorValidationMessage(false);
            });
        },
        errorValidationMessage: ko.observable(false),
        setBillingInformation: function() {
            // @todo Save payment method!
            if (this.validateBillingInformation()) {
                if (getBillingAddressComponent().isAddressDetailsVisible()) {
                    afterBillingAddressSet();
                } else {
                    getBillingAddressComponent().updateAddress().done(function() {
                        afterBillingAddressSet();
                    });
                }
            }
        },
        validateBillingInformation: function() {
            var loginFormSelector = 'form[data-role=email-with-possible-login]',
                billingAddressFormSelector = '.billing-address-form form',
                billingAddressValidationResult = true,
                emailValidationResult = customer.isLoggedIn();
            if (!quote.paymentMethod()) {
                this.errorValidationMessage(
                    $t('The payment method is missing. Select the payment method and try again.')
                );
                return false;
            }
            if (!customer.isLoggedIn()) {
                $(loginFormSelector).validation();
                emailValidationResult = Boolean($(loginFormSelector + ' input[name=username]').valid());
                if (!getBillingAddressComponent().isAddressDetailsVisible()) {
                    $(billingAddressFormSelector).validation();
                    billingAddressValidationResult = getBillingAddressComponent().validateAddress();
                }
            }
            if (!emailValidationResult) {
                $(loginFormSelector + ' input[name=username]').focus();
                return false;
            }
            if (!billingAddressValidationResult) {
                $(billingAddressFormSelector + ' .field._error:first input').focus();
                return false;
            }
            return true;
        }
    });
});
