define(function(require, exports, module) {
    $(function(options) {
        $(document).on('click.modal.data-api', '[data-toggle="modal"]', function(e) {
            var tz=new Date().getTimezoneOffset();
            var $this = $(this),
                href = $this.attr('href'),
                url = $(this).data('url');
            if (url) {
                var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
                     // url+="?tz="+tz;

                    $target.html('').load(url);
            }
        });
        
        $('.modal').on('click', '[data-toggle=form-submit]', function(e) {
            e.preventDefault();
            $($(this).data('target')).submit();

        });

        $(".modal").on('click', '.pagination a', function(e){
            e.preventDefault();
            var $modal = $(e.delegateTarget);
            $.get($(this).attr('href'), function(html){
                $modal.html(html);
            });
        });


    });


});