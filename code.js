/// <reference types="@manycore/idp-sdk" />

// 小程序核心代码，可以调用酷家乐导出的接口，参照IDP命名空间
IDP.Miniapp.view.defaultFrame.mount(IDP.Miniapp.view.mountPoints.main); // 挂载默认的小程序视图至特定的挂载点
// 接收来自默认视图的消息，并调用酷家乐接口此处展示基本toast功能和获取designId
IDP.Miniapp.view.defaultFrame.onMessageReceive(data => {
    if (data.action === 'get') {
        IDP.Miniapp.view.defaultFrame.postMessage(IDP.Design.getDesignId())
    } else if (data.action === 'info') {
//        IDP.UI.toast.info('info');
        IDP.DB.Methods.createWardrobeAsync({
            productId: '3FO4F935H7OM',
            position: { x: -3000, y: 0, z: 1000 },
            size: { x: 6000, y: 500, z: 800 },
            rotation: { x: 0, y: 0, z: 0 }
        }).then(res => { })
            .catch(err => console.log(err.message));
//        IDP.Miniapp.view.defaultFrame.postMessage(IDP.DB.Methods.createCabinetAsync().Types.ElementId);
    } else if (data.action === 'warn') {
        IDP.UI.toast.warn('warn');
    } else if (data.action === 'error') {
        IDP.UI.toast.error('error');
    } else if (data.action === 'exit') {
        IDP.Miniapp.exit();
    } else if (data.action === 'getData') {
        // var design_data = JSON.parse(data.fileContent)
        var design_data = data.fileContent
        console.log(design_data)
        // var design_data = data.designData;
        var room_data = IDP.DB.Methods.getAllRoomList()
        console.log(room_data[0].profile2d[0].getContour().getCurves().length)
        var min_x = 1000000;
        var max_y = -100000;
        var offset_x;
        var offset_y;
        for (var i = 0; i < room_data[0].profile2d[0].getContour().getCurves().length; i++) {
            console.log("Start -----")
            console.log(i)
            console.log(room_data[0].profile2d[0].getContour().getCurves()[i])
            console.log(room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.x)
            console.log(room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.y)
            console.log("End -------")
            if (room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.x < min_x) {
                min_x = room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.x
            }
            if (room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.y > max_y) {
                max_y = room_data[0].profile2d[0].getContour().getCurves()[i].endPoint.y
                console.log("changed max_y " + max_y)
            }

        }
        offset_x = min_x
        offset_y = max_y
        console.log("offset x : " + offset_x)
        console.log("offset y : " + offset_y)
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
                console.log(res)
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
    } else if (data.action === 'getWallInfo') {
        // console.log(IDP.DB.Methods.getAllRoomList())
    }
});

