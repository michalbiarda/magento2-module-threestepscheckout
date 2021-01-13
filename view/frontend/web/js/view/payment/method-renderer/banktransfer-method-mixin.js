/**
 * Copyright © Michał Biarda. All rights reserved.
 * See LICENSE.txt for license details.
 */

define([], function () {
    'use strict';

    return function (Component) {
        return Component.extend({
            defaults: {
                template: 'MB_ThreeStepsCheckout/payment/banktransfer'
            }
        });
    };
});
