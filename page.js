'use strict';
// 小程序视图逻辑代码，此处无法调用酷家乐提供的接口！
window.onload = function() {
    getDesignId();
};

function getDesignId() {
    window.parent.postMessage({ action: 'get'}, '*')
}

function info() {
    window.parent.postMessage('info', '*')
}

function warn() {
    window.parent.postMessage('warn', '*')
}

function error() {
    window.parent.postMessage('error', '*')
}

function exit() {
    window.parent.postMessage('exit', '*')
}

window.addEventListener('message', (event) => {
    console.log("awlefjdsl")
    var design_id = event.data
    processFile(design_id);
});

function processFile(design_id) {
    console.log('walallalal')
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // console.log(window.top.location.href)
    // console.log(urlParams.get("crm_items"))
    // var design_data = JSON.parse(urlParams.get("crm_items"))
    // window.parent.postMessage({action: 'getData', designData: design_data}, '*')
    $.ajax({ 
        type: 'GET', 
        url: 'https://signaturegroup.com.my/DigitalEzikit/'+ design_id + '.json', 
        dataType: 'json',
        success: function (data) { 
            window.parent.postMessage({action: 'getData', fileContent: data}, '*')
        },
        error: function (data) {
            console.log("failll")
            window.parent.postMessage({action: 'exit'}, '*')
        }
    });
    // var request = new XMLHttpRequest();
    // request.open('GET', "https://signaturegroup.com.my/DigitalEzikit/KJL_3D(22).json", true);
    // request.responseType = 'blob';
    // request.onload = function() {
    //     var reader = new FileReader();
    //     reader.readAsDataURL(request.response);
    //     console.log(request.response)
    //     reader.onload =  function(e){
    //         var fileContent = e.target.result;
    //         console.log('DataURL:', e.target.result);
    //         console.log(e);
    //     };
    // };
    // // console.log(request)
    // request.send();
//     var fileInput = document.getElementById('fileInput');
//     var file = fileInput.files[0];

//     if (file) {
//         var reader = new FileReader();

//         reader.onload = function(e) {
//           var fileContent = e.target.result;
//           // Add your code to process the data here
//           window.parent.postMessage({action: 'getData', fileContent: fileContent}, '*')
//     };

//     reader.readAsText(file);
//   }
}

function getWallInfo() {
    window.parent.postMessage({action: 'getWallInfo'}, '*')
}
