auto.waitFor();
var appName = "手机淘宝";

var deviceWidth = device.width;
var deviceHeight = device.height;
setScreenMetrics(deviceWidth, deviceHeight);

launchApp(appName);
sleep(3000);

function clickGoTrain() {
  var entryPosition = className("android.widget.FrameLayout")
    .indexInParent(6)
    .depth(12)
    .drawingOrder(7)
    .findOnce()
    .bounds();
  try {
    click(entryPosition.centerX(), entryPosition.centerY());
    className("android.widget.Button").text("做任务，领喵币").findOne().click();
    return true;
  } catch (e) {
    return false;
  }
}

if (clickGoTrain()) {
  className("android.view.View").textContains("邀请好友一起玩").waitFor();
  executeTask();
} else {
  toast("未找到入口");
}

function executeTask() {
  while (true) {
    var target =
      text("签到").findOne(1000) ||
      text("去浏览").findOne(1000) ||
      text("去围观").findOne(1000) ||
      text("去逛逛").findOne(1000);
    if (!target) {
      toast("任务完成");
      back();
      sleep(1500);
      break;
    }
    target.click();
    if (target.text() === "签到") {
      sleep(1000);
      continue;
    } else {
      sleep(3000);
      var flag = viewShop(20);
      if (!flag) {
        if (closeTaskTab()) {
          className("android.widget.Button")
            .text("做任务，领喵币")
            .findOne()
            .click();
          className("android.view.View")
            .textContains("邀请好友一起玩")
            .waitFor();
        }
      }
    }
    sleep(1000);
  }
}

function closeTaskTab() {
  var closeBtn = className("android.widget.Button").text("关闭").findOnce();
  if (closeBtn) {
    closeBtn.click();
    sleep(2000);
    return true;
  } else {
    return false;
  }
}

function viewShop(time) {
  gesture(1000, [300, 800], [300, 300]);
  var timeCnt = 1;
  while (true) {
    var isFinish =
      className("android.view.View").descContains("任务已完成").exists() ||
      className("android.view.View").descContains("任务完成").exists() ||
      className("android.view.View").textContains("任务已完成").exists();
    var isFail =
      text("领取失败").exists() ||
      textContains("今日已达上限").exists() ||
      descContains("今日已达上限").exists();
    if (isFail) {
      back();
      sleep(1000);
      return false;
    }
    if (isFinish && timeCnt <= 7) {
      back();
      sleep(1000);
      return false;
    }
    if (isFinish || timeCnt > time) {
      back();
      sleep(1000);
      return true;
    }
    sleep(1000);
    timeCnt++;
  }
}
