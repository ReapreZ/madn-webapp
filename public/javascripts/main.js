$(document).ready(function() {
    updateSpanPosition();

    $('nav a.index-link').click(function() {
        $('nav a.index-link').removeClass('active');
        $(this).addClass('active');
        updateSpanPosition();
    });

    function updateSpanPosition() {
        var activeLink = $('nav a.index-link.active');
        var span = $('#index-span');

        if (activeLink.length > 0) {
            span.css({
                left: activeLink.position().left + 'px',
                width: activeLink.outerWidth() + 'px'
            });
        }
    }
});