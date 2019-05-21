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
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.suggestion = this
        this.isSuggesting = false
        this.suggestSquare = null
        this.node.on('click', button => {
            this.deleteSuggest()
            if(typeof window.game !== "undefined" && window.game.isStarted && !window.game.aiControll && window.game.delayTimeAction <=0 && !this.isSuggesting)
            {
                let listSuggestion = window.game.findAvaiableStep()
                if(listSuggestion.length > 0)
                {
                    let randomIndex = Math.floor(Math.random() * listSuggestion.length)
                    let avaiable = listSuggestion[randomIndex]
                    if(typeof avaiable !== "undefined" && avaiable.box != null && avaiable.box.square != null)
                    {
                        this.isSuggesting = true
                        console.log("Suggest")
                        let action = cc.sequence(
                            cc.repeat(cc.sequence(cc.fadeOut(0.5),cc.fadeIn(0.5)), 6),
                            cc.callFunc(()=>{
                                this.isSuggesting = false
                                this.suggestSquare = null
                            }, this))
                        action.setTag(3)
                        avaiable.box.square.runAction(action)
                        this.suggestSquare = avaiable.box.square
                    }   
                }
            }
        }, this)
    },

    update(dt){
    },

    deleteSuggest(){
        if(typeof this.suggestSquare != "undefined" && this.suggestSquare != null){
            if(this.isSuggesting && this.suggestSquare != null && !this.suggestSquare.getComponent('Square').died)
            {
                this.suggestSquare.stopActionByTag(3)
                this.suggestSquare.opacity = 255
            }
        }
        this.isSuggesting = false
        this.suggestSquare = null
    }

});
