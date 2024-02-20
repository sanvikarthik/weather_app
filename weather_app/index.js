const userweather=document.querySelector("[data-userweather]");
const placeweather=document.querySelector("[data-placeweather]");
const grant_location_acess=document.querySelector("[data-grant_location_acess]");
const loader_section=document.querySelector("[data-loader_section]");
const grant_acess_btn=document.querySelector("[data-grant_acess_btn]");
const searchform=document.querySelector("[data-searchform]");
const search_for_city=document.querySelector("[data-search_for_city]");
const details=document.querySelector("[data-details]");

let  current_tab= userweather;
current_tab.classList.add("current-tab");

const API_key= "c936ad292aef37f139685c15ca93e566";
getfromSessionStorage();


function switchtab(clickedTab)
{
    if (clickedTab!=current_tab) 
    {
        current_tab.classList.remove("current-tab");
        current_tab=clickedTab;
        current_tab.classList.add("current-tab");

        if(!searchform.classList.contains("active"))
        {
            details.classList.remove("active");
            grant_location_acess.classList.remove("active");
            searchform.classList.add("active");
            console.log("open search form");
        }
    
        else
        {
        
            searchform.classList.remove("active");
            details.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
userweather.addEventListener("click",()=>
{
    switchtab(userweather);
});
placeweather.addEventListener("click",()=>
{
    switchtab(placeweather);
});
function getfromSessionStorage()
{
    const localcoordiante=sessionStorage.getItem("user-coordinate");
    if(!localcoordiante)
    {
        grant_location_acess.classList.add("active");
        
    }
    else{
        const coordinate=JSON.parse(localcoordiante);
        fetchweatherinfo(coordinate);
    }
}
  async function fetchweatherinfo(coordinate)
 {
    const {lat,lon}=coordinate;
    grant_location_acess.classList.remove("active");
    loader_section.classList.add("active");
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data=await response.json();
        loader_section.classList.remove("active");
        details.classList.add("active");
        console.log("open window");
        renderweatherinfo(data);
    }
    catch(err){
        console.log("wrong api call");
    }
 }
 function float2int (value) {
    return value | 0;
}
 function renderweatherinfo(data)
 {
    const city_name=document.querySelector("[data-city_name]");
    const country_flag=document.querySelector("[data-country_flag]");
    const discription =document.querySelector("[data-discription]");
    const weatherimg=document.querySelector("[data-weatherimg]");
    const temp=document.querySelector("[data-temp]");
    const wind_speed=document.querySelector("[data-wind_speed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloud=document.querySelector("[data-cloud]");


    city_name.innerText=data?.name;
    country_flag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    discription.innerText=data?.weather?.[0]?.description;
    //weather img;
    weatherimg.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    let temperature=`${data?.main?.temp}`;
    console.log(temperature);
    let celicius=float2int(temperature-273)+"°C";
    temp.innerText=celicius;
    wind_speed.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity} %`;
    cloud.innerText=`${data?.clouds?.all} %`;

    
 }
 function getlocation()
 {
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {

    }
 }
 function showPosition(position)
 {
     const usercoordinate={
        lat:position.coords.latitude,
        lon:position.coords.longitude
     }

     sessionStorage.setItem("user-coordinate",JSON.stringify(usercoordinate));
     fetchweatherinfo(usercoordinate);
 }
  grant_acess_btn.addEventListener("click",getlocation);
 
 searchform.addEventListener("submit",(e)=>
 {
    e.preventDefault();
    let cityname= search_for_city.value;
    
    if(cityname===" ")
    {
        return;
    }
    else
    {
        fetchsearchweatherinfo(cityname);
    }
    
 })

 async function  fetchsearchweatherinfo(cityname)
 {
    loader_section.classList.add("active");
    details.classList.remove("active");
    grant_location_acess.classList.remove("active");
    try
    {
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_key}`);
        const result=await res.json();
        loader_section.classList.remove("active");
        details.classList.add("active");
        renderweatherinfo(result);
        
    }
    catch
    {
        console.log("wrong call");
    }
 }

