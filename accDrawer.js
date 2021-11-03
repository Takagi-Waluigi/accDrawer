function requestMotionPermission(){
    if ( DeviceMotionEvent &&
         typeof DeviceMotionEvent.requestPermission === 'function' ){
        DeviceMotionEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
            alert("enable to use device motion");
        } else {
            console.log("Perrmission not granted!");
            alert("Perrmission not granted!");
        }
        }).catch(console.error)
  
    } else {
        console.log("detected other device. so adding listener...");
    }
  
}

let accPos, rotPos, pAccPos, pRotPos;
let rotVel;

const BUFFER_SIZE = 10;
let acc_bufferX = [];
let acc_bufferY = [];
let acc_bufferZ = [];

function setup()
{
    createCanvas(windowWidth, windowHeight);

    accPos = createVector(width/2, height/2);
    rotPos = createVector(width/2, height/2);
    pAccPos = createVector(width/2, height/2);
    pRotPos = createVector(width/2, height/2);
    rotVel = createVector(0, 0);

    for(let i = 0; i < BUFFER_SIZE; i ++)
    {
        acc_bufferX[i] = 0.0;
        acc_bufferY[i] = 0.0;
        acc_bufferZ[i] = 0.0;
    }
}

function draw()
{
   // background(200);
    fill(255, 5);
    rect(0, 0, width, height);

    //Smoothing Value
    for(let i = BUFFER_SIZE - 1; i > 0; i --)
    {
        acc_bufferX[i] = acc_bufferX[i-1];
        acc_bufferY[i] = acc_bufferY[i-1];
        acc_bufferZ[i] = acc_bufferZ[i-1];

    }

    acc_bufferX[0] = accelerationX;
    acc_bufferY[0] = accelerationY;
    acc_bufferZ[0] = accelerationZ;
    
    let avgX = 0;
    let avgY = 0;
    let avgZ = 0;

    for(let i = 0; i < BUFFER_SIZE; i ++)
    {
        avgX += acc_bufferX[i];
        avgY += acc_bufferY[i];
        avgZ += acc_bufferZ[i];

    }

    avgX = avgX / BUFFER_SIZE;
    avgY = avgY / BUFFER_SIZE;
    avgZ = avgZ / BUFFER_SIZE;

    //Debug(Show Value)
    /*
    fill(0);
    textSize(100);
    text("accX: " + avgX, 100, 100);
    text("accY: " + avgY, 100, 250);
    text("accZ: " + avgZ, 100, 400);
    text("rotX: " + rotationX, 100, 550);
    text("rotY: " + rotationY, 100, 700);
    text("rotZ: " + rotationZ, 100, 850);
    */

    //Calculate Position
    accPos.x += avgX;
    accPos.y += avgY;

    if(accPos.x < 0)     accPos.x = width;
    if(accPos.x > width) accPos.x = 0;
    if(accPos.y < 0)      accPos.y = height;
    if(accPos.y > height) accPos.y = 0;

    let distAcc = dist(accPos.x, accPos.y, pAccPos.x, pAccPos.y);
    let sizeAcc = map(distAcc, 0, 10.0, 20.0, 500.0);
    fill(0);
    ellipse(accPos.x, accPos.y, sizeAcc, sizeAcc);

    pAccPos = accPos;

    rotVel.x = map(rotationY, -90, 90, -5.0, 5.0);
    rotVel.y = map(rotationX, -90, 90, -5.0, 5.0);

    rotPos.x += rotVel.x;
    rotPos.y += rotVel.y;

    if(rotPos.x < 0) rotPos.x = width;
    if(rotPos.x > width) rotPos.x = 0;
    if(rotPos.y < 0) rotPos.y = height;
    if(rotPos.y > height) rotPos.y = 0;

    let distRot = dist(rotPos.x, rotPos.y, pRotPos.x, pRotPos.y);
    let sizeRot = map(distRot, 0, 10.0, 20.0, 500.0);

    fill(0);
    ellipse(rotPos.x, rotPos.y, sizeRot, sizeRot);
    
    pRotPos = rotPos;

}