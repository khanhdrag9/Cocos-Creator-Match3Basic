// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Square from './Square.js'
import Box from './Box.js'

function GridPos(_row, _column) {
    this.row = _row
    this.column = _column
};
GridPos.prototype.isNone = function(){
    return this.row == -1 || this.column == -1;
}

cc.Class({
    extends: cc.Component,

    properties: {
        width: 10,
        height: 10,

        square: {
            default: null,
            type: cc.Prefab
        },

        box: {
            default: null,
            type: cc.Prefab
        },

        sizeSquare: {
            default: new cc.Size()
        },

        squareTypes: {
            default: [],
            type: cc.Color
        },

        listBoxes: new Array,

        grid: new Array
    },



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.getGrid()        
        this.generateSquares()
        window.game=this;
    },

    getGrid(){
        var sz = new cc.size(this.node.width, this.node.height)
        var center = cc.v2(0,0)

        var startX = center.x - this.sizeSquare.width * this.width / 2 + this.sizeSquare.width / 2.
        var startY = center.y - this.sizeSquare.height * this.height / 2 + this.sizeSquare.height / 2

        var x = startX
        var y = startY

        for(let r = 0; r < this.height; r++)
        {
            this.grid.push(new Array)
            for(let c = 0; c < this.width; c++)
            {
                // this.grid.push(cc.v2(x, y))
                this.grid[r].push(cc.v2(x,y))
                x += this.sizeSquare.width
            }
            x = startX
            y += this.sizeSquare.height
        }
    },

    generateSquares(){
        for(let row = 0; row < this.grid.length; row++)
        {
            let inRow = this.grid[row]
            this.listBoxes.push(new Array)
            for(let column = 0; column < inRow.length; column++)
            {
                let position = inRow[column]
                let color = this.getColorInArray(this.squareTypes)
                let box = this.createSquareAt(row, column, position, color)
                this.listBoxes[row].push(box)
            }
        }
    },

    createSquareAt (row, column, position, color) {
        let box = cc.instantiate(this.box)
        let boxCom = box.getComponent('Box')
        if(boxCom)
        {
            boxCom.row = row
            boxCom.column = column
            boxCom.square = cc.instantiate(this.square)
            boxCom.square.color = color
            let squareCom = boxCom.square.getComponent('Square')
            if(squareCom)
            {
                squareCom.row = row
                squareCom.column = column
                squareCom.origin_position = position
            }

            boxCom.square.setPosition(position)
            this.node.addChild(boxCom.square, 20)
        }
        box.setPosition(position)
        this.node.addChild(box, 10)

        return box
    },

    getColorInArray (array) {
        if(array.length == 0)return cc.Color.WHITE
        else
            return array[Math.floor(Math.random() * array.length)];
    },

    checkMatch3(square){

    },

    swap(first, second){
        
    },

    getIndexLeftOf(i){
        if(i instanceof Box)
        {
            let c = i.column == 0 ? -1 : i.column - 1
            return new GridPos(i.row, c)
        }
    },
    getIndexRightOf(i){
        if(i instanceof Box)
        {
            let c = i.column == (this.width - 1) ? -1 : i.column + 1
            return new GridPos(i.row, c)
        }
    },
    getIndexUpOf(i){
        if(i instanceof Box)
        {
            let r = (i.row == (this.height - 1) ? -1 : i.row + 1)
            return new GridPos(r, i.column)
        }
    },
    getIndexDownOf(i){
        if(i instanceof Box)
        {
            let r = i.row == 0 ? -1 : i.row - 1
            return new GridPos(r, i.column)
        }
    }

    // update (dt) {},
});
