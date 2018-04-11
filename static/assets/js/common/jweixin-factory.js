/**
 * Created by JiXu on 2017-02-03.
 */
define(function (require, exports, module) {
    require('jweixin');
    require('sha1');
   //password: 103f31ea7c18bacff4f54ba0b6b2b366
    var defaultConfig={
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp:'1486114945', // 必填，生成签名的时间戳
        nonceStr: ''+new Date().valueOf()+'', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        success: function(res) {
                console.info(res);
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
    };
    function getConfig( extendConfig) {
        var config = {};
        if (!extendConfig) {
            extendConfig = {};
        }

        config=$.extend({}, defaultConfig, extendConfig);
        var nonceStr="jsapi_ticket="+config.jsapi_ticket+"&"
            +"noncestr="+config.nonceStr+"&"
            +"timestamp="+config.timestamp+"&"
            +"url="+config.url;

        config.signature=$.sha1(nonceStr);
        return config;
    }

    exports.config=function (extendConfig) {
        wx.config(getConfig(extendConfig));
        return wx;
    };





});