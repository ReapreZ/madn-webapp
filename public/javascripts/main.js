$(document).ready(function() {
    // Überprüfe die initial ausgewählte Seite und setze die Position des <span>
    updateSpanPosition();

    // Aktualisiere die Position des <span> beim Klicken auf einen Link
    $('nav a.index-link').click(function() {
        // Entferne die "active" Klasse von allen Links
        $('nav a.index-link').removeClass('active');
        // Füge die "active" Klasse zum angeklickten Link hinzu
        $(this).addClass('active');
        // Aktualisiere die Position des <span>
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