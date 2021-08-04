$("#decrypt_form").hide();
//$("#encrypt_tab").addClass('active');

$("#encrypt_tab").click(function () {
    $("#decrypt_tab").removeClass('active');
    $("#encrypt_tab").addClass('active');

    $("#decrypt_form").hide();
    $("#encrypt_form").show();
});
$("#decrypt_tab").click(function () {
    $("#encrypt_tab").removeClass('active');
    $("#decrypt_tab").addClass('active');

    $("#encrypt_form").hide();
    $("#decrypt_form").show();
});

//https://stackoverflow.com/a/7377447
function autogrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

//mon priv key
var priv = document.getElementById("priv");
//console.log(priv);//test
if (priv) {
    priv.addEventListener("change", set_priv_key, false);
}
//https://stackoverflow.com/a/4950836
function set_priv_key(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        //console.log(event.target.result);//test
        //document.getElementById("receiver_privkey").value = event.target.result;
        document.getElementById("receiver_privkey").innerText = event.target.result;
    }
    reader.readAsText(file);
}

var priv = document.getElementById("priv");
//console.log(priv);//test
if (priv) {
    priv.addEventListener("change", set_priv_key, false);
}

function encrypt_message() {
    //console.log(receiver_pubkey);//test

    //aes
    //https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
    var array = new Uint8Array(32);
    window.crypto.getRandomValues(array);

    //var temp = 0;
    var key = [];
    for (var i = 0; i < 32; i++) {
        key[i] = array[i];
    }

    var plain_text = $('#input_text').val();//unlock for Lite version
    var textBytes = aesjs.utils.utf8.toBytes(plain_text);
    //console.log(textBytes);

    // Counter 可省略，若省略則從 1 開始
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    //console.log(encryptedBytes);//test

    // 加密過後的資料是二進位資料，若要輸出可轉為十六進位格式
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    //console.log(encryptedHex);//test



    //rsa
    // Encrypt with the receiver public key...
    var encrypt = new JSEncrypt();

    //new for Lite version
    var receiver_pubkey = '';
    $.get($('#receiver_public_key_source').val(), function (data, status) {
        receiver_pubkey = data;
        //console.log(receiver_pubkey);//test

        //console.log($('.receiver_pubkey').text());//test
        //encrypt.setPublicKey($('.receiver_pubkey').text());
        //console.log(receiver_pubkey);//test
        //encrypt.setPublicKey(receiver_pubkey[count].dataset.public_key);
        encrypt.setPublicKey((receiver_pubkey));
        //console.log(encodeURIComponent(key));//test
        var encrypted = encrypt.encrypt(encodeURIComponent(key));
        //console.log(encrypted);//test

        //edited for Lite version
        var output_json = {};
        output_json['encrypted_aes_key'] = encrypted;
        output_json['encrypted_message'] = encryptedHex;
        $('#output_text').val(JSON.stringify(output_json));
        //return [encrypted, encryptedHex];
    });


}
function decrypt_message() {

    var receiver_privkey = $('#receiver_privkey').text();//new for Lite version
    //console.log(receiver_privkey);//test

    // Decrypt with the receiver private key...
    var decrypt = new JSEncrypt();
    decrypt.setPrivateKey(receiver_privkey);
    var decrypted = [];


    //new for Lite version
    var input_text = $('#input_text').val();
    var encrypted_message = JSON.parse(input_text)['encrypted_message'];

    //console.log(encrypted_message[count_message]);//test
    //console.log(encrypted_message.length);//test
    //console.log(encrypted_message);//test

    var key = new Array(encrypted_message.length);
    for (var i = 0; i < key.length; i++) {
        key[i] = new Uint8Array(32);
        //console.log('i: '+i);//test
    }
    //set array
    /*var encryptedBytes = [];
    var aesCtr = [];
    var decryptedBytes = [];
    var decryptedText = [];*/


    var encrypted_symmetric_key = JSON.parse(input_text)['encrypted_aes_key'];//new for Lite version

    //console.log(decodeURIComponent(encrypted_message[count_message].dataset.encrypted_symmetric_key));//test
    //console.log(decodeURIComponent(encrypted_symmetric_key));//test
    decrypted = decrypt.decrypt(decodeURIComponent(encrypted_symmetric_key));
    //console.log(decodeURIComponent(decrypted));//test

    for (var j = 0; j < 32; j++) {
        //console.log(decodeURIComponent(decrypted).split(',')[j]);//test
        key[j] = parseInt(decodeURIComponent(decrypted).split(',')[j]);
    }

    // 將十六進位的資料轉回二進位
    //encryptedBytes = aesjs.utils.hex.toBytes(encrypted_message);
    //console.log(encrypted_message.dataset.encrypted_message);//test
    //encryptedBytes = aesjs.utils.hex.toBytes(encrypted_message.dataset.encrypted_message);
    //console.log(encrypted_message.encrypted_message);//test
    console.log(encrypted_message);//test
    encryptedBytes = aesjs.utils.hex.toBytes(encrypted_message);//.encrypted_message
    // 解密時要建立另一個 Counter 實體
    aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    decryptedBytes = aesCtr.decrypt(encryptedBytes);
    console.log(decryptedBytes);//test

    // 將二進位資料轉換回文字
    decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    console.log(decryptedText);//test


    //edited for Lite version
    $('#output_text').val(decryptedText);
    //return decryptedText;
}