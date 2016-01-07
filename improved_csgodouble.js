var IMP = {
  last_roll_id: 0,
  last_roll_color: 0,
  last_roll_color_count: 0,
  settings: {
    dark_theme: false,
    hide_footer: false,
    sound: false,
    spoil_roll: false,
    show_rolls: false,
    hide_bet_confirm: false,
    filter_usernames: false,
    console_log: false,
    hide_chat_imgs: false,
    short_ranks: false
  },
  stats: {
    won: [[0, 0], [0, 0], [0, 0]],
    lost: [[0, 0], [0, 0], [0, 0]]
  },
  calc_html: '<div style="margin:10px;"><div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Betting Calculator</div></div>',
  log_html: '<div style="margin:10px;"><div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Bet History <span style="font-size:10px;font-weight:normal;font-style:italic;">for the current session</span></div><table border="1" style="width:100%;border-color:#F5F5F5;"><thead><tr><th style="text-align:center;">Roll ID</th><th style="text-align:center;">Amount</th><th style="text-align:center;">Target</th><th style="text-align:center;">Roll</th><th style="text-align:center;">Profit</th></tr></thead><tbody></tbody></table></div>',
  stats_html: '<div style="margin:10px;"><div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Bet Statistics <span style="font-size:10px;font-weight:normal;font-style:italic;">for the current session</span></div>Your Winnings<table id="IMP_log_winnings" style="width:100%"><tr><td colspan="3" style="padding:5px;background-color:#F5F5F5;font-size:16px;font-weight:bold;text-align:center;">+1000</td></tr><tr><td class="red" style="padding:5px;background-color:#c9302c;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+200</td><td class="green" style="padding:5px;background-color:#449d44;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+300</td><td class="black" style="padding:5px;background-color:#444;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+500</td></tr></table>Your Losses<table id="IMP_log_winnings" style="width:100%"><tr><td colspan="3" style="padding:5px;background-color:#F5F5F5;font-size:16px;font-weight:bold;text-align:center;">+1000</td></tr><tr><td class="red" style="padding:5px;background-color:#c9302c;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+200</td><td class="green" style="padding:5px;background-color:#449d44;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+300</td><td class="black" style="padding:5px;background-color:#444;color:#FFF;font-size:13px;font-weight:bold;text-align:center;">+500</td></tr></table></div>',
  settings_html: '<div style="margin:10px;"><div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Improved CSGODouble.com v1.0.5 <span style="font-size:10px;font-weight:normal;font-style:italic;">by Timmaeh</span></div><!--div class="IMP_setting" id="IMP_dark_theme" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Use Dark Theme</div--><div class="IMP_setting" id="IMP_hide_footer" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Hide Footer</div><div class="IMP_setting" id="IMP_sound" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Play Sound on Roll</div><div class="IMP_setting" id="IMP_spoil_roll" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Spoil Roll in Bet History</div><div class="IMP_setting" id="IMP_show_rolls" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Show Rolls without Bets in Bet History</div><div class="IMP_setting" id="IMP_hide_bet_confirm" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Hide Bet Confirmations in Chat</div><div class="IMP_setting" id="IMP_filter_usernames" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Filter Usernames</div><!--div class="IMP_setting" id="IMP_console_log" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Enable Console Output</div><div class="IMP_setting" id="IMP_autoreconnect" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Autoreconnect</div--><div class="IMP_setting" id="IMP_hide_chat_imgs" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Hide User Images in Chat</div><div class="IMP_setting" id="IMP_short_ranks" style="cursor:pointer;margin:3px;"><i class="fa fa-times" style="width:18px;"></i> Short Ranks in Chat</div></div>',
  msg_log: [],
  msg_log_curr: 0,
  bet_log: [],
  bet_log_curr: 0,
  init: function(){
    var sidebar = $('#sidebar > div')[0];
    var origina = $(sidebar).find('div')[0];

    // Log
    $(origina).clone().attr('id', 'IMP_log').attr('data-tab', '12').removeClass('active').appendTo(sidebar);
    $('#IMP_log').find('.fa').toggleClass('fa-commenting fa-list');
    $('#IMP_log').find('span').attr('id', 'IMP_bet_count');
    $('#pullout').append('<div id="tab12" class="tab-group hidden">' + IMP.log_html + '</div>');

    // Settings
    $(origina).clone().attr('id', 'IMP_settings').attr('data-tab', '14').removeClass('active').appendTo(sidebar);
    $('#IMP_settings').find('.fa').toggleClass('fa-commenting fa-cog');
    $('#IMP_settings').find('span').remove();
    $('#pullout').append('<div id="tab14" class="tab-group hidden">' + IMP.settings_html + '</div>');
    
    IMP.enable_nice_chat();
    IMP.enable_chat_log();
    IMP.enable_bet_log();
    
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
        /*if(IMP.settings.dark_theme)*/ $('body').addClass('dark_theme');
        /*else $('body').removeClass('dark_theme');*/
      } else if($(this).attr('id').substr(4) == 'hide_footer'){
        if(IMP.settings.hide_footer) $('footer').hide();
        else $('footer').show();
      } else if($(this).attr('id').substr(4) == 'hide_chat_imgs'){
        if(IMP.settings.hide_chat_imgs) $('body').addClass('no_chat_imgs');
        else $('body').removeClass('no_chat_imgs');
      }
    });
    
    if(IMP.settings.dark_theme) $('body').addClass('dark_theme');
    else $('body').removeClass('dark_theme');
    
    if(IMP.settings.hide_chat_imgs) $('body').addClass('no_chat_imgs');
    else $('body').removeClass('no_chat_imgs');
    
    if(IMP.settings.hide_footer) $('footer').hide();
    else $('footer').show();
  },
  enable_mod_tools: function(){
    $(window).on('click', function(e){
      var msg = $(e.target).closest('#chatArea > div')[0] || false;
      if(!$(e.target).hasClass('modshort')){
        $('.IMP_active_msg').removeClass('IMP_active_msg');
        $('.modshort').prop('disabled', true);
      }
      if(msg && $(msg).find('.chat-img').length){
        $(msg).addClass('IMP_active_msg');
        $('.modshort').prop('disabled', false);
      }
    });
    
    $('.modshort').off('click').on('click', function(e){
      console.log(e);
      var steamid = $('.IMP_active_msg .chat-img').data('steamid');
      var seconds = $(this).data('seconds');
      send({type: 'chat', msg: '/mute ' + steamid + ' ' + seconds, lang: LANG});
    });
  },
  enable_nice_chat: function(){
    SCROLLTOP = 0;
  
    //jQuery.NiceScroll https://github.com/inuyaksa/jquery.nicescroll
    //$('head').append('<script type="text/javascript" src="https://rawgit.com/inuyaksa/jquery.nicescroll/master/jquery.nicescroll.min.js"></script>');
    var w84niceScroll = setInterval(function(){
      if(typeof $('#chatArea').niceScroll == 'function'){
        $('#chatArea').addClass('IMP_scroll').niceScroll({
          cursorcolor: '#888',
          cursorborder: '1px solid #888',
          cursoropacitymin: 0,
          cursoropacitymax: 0.6,
          autohidemode: 'cursor',
          hidecursordelay: 250,
          railpadding: {top: 3, right: 3, bottom: 3, left: 0}
        });
        $('#chatArea').on('scroll', function(e){
          var scrpos = $('#chatArea')[0].scrollTop;
          
          if(SCROLL){
            if(SCROLLTOP < scrpos){
              SCROLLTOP = scrpos;
            } else if(SCROLLTOP >= (scrpos + 100)){
              SCROLL = false;
              $('#IMP_pause').show();
            }
          } else {
            if(scrpos >= ($('#chatArea')[0].scrollHeight - $('#chatArea').height() - 20)){
              SCROLLTOP = scrpos;
              SCROLL = true;
              $('#IMP_pause').hide();
            }
          }
        }).after('<div id="IMP_pause" style="position:absolute;width:399px;text-align:center;background-color:rgba(90, 90, 90, 0.9);top:516px;padding:8px;font-weight:bold;font-size:12px;line-height:12px;display:none;cursor:pointer;">Chat paused</div>');
        $('#tab1').css('position', 'relative');
        $('#IMP_pause').on('click', function(){
          SCROLLTOP = $('#chatArea')[0].scrollTop;
          SCROLL = true;
          $('#IMP_pause').hide();
          $('#chatArea').getNiceScroll(0).doScrollTop($('#chatArea')[0].scrollHeight, 100);
        });
        $('#chatForm .checkbox.pull-right').removeClass('checkbox').html('<a href="#" data-toggle="modal" data-target="#chatRules">Chat Rules</a>');
        $($('#chatForm .pull-left')[1]).remove();
        clearInterval(w84niceScroll);
      }
    }, 100);
  },
  enable_chat_log: function(){
    $('#chatMessage').on('keydown', function(e){
      e.which = e.which || e.keyCode;
      
      var log_length = IMP.msg_log.length || 0;
      
      if(e.which == 38 && IMP.msg_log_curr < log_length){
        IMP.msg_log_curr += 1;
        $(e.target).val(IMP.msg_log[log_length - IMP.msg_log_curr] || '');
      } else if(e.which == 40 && IMP.msg_log_curr > 0){
        IMP.msg_log_curr -= 1;
        $(e.target).val(IMP.msg_log[log_length - IMP.msg_log_curr] || '');
      } else if(e.which == 13){
        IMP.msg_log_curr = 0;
        IMP.msg_log.push($(e.target).val());
      } else if(e.which == 27){
        IMP.msg_log_curr = 0;
        $(e.target).val('');
      }
    });
  },
  enable_bet_log: function(){
    $('#betAmount').on('keydown', function(e){
      e.which = e.which || e.keyCode;
      
      var log_length = IMP.bet_log.length || 0;
      
      if(e.which == 38 && IMP.bet_log_curr < log_length){
        IMP.bet_log_curr += 1;
        $(e.target).val(IMP.bet_log[log_length - IMP.bet_log_curr] || '');
      } else if(e.which == 40 && IMP.bet_log_curr > 0){
        IMP.bet_log_curr -= 1;
        $(e.target).val(IMP.bet_log[log_length - IMP.bet_log_curr] || '');
      } else if(e.which == 13){
        var input = $(e.target).val();
        IMP.bet_log.push(input);
        try {
          $(e.target).val(parseFloat(eval($(e.target).val())) || '');
        } catch(e){}
      } else if(e.which == 27){
        IMP.bet_log_curr = 0;
        $(e.target).val('');
      }
    });
  },
  load_settings: function(){
    $.extend(IMP.settings, JSON.parse(localStorage['settings'] || '{}'));

    $.each(IMP.settings, function(name, value){
      if(value === true) $('#IMP_' + name).find('i.fa').addClass('fa-check').removeClass('fa-times');
      else if(value === false) $('#IMP_' + name).find('i.fa').addClass('fa-times').removeClass('fa-check');
    });
  },
  save_settings: function(){
    localStorage['settings'] = JSON.stringify(IMP.settings);
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
  enable_links: function(msg){
    return msg.replace(/(((http|ftp)s?:\/\/)?(([\w\-]+\.)+([a-z]{2,8})(:\d+)?((\/|\?)[^\s\(\)]+)?))/gi, function(whole, url, protocol, foo, link){
      protocol = protocol || 'http://';
      return '<a href="' + protocol + link + '" target="_blank">' + url + '</a>';
    });
  },
  filter_name: function(name){
    var filtered1 = name.replace(/((TWITCH((\W*|DOT)(TV))?\/?)|((CSGO(DOUBLE|SHUFFLE|SPINS|SPHERE|CYTOSIS|SPEED|ROYALE|RUMBLE|FADE|FIREWHEEL|CLICK|CROWNS)|SKINARENA|KICKBACK)((\W*|DOT|)(COM|NET))?))/gi, ''), filtered2 = '', filtered3 = '';
    if(filtered1.length < 2) return name;
    if(name != filtered1) filtered2 = filtered1.replace(/(^[\W_]+|[\W_]+$)/g, '');
    if(filtered2.length < 2) filtered2 = filtered1;
    filtered3 = filtered2.replace(/[\W_]{3,}/g, ' ');
    if(filtered3.length < 2) filtered3 = filtered2;
    if(name != filtered3 && IMP.settings.console_log) console.log(name, '>>>', filtered3);
    return filtered3;
  },
  highlight: function(e){
    console.log(e);
  }
};

IMP.init();

// Overwriting Original by Foobar
addHist = function(roll, rollid){
  var count = $('#past .ball').length;
  if(count >= 10)  $('#past .ball').first().remove();
  if(roll==0)      $('#past').append('<div data-rollid="' + rollid + '" class="ball ball-0">' + roll + '</div>');
  else if(roll<=7) $('#past').append('<div data-rollid="' + rollid + '" class="ball ball-1">' + roll + '</div>');
  else             $('#past').append('<div data-rollid="' + rollid + '" class="ball ball-8">' + roll + '</div>');
  
  roll = (roll == 0 ? 0 : (roll < 8 ? 1 : 8));  
  if(IMP.last_roll_color == roll){
    IMP.last_roll_color_count++;
  } else {
    IMP.last_roll_color = roll;
    IMP.last_roll_color_count = 1;
  }
}

// Overwriting Original by Foobar
spin = function(m){
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
onMessage = function(msg){
  try {
    var m = JSON.parse(msg.data);
    if(m.type == 'preroll'){
      $('#counter').finish();
      $('#banner').html('Confirming ' + m.totalbets + '/' + (m.totalbets + m.inprog) + ' total bets...');
      $('#panel0-0 .total').countTo(m.sums[0]);
      $('#panel1-7 .total').countTo(m.sums[1]);
      $('#panel8-14 .total').countTo(m.sums[2]);
      try {
        tinysort('#panel1-7 .betlist>li', {data: 'amount', order: 'desc'});
      } catch(e){}
      try {
        tinysort('#panel8-14 .betlist>li', {data: 'amount', order: 'desc'});
      } catch(e){}
      try {
        tinysort('#panel0-0 .betlist>li', {data: 'amount', order: 'desc'});
      } catch(e){}
    } else if(m.type == 'roll'){
      $('.betButton').prop('disabled', true);
      $('#counter').finish();
      $('#banner').html('***ROLLING***');
      ROUND = m.rollid;
      showbets = false;
      spin(m);
    } else if(m.type == 'chat'){
      if(IMP.settings.filter_usernames) m.name = IMP.filter_name(m.name);
      chat('player', m.msg, m.name, m.icon, m.user, m.rank, m.lang);
    } else if(m.type == 'hello'){
      cd(m.count);
      USER = m.user;
      RANK = m.rank;
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
      $('#balance').countTo(m.balance, {'color': true});
      $('.betButton').prop('disabled', false);
      if(!IMP.settings.hide_bet_confirm) chat('alert', 'Bet #' + m.bet.betid + ' confirmed ' + m.mybr + '/' + m.br + ' (' + (m.exec / 1000) + ' sec) ');
      IMP.log_bet(ROUND + 1, m.bet.amount, m.bet.lower, m.bet.upper);
    } else if(m.type == 'error'){
      chat('error', m.error);
      if(m.enable) $('.betButton').prop('disabled', false);
    } else if(m.type == 'alert'){
      chat('alert', m.alert);
      if(m.maxbet) MAX_BET = m.maxbet;
      if(!isNaN(m.balance)){
        console.log('setting balance = %s', m.balance);
        $('#balance').countTo(m.balance, {'color': true});
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
chat = function(x, msg, name, icon, steamid, rank, lang){
  if(lang == LANG || x == 'italic' || x == 'error' || x == 'alert'){
    var ele = document.getElementById('chatArea');
    msg = msg.replace(/(<|>)/g, '');
    msg = IMP.enable_links(msg);
    msg = emotes(msg);
    var toChat = '';
    if(x == 'italic'){
      if(msg == 'Connection lost...' || msg == 'Connection closed.' || msg == 'Error: Connected closed.' || msg == 'Error: Failed to get AT'){
        msg += ' <a href="javascript:connect();">Try to reconnect.</a>';
      }
      toChat = '<div><div><i>' + msg + '</i></div></div>';
    } else if(x == 'error') toChat = '<div><div><b class="text-danger">' + msg + '</b></div></div>';
      else if(x == 'alert') toChat = '<div><div><b class="text-success">' + msg + '</b></div></div>';
      else if(x == 'player'){
      var impclass = '', extname = name;
           if(rank == 100) impclass = 'IMP_rank IMP_chat-mod',      extname = '[Owner] ' + name;
      else if(rank ==   1) impclass = 'IMP_rank IMP_chat-pmod',     extname = '[Mod] ' + name;
      else if(rank ==  -1) impclass = 'IMP_rank IMP_chat-streamer', extname = '[Streamer] ' + name;
      else if(rank ==  -2) impclass = 'IMP_rank IMP_chat-vet',      extname = '[Veteran] ' + name;
      else if(rank ==  -3) impclass = 'IMP_rank IMP_chat-pro',      extname = '[Pro] ' + name;
      else if(rank ==  -4) impclass = 'IMP_rank IMP_chat-yt',       extname = '[Youtuber] ' + name;
      if(IMP.settings.short_ranks) extname = name;
      toChat = '<div><div class="' + impclass + '"><img class="chat-img rounded" data-steamid="' + steamid + '" data-name="' + extname + '" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars' + icon + '"><a class="chat-link" href="http://steamcommunity.com/profiles/' + steamid + '" target="_blank"><b>' + extname + '</b></a>: ' + msg + '</div></div>';
    }

    $CHATAREA.append(toChat);
    
    if(SCROLL){
      if($CHATAREA.hasClass('IMP_scroll')){      
        $CHATAREA.getNiceScroll().resize();
        $CHATAREA.getNiceScroll(0).doScrollTop($CHATAREA[0].scrollHeight, 100);
      } else {
        var curr = $CHATAREA.children().length;
        if(curr > 75) {
          var rem = curr - 75;
          $CHATAREA.children().slice(0, rem).remove();
        }
        $CHATAREA.scrollTop($CHATAREA[0].scrollHeight);
      }
    }
    if(!$('.side-icon[data-tab="1"]').hasClass('active')){
      var curr = parseInt($('#newMsg').html()) || 0;
      $('#newMsg').html(curr + 1);
    }	
  }
}

//Overwriting Original by Foobar
addBet = function(bet){
  var betid = bet.user + '-' + bet.lower;
  var $panel = $('#panel' + bet.lower + '-' + bet.upper);
  $panel.find('#' + betid).remove();
  var f = '<li class="list-group-item" id="{0}" data-amount="{1}">';
  f += '<div style="overflow: hidden;line-height:32px">';
  f += '<div class="pull-left"><a href="http://steamcommunity.com/profiles/{2}" target="_blank"><img class="rounded" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars{3}"></a> <b>{4}</b></div>';
  f += '<div class="amount pull-right">{5}</div>';
  f += '</div></li>';
  var $li = $(f.format(betid, bet.amount, bet.user, bet.icon, bet.name, todongersb(bet.amount)));
  $li.hide().prependTo($panel.find('.betlist')).slideDown('fast', snapRender);
}