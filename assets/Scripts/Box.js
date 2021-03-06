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
import ClassicManager from './ClassicManager.js'

cc.Class({
    extends: cc.Component,

    properties: {
        square: {
            default: null,
            type: cc.Node
        },

        shields:{
            default: [],
            type: Node
        },

        column:{
            default: 0,
            visible: false
        },

        row:{
            default: 0,
            visible: false
        },

        fadeDuration: 0.2,
        delayDuration: 0.1

    },

    onLoad(){
        this.isMoved = false;

        this.node.on('touchstart', function(event){
            this.touchBegin = event.touch.getLocation()
            this.isMoved = false;

        }, this)

        this.node.on('touchmove', function(event){
            if(!this.isMoved && this.square != null && !this.square.getComponent('Square').moving && !window.game.aiIsControlling && window.game.isStarted 
            && window.game.delayTimeAction <= 0)
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
                            if(window.gamePlayManager instanceof ClassicManager)
                            {
                                window.gamePlayManager.decreStep(1)
                            }
                            if(typeof window.suggestion !== "undefined")
                                window.suggestion.deleteSuggest()
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
                            if(window.gamePlayManager instanceof ClassicManager)
                                window.gamePlayManager.decreStep(1)
                            if(typeof window.suggestion !== "undefined")
                                window.suggestion.deleteSuggest()
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

    goTo(row, column, skipCheck = false){
        if(skipCheck)
        {
            window.game.swap(this.row, this.column, row, column)
        }
        else
        {
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
        }
        this.isMoved = true
    },

    destroySquare(destroyAll ,immediate = false){
        if(this.square == null)return;
        if(this.square.getComponent('Square').died)return;

        if(immediate)
        {
            this.square.getComponent('Square').died = true
            this.square.runAction(cc.removeSelf(true))
            this.square = null

            this.shields.forEach(function(shield){
                shield.destroy()
            })
            this.shields.splice(0, this.shields.length)
            return true
        }
        else
        {
            if(this.shields.length > 0)
            {
                let shieldDestroyDuration = 1
                if(window.gamePlayManager instanceof ClassicManager)
                    shieldDestroyDuration = window.gamePlayManager.destroyShieldDuration
                let sequence = cc.sequence(
                    cc.scaleBy(shieldDestroyDuration, 2),
                    cc.removeSelf(true),
                    cc.callFunc(function(){
                    this.shields.pop()
                    if(typeof window.gamePlayManager.currentShields !== "undefined")
                        window.gamePlayManager.currentShields--
                }, this))
                this.shields[this.shields.length - 1].runAction(sequence)
                if(!destroyAll)
                    return false
            }

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
        }
        
        return true;
    },

    addShield(shield){
        if(shield != null)
        {
            this.shields.push(shield)
            shield.position = window.game.grid[this.row][this.column]
            window.game.node.addChild(shield, 30)
        }
    }

});
