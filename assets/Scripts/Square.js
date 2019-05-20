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
        moveDuration : 0.25,
    },

    onLoad(){
        this.died = false
        this.moving = false
    },

    moveToPosition(pos){
        if(this.died)return false
        // let action = cc.moveTo(this.moveDuration, pos)
        // if(this.node.getActionByTag(-1) == null)
        // {
            this.node.stopActionByTag(1)
            let action = cc.sequence(
                cc.moveTo(this.moveDuration, pos),
                cc.callFunc(function(){
                    this.moving = false
                }, this))
            action.setTag(1)
            this.moving = true
            this.node.runAction(action)
        // }

        return true
    },

    // update (dt) {},
});
