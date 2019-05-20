window.__require=function t(e,i,o){function n(r,h){if(!i[r]){if(!e[r]){var a=r.split("/");if(a=a[a.length-1],!e[a]){var u="function"==typeof __require&&__require;if(!h&&u)return u(a,!0);if(s)return s(a,!0);throw new Error("Cannot find module '"+r+"'")}}var c=i[r]={exports:{}};e[r][0].call(c.exports,function(t){return n(e[r][1][t]||t)},c,c.exports,t,e,i,o)}return i[r].exports}for(var s="function"==typeof __require&&__require,r=0;r<o.length;r++)n(o[r]);return n}({Box:[function(t,e,i){"use strict";cc._RF.push(e,"5e420jA5GpNkKYhK9JdObOh","Box"),cc.Class({extends:cc.Component,properties:{square:{default:null,type:cc.Node},shields:{default:[],type:Node},column:{default:0,visible:!1},row:{default:0,visible:!1},fadeDuration:.75,delayDuration:.75},onLoad:function(){this.isMoved=!1,this.node.on("touchstart",function(t){this.touchBegin=t.touch.getLocation(),this.isMoved=!1},this),this.node.on("touchmove",function(t){if(!this.isMoved&&null!=this.square&&!this.square.getComponent("Square").moving&&!window.game.aiIsControlling&&window.game.isStarted){var e=t.touch.getLocation(),i=cc.v2(e.x-this.touchBegin.x,e.y-this.touchBegin.y),o=window.game;o.grid;if(Math.abs(i.x)>Math.abs(i.y)){if(Math.abs(i.x)>=o.sizeSquare.width/3){var n=null;null!=(n=i.x<0?o.getIndexLeftOf(this):o.getIndexRightOf(this))&&0==n.isNone()&&(window.gamePlayManager.decreStep(1),this.goTo(n.row,n.column))}}else if(Math.abs(i.y)>=o.sizeSquare.height/3){var s=null;s=i.y<0?o.getIndexDownOf(this):o.getIndexUpOf(this),console.log(s.row+" - "+s.column),null!=s&&0==s.isNone()&&(window.gamePlayManager.decreStep(1),this.goTo(s.row,s.column))}}},this),this.node.on("touchend",function(t){if(0==this.isMoved&&null!=this.square){var e=this.square.getComponent("Square");null==e&&void 0==e||e.moveToPosition(this.node.position)}this.isMoved=!1},this)},goTo:function(t,e){if(arguments.length>2&&void 0!==arguments[2]&&arguments[2])window.game.swap(this.row,this.column,t,e);else{var i=window.game.listBoxes[t][e].getComponent("Box"),o=window.game.simulateNewPostion(this,i);if(console.log("simulator lenght : "+o.length),o.length>0)window.game.swap(this.row,this.column,t,e);else console.log("not match -> revert"),window.game.simulateNewPostion(i,this).length>0?window.game.swap(this.row,this.column,t,e):console.log("all not match ")}this.isMoved=!0},destroySquare:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(null!=this.square&&!this.square.getComponent("Square").died){if(e)return this.square.getComponent("Square").died=!0,this.square.runAction(cc.removeSelf(!0)),this.square=null,this.shields.forEach(function(t){t.destroy()}),this.shields.splice(0,this.shields.length),!0;if(this.shields.length>0){var i=cc.sequence(cc.scaleBy(window.gamePlayManager.destroyShieldDuration,2),cc.removeSelf(!0),cc.callFunc(function(){this.shields.pop(),window.gamePlayManager.currentShields--},this));if(this.shields[this.shields.length-1].runAction(i),!t)return!1}var o=cc.sequence(cc.fadeTo(this.fadeDuration,0),cc.delayTime(this.delayDuration),cc.removeSelf(!0),cc.callFunc(function(){this.square=null},this));return o.setTag(-1),this.square.getComponent("Square").died=!0,this.square.runAction(o),!0}},addShield:function(t){null!=t&&(this.shields.push(t),t.position=window.game.grid[this.row][this.column],window.game.node.addChild(t,30))}}),cc._RF.pop()},{}],ExitBtn:[function(t,e,i){"use strict";cc._RF.push(e,"2110f4mzjdLlr6pfUPgCzzp","ExitBtn"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){this.node.on("click",function(t){cc.director.loadScene("Home")},this)}}),cc._RF.pop()},{}],Game:[function(t,e,i){"use strict";cc._RF.push(e,"d1b46wtcHNIvIu+XTBcbxCT","Game");var o=function(t){return t&&t.__esModule?t:{default:t}}(t("./Box.js"));function n(t,e){this.row=t,this.column=e}function s(t,e,i){this.direction=e,this.box=t,this.score=i}n.prototype.isNone=function(){return-1==this.row||-1==this.column},s.prototype.handle=function(){if(this.box instanceof o.default){var t=new n(-1,-1);"left"==this.direction&&(t=window.game.getIndexLeftOf(this.box)),"right"==this.direction&&(t=window.game.getIndexRightOf(this.box)),"up"==this.direction&&(t=window.game.getIndexUpOf(this.box)),"down"==this.direction&&(t=window.game.getIndexDownOf(this.box)),this.box.goTo(t.row,t.column,!0)}},cc.Class({extends:cc.Component,properties:{width:10,height:10,delayTimeReset:2,aiControll:!1,timeAIDelay:1,square:{default:null,type:cc.Prefab},box:{default:null,type:cc.Prefab},sizeSquare:{default:new cc.Size},squareTypes:{default:[],type:cc.Color},button:{default:null,type:cc.Button},listBoxes:new Array,grid:new Array,textCountStart:{default:null,type:cc.Label},textScore:{default:null,type:cc.Label},titleForScore:"Score: ",minScore:30},onLoad:function(){for(this.isStarted=!1,this.isResetBoard=!1,this.hasUpdated=!1,this.delayTimeAction=0,this.aiIsControlling=!1,this.score=0,this.button.node.on("click",function(t){this.aiControll=!this.aiControll,this.aiIsControlling=!this.aiIsControlling},this),this.getGrid(),this.generateSquares(),window.game=this;0==this.findAvaiableStep().length;)console.log("reset"),this.resetBoard();var t=this.getTextSequenceDelayTime(this.textCountStart,"3",1),e=this.getTextSequenceDelayTime(this.textCountStart,"2",1),i=this.getTextSequenceDelayTime(this.textCountStart,"1",1),o=this.getTextSequenceDelayTime(this.textCountStart,"Start!",1),n=cc.sequence(t,e,i,o,cc.callFunc(function(){console.log("startGame"),this.textCountStart.node.destroy(),this.isStarted=!0},this));this.node.runAction(n)},update:function(t){if(this.isStarted){this.hasUpdated=!1,this.checkMatchAll();this.updatePositionSquare();if(this.updateNewSquare(),this.hasUpdated){var e=this.findAvaiableStep();this.isResetBoard||0!=e.length?e.length>0&&(this.aiControll&&0==this.delayTimeAction&&(this.aiControll=!1,this.node.runAction(cc.sequence(cc.delayTime(this.timeAIDelay),cc.callFunc(function(){if(this.aiIsControlling){var t=e[0];e.forEach(function(e){t.score<e.score&&(t=e)}),t.handle(),console.log("AI handle score : "+t.score),this.aiControll=!0}},this)))),this.isResetBoard=!1):(console.log("reset"),this.isResetBoard=!0),this.isResetBoard&&this.resetBoard()}this.delayTimeAction-=t,this.delayTimeAction<0&&(this.delayTimeAction=0)}},getGrid:function(){new cc.size(this.node.width,this.node.height);for(var t=cc.v2(0,0),e=t.x-this.sizeSquare.width*this.width/2+this.sizeSquare.width/2,i=e,o=t.y-this.sizeSquare.height*this.height/2+this.sizeSquare.height/2,n=0;n<this.height+1;n++){this.grid.push(new Array);for(var s=0;s<this.width;s++)this.grid[n].push(cc.v2(i,o)),i+=this.sizeSquare.width;i=e,o+=this.sizeSquare.height}},generateSquares:function(){for(var t=0;t<this.height;t++){this.listBoxes.push(new Array);for(var e=0;e<this.width;e++){var i=this.grid[t][e],o=this.getColorInArray(this.squareTypes),n=this.createBoxAt(t,e,i,o);this.listBoxes[t].push(n)}}},resetBoard:function(){for(var t=[],e=0;e<this.height;e++)for(var i=0;i<this.width;i++){var o=this.listBoxes[e][i].getComponent("Box");if(null==o.square)return;var n=o.square.getComponent("Square");if(n.moving||n.died)return;t.push(o)}console.log("reset"),this.node.runAction(cc.sequence(cc.delayTime(this.delayTimeReset),cc.callFunc(function(){this.isResetBoard&&(t.forEach(function(t){t.destroySquare(!0,!0)}),this.isResetBoard=!1)},this)))},createBoxAt:function(t,e,i,o){var n=cc.instantiate(this.box),s=n.getComponent("Box");return s&&(s.row=t,s.column=e,this.createSquareAt(s,i,o)),n.setPosition(i),this.node.addChild(n,10),n},createSquareAt:function(t,e,i){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:cc.v2(-1,-1);t.square=cc.instantiate(this.square),t.square.color=i,t.square.setPosition(e),this.node.addChild(t.square,20),o.equals(cc.v2(-1,-1))||o.equals(e)||t.square.getComponent("Square").moveToPosition(o)},getColorInArray:function(t){return 0==t.length?cc.Color.WHITE:t[Math.floor(Math.random()*t.length)]},checkMatchAll:function(){for(var t=new Array,e=function(e,i,o){var n=o.length;return null==e.square||null==i.square||e.square.getComponent("Square").died||i.square.getComponent("Square").died?n<3?o.length>0&&o.splice(0,o.length):n>=3&&(t.push(o),o=new Array):e.square.color.equals(i.square.color)?(0==n&&o.push(e),o.push(i)):n<3?o.length>0&&o.splice(0,o.length):n>=3&&(t.push(o),o=new Array),o},i=0;i<this.height;i++){for(var n=new Array,s=1;s<this.width;s++){0,n=e(this.listBoxes[i][s-1].getComponent("Box"),this.listBoxes[i][s].getComponent("Box"),n)}n.length>=3&&s==this.width&&t.push(n),n=new Array}for(var r=0;r<this.width;r++){for(var h=new Array,a=1;a<this.height;a++){0,h=e(this.listBoxes[a-1][r].getComponent("Box"),this.listBoxes[a][r].getComponent("Box"),h)}h.length>=3&&a==this.height&&t.push(h),h=new Array}return t.forEach(function(t){var e=0;t.forEach(function(t){t instanceof o.default&&t.destroySquare(!0,!1)&&++e}),this.increScore(e)},this),t.length>0},updatePositionSquare:function(){function t(t,e){this.box=t,this.count=e}for(var e=new Array,i=0;i<this.width;i++)for(var o=0,n=0;n<this.height;n++){var s=this.listBoxes[n][i].getComponent("Box");if(null==s.square&&n<this.height-1)++o;else if(0!=o){var r=new t(s,o);e.push(r)}}var h=!1;return e.forEach(function(t){if(null!=t.box){var e=t.box;e.row-t.count>=0&&((h||null==e.square)&&(h||null==this.listBoxes[e.row-t.count][e.column].getComponent("Box").square)||(this.delayTimeAction+=e.square.getComponent("Square").moveDuration,h=!0),this.swap(e.row,e.column,e.row-t.count,e.column))}},this),e>0},updateNewSquare:function(){for(var t=new Array,e=0;e<this.width;e++)for(var i=0;i<this.height;i++){var o=this.listBoxes[i][e].getComponent("Box");if(null==o.square)t.push(new n(o.row,o.column));else if(o.square.getComponent("Square").died)return}var s=!1;t.forEach(function(t){var e=this.listBoxes[t.row][t.column].getComponent("Box"),i=this.grid[this.height][t.column],o=this.getColorInArray(this.squareTypes);this.createSquareAt(e,i,o,e.node.position),s||(this.delayTimeAction+=e.square.getComponent("Square").moveDuration,s=!0)},this),this.hasUpdated=!0},simulateNewPostion:function(t,e){var i=[];if(void 0!==e&&void 0!==t&&null!=t.square){var o=t.square.color,n=[],s=e.column-1,r=e.column+1;for(t.column<e.column?s=-1:t.column>e.column&&(r=this.width);;){if(s>=0){var h=this.listBoxes[e.row][s].getComponent("Box");null!=h.square&&h.square.color.equals(o)?n.push(h):s=-1}if(r<this.width){var a=this.listBoxes[e.row][r].getComponent("Box");null!=a.square&&a.square.color.equals(o)?n.push(a):r=this.width}if(--s,++r,0==n.length)break;if(s<0&&r>=this.width){n.length>=2&&n.forEach(function(t){i.push(t)});break}}n=[];var u=e.row+1,c=e.row-1;for(t.row<e.row?c=-1:t.row>e.row&&(u=this.height);;){if(u<this.height){var l=this.listBoxes[u][e.column].getComponent("Box");null!=l.square&&l.square.color.equals(o)?n.push(l):u=this.height}if(c>=0){var d=this.listBoxes[c][e.column].getComponent("Box");null!=d.square&&d.square.color.equals(o)?n.push(d):c=-1}if(++u,--c,0==n.length)break;if(c<0&&u>=this.height){n.length>=2&&n.forEach(function(t){i.push(t)});break}}}return i},findAvaiableStep:function(){for(var t=[],e=0;e<this.height-1;e++)for(var i=0;i<this.width-1;i++){var o=this.listBoxes[e][i].getComponent("Box");if(i>0){var n=this.listBoxes[e][i-1].getComponent("Box");if(void 0!==n){var r=this.simulateNewPostion(o,n);r.length>0&&t.push(new s(o,"left",r.length))}}if(i<this.width-1){var h=this.listBoxes[e][i+1].getComponent("Box");if(void 0!==h){var a=this.simulateNewPostion(o,h);a.length>0&&t.push(new s(o,"right",a.length))}}if(e<this.height-1){var u=this.listBoxes[e+1][i].getComponent("Box");if(void 0!==u){var c=this.simulateNewPostion(o,u);c.length>0&&t.push(new s(o,"up",c.length))}}if(e>0){var l=this.listBoxes[e-1][i].getComponent("Box");if(void 0!==l){var d=this.simulateNewPostion(o,l);d.length>0&&t.push(new s(o,"down",d.length))}}}return t},swap:function(t,e,i,o){var n=this.listBoxes[t][e].getComponent("Box"),s=this.listBoxes[i][o].getComponent("Box"),r=n.node.position,h=s.node.position;if(null!=n.square){var a=n.square.getComponent("Square");null!=a&&a.moveToPosition(h)}if(null!=s.square){var u=s.square.getComponent("Square");null!=u&&u.moveToPosition(r)}var c=n.square;n.square=s.square,s.square=c},increScore:function(t){if(!(t<3)){for(var e=this.minScore,i=3;i<t;++i)e+=e;this.score+=e,console.log("Received : "+e+" points"),null!=this.textScore&&(this.textScore.string=this.titleForScore+this.score.toString())}},getTextSequenceDelayTime:function(t,e,i){return cc.sequence(cc.callFunc(function(){void 0!==t&&null!=t&&(t.string=e,t.node.opacity=255,t.node.runAction(cc.fadeTo(.75*i,0)))},this),cc.delayTime(i))},getIndexLeftOf:function(t){if(t instanceof o.default){var e=0==t.column?-1:t.column-1;return new n(t.row,e)}},getIndexRightOf:function(t){if(t instanceof o.default){var e=t.column==this.width-1?-1:t.column+1;return new n(t.row,e)}},getIndexUpOf:function(t){if(t instanceof o.default)return new n(t.row==this.height-1?-1:t.row+1,t.column)},getIndexDownOf:function(t){if(t instanceof o.default)return new n(0==t.row?-1:t.row-1,t.column)}}),cc._RF.pop()},{"./Box.js":"Box"}],Home:[function(t,e,i){"use strict";cc._RF.push(e,"7fc86BTRx9I/L5vTtGfFN04","Home"),cc.Class({extends:cc.Component,properties:{ButtonInfinityMode:{default:null,type:cc.Button},ButtonClassicMode:{default:null,type:cc.Button},ButtonOption:{default:null,type:cc.Button}},onLoad:function(){null!=this.ButtonInfinityMode&&this.ButtonInfinityMode.node.on("click",function(t){cc.director.loadScene("Game")},this),null!=this.ButtonClassicMode&&this.ButtonClassicMode.node.on("click",function(t){},this),null!=this.ButtonOption&&this.ButtonOption.node.on("click",function(t){},this)}}),cc._RF.pop()},{}],InfinityManager:[function(t,e,i){"use strict";cc._RF.push(e,"7cfd1KWztlA0IprO2KocXvO","InfinityManager"),cc.Class({extends:cc.Component,properties:{startNumberStep:25,titleForCountStep:"Step : ",textCountStep:{default:null,type:cc.Label},shield:{default:null,type:cc.Prefab},numberShields:5,destroyShieldDuration:.4},onLoad:function(){window.gamePlayManager=this,this.currentNumberStep=this.startNumberStep,this.currentShields=this.numberShields,this.setTextForCountStep(this.currentNumberStep.toString()),this.initShields(this.numberShields)},initShields:function(t){for(var e=this,i=[],o=function(t){var o=window.game.listBoxes,s=Math.floor(Math.random()*o.length),r=o[s];if(void 0!==r){var h=Math.floor(Math.random()*r.length);if(i.find(function(t){return t.equals(cc.v2(s,h))}))console.log("dupp");else{var a=r[h];void 0!==a&&(e.createShield(a.getComponent("Box")),++t,i.push(cc.v2(s,h)))}}n=t},n=0;n<t;)o(n)},createShield:function(t){var e=cc.instantiate(this.shield);return null!=e&&(e.setContentSize(window.game.sizeSquare),t.addShield(e)),e},resetStep:function(){this.currentNumberStep=this.startNumberStep,this.setTextForCountStep(this.currentNumberStep.toString())},decreStep:function(t){this.currentNumberStep-=t,this.currentNumberStep=this.currentNumberStep<0?0:this.currentNumberStep,this.setTextForCountStep(this.currentNumberStep.toString())},defeat:function(){console.log("defeat!"),window.game.isStarted=!1},victory:function(){console.log("victory!"),window.game.isStarted=!1},setTextForCountStep:function(t){null!=this.textCountStep&&(this.textCountStep.string=this.titleForCountStep+t)},update:function(t){this.currentShields<=0&&window.game.isStarted?this.victory():0==this.currentNumberStep&&window.game.isStarted&&this.defeat()}}),cc._RF.pop()},{}],Square:[function(t,e,i){"use strict";cc._RF.push(e,"fe29fBUvYZALo9QCr20UQ8w","Square"),cc.Class({extends:cc.Component,properties:{moveDuration:.25},onLoad:function(){this.died=!1,this.moving=!1},moveToPosition:function(t){if(this.died)return!1;this.node.stopActionByTag(1);var e=cc.sequence(cc.moveTo(this.moveDuration,t),cc.callFunc(function(){this.moving=!1},this));return e.setTag(1),this.moving=!0,this.node.runAction(e),!0}}),cc._RF.pop()},{}]},{},["Box","ExitBtn","Game","Home","InfinityManager","Square"]);