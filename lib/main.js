(function(window){

function getSlackDataPusher() {

let defaultFields = [{
  type:'text',
  name:'Name',
  id:'_name',
  placeholder:'Enter Your Name',
  regex:null
},
{
  type:'text',
  name:'Contact Number',
  id:'_contact',
  placeholder:'Enter Your Contact Number',
  regex:null
},
{
  type:'textarea',
  name:'Message',
  id:'_message',
  placeholder:'Message',
  regex:null
}

]
let adding = false;

let formElements = [];

let _slackDataPusher = {};

let btnStyle=`background-color: #4CAF50;
            border:none;
            border-radius: 4px;
            color: white;
            padding: 8px 12px 8px 12px;
            width:'100%';
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;`;

let containerStyle=`display: flex; flex-direction: column;`

let inputStyle = `width: 100%;
padding: 12px 20px;
margin: 8px 0;
display: inline-block;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;`;

let responseStyle = `text-align: center;
padding: 12px;
font-size: 12px;
color: green;`


const submitData = function(url,containerId) {
  let senData = {};
  for(let i=0;i<formElements.length;i++) {
      senData[formElements[i].name]=document.getElementById(formElements[i].id).value;
  }
  if(adding) {
      return
  }


  adding = true

  let btn = document.getElementById('__slack_submitbtn')
  if(btn) {
    btn.setAttribute('disabled',true)
  }

  let sendDataString = '';
  
  Object.keys(senData).forEach((key)=> {
      sendDataString=sendDataString+"*"+key+"*: "+senData[key]+"\n"

  })

  fetch(url,
      {
          method:"POST",
          body:JSON.stringify({text:sendDataString})
      }
      ).then(()=> {

          adding = false;
          if(btn) {
              btn.setAttribute('disabled',false)
          }

          for(let i=0;i<formElements.length;i++) {
              document.getElementById(formElements[i].id).value='';
            }


          let container = document.getElementById(containerId)
          if(container) {

              let div = document.createElement('div')
              div.innerHTML=`Thanks for submitting the response`;
              div.setAttribute('style',responseStyle)
              container.append(div);

          }


      }).catch((error)=>{
          console.error(error)
          adding = false
          if(btn) {
    btn.setAttribute('disabled',false)
  }
      })
          
}

const renderForm = function (containerId,slack_webhook_url) {

  let container = document.getElementById(containerId);
  if(!container) {
      return
  }


  let formContainer = document.createElement('div');

  for(let i=0 ; i<defaultFields.length ; i++ ) {

      const type = defaultFields[i].type;
      const id = defaultFields[i].id;
      const placeholder = defaultFields[i].placeholder;
       
      if(type && type ==='text') {
          let input = document.createElement("input");
          input.setAttribute("type", type);
          input.setAttribute("id", id);
          input.setAttribute("placeholder", placeholder);
          input.setAttribute('style',inputStyle)

          formElements.push(defaultFields[i])
          formContainer.append(input);
      } else if (type && type ==='textarea') {
          let input = document.createElement("textarea");
          input.setAttribute("id", id);
          input.setAttribute("placeholder", placeholder);
          input.setAttribute('style',inputStyle)
          formElements.push(defaultFields[i])
          formContainer.append(input);
      }


  }



  let submitButton = document.createElement('button');
  submitButton.innerHTML = 'Submit';
  submitButton.setAttribute('id','__slack_submitbtn')
  submitButton.addEventListener('click',function(){
    submitData(slack_webhook_url,containerId)
  });


  

  submitButton.setAttribute('style',btnStyle)
  formContainer.setAttribute('style',containerStyle)

  formContainer.append(submitButton)

  container.append(formContainer)



}


_slackDataPusher.init = function (slack_webhook_url,containerId,customFields) {

  if(!slack_webhook_url || !containerId) {
      console.error('Please provide slack_webhook_url and containerId')
      return;
  }
  if(customFields && Array.isArray(customFields) && customFields.length) {
      defaultFields = customFields
  }

  renderForm(containerId,slack_webhook_url)







}

return _slackDataPusher;



}


if(typeof window.slackDataPusher === 'undefined') {
window.slackDataPusher = getSlackDataPusher();
}

})(window)
