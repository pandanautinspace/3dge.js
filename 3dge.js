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
            minX: this.x - this.width/2,
            minY: this.y - this.height/2,
            maxX: this.x + this.width/2,
            maxY: this.y + this.height/2
        };
        //gcd function used from: http://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction
       /*var gcd = function(a,b){
           return b ? gcd(b, a%b) : a;
       };*/
       this.slope = [[this.rect.minX/this.z, this.y/this.z, 1/*this.z/this.z*/]];
       this.draw = function (tdPA, context) {
           var ct = context;
           var wr = world;

       }

    };
    this.vr = new this.ViewRect();
    this.moveTo = function(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        var self = this;
        this.vr = new this.ViewRect();
    };
    this.rotateTo = function(xAng,yAng,zAng){
        this.d = [xAng,yAng,zAng];
        var self = this;
        this.vr = new this.ViewRect();
    };
    this.create2dPathArray = function(World){
        this.tdpa = [];
        var vr = this.vr;
        var woA = World.objectArray;
        for(var i = 0; i < woA.length; i ++){
            var currentVertices = woA[i].vertices;
            for(var j = 0; j < currentVertices.length; j ++){
                vr.
            }
        }
    };
    this.render = function(){
        this.vr.draw(this.tdpa);
    }

};
var Light = function(){};
/**
 * The world which everything resides in...
 * @constructor
 * @param {number} size - the Size of the world(a cube)
 * @param {number} [compression] - the number of points in a world unit, defaults to 1
 */
var World = function(size, compression){
    this.biggestX = this.biggestY = this.biggestZ = size / 2 * compression;
    this.smallestX = this.smallestY = this.smallestZ = -1 * size / 2 * compression;
    this.objectArray = [];
    this.addObject = function(ObjectThing){
        this.objectArray.push(ObjectThing);
    };
};

var Presets = function(objectType, x, y, z, r, rotationX, rotationY, rotationZ){
    //stuff
    if(objectType === "Cube"){
        this.center = [x,y,z];
        this.vertices = [
            [x + Math.sqrt(Math.pow(r, 2) / 3), y + Math.sqrt(Math.pow(r, 2) / 3), z + Math.sqrt(Math.pow(r, 2) / 3)],
            [x + Math.sqrt(Math.pow(r, 2) / 3), y - Math.sqrt(Math.pow(r, 2) / 3), z + Math.sqrt(Math.pow(r, 2) / 3)],
            [x + Math.sqrt(Math.pow(r, 2) / 3), y + Math.sqrt(Math.pow(r, 2) / 3), z - Math.sqrt(Math.pow(r, 2) / 3)],
            [x - Math.sqrt(Math.pow(r, 2) / 3), y + Math.sqrt(Math.pow(r, 2) / 3), z + Math.sqrt(Math.pow(r, 2) / 3)],
            [x - Math.sqrt(Math.pow(r, 2) / 3), y - Math.sqrt(Math.pow(r, 2) / 3), z + Math.sqrt(Math.pow(r, 2) / 3)],
            [x + Math.sqrt(Math.pow(r, 2) / 3), y - Math.sqrt(Math.pow(r, 2) / 3), z - Math.sqrt(Math.pow(r, 2) / 3)],
            [x - Math.sqrt(Math.pow(r, 2) / 3), y + Math.sqrt(Math.pow(r, 2) / 3), z - Math.sqrt(Math.pow(r, 2) / 3)],
            [x - Math.sqrt(Math.pow(r, 2) / 3), y - Math.sqrt(Math.pow(r, 2) / 3), z - Math.sqrt(Math.pow(r, 2) / 3)]
            ];
            
        this.edges = [
            [this.vertices[0],this.vertices[1]],
            [this.vertices[1],]
        ];
    }
};

