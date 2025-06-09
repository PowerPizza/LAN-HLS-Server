let server_info;

fetch("/get_server_info", {method: "POST"}).then((resp)=>{
    resp.text().then((data)=>{
        data = JSON.parse(data);
        document.querySelector("#main_body .header_ .ip_text").innerText = `IP : ${data["ip"]}`;
        document.querySelector("#main_body .header_ .port_text").innerText = `PORT : ${data["port"]}`;
        server_info = data;
    })
})

let menu_opened = false;
document.querySelector("#main_body .header_ .menu_icon").onclick = ()=>{
    if (menu_opened){
        document.querySelector("#main_body .right_panel").style.display = "";
    }
    else{
        document.querySelector("#main_body .right_panel").style.display = "none";
    }
    menu_opened = !menu_opened;
}

document.querySelector("#main_body .right_panel .full_screen_btn").onclick = ()=>{
    document.querySelector("#main_body .content_area .screen img").requestFullscreen();
}

function play_stream(){
    document.querySelector("#main_body .content_area .screen img").src = window.location.href+"stream";
    document.querySelector("#main_body .content_area .right_panel .btn_play").innerText = "⏸";
    document.querySelector("#main_body .content_area .right_panel .btn_play").onclick = pause_stream;
}
function pause_stream(){
    document.querySelector("#main_body .content_area .screen img").src = "";
    document.querySelector("#main_body .content_area .right_panel .btn_play").innerText = "▶";
    document.querySelector("#main_body .content_area .right_panel .btn_play").onclick = play_stream;
}
document.querySelector("#main_body .content_area .right_panel .btn_play").onclick = play_stream;

document.querySelector("#main_body .content_area .right_panel .screen_size_selection").onchange = (ele)=>{
    const screen_sz = ele.target.value;
    if (screen_sz === "cover"){
        document.querySelector("#main_body .content_area .screen .holder").style.width = "100%";
        document.querySelector("#main_body .content_area .screen .holder").style.height = "100%";
        document.querySelector("#main_body .content_area .screen .holder img").style.width = "100%";
        document.querySelector("#main_body .content_area .screen .holder img").style.height = "100%";
    }
    else if (screen_sz === "contain"){
        document.querySelector("#main_body .content_area .screen .holder").style.width = "0";
        document.querySelector("#main_body .content_area .screen .holder").style.height = "0";
        document.querySelector("#main_body .content_area .screen .holder img").style.width = "";
        document.querySelector("#main_body .content_area .screen .holder img").style.height = "";
    }
}

document.querySelector("#main_body .content_area .right_panel .resolution_opt").onchange = async (ele)=>{
    console.log(ele.target.value);
    let http_resp = await fetch("/set_resolution", {method: 'POST', body: ele.target.value});
    http_resp = await http_resp.text();
}