var edge = (function () {
    'use strict';
    var qPI = Math.PI/4;
    var hPI = Math.PI/2;
    var tPI = Math.PI/3;
    var sPI = Math.PI/6;
    /**
     * Creates a camera to view the 3d World
     * @constructor
     * @param {number} x - x Coordinate of the Camera
     * @param {number} y - y Coordinate of the Camera
     * @param {number} z - z Coordinate of the Camera
     * @param {number[]} d - angular direction camera is facing, all angles are in radians.  
     * @param {number} d[0] - rotation from x axis in y plane. 
     * @param {number} d[1] - rotation from x axis in z plane.
     * @param {number} d[2] - rotation from y axis in z plane.
     * @param {number} vvA - vertical viewing angle of Camera
     * @param {number} hvA - horizontal viewing angle of Camera
     * @param {number} zvD - z directional viewing distance
     * @param {Object} [flags] - an object with a couple flags to enable.
     */

    var Camera = function(x,y,z,d,vvA,hvA,zvD, flags){
        //Assign all of the parameters
        this.x = x;
        this.y = y;
        this.z = z;
        this.d = d;
        this.vvA = vvA;
        this.hvA = hvA;
        this.zvD = zvD;
        //make an object holding this so I can access it in other scopes.
        var self = this;
        /**
         * @constructor
         */
        this.ViewRect = function(){
            //set width and height based on viewing angle and z distance for a rectangle
            this.width = 2 * self.zvD / Math.tan(self.hvA / 2);
            this.height = 2 * self.zvD / Math.tan(self.vvA / 2);
            //initalize the point that is the center of the farthest viewing rectangle.
            this.x = self.x;
            this.y = self.y;
            this.z = self.zvD;
            //rotate from the x axis on the x | y plane 
            var ang = Math.atan(this.y/this.x);
            var cAng = Math.cos(ang);
            var sAng = Math.sin(ang);
            this.x = cAng*Math.cos(self.d[0])+sAng*Math.sin(self.d[0]);
            this.y  = cAng*Math.sin(self.d[0])+Math.cos(self.d[0])*sAng;
            //rotate from the x axis on the x | z plane
            ang = Math.atan(this.z/this.x);
            cAng = Math.cos(ang);
            sAng = Math.sin(ang);
            this.x = cAng*Math.cos(self.d[1]) + sAng*Math.sin(self.d[1]);
            this.z = cAng*Math.sin(self.d[1])+Math.cos(self.d[1])*sAng;
            //rotate from the z axis on the z | y plane
            ang = Math.atan(this.y/this.z);
            cAng = Math.cos(ang);
            sAng = Math.sin(ang);
            this.z = cAng * Math.cos(self.d[2]) + sAng * Math.sin(self.d[2]);
            this.y = cAng * Math.sin(self.d[2]) + Math.cos(self.d[2]) * sAng;
            this.rect = {
                zZ: this.z,
                minX: this.x - this.width/2,
                minY: this.y - this.height/2,
                maxX: this.x + this.width/2,
                maxY: this.y + this.height/2,
                get mXS(){ return this.minX/this.zZ;},
                get mYS(){ return this.minY/this.zZ;},
                get MXS(){ return this.maxX/this.zZ;},
                get MYS(){ return this.maxY/this.zZ;}
            };

        this.slope = [this.rect.minX/this.z, this.y/this.z, 1/*this.z/this.z*/]; //I don't really know what this would be useful for...
        this.draw = function (tdPA, context) {
            var ct = context;
            var wr = world;

        };

        };
        this.vr = new this.ViewRect();
        this.moveTo = function(x,y,z){
            this.x = x;
            this.y = y;
            this.z = z;
            self = this;
            this.vr = new this.ViewRect();
        };
        this.rotateTo = function(xAng,yAng,zAng){
            this.d = [xAng,yAng,zAng];
            self = this;
            this.vr = new this.ViewRect();
        };
        this.create2dPathArray = function(World){
            this.tdpa = [];
            var vr = this.vr;
            var woA = World.objectArray;
            //iterate through every object in the world Array
            for(var i = 0; i < woA.length; i ++){
                var currentVertices = woA[i].vertices;
                //iterate through all the vertices
                var thisObs2dPathArray = [];
                for(var j = 0; j < currentVertices.length; j ++){
                    var cVertex  =currentVertices[j];
                    var cvZ = cVertex[2];
                    var vrmx = cvZ*vr.rect.mXS;
                    var vrmy = cvZ*vr.rect.mYS;
                    thisObs2dPathArray.push([cVertex[0]-vrmx,cVertex[1]-vrmy]);
                }
                this.tdpa.push(thisObs2dPathArray);
            }
        };
        this.render = function(){
            this.vr.draw(this.tdpa);
        };

    };
    /**
     * A light for this dark world
     * @constructor
     */
    var Light = function(){};
    /**
     * The world which everything resides in...
     * @constructor
     * @param {number} size - the Size of the world(a cube)
     * @param {number} [accuracy] - the number of points in a world unit, defaults to 1
     */
    var World = function(size, accuracy){
        accuracy = (isNaN(parseInt(accuracy)) ? null : parseInt(accuracy));
        if(typeof accuracy !== 'number'){
            accuracy = 1;
        }
        this.biggestX = this.biggestY = this.biggestZ = size / 2 * compression;
        this.smallestX = this.smallestY = this.smallestZ = -1 * size / 2 * compression;
        this.objectArray = [];
        this.addObject = function(ObjectThing){
            this.objectArray.push(ObjectThing);
        };
        this.Presets = {
            create: function(objectType){
                //stuff
                var argvs = Array.prototype.slice.call(arguments,1);
                if(objectType === "Cube"){
                    var r = argvs[1];
                    var rot  = argvs[2];
                    var xRot = rot[0];
                    var yRot = rot[1];
                    var zRot = rot[2];
                    this.center = argvs[0];
                    var x = this.center[0];
                    var y = this.center[1];
                    var z = this.center[2];
                    this.vertices = [
                        [x + r * Math.cos(qPI + xRot) * Math.sin(qPI + zRot), y + Math.sqrt(Math.pow(r, 2) / 3), z + Math.sqrt(Math.pow(r, 2) / 3)],
                        [x + Math.sqrt(Math.pow(r, 2) / 3), y - Math.sqrt(Math.pow(r, 2) / 3), z + Math.sqrt(Math.pow(r, 2) / 3)],
                        [x + Math.sqrt(Math.pow(r, 2) / 3), y + Math.sqrt(Math.pow(r, 2) / 3), z - Math.sqrt(Math.pow(r, 2) / 3)],
                        [x - Math.sqrt(Math.pow(r, 2) / 3), y + Math.sqrt(Math.pow(r, 2) / 3), z + Math.sqrt(Math.pow(r, 2) / 3)],
                        [x - Math.sqrt(Math.pow(r, 2) / 3), y - Math.sqrt(Math.pow(r, 2) / 3), z + Math.sqrt(Math.pow(r, 2) / 3)],
                        [x + Math.sqrt(Math.pow(r, 2) / 3), y - Math.sqrt(Math.pow(r, 2) / 3), z - Math.sqrt(Math.pow(r, 2) / 3)],
                        [x - Math.sqrt(Math.pow(r, 2) / 3), y + Math.sqrt(Math.pow(r, 2) / 3), z - Math.sqrt(Math.pow(r, 2) / 3)],
                        [x - Math.sqrt(Math.pow(r, 2) / 3), y - Math.sqrt(Math.pow(r, 2) / 3), z - Math.sqrt(Math.pow(r, 2) / 3)]
                        ];
                        
                    this.edges = [
                        [0,1],
                        [0,2],
                        [0,3],
                        [1,4],
                        [1,5],
                        [2,5],
                        [2,6],
                        [3,4],
                        [3,6],
                        [4,7],
                        [5,7],
                        [6,7]
                    ];
                    this.faces = [
                        [0,1,4,3],
                        [6,3,4,7],
                        [2,0,3,6],
                        [0,2,5,1],
                        [2,6,7,5],
                        [1,5,7,4]
                    ];
                }
            }
        };
    };
    var reallyPointlessTemporaryObjectUsedToComplyWithLinterAndGivenAReallyLongVariableNameInCamelCaseBecauseWhyNotAndIHaveAutocompleteSoItDoesntMatterAnyway =  {
        Camera: Camera,
        Light: Light,
        World: World
    };
    return reallyPointlessTemporaryObjectUsedToComplyWithLinterAndGivenAReallyLongVariableNameInCamelCaseBecauseWhyNotAndIHaveAutocompleteSoItDoesntMatterAnyway;
})();

/*Pseudocode for making all points in sphere:
var sphere_points = [];
var r2 = Math.pow(r,2);
for(var i = x - r; i ++; i <= x + r){
    var i2 = (Math.pow(i,2)-Math.pow(x,2));
    for(var j = y - r; j++; j <= y + r){
        var j2 = (Math.pow(j,2)-Math.pow(y,2));
        if(i2+j2+k2 == r2){
            sphere_points.append()
        }
    }
}

*/