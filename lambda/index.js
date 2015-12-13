var im = require('imagemagick');
var crypto = require('crypto');
var fs = require('fs');
var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});

var baseImgDir = "img/";
var outputDir = "t/";
var tmpFile = "/tmp/out.png";
var bucketName = "mjimg";
var pai = {
  "T"  : "tsumo.png",
  "oT" : "tsumo.png",
  "R"  : "ron.png",
  "oR" : "ron.png",
  "D"  : "dora.png",
  "oD" : "dora.png",

  "東" : "0j1.png",
  "南" : "0j2.png",
  "西" : "0j3.png",
  "北" : "0j4.png",
  "白" : "0j5.png",
  "発" : "0j6.png",
  "發" : "0j6.png",
  "中" : "0j7.png",
  "-"  : "0j9.png",
  
  "一"  : "0m1.png",
  "二"  : "0m2.png",
  "ニ"  : "0m2.png", // カタカナ
  "三"  : "0m3.png",
  "四"  : "0m4.png",
  "五"  : "0m5.png",
  "r五" : "0me.png",
  "六"  : "0m6.png",
  "七"  : "0m7.png",
  "八"  : "0m8.png",
  "九"  : "0m9.png",
  
  "1p"  : "0p1.png",
  "2p"  : "0p2.png",
  "3p"  : "0p3.png",
  "4p"  : "0p4.png",
  "5p"  : "0p5.png",
  "r5p" : "0pe.png",
  "6p"  : "0p6.png",
  "7p"  : "0p7.png",
  "8p"  : "0p8.png",
  "9p"  : "0p9.png",
  
  "1"  : "0s1.png",
  "2"  : "0s2.png",
  "3"  : "0s3.png",
  "4"  : "0s4.png",
  "5"  : "0s5.png",
  "r5" : "0se.png",
  "6"  : "0s6.png",
  "7"  : "0s7.png",
  "8"  : "0s8.png",
  "9"  : "0s9.png",

  "o東" : "1j1.png",
  "o南" : "1j2.png",
  "o西" : "1j3.png",
  "o北" : "1j4.png",
  "o白" : "1j5.png",
  "o発" : "1j6.png",
  "o發" : "1j6.png",
  "o中" : "1j7.png",
  "o-"  : "1j9.png",

  "o一"  : "1m1.png",
  "o二"  : "1m2.png",
  "oニ"  : "1m2.png", // カタカナ
  "o三"  : "1m3.png",
  "o四"  : "1m4.png",
  "o五"  : "1m5.png",
  "or五" : "1me.png",
  "o六"  : "1m6.png",
  "o七"  : "1m7.png",
  "o八"  : "1m8.png",
  "o九"  : "1m9.png",
  
  "o1p"  : "1p1.png",
  "o2p"  : "1p2.png",
  "o3p"  : "1p3.png",
  "o4p"  : "1p4.png",
  "o5p"  : "1p5.png",
  "or5p" : "1pe.png",
  "o6p"  : "1p6.png",
  "o7p"  : "1p7.png",
  "o8p"  : "1p8.png",
  "o9p"  : "1p9.png",

  "o1"  : "1s1.png",
  "o2"  : "1s2.png",
  "o3"  : "1s3.png",
  "o4"  : "1s4.png",
  "o5"  : "1s5.png",
  "or5" : "1se.png",
  "o6"  : "1s6.png",
  "o7"  : "1s7.png",
  "o8"  : "1s8.png",
  "o9"  : "1s9.png",

  "y東" : "2j1.png",
  "y南" : "2j2.png",
  "y西" : "2j3.png",
  "y北" : "2j4.png",
  "y白" : "2j5.png",
  "y発" : "2j6.png",
  "y發" : "2j6.png",
  "y中" : "2j7.png",
  
  "y一"  : "2m1.png",
  "y二"  : "2m2.png",
  "yニ"  : "2m2.png", // カタカナ
  "y三"  : "2m3.png",
  "y四"  : "2m4.png",
  "y五"  : "2m5.png",
  "yr五" : "2me.png",
  "y六"  : "2m6.png",
  "y七"  : "2m7.png",
  "y八"  : "2m8.png",
  "y九"  : "2m9.png",
  
  "y1p"  : "2p1.png",
  "y2p"  : "2p2.png",
  "y3p"  : "2p3.png",
  "y4p"  : "2p4.png",
  "y5p"  : "2p5.png",
  "yr5p" : "2pe.png",
  "y6p"  : "2p6.png",
  "y7p"  : "2p7.png",
  "y8p"  : "2p8.png",
  "y9p"  : "2p9.png",
  
  "y1"  : "2s1.png",
  "y2"  : "2s2.png",
  "y3"  : "2s3.png",
  "y4"  : "2s4.png",
  "y5"  : "2s5.png",
  "yr5" : "2se.png",
  "y6"  : "2s6.png",
  "y7"  : "2s7.png",
  "y8"  : "2s8.png",
  "y9"  : "2s9.png"
};


var makeImgArray = function(s, oflag) {
  var pflag = false;
  var yflag = false;
  var rflag = false;
  var ary = [];
  for (var i = 0; i < s.length; i++) {
    if (s.charAt(i) == '(' && !pflag) {
      pflag = true;
      continue;
    } else if (s.charAt(i) == ')' && pflag) {
      pflag = false;
      continue;
    } else if (s.charAt(i) == '(' || s.charAt(i) == ')') {
      throw 'BadRequest: カッコに誤りがあります。 "' + s + '"'
    } else if (s.charAt(i) == '_' && !yflag) {
      yflag = true;
      continue;
    } else if (s.charAt(i) == 'r') {
      rflag = true;
      continue;
    }

    var key = s.charAt(i);
    if (pflag) { key = key + 'p' };
    if (rflag) {
      key = 'r' + key;
      rflag = false;
    }
    if (yflag) {
      key = 'y' + key;
    } else if (oflag) {
      key = 'o' + key;
    }

    if (pai[key]) {
      if (yflag) {
        ary.push('(', '-size', '32x8', 'xc:none', baseImgDir + pai[key], '-append', ')');
        yflag = false;
      } else {
        ary.push(baseImgDir + pai[key]);
      }
    } else {
      throw 'BadRequest: ' + s.charAt(i) + ' の付近に誤りがあります。';
    }
  };

  if (pflag) { throw 'BadRequest: カッコが閉じていません。 "' + s + '"' }
  return ary;
}

var buildParams = function(event) {
  var params = [];
  var tehaiAry = event.tehai.split(/\r\n|\r|\n/);
  if (!tehaiAry.join('')) { throw 'BadRequest: 手牌が空文字列です。' }

  var stand = 1;

  if (event.tsumo) {
    tehaiAry.splice(1, 0, 'T' +event.tsumo);
    stand += 1;
  } else if (event.ron) {
    tehaiAry.splice(1, 0, 'R' + event.ron);
  }

  if(event.open) { stand = 0; }

  tehaiAry.forEach(function(t, i) {
    if (t.length > 0) {
      if (i == 1) {
        params.push('-size', '10x36', 'xc:none');
      } else if (i == 2) {
        params.push('-size', '20x36', 'xc:none');
      } else if (i > 0) {
        params.push('-size', '15x36', 'xc:none');
      }
      params = params.concat(makeImgArray(t, i >= stand));
    }
  });

  if (event.dora) {
    params.push('-size', '15x36', 'xc:none');
    params = params.concat(makeImgArray('D' + event.dora, false));
  }

  params.push('+append', tmpFile);
  return params
}

var putImageRequest = function(params, outputFile) {
}

exports.handler = function(event, context) {
  if (event.tehai.length + event.tsumo.length + event.ron.length + event.dora.length > 50)
    { return context.fail('BadRequest: 文字列が長すぎます。'); }

  var shasum = crypto.createHash('sha1');
  shasum.update([event.tehai, event.tsumo, event.ron, event.dora, event.open].join('/'));
  var outputFile = outputDir + shasum.digest('hex') + '.png';

  s3.headObject({
    Bucket: bucketName,
    Key: outputFile
  }).on('success', function(response) {
    console.log("Object Found: " + outputFile);
    return context.succeed({"imgPath" : '/' + outputFile});
  }).on('error', function(response) {
    var params;
    try {
      params = buildParams(event);
    } catch (e) {
      return context.fail(e);
    }
    console.log(params.join(' '));
    im.convert(params, function(err, output){
      var buffer = new Buffer(fs.readFileSync(tmpFile));
      s3.putObject({
        Bucket: bucketName,
        Key: outputFile,
        Body: buffer,
        ContentType: 'image/png'
      }).on('success', function(response) {
        console.log("PutObject: " + outputFile);
        return context.succeed({"imgPath" : '/' + outputFile});
      }).on('error', function(response) {
        return context.fail("Failed to put object to S3");
      }).send();
    });
  }).send();
};
