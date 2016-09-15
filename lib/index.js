'use strict';

var integration = require('@segment/analytics.js-integration');

var Rubicon = module.exports = integration('Rubicon')
.option('pid', '')
.option('conversionId', '')
.option('conversionEvents', '');

Rubicon.prototype.page = function (page) {
    var data = {
        data: {
            pt: 'Home'
        },
        pid: this.options.pid || '',
        puid2: page.userId() || page.track(page.event()).username() || ''
    };

    this.fireTrackingPixel(data);    
};

Rubicon.prototype.track = function (track) {
    var data = {
        quantity: 1,
        conversion_id: this.options.conversionId,
        order_id: track.userId() + '_' + (new Date()).getTime(),
        u1: track.userId() || track.username() || '',
        u2: track.properties().item_barcode || track.sku() || '',
        u5: track.event().split(' ').join('_').toLowerCase() || '',
        sku: track.sku() || ''
    };
    this.fireConversionPixel(data);
};

Rubicon.prototype.fireTrackingPixel = function (data) {
    window.__cho__ = data;

    (function() {
        var c = document.createElement('script');
        c.type = 'text/javascript';
        c.async = true;
        c.src = document.location.protocol + '//cc.chango.com/static/o.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(c, s);
    })();
};

Rubicon.prototype.fireConversionPixel = function (data) {
    window.__chconv__ = data;

    (function() {
        var e = encodeURIComponent; 
        var p = [];
        for(var i in __chconv__) {
            p.push(e(i) + '=' + e(__chconv__[i]))
        }

        (new Image()).src = document.location.protocol + '//as.chango.com/conv/i;' + (new Date()).getTime() + '?' + p.join('&');
    })();
};

