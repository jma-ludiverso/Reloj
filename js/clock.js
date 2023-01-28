var focused = false;
var drag = false;
var dragHand = "";

function digitalText(txt){
    var result = "";
    var part = 0;
    var num = $( "#txtDigital" ).val().split(":");
    for(var i=0;i<=num.length-1;i++){
        if(num[i]!=""){
            part += 1;
            result += TextPart(part,num[i]);
            if(part==3){
                break;
            }
        }
    }
    if(part<3){
        for(var i=part+1;i<=3;i++){
            part += 1;
            result += TextPart(part,"00");
        }
    }
    return result;
}

function handDown(hand){
    focused = true;
    draghand = hand;
    drag = true;
    $("#hourSelection").prop("checked", false);
}

function handUp(){
    focused = false;
    drag = false;
    setTimeout(showTime, 1000);
}

function setDraggedHour(angle){
    var decHour = (angle * 12) / 360;
    var hour = Math.trunc(decHour).toString();
    var minute = Math.trunc((decHour % 1) * 60).toString();
    hour = (hour < 10) ? "0" + hour : hour;
    minute = (minute < 10) ? "0" + minute : minute;
    $( "#txtDigital" ).val(hour + ":" + minute + ":00");
    const minsHand = document.querySelector('.min-hand');
    minsHand.style.transform = `rotate(${(Math.trunc((decHour % 1) * 360) + 90)}deg)`;
}

function setDraggedMin(angle){
    var decHour = (angle * 60) / 360;
    var minute = Math.trunc(decHour).toString();
    minute = (minute < 10) ? "0" + minute : minute;
    var num = $( "#txtDigital" ).val().split(":");
    $( "#txtDigital" ).val(num[0] + ":" + minute + ":00");
}

function setHourMinuteHand(relativeX, relativeY, minutehand){
    var x1 = ($( "#analog" ).width() / 2) - relativeX;
    var y1 = ($( "#analog" ).height() / 2) - relativeY;
    var tan = Math.atan(y1 / x1);
    tan = tan * (180 / Math.PI);
    var angle = 0;
    if(x1>0 && y1>=0){
      angle = 360 + Math.abs(tan);
    }else{
      if(x1>0 && y1<0){
        angle = 360 + tan;
      }else{
        angle = 180 + tan;
      }
    }
    if(!minutehand){
        const hourHand = document.querySelector('.hour-hand');
        hourHand.style.transform = `rotate(${angle}deg)`;
        setDraggedHour(angle - 90);
    }else{
        const minsHand = document.querySelector('.min-hand');
        minsHand.style.transform = `rotate(${angle}deg)`;
        setDraggedMin(angle - 90);
    }
}

function showTime(){

    if(focused){
        return;
    }

    var date = new Date();
    if(!$("#hourSelection").is(':checked')){
        var date = new Date("2023/01/01 " + $( "#txtDigital" ).val());
        date.setSeconds(date.getSeconds() + 1);
    }
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    var time = h + ":" + m + ":" + s;

    $( "#txtDigital" ).val(time);

    
    const minsHand = document.querySelector('.min-hand');
    const secondHand = document.querySelector('.second-hand');
 
    const minsDegrees = ((m / 60) * 360) + ((s/60)*6) + 90;
    const secondsDegrees = ((s / 60) * 360) + 90;
    
    showTime_Hour(h, m);
    minsHand.style.transform = `rotate(${minsDegrees}deg)`;
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
    
    setTimeout(showTime, 1000);
    
}

function showTime_Hour(h, m){
    const hourHand = document.querySelector('.hour-hand');
    const hourDegrees = ((h / 12) * 360) + ((m/60)*30) + 90;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;
}

function TextPart(part,txt){
    if(txt.length==1){
        txt = "0" + txt;
    }else{
        txt = txt.substring(0,2);
        var check = parseInt(txt);
        if(part==1){
            if(check>23){
                txt = "00";
            }
        }else{
            if(check>59){
                txt = "00";
            }
        }
    }
    if(part<3){
        txt = txt + ":";
    }
    return txt;
}