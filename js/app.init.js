window.APP = {
	CryptOn: false,
	CryptKey: "123",
	CryptRemoteKey: "123",
	CryptStartSalt: "VKRYPTED",
	run: function() {
		APP.render();
	},
	decrypt: function(message) {
		if (message.indexOf(APP.CryptStartSalt) !== -1) {
			message = message.replace(APP.CryptStartSalt, '');
			var decrypted = CryptoJS.AES.decrypt(message, APP.CryptRemoteKey);
			message = decrypted.toString(CryptoJS.enc.Utf8);
		}
		return message;
	},
	crypt: function(textarea) {
		var text = textarea.innerHTML;

		var encrypted = CryptoJS.AES.encrypt(text, APP.CryptKey);
		var vkrypted = APP.CryptStartSalt + encrypted;
		return vkrypted;
	},
	renderChat: function() {
		var logNode = document.getElementById("im_log" + APP._getChatId());
		var messageTexts = logNode.getElementsByClassName("im_msg_text");

		console.log(messageTexts.length)
		for (var i = 0; i < messageTexts.length; ++i) {
			var item = messageTexts[i];
			item.innerHTML = APP.decrypt(item.innerHTML);
		}
	},
	render: function() {
		APP._renderToggleBtn();
		APP._renderSubmitButton();
		APP.renderChat();
	},
	_renderToggleBtn: function() {
		var toggler = document.createElement("a");

		toggler.id = "crypt-toggler";
		toggler.href = "#";
		toggler.style.padding = "5px 10px";
		toggler.style.border = "1px solid #ddd";
		toggler.style.position = "fixed";
		toggler.style.top = "5%";
		toggler.style.right = "5%";
		toggler.innerHTML = "Crypt";

		toggler.onclick = function() {
			APP.CryptOn = !APP.CryptOn;
			return false;
		};
		document.body.appendChild(toggler);
	},
	_renderSubmitButton: function() {
		var vkBtn = document.getElementById("im_send");
		vkBtn.style.display = "none";

		var btn = document.createElement("button");
		btn.className = "flat_button im_send_cont fl_l";
		btn.innerHTML = "SEND CRYPT";
		btn.onclick = function() {
			var textarea = document.getElementById("im_editable" + APP._getChatId());
			textarea.innerHTML = APP.crypt(textarea);
			APP._eventFire(vkBtn, 'click');
			window.setTimeout(function() {
				APP.renderChat();
			}, 500);
			return false;
		};

		var btnWrap = document.getElementById("im_send_wrap");
		btnWrap.insertBefore(btn, btnWrap.childNodes[0]);
	},
	_eventFire: function(el, etype) {
		if (el.fireEvent) {
			el.fireEvent('on' + etype);
		} else {
			var evObj = document.createEvent('Events');
			evObj.initEvent(etype, true, false);
			el.dispatchEvent(evObj);
		}
	},
	_getChatId: function() {
		var chatSelected = document.querySelector('.im_tab_selected');
		return chatSelected.id.replace('im_tab', '');
	}
};

APP.run();