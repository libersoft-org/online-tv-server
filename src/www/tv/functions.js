const player = new RTMP.Player(document.querySelector('#video'));
player.play('rtmp://' + window.location.host + ':1935/tv');
