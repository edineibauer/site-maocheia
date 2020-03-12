<main>
    <section id="busca-topo" class="busca">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-lg-6 left-inner-addon">
                    <i class="material-icons">search</i>
                    <input id="procura" class="form-control formulario" type="text"
                           placeholder="Pesquise um serviço">
                </div>
            </div>
        </div>
    </section>

    <section id="mapa-home" class="mapas"></section>

    <div class="menu-swipe close">
        <div class="swipe-line"></div>
        <div class="swipe-zone-body"></div>
    </div>

</main>
<script>
    function initAutocomplete() {
        setTimeout(function () {
            startMap();
        },100);
    }
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDOHzDqP5Obg3nqWwu-QwztEyhD8XENPGE&libraries=places,directions&callback=initAutocomplete&language=pt-br"
        async defer></script>