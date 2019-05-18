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
    },

    onLoad(){
        this.isMoved = false;

        this.node.on('touchstart', function(event){
            this.touchBegin = event.touch.getLocation()
            this.isMoved = false;
        }, this)

        this.node.on('touchmove', function(event){
            if(!this.isMoved)
            {
                let touchLocation = event.touch.getLocation()
                let offset = cc.v2(touchLocation.x - this.touchBegin.x, touchLocation.y - this.touchBegin.y)
                let game = window.game
                let grid = game.grid

                if(Math.abs(offset.x) > Math.abs(offset.y)) 
                {   
                    if(Math.abs(offset.x) >= game.sizeSquare.width / 2)
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

                        console.log(go.row + " - " + go.column)
                        
                        if(go != null && go.isNone() == false)
                        {
                            this.goTo(go.row, go.column)
                        }
                    }
                }
                else
                {
                    if(Math.abs(offset.y) >= game.sizeSquare.height / 2)
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
            if(this.isMoved == false)
            {
                let squareCom = this.square.getComponent('Square')
                if(squareCom != null || squareCom != undefined)
                {
                    squareCom.moveToPosition(this.node.position)
                }
            }
            this.isMoved = false;
        }, this)
    },

    goTo(row, column){
        let game = window.game

        //move position
        let boxSwap = game.listBoxes[row][column].getComponent('Box')

        //2 position is used to swap
        let currentPosition = this.node.position
        let nextPosition = boxSwap.node.position

        //move squares
        boxSwap.square.getComponent('Square').moveToPosition(currentPosition)
        this.square.getComponent('Square').moveToPosition(nextPosition)

        //change index
        let tempSquare = boxSwap.square
        boxSwap.square = this.square
        this.square = tempSquare

        console.log("moved!")
        this.isMoved = true;
    }

});
