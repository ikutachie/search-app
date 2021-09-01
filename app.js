const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require('node-fetch');
var express = require("express");
var app = express();

const jquery = require("jquery");
// var config  = require('./config');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_page = fs.readFileSync('./style.css', 'utf8');

// const detail_page = fs.readFileSync('./detail.ejs', 'utf8');
// require('dotenv').config();
let userId = process.env.NODE_USER_ID;
// 12345678
console.log(userId);

// app.locals.home = {
//   url: config.url
// };

var server = http.createServer(getFormClient);
const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log("Server start!");

function getFormClient(request, response){
    var url_parts = url.parse(request.url, false);

    switch(url_parts.pathname){
        case "/":
            response_index(request, response);
            break;
        case "/other":
            response_other(request, response);
            break; 
        case "/detail.ejs":
            response_details(request, response);
            break;
        case"/style.css":
            response_css(request, response);
            break;
        default:
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.end("no page...");
            break;
    }
}


function response_index(require, response){
    var msg = "検索したい店名or場所orキーワードを入力してください"
    var content = ejs.render(index_page,{
        title: "Search Japan!",
        content: msg,
        
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(content);
    response.end();
}

function response_css(require, response){
  response.writeHead(200, {"Content-Type": "text/css"});
  response.write(style_page);
  response.end();
}

function response_other(request, response){
    var msg = ""
   
    if(request.method == "POST"){
        var body = "";
        request.on("data", (data) => {
            body += data;
        });

        request.on("end", () => {
            var post_data = qs.parse(body);
            msg=msg+"検索キーワードは"+post_data.msg+"です。"
            var uri = generateURI(post_data.msg);
            // (1)XMLHttpRequestオブジェクトを作成
            var xmlHttpRequest = new XMLHttpRequest();
            var json;
            // (2)onreadystatechangeイベントで処理の状況変化を監視
            xmlHttpRequest.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    json = JSON.parse(this.responseText);      
                    // console.log(json);
                }
            }

            // (3)HTTPのGETメソッドとアクセスする場所を指定
            xmlHttpRequest.open('GET',uri,false);

            // (4)HTTPリクエストを送信
            xmlHttpRequest.send();

            console.log(json);
            all_name = json.Feature.filter(function(item, index){
              return true;
            });
            
            // for(var i=0; i<all_name.length; i++){
            //   console.log(all_name[i].Property)
            // }
            var storeDic = {};
            json.Feature.forEach(store => {
                storeDic[store.Name] = {detail:store.Property.Detail,address:store.Property.Address,tel:store.Property.Tel1};
            });
          //   var storeDic2 = {};
          //   json.Feature.forEach(store => {
          //     storeDic2[store.Name] = store.Property.Address;
          // });
          //   console.log(storeDic2);
            var content = ejs.render(other_page, {
                title: "Search Japan!",
                content: msg,
                storeDic: storeDic,
                
            });
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(content);
            response.end();
        });
    }else{
        var msg = "ページが見つかりません"
        var content = ejs.render(other_page, {
            title: "エラー画面",
            content: msg,
        });
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(content);
        response.end();
    }
}


// console.log(process.env);

// function response_details(request, response){
//     //  var body = "";
//     //     request.on("data", (data) => {
//     //         body += data;
//     //     });
//     var msg = "詳細表示画面"
//     // var post_data = qs.parse(body);  
//     var content = ejs.render(detail_page, {
//         title: "詳細表示",
//         content: msg,
//     });
//     response.writeHead(200, {"Content-Type": "text/html"});
//     response.write(content);
//     response.end();
// }
// function str2ascii(string){
//     //対象文字列
//     var asciiString = "";
//     for (let i = 0; i < string.length; i++) {
//         let asciiCode = string.charCodeAt(i);
//         let hexValue = asciiCode.toString(16);
//         hexValue = "%" + hexValue;
//         asciiString += hexValue;
//       }
//     console.log(asciiString);
//     return encodeURI(string);
// }

let apikey = process.env.API_ID;

function generateURI(query){
    var uri = 'https://map.yahooapis.jp/search/local/V1/localSearch?&output=json&detail=full&appid='
    +apikey
    +'&results=100&query=';
    uri += encodeURI(query);
    console.log(uri);
    return uri;
}



// function sendAPIRequest(uri){
//     const promise = fetch(uri);
//     promise
//     .then(res => {
//         if (!res.ok) {
//         // 200 系以外のレスポンスはエラーとして処理
//         throw new Error(`${res.status} ${res.statusText}`);
//         }
//         return res.json();
//     })
//     .then(json => {
//         var storeDic = {};
//         json.Feature.forEach(store => {
//             storeDic[store.Name] = store.Property.Detail;
//         });
//         console.log(storeDic.toString());
//         // fs.writeFileSync('./output2.json', storeDic.toString);
        
//     })
// }


// function processAPI(query){
//     var uri = generateURI(query);
//     var storeDic = sendAPIRequest(uri);
//     console.log(storeDic);
// }

