jQuery(function($){$(document).ready(function(){"use strict";var ajaxurl='/wp-admin/admin-ajax.php';});$('.main-order-button').click(function(){fbq('track','Purchase',{currency:"UAH",value:$('.all-product-price-el').data('total')});});$('.add-to-cart-btn').click(function(){fbq('track','AddToCart',{content_ids:[$(this).data('id')],content_type:'product',value:$(this).parent().find('b.price').text(),currency:'UAH'});});});