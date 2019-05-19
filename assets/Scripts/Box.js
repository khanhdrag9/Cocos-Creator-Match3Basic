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
        square: {
            default: null,
            type: cc.Node
        },

        column:{
            default: 0,
            visible: false
        },

        row:{
            default: 0,
            visible: false
        },

        fadeDuration: 0.75,
        delayDuration: 0.75

    },

    onLoad(){
        this.isMoved = false;

        this.node.on('touchstart', function(event){
            this.touchBegin = event.touch.getLocation()
            this.isMoved = false;

        }, this)

        this.node.on('touchmove', function(event){
            if(!this.isMoved && this.square != null && !this.square.getComponent('Square').moving)
            {
                let touchLocation = event.touch.getLocation()
                let offset = cc.v2(touchLocation.x - this.touchBegin.x, touchLocation.y - this.touchBegin.y)
                let game = window.game
                let grid = game.grid

                if(Math.abs(offset.x) > Math.abs(offset.y)) 
                {   
                    if(Math.abs(offset.x) >= game.sizeSquare.width / 3)
                    {
                        let go = null;
                        if(offset.x < 0)
                        {
                            go = game.getIndexLeftOf(this)
                        }
                        else
                        {
                            go = game.getIndexRightOf(this)
                        }
                        
                        if(go != null && go.isNone() == false)
                        {
                            this.goTo(go.row, go.column)
                        }
                    }
                }
                else
                {
                    if(Math.abs(offset.y) >= game.sizeSquare.height / 3)
                    {
                        let go = null;
                        if(offset.y < 0)
                        {
                            go = game.getIndexDownOf(this)
                        }
                        else
                        {
                            go = game.getIndexUpOf(this)
                        }

                        console.log(go.row + " - " + go.column)
                        
                        if(go != null && go.isNone() == false)
                        {
                            this.goTo(go.row, go.column)
                        }
                    }
                }
            }

        }, this)

        this.node.on('touchend', function(event){
            if(this.isMoved == false && this.square != null)
            {
                let squareCom = this.square.getComponent('Square')
                if(squareCom != null || squareCom != undefined)
                {
                    squareCom.moveToPosition(this.node.position)
                }
            }
            this.isMoved = false
        }, this)
    },

    goTo(row, column){
        // window.game.swap(this.row, this.column, row, column)
        // let isMatch = window.game.checkMatchAll()
        let boxSwap = window.game.listBoxes[row][column].getComponent('Box')
        let isMatch = window.game.simulateNewPostion(this, boxSwap)
        console.log("simulator lenght : " + isMatch.length)
        if(isMatch.length > 0)
        {
            window.game.swap(this.row, this.column, row, column)
        }
        else
        {
            console.log('not match -> revert')
            let isMatchofSwap = window.game.simulateNewPostion(boxSwap, this)
            if(isMatchofSwap.length > 0)
            {
                window.game.swap(this.row, this.column, row, column)
            }
            else
                console.log('all not match ')
        }

        this.isMoved = true
    },

    destroySquare(){
        if(this.square.getComponent('Square').died)return;

        let sequence = cc.sequence(
            cc.fadeTo(this.fadeDuration, 0),
            cc.delayTime(this.delayDuration),
            cc.removeSelf(true),
            cc.callFunc(function(){
            this.square = null
        }, this))
        sequence.setTag(-1)
        this.square.getComponent('Square').died = true
        this.square.runAction(sequence)
        console.log("destroy")        
    }

});
