(function(){
  var imp = document.createElement('script');
  imp.type = 'text/javascript';
  imp.src = chrome.extension.getURL('improved_csgodouble.js');
  document.body.appendChild(imp);
  
  var nice = document.createElement('script');
  nice.type = 'text/javascript';
  nice.src = chrome.extension.getURL('jquery.nicescroll.min.js');
  document.body.appendChild(nice);
  
  var roll_audio = document.createElement('audio');
  roll_audio.id = 'IMP_roll';
  var roll_source = document.createElement('source');
  roll_source.src = chrome.extension.getURL('roll.mp3');
  roll_audio.appendChild(roll_source);
  document.body.appendChild(roll_audio);
})();