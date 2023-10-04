jQuery(function($) {
    "use strict";
    var ajaxurl = '/wp-admin/admin-ajax.php';

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return "";
    }

    function removeCookie(cname) {
        setCookie(cname, '', { expires: -1, path: '/' });
    }


    function getGet() {
        var queryDict = {};
        location.search.substr(1).split("&").forEach(function(item) { queryDict[item.split("=")[0]] = item.split("=")[1] });
        return queryDict;
    }

    var getReq = getGet();

    function parseJson(str) {
        var j;
        try {
            j = JSON.parse(str);
        } catch (e) {
            return false;
        }
        return j;
    }

    function showMessage(message) {
        $('#text-popup').find('.text').html(message);
        _functions.openPopup('#text-popup');

    }

    $(document).bind("ajaxSend", function() {
        //$('.ajax-loader').fadeIn();
        $('body').addClass('is-ajax-load');
    }).bind("ajaxComplete", function() {
        //$('.ajax-loader').fadeOut();
        $('body').removeClass('is-ajax-load');
    });

    if ($('#not-working-popup').length) {
        if (!getCookie('not_working_popup')) {
            _functions.openPopup('#not-working-popup');
            setCookie('not_working_popup', 1);
        }
    } else removeCookie('not_working_popup');

    //-----ACCOUNT----------

    //registration form
    $('#registration-form').on('submit', function(e) {
        var form = $(this);
        var data = form.serializeArray(),
            formData = {};
        data.push({ name: 'action', value: 'register_user' });
        //data.push({name:'nonce', value:psshop_vars.ajax_nonce});
        data.map(function(x) { formData[x.name] = x.value; });
        form.find('[type=submit]').addClass('btn-disabled');
        form.find('.error-message').text('');
        $.post(ajaxurl, formData)
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    if (res.redirect) setTimeout(function() { location.href = res.redirect; }, 100);
                } else {
                    form.find('.error-message').text(response);
                }
                setTimeout(function() { form.find('[type=submit]').removeClass('btn-disabled'); }, 1500);
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus);
            });
        return false;
    });

    //login form
    $('#login-form').on('submit', function(e) {
        var form = $(this);
        var data = form.serializeArray(),
            formData = {};
        data.push({ name: 'action', value: 'login_user' });
        //data.push({name:'nonce', value:psshop_vars.ajax_nonce});
        data.map(function(x) { formData[x.name] = x.value; });
        form.find('[type=submit]').addClass('btn-disabled');
        form.find('.error-message').text('');
        $.post(ajaxurl, formData)
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    if (res.redirect) setTimeout(function() { location.href = res.redirect; }, 100);
                } else {
                    form.find('.error-message').text(response);
                }
                setTimeout(function() { form.find('[type=submit]').removeClass('btn-disabled'); }, 1500);
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus);
            });
        return false;
    });

    //reset password form
    $('#forgot-password-form').on('submit', function(e) {
        var form = $(this);
        var data = form.serializeArray(),
            formData = {};
        data.push({ name: 'action', value: 'lost_password' });
        //data.push({name:'nonce', value:psshop_vars.ajax_nonce});
        data.map(function(x) { formData[x.name] = x.value; });
        form.find('[type=submit]').addClass('btn-disabled');
        form.find('.error-message').text('');
        $.post(ajaxurl, formData)
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    showMessage(res.message);
                } else {
                    form.find('.error-message').text(response);
                }
                setTimeout(function() { form.find('[type=submit]').removeClass('btn-disabled'); }, 1500);
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus);
            });
        return false;
    });

    $('#restore-password-form').on('submit', function(e) {
        var form = $(this);
        var data = form.serializeArray(),
            formData = {};
        data.push({ name: 'action', value: 'change_password' });
        //data.push({name:'nonce', value:psshop_vars.ajax_nonce});
        data.map(function(x) { formData[x.name] = x.value; });
        form.find('[type=submit]').addClass('btn-disabled');
        form.find('.error-message').text('');
        $.post(ajaxurl, formData)
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    showMessage(res.message);
                } else {
                    form.find('.error-message').text(response);
                }
                setTimeout(function() { form.find('[type=submit]').removeClass('btn-disabled'); }, 1500);
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus);
            });
        return false;
    });


    if (getReq && getReq.act && getReq.act == 'rp') {
        _functions.openPopup('#restore-password-popup');
        $('#restore-password-popup').find('[name=key]').val(getReq.key);
        $('#restore-password-popup').find('[name=login]').val(decodeURIComponent(getReq.login));
    }



    $(document).on('click', '.js-edit-address', function() {
        $('#edit-address-form').attr('data-i', $(this).closest('.js-address-item').attr('data-i'));
    });

    $('.js-clear-address-fields').on('click', function() {
        $('#edit-address-form').attr('data-i', '');
    });

    $('#edit-address-form').on('submit', function() {
        let form = $(this),
            count = $('.cabinet_address tbody tr').length,
            i = form.attr('data-i'),
            text = form.attr('data-btn-text'),
            name = form.find('input[name="type_address"]').val(),
            street = form.find('input[name="street"]').val(),
            house = form.find('input[name="number-building"]').val(),
            flat = form.find('input[name="number-apartment"]').val();
        if (i) {
            let item = $('.js-address-item[data-i=' + i + ']');
            item.find('.js-address-name').text(name);
            item.find('.js-street').text(street);
            item.find('.js-house').text(house);
            item.find('.js-apartment').text(flat);
        } else {
            $('.cabinet_address tbody').append(
                '<tr class="js-address-item" data-i="' + count + '">' +
                '    <td>' +
                '        <label class="checkbox-entry">' +
                '            <input type="radio" name="cabinet-address">' +
                '            <span class="js-address-name">' + name + '</span>' +
                '        </label>' +
                '    </td>' +
                '    <td>' +
                '        <div class="cabinet_address-detail">' +
                '            <span class="js-street">' + street + '</span>,' +
                '            <span class="js-house">' + house + '</span> кв.' +
                '            <span class="js-apartment">' + flat + '</span>' +
                '        </div>' +
                '    </td>' +
                '    <td>' +
                '        <button class="link-icon js-edit-address open-popup" data-rel="address" type="button">' + text + '</button>' +
                '    </td>' +
                '    <td>' +
                '        <div class="btn-close"></div>' +
                '    </td>' +
                '</tr>'
            );
        }
        form.closest('.popup-content.active').find('.btn-close.close-popup').click();
        return false;
    });

    $('#user-edit-form').on('submit', function() {
        //    count = $('.cabinet_address tbody tr').length,
        var form = $(this);
        var data = form.serializeArray(),
            addresses = '',
            formData = {};

        $('.cabinet_address tbody tr').each(function() {
            let item = $(this);
            addresses += item.find('[type="radio"]').prop('checked') + '|';
            addresses += item.find('.js-address-name').text() + '|';
            addresses += item.find('.js-street').text() + '|';
            addresses += item.find('.js-house').text() + '|';
            addresses += item.find('.js-apartment').text();
            addresses += '$'
        })
        addresses = addresses.slice(0, -1);

        if (Inputmask.isValid($('.inputmask').val(), { alias: "+38 (099) 999 99 99" }) == false) {
            $('.inputmask').addClass('invalid');
            $(this).attr('aria-invalid', 'true');
            return false;
        } else {
            $('.inputmask').removeClass('invalid');
            $(this).attr('aria-invalid', 'false');
        }

        data.push({ name: 'action', value: 'update_user' });
        data.push({ name: 'addresses', value: addresses });
        //data.push({name:'nonce', value:psshop_vars.ajax_nonce});
        data.map(function(x) { formData[x.name] = x.value; });
        form.find('.btn').addClass('btn-disabled');
        $.post(ajaxurl, formData)
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    showMessage(res.message);
                } else {
                    showMessage(response);
                }
                form.find('.btn').removeClass('btn-disabled');
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
        return false;

    });

    $('#user-edit-password').on('submit', function() {
        var form = $(this);
        var data = form.serializeArray(),
            formData = {};

        data.push({ name: 'action', value: 'update_user_password' });
        //data.push({name:'nonce', value:psshop_vars.ajax_nonce});
        data.map(function(x) { formData[x.name] = x.value; });
        form.find('.btn').addClass('btn-disabled');
        $.post(ajaxurl, formData)
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    form.find('input').val('');
                    showMessage(res.message);
                } else {
                    showMessage(response);
                }
                form.find('.btn').removeClass('btn-disabled');
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
        return false;

    });

    $('.repeat-order').on('click', function() {
        var btn = $(this),
            id = btn.data('id');
        $.post(ajaxurl, {
                action: 'duplicate_order',
                id: id,
                //nonce:psshop_vars.ajax_nonce

            })
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    $('header .order').removeClass('empty').addClass('open-cart').find('.order-item span').text(res.count);
                    $('header .order .price span').text(res.total);
                    if (res.message) {
                        showMessage(res.message);
                    } else
                    if (res.redirect) location.href = res.redirect;
                } else {
                    showMessage(response);
                }
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
        return false;
    });


    //------SHOP------------

    $('.category_ajax').on('click', function() {
        var btn = $(this),
            id = btn.data('id');
        $.post(ajaxurl, {
                action: 'shop_category',
                id: id,
                //nonce:psshop_vars.ajax_nonce
            })
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    $('#shop-ajax-wrapper').html(res.out);
                    btn.closest('li').addClass('active').siblings('li').removeClass('active');
                    _functions.imagesLazyLoad();
                }
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
        return false;
    });

    //fav-btn
    $(document).on('click', '.fav-btn', function() {
        var btn = $(this),
            id = btn.attr('data-id'),
            liked = getCookie('rsshop_liked_products');

        if (liked)
            liked = parseJson(liked);
        else
            liked = [];

        if (!liked) liked = [];

        var position = liked.indexOf(id);
        if (position > -1) {
            liked.splice(position, 1);
            btn.removeClass('active');
        } else {
            liked.push(id);
            btn.addClass('active');
        }
        if (!liked || !liked.length)
            removeCookie('rsshop_liked_products')
        else
            setCookie('rsshop_liked_products', JSON.stringify(liked), 365);
        if (btn.hasClass('btn-close')) btn.closest('.product').parent().remove();
    });

    $(document).on('click', '.add-to-cart-btn, .fast-order', function() {
        console.log('add');
        var btn = $(this),
            id = btn.data('id'),
            wrap = btn.closest('.js-product'),
            qty = parseInt(wrap.find('.product-qty').val()),
            max = parseInt(wrap.find('.product-qty').attr('max')),
            variation_id = '';
        if (wrap.find('.product_variations li.active').length) variation_id = wrap.find('.product_variations li.active').data('id')
        $.post(ajaxurl, {
                action: 'update_cart_product',
                id: id,
                variation_id: variation_id,
                qty: qty,
                key: '',
                fast_order: btn.hasClass('fast-order') ? true : '',
                //nonce:psshop_vars.ajax_nonce

            })
            .done(function(response) {
                var res = parseJson(response);
                console.log(res);
                if (res.success) {
                    if (res.remove_roll_week_isset) {
                        $('.roll_week_free_product').remove();
                    }
                    $('header .order').removeClass('empty').addClass('open-cart').find('.order-item span').text(res.count);
                    $('header .order .price span').text(res.total);
                    wrap.find('.product-qty').val(1);
                    wrap.find('.decrement').click();

                    if(res.total_product_all == res.total){
                        $('.all_price').slideUp();
                    } else{
                        $('.all_price').slideDown();
                    }
                    if (res.count >= 1) {
                        $('.basket-price').removeClass('empty');
                    } else {
                        $('.basket-price').addClass('empty');
                    }
                    $('.header-basket .card-total-price,.cart_bottom .card-total-price').text(res.total);
                    $('.header-basket i span').text(res.count);
                    if (res.redirect) location.href = res.redirect;
                } else {
                    console.log(response);
                    showMessage(response);
                }
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
        return false;
    });

    $(document).on('click', '.add-to-cart-btn-ing, .fast-order-ing', function() {
        var btn = $(this),
            id = btn.data('id'),
            variation_id = btn.data('variation-id'),
            wrap = btn.closest('.ing_footer'),
            qty = parseInt(wrap.find('.product-qty').val()),
            modifiers = '';
        $('#ing_output .ing_control').each(function() {
            modifiers += ($(this).attr('data-id') + '|' + $(this).find('.product-qty').val() + ',');
        });
        modifiers = modifiers.slice(0, -1);
        $.post(ajaxurl, {
                action: 'update_cart_product',
                id: id,
                variation_id: variation_id,
                modifiers: modifiers,
                qty: qty,
                key: '',
                fast_order: btn.hasClass('fast-order-ing') ? true : '',
                //nonce:psshop_vars.ajax_nonce

            })
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    if (res.remove_roll_week_isset) {
                        $('.roll_week_free_product').remove();
                    }
                    $('header .order').removeClass('empty').addClass('open-cart').find('.order-item span').text(res.count);
                    $('header .order .price span').text(res.total);
                    btn.closest('.popup-container').find('.btn-close.close-popup').click();
                    if (res.count >= 1) {
                        $('.basket-price').removeClass('empty');
                    } else {
                        $('.basket-price').addClass('empty');
                    }
                    $('.header-basket .card-total-price,.cart_bottom .card-total-price').text(res.total);
                    $('.header-basket i span').text(res.count);
                    if (res.redirect) location.href = res.redirect;
                } else {
                    showMessage(response);
                }
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
        return false;
    });

    // $(document).on('click','.open-cart', function() {
    //     if($('body').hasClass('woocommerce-checkout')){
    //         return false;
    //     }
    //     var btn = $(this);
    //     btn.addClass('btn-disabled');
    //     $('#cart-popup-out').html('');
    //     $(this).addClass('active');
    //     $.post(ajaxurl, {
    //         action:'get_cart',
    //         //nonce:psshop_vars.ajax_nonce
    //     })
    //         .done(function (response) {
    //             var res = parseJson(response);
    //             if (res.success) {
    //                 $('#cart-popup-out').html(res.out);
    //                 $('.cart').addClass('active');
    //                 _functions.removeScroll();
    //             } else {
    //                 showMessage(response);
    //             }
    //             btn.removeClass('btn-disabled');
    //         })
    //         .fail(function (jqXHR, textStatus, error) {
    //             showMessage(textStatus, true);
    //         });
    // });

    // $(".header-basket").on({
    //     mouseenter: function () {
    //         if($('body').hasClass('woocommerce-checkout')){
    //             return false;
    //         }
    //         // var btn = $('.header-basket');
    //         // btn.addClass('btn-disabled');
    //         // $('#cart-popup-out').html('');
    //         $(this).addClass('active');
    //         $.post(ajaxurl, {
    //             action:'get_cart',
    //         })
    //             .done(function (response) {
    //                 var res = parseJson(response);
    //                 if (res.success) {
    //                     $('#cart-popup-out').html(res.out);
    //                     $('.cart').addClass('active');
    //                     // _functions.removeScroll();
    //                 } else {
    //                     showMessage(response);
    //                 }
    //                 // btn.removeClass('btn-disabled');
    //             })
    //             .fail(function (jqXHR, textStatus, error) {
    //                 showMessage(textStatus, true);
    //             });

    //             console.log('mouseenter');
    //     },
    //     mouseleave: function () {
    //         // var btn = $('.header-basket');
    //         // btn.removeClass('btn-disabled');
    //         $(this).removeClass('active');
    //         $('.cart').removeClass('active');
    //         console.log('mouseleave');
    //     }
    // });

    $(document).on('click', '.open-cart:not(.active)', function() {
        if ($('body').hasClass('woocommerce-checkout')) {
            return false;
        }
        var btn = $(this);
        btn.addClass('btn-disabled');
        $('#cart-popup-out').html('');
        $(this).addClass('active');
        $('html').addClass('overflow-menu');
        $.post(ajaxurl, {
                action: 'get_cart',
                //nonce:psshop_vars.ajax_nonce
            })
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    $('#cart-popup-out').html(res.out);
                    $('.cart').addClass('active');
                    _functions.removeScroll();
                } else {
                    showMessage(response);
                }
                btn.removeClass('btn-disabled');
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
    });

    $(document).on('click', '.open-cart.active', function() {
        $(this).removeClass('active');
        $('.cart').removeClass('active');
        $('html').removeClass('overflow-menu');
        _functions.addScroll();
    });

    function update_things_checkout(cost_appliances_def, count, free_thing) {

        let curent_count = $('.count_things').val() ? $('.count_things').val()  : 0;

        var count_things = [];
        var num = $('.count_things option').length;
        if (free_thing) $('select.count_things').attr('data-things-free', free_thing);
        for (var i = num; i >= 1; i--) {
            $('select.count_things')[0].sumo.remove(i - 1);
            count_things.push(i);
        }

        var count_start = parseInt(cost_appliances_def);
        $.each(count_things, function(key, value) {
            key = key + 1;
            if (free_thing < key) {
                $('select.count_things')[0].sumo.add(key, key + ' +' + count_start + ' грн');
                count_start += parseInt(cost_appliances_def);
            } else {
                $('select.count_things')[0].sumo.add(key);
            }
        });

        console.log(curent_count);
       /* update_things_study();
        $('select.count_things')[0].sumo.reload();
        $('select.count_things')[0].sumo.selectItem(0);*/
        setTimeout(function() {
      
            $('select.count_things')[0].sumo.reload();
            $('select.count_things')[0].sumo.selectItem(curent_count);
        }, 300);

       
    }


    function update_things_study(){
        var num = $('.noobs option').length,
            curent_count = $('.count_things_study').val() ? $('.count_things_study').val() : 0;
        for (var i = num; i >= 1; i--) {
            $('select.noobs')[0].sumo.remove(i - 1);
        }

        var val_option = $('select.count_things').val();
        $('.count_things').attr('data-things-count', val_option);

        var name_thing = $('.count_things_study').attr('data-placeholder');

        $('select.noobs')[0].sumo.add(name_thing);
        for (let i = 0; i <= val_option; i++) {
            $('select.noobs')[0].sumo.add(i);
        }
        setTimeout(function() {
            $('select.noobs')[0].sumo.reload();
            $('select.noobs')[0].sumo.disableItem(0);
            $('select.noobs')[0].sumo.selectItem(curent_count);
            /*$('.count_things_study_wrapper').find('.CaptionCont span').html(name_thing);
            $('.count_things_study').attr('data-things-study-count', 0);*/
            if( curent_count == 0 ){
                $('.count_things_study_wrapper').find('.CaptionCont span').html(name_thing);
            }
        }, 300);
    }


    $(document).on('change', 'select.count_things', function() {
        update_things_study();
        calculateTotalCheckout();
    });


    $(document).on('change', 'select.count_things_study', function() {
        var val_option = $(this).val();
        $('.count_things_study').attr('data-things-study-count', val_option);
    });

    $(document).on('change', '#self_delivery_date_change', function() {
      checkLiqPayTime();
    });
    function checkLiqPayTime() {
        var self_delivery_date = $('#self_delivery_date_change').val();
       // Отримуємо сьогоднішню дату
       var currentDate = new Date();
       var day = currentDate.getDate();
       var month = currentDate.getMonth() + 1; 
       var year = currentDate.getFullYear();       
       var formattedCurrentDate = (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;
       if (formattedCurrentDate === self_delivery_date) {
         $('.checkbox-entry-wrap.payment_method_liqpay').show();
       } else if (!self_delivery_date) {
            $('.checkbox-entry-wrap.payment_method_liqpay').show();
       } else if(formattedCurrentDate !== self_delivery_date){
          setTimeout(() => {
              if ($('.toggle-block.local_visible').is(':visible')) {
                     $('#payment_method_cod').prop('checked', true);
                     $('.checkbox-entry-wrap.payment_method_liqpay').hide();
                 }
             }, "500");
       }
    }
    
    function check_delivery_method(currentPrice) {
        console.log($('input[name=delivery_method]:checked').val());
        if ($('input[name=delivery_method]:checked').val() == 'local_pickup') {
            if ($('input[name="at_time"]').is(':checked')) {
                $('.local_visible').css('display', 'block');
            }

            //$('#apply-coupon').parent().slideUp();

            // var currentPrice = $('.all-product-price-el').attr('data-total');
            if (currentPrice < 300) {
                $('.deliveryWarning .errorMsg.noPriceRoll').slideDown(350);
            } else {
                $('.deliveryWarning .errorMsg.noPriceRoll').slideUp(350);
            }
            // $('.main-order-button').removeClass('disabled');
        } else{
            //$('#apply-coupon').parent().slideDown();
            $('.apply_coupon_success').css('display', 'none');
        }
        if($('#all-products-discount').attr('data-discount') != 0 || $('.checkout-products').find('.product-gift').length > 0){
            $("html, body").animate({ scrollTop: 0 }, 600);
        }
    }

    $(document).on('change', '#select_point', function() {
        var val_select = $(this).val();
        var address_payment_methods = [];
        var all_payment_methods = $('.payment-entry-wrap').length;
        if(val_select) {
            $('.deliveryWarning .errorMsg.select_point').slideUp(350);
        } else {
            $('.deliveryWarning .errorMsg.select_point').slideDown(350);
        }
        if(val_select == 1) {
            address_payment_methods = address_payment.payments.vh;
        } else {
            address_payment_methods = address_payment.payments.vv;
        }
        
        $('[name="payment_method"]').each(function(){
            if(address_payment_methods.includes($(this).attr('data-rel'))) {
                $(this).closest('.payment-entry-wrap').removeClass('hidden');
            } else {
                $(this).closest('.payment-entry-wrap').addClass('hidden');
            }
        });

        if( $('.payment-entry-wrap.hidden [name="payment_method"]:checked').length && all_payment_methods != $('.payment-entry-wrap.hidden').length ) {
            var change_active = false;
            $('.payment-entry-wrap [name="payment_method"]').each(function(){
                if($(this).closest('.payment-entry-wrap').hasClass('hidden') || change_active) {
                    $(this).removeAttr('checked');
                } else {
                    $(this).attr('checked', true);
                    change_active = true;
                }
            });
            $('#text-popup').find('.text').html(address_payment.message.change);
            _functions.openPopup('#text-popup');
        }

        if(all_payment_methods == $('.payment-entry-wrap.hidden').length) {
            $('#text-popup').find('.text').html(address_payment.message.empty);
            _functions.openPopup('#text-popup');
        }
        checkLiqPayTime();
        calculateTotalCheckout();
    });

    function update_cart_product(btn) {
        var key = btn.data('key'),
            wrap = btn.closest('.js-product'),
            qtyInput = wrap.find('.product-qty'),
            qty = parseInt(qtyInput.val()),
            is_inc = btn.hasClass('increment'),
            prod_things_count_all = 0;

        if (!btn.hasClass('product-qty')) {
            if (qty === 1 && !is_inc) {
                return;
            }
            if (qty >= parseInt(qtyInput.attr('max')) && is_inc) {
                return;
            }
            qty = is_inc ? qty + 1 : qty - 1;
        }

        qtyInput.attr('value', qty);

        var free = 0;
        jQuery('.checkout-products .prod_horiz').each(function(index, el) {
            var thisel = jQuery(this);
            var prod_total_things_free = parseInt(thisel.attr('data-things'));
            var quantity = parseInt(thisel.find('.product-qty').attr('value'));
            free += prod_total_things_free * quantity;
        });


        $.post(ajaxurl, {
                action: 'update_cart_product',
                qty: qty,
                key: key,
                prod_things_count_all: free,
                delivery_method: $('input[name="delivery_method"]:checked').val(),
                is_inc: is_inc
                    //nonce:psshop_vars.ajax_nonce
            })
            .done(function(response) {
                var res = parseJson(response);
                //console.log(res);
                if (res.success) {
                    if (res.remove_roll_week_isset) {
                        $('.roll_week_free_product').remove();
                    }
                    if (res.cart_items) {
                        $('.checkout-products').html(res.cart_items);
                    }
                    $('.count_things').attr('data-things-count', 1);

                    if (res.count >= 1) {
                        $('.basket-price').removeClass('empty');
                    } else {
                        $('.basket-price').addClass('empty');
                        $('#cart-submit').addClass('disable');
                        location.reload();
                    }

                    // count_things
                    if ($('body').hasClass('woocommerce-checkout')) {
                        update_things_checkout(res.cost_appliances_def, res.count, res.free_thing);
                    }

                    if(res.total_product_all == res.total){
                        $('.all_price').slideUp();
                    } else{
                        $('.all_price').slideDown();
                    }
                    $('.all_price .all-product-price-el-all').text(res.total_product_all);

                    $('.header-basket .card-total-price,.cart_bottom .card-total-price').text(res.total);
                    $('.header-basket i span').text(res.count);

                    $('.prod_horiz[data-key=' + key + ']').find('b.price').text(res.line_total);
                    $('.prod_horiz[data-key=' + key + ']').find('.product-qty').val(qty);
                    $('#all-products-discount, .all-products-discount').text(res.discount).attr('data-discount', res.discount);
                    $('.all-product-price-el').text(res.total).attr('data-total', res.total);
                    calculateTotalCheckout();
                    check_delivery_method(res.total);

                } else {
                    showMessage(response);
                }

            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus);
            });
    }

    $(document).on('click', '.cart-product .decrement, .cart-product .increment', function() {
        update_cart_product($(this));
    });

    $(document).on('change', '.cart-product .product-qty', function() {
        update_cart_product($(this));
    });

    $(document).on('click', '.remove-product', function(e) {
        e.preventDefault();
        var btn = $(this),
            key = btn.data('key'),
            wrap = btn.closest('.js-product');

        var free = 0;
        $('.prod_horiz[data-key=' + key + ']').remove();
        jQuery('.checkout-products .prod_horiz').each(function(index, el) {
            var thisel = jQuery(this);
            var prod_total_things_free = parseInt(thisel.attr('data-things'));
            var quantity = parseInt(thisel.find('.product-qty').attr('value'));
            free += prod_total_things_free * quantity;
        });

        if (!key) return false;
        $.post(ajaxurl, {
                action: 'remove_cart_product',
                key: key,
                prod_things_count_all: free,
                delivery_method: $('input[name="delivery_method"]:checked').val()
                    //nonce:psshop_vars.ajax_nonce
            })
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    if (res.cart_items) {
                        $('.checkout-products').html(res.cart_items);
                    }

                    if(res.total_product_all == res.total){
                        $('.all_price').slideUp();
                    } else{
                        $('.all_price').slideDown();
                    }
                    $('.all_price .all-product-price-el-all').text(res.total_product_all);
                    $('.count_things').attr('data-things-count', 1);
                    // count_things
                    if ($('body').hasClass('woocommerce-checkout')) {
                        update_things_checkout(res.cost_appliances_def, res.count, res.free_thing);
                    }

                    if (res.count >= 1) {
                        $('.basket-price').removeClass('empty');
                    } else {
                        $('.basket-price').addClass('empty');
                        $('#cart-submit').addClass('disable');
                        location.reload();
                    }

                    $('.header-basket .card-total-price,.cart_bottom .card-total-price').text(res.total);
                    $('.header-basket i span').text(res.count);



                    $('.all-product-price-el').text(res.total).attr('data-total', res.total);
                    $('#all-products-discount, .all-products-discount').text(res.discount).attr('data-discount', res.discount);
                    calculateTotalCheckout();
                    check_delivery_method(res.total);
                    var popupOut = $('#cart-popup-out, .checkout-products');
                    if (popupOut.length && !popupOut.find('.prod_horiz').length) {
                        $('header .order').addClass('empty').removeClass('open-cart');
                        $('.cart_bottom').remove();
                        $('.cart-empty-message').show();
                        // $('#cart-submit').addClass('disable');
                    }
                } else {
                    showMessage(response);
                }
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus);
            });
    });

    $(document).on('click', '.thumb-input-number .decrement:not(.in-cart), .thumb-input-number .increment:not(.in-cart)', function() {
        var btn = $(this),
            wrap = btn.closest('.js-product,.ing_control,.ing_footer-controls, .js-checkout-product'),
            qtyInput = wrap.find('.product-qty'),
            qty = parseInt(qtyInput.val()),
            max = parseInt(qtyInput.attr('max')),
            min = parseInt(qtyInput.attr('data-min')),
            is_inc = btn.hasClass('increment');
        if (min !== 0 && !min) min = 1;
        if (qty === min && !is_inc) return;
        if (max && qty >= max && is_inc) return;
        qty = is_inc ? qty + 1 : qty - 1;
        qtyInput.val(qty);

        if (!wrap.hasClass('ing_footer-controls'))
            _functions.calculateSinglePrice(wrap);

        if (wrap.hasClass('ing_control') || wrap.hasClass('ing_footer-controls'))
            _functions.calculateIngredientsPrice();

        calculateTotalCheckout();
    });

    $(document).on('click', '.product_plus', function() {
        var btn = $(this),
            id = btn.data('id'),
            wrap = btn.closest('.js-product'),
            qty = parseInt(wrap.find('.product-qty').val()),
            variation_id = '';
        if (wrap.find('.product_variations li.active').length) variation_id = wrap.find('.product_variations li.active').data('id')
        btn.addClass('btn-disabled');
        $.post(ajaxurl, {
                action: 'get_modifiers',
                id: id,
                variation_id: variation_id,
                //nonce:psshop_vars.ajax_nonce

            })
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    $('.ing-out').html(res.out);
                    $('.ing-popup').find('.product-qty').val(qty);
                    _functions.calculateIngredientsPrice();
                    _functions.openPopup('.ing-popup');
                } else {
                    showMessage(response);
                }
                btn.removeClass('btn-disabled');
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
        return false;
    });

    $('#apply-coupon').on('click', function() {
        var btn = $(this),
            code = btn.siblings('input').val(),
            deliveryPriceInput = $('#all-products-delivery:visible'),
            deliveryPrice = 0;

        $('.apply_coupon_error').addClass('is_empty').removeClass('is_success');
        if (deliveryPriceInput.length) {
            deliveryPrice = parseFloat(deliveryPriceInput.text());
        }
        $.post(ajaxurl, {
                action: 'apply_coupon',
                code: code,
                delivery_method: $('input[name="delivery_method"]:checked').val()
                    //nonce:psshop_vars.ajax_nonce
            })
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    if (res.cart_items) {
                        $('.checkout-products').html(res.cart_items);
                    }
                    $('.header-basket .card-total-price,.cart_bottom .card-total-price').text(res.total);
                    $('header .order .price span').text(res.total);
                    $('.cart-total span').text(+res.total + deliveryPrice).data('total', +res.total + deliveryPrice);
                    $('#all-products-discount, .all-products-discount').text(res.discount).attr('data-discount', res.discount);
                    $('.all-product-price-el').text(res.total).attr('data-total', res.total);
                    calculateTotalCheckout();
                    $('.price-discount').slideDown();
                    btn.siblings('input').val('');
                    $('.apply_coupon_error').removeClass('is_empty').addClass('is_success');
                    $('.apply_coupon_error').text(res.text);
                    $('.apply_coupon_success .name_coupon').text(code);
                    $('.apply_coupon_success').removeClass('is_empty');

                    if(res.total_product_all == res.total){
                        $('.all_price').slideUp();
                    } else{
                        $('.all_price').slideDown();
                    }

                } else {
                    $('.apply_coupon_error').removeClass('is_empty');
                    $('.apply_coupon_error').text(res.text);
                }
                setTimeout(function() {
                    $('.apply_coupon_error').text('');
                }, 3000);
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
        return false;
    });

    $(document).on('click', '.remove_coupon', function(e) {
        e.preventDefault();

        var name_coupon = $('.name_coupon').text();
        var birthday_key = [];
        $('.birthday_product').each(function() {
            var key_prod = $(this).attr('data-key');
            birthday_key.push({ key: key_prod });
        });
        //console.log(birthday_key);

        $.post(ajaxurl, {
                action: 'remove_coupon',
                code: name_coupon,
                birthday_key: birthday_key,
                //nonce:psshop_vars.ajax_nonce
            })
            .done(function(response) {
                var res = parseJson(response);
                //console.log(res);
                if (res.success) {
                    $('.birthday_product').remove();
                    $('.apply_coupon_success').addClass('is_empty');
                    if (res.cart_items) {
                        $('.checkout-products').html(res.cart_items);
                    }
                    $('.header-basket .card-total-price,.cart_bottom .card-total-price').text(res.total);
                    $('header .order .price span').text(res.total);
                    $('.cart-total span').text(res.total).data('total', +res.total);
                    $('#all-products-discount, .all-products-discount').text(0).attr('data-discount', 0);
                    $('.all-product-price-el').text(res.total).attr('data-total', res.total);
                    calculateTotalCheckout();

                    if (res.discount != 0) {
                        $('#all-products-discount, .all-products-discount').text(res.discount).attr('data-discount', res.discount);
                        $('.price-discount').slideDown();
                    } else {
                        $('.price-discount').slideUp();
                    }

                    $('.apply_coupon_error').removeClass('is_empty').addClass('is_success');
                    $('.apply_coupon_error').text(res.text);

                    if(res.total_product_all == res.total){
                        $('.all_price').slideUp();
                    } else{
                        $('.all_price').slideDown();
                    }

                } else {
                    $('.apply_coupon_error').removeClass('is_empty');
                    $('.apply_coupon_error').text(res.text);
                }
                setTimeout(function() {
                    $('.apply_coupon_error').text('');
                }, 3000);
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus, true);
            });
    });



    // chekout form
    $('#checkout-form').on('submit', function(e) {
        var form = $(this);
        var is_false = false;

        $('#checkout-form .user-form .input[required]').each(function() {
            if ($(this).val().trim()) {
                $(this).removeClass('invalid');
            } else {
                $(this).addClass('invalid');
            }
        });

        // console.log('Inputmask', Inputmask.isValid($(this).val()));
        // console.log('value', $(this).val());

        var first_name = $('input[name="first_name"]').val();
        if(first_name == ''){
            is_false = true;
            $('input[name="first_name"]').addClass('invalid');
            $('.errorMsg.empty-name').slideDown(350);
        } else{
            $('input[name="first_name"]').removeClass('invalid');
            $('.errorMsg.empty-name').slideUp(350);
        }


        if (Inputmask.isValid($('.input.user-phone').val(), { alias: "+38 (099) 999 99 99" }) == false) {
            is_false = true;
            $('.user-phone').addClass('invalid');
            $(this).attr('aria-invalid', 'true');
            $('.errorMsg.empty-phone').slideDown(350);
            // $('.main-order-button').addClass('disabled')
        } else {
            $('.user-phone').removeClass('invalid');
            $(this).attr('aria-invalid', 'false');
            $('.errorMsg.empty-phone').slideUp(350);
            // $('.main-order-button').removeClass('disabled')
        }

        if ( $('[name="at_time"]').is( ':checked' ) && ( ! $('[name="self_delivery_date"]').val() || ! $('[name="self_delivery_time"]').val() ) ) {
            is_false = true;
            $('[name="self_delivery_date"]').addClass('invalid');
            $('[name="self_delivery_time"]').next().addClass('invalid');
            $('.errorMsg.empty-delivery-date').slideDown(350);
        } else {
            $('[name="self_delivery_date"]').removeClass('invalid');
            $('[name="self_delivery_time"]').next().removeClass('invalid');
            $('.errorMsg.empty-delivery-date').slideUp(350);
        }

        if ($("#checkout-form .user-form .input").hasClass('invalid')) {
            $('.btn-loader').css('display', 'none');
            $('html, body').animate({
                scrollTop: ($("#checkout-form .input.invalid").offset().top) - 175
            }, 500);
            return false;
        }

        var things_count = $('.count_things').attr('data-things-count');
        var things_count_study = $('.count_things_study').attr('data-things-study-count');
        var local_pickup_bonus = '';
        $('.form-group #driveDelivery').each(function() {
            if ($(this).val() == 'local_pickup') {
                local_pickup_bonus = $(this).attr('data-surprice');
            }
        });


        var things_count_study = $('.count_things_study').attr('data-things-study-count');
        var checkt_type_time = $('input[name="at_time"]:checked').val();
        if (checkt_type_time == 'at_time') {
            if (!$('input[name="self_delivery_date"]').val()) {
                $('input[name="self_delivery_date"]').addClass('invalid');
                return false;
            } else {
                $('input[name="self_delivery_date"]').removeClass('invalid');
            }
        }


        var order_time_delivery = $('#map').attr('data-current-time-delivery');
        var select_point = $('#select_point').val();
        
        var self_delivery_address = '', self_delivery_time = '', self_delivery_time_value = '';
        if ($('input[name=delivery_method][value=local_pickup]').is(':checked')) { 
            self_delivery_address = $("select[name='select_point'] option:selected").index();
            //console.log(self_delivery_address);
            
            if(self_delivery_address == 0){
                $('.sumo_select_point').addClass('invalid');
                is_false = true;
            } else{
                $('.sumo_select_point').removeClass('invalid');
            }
            
        }

        //console.log(is_false)

        if (is_false) {
            $('.main-order-button').removeClass('is-loader');
            return false;
        }

        var data = form.serializeArray(),
            formData = {};
        data.push({ name: 'action', value: 'create_order' });
        data.push({ name: 'things_count', value: things_count });
        data.push({ name: 'things_count_study', value: things_count_study });
        data.push({ name: 'local_pickup_bonus', value: local_pickup_bonus });
        data.push({ name: 'order_time_delivery', value: order_time_delivery });
        data.push({ name: 'select_point', value: select_point });
        data.push({ name: 'utm_mark', value: getCookie('utm_mark') });
        data.push({ name: 'zone', value: $('[data-current-zone-type]').length ? $('[data-current-zone-type]').attr('data-current-zone-type') : '' });
        //data.push({name:'nonce', value:psshop_vars.ajax_nonce});
        data.map(function(x) { formData[x.name] = x.value; });

        // console.log(formData);
        // return false;

        $('.main-order-button').addClass('loading');
        let loader = '<span class="btn-loader"><span class="btn-loader-inner"><span></span><span></span><span></span></span></span>',
            success = '<span class="btn-loader-complete"></span>';

        $('.main-order-button').append(loader).find('.btn-loader').fadeIn(500, function() {});



        $.post(ajaxurl, formData)
            .done(function(response) {
                var res = parseJson(response);
                if (res.success) {
                    if (res.payment_url) {
                        location.href = res.payment_url;
                    } else
                    if (res.key) {
                        let url = location.href;
                        if(url.includes('?')){
                            location.href = url + '&key=' + res.key + getCookie('utm_mark');
                        }else{
                            location.href = url + '?key=' + res.key + getCookie('utm_mark');
                        }
                    }
                } else {
                    // showMessage(response);
                }
            })
            .fail(function(jqXHR, textStatus, error) {
                showMessage(textStatus);
            });
        return false;
    });

    $(document).on('change', 'input[name=delivery_method]', function(e) {
        $('.cart-product .product-qty').first().change();
        calculateTotalCheckout();
    });

    $('#checkout-form input, #checkout-form textarea').on('keypress', function(e) {
        let code = e.keyCode || e.which;
        if (code === 13) {
            e.preventDefault();
        }
    });


    function calculateTotalCheckout(delay) {
        // Enable LIQPAY
        //$('#payment_method_liqpay').closest('.checkbox-entry-wrap').show();
        checkLiqPayTime()
        let form = $('#checkout-form');
        if (!form.length) return;
        if ($('input[name=delivery_method][value=courier]').is(':checked')) {
            _functions.startSteps();
        }else{
            $('[name="select_point"]').closest('.sumoselect-point').show();
            if( !$('[name="at_time"]').is(':checked') && $('[name="select_point"]').val() ){
                $('.main-order-button').removeClass('disabled');
            }
        }
        setTimeout(function() {
            var thingsPrice = parseFloat($('.count_things').attr('data-things-price'));
            var thingsPrice = parseFloat($('.count_things').attr('data-things-price'));
            var thingsCount = parseInt($('.count_things').attr('data-things-count'));
            var thingsFree = parseInt($('.count_things').attr('data-things-free'));
            // var cart_count = parseInt($('.header-basket i span').text());
            // if(cart_count < thingsFree){
            //     cart_count = thingsFree;
            // }

            var thingsPriceTotal = 0;
            if (thingsCount - thingsFree >= 1) {
                var thingsPriceTotal = (thingsCount - thingsFree) * thingsPrice;
            }

            if (thingsPriceTotal != 0) {
                // console.log('if');
                $('.main-order-wrapp .thingsPriceTotal').removeClass('hidden');
                $('.main-order-wrapp .thingsPriceTotal b').html(thingsPriceTotal);
            } else {
                $('.main-order-wrapp .thingsPriceTotal').addClass('hidden');
            }

            let totalSpan = $('.all-product-price-el'),
                total = parseFloat(totalSpan.attr('data-total')),
                delivery = parseFloat($('#all-products-delivery:visible').text()),
                deliveryDiscountPercent = parseFloat($('input[name=delivery_method]:checked').attr('data-discount-percent')),
                discount = parseFloat($('#all-products-discount').attr('data-discount')),
                newTotal = total + (delivery ? delivery : 0) + thingsPriceTotal - (deliveryDiscountPercent ? deliveryDiscountPercent / 100 * total : 0);


            form.find('[required]:not(:visible)').each(function() {
                $(this).prop('disabled', true);
            })
            form.find('[required]:visible').each(function() {
                $(this).prop('disabled', false);
            })

            totalSpan.text(newTotal);

            if (deliveryDiscountPercent) {
                $('#all-products-discount, .all-products-discount').text(discount + deliveryDiscountPercent / 100 * total);
                $('.price-discount').slideDown(100);
            } else {
                if (discount) {
                    //console.log('1');
                    $('#all-products-discount, .all-products-discount').text(discount);
                    $('.price-discount').slideDown(100);
                } else {
                    //console.log('2');
                    $('.price-discount').slideUp(100);
                }
            }

            $('input[name=delivery_method]').each(function() {
                let minAmount = $(this).attr('data-min-amount');
                if (minAmount && parseFloat(minAmount) > newTotal)
                    $(this).prop('disabled', true);
                else
                    $(this).prop('disabled', false);
            });

            $('.ajax-loader').fadeOut(0);

        }, delay ? delay : 350)
    }
    calculateTotalCheckout(1);

    $(document).on('change', '[name="at_time"]', function(){
        calculateTotalCheckout();
    });

    /* DELAY CHECKOUT POPUP */
    if ( $('body').hasClass('page-template-page-checkout') && $('#checkout-form').length ) {
        //setTimeout( delay_on_checkout, $('#hard-time').attr('data-time') );
        
        inactivityTime();
    }

    function delay_on_checkout() {
        if ( /*getCookie('delay-one-minute') ||*/ $('.popupWrapper').hasClass('active') ) {
            return false;
        }

        var name = $('#checkout-form [name="first_name"]').val();
        var tel = $('#checkout-form [name="phone"]').val();

        $('#hard-time [name="your-name"]').val(name);
        $('#hard-time [name="your-phone"]').val(tel);

        _functions.openPopup('#hard-time');
        if ( typeof dataLayer !== "undefined" ) {
            dataLayer.push( { 'event' : 'view_call_back' } );
        }
    }

    function inactivityTime() {
        var time;
        
        // events
        window.onload = resetTime;
        window.onclick = resetTime;
        window.onkeypress = resetTime;
        window.ontouchstart = resetTime;
        window.onmousemove = resetTime;
        window.onmousedown = resetTime;
        window.addEventListener('scroll', resetTime, true);

        function alertUser() {
            delay_on_checkout();
        }

        function resetTime() {
            clearTimeout(time);
            time = setTimeout(alertUser, $('#hard-time').attr('data-time') );
        }

    };

    if( location.search.indexOf('yclid') !== -1 && location.search.indexOf('key=wc_order_') === -1 ) {
        if( getCookie('utm_mark') != '' ) {
            if( location.search.indexOf(getCookie('utm_mark').substr(1)) !== -1 ) {
                return false;
            }
        }
        var utm_mark = location.search.replace('?', '&');
        setCookie('utm_mark', utm_mark, 30);
    }
     
     if( location.search.indexOf('key=wc_order_') !== -1 && getCookie('utm_mark') != '' ) {
        removeCookie('utm_mark');
     }
     
});