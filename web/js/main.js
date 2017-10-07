var servers = [];
var matches = [];
var oldViewButtons = [];
var socket = null;
var initComplete = false;

function init() {
    socket = io('http://localhost:3542');
    var create_form = document.querySelector("form");
    var view_table = document.querySelector("#view-table");

    socket.on('init', function (data) {
        if(!initComplete) {
            initComplete = true;

            servers = data.servers;
            matches = data.matches;

            if (create_form) {
                initForm();
            }

            if (view_table) {
                initView();
            }
        }
    });

    socket.on('update', function (data) {
        servers = data.servers;
        matches = data.matches;

        if (view_table) {
            initView();
        }
    });
}

function statusResolver(statusCode) {
    switch(statusCode){
        case 0:
            return "Match not started";
            break;
        case 1:
            return "Match running";
            break;
        case 2:
            return "Match ended";
            break;
        default:
            return "Unknown Status"
    }
}

function initView() {
    var table = document.querySelector("#view-table");
    table.innerHTML = "<thead><tr><th>Server</th><th>Map</th><th>Team 1</th><th>Team 2</th><th>Status</th><th></th></tr></thead><tbody></tbody>";

    if(oldViewButtons.length > 0){
        for(var button_remover = 0; button_remover < oldViewButtons.length; button_remover++){
            oldViewButtons[button_remover].removeEventListener("click", viewButtonClick);

            if(button_remover === (oldViewButtons.length + 1)){
                oldViewButtons = [];
            }
        }
    }

    for(var item = 0; item < matches.length; item++) {
        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        cell1.innerHTML = matches[item].server;
        cell2.innerHTML = matches[item].map;
        cell3.innerHTML = matches[item].team1.name;
        cell4.innerHTML = matches[item].team2.name;
        cell5.innerHTML = statusResolver(matches[item].status) + " (" + matches[item].status + ")";
        cell6.innerHTML = "<button type='button' class='btn btn-sm btn-success' data-action='start' data-id='" + item + "'>Connect Server & Start Match</button><br/><br/><button type='button' class='btn btn-sm btn-warning' data-action='end' data-id='" + item + "'>End Match & Restore Server</button><br/><br/><button type='button' class='btn btn-sm btn-danger' data-action='disconnect' data-id='" + item + "'>Disconnect Server</button>";

        var buttons = document.querySelectorAll("button");
        for(var button = 0; button < buttons.length; button++){
            oldViewButtons.push(buttons[button]);
            buttons[button].addEventListener("click", viewButtonClick);
        }
    }
}

function viewButtonClick(e){
    switch(e.target.dataset.action){
        case "start":
            socket.emit("start_match", {
                id: parseInt(e.target.dataset.id)
            });
            break;
        case "end":
            socket.emit("end_match", {
                id: parseInt(e.target.dataset.id)
            });
            break;
        case "disconnect":
            socket.emit("disconnect_server", {
                id: parseInt(e.target.dataset.id)
            });
            break;
    }
}

function initForm() {
    var team_name_1 = document.querySelector("#team-name-1");
    var team_name_2 = document.querySelector("#team-name-2");

    var team_country_1 = document.querySelector("#team-country-1");
    var team_country_2 = document.querySelector("#team-country-2");

    var server = document.querySelector("#server");
    var map = document.querySelector("#map");
    var csgo_config = document.querySelector("#csgo-config");

    var submit = document.querySelector("#submit");

    for(var item = 0; item < servers.length; item++) {
        var option = document.createElement('option');
        option.text = option.value = (servers[item].ip + ":" + servers[item].port);
        server.add(option);
    }

    server.addEventListener("change", function () {
        for(var item = 0; item < servers.length; item++){
            if(server.value === (servers[item].ip + ":" + servers[item].port)){
                map.value = servers[item].default_map;
                break;
            }
        }
    });

    submit.addEventListener("click", function () {
        var send_data = {
            team1: {
                name: team_name_1.value,
                country: team_country_1.value
            },
            team2: {
                name: team_name_2.value,
                country: team_country_2.value
            },
            map: map.value,
            match_config: csgo_config.value,
            server: server.value,
            status: 0
        };

        socket.emit("create_match", send_data);

        team_name_1.value = "";
        team_country_1.value = "";
        team_name_2.value = "";
        team_country_2.value = "";
        map.value = "";
        server.value = "";
        csgo_config.value = "";
    });
}

window.addEventListener("load", init);
