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

        this.checkMatchAll()
        this.updatePositionSquare()
    },

    update (dt) {
        this.checkMatchAll()
        this.updatePositionSquare()
        this.updateNewSquare()
    },

    getGrid(){
        var sz = new cc.size(this.node.width, this.node.height)
        var center = cc.v2(0,0)

        var startX = center.x - this.sizeSquare.width * this.width / 2 + this.sizeSquare.width / 2.
        var startY = center.y - this.sizeSquare.height * this.height / 2 + this.sizeSquare.height / 2

        var x = startX
        var y = startY

        for(let r = 0; r < this.height + 1; r++)
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
        for(let row = 0; row < this.height; row++)
        {
            this.listBoxes.push(new Array)
            for(let column = 0; column < this.width; column++)
            {
                let position = this.grid[row][column]
                let color = this.getColorInArray(this.squareTypes)
                let box = this.createBoxAt(row, column, position, color)
                this.listBoxes[row].push(box)
            }
        }
    },

    createBoxAt (row, column, position, color) {
        let box = cc.instantiate(this.box)
        let boxCom = box.getComponent('Box')
        if(boxCom)
        {
            boxCom.row = row
            boxCom.column = column
            this.createSquareAt(boxCom, position, color)

        }
        box.setPosition(position)
        this.node.addChild(box, 10)

        return box
    },

    //@boxCom is 'Box' object, toPosition is option - can be drop to gameboard
    createSquareAt(boxCom, position, color, toPosition = cc.v2(-1,-1)){
        boxCom.square = cc.instantiate(this.square)
        boxCom.square.color = color
        boxCom.square.setPosition(position)
        this.node.addChild(boxCom.square, 20)

        if(!toPosition.equals(cc.v2(-1, -1)) && !toPosition.equals(position))
        {
            boxCom.square.getComponent('Square').moveToPosition(toPosition)
        }
    },

    getColorInArray (array) {
        if(array.length == 0)return cc.Color.WHITE
        else
            return array[Math.floor(Math.random() * array.length)];
    },

    checkMatchAll(){
        let deleteBoxes = new Array;
        let stop = false;

        let lamdaCheckBox = (box1, box2, tempBoxes)=>{
            let length = tempBoxes.length
            if(box1.square != null && box2.square != null && 
                !box1.square.getComponent('Square').died && !box2.square.getComponent('Square').died)
            {
                // if(box1.square.getComponent('Square').moving || box2.square.getComponent('Square').moving)
                // {
                //     stop = true
                //     return;
                // }
                 if(box1.square.color.equals(box2.square.color))
                {
                    if(length == 0)tempBoxes.push(box1)
                    tempBoxes.push(box2)
                }
                else if(length < 3)
                {
                    if(tempBoxes.length > 0)tempBoxes.splice(0, tempBoxes.length)
                }
                else if(length >= 3)
                {
                    // tempBoxes.forEach(function(box){deleteBoxes.push(box)})
                    deleteBoxes.push(tempBoxes)
                    tempBoxes =  new Array
                }
            }
            else if(length < 3)
            {
                if(tempBoxes.length > 0)tempBoxes.splice(0, tempBoxes.length)
            }
            else if(length >= 3)
            {
                // tempBoxes.forEach(function(box){deleteBoxes.push(box)})
                deleteBoxes.push(tempBoxes)
                tempBoxes = new Array
            }

            return tempBoxes
        }

        //find by row
        for(let row = 0; row < this.height; row++)
        {
            let tempBoxes = new Array;
            let column = 1;
            for(column ;column < this.width; column++)
            {
                let box1 = this.listBoxes[row][column - 1].getComponent('Box')
                let box2= this.listBoxes[row][column].getComponent('Box')
                if(stop)return;
                tempBoxes = lamdaCheckBox(box1, box2, tempBoxes)
            }

            if(tempBoxes.length >=3 && column == this.width)
            {
                // tempBoxes.forEach(function(box){deleteBoxes.push(box)})
                deleteBoxes.push(tempBoxes)
            }
            tempBoxes = new Array
        }

        //find by column
        for(let column = 0; column < this.width; column++)
        {
            let tempBoxes = new Array;
            let row = 1
            for(row; row < this.height; row++)
            {
                let box1 = this.listBoxes[row-1][column].getComponent('Box')
                let box2= this.listBoxes[row][column].getComponent('Box')
                if(stop)return;
                tempBoxes = lamdaCheckBox(box1, box2, tempBoxes)
            }

            if(tempBoxes.length >=3 && row == this.height)
            {
                // tempBoxes.forEach(function(box){deleteBoxes.push(box)})
                deleteBoxes.push(tempBoxes)
            }
            tempBoxes = new Array
        }

        deleteBoxes.forEach(function(boxes){
            boxes.forEach(function(box){
                if(box instanceof Box){        
                    box.destroySquare()
                }
            })
        })

        if(deleteBoxes.length > 0)return true
        else return false
    },

    updatePositionSquare()
    {
        function Pair(box, count) {
            this.box = box
            this.count = count
        }
        let array = new Array;

        for(let column = 0; column < this.width; column++)
        {
            let count = 0
            for(let row = 0; row < this.height; row++)
            {
                let box = this.listBoxes[row][column].getComponent('Box')
                if(box.square == null && row < this.height - 1)
                {
                    ++count
                }
                else if(count != 0)
                {
                    let p = new Pair(box, count)
                    array.push(p)
                }
            }
        }

        array.forEach(function(p){
            if(p.box != null)
            {
                let box = p.box
                if(box.row - p.count >= 0)
                {
                    this.swap(box.row, box.column, box.row - p.count, box.column)
                }
            }
        }, this)
    },

    updateNewSquare(){
        let missedPosition = new Array
        for(let column = 0; column < this.width; column++)
        {
            for(let row = 0; row < this.height; row++)
            {
                let box = this.listBoxes[row][column].getComponent('Box')
                if(box.square == null)
                {
                    missedPosition.push(new GridPos(box.row, box.column))
                }
                else if(box.square.getComponent('Square').died)
                {
                    return;
                }
            }
        }

        missedPosition.forEach(function(gridPos){
            let boxCom = this.listBoxes[gridPos.row][gridPos.column].getComponent('Box')
            let positionCreate = this.grid[this.height][gridPos.column]
            let color = this.getColorInArray(this.squareTypes)
            this.createSquareAt(boxCom, positionCreate, color, boxCom.node.position)
        }, this)
    },

    swap(row1, column1, row2, column2){
        //move position
        let box1 = this.listBoxes[row1][column1].getComponent('Box')
        let box2 = this.listBoxes[row2][column2].getComponent('Box')

        //2 position is used to swap
        let position1 = box1.node.position
        let position2 = box2.node.position

        if(box1.square != null)
        {
            let square1 = box1.square.getComponent('Square')
            if(square1 != null)square1.moveToPosition(position2)
        }

        if(box2.square != null)
        {
            let square2 = box2.square.getComponent('Square')
            if(square2 != null)square2.moveToPosition(position1)
        }

        //change index
        let tempSquare = box1.square
        box1.square = box2.square
        box2.square = tempSquare

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
    },

});
