import http from 'http';
import screenshot from 'screenshot-desktop';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp'

let cur_resolution_size = [-1, -1];

const http_svr = http.createServer((req, res)=>{
    console.log(req.method, req.url);
    if (req.url == "/"){
        const home_page = fs.readFileSync('./assets/index.html', {encoding: "utf8"});
        res.end(home_page);
    }
    else if (req.url.startsWith("/assets")){
        const asset_to_send = fs.readFileSync(path.join("./assets", path.basename(req.url)), {encoding: "utf8"});
        res.end(asset_to_send);
    }
    else if (req.url == "/get_server_info" && req.method == "POST"){
        res.end(JSON.stringify({"ip": "127.0.0.1", "port": 5600}));
    }
    else if (req.url == "/stream"){
        res.writeHead(200, {
            "content-type": "multipart/x-mixed-replace; boundary=SS_STREAM_SCREEN5600",
            "connection": "keep-alive",
            "cache-control": "no-cache"
        });
        
        let streaming = true;

        async function send_screen(){
            let ss_ = await screenshot({format: 'png'});
            if (!(cur_resolution_size[0] === -1 && cur_resolution_size[1] === -1)){
                ss_ = await sharp(ss_).resize(cur_resolution_size[0], cur_resolution_size[1]).toBuffer();
            }
            res.write("--SS_STREAM_SCREEN5600\r\n");
            res.write("Content-Type: image/png\r\n");
            res.write(`Content-Length: ${ss_.buffer.byteLength}\r\n\r\n`);
            res.write(ss_);
            res.write("\r\n");
            if (streaming){
                setTimeout(send_screen);
            }
        }
        send_screen();

        req.on("close", ()=>{
            streaming = false;
            console.log("stream end");
        })
    }
    else if (req.url === "/set_resolution" && req.method === "POST"){
        req.on("data", (resolution_)=>{
            resolution_ = resolution_.toString();
            console.log(resolution_);
            switch (resolution_) {
                case "normal":
                    cur_resolution_size = [-1, -1];
                    break;
                case "480p":
                    cur_resolution_size = [854, 480];
                    break;
                case "720p":
                    cur_resolution_size = [1280, 720];
                    break;
                case "1080p":
                    cur_resolution_size = [1920, 1080];
                    break;
                case "480i":
                    cur_resolution_size = [640, 480];
                    break;
                default:
                    break;
            }
        })
        res.end("OK");
    }
    else{
        res.end("Not Found");
    }
});

http_svr.listen(5600, "0.0.0.0", ()=>{
    let ip_ = os.networkInterfaces()["Wi-Fi"][1]["address"] ?? "127.0.0.1";
    console.log(`HTTP server is running on : ${ip_}:${5600}`);
});