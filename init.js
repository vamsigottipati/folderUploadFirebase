let admin = require("firebase-admin");
let { spawn } = require('child_process')

// change these values

let folderName = './test' 
let uploadFolderName = 'random'
let bucktName = 'portfolio-vamsi.appspot.com'
let serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucktName
});
let bucket = admin.storage().bucket(bucktName);



let listScript = spawn('find', [folderName, '-type', 'f', '-follow', '-print'])

let op = ''
let proceedStatus = true;

listScript.stdout.on('data', (msg) => {
    op = op + msg.toString();
})

listScript.stderr.on('data', (msg) => {
    proceedStatus = false;
})

const uploader = async (b, e) => {
    await b.upload(e, {
        destination: uploadFolderName + '/' + e.substring(folderName.length + 1, e.length)
    })
    console.log(e + '  uploaded')
}

listScript.on('exit', (code) => {

    let Temparr = op.split('\n')
    let arr = Temparr.splice(0, Temparr.length - 1)
    
    arr.forEach(e => {
        // console.log(e)
        uploader(bucket, e).catch(console.error)
    })

})