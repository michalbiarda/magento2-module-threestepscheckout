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
