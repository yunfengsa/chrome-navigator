// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var urlsMap = {}

var projects = {}
const searchEngines = {
  "google": "https://www.google.com/search?q=",
}
  var dataMap = {
    urlsMap,
    projects
  }
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    var index = tab.index 
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url, index);
  });
}

function showToast(msg){
  var error = document.getElementById("error");
  error.innerText = msg;
  error.style.display = "block";
  setTimeout(function() {
    error.style.display = "none"
  }, 2000)
}
document.addEventListener('DOMContentLoaded', () => {
    var input = document.getElementById('input');
    var button = document.getElementById('button');
    var error = document.getElementById('error');
    console.log("DOMContentLoaded")
    chrome.storage.sync.get({
      config: 'nothing'
    }, function(items) {
      if(items.config == 'nothing' || !items.config.trim().startsWith('{')){
      var xhr = new XMLHttpRequest();
      // xhr.open("GET", chrome.extension.getURL('/resource/config.json'), true);
      xhr.open("GET", "xxx读取配置文件地址", false);
      xhr.onreadystatechange  = function() {
      if(xhr.readyState == 4){
        dataMap = JSON.parse(xhr.responseText);
        chrome.storage.sync.set({
          config: xhr.responseText
        }, function(){
          error.innerText = "首次打开，同步成功"
          error.style.display = 'block';
        })
        }else{
          error.display.display = 'block';
          error.innerText = "配置同步失败"
        }
        };
        xhr.onerror = function(e){
          error.display.display = 'block';
          error.innerText = "配置同步失败"
        }
        xhr.send();
      }else{
        try{
          let json = JSON.parse(items.config);
          dataMap = json
        }catch(e){
        }
      } 
    });
    input.addEventListener('keypress', (e) => {
      if(e.keyCode == 13){
        button.click()
      }
    })
    button.addEventListener('click', () => {

      //匹配跳转url
      var keyIndex = input.value;
      var url = null;
      if(/^h5-|wx-/.test(keyIndex)){
        let key = null;
        Object.keys(dataMap.projects).some(item => {
            if(item == keyIndex || item.includes(keyIndex)){
              key = item;
              return true;
            }else{
              return false
            }
        });
        if(key){
          url = "gitlab group url" + key;
        }
      }else if(/^p-/.test(keyIndex)){
        keyIndex = keyIndex.split('-')[1];
        let key = null
        Object.keys(dataMap.projects).some(item => {
            if(item == keyIndex || item.includes(keyIndex)){
              key = item;
              return true;
            }else{
              return false
            }
        });
        if(key){
          url = dataMap.projects[key]
        }
      }else if (/^[\w]+:\w/.test(keyIndex)){
        let tm = keyIndex.split(":");
        let key = null;
        Object.keys(searchEngines).some(item => {
            if(item == keyIndex || item.includes(tm[0])){
              key = item;
              return true;
            }else{
              return false
            }
        });
        if (key){
          url = searchEngines[key] + tm[1]
        }
      }
      else {
        let key = null;
        Object.keys(dataMap.urlsMap).some(item => {
          if(item == keyIndex || item.includes(keyIndex)){
            key = item;
            return true;
          }else{
            return false
          }
        })
        if (key){
          url = dataMap.urlsMap[key];
        }
      }
      getCurrentTabUrl(function(lastUrl, index){
        if(url){
          error.style.display = "none";
          chrome.tabs.create({
            url: url,
            index: index + 1
          }, () => {});
        }else{
          error.innerText = "未找到关键字"
          error.style.display = "block";
        }
      })
      
    })
});
