function restore_options() {
  chrome.storage.sync.get({
    config: 'hello'
  }, function(items) {
    document.getElementById('txarea').value = items.config;
  });
}
function save_options() {
  let isJson = true;
  try{
    JSON.parse(document.getElementById('txarea').value);
  }catch(e){
    isJson = false;
  }
  if (!isJson){
    showToast("格式不正确，必须是JSON格式")
    return
  }
  chrome.storage.sync.set({
    config: document.getElementById('txarea').value
  }, function(){
    showToast("保存成功")
  })
}
function showToast(tx){
  var status = document.getElementById("status");
  status.innerText = tx;
  status.style.display = "block";
  setTimeout(function(){
    status.style.display = "none";
  }, 2000)
}
function sync(){
  //读取配置
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "配置url", false);
    xhr.onreadystatechange  = function() {
      if(xhr.readyState == 4){
        // dataMap = JSON.parse(xhr.responseText);
        chrome.storage.sync.set({
          config: xhr.responseText
        }, function(){
          showToast("同步成功");
          document.getElementById('txarea').value = xhr.responseText;
        })
      }else{
        showToast("failed")
      }
    };
    xhr.onerror = function(e){
      showToast("failed")
    }
    xhr.send();
  
}
document.addEventListener('DOMContentLoaded', function(){
  restore_options();
});
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('sync').addEventListener('click',
    sync)   