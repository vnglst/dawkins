var Tree = function () {

    var Gene = function(value, range) {
        this.value = value;
        this.range = range;
        var mutValue = this.range / 5;
        
        this.randomize = function () {
            this.value = HelperTools.random(this.range);
        };
        
        this.mutate = function() {
            this.value += (HelperTools.random(mutValue) - mutValue/2);
        };
    };

    this.genePool = {
        angle1: new Gene(45, 360),
        angle2: new Gene(45, 360),
        trunk: new Gene(20, 70),
        startDepth: new Gene(9, 13),
        growthFactor1: new Gene(0.8, 2),
        growthFactor2: new Gene(0.8, 2)
        };
    
    this.randomize = function () {
        for (var g in this.genePool)
        {
            this.genePool[g].randomize();
        }
    };

    this.mutate = function () {
       var mutateGene = Math.round(HelperTools.random(Object.size(this.genePool)));
       var counter = 0;
       for (var g in this.genePool)
       {
           if (counter == mutateGene){
               console.log("Before "+g+" "+this.genePool[g].value);
               this.genePool[g].mutate();
               console.log("After "+g+" "+this.genePool[g].value);
           }
           counter++;
       }
    };

    this.draw = function (targetCanvas) {
        var startX = 200 / 2;
        var startY = 200 / 2;
        this.drawBranch(targetCanvas, this.genePool.trunk.value, startX, startY, 90, this.genePool.startDepth.value);
    };

    this.drawBranch = function (targetCanvas, branchSize, startX, startY, angle, depth) {
        
        var endX = startX - branchSize * Math.cos(angle * Math.PI / 180),
            endY = startY - branchSize * Math.sin(angle * Math.PI / 180),
            newAngle,
            growthFactor;

        targetCanvas.lineWidth = 1;
        targetCanvas.beginPath();
        targetCanvas.moveTo(startX, startY);
        targetCanvas.lineTo(endX, endY);
        targetCanvas.stroke();

        // if iteration number (depth) is even, then use angle1 and growthFactor1
        if (Math.round(depth) % 2 === 0) {
            newAngle = this.genePool.angle1.value;
            growthFactor = this.genePool.growthFactor1.value;
        }
        else { // oneven
            newAngle = this.genePool.angle2.value;
            growthFactor = this.genePool.growthFactor2.value;
        }

        if (depth > 1) {
            this.drawBranch(targetCanvas, branchSize * growthFactor, endX, endY, angle - newAngle, depth - 1);
            this.drawBranch(targetCanvas, branchSize * growthFactor, endX, endY, angle + newAngle, depth - 1);
        }
    };
};

$('document').ready(function () {

    var tree1 = new Tree(),
        tree2 = new Tree(),
        tree3 = new Tree(),
        tree4 = new Tree();
	
	tree2.mutate();
	tree3.mutate();
	tree4.mutate();

    // Gets and clears a canvas with id and draws a tree on it 
    function drawTreeOnCanvasId(tree, id) {
        var canvas = document.getElementById(id);
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tree.draw(ctx);
        }
    }

    // Draws the 4 trees on the 4 canvases
    function drawTrees() {
        drawTreeOnCanvasId(tree1, 'canvas1');
        drawTreeOnCanvasId(tree2, 'canvas2');
        drawTreeOnCanvasId(tree3, 'canvas3');
        drawTreeOnCanvasId(tree4, 'canvas4');
    }

    drawTrees();

    // Mutates one gene based on the genepool in the tree object
    function mutateBasedOn(tree) {
        tree1 = clone(tree);
        tree2 = clone(tree);
        tree3 = clone(tree);
        tree4 = clone(tree);
        tree2.mutate();
        tree3.mutate();
        tree4.mutate();
        drawTrees();
    }

    $('#canvas1').click(function () {
        mutateBasedOn(tree1);
    });

    $('#canvas2').click(function () {
        mutateBasedOn(tree2);
    });

    $('#canvas3').click(function () {
        mutateBasedOn(tree3);
    });

    $('#canvas4').click(function () {
        mutateBasedOn(tree4);
    });

    $('.js-randomize').click(function () {
        tree1.randomize();
        tree2.randomize();
        tree3.randomize();
        tree4.randomize();
        drawTrees();
    });


});