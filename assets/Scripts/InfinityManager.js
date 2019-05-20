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
        startNumberStep: 25,
        titleForCountStep: "Step : ",
        textCountStep: {
            default: null,
            type: cc.Label
        },
        shield:{
            default: null,
            type: cc.Prefab
        },
        numberShields: 5,
        destroyShieldDuration: 0.4
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.gamePlayManager = this
        this.currentNumberStep = this.startNumberStep
        this.setTextForCountStep(this.currentNumberStep.toString())

        this.initShields(this.numberShields)
    },

    initShields(number){
        for(let i = 0; i < number; ++i)
        {
            let listBoxes = window.game.listBoxes
            let rowIndex = Math.floor(Math.random() * listBoxes.length)
            let row = listBoxes[rowIndex]
            if(typeof row !== "undefined")
            {
                let randomIndexC = Math.floor(Math.random() * row.length)
                let boxShielded = row[randomIndexC]
                if(typeof boxShielded !== "undefined")
                    this.createShield(boxShielded.getComponent('Box'))
            }
        }
    },

    createShield(boxCom){
        let nodeShield = cc.instantiate(this.shield)
        if(nodeShield!= null)
        {
            nodeShield.setContentSize(window.game.sizeSquare)
            boxCom.addShield(nodeShield)
            // nodeShield.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(2, 35), cc.fadeTo(2, 225))))
        }
        return nodeShield
    },

    resetStep(){
        this.currentNumberStep = this.startNumberStep
        this.setTextForCountStep(this.currentNumberStep.toString())
    },

    decreStep(value){
        this.currentNumberStep -= value
        this.currentNumberStep = this.currentNumberStep < 0 ? 0 : this.currentNumberStep 
        this.setTextForCountStep(this.currentNumberStep.toString())
    },

    setTextForCountStep(str){
        if(this.textCountStep!=null)
        {
            this.textCountStep.string = this.titleForCountStep + str
        }
    }

    // update (dt) {},
});
