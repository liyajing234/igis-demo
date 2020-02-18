import {Cesium} from "../IGisPackages/Unit.js";
import {viewer} from  "./Viewer.js";
import {ScreenSpaceEventType} from "./CommonTypes.js";
class ScreenSpaceEventHandler {
    constructor (props) {
       this.handler= new Cesium.ScreenSpaceEventHandler(viewer.canvas);
       return this.hendler;
    }
    mouseevent(eventType,fn){
       let type=ScreenSpaceEventType.LEFT_CLICK;
       if(eventType=="LEFT_CLICK"||eventType===ScreenSpaceEventType.LEFT_CLICK){
           type=ScreenSpaceEventType.LEFT_CLICK;
       }else if(eventType=="RIGHT_CLICK"||eventType===ScreenSpaceEventType.RIGHT_CLICK){
           type=ScreenSpaceEventType.RIGHT_CLICK;
       }else if(eventType=="LEFT_DOUBLE_CLICK"||eventType===ScreenSpaceEventType.LEFT_DOUBLE_CLICK){
           type=ScreenSpaceEventType.LEFT_DOUBLE_CLICK;
       }else if(eventType=="MOUSE_MOVE"||eventType===ScreenSpaceEventType.MOUSE_MOVE){
           type=ScreenSpaceEventType.MOUSE_MOVE;
       }else if(eventType=="MIDDLE_CLICK "||eventType===ScreenSpaceEventType.MIDDLE_CLICK){
           type=ScreenSpaceEventType.MIDDLE_CLICK ;
       }else if(eventType=="MIDDLE_DOWN "||eventType===ScreenSpaceEventType.MIDDLE_DOWN){
           type=ScreenSpaceEventType.MIDDLE_DOWN ;
       }else if(eventType=="MIDDLE_UP "||eventType===ScreenSpaceEventType.MIDDLE_UP){
           type=ScreenSpaceEventType.MIDDLE_UP ;
       }else if(eventType=="WHEEL"||eventType===ScreenSpaceEventType.WHEEL){
           type=ScreenSpaceEventType.WHEEL;
       }

       this.handler.setInputAction(function (movement) {
           if (type === ScreenSpaceEventType.WHEEL) {
               fn();
           } else if (type === ScreenSpaceEventType.MOUSE_MOVE) {
               const picked = viewer.scene.pick(movement.endPosition);
            //    const position=viewer.scene.pickPosition(movement.endPosition);
               const position = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
               let obj=null
               if(picked==undefined){
                obj={
                    pickedPosition:position,
                    pickedEntity:undefined,
                    picked:undefined
                }
               }else{
                 obj={
                    pickedPosition:position,
                    pickedEntity:picked.id,
                    picked:picked.primitive._position
                }
               }


               fn(obj);
           } else {
               const picked = viewer.scene.pick(movement.position);
            //    const position=viewer.scene.pickPosition(movement.position);
               const position = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
               let obj=null
               if(picked==undefined){
                obj={
                    pickedPosition:position,
                    pickedEntity:undefined,
                    pickedPoint:undefined
                }
               }else{
                 obj={
                    pickedPosition:position,
                    pickedEntity:picked.id,
                    picked:picked.primitive._position
                }
               }
              
               fn(obj);
               // if (Cesium.defined(picked)) {
               //     // console.log(picked);
               //     fn(picked.id);
               // }
           }
       },type)
    }

    removeEvent(eventType){
        let type=ScreenSpaceEventType.LEFT_CLICK;
        if(eventType=="LEFT_CLICK"||eventType===ScreenSpaceEventType.LEFT_CLICK){
            type=ScreenSpaceEventType.LEFT_CLICK;
        }else if(eventType=="RIGHT_CLICK"||eventType===ScreenSpaceEventType.RIGHT_CLICK){
            type=ScreenSpaceEventType.RIGHT_CLICK;
        }else if(eventType=="LEFT_DOUBLE_CLICK"||eventType===ScreenSpaceEventType.LEFT_DOUBLE_CLICK){
            type=ScreenSpaceEventType.LEFT_DOUBLE_CLICK;
        }else if(eventType=="MOUSE_MOVE"||eventType===ScreenSpaceEventType.MOUSE_MOVE){
            type=ScreenSpaceEventType.MOUSE_MOVE;
        }
        this.handler.removeInputAction(type);
    }
    destroy(){
        this.handler.distory();
    }
}

export {ScreenSpaceEventHandler};
