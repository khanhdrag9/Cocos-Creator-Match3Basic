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
import Box from './Box.js'
import InfinityManager from './InfinityManager.js'
import ClassicManager from './ClassicManager.js'

function GridPos(_row, _column) {
    this.row = _row
    this.column = _column
};
GridPos.prototype.isNone = function(){
    return this.row == -1 || this.column == -1;
}

function DirectionAvaiable(_box, _direction, _score){
    this.direction = _direction
    this.box = _box
    this.score = _score
}
DirectionAvaiable.prototype.handle = function(){
    if(this.box instanceof Box)
    {
        let gridPos = new GridPos(-1,-1)
        if(this.direction == 'left')gridPos = window.game.getIndexLeftOf(this.box)
        if(this.direction == 'right')gridPos = window.game.getIndexRightOf(this.box)
        if(this.direction == 'up')gridPos = window.game.getIndexUpOf(this.box)
        if(this.direction == 'down')gridPos = window.game.getIndexDownOf(this.box)
        
        if(window.gamePlayManager instanceof ClassicManager)
            window.gamePlayManager.decreStep(1)
        this.box.goTo(gridPos.row, gridPos.column, true)
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        width: 10,
        height: 10,
        delayTimeReset: 2,
        aiControll: false,
        timeAIDelay: 1,
        extraSquareActionDelay: 1,
        noneMatchAtFirstTime: false,

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

        button: {
            default: null,
            type: cc.Button
        },

        listBoxes: new Array,

        grid: new Array,

        textCountStart:{
            default: null,
            type: cc.Label
        },
        textScore: {
            default: null,
            type: cc.Label
        },
        titleForScore: "Score: ",
        minScore: 30,
        
    },



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isStarted = false
        this.isResetBoard = false
        this.hasUpdated = false;
        this.delayTimeAction = 0
        this.aiIsControlling = false
        this.score = 0

        this.button.node.on('click', function(button){
            this.aiControll = !this.aiControll
            this.aiIsControlling = !this.aiIsControlling
        }, this)

        this.getGrid()        
        this.generateSquares()
        window.game=this;

        // this.checkMatchAll()
        // this.updatePositionSquare()
        while(this.findAvaiableStep().length == 0)
        {
            console.log("reset")
            // this.isResetBoard = true;
            this.resetBoard()
        }

        let count3 = this.getTextSequenceDelayTime(this.textCountStart, "3", 1)
        let count2 = this.getTextSequenceDelayTime(this.textCountStart, "2", 1)
        let count1 = this.getTextSequenceDelayTime(this.textCountStart, "1", 1)
        let startText = this.getTextSequenceDelayTime(this.textCountStart, "Start!", 1)

        let action = cc.sequence(count3, count2, count1, startText, cc.callFunc(function(){
            console.log("startGame")
            this.textCountStart.node.destroy()
            this.isStarted = true
        }, this))
        this.node.runAction(action)
    },

    update (dt) {
        if(!this.isStarted)return

        this.hasUpdated = false;
        this.checkMatchAll()
        let hasMoves = this.updatePositionSquare()
        this.updateNewSquare()

        if(this.hasUpdated)
        {
            let avaiableMove = this.findAvaiableStep()
            if(!this.isResetBoard && avaiableMove.length == 0)
            {
                this.isResetBoard = true;
            }
            else if(avaiableMove.length > 0)
            {
                //handle AI
                if(this.aiControll && this.delayTimeAction == 0)
                {
                    // avaiableMove[Math.floor(Math.random()*avaiableMove.length)]
                    this.aiControll = false
                    this.node.runAction(cc.sequence(cc.delayTime(this.timeAIDelay), cc.callFunc(function(){
                        if(this.aiIsControlling)
                        {
                            let maxScoreMove = avaiableMove[0]
                            avaiableMove.forEach(function(move){
                                if(maxScoreMove.score < move.score)
                                    maxScoreMove = move
                            })
                            maxScoreMove.handle()
                            console.log("AI handle score : " + maxScoreMove.score)
                            this.aiControll = true
                        }
                    }, this)))
                }
                this.isResetBoard = false;
            }

            if(this.isResetBoard)this.resetBoard()
        }

        this.delayTimeAction -= dt
        if(this.delayTimeAction < 0.0)this.delayTimeAction = 0.0
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
        if(this.noneMatchAtFirstTime)
        {
            this.generateSquaresNotMatch()
        }
        else {
            this.generateSquaresRandom()
        }   
    },

    generateSquaresNotMatch(){
        for(let row = 0; row < this.height; row++)  //create box
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

        let shuffleArray = array =>{
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];    //swap
            }
            return array;
        }

        let isMatch = (color, row, column) =>{
            let isSameColorAt = (cColor, cr, cc) => {
                let box = this.listBoxes[cr][cc]
                if(typeof box !== "undefined" && box != null && box.getComponent('Box').square != null)
                {
                    if(box.getComponent('Box').square.color.equals(cColor))return true
                    else return false
                }
                else
                    return false
            }
            //check column
            let countSame = 1
            let left = column - 1
            let right = column + 1
            while(true){
                if(left >= 0)
                    if(isSameColorAt(color, row, left))countSame++
                    else left = -1
                if(right < this.width)
                    if(isSameColorAt(color, row, right))countSame++
                    else right = this.width
                if(countSame >= 3)break;
                if(left < 0 && right >= this.width)
                    break;
                --left
                ++right
            }
            if(countSame >= 3)return true
            //check row
            countSame = 1
            let up = row + 1
            let down = row - 1
            while(true){
                if(down >= 0)
                    if(isSameColorAt(color, down, column))countSame++
                    else down = -1
                if(up < this.height)
                    if(isSameColorAt(color, up, column))countSame++
                    else up = this.height
                if(countSame >= 3)break;
                if(down < 0 && up >= this.height)
                    break;
                ++up
                --down
            }
            if(countSame >= 3)return true
        
            return false
        }

        for(let row = 0; row < this.height; row++)
        {
            for(let column = 0; column < this.width; column++)
            {
                let colorAvaiable = Array.from(this.squareTypes)
                colorAvaiable = shuffleArray(colorAvaiable)
                let color = colorAvaiable[colorAvaiable.length - 1]
                while(isMatch(color, row, column))
                {
                    colorAvaiable.pop()
                    if(colorAvaiable.length == 0)break
                    color = colorAvaiable[colorAvaiable.length - 1] 
                }
                if(colorAvaiable.length == 0)
                    color = cc.Color.WHITE

                let box = this.listBoxes[row][column]
                this.createSquareAt(box.getComponent('Box'), box.position, color)
            }
        }
    },

    generateSquaresRandom(){
        for(let row = 0; row < this.height; row++)
        {
            this.listBoxes.push(new Array)
            for(let column = 0; column < this.width; column++)
            {
                let position = this.grid[row][column]
                let color = this.getColorInArray(this.squareTypes)
                let box = this.createBoxAt(row, column, position, color)
                this.listBoxes[row].push(box)
                this.createSquareAt(box.getComponent('Box'), position, color)
            }
        }
    },

    resetBoard(immediate = false){
        let boxes = []
        for(let row = 0; row < this.height; row++)
        {
            for(let column = 0; column < this.width; column++)
            {
                let boxCom = this.listBoxes[row][column].getComponent('Box')
                if(boxCom.square == null && this.isStarted)return;
                else if(boxCom.square != null)
                {
                    let square = boxCom.square.getComponent('Square')
                    if(immediate && !square.died)boxes.push(boxCom)
                    else if((square.moving || square.died) && this.isStarted)return;
                    else if(!square.moving && !square.died)boxes.push(boxCom)
                }
                // this.createSquareAt(boxCom, boxCom.node.position, this.getColorInArray(this.squareTypes))
            }
        }

        console.log("reset")
        let delay = immediate ? 0 : this.delayTimeReset
        this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function(){
            if(this.isResetBoard)
            {
                boxes.forEach(function(box){
                    box.destroySquare(true, true)
                })
                this.isResetBoard = false
            }
        }, this)))
    },

    createBoxAt (row, column, position, color) {
        let box = cc.instantiate(this.box)
        let boxCom = box.getComponent('Box')
        if(boxCom)
        {
            boxCom.row = row
            boxCom.column = column
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

        let addedDelayTime = false
        deleteBoxes.forEach(function(boxes){
            let numberBox = 0
            boxes.forEach(function(box){
                if(box instanceof Box){        
                    if(box.destroySquare(true, false))
                    {
                        if(!addedDelayTime)
                        {
                            this.delayTimeAction += (box.fadeDuration + box.delayDuration)
                            this.delayTimeAction *= this.extraSquareActionDelay
                            addedDelayTime = true
                        }
                        ++numberBox
                        if(window.gamePlayManager instanceof InfinityManager)
                            window.gamePlayManager.resetCountTimeProgress()  //ONLY use for INFINITY mode!
                    }
                }
            }, this)
            this.increScore(numberBox)
        }, this)

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

        let hasAddedDelay = false
        array.forEach(function(p){
            if(p.box != null)
            {
                let box = p.box
                if(box.row - p.count >= 0)
                {
                    if(!hasAddedDelay && box.square != null)
                    {
                        this.delayTimeAction += box.square.getComponent('Square').moveDuration
                        this.delayTimeAction *= this.extraSquareActionDelay
                        hasAddedDelay = true
                    }
                    else if(!hasAddedDelay && this.listBoxes[box.row - p.count][box.column].getComponent('Box').square != null){
                        this.delayTimeAction += box.square.getComponent('Square').moveDuration
                        this.delayTimeAction *= this.extraSquareActionDelay
                        hasAddedDelay = true
                    }

                    this.swap(box.row, box.column, box.row - p.count, box.column)
                }
            }
        }, this)

        if(array > 0)return true;
        else return false
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

        let hasAddedDelay = false
        missedPosition.forEach(function(gridPos){
            let boxCom = this.listBoxes[gridPos.row][gridPos.column].getComponent('Box')
            let positionCreate = this.grid[this.height][gridPos.column]
            let color = this.getColorInArray(this.squareTypes)
            this.createSquareAt(boxCom, positionCreate, color, boxCom.node.position)
            if(!hasAddedDelay){
                this.delayTimeAction += boxCom.square.getComponent('Square').moveDuration
                this.delayTimeAction *= this.extraSquareActionDelay
                hasAddedDelay = true
            }
        }, this)

        this.hasUpdated = true;
    },

    //@param box : Box object : box1 is mine, box2 to simulator
    simulateNewPostion(box1, box2){
        let arrayAvaiable = []
        if(typeof box2 !== "undefined" && typeof box1 !== "undefined" && box1.square != null)
        {
            let checkColor = box1.square.color
            let arrayTemp = []
            //left-right
            let cleft = box2.column - 1
            let cright = box2.column + 1
            if(box1.column < box2.column )cleft = -1
            else if(box1.column > box2.column)cright = this.width
            while(true){
                if(cleft >= 0){
                    let boxLeft = this.listBoxes[box2.row][cleft].getComponent('Box')
                    if(boxLeft.square != null && boxLeft.square.color.equals(checkColor)) arrayTemp.push(boxLeft)
                    else cleft = -1
                }
                if(cright < this.width){
                    let boxRight = this.listBoxes[box2.row][cright].getComponent('Box')
                    if(boxRight.square != null && boxRight.square.color.equals(checkColor)) arrayTemp.push(boxRight)
                    else cright = this.width
                }
                --cleft
                ++cright
                if(arrayTemp.length == 0)break;
                if(cleft < 0 && cright >= this.width){
                    if(arrayTemp.length >= 2){
                        arrayTemp.forEach(function(box){
                            arrayAvaiable.push(box)
                        })
                    }
                    break;
                } 
            }
            arrayTemp = []

            //top-down
            let rup = box2.row + 1
            let rdown = box2.row - 1
            if(box1.row < box2.row )rdown = -1
            else if(box1.row > box2.row)rup = this.height
            while(true){
                if(rup < this.height){
                    let boxUp = this.listBoxes[rup][box2.column].getComponent('Box')
                    if(boxUp.square != null && boxUp.square.color.equals(checkColor)) arrayTemp.push(boxUp)
                    else rup = this.height
                }
                if(rdown >= 0){
                    let boxDown = this.listBoxes[rdown][box2.column].getComponent('Box')
                    if(boxDown.square != null && boxDown.square.color.equals(checkColor)) arrayTemp.push(boxDown)
                    else rdown = -1
                }
                ++rup
                --rdown
                if(arrayTemp.length == 0)break;
                if(rdown < 0 && rup >= this.height){
                    if(arrayTemp.length >= 2){
                        arrayTemp.forEach(function(box){
                            arrayAvaiable.push(box)
                        })
                    }
                    break;
                } 
            }


            //@TODO: only for test result
            // arrayAvaiable.forEach(function(box){
            //         console.log("Scale test")
            //         box.square.runAction(cc.scaleBy(1, 0.7, 0.7))
            // })
            
        }
        return arrayAvaiable
    },

    findAvaiableStep(){
        let arrayAvaiable = []

        for(let row = 0; row < this.height - 1; row++)
        {
            for(let col = 0; col < this.width - 1; col++)
            {
                let boxMain = this.listBoxes[row][col].getComponent('Box')

                if(col > 0){
                    let boxLeft = this.listBoxes[row][col-1].getComponent('Box')
                    if(typeof boxLeft !== "undefined"){
                        let simu = this.simulateNewPostion(boxMain, boxLeft)
                        if(simu.length > 0)arrayAvaiable.push(new DirectionAvaiable(boxMain, 'left', simu.length))
                    }
                }
                if(col < this.width - 1){
                    let boxRight = this.listBoxes[row][col+1].getComponent('Box')
                    if(typeof boxRight !== "undefined"){
                        let simu = this.simulateNewPostion(boxMain, boxRight)
                        if(simu.length > 0)arrayAvaiable.push(new DirectionAvaiable(boxMain, 'right', simu.length))
                    } 
                }
                if(row < this.height - 1){
                    let boxUp = this.listBoxes[row+1][col].getComponent('Box')
                    if(typeof boxUp !== "undefined"){
                        let simu = this.simulateNewPostion(boxMain, boxUp)
                        if(simu.length > 0)arrayAvaiable.push(new DirectionAvaiable(boxMain, 'up', simu.length))
                    } 
                }
                if(row > 0)
                {
                    let boxDown = this.listBoxes[row-1][col].getComponent('Box')
                    if(typeof boxDown !== "undefined"){
                        let simu = this.simulateNewPostion(boxMain, boxDown)
                        if(simu.length > 0)arrayAvaiable.push(new DirectionAvaiable(boxMain, 'down', simu.length))
                    } 
                }
            }
        }

        // //@TODO: only for test
        // console.log("Avaiable : " + arrayAvaiable + "\nlength : " + arrayAvaiable.length)
        // arrayAvaiable.forEach(function(DA){
        //     console.log(DA)
        //     DA.box.square.runAction(cc.scaleTo(1, 0.5, 0.5))
        // })

        return arrayAvaiable
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
            if(square1 != null){
                square1.moveToPosition(position2)
            }
        }

        if(box2.square != null)
        {
            let square2 = box2.square.getComponent('Square')
            if(square2 != null){
                square2.moveToPosition(position1)
            }
        }

        //change index
        let tempSquare = box1.square
        box1.square = box2.square
        box2.square = tempSquare

    },

    increScore(numberBox){
        if(numberBox < 3)return

        let incre = this.minScore
        for(let i = 3; i < numberBox; ++i)
            incre+=incre
        this.score += incre
        console.log("Received : " + incre + " points")
        if(this.textScore != null)
            this.textScore.string = this.titleForScore + this.score.toString()
    },

    getTextSequenceDelayTime(textObject, textStr, delay){
        let sequence = cc.sequence(cc.callFunc(function(){
            if(typeof textObject !== "undefined" && textObject!=null){
                textObject.string = textStr
                textObject.node.opacity = 255
                textObject.node.runAction(cc.fadeTo(delay * 0.75, 0))
            }
        }, this), cc.delayTime(delay))
        return sequence
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
