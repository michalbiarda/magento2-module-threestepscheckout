define([
    'jquery',
    'Magento_Customer/js/model/customer',
    'Magento_Checkout/js/checkout-data',
    'Magento_Checkout/js/model/address-converter',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/action/create-billing-address',
    'Magento_Checkout/js/action/select-billing-address',
    'Magento_Checkout/js/action/set-billing-address',
    'Magento_Ui/js/model/messageList',
    'uiRegistry'
],
function (
    $,
    customer,
    checkoutData,
    addressConverter,
    quote,
    createBillingAddress,
    selectBillingAddress,
    setBillingAddressAction,
    globalMessageList,
    registry
) {
    'use strict';

    return function (Component) {
        return Component.extend({
            initialize: function() {
                this._super();
                registry.async('checkoutProvider')(function (checkoutProvider) {
                    if (checkoutData.getSelectedBillingAddress() === 'new-customer-billing-address') {
                        var billingAddressData = checkoutData.getNewCustomerBillingAddress();
                        if (billingAddressData) {
                            checkoutProvider.set(
                                'billingAddressshared',
                                $.extend(true, {}, checkoutProvider.get('billingAddressshared'), billingAddressData)
                            );
                        }
                    }
                    checkoutProvider.on('billingAddressshared', function (billingAddressData) {
                        if (checkoutData.getSelectedBillingAddress() === 'new-customer-billing-address') {
                            checkoutData.setNewCustomerBillingAddress(billingAddressData)
                        }
                    });
                });
            },
            initObservable: function () {
                this._super()
                    .observe({
                        isAddressDetailsVisible: this.isAddressSameAsShipping()
                    });
                this.selectedAddress(checkoutData.getSelectedBillingAddress());
                quote.billingAddress.subscribe(function (newAddress) {
                    this.isAddressDetailsVisible(this.isAddressSameAsShipping());
                }, this);
                return this;
            },
            validateAddress: function() {
                this.source.set('params.invalid', false);
                this.source.trigger(this.dataScopePrefix + '.data.validate');
                if (this.source.get(this.dataScopePrefix + '.custom_attributes')) {
                    this.source.trigger(this.dataScopePrefix + '.custom_attributes.data.validate');
                }
                return !this.source.get('params.invalid');
            },
            updateAddress: function () {
                if (this.isAddressSameAsShipping()) {
                    selectBillingAddress(quote.shippingAddress());
                } else {
                    var addressData, newBillingAddress;
                    if (this.selectedAddress() && !this.isAddressFormVisible()) {
                        selectBillingAddress(this.selectedAddress());
                        checkoutData.setSelectedBillingAddress(this.selectedAddress().getKey());
                    } else {
                        addressData = this.source.get(this.dataScopePrefix);

                        if (customer.isLoggedIn() && !this.customerHasAddresses) { //eslint-disable-line max-depth
                            this.saveInAddressBook(1);
                        }
                        addressData['save_in_address_book'] = this.saveInAddressBook() ? 1 : 0;
                        newBillingAddress = createBillingAddress(addressData);

                        // New address must be selected as a billing address
                        selectBillingAddress(newBillingAddress);
                        checkoutData.setSelectedBillingAddress(newBillingAddress.getKey());
                        checkoutData.setNewCustomerBillingAddress(addressData);
                    }
                }
                return this.updateAddresses();
            },
            updateAddresses: function () {
                return setBillingAddressAction(globalMessageList);
            },
            useShippingAddress: function () {
                this._super();
                if (!this.isAddressSameAsShipping()) {
                    checkoutData.setSelectedBillingAddress('new-customer-billing-address');
                }
                return true;
            },
        });
    };
});