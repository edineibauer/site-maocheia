<main class="unselect">
    <section id="busca-topo" class="busca">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-10 left-inner-addon">
                    <i class="material-icons">search</i>
                    <input id="procura" class="form-control formulario" type="text" autocomplete="off"
                           placeholder="Pesquise um serviço">
                </div>
                <div class="col-2">
                    <button class="btn theme-text" id="location-btn">
                        <i class="material-icons">location_on</i>
                    </button>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-12 d-none" id="location-box">
                    <div class="col text-center" id="location-box-intern">
                        <h6 class="font-weight-bold col pb-2">Definir localização</h6>
                        <button class="col btn py-2 mb-2 theme-text">
                            <div class="btn-location-intern" id="my-location-btn">
                                <i class="material-icons float-left pr-3">gps_fixed</i>
                                <div class="float-left">Usar minha localização</div>
                            </div>
                        </button>
                       <!-- <button class="col btn py-2">
                            <div class="btn-location-intern">
                                <i class="material-icons float-left pr-3">location_on</i>
                                <div class="float-left">Inserir um endereço</div>
                            </div>
                        </button>-->
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="mapa-home" class="mapas"></section>

    <div class="menu-swipe menu-swipe-class open">
        <div class="swipe-line"></div>
        <div class="swipe-zone-body filter"></div>
    </div>
</main>