// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        ButtonInfinityMode: {
            default: null,
            type: cc.Button
        },

        ButtonClassicMode: {
            default: null,
            type: cc.Button
        },

        ButtonOption: {
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.ButtonInfinityMode != null)
        {
            this.ButtonInfinityMode.node.on('click', function(button){
                cc.director.loadScene('GameInfinity')
            }, this)
        }
        
        if(this.ButtonClassicMode != null)
        {
            this.ButtonClassicMode.node.on('click', function(button){
                cc.director.loadScene("Game")
            }, this)
        }

        if(this.ButtonOption != null)
        {
            this.ButtonOption.node.on('click', function(button){

            }, this)
        }
    },
});
