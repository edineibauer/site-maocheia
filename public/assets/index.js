$(function () {
    if(getCookie("tutorial") === "") {
        setCookie("tutorial", 1);
        $('#apresentacao .owl-carousel').owlCarousel({
            loop: false,
            margin: 10,
            nav: false,
            autoplay: false,
            dots: true,
            responsive: {
                0: {
                    items: 1
                },
            }
        });

        // Go to the next item
        var owl = $('.owl-carousel');
        owl.owlCarousel();

        owl.on('translated.owl.carousel', function (e) {
            $('.btn-proximo').prop('disabled', true);
            if (e.page.count === e.page.index + 1) {
                $('.btn-proximo').prop('disabled', false).text('Pular').off("click").on('click', function () {
                    $("#goHome").trigger("click");
                });
            } else {
                $('.btn-proximo').prop('disabled', false).text('Próximo').off("click").on("click", function () {
                    owl.trigger('next.owl.carousel');
                });
            }
        });

        $('.btn-proximo').off("click").on("click", function () {
            owl.trigger('next.owl.carousel');
        });
    } else {
        location.href = HOME + "home";
    }
});