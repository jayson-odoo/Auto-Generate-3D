/// <reference types="@manycore/idp-sdk" />

// 小程序核心代码，可以调用酷家乐导出的接口，参照IDP命名空间
IDP.Miniapp.view.defaultFrame.mount(IDP.Miniapp.view.mountPoints.main); // 挂载默认的小程序视图至特定的挂载点
IDP.Miniapp.view.defaultFrame.resize(100, 100);
// 接收来自默认视图的消息，并调用酷家乐接口此处展示基本toast功能和获取designId
IDP.Miniapp.view.defaultFrame.onMessageReceive(data => {
    if (data.action === 'get') {
        IDP.UI.toast.info("Miniapp start running");
        IDP.Miniapp.view.defaultFrame.postMessage(IDP.Design.getDesignId())
    } else if (data.action === 'getData') {
        // var design_data = JSON.parse(data.fileContent)
        var design_data = data.fileContent
        // var design_data = data.designData;
        var room_data = IDP.DB.Methods.getAllRoomList()
        var min_x = 1000000;
        var max_y = -100000;
        var offset_x;
        var offset_y;
        for (var i = 0; i < room_data[0].profile2d[0].getContour().getCurves().length; i++) {
            if (room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.x < min_x) {
                min_x = room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.x
            }
            if (room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.y > max_y) {
                max_y = room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.y
            }

        }
        offset_x = min_x
        offset_y = max_y
        design_data.items = design_data.items.filter((item) => item.productId != "" && typeof item.productId != "undefined")
        console.log(design_data.items)
        var generated_cabinets = []
        IDP.DB.Methods.findCabinetListAsync().then(res => {
            if (res.length == 0) {
                for (var i = 0; i < design_data.items.length; i++) {
                    var item = design_data.items[i];
                    var productId = item.productId;
                    var position = item.position;
                    var size = item.size;
                    var rotation = item.rotation;
                    position.x += offset_x;
                    position.y += offset_y;
                    IDP.DB.Methods.createCabinetAsync({
                        productId: productId,
                        position: position,
                        size: size,
                        rotation: rotation
                    }).then(res => {
                        console.log(generated_cabinets.length)
                        console.log(design_data.items.length)
                        generated_cabinets.push(res)
                        if (generated_cabinets.length == design_data.items.length) {
                            IDP.Miniapp.exit();
                            IDP.UI.toast.info("Miniapp end running");
                        }
                     })
                        .catch(err => {
                            if (err.message == "product not allow to cabinet") {
                                IDP.DB.Methods.getFurniture({
                                    productId: productId,
                                    position: position,
                                    scale: size,
                                    rotation: rotation
                                }).then(res => {
                                    console.log(res)
                                 })
                                    .catch(err => 
                                        console.log(err.message))
                            }
                        });
                }
            } else {
                IDP.UI.toast.error("at least 1 cabinet exists, hence modules are not generated");
                IDP.UI.toast.info("Miniapp end running");
                IDP.Miniapp.exit();
            }
        })
    } else if (data.action == "exit") {
        IDP.UI.toast.error("can't find 3D data in server");
        IDP.UI.toast.info("Miniapp end running");
        IDP.Miniapp.exit();
    }
});

