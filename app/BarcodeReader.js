function openReader(){
  Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
        }
    },
    locator: {
        patchSize: "medium",
        halfSample: true
    },
    numOfWorkers: 4,
    locate: true,
    decoder : {
        readers: ["upc_reader", "upc_e_reader"]
    }
}, function() {
    Quagga.start();
});

Quagga.onDetected(function(result) {
    var code = result.codeResult.code;
    //console.log("The code is "+code);

    var $form = $("#form-search");

    $form.find("input[name='query']").val(code);
    Quagga.stop();
    $form.submit();

});
}
