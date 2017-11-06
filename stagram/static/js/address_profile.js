$(function () {
    var oExports = {
        initialize: fInitialize,
        // 渲染更多数据
        renderMore: fRenderMore,
        // 请求数据
        requestData: fRequestData,
        // 简单的模板替换
        tpl: fTpl
    };
    // 初始化页面脚本
    oExports.initialize();

    function fInitialize() {
        var that = this;
        // 常用元素
        that.listEl = $('div.js-image-list');
        // 初始化数据
        that.page = 1;
        that.pageSize = 10;
        that.listHasNext = true;
        // 绑定事件
        $('.js-load-more').on('click', function (oEvent) {
            //alert('执行onclick')
            var oEl = $(oEvent.currentTarget);
            var sAttName = 'data-load';
            // 正在请求数据中，忽略点击事件
            if (oEl.attr(sAttName) === '1') {
                return;
            }
            // 增加标记，避免请求过程中的频繁点击
            oEl.attr(sAttName, '1');
            that.renderMore(function () {
                // 取消点击标记位，可以进行下一次加载
                oEl.removeAttr(sAttName);
                // 没有数据隐藏加载更多按钮
                !that.listHasNext && oEl.hide();
            });
        });
    }

    function fRenderMore(fCb) {
        //alert('执行rendermore')
        var that = this;
        // 没有更多数据，不处理
        if (!that.listHasNext) {
            return;
        }
        that.requestData({
            page: that.page + 1,
            pageSize: that.pageSize,
            call: function (oResult) {
                //alert(oResult)
                // 是否有更多数据
                that.listHasNext = !!oResult.has_next && (oResult.address || []).length > 0;
                // 更新当前页面
                that.page++;
                // 渲染数据
                var sHtml = '';
                $.each(oResult.address, function (nIndex, oImage) {
                    sHtml_1 = that.tpl([
                        '<article class="mod">',
                            '<header class="mod-hd">',
                                '<time class="time">#{view_price}￥</time>',
                                '<div class="profile-info">',
                                    '<a title="#{shop_name}" href="">#{shop_name}</a>',
                                '</div>',
                            '</header>',
                            '<div class="mod-bd">',
                                '<div class="img-box">',
                                    '<a href="#{comment_url}">',
                                        '<img src="#{pic_url}">',
                                    '</a>',
                                '</div>',
                            '</div>',
                            '<div class="mod-ft clearfix">',
                                '<ul class="discuss-list js-discuss-list" id="ul">',
                                    '<li  class="more-discuss">',
                                        '<a href="#{comment_url}">',
                                            '<span>#{goods_title}</span></a>',
                                            '<br>',
                                            '<span>#{view_sales}</span>',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</article>'].join(''), oImage);
                    sHtml += sHtml_1;
                });
                //alert(sHtml)
                sHtml && that.listEl.append(sHtml);
            },
            error: function () {
                alert('出现错误，请稍后重试');
            },
            always: fCb
        });
    }

    function fRequestData(oConf) {
        //alert('执行frequest')
        var that = this;
        var sUrl = '/address/items/' + oConf.page + '/' + oConf.pageSize + '/';
        //alert(sUrl)
        $.ajax({url: sUrl, dataType: 'json'}).done(oConf.call).fail(oConf.error).always(oConf.always);

    }

    function fTpl(sTpl, oData) {
        var that = this;
        sTpl = $.trim(sTpl);
        return sTpl.replace(/#{(.*?)}/g, function (sStr, sName) {
            return oData[sName] === undefined || oData[sName] === null ? '' : oData[sName];
        });
    }
});
