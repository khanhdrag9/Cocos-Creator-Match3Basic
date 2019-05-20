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
        timeStep :{
            default: null,
            type: cc.ProgressBar
        },
        durationShowBar : 1,
        startTime : 15,
        minTime : 3
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.gamePlayManager = this
    },

    start(){
        this.timeStep.node.opacity = 0
        this.currentTime = this.startTime
    },

    defeat(){
        console.log("defeat!")
        window.game.isStarted = false
    },

    update (dt) {
        if(!window.game.isStarted)return;

        if(this.timeStep.node.opacity == 0)
        {
            this.timeStep.node.opacity = 1
            this.timeStep.node.runAction(cc.fadeTo(this.durationShowBar, 255))
        }

        if(window.game.isResetBoard)
        {
            this.defeat()
        }
        else if(this.timeStep.progress <= 0.0)
        {
            this.defeat()
        }
        else
        {
            this.currentTime = this.startTime - Math.floor(window.game.score / 1000)
            this.timeStep.progress -= (dt / this.currentTime)    
        }
        
    },
});
