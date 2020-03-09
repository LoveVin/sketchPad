/*本地存储*/
let stor = JSON.parse(localStorage.getItem('colorHashMap'))
let storColor = JSON.parse(localStorage.getItem('currentColor'))
let currentColor
let colorHashMap
if(stor){
    colorHashMap = stor
}
else{
    colorHashMap = []
}
if(storColor){
    currentColor = storColor
}
else{
    currentColor = '#000000'
}

/*本地读取*/
document.querySelectorAll('.paintTools .palette > div').forEach((element, index)=>{
    if(index < colorHashMap.length){
        element.style.backgroundColor = colorHashMap[index]
        element.dataset.color = colorHashMap[index]
    }
})

/*Canvas相关*/
let canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineCap = "round"
let IsPoint = false
let last;
let isTouchDevice = 'ontouchstart' in document.documentElement;
let isPaint = true;
let currentWidth = 2
document.querySelector('#colorSelector').value = currentColor
function drawline(x1, y1, x2, y2)
{
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
if(isTouchDevice)
{
    canvas.ontouchstart = (e) =>{
        e.preventDefault()
        last = [e.touches[0].clientX, e.touches[0].clientY];
    }
    canvas.ontouchmove = (e) =>{
        e.preventDefault()
        drawline(last[0],last[1],e.touches[0].clientX,e.touches[0].clientY);
        last = [e.touches[0].clientX, e.touches[0].clientY];
    }
}
else
{
    if(canvas.getContext)
    {
        console.log("该设备支持canvas画板")
        canvas.onmousedown = (e) =>{
        IsPoint = true;
        last = [e.clientX, e.clientY];
        };
        canvas.onmousemove = (e) => {
        if(IsPoint === true)
        {
            drawline(last[0],last[1],e.clientX,e.clientY)
            last = [e.clientX, e.clientY];
        }
        };
        canvas.onmouseup = () =>{
        IsPoint = false;
        }
    }
    else
    {
        console.log("该设备不支持canvas画板")
    }
}

/*页面元素*/
let currentIndex = (colorHashMap.length+1) || 1;
colorSelector.onchange = (e)=>{
    let element = document.querySelector(`.palette div:nth-child(${currentIndex})`)
    element.style.backgroundColor = e.target.value
    element.dataset.color = e.target.value
    currentIndex = (currentIndex % 15) + 1
    currentColor = e.target.value
    colorHashMap.push(e.target.value)
}
document.querySelectorAll('.paintTools .palette > div').forEach((element,index)=>{
    element.dataset.index = index + 1
    element.onclick = (e)=>{
        if(e.target.style.backgroundColor && isPaint){
            currentColor = e.target.dataset.color
            document.querySelector('#colorSelector').value = currentColor
        }
    }
})
document.querySelector('.paintWidth .widthSelector').onclick = function(){
    this.nextElementSibling.classList.toggle('hidden')
}
document.querySelector('.icon-erase').onclick = function(){
    this.previousElementSibling.classList.remove('selected')
    this.classList.add('selected')
    currentColor = '#ffffff'
    isPaint = false
}
document.querySelector('.icon-pen').onclick = function(){
    this.nextElementSibling.classList.remove('selected')
    this.classList.add('selected')
    isPaint = true
    currentColor = document.querySelector('#colorSelector').value
}
document.querySelectorAll('.lineSelector > div').forEach((el)=>{
    el.onclick = function(){
        let siblings = this.parentNode.children
        for(let i = 0; i < siblings.length; i++){
            if(siblings[i] !== this){
                siblings[i].classList.remove('selected')
            }
        }
        this.classList.add('selected')
        currentWidth = parseInt(this.dataset.line)
        document.querySelector('.paintWidth .lineSelector').classList.add('hidden')
    }
})
document.querySelector('.finishOrclear .icon-clear').onclick = function(){
   ctx.clearRect(0,0,canvas.width,canvas.height);
}
document.querySelector('.finishOrclear .icon-download').onclick = function(){
    var url = canvas.toDataURL('image/png');
    //JavaScript初始化下载方法
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'sketchPad.png';
    //执行下载
    a.click();
    document.body.removeChild(a)
}

/*离开页面前存储数据*/
window.onbeforeunload = ()=>{
    const hashString1 = JSON.stringify(colorHashMap);
    localStorage.setItem('colorHashMap',hashString1);
    if(!isPaint){
        currentColor = document.querySelector('#colorSelector').value
    }
    const hashString2 = JSON.stringify(currentColor);
    localStorage.setItem('currentColor',hashString2)
}