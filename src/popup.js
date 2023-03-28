import { api_key } from './credentials.js';

async function query_chatgpt(messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api_key}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messages
          })});

  return response.json();
}

function gettext() {
  return  getSelection().toString();
}

async function extract_selected_text() {

  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  let result;
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target : {tabId: tab.id},
      func : gettext
    });
  } catch (e) {
    alert("Failed when extracting selected text");
    return None; // ignoring an unsupported page like chrome://extensions
  }
  return result;
}



window.onload = async () => {

  const selected_text = await extract_selected_text();

  console.log("selected text: " + selected_text);

  const initial_prompt = `Summarize this text into less than 5 most important premises with the credibility of each premise in [strong, moderate, weak], and the conclusion. Assess if the argument is sound and valid, and provide less than 5 urls that is related to the topic. Do not make up the urls. Output with json in the following format: 
 {"premises" : [{"id": int, "text": str, "credibility": int}], 
  "conclusion": str, "assessment": str, 
  "related_resources": [{"title": str, "url": str}]}
The json objects need to be parsable and no "," following the last item.
Return {"not_applicable_reason": str} if the text is not suitable for analysis:  
${selected_text}`;
  

  const init_messages = [
    {"role": "system", "content": "Act as a critical reader"},
    {"role": "user", "content": initial_prompt}
  ];

  let extracted_para = document.createElement("p");
  extracted_para.innerHTML = "Extracted text: <br>" + selected_text
  document.body.appendChild(extracted_para);


  var loading_div = document.createElement('div');
  loading_div.innerHTML = "<h2>ChatGPT is analyzing the argument....</h2>";
  document.body.appendChild(loading_div);

  let msg, chatgpt_payload;
  try {
    const data = await query_chatgpt(init_messages);
    console.log("ChatGPT respone: " + JSON.stringify(data));
    msg = data["choices"][0]["message"];
    chatgpt_payload = JSON.parse(msg["content"]);
  } catch (e) {
    alert("Sorry, something is wrong when getting response from ChatGPT");
    return;
  }

  console.log("ChatGPT payload: " + JSON.stringify(chatgpt_payload));

  document.body.removeChild(loading_div);


  if ("not_applicable_reason" in chatgpt_payload) {
    let para = document.createElement("p");
    para.innerText = chatgpt_payload["not_applicable_reason"]
    document.body.appendChild(para);
  } else {
    sessionStorage.setItem('conversations', JSON.stringify(init_messages.concat([msg])));
    
    let premises_div = document.createElement('div');
    premises_div.innerHTML = "<h2>Premises and credibility:</h2>";
    premises_div.appendChild(generate_premises_table(chatgpt_payload["premises"]));
    document.body.appendChild(premises_div);


    let conclusion_div = document.createElement('div');
    conclusion_div.innerHTML = "<h2>Conclusion:</h2>";
    let conclusion_a = document.createElement("a");
    conclusion_a.href="#";
    conclusion_a.innerHTML = "<h3>" + chatgpt_payload["conclusion"] + "</h3>";
    conclusion_a.addEventListener('click', function(){
      elaborate("Elaborate on the conclusion.");
    });
    conclusion_div.appendChild(conclusion_a);
    document.body.appendChild(conclusion_div);


    let assessment_div = document.createElement('div');
    assessment_div.innerHTML = "<h2>ChatGPT's Assessment:</h2>";
    let assessment_a = document.createElement("a");
    assessment_a.href="#";
    assessment_a.innerHTML = "<h3>" + chatgpt_payload["assessment"] + "</h3>";
    assessment_a.addEventListener('click', function(){
      elaborate("How did you make the assessment?");
    });
    assessment_div.appendChild(assessment_a);
    document.body.appendChild(assessment_div);

    let related_resources_div = document.createElement('div');
    related_resources_div.innerHTML = "<h2>ChatGPT's suggested related resources:</h2>";
    related_resources_div.appendChild(generate_related_resources_table(chatgpt_payload["related_resources"]));
    document.body.appendChild(related_resources_div);


    let defense_div = document.createElement('div');
    defense_div.innerHTML = "<h2>Give ChatGPT a chance</h2>";
    
    let defense_area = document.createElement('textarea');
    defense_area.innerText = "Not convinced? Click on the premises, conclusion, credibility, assessment to hear ChatGPT's defense";
    defense_area.rows=20;
    defense_area.cols=80;
    defense_area.id = "defense_area";
    defense_div.appendChild(defense_area);
    document.body.appendChild(defense_div);
  }

};


async function elaborate(question){
  let conversations = JSON.parse(sessionStorage.getItem('conversations'));
  console.log("Previous conversations: " + conversations);
  conversations.push({"role": "user", "content": question});
  let defense_area = document.getElementById('defense_area');
  defense_area.innerText = "ChatGPT is thinking about how to respond...";
  let chatgpt_text;
  try {
    const data = await query_chatgpt(conversations);
    console.log("elaborate response: " + JSON.stringify(data));
    const msg = data["choices"][0]["message"];
    chatgpt_text = msg["content"];
  } catch (e) {
    alert("Sorry, something is wrong when getting response from ChatGPT");
    return;
  }


  defense_area.innerText = chatgpt_text;
}

function generate_premises_table(premises) {
   
   let table = document.createElement("table");

   // Loop through the JSON data and create table rows
   premises.forEach((item) => {
      let tr = document.createElement("tr");
      const premise_id = item["id"];
        let td = document.createElement("td");
        td.innerText = premise_id.toString() + ".";
      
      tr.appendChild(td);
      
      const keys = ["text", "credibility"]

      keys.forEach((key) => {
         let td = document.createElement("td");
         let inner_a = document.createElement("a");
         inner_a.href="#";
         inner_a.innerText = item[key];

         const elaborate_click_func = {
            "text": function() { elaborate(`elaborate premise id ${premise_id}`);},
            "credibility": function() { elaborate(`elaborate the credibility of premise id ${premise_id}`);}
          };

         inner_a.addEventListener('click', elaborate_click_func[key]);
         td.appendChild(inner_a)
         
         tr.appendChild(td);
      });

      table.appendChild(tr);
   });
   return table;
}


function generate_related_resources_table(resources) {
   

   // Create the table element
   let table = document.createElement("table");

   // Loop through the JSON data and create table rows
   resources.forEach((item) => {
      let tr = document.createElement("tr");
      
      let td = document.createElement("td");
      let innera = document.createElement("a");
      innera.href=item["url"];
      innera.target="_blank";
      innera.innerText = item["title"];
         
      td.appendChild(innera)
      tr.appendChild(td);
      
      table.appendChild(tr);
   });

   return table
}

