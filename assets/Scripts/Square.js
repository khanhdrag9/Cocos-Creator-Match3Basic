// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        speedMove : 0.2
    },

    onLoad(){
    },

    moveToPosition(pos){
        let action = cc.moveTo(this.speedMove, pos)
        if(this.node.getActionByTag(-1) == null)
        {
            this.node.stopAllActions()
            this.node.runAction(action)
        }
    },

    // update (dt) {},
});
