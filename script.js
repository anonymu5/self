const inputslider=document.querySelector("[data-lengthslider]");
const lengthdisplay=document.querySelector("[data-lengthNumber]");
const passworddisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");
const copymsg=document.querySelector("[data-copymsg]");
const uppercasescheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numbercheck=document.querySelector("#numbers");
const symbolscheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generatebtn=document.querySelector(".generatebutton");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-+=:;"<,>.?/';
let password="";
let passwordlength=10;
let checkcount=0;
handleslider();
setindicator("#ccc")
//set stength circle color to grey
function handleslider(){
    inputslider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize = ((passwordlength - min) * 100 / (max - min)) + "% 100%";
}
function setindicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getrandinterger(min,max){
   return Math.floor(Math.random()*(max-min))+min;
}
function generaterandom(){
    return getrandinterger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getrandinterger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getrandinterger(65,91));
}
function generatesymbol(){
    const randnum=getrandinterger(0,symbols.length);
    return symbols.charAt(randnum);
}
function calcstrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassym=false;
    if(uppercasescheck.checked) hasupper=true;
    if(lowercasecheck.checked) haslower=true;
    if(numbercheck.checked) hasnum=true;
    if(symbolscheck.checked) hassym=true;
    if(hasupper && haslower && (hasnum || hassym)&& passwordlength>=8){
        setindicator("#0f0")
    }
    else if((hasupper || haslower) && (hasnum || hassym)&& passwordlength>=6){
        setindicator("#ff0")
    }
    else{
        setindicator("#f00")
    }
}  
async function copycontent(){
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText="copied";
    }
    catch(e){
      copymsg.innerText="failed";
    }
    copymsg.classList.add("active");
    setTimeout(() => {
        copymsg.classList.remove("active")
    }, 2000);
}
inputslider.addEventListener('input',function(e){
    passwordlength=e.target.value;
    handleslider();
});
copybtn.addEventListener('click',function(){
    if(passworddisplay.value){
        copycontent();
    }
});
function shufflepassword(array){
    //Fisher Yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}
function handlechekbox(){
    checkcount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkcount++;
    });
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleslider();
    }
}
allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handlechekbox);
})
generatebtn.addEventListener('click',()=>{
     if(checkcount===0){
        return;
     }
     if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleslider();
     }
     password="";
     let funcArr=[];
     if(uppercasescheck.checked)
        funcArr.push(generateUppercase);
     if(lowercasecheck.checked)
        funcArr.push(generateLowercase);
     if(numbercheck.checked)
        funcArr.push(generaterandom);
     if(symbolscheck.checked)
        funcArr.push(generatesymbol);
    
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    for(let i=0;i<passwordlength-funcArr.length;i++){
        let randindex=getrandinterger(0,funcArr.length);
         password+=funcArr[randindex]();
    }
    //shuffle password
    password=shufflepassword(Array.from(password));
    passworddisplay.value=password;
    calcstrength();
});