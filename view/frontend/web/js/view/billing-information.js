define([
    'jquery',
    'ko',
    'uiComponent',
    'uiRegistry',
    'Magento_Checkout/js/model/payment-service',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Checkout/js/model/sidebar'
], function ($, ko, Component, registry, paymentService, quote, stepNavigator, sidebarModel) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'MB_ThreeStepsCheckout/billing-information'
        },
        paymentMethodTitle: ko.observable(''),
        initialize: function() {
            this._super();
            var self = this;
            quote.paymentMethod.subscribe(function(quotePaymentMethod) {
                var selectedPaymentMethod = paymentService.getAvailablePaymentMethods().find(function(paymentMethod) {
                    return paymentMethod.method === quotePaymentMethod.method;
                })
                if (selectedPaymentMethod) {
                    self.paymentMethodTitle(selectedPaymentMethod.title);
                } else {
                    self.paymentMethodTitle('');
                }
            });
        },

        /**
         * @return {Boolean}
         */
        isVisible: function () {
            return stepNavigator.isProcessed('payment');
        },

        /**
         * Back step.
         */
        back: function () {
            sidebarModel.hide();
            stepNavigator.navigateTo('payment');
        },

        /**
         * Back to shipping method.
         */
        backToPaymentMethod: function () {
            sidebarModel.hide();
            stepNavigator.navigateTo('payment', 'checkout-payment-method-load');
        }
    });
});
