// ==UserScript==
// @name         Improved CSGODouble.com
// @namespace    https://github.com/Timmaeh/Improved-CSGODouble/
// @version      0.9h
// @description  Improves your experience on CSGODouble.com
// @author       Timmaeh - http://timmaeh.de
// @match        http://www.csgodouble.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @updateURL    https://rawgit.com/Timmaeh/Improved-CSGODouble/master/improved_csgodouble.user.js
// @downloadURL  https://rawgit.com/Timmaeh/Improved-CSGODouble/master/improved_csgodouble.user.js
// ==/UserScript==

$(document).ready(function(){
  //jQuery.NiceScroll https://github.com/inuyaksa/jquery.nicescroll
  $('head').append('<script type="text/javascript" src="https://rawgit.com/Timmaeh/Improved-CSGODouble/master/jquery.nicescroll.min.js"></script>');
  var w84niceScroll = setInterval(function(){
    if(typeof $('#chatArea').niceScroll == 'function'){
      $('#chatArea').addClass('IMP_scroll').niceScroll({
        cursorcolor: '#888',
        cursorborder: '1px solid #888',c
        cursoropacitymin: 0,
        cursoropacitymax: 0.6,
        autohidemode: 'cursor',
        hidecursordelay: 250,
        railpadding: {top: 3, right: 3, bottom: 3, left: 0}
      });
      $('#chatForm .checkbox.pull-right').removeClass('checkbox').html('<a href="#" data-toggle="modal" data-target="#chatRules">Chat Rules</a>');
      $($('#chatForm .pull-left')[1]).remove();
      clearInterval(w84niceScroll);
    }
  }, 100);
});

var IMP = {
  last_roll_id: 0,
  last_roll_color: 0,
  last_roll_color_count: 0,
  settings: {
    sound: false,
    mute_mute: false,
    spambot: false,
    spoil_roll: false,
    show_rolls: false,
    hide_bet_confirm: false,
    show_mod_tools: false,
    filter_usernames: false,
    console_log: false,
    autoreconnect: false
  },
  stats: {
    won: [[0, 0], [0, 0], [0, 0]],
    lost: [[0, 0], [0, 0], [0, 0]]
  },
  mod_html: '<div id="IMP_mod_tools" style="display:none;margin:20px 5px 5px;"><div class="form-group"><div class="btn-group"><button type="button" class="btn btn-default modshort" data-seconds="1" disabled>Unmute</button><button type="button" class="btn btn-default modshort" data-seconds="60" disabled>Mute 60s</button><button type="button" class="btn btn-default modshort" data-seconds="1800" disabled>30m</button><button type="button" class="btn btn-default modshort" data-seconds="3600" disabled>1h</button><button type="button" class="btn btn-default modshort" data-seconds="21600" disabled>6h</button><button type="button" class="btn btn-default modshort" data-seconds="86400" disabled>24h</button></div></div>',
  calc_html: '<div style="margin:10px;"><div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Betting Calculator</div></div>',
  log_html: '<div style="margin:10px;"><div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Bet History <span style="font-size:10px;font-weight:normal;font-style:italic;">for the current session</span></div><table border="1" style="width:100%;border-color:#F5F5F5;"><thead><tr><th style="text-align:center;">Roll ID</th><th style="text-align:center;">Amount</th><th style="text-align:center;">Target</th><th style="text-align:center;">Roll</th><th style="text-align:center;">Profit</th></tr></thead><tbody></tbody></table></div>',
  stats_html: '<div style="margin:10px;"><div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Bet Statistics <span style="font-size:10px;font-weight:normal;font-style:italic;">for the current session</span></div>Your Winnings<table id="IMP_log_winnings" style="width:100%"><tr><td colspan="3" style="padding:5px;background-color:#F5F5F5;font-size:16px;font-weight:bold;text-align:center;">+1000</td></tr><tr><td class="red" style="padding:5px;background-color:#c9302c;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+200</td><td class="green" style="padding:5px;background-color:#449d44;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+300</td><td class="black" style="padding:5px;background-color:#444;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+500</td></tr></table>Your Losses<table id="IMP_log_winnings" style="width:100%"><tr><td colspan="3" style="padding:5px;background-color:#F5F5F5;font-size:16px;font-weight:bold;text-align:center;">+1000</td></tr><tr><td class="red" style="padding:5px;background-color:#c9302c;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+200</td><td class="green" style="padding:5px;background-color:#449d44;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+300</td><td class="black" style="padding:5px;background-color:#444;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+500</td></tr></table></div>',
  settings_html: '<div style="margin:10px;"><div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Improved CSGODouble.com v0.9h <span style="font-size:10px;font-weight:normal;font-style:italic;">by Timmaeh</span></div><div class="IMP_setting" id="IMP_dark_theme" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Use Dark Theme</div><div class="IMP_setting" id="IMP_hide_footer" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Hide Footer</div><div class="IMP_setting" id="IMP_sound" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Play Sound on Roll</div><div class="IMP_setting" id="IMP_spoil_roll" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Spoil Roll in Bet History</div><div class="IMP_setting" id="IMP_show_rolls" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Show Rolls without Bets in Bet History</div><div class="IMP_setting" id="IMP_hide_bet_confirm" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Hide Bet Confirmations in Chat</div><div class="IMP_setting" id="IMP_filter_usernames" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Filter Usernames</div><div class="IMP_setting" id="IMP_console_log" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Enable Console Output</div><div class="IMP_setting" id="IMP_autoreconnect" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Autoreconnect</div><div class="IMP_setting" id="IMP_show_mod_tools" style="display:none;cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Show Mod Tools</div><audio id="IMP_roll" preload="auto"><source src="http://timmaeh.de/csgodouble/roll.mp3"></audio></div>',
  init: function(){
    var sidebar = $('#sidebar > div')[0];
    var origina = $(sidebar).find('div')[0];

    // Calculator
    //$(origina).clone().attr('id', 'IMP_calc').attr('data-tab', '11').removeClass('active').appendTo(sidebar);
    //$('#IMP_calc').find('.fa').toggleClass('fa-commenting fa-calculator');
    //$('#IMP_calc').find('span').remove();
    //$('#pullout').append('<div id="tab11" class="tab-group hidden">' + IMP.calc_html + '</div>');

    // Log
    $(origina).clone().attr('id', 'IMP_log').attr('data-tab', '12').removeClass('active').appendTo(sidebar);
    $('#IMP_log').find('.fa').toggleClass('fa-commenting fa-list');
    $('#IMP_log').find('span').attr('id', 'IMP_bet_count');
    $('#pullout').append('<div id="tab12" class="tab-group hidden">' + IMP.log_html + '</div>');

    // Stats
    //$(origina).clone().attr('id', 'IMP_stats').attr('data-tab', '13').removeClass('active').appendTo(sidebar);
    //$('#IMP_stats').find('.fa').toggleClass('fa-commenting fa-bar-chart');
    //$('#IMP_stats').find('span').remove();
    //$('#pullout').append('<div id="tab13" class="tab-group hidden">' + IMP.stats_html + '</div>');

    // Settings
    $(origina).clone().attr('id', 'IMP_settings').attr('data-tab', '14').removeClass('active').appendTo(sidebar);
    $('#IMP_settings').find('.fa').toggleClass('fa-commenting fa-cog');
    $('#IMP_settings').find('span').remove();
    $('#pullout').append('<div id="tab14" class="tab-group hidden">' + IMP.settings_html + '</div>');

    // Dark Theme
    $('head').append('<link href="https://rawgit.com/Timmaeh/Improved-CSGODouble/master/dark_theme.css" rel="stylesheet" />');
    
    // Chat Highlight
    //$('#contextMenu li').first().clone().attr('id', 'IMP_highlight').appendTo('#contextMenu');
    //$('#IMP_highlight > a').removeAttr('data-act').html('Select Color').attr('href', 'javascript:IMP.highlight(this);');
    
    IMP.enable_sidebar_icons();
    IMP.load_settings();
    IMP.enable_settings();
  },
  enable_sidebar_icons: function(){
  
    // Overwriting Original by Foobar
    $('.side-icon').off('click').on('click', function(e){
      e.preventDefault();
      var tab = $(this).data('tab');
      if($(this).hasClass('active')){
        $('.side-icon').removeClass('active');
        $('.tab-group').addClass('hidden');
        $('#mainpage').css('margin-left', '50px');
        $('#pullout').addClass('hidden');      
      } else {
        $('.side-icon').removeClass('active');
        $('.tab-group').addClass('hidden');
        //
        $(this).addClass('active');
        $('#tab' + tab).removeClass('hidden');      
        $('#mainpage').css('margin-left', '450px');
        $('#pullout').removeClass('hidden');

        if(tab == 1) $('#newMsg').html('');
      }
      snapRender();
      return false;  
    });
  },
  enable_settings: function(){
    $('.IMP_setting').off('click').on('click', function(e){
      e.preventDefault();
      $(this).find('i.fa').toggleClass('fa-check fa-times');
      IMP.settings[$(this).attr('id').substr(4)] = ($(this).find('i.fa').hasClass('fa-check') ? true : false);
      IMP.save_settings();
      
      if($(this).attr('id').substr(4) == 'show_rolls'){
        if(IMP.settings.show_rolls) $('.IMP_show_rolls_roll').show();
        else $('.IMP_show_rolls_roll').hide();
      } else if($(this).attr('id').substr(4) == 'dark_theme'){
        if(IMP.settings.dark_theme) $('body').addClass('dark_theme');
        else $('body').removeClass('dark_theme');
      } else if($(this).attr('id').substr(4) == 'hide_footer'){
        if(IMP.settings.hide_footer) $('footer').hide();
        else $('footer').show();
      } else if($(this).attr('id').substr(4) == 'show_mod_tools'){
        if(IMP.settings.show_mod_tools){
          $('#IMP_mod_tools').show();
          IMP.enable_mod_tools();
        } else {
          $('#IMP_mod_tools').hide();
          $(window).off('click');
          $('.modshort').off('click');
        }
      }
    });
    
    if(IMP.settings.dark_theme) $('body').addClass('dark_theme');
    else $('body').removeClass('dark_theme');
    
    if(IMP.settings.hide_footer) $('footer').hide();
    else $('footer').show();
  },
  enable_mod_tools: function(){
    $(window).on('click', function(e){
      var msg = $(e.target).closest('#chatArea > div')[0] || false;
      if(!$(e.target).hasClass('modshort')){
        $('.IMP_active_msg').removeClass('IMP_active_msg').css({border: '0px solid orange', borderBottom: '1px solid #000', padding: '5px'});
        $('.modshort').prop('disabled', true);
      }
      if(msg && $(msg).find('.chat-img').length){
        $(msg).addClass('IMP_active_msg').css({border: '1px solid orange', padding: '4px 4px 5px 4px'});
        $('.modshort').prop('disabled', false);
      }
    });
    
    $('.modshort').off('click').on('click', function(e){
      var steamid = $('.IMP_active_msg > .chat-img').data('steamid');
      var seconds = $(this).data('seconds');
      send({type: 'chat', msg: '/mute ' + steamid + ' ' + seconds, lang: LANG});
    });
  },
  load_settings: function(){
    $.extend(IMP.settings, JSON.parse(GM_getValue('settings', '{}')));

    $.each(IMP.settings, function(name, value){
      if(value === true) $('#IMP_' + name).find('i.fa').addClass('fa-check').removeClass('fa-times');
      else if(value === false) $('#IMP_' + name).find('i.fa').addClass('fa-times').removeClass('fa-check');
    });
  },
  save_settings: function(){
    GM_setValue('settings', JSON.stringify(IMP.settings));
  },
  log_bet: function(id, value, lower, upper){
    if($('#IMP_log_' + id + '_' + lower + '_' + upper).length){
      $('#IMP_log_' + id + '_' + lower + '_' + upper + ' > .value').text(value);
    } else {
      $('#tab12 tbody').prepend('<tr id="IMP_log_' + id + '_' + lower + '_' + upper + '"><td style="padding:3px 5px;text-align:right;font-weight:bold;">' + id + '</td><td class="value" style="padding:3px 8px;text-align:right;font-weight:bold;">' + value + '</td><td class="color" style="padding:3px 8px;color:#FFF;text-align:center;font-weight:bold;background-color:#' + (lower == 0 ? '449d44' : (lower < 8 ? 'c9302c' : '444')) + ';">' + (lower == 0 ? '0' : lower + ' - ' + upper) + '</td><td class="result" style="padding:3px 8px;color:#FFF;text-align:center;font-weight:bold;"></td><td class="profit" style="padding:3px 8px;text-align:right;font-weight:bold;"></td></tr>');
      var curr = parseInt($('#IMP_bet_count').html()) || 0;
      $("#IMP_bet_count").html(curr + 1);
    }
  },
  log_result: function(id, result){
    var logged = 0;
    $('tr[id^="IMP_log_' + id + '_"]').each(function(i, e){
      $(e).find('.result').css('background-color', (result == 0 ? '#449d44' : (result < 8 ? '#c9302c' : '#444'))).text(result);
      
      var bet_on = $(e).find('.color').text();
      var profit = parseInt($(e).find('.value').text());
      if(bet_on == '0' && result == 0) profit = profit * 13;
      else if(bet_on == '1 - 7' && result > 0 && result < 8) profit = profit;
      else if(bet_on == '8 - 14' && result > 7) profit = profit;
      else profit = -1 * profit;
      
      IMP.update_stats(bet_on, profit);

      $(e).find('.profit').css('color', (profit > 0 ? '#3c763d' : '#a94442')).text((profit > 0 ? '+' + profit : profit));

      logged++;
    });
    
    if(logged == 0){
      $('#tab12 tbody').prepend('<tr id="IMP_log_' + id + '" class="IMP_show_rolls_roll" style="' + (IMP.settings.show_rolls ? '' : 'display:none;') + '"><td style="padding:3px 5px;text-align:right;font-weight:bold;">' + id + '</td><td class="value" style="padding:3px 8px;text-align:right;font-weight:bold;"> - - - </td><td class="color" style="padding:3px 8px;text-align:center;font-weight:bold;"> - - - </td><td class="result" style="padding:3px 8px;color:#FFF;text-align:center;font-weight:bold;"></td><td class="profit" style="padding:3px 8px;text-align:right;font-weight:bold;"> - - - </td></tr>');
      $('#IMP_log_' + id + ' .result').css('background-color', (result == 0 ? '#449d44' : (result < 8 ? '#c9302c' : '#444'))).text(result);
    }
  
    if(IMP.settings.sound) $('#IMP_roll')[0].play();
    if(typeof IMP.log_result_callback == 'function') IMP.log_result_callback.call();
  },
  update_stats: function(color, profit){
    //if(profit > 0){
    //  IMP.stats.won[(color == 0 ? 1 : (color < 8 ? 1 : 3))][0]++;
    //  IMP.stats.won[(color == 0 ? 1 : (color < 8 ? 1 : 3))][1] += profit;
    //} else {
    //  IMP.stats.lost[(color == 0 ? 1 : (color < 8 ? 1 : 3))][0]++;
    //  IMP.stats.lost[(color == 0 ? 1 : (color < 8 ? 1 : 3))][1] += profit;
    //}
  },
  filter_name: function(name){
    var filtered1 = name.replace(/((TWITCH((|\.|DOT)(TV))?\/?)|(CSGODOUBLE((|\.|DOT)(COM))?)|(\W(CS|SKIN|FREE)[\w-]+((|\.|DOT)(\w{2,6}))?)|FREE|500|COINS?|(REFER(AL)?)?CODE)/gi, ''), filtered2 = '', filtered3 = '';
    if(filtered1.length < 2) return name;
    if(name != filtered1) filtered2 = filtered1.replace(/(^[\W_]+|[\W_]+$)/g, '');
    if(filtered2.length < 2) filtered2 = filtered1;
    filtered3 = filtered2.replace(/[\W_]{3,}/g, ' ');
    if(filtered3.length < 2) filtered3 = filtered2;
    if(name != filtered3 && IMP.settings.console_log) console.log(name, '>>>', filtered3);
    return filtered3;
  },
  reconnecting: false,
  reconnect: function(){
    IMP.reconnecting = false;
    connect();
  },
  highlight: function(e){
    console.log(e);
  }
};

unsafeWindow.IMP = IMP;

unsafeWindow.IMP.init();

// Overwriting Original by Foobar
unsafeWindow.addHist = function(roll, rollid){
  var count = $('#past .ball').length;
  if(count >= 10)  $('#past .ball').first().remove();
  if(roll==0)      $('#past').append('<div data-rollid="'+rollid+'" class="ball ball-0">' + roll + '</div>');
  else if(roll<=7) $('#past').append('<div data-rollid="'+rollid+'" class="ball ball-1">' + roll + '</div>');
  else             $('#past').append('<div data-rollid="'+rollid+'" class="ball ball-8">' + roll + '</div>');
  
  roll = (roll == 0 ? 0 : (roll < 8 ? 1 : 8));  
  if(IMP.last_roll_color == roll){
    IMP.last_roll_color_count++;
  } else {
    IMP.last_roll_color = roll;
    IMP.last_roll_color_count = 1;
  }
}

// Overwriting Original by Foobar
unsafeWindow.spin = function(m){
  var x = m.roll;
  play_sound('roll');
  var order = [1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8];
  var index = 0;
  for(var i = 0; i < order.length; i++){
    if(x == order[i]){
      index = i;
      break;
    }
  }
  
  var max = 34;
  var min = -34;
  var w = Math.floor(m.wobble * (max - min + 1) + min);

  var dist = index * 75 + 36 + w + (1125 * 5);    
  animStart = new Date().getTime();          
  vi = getVi(dist);
  tf = getTf(vi);
  isMoving = true;

  if(IMP.settings.spoil_roll) IMP.log_result(m.rollid, m.roll);
  
  setTimeout(function(){
    if(!IMP.settings.spoil_roll) IMP.log_result(m.rollid, m.roll);
    finishRoll(m, tf);
  }, tf);
  render();    
}

//Overwriting Original by Foobar
unsafeWindow.onMessage = function(msg){
  try {
    var m = JSON.parse(msg.data);
    if(m.type == 'preroll'){
      $('#counter').finish();
      $('#banner').html('Confirming ' + m.totalbets + ' total bets...');
      $('#panel0-0 .total').countTo(m.sums[0]);
      $('#panel1-7 .total').countTo(m.sums[1]);
      $('#panel8-14 .total').countTo(m.sums[2]);
      try {
        tinysort('#panel1-7 .betlist>li', {
          data: 'amount',
          order: 'desc'
        });
      } catch(e){}
      try {
        tinysort('#panel8-14 .betlist>li', {
          data: 'amount',
          order: 'desc'
        });
      } catch(e){}
      try {
        tinysort('#panel0-0 .betlist>li', {
          data: 'amount',
          order: 'desc'
        });
      } catch(e){}
    } else if(m.type == 'roll'){
      $('.betButton').prop('disabled', true);
      $('#counter').finish();
      $('#banner').html('***ROLLING***');
      ROUND = m.rollid;
      spin(m);
    } else if(m.type == 'chat'){
      if(IMP.settings.filter_usernames) m.name = IMP.filter_name(m.name);
      chat('player', m.msg, m.name, m.icon, m.user, m.rank, m.lang);
    } else if(m.type == 'hello'){
      cd(m.count);
      USER = m.user;
      RANK = m.rank;
      if(RANK > 0){
        // Mod Tools
        $('#IMP_show_mod_tools').show();
        $('#tab1').append(IMP.mod_html);
        
        if(IMP.settings.show_mod_tools){
          $('#IMP_mod_tools').show();
          IMP.enable_mod_tools();
        } else {
          $('#IMP_mod_tools').hide();
          $(window).off('click');
          $('.modshort').off('click');
        }
      }
      $('#balance').countTo(m.balance);
      var last = 0;
      for(var i = 0; i < m.rolls.length; i++){
        addHist(m.rolls[i].roll, m.rolls[i].rollid);
        last = m.rolls[i].roll;
        ROUND = m.rolls[i].rollid;
      }
      snapRender(last, m.last_wobble);
      MAX_BET = m.maxbet;
      chat('alert', '## Min bet: ' + m.minbet + ' coin/s');
      chat('alert', '## Max bet: ' + formatNum(MAX_BET) + ' coins');
      chat('alert', '## Max bets per roll: ' + m.br);
      chat('alert', '## Roll countdown: ' + m.accept + ' sec');
      chat('alert', '## Chat: ' + m.chat + ' sec cooldown (' + m.chatb + '+ total bet)');
    } else if(m.type == 'bet'){
      if(IMP.settings.filter_usernames) m.bet.name = IMP.filter_name(m.bet.name);
      addBet(m.bet);
      $('#panel0-0 .total').countTo(m.sums[0]);
      $('#panel1-7 .total').countTo(m.sums[1]);
      $('#panel8-14 .total').countTo(m.sums[2]);
    } else if(m.type == 'betconfirm'){
      $('#panel' + m.bet.lower + '-' + m.bet.upper + ' .mytotal').countTo(m.bet.amount);
      $('#balance').countTo(m.balance, {
        'color': true
      });
      $('.betButton').prop('disabled', false);
      if(!IMP.settings.hide_bet_confirm) chat('alert', 'Bet #' + m.bet.betid + ' confirmed ' + m.mybr + '/' + m.br + ' (' + (m.exec / 1000) + ' sec) ');
      IMP.log_bet(ROUND + 1, m.bet.amount, m.bet.lower, m.bet.upper);
    } else if(m.type == 'error'){
      chat('error', m.error);
      if(m.enable){
        $('.betButton').prop('disabled', false);
      }
    } else if(m.type == 'alert'){
      chat('alert', m.alert);
      if(m.maxbet){
        MAX_BET = m.maxbet;
      }
      if(!isNaN(m.balance)){
        console.log('setting balance = %s', m.balance);
        $('#balance').countTo(m.balance, {
          'color': true
        });
      }
    } else if(m.type == 'logins'){
      $('#isonline').html(m.count);
    } else if(m.type == 'balance'){
      $('#balance').fadeOut(100).html(m.balance).fadeIn(100);
    }
  } catch(e){
    console.log('Error: ' + msg.data + ' ' + e);
  }
}

//Overwriting Original by Foobar
unsafeWindow.chat = function(x, msg, name, icon, steamid, rank, lang){
  if(lang == LANG || x == 'italic' || x == 'error' || x == 'alert'){
    var ele = document.getElementById('chatArea');
    msg = msg.replace(/(<|>)/g, '');
    msg = emotes(msg);
    var toChat = '';
    if(x == 'italic'){      
      if(msg == 'Connection closed.' || msg == 'Error: Connected closed.' || msg == 'Error: Failed to get AT'){
        if(IMP.settings.autoreconnect && !IMP.reconnecting){
          msg += ' Trying to reconnect.';
          IMP.reconnecting = true;
          setTimeout(IMP.reconnect, 3000);
        } else {
          msg += ' <a href="javascript:connect();">Try to reconnect.</a>';
        }
      }
      toChat = '<div><i>' + msg + '</i></div>';
    } else if(x == 'error') toChat = '<div><b class="text-danger">' + msg + '</b></div>';
      else if(x == 'alert') toChat = '<div><b class="text-success">' + msg + '</b></div>';
      else if(x == 'player'){
      var aclass = 'chat-link';
           if(rank == 100) aclass = 'chat-link-mod',      name = '[Owner] ' + name;
      else if(rank ==   1) aclass = 'chat-link-pmod',     name = '[Mod] ' + name;
      else if(rank ==  -1) aclass = 'chat-link-streamer', name = '[Streamer] ' + name;
      else if(rank ==  -2) aclass = 'chat-link-ve',       name = '[Veteran] ' + name;
      toChat = '<div><img class="chat-img rounded" data-steamid="' + steamid + '" data-name="' + name + '" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars' + icon + '"><a class="' + aclass + '" href="http://steamcommunity.com/profiles/' + steamid + '" target="_blank"><b>' + name + '</b></a>: ' + msg + '</div>';
    }

    var do_scroll = ($CHATAREA[0].scrollHeight - 499 - $CHATAREA[0].scrollTop > 100) ? false : true;
    $CHATAREA.append(toChat);
    if(do_scroll && $CHATAREA.hasClass('IMP_scroll')){      
      $CHATAREA.getNiceScroll().resize();
      $CHATAREA.getNiceScroll(0).doScrollTop($CHATAREA[0].scrollHeight, 100);
    }
    if(!$('.side-icon[data-tab="1"]').hasClass('active')){
      var curr = parseInt($('#newMsg').html()) || 0;
      $('#newMsg').html(curr + 1);
    }	
  }
}
