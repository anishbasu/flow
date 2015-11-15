
     
                var channel = new DataChannel(); // DataChannel.js
                
                channel.firebase = 'sweltering-fire-6003';

                // "ondatachannel" is fired for each new data channel
                channel.ondatachannel = function(channel00) {
                    var alreadyExist = document.getElementById(channel00.id);
                    if (alreadyExist) return;

                    var tr = document.createElement('tr');
                    tr.setAttribute('id', channel00.owner);
                    tr.innerHTML = '<td>' + channel00.id + '</td>' +
                        '<td><button class="join" id="' + channel00.id + '">Join</button></td>';

                    channelsList.insertBefore(tr, channelsList.firstChild);

                    // when someone clicks table-row; joining the relevant data channel
                    tr.onclick = function() {

                        // manually joining a data channel
                        channel.join({
                            id: this.querySelector('.join').id,
                            owner: this.id
                        });

                        channelsList.style.display = 'none';
                    };
                };

                // a text message or data
                channel.onmessage = function(data, userid, latency) {
                    appendDIV(data);

                    console.debug(userid, 'posted', data);
                    console.log('latency:', latency, 'ms');
                };

                // on data connection gets open
                channel.onopen = function() {
                    if (document.getElementById('chat-input')) document.getElementById('chat-input').disabled = false;
                    if (document.getElementById('open-channel')) document.getElementById('open-channel').disabled = true;
                };

                var chatOutput = document.getElementById('chat-output');
                function appendDIV(data, parent) {
                    var div = document.createElement('div');
                    div.innerHTML = data;

                    //chatOutput.insertBefore(div, chatOutput.firstChild);
                    chatOutput.innerHTML = chatOutput.innerHTML+"<div>"+data+"</div>"

                    div.tabIndex = 0;
                    div.focus();

                    chatInput.focus();
                }

                var chatInput = document.getElementById('chat-input');
                chatInput.onkeypress = function(e) {
                    if (e.keyCode !== 13 || !this.value) return;
                    appendDIV("Me: "+this.value);

                    // sending text message
                    channel.send("<i>"+channel.userid+": </i>"+this.value);

                    this.value = '';
                    this.focus();
                };

                // users presence detection
                channel.onleave = function(userid) {
                    var message = 'A user whose id is ' + userid + ' left!';
                    appendDIV(message);
                    console.warn(message);
                };

                var channelsList = document.getElementById('channels-list');

                document.getElementById('open-channel').onclick = function() {
                    this.disabled = true;

                    channel.open();
                };

                // searching for existing channels
                channel.connect();
