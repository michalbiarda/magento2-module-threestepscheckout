/**
 * Copyright © Michał Biarda. All rights reserved.
 * See LICENSE.txt for license details.
 */

var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/view/payment': {
                'MB_ThreeStepsCheckout/js/view/payment-mixin': true
            },
            'Magento_Checkout/js/view/billing-address': {
                'MB_ThreeStepsCheckout/js/view/billing-address-mixin': true
            },
            'Magento_Checkout/js/view/billing-address/list': {
                'MB_ThreeStepsCheckout/js/view/billing-address/list-mixin': true
            },
            'Magento_Checkout/js/model/step-navigator': {
                'MB_ThreeStepsCheckout/js/model/step-navigator-mixin': true
            },
            'Magento_OfflinePayments/js/view/payment/method-renderer/banktransfer-method': {
                'MB_ThreeStepsCheckout/js/view/payment/method-renderer/banktransfer-method-mixin': true
            },
            'Magento_OfflinePayments/js/view/payment/method-renderer/checkmo-method': {
                'MB_ThreeStepsCheckout/js/view/payment/method-renderer/checkmo-method-mixin': true
            }
        }
    },
    map: {
        '*': {
            'Magento_CheckoutAgreements/js/model/agreements-assigner': 'MB_ThreeStepsCheckout/js/model/agreements-assigner',
            'Magento_CheckoutAgreements/js/model/agreement-validator': 'MB_ThreeStepsCheckout/js/model/agreement-validator'
        }
    }
}